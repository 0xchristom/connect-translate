export type Lang = "th" | "pl";

/** Model offline: NLLB (mały, procesor) albo TranslateGemma (duży, karta graficzna). */
export type Engine = "nllb" | "gemma";

export type TranslateRequest =
  | { type: "load"; engine: Engine }
  | { type: "translate"; id: number; text: string; from: Lang; to: Lang };

export type TranslateResponse =
  | { type: "progress"; loaded: number; total: number }
  | { type: "ready" }
  | { type: "result"; id: number; text: string }
  | { type: "error"; id?: number; message: string };

/**
 * NLLB-200 (Meta, 600M, wersja destylowana, 8 bitów): jedyny mały model, który tłumaczy
 * tajski ↔ polski bezpośrednio, bez przechodzenia przez angielski. Mniejsze modele Opus-MT
 * mają tylko pary z angielskim, a M2M100 wyraźnie gorzej zna tajski.
 */
export const OFFLINE_MODEL = {
  id: "Xenova/nllb-200-distilled-600M",
  revision: "261c31d1a5732c67cdd16d80e8d6088507c7ccea",
  size: "900 MB",
};

/** Kody języków NLLB (FLORES-200). */
export const NLLB_LANG: Record<Lang, string> = { th: "tha_Thai", pl: "pol_Latn" };

/**
 * TranslateGemma 4B (Google, 2026): Gemma 3 douczona do tłumaczenia, dużo lepsza od NLLB,
 * ale 4 bity to wciąż 3,1 GB i liczy się tylko na karcie graficznej (WebGPU).
 */
export const GEMMA_MODEL = {
  id: "onnx-community/translategemma-text-4b-it-ONNX",
  revision: "f7874a1ac60758872a4f78aac0df95b17b776994",
  size: "3,1 GB",
};

export const GEMMA_LANG: Record<Lang, string> = { th: "th_TH", pl: "pl_PL" };
