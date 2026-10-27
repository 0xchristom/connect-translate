import { useState } from "react";
import { Languages, Loader2, Maximize2, Volume2, X } from "lucide-react";
import type { Speaker } from "@/data/phrases";
import { playThai } from "@/lib/play-thai";
import { hasThai } from "@/lib/speech/intent";
import { reading } from "@/lib/speech/reading";
import type { Lang } from "@/lib/translate/protocol";
import { GEMMA_MODEL, OFFLINE_MODEL, type Engine } from "@/lib/translate/protocol";
import { politeThai } from "@/lib/translate/polite";
import { useLiveTranslation, type Live } from "@/lib/translate/use-live-translation";
import type { Translator } from "@/lib/translate/use-translator";

/** Tajski wynik: duże litery dla rozmówcy, wymowa dla nas, odsłuch i pełny ekran. */
export function ThaiOut({ thai, size = "text-2xl" }: { thai: string; size?: string }) {
  const [full, setFull] = useState(false);
  const read = reading(thai);
  return (
    <div>
      <p lang="th" className={"leading-snug font-medium " + size}>
        {thai}
      </p>
      {read ? (
        <p className="text-sm leading-snug">
          <span className="text-muted">Czyta się: </span>
          <span className="font-medium">{read}</span>
        </p>
      ) : null}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => playThai(thai)}
          className="flex h-9 items-center gap-1.5 rounded-md bg-bg px-3 text-sm font-medium"
        >
          <Volume2 className="size-4" aria-hidden="true" />
          Posłuchaj
        </button>
        <button
          type="button"
          onClick={() => setFull(true)}
          className="flex h-9 items-center gap-1.5 rounded-md bg-bg px-3 text-sm font-medium"
        >
          <Maximize2 className="size-4" aria-hidden="true" />
          Pokaż osobie
        </button>
      </div>
      {full ? (
        <div
          role="dialog"
          aria-label="Tekst dla rozmówcy"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink p-6 text-center text-accent-fg"
          onClick={() => setFull(false)}
        >
          <p lang="th" className="text-4xl leading-snug font-medium text-balance">
            {thai}
          </p>
          <p className="text-sm text-card-muted">Stuknij, żeby zamknąć</p>
        </div>
      ) : null}
    </div>
  );
}

function Via({ live }: { live: Live }) {
  if (live.busy) {
    return (
      <span className="flex items-center gap-1">
        <Loader2 className="size-3 animate-spin" aria-hidden="true" /> Tłumaczę…
      </span>
    );
  }
  if (live.error) return <span className="text-red-700">{live.error}</span>;
  if (!live.result) return null;
  return <span>{live.result.via === "online" ? "Google Tłumacz" : "Na telefonie (offline)"}</span>;
}

/** Tłumaczenie usłyszanego zdania w karcie „Usłyszane”. */
export function HeardTranslation({
  translator,
  text,
  speaker,
}: {
  translator: Translator;
  text: string;
  speaker: Speaker;
}) {
  const from: Lang = hasThai(text) ? "th" : "pl";
  const to: Lang = from === "th" ? "pl" : "th";
  const live = useLiveTranslation(translator, text, from, to);
  return (
    <div className="mt-2 rounded-md bg-bg px-3 py-2">
      <p className="flex justify-between gap-2 text-xs text-muted">
        <span>Tłumaczenie</span>
        <Via live={live} />
      </p>
      {live.result ? (
        to === "pl" ? (
          <p className="text-lg leading-snug font-semibold">{live.result.text}</p>
        ) : (
          <ThaiOut
            thai={politeThai(live.result.text, speaker, text.trim().endsWith("?"))}
            size="text-xl"
          />
        )
      ) : null}
    </div>
  );
}

function megabytes(bytes: number) {
  return Math.round(bytes / 1e6);
}

const ENGINES: { value: Engine; name: string; note: string }[] = [
  { value: "nllb", name: "NLLB", note: OFFLINE_MODEL.size },
  { value: "gemma", name: "TranslateGemma", note: GEMMA_MODEL.size + " · eksperyment" },
];

function EngineChoice({ translator }: { translator: Translator }) {
  return (
    <div role="radiogroup" aria-label="Model offline" className="mt-2 grid grid-cols-2 gap-1.5">
      {ENGINES.map((item) => {
        const active = translator.engine === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => translator.setEngine(item.value)}
            className={
              "rounded-md border px-2.5 py-1.5 text-left " +
              (active ? "border-accent bg-bg" : "border-line text-muted")
            }
          >
            <span className="block text-sm font-medium text-ink">{item.name}</span>
            <span className="block text-xs text-muted">{item.note}</span>
          </button>
        );
      })}
    </div>
  );
}

