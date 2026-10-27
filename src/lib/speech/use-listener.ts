import { useCallback, useEffect, useRef, useState } from "react";
import { categories } from "@/data/phrases";
import { cues, hallucinations } from "@/data/cues";
import { onPlaying } from "@/lib/play-thai";
import type { AsrRequest, AsrResponse } from "./asr-protocol";
import { MODELS } from "./asr-protocol";
import { createMatcher, hasThai, type Suggestion } from "./intent";
import { startMic, type MicHandle } from "./mic";

export const matcher = createMatcher(categories, cues, hallucinations);

export type ListenMode = "th" | "pl";
export type ListenStatus = "off" | "setup" | "loading" | "listening" | "error";

export type Heard = {
  id: number;
  text: string;
  ms: number;
  suggestion: Suggestion | null;
};

const MODEL_KEY = "powiedz-asr-model";
const READY_KEY = "powiedz-asr-ready";
const MODE_KEY = "powiedz-asr-mode";
// Języka nie zgadujemy: na krótkich wypowiedziach wykrywanie Whispera myli tajski z angielskim.
const LANGUAGE: Record<ListenMode, string> = { th: "thai", pl: "polish" };

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* prywatny tryb — trudno */
  }
}

function micError(error: unknown) {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Brak zgody na mikrofon. Włącz ją w ustawieniach przeglądarki dla tej strony.";
  if (name === "NotFoundError") return "Nie widzę mikrofonu w tym urządzeniu.";
  if (!window.isSecureContext) return "Mikrofon działa tylko przez https.";
  return "Nie udało się włączyć mikrofonu.";
}

type WakeLock = { release: () => Promise<void> };

