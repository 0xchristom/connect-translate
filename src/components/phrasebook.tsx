import { useEffect, useMemo, useRef, useState } from "react";
import {
  BedDouble,
  Car,
  Delete,
  Hash,
  HeartPulse,
  MessageCircleReply,
  MessageSquare,
  Mic,
  Search,
  ShoppingBag,
  Star,
  Utensils,
  Volume2,
  Waypoints,
  X,
  Zap,
} from "lucide-react";
import {
  categories,
  polish,
  renderPhrase,
  type Answer,
  type Category,
  type Phrase,
  type Speaker,
} from "@/data/phrases";
import { coachWords, joins, sayLine } from "@/data/words";
import { onPlayError, onPlaying, playThai } from "@/lib/play-thai";
import { normalizePolish, sayNumber } from "@/lib/speech/intent";
import { useListener } from "@/lib/speech/use-listener";
import { ListenPanel } from "@/components/listen-panel";

const SPEAKER_KEY = "powiedz-speaker";
const FAV_KEY = "powiedz-favs";
const LAST_KEY = "powiedz-last";

const ICONS: Record<string, typeof Zap> = {
  szybkie: Zap,
  odpowiedzi: MessageCircleReply,
  jedzenie: Utensils,
  kierunki: Waypoints,
  transport: Car,
  zakupy: ShoppingBag,
  hotel: BedDouble,
  pomoc: HeartPulse,
  liczby: Hash,
  grzecznosc: MessageSquare,
};

type Located = Phrase & { categoryId: string; categoryName: string };

function allPhrases(): Located[] {
  return categories.flatMap((category) =>
    category.phrases.map((phrase) => ({
      ...phrase,
      categoryId: category.id,
      categoryName: category.name,
    })),
  );
}

/**
 * To samo zdanie stoi w kilku sekcjach pod różnymi id („Dziękuję” w Szybkich i w Grzeczności).
 * Ulubione zapisujemy pod pierwszym id, żeby gwiazdka była wszędzie taka sama.
 */
function canonicalIds(pool: Located[]) {
  const first = new Map<string, string>();
  const canonical = new Map<string, string>();
  for (const phrase of pool) {
    const key = phrase.th + "|" + phrase.pl;
    if (!first.has(key)) first.set(key, phrase.id);
    canonical.set(phrase.id, first.get(key)!);
  }
  return canonical;
}

function speakThai(text: string) {
  playThai(text);
}

/** Mniejsza czcionka dla długich zdań, żeby karta nie rozjeżdżała się na pół ekranu. */
function thaiSize(text: string, expanded: boolean) {
  const length = [...text].length;
  if (expanded)
    return length > 28
      ? "text-4xl md:text-5xl"
      : length > 16
        ? "text-5xl md:text-6xl"
        : "text-6xl md:text-7xl";
  return length > 28 ? "text-3xl" : length > 16 ? "text-4xl" : "text-5xl";
}

type WakeLock = { release: () => Promise<void> };

