export type AsrRequest =
  | { type: "load"; model: string }
  | {
      type: "transcribe";
      id: number;
      model: string;
      audio: Float32Array;
      /** Nazwa języka dla Whispera: „thai” albo „polish”. */
      language: string;
    };

/** download: pobieranie plików (albo odczyt z pamięci); init: sesja ONNX i rozgrzewka. */
export type AsrStage = "download" | "init";

export type AsrResponse =
  | { type: "stage"; stage: AsrStage }
  | { type: "progress"; loaded: number; total: number }
  | { type: "ready" }
  | { type: "result"; id: number; text: string; ms: number }
  | { type: "error"; id?: number; message: string };

export type ModelOption = {
  id: string;
  /** Przypięta wersja repozytorium — model nie zmieni się pod aplikacją bez naszej wiedzy. */
  revision: string;
  label: string;
  size: string;
  hint: string;
  /** Model douczony tylko na tajskim słabo radzi sobie z polskim. */
  thaiOnly?: boolean;
};

export const MODELS: ModelOption[] = [
  {
    // ONNX z biodatlab/distill-whisper-th-small (Thonburian Whisper).
    // Na Snapdragon 8 używa WebGPU + mixed dtype (encoder fp32, decoder q4) dla stabilności.
    id: "supersuphot/distill-whisper-th-small-timestamped",
    revision: "4ba4a76135523d4506e5fce9ba5bb796799f19b3",
    label: "Tajski (WebGPU)",
    size: "~250 MB",
    hint: "Najlepszy na tajski. Na Snapdragon 8 działa na GPU. Jeśli niestabilny — użyj „Tajski (stabilny)”.",
    thaiOnly: true,
  },
  {
    // Stabilna alternatywa: standardowy whisper-small z wymuszonym językiem thai.
    // Mniej precyzyjny na tajskim, ale stabilny na WASM i nie ma problemów z timestamped.
    id: "onnx-community/whisper-small",
    revision: "main",
    label: "Tajski (stabilny)",
    size: "~150 MB",
    hint: "Standardowy Whisper Small. Mniej dokładny na tajskim, ale stabilny na każdym telefonie.",
    thaiOnly: true,
  },
  {
    id: "onnx-community/whisper-base",
    revision: "1846881b6b3a3024392c1eea3ad983695bc23925",
    label: "Uniwersalny",
    size: "77 MB",
    hint: "Polski dobrze, tajski słabiej — często łapie tylko temat.",
  },
  {
    id: "onnx-community/whisper-tiny",
    revision: "ff4177021cc41f7db950912b73ea4fdf7d01d8e7",
    label: "Lekki",
    size: "41 MB",
    hint: "Na słabsze telefony. Myli się najczęściej.",
  },
];
