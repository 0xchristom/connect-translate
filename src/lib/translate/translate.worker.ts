/// <reference lib="webworker" />
/**
 * Tłumacz offline w całości na urządzeniu (transformers.js + ONNX Runtime Web): NLLB-200
 * na procesorze albo, eksperymentalnie, TranslateGemma na karcie graficznej.
 * Model pobiera się raz do pamięci przeglądarki (OPFS), potem tłumaczy bez internetu.
 */
import ortMjs from "onnxruntime-web/ort-wasm-simd-threaded.mjs?url";
import ortWasm from "onnxruntime-web/ort-wasm-simd-threaded.wasm?url";
import {
  GEMMA_LANG,
  GEMMA_MODEL,
  NLLB_LANG,
  OFFLINE_MODEL,
  type Engine,
  type Lang,
  type TranslateRequest,
  type TranslateResponse,
} from "./protocol";
import { opfsCache } from "./opfs-cache";

type Translate = (text: string, from: Lang, to: Lang) => Promise<string>;
type Pipe = (input: unknown, options: Record<string, unknown>) => Promise<unknown>;

let loading: Promise<Translate> | null = null;

function post(message: TranslateResponse) {
  self.postMessage(message);
}

/**
 * NLLB tłumaczy dobrze krótkie zdania, a na dłuższym tekście potrafi się zapętlić
 * („Nie, nie, nie.”). Tajowie oddzielają zdania spacją, Polacy kropką — tniemy po tym.
 */
function sentences(text: string, from: Lang) {
  const pieces = from === "th" ? text.split(/\s+/) : text.split(/(?<=[.!?])\s+/);
  return pieces.map((piece) => piece.trim()).filter(Boolean);
}

function load(engine: Engine) {
  loading ??= (async (): Promise<Translate> => {
    const { pipeline, env } = await import("@huggingface/transformers");
    env.allowLocalModels = false;
    env.useCustomCache = true;
    env.customCache = opfsCache;
    // Jak w asr.worker.ts: Hugging Face odrzuca zapytania z Refererem *.workers.dev.
    env.fetch = (input, init) => fetch(input, { ...init, referrerPolicy: "no-referrer" });
    // WebGPU działa tylko w wersji „asyncify” runtime'u, a ta ma 27 MB — ponad limit 25 MiB
    // na plik w Cloudflare (vite.config.ts ją wycina). Dla Gemmy bierzemy ją z CDN.
    const ort = env.backends.onnx;
    const cdn = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ort.versions?.web}/dist/ort-wasm-simd-threaded.asyncify`;
    if (ort.wasm) {
      ort.wasm.wasmPaths =
        engine === "gemma"
          ? { mjs: cdn + ".mjs", wasm: cdn + ".wasm" }
          : { mjs: ortMjs, wasm: ortWasm };
    }
    let lastPost = 0;
    const progress_callback = (info: { status: string; loaded?: number; total?: number }) => {
      if (info.status !== "progress_total") return;
      const now = performance.now();
      const loaded = info.loaded ?? 0;
      const total = info.total ?? 0;
      if (now - lastPost < 150 && loaded < total) return;
      lastPost = now;
      post({ type: "progress", loaded, total });
    };

    if (engine === "gemma") {
      if (!("gpu" in navigator)) throw new Error("Ta przeglądarka nie obsługuje WebGPU.");
      const generate = (await pipeline("text-generation", GEMMA_MODEL.id, {
        revision: GEMMA_MODEL.revision,
        device: "webgpu",
        dtype: "q4",
        progress_callback,
      })) as unknown as Pipe;
      return async (text, from, to) => {
        const messages = [
          {
            role: "user",
            content: [
              {
                type: "text",
                source_lang_code: GEMMA_LANG[from],
                target_lang_code: GEMMA_LANG[to],
                text,
              },
            ],
          },
        ];
        const output = (await generate(messages, { max_new_tokens: 256, do_sample: false })) as {
          generated_text: { content: string }[];
        }[];
        return output[0]?.generated_text.at(-1)?.content.trim() ?? "";
      };
    }

    const translator = (await pipeline("translation", OFFLINE_MODEL.id, {
      revision: OFFLINE_MODEL.revision,
      device: "wasm",
      dtype: "q8",
      progress_callback,
    })) as unknown as Pipe;
    return async (text, from, to) => {
      const parts: string[] = [];
      for (const piece of sentences(text, from)) {
        const [output] = (await translator(piece, {
          src_lang: NLLB_LANG[from],
          tgt_lang: NLLB_LANG[to],
          max_new_tokens: 160,
        })) as { translation_text: string }[];
        if (output?.translation_text) parts.push(output.translation_text.trim());
      }
      return parts.join(" ");
    };
  })().catch((error: unknown) => {
    loading = null;
    throw error;
  });
  return loading;
}

self.onmessage = async (event: MessageEvent<TranslateRequest>) => {
  const message = event.data;
  try {
    if (message.type === "load") {
      await load(message.engine);
      post({ type: "ready" });
      return;
    }
    if (!loading) throw new Error("Tłumacz offline nie jest uruchomiony.");
    const translate = await loading;
    post({
      type: "result",
      id: message.id,
      text: await translate(message.text, message.from, message.to),
    });
  } catch (error) {
    post({
      type: "error",
      id: message.type === "translate" ? message.id : undefined,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
