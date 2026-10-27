import { ArrowRight, Check, Loader2, Mic, MicOff, Volume2, X } from "lucide-react";
import { categories, renderPhrase, type Speaker } from "@/data/phrases";
import { sayLine } from "@/data/words";
import { playThai } from "@/lib/play-thai";
import { MODELS } from "@/lib/speech/asr-protocol";
import { sayNumber } from "@/lib/speech/intent";
import { matcher, type Heard, type ListenMode, type Listener } from "@/lib/speech/use-listener";

const MODES: { id: ListenMode; label: string; hint: string }[] = [
  { id: "th", label: "Taj mówi", hint: "Tylko tajski" },
  { id: "pl", label: "Ja mówię", hint: "Powiedz po polsku, co chcesz przekazać" },
];

function categoryName(id: string | null) {
  return categories.find((category) => category.id === id)?.name ?? null;
}

function megabytes(bytes: number) {
  return Math.round(bytes / 1e6);
}

function duration(seconds: number) {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} s`;
  return `${Math.round(seconds / 60)} min`;
}

function loadingTitle(listener: Listener, percent: number | null) {
  if (listener.stage === "init") return "Uruchamiam model…";
  if (percent === null) return "Łączę się z serwerem modeli…";
  return `Pobieram model… ${percent}%`;
}

function loadingDetail(listener: Listener) {
  const { progress, stage, elapsed, stalled, downloaded } = listener;
  if (stage === "init") {
    return elapsed < 8
      ? "Ładuję model do pamięci telefonu."
      : `Ładuję model do pamięci telefonu (${elapsed} s). Na starszych telefonach trwa to do minuty.`;
  }
  if (stalled) return "Pobieranie stoi. Sprawdź internet albo spróbuj ponownie.";
  if (!progress || progress.total === 0) {
    return downloaded ? "Wczytuję model zapisany w telefonie." : "Za chwilę ruszy pobieranie.";
  }
  const parts = [`${megabytes(progress.loaded)} z ${megabytes(progress.total)} MB`];
  if (progress.rate > 0) {
    parts.push(`${(progress.rate / 1e6).toFixed(1).replace(".", ",")} MB/s`);
    const left = (progress.total - progress.loaded) / progress.rate;
    if (left > 1) parts.push(`zostało ok. ${duration(left)}`);
  }
  return parts.join(" · ") + ". Pobiera się tylko raz — potem działa bez internetu.";
}

export function ListenPanel({
  listener,
  speaker,
  onOpenPhrase,
  onOpenCategory,
}: {
  listener: Listener;
  speaker: Speaker;
  onOpenPhrase: (id: string) => void;
  onOpenCategory: (id: string) => void;
}) {
  const { status } = listener;
  if (status === "off") return null;
  if (status === "setup" || status === "error") return <Setup listener={listener} />;

  const [latest, ...older] = listener.history;
  const percent =
    listener.progress && listener.progress.total > 0
      ? Math.round((listener.progress.loaded / listener.progress.total) * 100)
      : null;

  return (
    <section
      aria-label="Podpowiedzi z rozmowy"
      className="listen-in max-h-[46dvh] shrink-0 overflow-y-auto border-t border-line bg-surface md:max-h-[40dvh]"
    >
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-line bg-surface/95 px-3 py-2 backdrop-blur">
        <StatusDot listener={listener} />
        <p className="min-w-0 flex-1 truncate text-sm font-medium" aria-live="polite">
          {status === "loading"
            ? loadingTitle(listener, percent)
            : listener.busy
              ? "Rozpoznaję…"
              : listener.speaking
                ? "Słyszę mowę…"
                : "Słucham"}
        </p>
        <div className="flex rounded-md bg-bg p-0.5" role="radiogroup" aria-label="Kto mówi">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={listener.mode === item.id}
              title={item.hint}
              onClick={() => listener.setMode(item.id)}
              className={
                "h-8 rounded-sm px-2 text-xs font-medium " +
                (listener.mode === item.id ? "bg-accent text-accent-fg" : "text-muted")
              }
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Wyłącz słuchanie"
          onClick={listener.stop}
          className="grid size-9 place-items-center rounded-md text-muted"
        >
          <X className="size-4" />
        </button>
      </div>

      {status === "loading" ? (
        <div className="px-3 py-3">
          <div
            role="progressbar"
            aria-label={loadingTitle(listener, percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={listener.stage === "download" && percent !== null ? percent : undefined}
            className="h-1.5 overflow-hidden rounded-full bg-line"
          >
            {listener.stage === "download" && percent !== null ? (
              <div
                className={
                  "h-full rounded-full transition-[width] duration-300 " +
                  (listener.stalled ? "bg-amber-500" : "bg-accent")
                }
                style={{ width: `${Math.min(Math.max(percent, 2), 100)}%` }}
              />
            ) : (
              // Czasu ładowania do pamięci nie da się zmierzyć — pasek pokazuje, że coś się dzieje.
              <div className="progress-indeterminate h-full w-1/3 rounded-full bg-accent" />
            )}
          </div>
          <p className="mt-2 text-xs text-muted">{loadingDetail(listener)}</p>
          {listener.stalled ? (
            <button
              type="button"
              onClick={listener.retry}
              className="mt-2 h-8 rounded-md border border-line px-3 text-xs font-medium"
            >
              Spróbuj ponownie
            </button>
          ) : null}
        </div>
      ) : null}

      {listener.error ? <p className="px-3 pt-2 text-xs text-red-700">{listener.error}</p> : null}

      {listener.mode === "pl" && MODELS.find((item) => item.id === listener.model)?.thaiOnly ? (
        <p className="flex items-center gap-2 px-3 pt-2 text-xs text-muted">
          Model tajski słabo rozumie polski.
          <button
            type="button"
            className="font-medium text-accent underline"
            onClick={() => listener.setModel(MODELS.find((item) => !item.thaiOnly)!.id)}
          >
            Przełącz na Uniwersalny
          </button>
        </p>
      ) : null}

      {latest ? (
        <HeardCard
          heard={latest}
          speaker={speaker}
          onOpenPhrase={onOpenPhrase}
          onOpenCategory={onOpenCategory}
        />
      ) : status === "listening" ? (
        <p className="px-3 py-4 text-sm text-muted">
          {listener.mode === "pl"
            ? "Powiedz po polsku, co chcesz przekazać — znajdę zdanie."
            : "Podsuń telefon rozmówcy. Gdy coś powie po tajsku, podpowiem sekcję i gotowe odpowiedzi."}
        </p>
      ) : null}

      {older.length > 0 ? (
        <details className="border-t border-line px-3 py-2">
          <summary className="cursor-pointer text-xs font-medium text-muted">
            Wcześniej ({older.length})
          </summary>
          <ul className="mt-1">
            {older.map((item) => (
              <li key={item.id} className="flex items-center gap-2 py-1.5 text-sm">
                <span lang="th" className="min-w-0 flex-1 truncate">
                  {item.text}
                </span>
                {item.suggestion?.meaning ? (
                  <span className="shrink-0 text-xs text-muted">{item.suggestion.meaning}</span>
                ) : null}
                {item.suggestion?.categoryId ? (
                  <button
                    type="button"
                    className="shrink-0 rounded-sm px-1.5 text-xs font-medium text-accent"
                    onClick={() => openSuggestion(item, onOpenPhrase, onOpenCategory)}
                  >
                    Otwórz
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-1 text-xs text-muted underline"
            onClick={listener.clear}
          >
            Wyczyść historię
          </button>
        </details>
      ) : null}
    </section>
  );
}

function openSuggestion(
  heard: Heard,
  onOpenPhrase: (id: string) => void,
  onOpenCategory: (id: string) => void,
) {
  const suggestion = heard.suggestion;
  if (!suggestion?.categoryId) return;
  const first = suggestion.phraseIds.find(
    (id) => matcher.phraseById(id)?.categoryId === suggestion.categoryId,
  );
  if (first) onOpenPhrase(first);
  else onOpenCategory(suggestion.categoryId);
}

function HeardCard({
  heard,
  speaker,
  onOpenPhrase,
  onOpenCategory,
}: {
  heard: Heard;
  speaker: Speaker;
  onOpenPhrase: (id: string) => void;
  onOpenCategory: (id: string) => void;
}) {
  const suggestion = heard.suggestion;
  const section = categoryName(suggestion?.categoryId ?? null);
  return (
    <div key={heard.id} className="phrase-in px-3 py-3">
      <p className="text-xs text-muted">Usłyszane</p>
      <p lang={suggestion?.lang ?? "th"} className="text-lg leading-snug font-medium">
        {heard.text}
      </p>
      {suggestion?.meaning ? (
        <p className="mt-0.5 text-sm">
          <span className="text-muted">Znaczy mniej więcej: </span>
          <span className="font-medium">{suggestion.meaning}</span>
        </p>
      ) : (
        <p className="mt-0.5 text-sm text-muted">
          Nie wiem, o co chodzi. Pokaż „Możesz powtórzyć?” albo poproś o zapisanie.
        </p>
      )}

      {suggestion?.numbers.map((value) => {
        const said = sayNumber(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => said && playThai(said.th)}
            className="mt-2 flex w-full items-center gap-3 rounded-md bg-bg px-3 py-2 text-left"
          >
            <span className="text-2xl font-semibold tabular-nums">
              {value.toLocaleString("pl-PL")}
            </span>
            {said ? (
              <span className="min-w-0 flex-1 text-sm">
                <span lang="th" className="block truncate">
                  {said.th}
                </span>
                <span className="block text-xs text-muted">{said.say}</span>
              </span>
            ) : null}
            <Volume2 className="size-4 shrink-0 text-muted" aria-label="Posłuchaj liczby" />
          </button>
        );
      })}

      {section && suggestion?.categoryId ? (
        <button
          type="button"
          onClick={() => openSuggestion(heard, onOpenPhrase, onOpenCategory)}
          className="mt-3 flex h-11 w-full items-center justify-between rounded-md bg-accent px-3 text-sm font-medium text-accent-fg"
        >
          <span>
            Sekcja: {section}
            {suggestion.group ? (
              <span className="text-accent-fg/75"> › {suggestion.group}</span>
            ) : null}
          </span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      ) : (
        <div className="mt-3 flex gap-2">
          {["repeat", "slow", "write-down"].map((id) => (
            <ReplyChip key={id} id={id} speaker={speaker} onOpenPhrase={onOpenPhrase} compact />
          ))}
        </div>
      )}

      {suggestion && suggestion.phraseIds.length > 0 ? (
        <>
          <p className="mt-3 text-xs font-medium text-muted">Możesz odpowiedzieć</p>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {suggestion.phraseIds.map((id) => (
              <ReplyChip key={id} id={id} speaker={speaker} onOpenPhrase={onOpenPhrase} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function ReplyChip({
  id,
  speaker,
  onOpenPhrase,
  compact,
}: {
  id: string;
  speaker: Speaker;
  onOpenPhrase: (id: string) => void;
  compact?: boolean;
}) {
  const phrase = matcher.phraseById(id);
  if (!phrase) return null;
  const thai = renderPhrase(phrase, speaker).thai;
  return (
    <div className={"flex min-w-0 items-stretch rounded-md bg-bg " + (compact ? "flex-1" : "")}>
      <button
        type="button"
        onClick={() => onOpenPhrase(id)}
        className="min-w-0 flex-1 px-2.5 py-2 text-left"
      >
        <span className="block truncate text-sm font-medium">{phrase.pl}</span>
        {compact ? null : (
          <span className="block truncate text-xs text-muted">{sayLine(phrase, speaker)}</span>
        )}
      </button>
      <button
        type="button"
        aria-label={"Posłuchaj: " + phrase.pl}
        onClick={() => playThai(thai)}
        className="grid w-9 shrink-0 place-items-center text-muted"
      >
        <Volume2 className="size-4" />
      </button>
    </div>
  );
}

function StatusDot({ listener }: { listener: Listener }) {
  if (listener.status === "loading" || listener.busy)
    return <Loader2 className="size-4 shrink-0 animate-spin text-muted" aria-hidden="true" />;
  return (
    <span className="relative grid size-4 shrink-0 place-items-center" aria-hidden="true">
      <span
        className="absolute inset-0 rounded-full bg-red-500/30 transition-transform duration-100"
        style={{ transform: `scale(${0.6 + listener.level * 0.9})` }}
      />
      <span
        className={"size-2 rounded-full " + (listener.speaking ? "bg-red-500" : "bg-red-400/70")}
      />
    </span>
  );
}

function Setup({ listener }: { listener: Listener }) {
  return (
    <section
      aria-label="Włącz podpowiedzi z rozmowy"
      className="listen-in max-h-[70dvh] shrink-0 overflow-y-auto border-t border-line bg-surface px-4 py-4"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
          <Mic className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">Podpowiedzi z rozmowy</h2>
          <p className="mt-1 text-sm text-muted">
            Telefon słucha, co mówi rozmówca, i od razu podsuwa sekcję oraz gotowe odpowiedzi.
            Możesz też powiedzieć po polsku, co chcesz przekazać.
          </p>
        </div>
        <button
          type="button"
          aria-label="Zamknij"
          onClick={listener.stop}
          className="grid size-9 shrink-0 place-items-center rounded-md text-muted"
        >
          <X className="size-4" />
        </button>
      </div>

      <ul className="mt-3 space-y-1.5 text-sm">
        <li className="flex gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          Rozpoznawanie działa na tym telefonie (model Whisper). Nagrania nigdzie nie wychodzą.
        </li>
        <li className="flex gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          Model pobiera się raz, potem działa bez internetu.
        </li>
      </ul>

      <fieldset className="mt-4">
        <legend className="text-xs font-medium text-muted">Model mowy</legend>
        <div className="mt-1.5 grid gap-2">
          {MODELS.map((item) => {
            const active = listener.model === item.id;
            return (
              <label
                key={item.id}
                className={
                  "flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 " +
                  (active ? "border-accent bg-accent/5" : "border-line")
                }
              >
                <input
                  type="radio"
                  name="asr-model"
                  className="mt-1 accent-[var(--color-accent)]"
                  checked={active}
                  onChange={() => listener.setModel(item.id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {item.label}
                    <span className="text-xs font-normal text-muted">{item.size}</span>
                    {active && listener.downloaded ? (
                      <span className="rounded-sm bg-accent/10 px-1.5 text-xs font-normal text-accent">
                        pobrany
                      </span>
                    ) : null}
                  </span>
                  <span className="block text-xs text-muted">{item.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {listener.error ? (
        <p
          role="alert"
          className="mt-3 flex gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          <MicOff className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {listener.error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void listener.start()}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-semibold text-accent-fg"
      >
        <Mic className="size-4" aria-hidden="true" />
        {listener.status === "error" ? "Spróbuj jeszcze raz" : "Włącz mikrofon i słuchaj"}
      </button>
    </section>
  );
}
