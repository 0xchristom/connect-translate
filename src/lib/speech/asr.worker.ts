/// <reference lib="webworker" />
/**
 * Whisper uruchamiany w całości na urządzeniu (transformers.js + ONNX Runtime Web).
 * Model pobiera się raz z Hugging Face i zostaje w Cache Storage — potem działa offline,
 * a nagrania nigdy nie opuszczają telefonu.
 */
import ortMjs from "onnxruntime-web/ort-wasm-simd-threaded.mjs?url";
import ortWasm from "onnxruntime-web/ort-wasm-simd-threaded.wasm?url";
import { MODELS, type AsrRequest, type AsrResponse } from "./asr-protocol";

type Transcriber = (
  audio: Float32Array,
  options: Record<string, unknown>,
) => Promise<{ text: string } | { text: string }[]>;

let transcriber: Transcriber | null = null;
let loading: Promise<Transcriber> | null = null;
let loadedModel = "";

function post(message: AsrResponse) {
  self.postMessage(message);
}

async function load(model: string) {
  if (transcriber && loadedModel === model) return transcriber;
  if (loading && loadedModel === model) return loading;
  loadedModel = model;
  loading = (async () => {
    const { pipeline, env } = await import("@huggingface/transformers");
    env.allowLocalModels = false;
    env.useBrowserCache = true;
    // Środowisko ONNX z własnego serwera, nie z CDN: ta sama wersja co biblioteka, działa
    // offline i nic nie wychodzi do obcych domen. Wariant bez WebGPU/asyncify (14 MB zamiast 27),
    // bo i tak liczymy na WASM.
    if (env.backends.onnx.wasm) env.backends.onnx.wasm.wasmPaths = { mjs: ortMjs, wasm: ortWasm };
    const files = new Map<string, { loaded: number; total: number }>();
    const asr = await pipeline("automatic-speech-recognition", model, {
      revision: MODELS.find((item) => item.id === model)?.revision ?? "main",
      // WASM + 8 bitów: najmniejszy plik i działa na każdym telefonie. Na WebGPU dobre
      // warianty Whispera ważą ~200 MB, więc nie opłacają się w aplikacji mobilnej.
      device: "wasm",
      dtype: "q8",
      progress_callback: (info: {
        status: string;
        file?: string;
        loaded?: number;
        total?: number;
      }) => {
        if (info.status !== "progress" || !info.file) return;
        files.set(info.file, { loaded: info.loaded ?? 0, total: info.total ?? 0 });
        let loaded = 0;
        let total = 0;
        for (const item of files.values()) {
          loaded += item.loaded;
          total += item.total;
        }
        post({ type: "progress", loaded, total });
      },
    });
    transcriber = asr as unknown as Transcriber;
    // Rozgrzewka: pierwsze wywołanie inicjuje WASM i alokuje pamięć, więc nie płaci za to
    // pierwsza prawdziwa wypowiedź.
    await transcriber(new Float32Array(16000), { language: "thai", task: "transcribe" });
    return transcriber;
  })();
  try {
    return await loading;
  } catch (error) {
    loading = null;
    transcriber = null;
    loadedModel = "";
    throw error;
  }
}

self.onmessage = async (event: MessageEvent<AsrRequest>) => {
  const message = event.data;
  try {
    if (message.type === "load") {
      await load(message.model);
      post({ type: "ready" });
      return;
    }
    const asr = await load(message.model);
    const started = performance.now();
    const output = await asr(message.audio, {
      language: message.language,
      task: "transcribe",
      // Krótkie wypowiedzi: chunkowanie niepotrzebne, a mniej tokenów = szybciej.
      max_new_tokens: 96,
    });
    const text = (
      Array.isArray(output) ? output.map((item) => item.text).join(" ") : output.text
    ).trim();
    post({ type: "result", id: message.id, text, ms: Math.round(performance.now() - started) });
  } catch (error) {
    post({
      type: "error",
      id: message.type === "transcribe" ? message.id : undefined,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