export function Phrasebook() {
  const pool = useMemo(allPhrases, []);
  const canonical = useMemo(() => canonicalIds(pool), [pool]);
  const favId = (id: string) => canonical.get(id) ?? id;
  const [speaker, setSpeaker] = useState<Speaker>("m");
  const [favs, setFavs] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState("szybkie");
  const [phraseId, setPhraseId] = useState(categories[0].phrases[0].id);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const listener = useListener();

  useEffect(() => onPlaying(setPlaying), []);
  useEffect(() => onPlayError(setPlayError), []);

  useEffect(() => {
    if (!playError) return;
    const timer = window.setTimeout(() => setPlayError(null), 4000);
    return () => window.clearTimeout(timer);
  }, [playError]);

  // „Pokaż osobie”: ekran nie gaśnie, kiedy rozmówca czyta.
  useEffect(() => {
    if (!expanded) return;
    let lock: WakeLock | null = null;
    let cancelled = false;
    const nav = navigator as Navigator & {
      wakeLock?: { request(type: "screen"): Promise<WakeLock> };
    };
    nav.wakeLock
      ?.request("screen")
      .then((value) => {
        if (cancelled) void value.release();
        else lock = value;
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      void lock?.release().catch(() => undefined);
    };
  }, [expanded]);

  useEffect(() => {
    const savedSpeaker = localStorage.getItem(SPEAKER_KEY);
    if (savedSpeaker === "m" || savedSpeaker === "f") setSpeaker(savedSpeaker);
    const savedFavs = localStorage.getItem(FAV_KEY);
    if (savedFavs) {
      try {
        const parsed = JSON.parse(savedFavs) as unknown;
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          const ids = parsed.map((id) => canonical.get(id) ?? id);
          setFavs(ids.filter((id, index) => ids.indexOf(id) === index));
        }
      } catch {
        /* ignore broken storage */
      }
    }
    const last = localStorage.getItem(LAST_KEY);
    if (last) {
      const found = pool.find((phrase) => phrase.id === last);
      if (found) {
        setPhraseId(found.id);
        setCategoryId(found.categoryId);
      }
    }
    setHydrated(true);
  }, [pool, canonical]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SPEAKER_KEY, speaker);
  }, [speaker, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  }, [favs, hydrated]);

  const favoritePhrases = useMemo(
    () =>
      favs
        .map((id) => pool.find((phrase) => phrase.id === id))
        .filter((phrase): phrase is Located => Boolean(phrase)),
    [favs, pool],
  );

  const activeCategory: Category | null =
    categoryId === "moje"
      ? { id: "moje", name: "Moje", phrases: favoritePhrases }
      : (categories.find((category) => category.id === categoryId) ?? categories[0]);

  // Szukanie bez ogonków („dziekuje” znajdzie „Dziękuję”); to samo zdanie z kilku sekcji
  // pokazujemy raz.
  const q = normalizePolish(query);
  const visible: Located[] = q
    ? pool.filter((phrase, index) => {
        const hit =
          normalizePolish(polish(phrase, "m")).includes(q) ||
          normalizePolish(polish(phrase, "f")).includes(q) ||
          normalizePolish(sayLine(phrase, speaker)).includes(q) ||
          phrase.th.replaceAll("{p}", "").includes(query.trim()) ||
          normalizePolish(phrase.categoryName).includes(q) ||
          normalizePolish(phrase.note ?? "").includes(q);
        return (
          hit &&
          pool.findIndex((other) => other.pl === phrase.pl && other.th === phrase.th) === index
        );
      })
    : activeCategory.phrases.map((phrase) => ({
        ...phrase,
        categoryId: activeCategory.id,
        categoryName: activeCategory.name,
      }));

  const current = pool.find((phrase) => phrase.id === phraseId) ?? pool[0];
  const spoken = renderPhrase(current, speaker);
  const howToSay = sayLine(current, speaker);
  const favored = favs.includes(favId(current.id));

  function openPhrase(phrase: Located) {
    setPhraseId(phrase.id);
    localStorage.setItem(LAST_KEY, phrase.id);
    if (phrase.categoryId !== "moje") setCategoryId(phrase.categoryId);
    scroller.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectCategory(id: string) {
    setQuery("");
    setSearchOpen(false);
    setCategoryId(id);
    const list =
      id === "moje"
        ? favoritePhrases
        : (categories.find((category) => category.id === id)?.phrases ?? []);
    const first = list[0];
    if (!first) return;
    setPhraseId(first.id);
    localStorage.setItem(LAST_KEY, first.id);
    scroller.current?.scrollTo({ top: 0 });
  }

  function step(delta: number) {
    if (visible.length === 0) return;
    const index = visible.findIndex((phrase) => phrase.id === current.id);
    // Bieżącego zdania nie ma na liście (np. po zmianie wyszukiwania) — zaczynamy od brzegu.
    const next =
      index === -1
        ? visible[delta > 0 ? 0 : visible.length - 1]
        : visible[(index + delta + visible.length) % visible.length];
    openPhrase(next);
  }

  function openById(id: string) {
    const phrase = pool.find((item) => item.id === id);
    if (!phrase) return;
    setQuery("");
    setSearchOpen(false);
    setExpanded(false);
    openPhrase(phrase);
  }

  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) {
        if (event.key === "Escape") (target as HTMLElement).blur();
        return;
      }
      if (event.key === "ArrowRight") stepRef.current(1);
      else if (event.key === "ArrowLeft") stepRef.current(-1);
      else if (event.key === "Escape") {
        setExpanded(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Aktywna sekcja w dolnym pasku zawsze widoczna, nawet gdy pasek jest przewinięty.
  useEffect(() => {
    dock.current
      ?.querySelector<HTMLElement>("[aria-current='page']")
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [categoryId, hydrated]);

  function toggleFav(phraseId: string) {
    const id = favId(phraseId);
    setFavs((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev]));
  }

  let lastGroup = "";

  return (
    <main className="mx-auto flex h-dvh max-w-5xl flex-col bg-bg text-ink">
      <div
        ref={scroller}
        className={
          "flex min-h-0 flex-1 flex-col " +
          (expanded ? "overflow-hidden" : "overflow-y-auto md:flex-row md:overflow-hidden")
        }
      >
        <section
          className={
            "flex shrink-0 flex-col bg-card text-card-fg " +
            (expanded
              ? "min-h-0 flex-1 justify-center-safe overflow-y-auto"
              : "md:w-[46%] md:overflow-y-auto")
          }
          onTouchStart={(event) => {
            const touch = event.touches[0];
            swipe.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchEnd={(event) => {
            const start = swipe.current;
            swipe.current = null;
            if (!start) return;
            const touch = event.changedTouches[0];
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            // Przesunięcie palcem po karcie = poprzednie / następne zdanie.
            if (Math.abs(dx) > 60 && Math.abs(dy) < 40) step(dx < 0 ? 1 : -1);
          }}
        >
          <div key={current.id + speaker} className="phrase-in px-4 pt-3 pb-2">
            <div className={"flex items-center gap-2 " + (expanded ? "hidden" : "")}>
              <div className="flex rounded-md bg-white/10 p-0.5" role="group" aria-label="Kto mówi">
                <button
                  type="button"
                  aria-pressed={speaker === "m"}
                  className={
                    "h-8 rounded-sm px-2.5 text-xs font-medium " +
                    (speaker === "m" ? "bg-accent-fg text-ink" : "text-card-muted")
                  }
                  onClick={() => setSpeaker("m")}
                >
                  Mężczyzna
                </button>
                <button
                  type="button"
                  aria-pressed={speaker === "f"}
                  className={
                    "h-8 rounded-sm px-2.5 text-xs font-medium " +
                    (speaker === "f" ? "bg-accent-fg text-ink" : "text-card-muted")
                  }
                  onClick={() => setSpeaker("f")}
                >
                  Kobieta
                </button>
              </div>
              <div className="ml-auto flex">
                <button
                  type="button"
                  aria-label={listener.status === "off" ? "Słuchaj rozmowy" : "Wyłącz słuchanie"}
                  aria-pressed={listener.status !== "off"}
                  onClick={() => (listener.status === "off" ? listener.open() : listener.stop())}
                  className={
                    "relative grid size-10 place-items-center rounded-md " +
                    (listener.status === "listening" || listener.status === "loading"
                      ? "bg-red-500/20 text-red-200"
                      : "")
                  }
                >
                  <Mic className="size-5" />
                  {listener.status === "listening" ? (
                    <span
                      className="absolute top-2 right-2 size-2 animate-pulse rounded-full bg-red-400"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
                <button
                  type="button"
                  aria-label="Szukaj"
                  aria-pressed={searchOpen || Boolean(query)}
                  onClick={() => setSearchOpen((open) => !open)}
                  className="grid size-10 place-items-center rounded-md"
                >
                  <Search className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={favored ? "Usuń z moich" : "Zapisz w moich"}
                  onClick={() => toggleFav(current.id)}
                  className="grid size-10 place-items-center rounded-md"
                >
                  <Star className="size-5" fill={favored ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
            {searchOpen || query ? (
              <label className="mt-2 flex h-10 items-center gap-2 rounded-md bg-white/10 px-3">
                <Search className="size-4 shrink-0 text-card-muted" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Szukaj zdania"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-card-muted"
                  aria-label="Szukaj zdania"
                  autoFocus
                />
                {query ? (
                  <button type="button" aria-label="Wyczyść" onClick={() => setQuery("")}>
                    <X className="size-4 text-card-muted" />
                  </button>
                ) : null}
              </label>
            ) : null}
            <p className="mt-3 text-sm text-card-muted">{polish(current, speaker)}</p>
            <p
              lang="th"
              className={
                "mt-2 text-center font-medium leading-tight text-balance " +
                thaiSize(spoken.thai, expanded)
              }
            >
              {spoken.thai}
            </p>
            <p className="mt-3 text-center text-base font-medium">Powiedz: {howToSay}</p>
            <p className="text-center text-sm text-card-muted">{spoken.pron}</p>
            {current.note ? (
              <p className="mt-1 text-center text-sm text-card-muted">{current.note}</p>
            ) : null}
            <Answers key={current.id} phrase={current} expanded={expanded} />
          </div>
          <div className="grid grid-cols-3 gap-2 px-3 pb-3">
            <button
              type="button"
              className="h-11 rounded-md bg-white/10 text-sm font-medium"
              onClick={() => step(-1)}
            >
              Poprzednie
            </button>
            <button
              type="button"
              aria-label={playing === spoken.thai ? "Zatrzymaj nagranie" : "Posłuchaj po tajsku"}
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-accent-fg text-sm font-medium text-ink"
              onClick={() => playThai(spoken.thai)}
            >
              <Volume2 className="size-4" aria-hidden="true" />
              {playing === spoken.thai ? "Stop" : "Posłuchaj"}
            </button>
            <button
              type="button"
              className="h-11 rounded-md bg-white/10 text-sm font-medium"
              onClick={() => step(1)}
            >
              Następne
            </button>
            <button
              type="button"
              className="col-span-3 h-11 rounded-md border border-card-muted/40 text-sm font-medium"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Wróć do listy" : "Pokaż osobie — cały ekran"}
            </button>
            {playError ? (
              <p role="status" className="col-span-3 text-center text-xs text-card-muted">
                {playError}
              </p>
            ) : null}
          </div>
        </section>

        <section
          className={
            expanded
              ? "hidden md:block md:min-h-0 md:flex-1 md:overflow-y-auto"
              : "md:min-h-0 md:flex-1 md:overflow-y-auto"
          }
        >
          <WordCoach key={current.id + speaker} phrase={current} speaker={speaker} />
          {visible.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              {categoryId === "moje" && !q
                ? "Stuknij gwiazdkę przy zdaniu na liście, a trafi tutaj — pod ręką na rozmowę."
                : "Nic nie pasuje. Spróbuj innego słowa."}
            </p>
          ) : categoryId === "liczby" && !q ? (
            <NumberPad
              phrases={visible}
              currentId={current.id}
              speaker={speaker}
              onPick={openPhrase}
            />
          ) : (
            <ul>
              {visible.map((phrase) => {
                const showGroup = !q && phrase.group && phrase.group !== lastGroup;
                if (phrase.group) lastGroup = phrase.group;
                const active = phrase.id === current.id;
                return (
                  <li key={phrase.id + phrase.categoryId}>
                    {showGroup ? (
                      <p className="px-4 pt-4 pb-1 text-xs font-medium tracking-wide text-muted">
                        {phrase.group}
                      </p>
                    ) : null}
                    <div
                      className={
                        "flex items-stretch border-b border-line " +
                        (active ? "bg-accent text-accent-fg" : "bg-surface")
                      }
                    >
                      <button
                        type="button"
                        onClick={() => openPhrase(phrase)}
                        aria-current={active ? "true" : undefined}
                        className="flex min-w-0 flex-1 items-center gap-3 py-3.5 pl-4 text-left"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-base font-medium">
                            {polish(phrase, speaker)}
                          </span>
                          <span
                            className={
                              "block text-sm " + (active ? "text-accent-fg/80" : "text-muted")
                            }
                          >
                            {sayLine(phrase, speaker)}
                          </span>
                        </span>
                        {q ? (
                          <span
                            className={
                              "shrink-0 text-xs " + (active ? "text-accent-fg/80" : "text-muted")
                            }
                          >
                            {phrase.categoryName}
                          </span>
                        ) : null}
                      </button>
                      <StarButton
                        on={favs.includes(favId(phrase.id))}
                        label={polish(phrase, speaker)}
                        muted={!active}
                        onClick={() => toggleFav(phrase.id)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {expanded ? null : (
        <ListenPanel
          listener={listener}
          speaker={speaker}
          onOpenPhrase={openById}
          onOpenCategory={selectCategory}
        />
      )}

      {expanded ? (
        <div className="flex gap-2 overflow-x-auto border-t border-line bg-surface px-2 py-2 md:hidden">
          {visible.map((phrase) => {
            const active = phrase.id === current.id;
            return (
              <button
                key={phrase.id}
                type="button"
                onClick={() => openPhrase(phrase)}
                className={
                  "h-11 shrink-0 rounded-md px-3 text-sm font-medium " +
                  (active ? "bg-accent text-accent-fg" : "text-ink")
                }
              >
                {polish(phrase, speaker)}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 overflow-x-auto border-t border-line bg-bg px-3 py-1 text-xs text-muted">
            {joins.map((item) => (
              <button
                key={item.pl}
                type="button"
                onClick={() => playThai(item.th)}
                className="shrink-0"
                title={item.gloss}
              >
                <span className="font-medium text-ink">{item.pl}</span> {item.th} {item.say}
              </button>
            ))}
          </div>

          <nav
            ref={dock}
            aria-label="Sekcje"
            className="flex gap-1 overflow-x-auto border-t border-line bg-surface px-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1"
          >
            <DockButton
              label="Moje"
              active={categoryId === "moje" && !q}
              onClick={() => selectCategory("moje")}
              icon={Star}
            />
            {categories.map((category) => (
              <DockButton
                key={category.id}
                label={category.name}
                active={categoryId === category.id && !q}
                onClick={() => selectCategory(category.id)}
                icon={ICONS[category.id] ?? Zap}
              />
            ))}
          </nav>
        </>
      )}
    </main>
  );
}

function NumberPad({
  phrases,
  currentId,
  speaker,
  onPick,
}: {
  phrases: Located[];
  currentId: string;
  speaker: Speaker;
  onPick: (phrase: Located) => void;
}) {
  const chunks: { group: string; items: Located[] }[] = [];
  for (const phrase of phrases) {
    const group = phrase.group ?? "";
    const last = chunks[chunks.length - 1];
    if (!last || last.group !== group) chunks.push({ group, items: [phrase] });
    else last.items.push(phrase);
  }
  return (
    <div className="px-3 py-3">
      <NumberInput />
      {chunks.map((chunk) => {
        const wide = chunk.items.some((item) => item.pl.length > 2);
        return (
          <div key={chunk.group} className="mb-4">
            {chunk.group ? (
              <p className="pb-2 text-xs font-medium tracking-wide text-muted">{chunk.group}</p>
            ) : null}
            <div className={"grid gap-2 " + (wide ? "grid-cols-4" : "grid-cols-5")}>
              {chunk.items.map((phrase) => {
                const active = phrase.id === currentId;
                return (
                  <button
                    key={phrase.id}
                    type="button"
                    onClick={() => onPick(phrase)}
                    className={
                      "flex h-16 flex-col items-center justify-center rounded-md px-1 " +
                      (active ? "bg-accent text-accent-fg" : "bg-surface text-ink")
                    }
                  >
                    <span className="text-lg font-medium leading-none">{phrase.pl}</span>
                    <span
                      className={
                        "mt-1 max-w-full truncate text-xs " +
                        (active ? "text-accent-fg/80" : "text-muted")
                      }
                    >
                      {sayLine(phrase, speaker)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StarButton({
  on,
  label,
  muted,
  onClick,
}: {
  on: boolean;
  label: string;
  muted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={(on ? "Usuń z moich: " : "Zapisz w moich: ") + label}
      onClick={onClick}
      className={
        "grid w-12 shrink-0 place-items-center " +
        (on ? "text-amber-500" : muted ? "text-muted/60" : "text-accent-fg/70")
      }
    >
      <Star className="size-5" fill={on ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}

/**
 * Gdy angielski nie działa, odpowiedź też musi przejść przez ekran: rozmówca czyta pytanie
 * po tajsku i stuka gotową odpowiedź albo wpisuje cenę, a my widzimy ją po polsku.
 */
function Answers({ phrase, expanded }: { phrase: Phrase; expanded: boolean }) {
  const [picked, setPicked] = useState<Answer | null>(null);
  const [digits, setDigits] = useState("");
  const answers = phrase.answers ?? [];
  if (answers.length === 0 && !phrase.price) return null;

  if (!expanded) {
    return (
      <div className="mt-3 border-t border-white/10 pt-2">
        <p className="text-xs text-card-muted">
          Może odpowiedzieć
          {phrase.price ? " · cenę wpisze w trybie „Pokaż osobie”" : ""}
        </p>
        {answers.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {answers.map((answer) => (
              <button
                key={answer.th}
                type="button"
                onClick={() => playThai(answer.th)}
                className="rounded-md bg-white/10 px-2 py-1 text-left text-xs"
              >
                <span lang="th" className="font-medium">
                  {answer.th}
                </span>{" "}
                <span className="text-card-muted">{answer.pl}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const amount = Number(digits);
  const said = digits ? sayNumber(amount) : null;
  return (
    <div className="mx-auto mt-5 max-w-md">
      {/* Pierwsza linijka jest dla rozmówcy, druga dla nas. */}
      <p lang="th" className="text-center text-lg font-medium">
        {phrase.price ? "พิมพ์ราคาได้เลย" : "แตะคำตอบได้เลย"}
      </p>
      <p className="text-center text-xs text-card-muted">
        {phrase.price ? "Rozmówca wpisuje cenę" : "Rozmówca stuka odpowiedź"}
      </p>
      {answers.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {answers.map((answer) => {
            const active = picked?.th === answer.th;
            return (
              <button
                key={answer.th}
                type="button"
                aria-pressed={active}
                onClick={() => setPicked(answer)}
                className={
                  "min-h-14 rounded-md px-2 py-2 text-center " +
                  (active ? "bg-accent-fg text-ink" : "bg-white/10")
                }
              >
                <span lang="th" className="block text-xl font-medium leading-tight">
                  {answer.th}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
      {picked ? (
        <p role="status" className="mt-3 text-center text-2xl font-semibold">
          {picked.pl}
        </p>
      ) : null}
      {phrase.price ? (
        <div className="mt-3">
          <p
            role="status"
            className="flex h-14 items-center justify-center gap-2 rounded-md bg-white/10 text-3xl font-semibold tabular-nums"
          >
            {digits || "–"}
            <span lang="th" className="text-xl font-medium">
              บาท
            </span>
          </p>
          {said ? (
            <p className="mt-1 text-center text-sm text-card-muted">
              {amount.toLocaleString("pl-PL")} bahtów · {said.say}
            </p>
          ) : null}
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setDigits((value) => (value + key).replace(/^0+/, "").slice(0, 6))}
                className="h-12 rounded-md bg-white/10 text-xl font-medium tabular-nums"
              >
                {key}
              </button>
            ))}
            <button
              type="button"
              aria-label="Usuń cyfrę"
              onClick={() => setDigits((value) => value.slice(0, -1))}
              className="grid h-12 place-items-center rounded-md bg-white/10"
            >
              <Delete className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Ceny rzadko są okrągłe: dowolną kwotę składamy z tajskich słów liczbowych. */
function NumberInput() {
  const [digits, setDigits] = useState("");
  const said = digits ? sayNumber(Number(digits)) : null;
  const thai = said ? said.th + "บาท" : "";
  return (
    <div className="mb-4 rounded-md bg-surface p-3">
      <label className="block text-xs font-medium text-muted" htmlFor="any-number">
        Dowolna kwota — wpisz cyfry
      </label>
      <input
        id="any-number"
        inputMode="numeric"
        autoComplete="off"
        value={digits}
        onChange={(event) =>
          setDigits(
            event.target.value
              .replace(/[^0-9]/g, "")
              .replace(/^0+/, "")
              .slice(0, 6),
          )
        }
        placeholder="np. 350"
        className="mt-1 h-11 w-full rounded-md border border-line bg-bg px-3 text-lg tabular-nums outline-none focus:border-accent"
      />
      {said ? (
        <button
          type="button"
          onClick={() => playThai(thai)}
          className="mt-2 flex w-full items-center gap-3 rounded-md bg-bg px-3 py-2 text-left"
        >
          <Volume2 className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-base font-medium">{said.say} bat</span>
            <span lang="th" className="block text-sm text-muted">
              {thai}
            </span>
          </span>
        </button>
      ) : null}
    </div>
  );
}

function WordCoach({ phrase, speaker }: { phrase: Phrase; speaker: Speaker }) {
  const words = coachWords(phrase, speaker);
  const [index, setIndex] = useState(0);
  const word = words[index];
  if (!word) return null;
  return (
    <div className="border-b border-line bg-surface px-3 py-3">
      <p className="text-xs font-medium text-muted">Jak powiedzieć — stuknij słowo</p>
      <div className="mt-2 flex gap-2 overflow-x-auto">
        {words.map((item, i) => (
          <button
            key={item.th + String(i)}
            type="button"
            onClick={() => {
              setIndex(i);
              speakThai(item.th);
            }}
            className={
              "h-14 shrink-0 rounded-md px-3 text-left " +
              (i === index ? "bg-accent text-accent-fg" : "bg-bg text-ink")
            }
          >
            <span className="block text-sm font-medium">{item.say}</span>
            <span
              lang="th"
              className={"block text-xs " + (i === index ? "text-accent-fg/80" : "text-muted")}
            >
              {item.th}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm">{word.gloss}</p>
    </div>
  );
}

function DockButton({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: typeof Zap;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={
        "flex h-12 min-w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md px-2 text-xs font-medium " +
        (active ? "bg-accent text-accent-fg" : "text-muted")
      }
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
