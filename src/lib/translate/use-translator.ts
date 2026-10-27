import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang, TranslateRequest, TranslateResponse } from "./protocol";

export type Translation = { text: string; via: "online" | "offline" };
export type OfflineState = "none" | "loading" | "ready" | "error";

const READY_KEY = "powiedz-mt-ready";
const OFFLINE_KEY = "powiedz-mt-offline";
const ONLINE_TIMEOUT_MS = 6000;

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
  /** Model offline był już raz w całości pobrany — leży w pamięci przeglądarki. */
  const [downloaded, setDownloaded] = useState(false);
  const [offlineOnly, setOfflineOnlyState] = useState(false);
  const [offline, setOffline] = useState<OfflineState>("none");
  const [progress, setProgress] = useState<{ loaded: number; total: number } | null>(null);
  const [offlineError, setOfflineError] = useState<string | null>(null);

  const worker = useRef<Worker | null>(null);
  const ready = useRef<Promise<void> | null>(null);
  const pending = useRef(new Map<number, Pending>());
  const nextId = useRef(1);
  const cache = useRef(new Map<string, Translation>());
  const settings = useRef({ downloaded: false, offlineOnly: false });

  useEffect(() => {
    const isReady = read(READY_KEY) === "1";
    const only = isReady && read(OFFLINE_KEY) === "1";
    setDownloaded(isReady);
    setOfflineOnlyState(only);
    settings.current = { downloaded: isReady, offlineOnly: only };
    return () => worker.current?.terminate();
  }, []);

  const loadOffline = useCallback(() => {
    if (ready.current) return ready.current;
    // Prośba, żeby przeglądarka nie wyrzuciła 900 MB modelu przy braku miejsca.
    void navigator.storage?.persist?.().catch(() => false);
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
        setOffline("error");
        setOfflineError(message);
        const error = new Error(message);
        for (const item of pending.current.values()) item.reject(error);
        pending.current.clear();
        reject(error);
      };
      created.onerror = () => fail("Tłumacz offline przestał działać (może zabrakło pamięci).");
      created.onmessage = (event: MessageEvent<TranslateResponse>) => {
        const message = event.data;
        if (message.type === "progress") {
          setProgress({ loaded: message.loaded, total: message.total });
        } else if (message.type === "ready") {
          write(READY_KEY, "1");
          settings.current.downloaded = true;
          setDownloaded(true);
          setOffline("ready");
          resolve();
        } else if (message.type === "result") {
          pending.current.get(message.id)?.resolve(message.text);
          pending.current.delete(message.id);
        } else if (message.id !== undefined) {
          pending.current.get(message.id)?.reject(new Error(message.message));
          pending.current.delete(message.id);
        } else {
          fail("Nie udało się pobrać tłumacza offline. (" + message.message + ")");
        }
      };
      created.postMessage({ type: "load" } satisfies TranslateRequest);
    });
    // Odrzucenie obsługuje ten, kto czeka na tłumaczenie; tu tylko, żeby nie było „unhandled”.
    ready.current.catch(() => {});
    return ready.current;
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

  return {
    translate,
    downloaded,
    offline,
    progress,
    offlineError,
    offlineOnly,
    setOfflineOnly,
    downloadOffline: loadOffline,
  };
}

export type Translator = ReturnType<typeof useTranslator>;
