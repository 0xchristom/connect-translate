/**
 * Mikrofon + prosty detektor mowy (VAD). Dźwięk zbieramy w natywnej częstotliwości
 * (Firefox nie łączy mikrofonu z AudioContext o innym sampleRate), a gotową wypowiedź
 * przepróbkowujemy do 16 kHz, których oczekuje Whisper.
 */

const TARGET_RATE = 16000;
const FRAME_MS = 30;
const PRE_ROLL_MS = 300;
const HANG_MS = 700;
const MIN_SPEECH_MS = 350;
const MAX_UTTERANCE_MS = 8000;

export type MicEvents = {
  onLevel: (level: number, speaking: boolean) => void;
  onUtterance: (audio: Float32Array) => void;
};

export type MicHandle = {
  stop: () => void;
  /** Wycisza detektor, np. gdy aplikacja sama odtwarza tajskie nagranie. */
  setMuted: (muted: boolean) => void;
};

const WORKLET = `
class Tap extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel) this.port.postMessage(channel.slice(0));
    return true;
  }
}
registerProcessor("powiedz-tap", Tap);
`;

function resample(input: Float32Array, from: number) {
  if (from === TARGET_RATE) return input;
  const ratio = from / TARGET_RATE;
  const out = new Float32Array(Math.floor(input.length / ratio));
  for (let i = 0; i < out.length; i++) {
    // Średnia z okna zamiast pojedynczej próbki — tani filtr antyaliasingowy.
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += input[j];
    out[i] = end > start ? sum / (end - start) : 0;
  }
  return out;
}

function concat(chunks: Float32Array[]) {
  const size = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const out = new Float32Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export async function startMic(events: MicEvents): Promise<MicHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
    },
  });
  const context = new AudioContext();
  if (context.state === "suspended") await context.resume();
  const source = context.createMediaStreamSource(stream);
  const rate = context.sampleRate;
  const frameSize = Math.round((rate * FRAME_MS) / 1000);

  let muted = false;
  let pending = new Float32Array(0);
  const preRoll: Float32Array[] = [];
  const speech: Float32Array[] = [];
  let speaking = false;
  let voicedMs = 0;
  let silentMs = 0;
  let noise = 0.004;
  let startRun = 0;

  function frame(samples: Float32Array) {
    let energy = 0;
    for (let i = 0; i < samples.length; i++) energy += samples[i] * samples[i];
    const rms = Math.sqrt(energy / samples.length);
    // Próg idzie za szumem tła: w hałaśliwej knajpie rośnie, w pokoju spada.
    const threshold = Math.max(0.012, noise * 3);
    const loud = !muted && rms > threshold;
    events.onLevel(Math.min(1, rms / (threshold * 2.5)), speaking);

    if (!speaking) {
      if (!loud) noise = noise * 0.95 + rms * 0.05;
      preRoll.push(samples);
      while (preRoll.length * FRAME_MS > PRE_ROLL_MS) preRoll.shift();
      startRun = loud ? startRun + 1 : 0;
      if (startRun >= 3) {
        speaking = true;
        speech.push(...preRoll);
        preRoll.length = 0;
        voicedMs = startRun * FRAME_MS;
        silentMs = 0;
      }
      return;
    }

    speech.push(samples);
    if (loud) {
      voicedMs += FRAME_MS;
      silentMs = 0;
    } else {
      silentMs += FRAME_MS;
    }
    const total = speech.length * FRAME_MS;
    if (silentMs >= HANG_MS || total >= MAX_UTTERANCE_MS || muted) {
      const audio = concat(speech);
      speech.length = 0;
      speaking = false;
      startRun = 0;
      if (voicedMs >= MIN_SPEECH_MS && !muted) events.onUtterance(resample(audio, rate));
    }
  }

  function push(chunk: Float32Array) {
    const merged = new Float32Array(pending.length + chunk.length);
    merged.set(pending);
    merged.set(chunk, pending.length);
    let offset = 0;
    while (merged.length - offset >= frameSize) {
      frame(merged.slice(offset, offset + frameSize));
      offset += frameSize;
    }
    pending = merged.slice(offset);
  }

  let node: AudioNode;
  if (context.audioWorklet) {
    const url = URL.createObjectURL(new Blob([WORKLET], { type: "text/javascript" }));
    await context.audioWorklet.addModule(url);
    URL.revokeObjectURL(url);
    const tap = new AudioWorkletNode(context, "powiedz-tap");
    tap.port.onmessage = (event: MessageEvent<Float32Array>) => push(event.data);
    node = tap;
  } else {
    // Starsze przeglądarki bez AudioWorklet.
    const processor = context.createScriptProcessor(2048, 1, 1);
    processor.onaudioprocess = (event) => push(event.inputBuffer.getChannelData(0).slice(0));
    node = processor;
  }
  // Węzeł musi być podpięty do wyjścia, żeby przeglądarka go taktowała; wzmocnienie 0 = cisza.
  const sink = context.createGain();
  sink.gain.value = 0;
  source.connect(node);
  node.connect(sink);
  sink.connect(context.destination);

  return {
    stop() {
      source.disconnect();
      node.disconnect();
      sink.disconnect();
      for (const track of stream.getTracks()) track.stop();
      void context.close();
    },
    setMuted(value) {
      muted = value;
    },
  };
}
