export type Lang = "th" | "pl";

export type TranslateRequest =
  { type: "load" } | { type: "translate"; id: number; text: string; from: Lang; to: Lang };

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
