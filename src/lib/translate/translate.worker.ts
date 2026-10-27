/// <reference lib="webworker" />
/**
 * Tłumacz offline: NLLB-200 w całości na urządzeniu (transformers.js + ONNX Runtime Web).
 * Model pobiera się raz do pamięci przeglądarki (OPFS), potem tłumaczy bez internetu.
 */
import ortMjs from "onnxruntime-web/ort-wasm-simd-threaded.mjs?url";
import ortWasm from "onnxruntime-web/ort-wasm-simd-threaded.wasm?url";
import {
  NLLB_LANG,
  OFFLINE_MODEL,
  type Lang,
  type TranslateRequest,
  type TranslateResponse,
} from "./protocol";
import { opfsCache } from "./opfs-cache";

type Translator = (
  text: string,
  options: Record<string, unknown>,
) => Promise<{ translation_text: string }[]>;

let loading: Promise<Translator> | null = null;

function post(message: TranslateResponse) {
  self.postMessage(message);
}

function load() {
  loading ??= (async () => {
    const { pipeline, env } = await import("@huggingface/transformers");
    env.allowLocalModels = false;
    env.useCustomCache = true;
    env.customCache = opfsCache;
    // Jak w asr.worker.ts: Hugging Face odrzuca zapytania z Refererem *.workers.dev.
    env.fetch = (input, init) => fetch(input, { ...init, referrerPolicy: "no-referrer" });
    if (env.backends.onnx.wasm) env.backends.onnx.wasm.wasmPaths = { mjs: ortMjs, wasm: ortWasm };
    let lastPost = 0;
    const translator = await pipeline("translation", OFFLINE_MODEL.id, {
      revision: OFFLINE_MODEL.revision,
      device: "wasm",
      dtype: "q8",
      progress_callback: (info: { status: string; loaded?: number; total?: number }) => {
        if (info.status !== "progress_total") return;
        const now = performance.now();
        const loaded = info.loaded ?? 0;
        const total = info.total ?? 0;
        if (now - lastPost < 150 && loaded < total) return;
        lastPost = now;
        post({ type: "progress", loaded, total });
      },
    });
    return translator as unknown as Translator;
  })().catch((error: unknown) => {
    loading = null;
    throw error;
  });
  return loading;
}

/**
 * NLLB tłumaczy dobrze krótkie zdania, a na dłuższym tekście potrafi się zapętlić
 * („Nie, nie, nie.”). Tajowie oddzielają zdania spacją, Polacy kropką — tniemy po tym.
 */
function sentences(text: string, from: Lang) {
  const pieces = from === "th" ? text.split(/\s+/) : text.split(/(?<=[.!?])\s+/);
  return pieces.map((piece) => piece.trim()).filter(Boolean);
}

self.onmessage = async (event: MessageEvent<TranslateRequest>) => {
  const message = event.data;
  try {
    const translator = await load();
    if (message.type === "load") {
      post({ type: "ready" });
      return;
    }
    const parts: string[] = [];
    for (const piece of sentences(message.text, message.from)) {
      const [output] = await translator(piece, {
        src_lang: NLLB_LANG[message.from],
        tgt_lang: NLLB_LANG[message.to],
        max_new_tokens: 160,
      });
      if (output?.translation_text) parts.push(output.translation_text.trim());
    }
    post({ type: "result", id: message.id, text: parts.join(" ") });
  } catch (error) {
    post({
      type: "error",
      id: message.type === "translate" ? message.id : undefined,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
