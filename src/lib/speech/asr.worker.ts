/// <reference lib="webworker" />
/**
 * Whisper uruchamiany w całości na urządzeniu (transformers.js + ONNX Runtime Web).
 * Model pobiera się raz do OPFS (jak NLLB) — Cache Storage w Chrome nie radzi sobie
 * z dużymi plikami. Potem działa offline, nagrania nigdy nie opuszczają telefonu.
 */
import ortMjs from "onnxruntime-web/ort-wasm-simd-threaded.mjs?url";
import ortWasm from "onnxruntime-web/ort-wasm-simd-threaded.wasm?url";
import { opfsCache } from "../translate/opfs-cache";
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
    // Jak NLLB: OPFS zamiast Cache Storage. Chrome odmawia plików >~400 MB w Cache Storage
    // („Unexpected internal error”). Model Tajski (szczególnie fp16) jest na tyle duży,
    // że OPFS jest bezpieczniejszy i stabilniejszy.
    env.useCustomCache = true;
    env.customCache = opfsCache;
    // Hugging Face odpowiada 404 bez CORS na każde zapytanie z Refererem *.workers.dev,
    // więc na wdrożonej aplikacji żaden model się nie pobierał. Bez Referera przechodzi.
    env.fetch = (input, init) => fetch(input, { ...init, referrerPolicy: "no-referrer" });
    // Środowisko ONNX z własnego serwera, nie z CDN: ta sama wersja co biblioteka, działa
    // offline i nic nie wychodzi do obcych domen. Wariant bez WebGPU/asyncify (14 MB zamiast 27),
    // bo i tak liczymy na WASM.
    if (env.backends.onnx.wasm) env.backends.onnx.wasm.wasmPaths = { mjs: ortMjs, wasm: ortWasm };
    post({ type: "stage", stage: "download" });

    // Heartbeat: jeśli progress_callback milczy (duże pliki, wolne CDN, albo blokada na sesji ONNX),
    // główny wątek nie myśli, że pobieranie stoi.
    const heartbeat = setInterval(() => {
      post({ type: "progress", loaded: 0, total: 0 }); // zerowy progress = żywy, ale bez danych
    }, 4000);

    try {
      // `progress_total` zna rozmiary wszystkich plików z góry, więc pasek nie cofa się, gdy
      // zaczyna się kolejny plik. Pojedyncze `progress` zostają na wypadek, gdyby go zabrakło.
      const files = new Map<string, { loaded: number; total: number }>();
      let hasTotal = false;
      let lastPost = 0;
      let initPosted = false;
      const report = (loaded: number, total: number) => {
        const now = performance.now();
        const finished = total > 0 && loaded >= total;
        // Tysiące zdarzeń na plik — wystarczy kilka na sekundę.
        if (!finished && now - lastPost < 150) return;
        lastPost = now;
        post({ type: "progress", loaded, total });
        if (finished && !initPosted) {
          initPosted = true;
          post({ type: "stage", stage: "init" });
        }
      };

      // Modele _timestamped + q8 mają znane problemy z sesją ONNX w transformers.js v4
      // (Missing required scale / MatMulNBits). Dla modelu Tajskiego preferujemy fp16,
      // który model ma w repozytorium i działa stabilniej na mocnych telefonach.
      const isThai = model.includes("distill-whisper-th");
      const dtype = isThai ? "fp16" : "q8";

      const asr = await pipeline("automatic-speech-recognition", model, {
        revision: MODELS.find((item) => item.id === model)?.revision ?? "main",
        device: "wasm",
        dtype,
        progress_callback: (info: {
          status: string;
          file?: string;
          loaded?: number;
          total?: number;
        }) => {
          if (info.status === "progress_total") {
            hasTotal = true;
            report(info.loaded ?? 0, info.total ?? 0);
            return;
          }
          if (hasTotal || info.status !== "progress" || !info.file) return;
          files.set(info.file, { loaded: info.loaded ?? 0, total: info.total ?? 0 });
          let loaded = 0;
          let total = 0;
          for (const item of files.values()) {
            loaded += item.loaded;
            total += item.total;
          }
          report(loaded, total);
        },
      });
      if (!initPosted) post({ type: "stage", stage: "init" });
      transcriber = asr as unknown as Transcriber;
      // Rozgrzewka: pierwsze wywołanie inicjuje WASM i alokuje pamięć, więc nie płaci za to
      // pierwsza prawdziwa wypowiedź. Jeden token wystarczy — na ciszy Whisper bez limitu
      // zapętla się („สิบ สิบ สิบ…”) do ~450 tokenów, co na telefonie trwało minutami.
      await transcriber(new Float32Array(16000), {
        language: "thai",
        task: "transcribe",
        max_new_tokens: 1,
      });
      return transcriber;
    } finally {
      clearInterval(heartbeat);
    }
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
