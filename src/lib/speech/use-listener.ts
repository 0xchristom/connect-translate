import { useCallback, useEffect, useRef, useState } from "react";
import { categories } from "@/data/phrases";
import { cues, hallucinations } from "@/data/cues";
import { onPlaying } from "@/lib/play-thai";
import type { AsrRequest, AsrResponse, AsrStage } from "./asr-protocol";
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
// Bez żadnej wiadomości z workera przez tyle czasu: pobieranie stoi albo telefon ubił workera
// (np. zabrakło pamięci) — wtedy nie przychodzi żaden błąd, więc trzeba to wykryć samemu.
const STALL_MS = 20_000;
const INIT_TIMEOUT_MS = 180_000;

export type LoadProgress = {
  loaded: number;
  total: number;
  /** Bajty na sekundę od początku pobierania; 0, dopóki nie ma z czego liczyć. */
  rate: number;
};

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
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [stage, setStage] = useState<AsrStage>("download");
  /** Sekundy w bieżącym etapie ładowania. */
  const [elapsed, setElapsed] = useState(0);
  const [stalled, setStalled] = useState(false);
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
  /** Model, który worker właśnie ładuje — ponowne „Słuchaj” nie zaczyna od zera. */
  const loadingFor = useRef<string | null>(null);
  const stageRef = useRef<AsrStage>("download");
  const stageSince = useRef(0);
  const lastMessage = useRef(0);
  const firstSample = useRef<{ at: number; loaded: number } | null>(null);
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
      lastMessage.current = Date.now();
      setStalled(false);
      if (message.type === "stage") {
        stageRef.current = message.stage;
        stageSince.current = Date.now();
        setStage(message.stage);
        setElapsed(0);
      } else if (message.type === "progress") {
        const now = Date.now();
        const first = firstSample.current;
        if (!first) firstSample.current = { at: now, loaded: message.loaded };
        const seconds = first ? (now - first.at) / 1000 : 0;
        setProgress({
          loaded: message.loaded,
          total: message.total,
          rate: first && seconds > 1 ? (message.loaded - first.loaded) / seconds : 0,
        });
      } else if (message.type === "ready") {
        loadingFor.current = null;
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
        // Techniczny powód w nawiasie — bez niego nie da się zdiagnozować problemu z telefonu.
        setError(
          message.id === undefined
            ? `Nie udało się pobrać modelu mowy. Sprawdź internet i spróbuj jeszcze raz. (${message.message})`
            : "Nie udało się rozpoznać ostatniej wypowiedzi.",
        );
        if (message.id === undefined) {
          loadingFor.current = null;
          setStatus("error");
        }
        pump();
      }
    };
    const fail = () => {
      loadingFor.current = null;
      setError("Rozpoznawanie mowy nie działa w tej przeglądarce.");
      setStatus("error");
    };
    created.onerror = fail;
    created.onmessageerror = fail;
    worker.current = created;
    return created;
  }, [pump]);

  const killWorker = useCallback(() => {
    worker.current?.terminate();
    worker.current = null;
    loadingFor.current = null;
    modelReady.current = false;
    inFlight.current = false;
    setBusy(false);
  }, []);

  /** Zeruje wskaźniki postępu i każe workerowi załadować model. */
  const beginLoad = useCallback(
    (id: string) => {
      ensureWorker();
      loadingFor.current = id;
      modelReady.current = false;
      firstSample.current = null;
      stageRef.current = "download";
      stageSince.current = Date.now();
      lastMessage.current = Date.now();
      setStage("download");
      setElapsed(0);
      setStalled(false);
      setProgress(null);
      setStatus("loading");
      send({ type: "load", model: id });
    },
    [ensureWorker, send],
  );

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
    if (modelReady.current || loadingFor.current === modelRef.current) setStatus("loading");
    else beginLoad(modelRef.current);
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
  }, [beginLoad, pump, stopMic]);

  /** Zawieszone pobieranie samo nie ruszy — nowy worker zaczyna od plików, których brakuje. */
  const retry = useCallback(() => {
    killWorker();
    beginLoad(modelRef.current);
  }, [beginLoad, killWorker]);

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
      // Nowy worker: zwalnia pamięć po poprzednim modelu i nie miesza postępu dwóch pobierań.
      if (mic.current) {
        killWorker();
        beginLoad(id);
      }
    },
    [beginLoad, killWorker],
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

  // Licznik sekund i strażnik ładowania: telefon potrafi po cichu ubić workera, gdy
  // brakuje pamięci, a zerwane pobieranie też nie zawsze kończy się błędem.
  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      setElapsed(Math.floor((now - stageSince.current) / 1000));
      const quiet = now - lastMessage.current;
      if (stageRef.current === "download") {
        setStalled(quiet > STALL_MS);
      } else if (quiet > INIT_TIMEOUT_MS) {
        killWorker();
        stopMic();
        setError(
          "Model nie uruchomił się — telefonowi mogło zabraknąć pamięci. Spróbuj jeszcze raz albo wybierz lżejszy model.",
        );
        setStatus("error");
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [killWorker, status, stopMic]);

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
    stage,
    elapsed,
    stalled,
    level,
    speaking,
    busy,
    history,
    error,
    start,
    stop,
    retry,
    open,
    setModel,
    setMode,
    clear: () => setHistory([]),
  };
}

export type Listener = ReturnType<typeof useListener>;
