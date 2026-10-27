import type { Cue } from "../../data/cues.ts";
import type { Category, Phrase } from "../../data/phrases.ts";

export type HeardLang = "th" | "pl";

export type Suggestion = {
  heard: string;
  lang: HeardLang;
  /** Co (po polsku) znaczy usłyszane zdanie. */
  meaning: string | null;
  categoryId: string | null;
  group: string | null;
  /** Zdania do pokazania jako odpowiedź albo trafienie — najlepsze pierwsze. */
  phraseIds: string[];
  numbers: number[];
  /** 0–1, jak pewne jest dopasowanie. */
  confidence: number;
};

const THAI_CHARS = /[\u0E00-\u0E7F]/;
const THAI_PARTICLES = /(ครับผม|ครับ|คะ|ค่ะ|ค่า|คับ|จ้ะ|จ้า|นะคะ|นะครับ)/g;

export function hasThai(text: string) {
  return THAI_CHARS.test(text);
}

export function normalizeThai(text: string) {
  let out = text
    .toLowerCase()
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/[\s.,!?;:"'“”‘’()[\]…\-–—]+/g, "");
  for (const [pattern, replacement] of COLLOQUIAL) out = out.replace(pattern, replacement);
  return out;
}

/** Potoczne zapisy, które zwraca model, sprowadzamy do formy z rozmówek. */
const COLLOQUIAL: [RegExp, string][] = [
  [/มั้ย|มั๊ย|ไม๊/g, "ไหม"],
  [/เท่าไร(?!่)/g, "เท่าไหร่"],
  [/ป่าว|เปล่า/g, "ไหม"],
];

function stripParticles(text: string) {
  return text.replace(THAI_PARTICLES, "");
}

export function normalizePolish(text: string) {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function bigrams(text: string) {
  const grams = new Map<string, number>();
  const chars = [...text];
  for (let i = 0; i < chars.length - 1; i++) {
    const gram = chars[i] + chars[i + 1];
    grams.set(gram, (grams.get(gram) ?? 0) + 1);
  }
  return grams;
}

/** Współczynnik Dice'a na bigramach znaków — działa dla tajskiego, który nie ma spacji. */
export function similarity(a: string, b: string) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const ga = bigrams(a);
  const gb = bigrams(b);
  let overlap = 0;
  let total = 0;
  for (const [gram, count] of ga) {
    overlap += Math.min(count, gb.get(gram) ?? 0);
    total += count;
  }
  for (const count of gb.values()) total += count;
  return total === 0 ? 0 : (2 * overlap) / total;
}

const THAI_DIGITS: Record<string, number> = {
  ศูนย์: 0,
  หนึ่ง: 1,
  เอ็ด: 1,
  สอง: 2,
  ยี่: 2,
  สาม: 3,
  สี่: 4,
  ห้า: 5,
  หก: 6,
  เจ็ด: 7,
  แปด: 8,
  เก้า: 9,
};
const THAI_MULTIPLIERS: Record<string, number> = {
  สิบ: 10,
  ร้อย: 100,
  พัน: 1000,
  หมื่น: 10000,
  แสน: 100000,
};
const NUMBER_WORDS = [...Object.keys(THAI_DIGITS), ...Object.keys(THAI_MULTIPLIERS)].sort(
  (a, b) => b.length - a.length,
);
const NUMBER_UNITS = /^(บาท|คน|ท่าน|ห้อง|วัน|คืน|ชิ้น|อัน|ขวด|จาน|แก้ว|โมง|นาที|กิโล)/;

function readThaiNumberWords(words: string[]) {
  let total = 0;
  let current = 0;
  for (const word of words) {
    if (word in THAI_DIGITS) {
      current = THAI_DIGITS[word];
    } else {
      total += (current || 1) * THAI_MULTIPLIERS[word];
      current = 0;
    }
  }
  return total + current;
}

/**
 * Wyciąga liczby z transkrypcji: cyfry arabskie i tajskie (๐–๙) oraz zapisy słowne
 * („สองร้อยห้าสิบ”). Pojedyncze słowa-cyfry bez mnożnika liczą się tylko przed jednostką
 * (บาท, คน…), bo „ห้า” czy „สี่” bywają częścią innych słów.
 */
export function extractNumbers(text: string) {
  const found: number[] = [];
  const ascii = text.replace(/[๐-๙]/g, (digit) => String(digit.charCodeAt(0) - 0x0e50));
  for (const match of ascii.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
    const value = Number(match[0].replace(/,/g, ""));
    if (Number.isFinite(value)) found.push(value);
  }
  const compact = normalizeThai(ascii);
  let i = 0;
  while (i < compact.length) {
    const words: string[] = [];
    let j = i;
    for (;;) {
      const word = NUMBER_WORDS.find((item) => compact.startsWith(item, j));
      if (!word) break;
      words.push(word);
      j += word.length;
    }
    if (words.length === 0) {
      i += 1;
      continue;
    }
    const hasMultiplier = words.some((word) => word in THAI_MULTIPLIERS);
    if (hasMultiplier || NUMBER_UNITS.test(compact.slice(j)) || words.length === compact.length) {
      found.push(readThaiNumberWords(words));
    }
    i = j;
  }
  return [...new Set(found)];
}

const DIGIT_SAY = ["", "nyng", "song", "sam", "si", "ha", "hok", "dżet", "peet", "gao"];
const DIGIT_TH = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
const PLACES = [
  { value: 100000, th: "แสน", say: "saen" },
  { value: 10000, th: "หมื่น", say: "myn" },
  { value: 1000, th: "พัน", say: "pan" },
  { value: 100, th: "ร้อย", say: "roj" },
  { value: 10, th: "สิบ", say: "sip" },
];

/** Liczba po tajsku z wymową w stylu reszty aplikacji (np. 250 → สองร้อยห้าสิบ, song-roj-ha-sip). */
export function sayNumber(value: number) {
  const n = Math.floor(Math.abs(value));
  if (n === 0) return { th: "ศูนย์", say: "sun" };
  if (n >= 1000000) return null;
  const th: string[] = [];
  const say: string[] = [];
  let rest = n;
  for (const place of PLACES) {
    const digit = Math.floor(rest / place.value);
    rest %= place.value;
    if (digit === 0) continue;
    if (place.value === 10 && digit === 2) {
      th.push("ยี่", place.th);
      say.push("ji", place.say);
    } else if (place.value === 10 && digit === 1) {
      th.push(place.th);
      say.push(place.say);
    } else {
      th.push(DIGIT_TH[digit], place.th);
      say.push(DIGIT_SAY[digit], place.say);
    }
  }
  if (rest > 0) {
    const one = rest === 1 && n > 10;
    th.push(one ? "เอ็ด" : DIGIT_TH[rest]);
    say.push(one ? "et" : DIGIT_SAY[rest]);
  }
  return { th: th.join(""), say: say.join("-") };
}

type Indexed = Phrase & { categoryId: string; thaiKey: string; plKey: string; plWords: string[] };

function stems(text: string) {
  return normalizePolish(text)
    .split(" ")
    .filter((word) => word.length >= 3)
    .map((word) => word.slice(0, 5));
}

/** Najdłuższy pasujący fragment — dłuższy znaczy konkretniejszy; ogólne wskazówki ważą połowę. */
function cueScore(cue: Cue, lengths: number[]) {
  if (lengths.length === 0) return 0;
  return Math.max(...lengths) * (cue.weak ? 0.5 : 1);
}

function matchesPolishCue(text: string, pattern: string) {
  return (" " + text).includes(" " + pattern);
}

const GENDERED = /\{([^|{}]*)\|([^|{}]*)\}/g;

/** „Zgubił{em|am} się” → „Zgubiłem/am się”: matcher nie wie, kto mówi. */
function plainPolish(pl: string) {
  return pl.replace(GENDERED, "$1/$2");
}

export function createMatcher(categories: Category[], cues: Cue[], hallucinations: string[] = []) {
  const byId = new Map<string, Indexed>();
  // Ta sama fraza bywa w kilku sekcjach; do porównań zostaje wersja z sekcji tematycznej,
  // a „Szybkie” (skróty) idą na koniec.
  const phrases: Indexed[] = [];
  const seen = new Set<string>();
  const ordered = [...categories].sort(
    (a, b) => Number(a.id === "szybkie") - Number(b.id === "szybkie"),
  );
  for (const category of ordered) {
    for (const phrase of category.phrases) {
      const thaiKey = stripParticles(normalizeThai(phrase.th.replaceAll("{p}", "")));
      const plKey = normalizePolish(phrase.pl.replace(GENDERED, "$1"));
      const indexed = {
        ...phrase,
        categoryId: category.id,
        thaiKey,
        plKey,
        plWords: stems(phrase.pl.replace(GENDERED, "$1 $2")),
      };
      byId.set(phrase.id, indexed);
      if (seen.has(thaiKey + "|" + plKey)) continue;
      seen.add(thaiKey + "|" + plKey);
      phrases.push(indexed);
    }
  }
  const noise = hallucinations.map((item) => normalizePolish(item) || normalizeThai(item));

  function isNoise(text: string) {
    const th = normalizeThai(text);
    const pl = normalizePolish(text);
    if (!th) return true;
    return noise.some((item) => item && (th.includes(item) || pl.includes(item)));
  }

  function match(text: string, lang: HeardLang = hasThai(text) ? "th" : "pl"): Suggestion | null {
    if (isNoise(text)) return null;
    const numbers = extractNumbers(text);
    const replies: string[] = [];
    let meaning: string | null = null;
    let categoryId: string | null = null;
    let group: string | null = null;
    let confidence = 0;

    function add(ids: string[]) {
      for (const id of ids) if (byId.has(id) && !replies.includes(id)) replies.push(id);
    }

    if (lang === "th") {
      const heard = stripParticles(normalizeThai(text));
      const hits = cues
        .map((cue) => ({
          cue,
          score: cueScore(
            cue,
            (cue.th ?? []).filter((item) => heard.includes(item)).map((item) => [...item].length),
          ),
        }))
        .filter((hit) => hit.score > 0)
        .sort((a, b) => b.score - a.score);

      const direct = phrases
        .map((phrase) => ({ phrase, score: similarity(heard, phrase.thaiKey) }))
        .filter((hit) => hit.score >= 0.6)
        .sort((a, b) => b.score - a.score);

      // Rozmówca powiedział zdanie z rozmówek. Jeśli to pytanie, pokazujemy jego sens,
      // a jako sugestie — odpowiedzi ze wskazówek, nie samo pytanie.
      const exact = direct[0] && (direct[0].score >= 0.8 || hits.length === 0) ? direct[0] : null;
      if (exact) {
        meaning = "„" + plainPolish(exact.phrase.pl) + "”";
        confidence = exact.score;
        if (!exact.phrase.question || hits.length === 0) add([exact.phrase.id]);
      }
      const best = hits[0];
      if (best) {
        meaning ??= best.cue.meaning;
        categoryId = best.cue.categoryId;
        group = best.cue.group ?? null;
        confidence = Math.max(confidence, Math.min(0.95, 0.45 + best.score * 0.07));
        for (const hit of hits.slice(0, 3)) add(hit.cue.replies);
      } else if (exact) {
        categoryId = exact.phrase.categoryId;
        group = exact.phrase.group ?? null;
      }
      for (const hit of direct.slice(0, 3)) if (!hit.phrase.question || !best) add([hit.phrase.id]);
      // Usłyszane pytanie nie jest odpowiedzią na samo siebie (także jego kopie z innych sekcji).
      if (exact?.phrase.question && best) {
        const asked = exact.phrase.thaiKey;
        const others = replies.filter((id) => byId.get(id)?.thaiKey !== asked);
        if (others.length > 0) replies.splice(0, replies.length, ...others);
      }
    } else {
      const heard = normalizePolish(text);
      const heardStems = stems(text);
      const hits = cues
        .map((cue) => ({
          cue,
          score: cueScore(
            cue,
            (cue.pl ?? [])
              .filter((item) => matchesPolishCue(heard, item))
              .map((item) => item.length),
          ),
        }))
        .filter((hit) => hit.score > 0)
        .sort((a, b) => b.score - a.score);

      const direct = phrases
        .map((phrase) => {
          if (phrase.plWords.length === 0) return { phrase, score: heard === phrase.plKey ? 1 : 0 };
          const common = phrase.plWords.filter((word) => heardStems.includes(word)).length;
          return {
            phrase,
            score: common / Math.max(phrase.plWords.length, Math.min(heardStems.length, 4)),
          };
        })
        .filter((hit) => hit.score >= 0.5)
        .sort((a, b) => b.score - a.score);

      const best = direct[0];
      if (best) {
        meaning = "Chcesz powiedzieć: „" + plainPolish(best.phrase.pl) + "”";
        categoryId = best.phrase.categoryId;
        group = best.phrase.group ?? null;
        confidence = best.score;
        for (const hit of direct.slice(0, 4)) add([hit.phrase.id]);
      }
      if (hits.length > 0) {
        if (!categoryId) {
          meaning = "Temat: " + hits[0].cue.meaning.toLowerCase();
          categoryId = hits[0].cue.categoryId;
          group = hits[0].cue.group ?? null;
          confidence = 0.5;
        }
        for (const hit of hits.slice(0, 2)) add(hit.cue.replies);
      }
    }

    if (numbers.length > 0) {
      // Liczbę pokazuje osobna karta; zamiast powtarzać ją w odpowiedziach, podsuwamy
      // to, co zwykle mówi się po usłyszeniu ceny.
      const numberIds = replies.filter((id) => byId.get(id)?.categoryId === "liczby");
      if (numberIds.length > 0 && meaning?.startsWith("„")) meaning = null;
      replies.splice(0, replies.length, ...replies.filter((id) => !numberIds.includes(id)));
      if (replies.length === 0) add(["expensive", "discount", "take-this"]);
      categoryId ??= "liczby";
      meaning ??= "Liczba, pewnie cena";
      confidence = Math.max(confidence, 0.6);
    }

    if (!categoryId && replies.length === 0) {
      return {
        heard: text.trim(),
        lang,
        meaning: null,
        categoryId: null,
        group: null,
        phraseIds: [],
        numbers,
        confidence: 0,
      };
    }
    return {
      heard: text.trim(),
      lang,
      meaning,
      categoryId,
      group,
      phraseIds: replies.slice(0, 6),
      numbers,
      confidence,
    };
  }

  return { match, phraseById: (id: string) => byId.get(id) ?? null };
}