function OfflineSetup({ translator }: { translator: Translator }) {
  const { offline, progress, downloaded, engine } = translator;
  const gemma = engine === "gemma";
  const percent =
    progress && progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : null;
  let body;
  if (offline === "loading") {
    body = (
      <div className="mt-2">
        <p className="text-xs text-muted">
          {downloaded
            ? gemma
              ? "Uruchamiam TranslateGemma… na telefonie to może potrwać minutę."
              : "Uruchamiam tłumacza offline…"
            : percent === null
              ? "Łączę się z serwerem modeli…"
              : `Pobieram tłumacza offline… ${percent}% (${megabytes(progress!.loaded)} z ${megabytes(progress!.total)} MB)`}
        </p>
        <div
          role="progressbar"
          aria-label="Pobieranie tłumacza offline"
          aria-valuenow={percent ?? undefined}
          className="mt-1 h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div
            className={"h-full bg-accent " + (percent === null ? "progress-indeterminate" : "")}
            style={percent === null ? undefined : { width: percent + "%" }}
          />
        </div>
      </div>
    );
  } else if (downloaded) {
    body = (
      <>
        <label className="mt-2 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={translator.offlineOnly}
            onChange={(event) => translator.setOfflineOnly(event.target.checked)}
          />
          <span>
            Tłumacz tylko na telefonie
            <span className="block text-xs text-muted">
              Nic nie wychodzi do Google. Wolniej{gemma ? "" : " i trochę słabiej"}. Bez tego
              offline włącza się sam, gdy nie ma internetu.
            </span>
          </span>
        </label>
        {translator.offlineError ? (
          <p className="mt-1 text-xs text-red-700">{translator.offlineError}</p>
        ) : null}
        <button
          type="button"
          onClick={() => void translator.removeOffline()}
          className="mt-1 text-xs text-muted underline"
        >
          Usuń ten model z telefonu
        </button>
      </>
    );
  } else {
    const blocked = gemma && !translator.webgpu;
    body = (
      <div className="mt-2 text-xs text-muted">
        <p>
          {gemma
            ? `TranslateGemma (Google) tłumaczy wyraźnie lepiej, ale to ${GEMMA_MODEL.size} i liczy na karcie graficznej telefonu (WebGPU). Eksperyment: pierwsze uruchomienie trwa długo, telefon się grzeje.`
            : `NLLB (Meta) tłumaczy na procesorze telefonu: ok. ${OFFLINE_MODEL.size}, pobiera się raz.`}{" "}
          Najlepiej na Wi-Fi.
        </p>
        {blocked ? (
          <p className="mt-1 text-red-700">
            Ta przeglądarka nie obsługuje WebGPU — użyj Chrome na Androidzie.
          </p>
        ) : null}
        {translator.offlineError ? (
          <p className="mt-1 text-red-700">{translator.offlineError}</p>
        ) : null}
        <button
          type="button"
          disabled={blocked}
          onClick={() => void translator.downloadOffline().catch(() => {})}
          className="mt-1.5 h-9 rounded-md border border-line px-3 text-sm font-medium text-ink disabled:opacity-50"
        >
          Pobierz {gemma ? "TranslateGemma" : "tłumacza offline"}
        </button>
      </div>
    );
  }
  return (
    <>
      <EngineChoice translator={translator} />
      {body}
    </>
  );
}

/** Wpisz po polsku albo podaj telefon Tajowi — kierunek wynika z alfabetu. */
export function TranslatePanel({
  translator,
  speaker,
  onClose,
}: {
  translator: Translator;
  speaker: Speaker;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const from: Lang = hasThai(text) ? "th" : "pl";
  const to: Lang = from === "th" ? "pl" : "th";
  const live = useLiveTranslation(translator, text, from, to, 500);
  return (
    <section aria-label="Tłumacz" className="border-t border-line bg-surface px-3 py-3">
      <div className="flex items-center gap-2">
        <Languages className="size-4 text-muted" aria-hidden="true" />
        <p className="text-sm font-medium">
          Tłumacz{" "}
          <span className="text-muted">
            · {from === "pl" ? "polski → tajski" : "tajski → polski"}
          </span>
        </p>
        <button
          type="button"
          aria-label="Zamknij tłumacza"
          onClick={onClose}
          className="ml-auto grid size-8 place-items-center text-muted"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="relative mt-2">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={2}
          placeholder="Wpisz po polsku — albo daj Tajowi napisać po tajsku"
          aria-label="Tekst do przetłumaczenia"
          className="w-full resize-none rounded-md border border-line bg-bg px-3 py-2 pr-9 text-base outline-none focus:border-accent"
        />
        {text ? (
          <button
            type="button"
            aria-label="Wyczyść"
            onClick={() => setText("")}
            className="absolute top-2 right-2 text-muted"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      {text.trim() ? (
        <div className="mt-2 min-h-12">
          <p className="text-xs text-muted">
            <Via live={live} />
          </p>
          {live.result ? (
            to === "th" ? (
              <ThaiOut thai={politeThai(live.result.text, speaker, text.trim().endsWith("?"))} />
            ) : (
              <p className="text-xl leading-snug font-semibold">{live.result.text}</p>
            )
          ) : null}
        </div>
      ) : null}
      <details className="mt-3 border-t border-line pt-2">
        <summary className="cursor-pointer text-xs font-medium text-muted">
          Bez internetu{translator.downloaded ? " · tłumacz offline pobrany" : ""}
        </summary>
        <OfflineSetup translator={translator} />
        <p className="mt-2 text-xs text-muted">
          Z internetem tekst (nie nagranie) idzie do Google Tłumacza.
        </p>
      </details>
    </section>
  );
}
