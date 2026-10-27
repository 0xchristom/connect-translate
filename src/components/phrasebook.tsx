import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Car,
  Hash,
  HeartPulse,
  MessageSquare,
  Search,
  ShoppingBag,
  Star,
  Utensils,
  Volume2,
  Waypoints,
  X,
  Zap,
} from "lucide-react";
import { categories, renderPhrase, type Category, type Phrase, type Speaker } from "@/data/phrases";
import { coachWords, joins, sayLine } from "@/data/words";
import { onPlayError, onPlaying, playThai } from "@/lib/play-thai";

const SPEAKER_KEY = "powiedz-speaker";
const FAV_KEY = "powiedz-favs";
const LAST_KEY = "powiedz-last";

const ICONS: Record<string, typeof Zap> = {
  szybkie: Zap,
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

function speakThai(text: string) {
  playThai(text);
}

export function Phrasebook() {
  const pool = useMemo(allPhrases, []);
  const [speaker, setSpeaker] = useState<Speaker>("m");
  const [favs, setFavs] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState("szybkie");
  const [phraseId, setPhraseId] = useState(categories[0].phrases[0].id);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);

  useEffect(() => onPlaying(setPlaying), []);
  useEffect(() => onPlayError(setPlayError), []);

  useEffect(() => {
    const savedSpeaker = localStorage.getItem(SPEAKER_KEY);
    if (savedSpeaker === "m" || savedSpeaker === "f") setSpeaker(savedSpeaker);
    const savedFavs = localStorage.getItem(FAV_KEY);
    if (savedFavs) {
      try {
        const parsed = JSON.parse(savedFavs) as unknown;
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          setFavs(parsed);
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
  }, [pool]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SPEAKER_KEY, speaker);
  }, [speaker, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  }, [favs, hydrated]);

  const favoritePhrases = useMemo(
    () => favs.map((id) => pool.find((phrase) => phrase.id === id)).filter((phrase): phrase is Located => Boolean(phrase)),
    [favs, pool],
  );

  const activeCategory: Category | null =
    categoryId === "moje"
      ? { id: "moje", name: "Moje", phrases: favoritePhrases }
      : (categories.find((category) => category.id === categoryId) ?? categories[0]);

  const q = query.trim().toLowerCase();
  const visible: Located[] = q
    ? pool.filter(
        (phrase) =>
          phrase.pl.toLowerCase().includes(q) ||
          sayLine(phrase, speaker).toLowerCase().includes(q) ||
          phrase.th.replaceAll("{p}", "").includes(query.trim()) ||
          phrase.categoryName.toLowerCase().includes(q),
      )
    : activeCategory.phrases.map((phrase) => ({
        ...phrase,
        categoryId: activeCategory.id,
        categoryName: activeCategory.name,
      }));

  const current = pool.find((phrase) => phrase.id === phraseId) ?? pool[0];
  const spoken = renderPhrase(current, speaker);
  const howToSay = sayLine(current, speaker);
  const favored = favs.includes(current.id);

  function openPhrase(phrase: Located) {
    setPhraseId(phrase.id);
    localStorage.setItem(LAST_KEY, phrase.id);
    if (phrase.categoryId !== "moje") setCategoryId(phrase.categoryId);
  }

  function selectCategory(id: string) {
    setQuery("");
    setCategoryId(id);
    const list = id === "moje" ? favoritePhrases : (categories.find((category) => category.id === id)?.phrases ?? []);
    const first = list[0];
    if (!first) return;
    setPhraseId(first.id);
    localStorage.setItem(LAST_KEY, first.id);
  }

  function step(delta: number) {
    if (visible.length === 0) return;
    const index = Math.max(0, visible.findIndex((phrase) => phrase.id === current.id));
    const next = visible[(index + delta + visible.length) % visible.length];
    openPhrase(next);
  }

  function toggleFav() {
    setFavs((prev) => (prev.includes(current.id) ? prev.filter((id) => id !== current.id) : [current.id, ...prev]));
  }

  let lastGroup = "";

  return (
    <main className="mx-auto flex h-dvh max-w-5xl flex-col bg-bg text-ink">
      <header className="flex items-center gap-3 border-b border-line bg-surface px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-wide text-muted">Powiedz to</p>
          <div className="mt-1 flex rounded-md bg-bg p-0.5">
            <button
              type="button"
              className={
                "h-9 flex-1 rounded-sm text-sm font-medium " +
                (speaker === "m" ? "bg-accent text-accent-fg" : "text-muted")
              }
              onClick={() => setSpeaker("m")}
            >
              Mężczyzna
            </button>
            <button
              type="button"
              className={
                "h-9 flex-1 rounded-sm text-sm font-medium " +
                (speaker === "f" ? "bg-accent text-accent-fg" : "text-muted")
              }
              onClick={() => setSpeaker("f")}
            >
              Kobieta
            </button>
          </div>
        </div>
        <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-bg px-3">
          <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj zdania"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            aria-label="Szukaj zdania"
          />
          {query ? (
            <button type="button" aria-label="Wyczyść" onClick={() => setQuery("")}>
              <X className="size-4 text-muted" />
            </button>
          ) : null}
        </label>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section
          className={
            "flex shrink-0 flex-col bg-card text-card-fg " +
            (expanded ? "min-h-0 flex-1" : "h-80 md:h-auto md:w-[46%]")
          }
        >
          <div key={current.id + speaker} className="phrase-in flex min-h-0 flex-1 flex-col justify-between px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-card-muted">{current.pl}</p>
              <button
                type="button"
                aria-label={favored ? "Usuń z moich" : "Zapisz w moich"}
                onClick={toggleFav}
                className="grid size-11 place-items-center rounded-md"
              >
                <Star className="size-5" fill={favored ? "currentColor" : "none"} />
              </button>
            </div>
            <p className={"text-center font-medium leading-tight " + (expanded ? "text-6xl" : "text-4xl")}>
              {spoken.thai}
            </p>
            <div>
              <p className="text-center text-base font-medium">Powiedz: {howToSay}</p>
              <p className="text-center text-sm text-card-muted">{spoken.pron}</p>
              {current.note ? <p className="mt-2 text-center text-sm text-card-muted">{current.note}</p> : null}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 px-3 pb-3">
            <button type="button" className="h-11 rounded-md bg-surface/10 text-sm font-medium" onClick={() => step(-1)}>
              Poprzednie
            </button>
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-accent-fg text-sm font-medium text-ink"
              onClick={() => playThai(spoken.thai)}
            >
              <Volume2 className="size-4" aria-hidden="true" />
              {playing === spoken.thai ? "Stop" : "Posłuchaj"}
            </button>
            <button type="button" className="h-11 rounded-md bg-surface/10 text-sm font-medium" onClick={() => step(1)}>
              Następne
            </button>
            <button
              type="button"
              className="col-span-3 h-11 rounded-md border border-card-muted/40 text-sm font-medium"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Wróć do listy" : "Pokaż osobie — cały ekran"}
            </button>
            {playError ? <p className="col-span-3 text-center text-xs text-card-muted">{playError}</p> : null}
          </div>
        </section>

        <section className={"min-h-0 flex-1 overflow-y-auto bg-bg " + (expanded ? "hidden md:block" : "")}>
          <WordCoach key={current.id + speaker} phrase={current} speaker={speaker} />
          {visible.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              {categoryId === "moje" && !q
                ? "Gwiazdka na karcie zapisuje zdanie tutaj, żeby było pod ręką."
                : "Nic nie pasuje. Spróbuj innego słowa."}
            </p>
          ) : categoryId === "liczby" && !q ? (
            <NumberPad phrases={visible} currentId={current.id} speaker={speaker} onPick={openPhrase} />
          ) : (
            <ul>
              {visible.map((phrase) => {
                const showGroup = !q && phrase.group && phrase.group !== lastGroup;
                if (phrase.group) lastGroup = phrase.group;
                const active = phrase.id === current.id;
                return (
                  <li key={phrase.id + phrase.categoryId}>
                    {showGroup ? (
                      <p className="px-4 pt-4 pb-1 text-xs font-medium tracking-wide text-muted">{phrase.group}</p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => openPhrase(phrase)}
                      className={
                        "flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left " +
                        (active ? "bg-accent text-accent-fg" : "bg-surface")
                      }
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-medium">{phrase.pl}</span>
                        <span className={"block truncate text-sm " + (active ? "text-accent-fg/80" : "text-muted")}>
                          {sayLine(phrase, speaker)}
                        </span>
                      </span>
                      {q ? (
                        <span className={"text-xs " + (active ? "text-accent-fg/80" : "text-muted")}>
                          {phrase.categoryName}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

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
                {phrase.pl}
              </button>
            );
          })}
        </div>
      ) : null}

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

      <nav className="flex gap-1 overflow-x-auto border-t border-line bg-surface px-2 py-2">
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
      {chunks.map((chunk) => {
        const wide = chunk.items.some((item) => item.pl.length > 2);
        return (
          <div key={chunk.group} className="mb-4">
            {chunk.group ? <p className="pb-2 text-xs font-medium tracking-wide text-muted">{chunk.group}</p> : null}
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
                    <span className={"mt-1 max-w-full truncate text-xs " + (active ? "text-accent-fg/80" : "text-muted")}>
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

function WordCoach({ phrase, speaker }: { phrase: Phrase; speaker: Speaker }) {
  const words = coachWords(phrase, speaker);
  const [index, setIndex] = useState(0);
  const word = words[index];
  if (!word) return null;
  return (
    <div className="sticky top-0 z-10 border-b border-line bg-surface px-3 py-3">
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
              "h-14 shrink-0 rounded-md px-3 text-left " + (i === index ? "bg-accent text-accent-fg" : "bg-bg text-ink")
            }
          >
            <span className="block text-sm font-medium">{item.say}</span>
            <span className={"block text-xs " + (i === index ? "text-accent-fg/80" : "text-muted")}>{item.th}</span>
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
      className={
        "flex h-14 min-w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md px-2 text-xs font-medium " +
        (active ? "bg-accent text-accent-fg" : "text-muted")
      }
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
