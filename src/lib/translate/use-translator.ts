import { useCallback, useEffect, useRef, useState } from "react";
import { removeModel } from "./opfs-cache";
import {
  GEMMA_MODEL,
  OFFLINE_MODEL,
  type Engine,
  type Lang,
  type TranslateRequest,
  type TranslateResponse,
} from "./protocol";

export type Translation = { text: string; via: "online" | "offline" };
export type OfflineState = "none" | "loading" | "ready" | "error";

const READY_KEY: Record<Engine, string> = {
  nllb: "powiedz-mt-ready",
  gemma: "powiedz-mt-ready-gemma",
};
const ENGINE_KEY = "powiedz-mt-engine";
const OFFLINE_KEY = "powiedz-mt-offline";
const ONLINE_TIMEOUT_MS = 6000;
const MODEL_ID: Record<Engine, string> = { nllb: OFFLINE_MODEL.id, gemma: GEMMA_MODEL.id };

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* prywatny tryb — trudno */
  }
}

/**
 * Google Translate bez klucza (ten sam punkt, którego używa wtyczka przeglądarki). Szybki
 * i dobry, ale wysyła tekst do Google — dlatego jest też tryb „tylko na telefonie”.
 */
async function translateOnline(text: string, from: Lang, to: Lang) {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t`,
    {
      method: "POST",
      body: new URLSearchParams({ q: text }),
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(ONLINE_TIMEOUT_MS),
    },
  );
  if (!response.ok) throw new Error("HTTP " + response.status);
  const data = (await response.json()) as [[string, string][]];
  return data[0]
    .map((part) => part[0])
    .join("")
    .trim();
}

type Pending = { resolve: (text: string) => void; reject: (error: Error) => void };

export function useTranslator() {
  const [engine, setEngineState] = useState<Engine>("nllb");
  /** Który model offline był już raz w całości pobrany — leży w pamięci przeglądarki. */
  const [downloadedBy, setDownloadedBy] = useState<Record<Engine, boolean>>({
    nllb: false,
    gemma: false,
  });
  const [webgpu, setWebgpu] = useState(false);
  const [offlineOnly, setOfflineOnlyState] = useState(false);
  const [offline, setOffline] = useState<OfflineState>("none");
  const [progress, setProgress] = useState<{ loaded: number; total: number } | null>(null);
  const [offlineError, setOfflineError] = useState<string | null>(null);

  const worker = useRef<Worker | null>(null);
  const ready = useRef<Promise<void> | null>(null);
  const abort = useRef<((message: string) => void) | null>(null);
  const pending = useRef(new Map<number, Pending>());
  const nextId = useRef(1);
  const cache = useRef(new Map<string, Translation>());
  const settings = useRef({ engine: "nllb" as Engine, downloaded: false, offlineOnly: false });

  useEffect(() => {
    const saved: Engine = read(ENGINE_KEY) === "gemma" ? "gemma" : "nllb";
    const by = { nllb: read(READY_KEY.nllb) === "1", gemma: read(READY_KEY.gemma) === "1" };
    const only = read(OFFLINE_KEY) === "1";
    setEngineState(saved);
    setDownloadedBy(by);
    setOfflineOnlyState(only);
    setWebgpu("gpu" in navigator);
    settings.current = { engine: saved, downloaded: by[saved], offlineOnly: only };
    return () => worker.current?.terminate();
  }, []);

  const loadOffline = useCallback(() => {
    if (ready.current) return ready.current;
    // Prośba, żeby przeglądarka nie wyrzuciła modelu przy braku miejsca.
    void navigator.storage?.persist?.().catch(() => false);
    const current = settings.current.engine;
    setOffline("loading");
    setOfflineError(null);
    setProgress(null);
    const created = new Worker(new URL("./translate.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.current = created;
    ready.current = new Promise<void>((resolve, reject) => {
      const fail = (message: string) => {
        created.terminate();
        if (worker.current === created) worker.current = null;
        ready.current = null;
        abort.current = null;
        setOffline("error");
        setOfflineError(message);
        const error = new Error(message);
        for (const item of pending.current.values()) item.reject(error);
        pending.current.clear();
        reject(error);
      };
      abort.current = fail;
      created.onerror = () => fail("Tłumacz offline przestał działać (może zabrakło pamięci).");
      created.onmessage = (event: MessageEvent<TranslateResponse>) => {
        const message = event.data;
        if (message.type === "progress") {
          setProgress({ loaded: message.loaded, total: message.total });
        } else if (message.type === "ready") {
          write(READY_KEY[current], "1");
          settings.current.downloaded = true;
          setDownloadedBy((by) => ({ ...by, [current]: true }));
          setOffline("ready");
          resolve();
        } else if (message.type === "result") {
          pending.current.get(message.id)?.resolve(message.text);
          pending.current.delete(message.id);
        } else if (message.id !== undefined) {
          pending.current.get(message.id)?.reject(new Error(message.message));
          pending.current.delete(message.id);
        } else {
          fail("Nie udało się uruchomić tłumacza offline. (" + message.message + ")");
        }
      };
      created.postMessage({ type: "load", engine: current } satisfies TranslateRequest);
    });
    // Odrzucenie obsługuje ten, kto czeka na tłumaczenie; tu tylko, żeby nie było „unhandled”.
    ready.current.catch(() => {});
    return ready.current;
  }, []);

  const stopOffline = useCallback(() => {
    abort.current?.("Zmieniono model offline.");
    setOffline("none");
    setOfflineError(null);
    setProgress(null);
    cache.current.clear();
  }, []);

  const translateOffline = useCallback(
    async (text: string, from: Lang, to: Lang) => {
      await loadOffline();
      const id = nextId.current++;
      return new Promise<string>((resolve, reject) => {
        pending.current.set(id, { resolve, reject });
        worker.current?.postMessage({
          type: "translate",
          id,
          text,
          from,
          to,
        } satisfies TranslateRequest);
      });
    },
    [loadOffline],
  );

  const translate = useCallback(
    async (text: string, from: Lang, to: Lang): Promise<Translation> => {
      const key = from + to + "|" + text.trim();
      const hit = cache.current.get(key);
      if (hit) return hit;
      const { downloaded: hasModel, offlineOnly: only } = settings.current;
      let result: Translation;
      if (only && hasModel) {
        result = { text: await translateOffline(text, from, to), via: "offline" };
      } else {
        try {
          result = { text: await translateOnline(text, from, to), via: "online" };
        } catch {
          if (!hasModel) {
            throw new Error("Brak internetu. Pobierz tłumacza offline, żeby tłumaczyć bez sieci.");
          }
          result = { text: await translateOffline(text, from, to), via: "offline" };
        }
      }
      cache.current.set(key, result);
      return result;
    },
    [translateOffline],
  );

  const setOfflineOnly = useCallback((value: boolean) => {
    settings.current.offlineOnly = value;
    setOfflineOnlyState(value);
    write(OFFLINE_KEY, value ? "1" : null);
    cache.current.clear();
  }, []);

  const setEngine = useCallback(
    (value: Engine) => {
      if (value === settings.current.engine) return;
      stopOffline();
      write(ENGINE_KEY, value === "nllb" ? null : value);
      settings.current.engine = value;
      settings.current.downloaded = read(READY_KEY[value]) === "1";
      setEngineState(value);
    },
    [stopOffline],
  );

  /** Kasuje pobrany model wybranego silnika (TranslateGemma to ponad 3 GB). */
  const removeOffline = useCallback(async () => {
    const current = settings.current.engine;
    stopOffline();
    write(READY_KEY[current], null);
    settings.current.downloaded = false;
    setDownloadedBy((by) => ({ ...by, [current]: false }));
    await removeModel(MODEL_ID[current]).catch(() => {});
  }, [stopOffline]);

  return {
    translate,
    engine,
    setEngine,
    webgpu,
    downloaded: downloadedBy[engine],
    offline,
    progress,
    offlineError,
    offlineOnly,
    setOfflineOnly,
    downloadOffline: loadOffline,
    removeOffline,
  };
}

export type Translator = ReturnType<typeof useTranslator>;
