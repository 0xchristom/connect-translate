import { audioMap } from "@/data/audio-map";

type Listener = (text: string | null) => void;

let audio: HTMLAudioElement | null = null;
let held: SpeechSynthesisUtterance | null = null;
let current: string | null = null;
const listeners = new Set<Listener>();
const errors = new Set<(message: string | null) => void>();

function emit(text: string | null) {
  current = text;
  for (const listener of listeners) listener(text);
}

function fail(message: string | null) {
  for (const listener of errors) listener(message);
}

function engineSpeak(text: string) {
  const synth = window.speechSynthesis;
  if (!synth) return false;
  const utter = new SpeechSynthesisUtterance(text);
  held = utter;
  utter.lang = "th-TH";
  utter.rate = 0.86;
  const voice =
    synth.getVoices().find((item) => item.lang.toLowerCase().startsWith("th")) ?? null;
  if (voice) utter.voice = voice;
  utter.onend = () => emit(null);
  utter.onerror = () => {
    emit(null);
    fail("Ta przeglądarka nie ma głosu tajskiego.");
  };
  if (synth.speaking || synth.pending) synth.cancel();
  window.setTimeout(() => {
    if (synth.paused) synth.resume();
    synth.speak(utter);
  }, 60);
  return true;
}

export function playThai(text: string) {
  fail(null);
  if (current === text && audio && !audio.paused) {
    audio.pause();
    emit(null);
    return;
  }
  const file = audioMap[text];
  if (!file) {
    emit(text);
    if (!engineSpeak(text)) {
      emit(null);
      fail("Brak nagrania tego słowa.");
    }
    return;
  }
  if (!audio) audio = new Audio();
  audio.pause();
  audio.src = "/audio/" + file;
  audio.onended = () => emit(null);
  audio.onerror = () => {
    emit(null);
    if (!engineSpeak(text)) fail("Nie udało się odtworzyć nagrania.");
  };
  emit(text);
  void audio.play().catch(() => {
    emit(null);
    if (!engineSpeak(text)) fail("Przeglądarka zablokowała dźwięk.");
  });
}

export function onPlaying(listener: Listener) {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
}

export function onPlayError(listener: (message: string | null) => void) {
  errors.add(listener);
  return () => {
    errors.delete(listener);
  };
}