export function useListener() {
  const [status, setStatus] = useState<ListenStatus>("off");
  const [model, setModelState] = useState(MODELS[0].id);
  const [mode, setModeState] = useState<ListenMode>("th");
  const [downloaded, setDownloaded] = useState(false);
  const [progress, setProgress] = useState<{ loaded: number; total: number } | null>(null);
  const [level, setLevel] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<Heard[]>([]);
  const [error, setError] = useState<string | null>(null);

  const worker = useRef<Worker | null>(null);
  const mic = useRef<MicHandle | null>(null);
  const wake = useRef<WakeLock | null>(null);
  const queued = useRef<Float32Array | null>(null);
  const inFlight = useRef(false);
  const nextId = useRef(1);
  const modelReady = useRef(false);
  const modeRef = useRef(mode);
  const modelRef = useRef(model);
  modeRef.current = mode;
  modelRef.current = model;

  useEffect(() => {
    const savedModel = read(MODEL_KEY);
    if (savedModel && MODELS.some((item) => item.id === savedModel)) setModelState(savedModel);
    const savedMode = read(MODE_KEY);
    if (savedMode === "th" || savedMode === "pl") setModeState(savedMode);
    setDownloaded(read(READY_KEY) === (savedModel ?? MODELS[0].id));
  }, []);

  const send = useCallback((message: AsrRequest) => {
    worker.current?.postMessage(
      message,
      message.type === "transcribe" ? [message.audio.buffer] : [],
    );
  }, []);

  const pump = useCallback(() => {
    const audio = queued.current;
    if (!audio || inFlight.current) return;
    queued.current = null;
    inFlight.current = true;
    setBusy(true);
    send({
      type: "transcribe",
      id: nextId.current++,
      model: modelRef.current,
      audio,
      language: LANGUAGE[modeRef.current],
    });
  }, [send]);

  const ensureWorker = useCallback(() => {
    if (worker.current) return worker.current;
    const created = new Worker(new URL("./asr.worker.ts", import.meta.url), { type: "module" });
    created.onmessage = (event: MessageEvent<AsrResponse>) => {
      const message = event.data;
      if (message.type === "progress") {
        setProgress({ loaded: message.loaded, total: message.total });
      } else if (message.type === "ready") {
        modelReady.current = true;
        write(READY_KEY, modelRef.current);
        setDownloaded(true);
        setProgress(null);
        if (mic.current) setStatus("listening");
      } else if (message.type === "result") {
        inFlight.current = false;
        setBusy(false);
        const text = message.text;
        if (text) {
          const lang = hasThai(text) ? "th" : modeRef.current;
          const suggestion = matcher.match(text, lang);
          // `null` = cisza albo halucynacja modelu; nie zaśmiecamy historii.
          if (suggestion) {
            setHistory((prev) =>
              [{ id: message.id, text, ms: message.ms, suggestion }, ...prev].slice(0, 8),
            );
          }
        }
        pump();
      } else if (message.type === "error") {
        inFlight.current = false;
        setBusy(false);
        setError(
          message.id === undefined
            ? "Nie udało się pobrać modelu mowy. Sprawdź internet i spróbuj jeszcze raz."
            : "Nie udało się rozpoznać ostatniej wypowiedzi.",
        );
        if (message.id === undefined) setStatus("error");
        pump();
      }
    };
    created.onerror = () => {
      setError("Rozpoznawanie mowy nie działa w tej przeglądarce.");
      setStatus("error");
    };
    worker.current = created;
    return created;
  }, [pump]);

  const stopMic = useCallback(() => {
    mic.current?.stop();
    mic.current = null;
    void wake.current?.release().catch(() => undefined);
    wake.current = null;
    setLevel(0);
    setSpeaking(false);
  }, []);

  /** Wywoływać z kliknięcia — iOS pozwala włączyć mikrofon i dźwięk tylko po geście. */
  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Ta przeglądarka nie daje dostępu do mikrofonu.");
      setStatus("error");
      return;
    }
    stopMic();
    setStatus("loading");
    ensureWorker();
    send({ type: "load", model: modelRef.current });
    try {
      mic.current = await startMic({
        onLevel: (value, isSpeaking) => {
          setLevel(value);
          setSpeaking(isSpeaking);
        },
        onUtterance: (audio) => {
          // Gdy model nie nadąża, liczy się tylko najnowsza wypowiedź.
          queued.current = audio;
          pump();
        },
      });
    } catch (caught) {
      setError(micError(caught));
      setStatus("error");
      return;
    }
    try {
      const lock = (
        navigator as Navigator & { wakeLock?: { request(type: "screen"): Promise<WakeLock> } }
      ).wakeLock;
      wake.current = (await lock?.request("screen")) ?? null;
    } catch {
      /* bez blokady wygaszania też działa */
    }
    setStatus(modelReady.current ? "listening" : "loading");
  }, [ensureWorker, pump, send, stopMic]);

  const stop = useCallback(() => {
    stopMic();
    queued.current = null;
    setStatus("off");
  }, [stopMic]);

  const open = useCallback(() => {
    setError(null);
    setStatus("setup");
  }, []);

  const setModel = useCallback(
    (id: string) => {
      setModelState(id);
      write(MODEL_KEY, id);
      setDownloaded(read(READY_KEY) === id);
      modelReady.current = false;
      if (mic.current) {
        setStatus("loading");
        send({ type: "load", model: id });
      }
    },
    [send],
  );

  const setMode = useCallback((value: ListenMode) => {
    setModeState(value);
    write(MODE_KEY, value);
  }, []);

  // Nie słuchamy samych siebie: gdy gra tajskie nagranie, detektor śpi (i chwilę po nim).
  useEffect(() => {
    let timer = 0;
    const off = onPlaying((text) => {
      window.clearTimeout(timer);
      if (text) mic.current?.setMuted(true);
      else timer = window.setTimeout(() => mic.current?.setMuted(false), 400);
    });
    return () => {
      off();
      window.clearTimeout(timer);
    };
  }, []);

  // Blokada wygaszania znika po schowaniu karty — odnawiamy ją po powrocie.
  useEffect(() => {
    if (status !== "listening") return;
    const onVisible = async () => {
      if (document.visibilityState !== "visible" || !mic.current) return;
      try {
        const lock = (
          navigator as Navigator & { wakeLock?: { request(type: "screen"): Promise<WakeLock> } }
        ).wakeLock;
        wake.current = (await lock?.request("screen")) ?? null;
      } catch {
        /* ignore */
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [status]);

  useEffect(
    () => () => {
      mic.current?.stop();
      worker.current?.terminate();
    },
    [],
  );

  return {
    status,
    model,
    mode,
    downloaded,
    progress,
    level,
    speaking,
    busy,
    history,
    error,
    start,
    stop,
    open,
    setModel,
    setMode,
    clear: () => setHistory([]),
  };
}

export type Listener = ReturnType<typeof useListener>;
