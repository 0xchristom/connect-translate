/**
 * Tajski zapis → wymowa po polsku („ห้องน้ำอยู่ที่ไหน” → „hong-nam ju ti-naj”), żeby dało się
 * przeczytać, co usłyszał model, bez znajomości alfabetu. Słowa z rozmówek biorą wymowę ze
 * słownika (tę samą co w podpowiedziach), resztę czytamy z reguł pisowni. Bez tonów i długości
 * samogłosek — to przybliżenie do odczytania na głos, nie transkrypcja.
 */

/** „กg ขk…”: litera i jej głoska — cała tabela mieści się w kilku linijkach. */
function table(spec: string): Record<string, string> {
  return Object.fromEntries(spec.split(" ").map((pair) => [pair[0], pair.slice(1)]));
}

const INITIAL = table(
  "กg ขk ฃk คk ฅk ฆk งng จdż ฉcz ชcz ซs ฌcz ญj ฎd ฏt ฐt ฑt ฒt ณn ดd ตt ถt ทt ธt นn บb ปp ผp ฝf พp ฟf ภp มm ยj รr ลl วw ศs ษs สs หh ฬl อ ฮh",
);

const FINAL = table(
  "กk ขk คk ฆk งng จt ชt ซt ฌt ฎt ฏt ฐt ฑt ฒt ดt ตt ถt ทt ธt ศt ษt สt บp ปp พp ฟp ภp มm ญn ณn นn รn ลn ฬn ยj วo อ ห ฮ",
);

/** Znaki po spółgłosce, które robią z niej początek sylaby. */
const VOWEL_AFTER = new Set([..."ะัาำิีึืุู็อ"]);
const LEADING = new Set([..."เแโใไ"]);
const SONORANT = new Set([..."งญนมยรลว"]);
const CLUSTER = new Set([..."กขคตปพผบดฟท"]);

function isCons(ch: string | undefined): ch is string {
  return ch !== undefined && ch in INITIAL;
}

/** Sylaby jednego słowa (bez znaków tonu i niemych spółgłosek). */
export function syllables(word: string): string[] {
  const s = [...word.replace(/[ก-ฮ][ิุ]?์/g, "").replace(/[่-๋]/g, "")];
  // Czy spółgłoska na pozycji k zaczyna nową sylabę (a nie zamyka bieżącej)?
  const starts = (k: number): boolean => {
    const c = s[k];
    const n = s[k + 1];
    if (!isCons(c)) return false;
    if (n === undefined) return false;
    if (VOWEL_AFTER.has(n) || n === "ฤ") return true;
    if (c === "ห" && SONORANT.has(n)) return true;
    if (c === "อ" && n === "ย") return true;
    if (CLUSTER.has(c) && (n === "ร" || n === "ล") && VOWEL_AFTER.has(s[k + 2] ?? "")) return true;
    if (CLUSTER.has(c) && n === "ว" && VOWEL_AFTER.has(s[k + 2] ?? "")) return true;
    if (n === "ว" && isCons(s[k + 2]) && !starts(k + 2)) return true;
    if (n === "ร" && s[k + 2] === "ร") return true;
    return false;
  };

  const out: string[] = [];
  let i = 0;
  while (i < s.length) {
    let lead = "";
    if (LEADING.has(s[i])) {
      lead = s[i];
      i += 1;
    }
    const c = s[i];
    if (!isCons(c)) {
      if (c === "ฤ") out.push("ry");
      i += 1;
      continue;
    }
    const n = s[i + 1];
    let init = INITIAL[c];
    i += 1;
    if (c === "ห" && SONORANT.has(n)) {
      init = INITIAL[n];
      i += 1;
    } else if (c === "อ" && n === "ย") {
      init = "j";
      i += 1;
    } else if (
      CLUSTER.has(c) &&
      (n === "ร" || n === "ล" || n === "ว") &&
      (lead
        ? true
        : s[i + 1] === undefined
          ? false
          : n === "ว"
            ? VOWEL_AFTER.has(s[i + 1])
            : s[i + 1] !== "ร" && (VOWEL_AFTER.has(s[i + 1]) || !starts(i + 1)))
    ) {
      init += INITIAL[n];
      i += 1;
    }

    const at = (k: number) => s[i + k];
    let v = "";
    let closed = true;
    if (!lead && at(0) === "ร" && at(1) === "ร") {
      i += 2;
      v = isCons(at(0)) && !starts(i) ? "a" : "an";
      if (v === "an") closed = false;
    } else if (lead === "ใ" || lead === "ไ") {
      v = "aj";
      closed = false;
      if (at(0) === "ย" && !starts(i)) i += 1;
    } else if (lead === "โ" || lead === "แ") {
      v = lead === "โ" ? "o" : "e";
      if (at(0) === "ะ") {
        i += 1;
        closed = false;
      } else if (at(0) === "็") i += 1;
    } else if (lead === "เ") {
      if (at(0) === "ี" && at(1) === "ย") {
        v = "ia";
        i += 2;
        if (at(0) === "ะ") {
          i += 1;
          closed = false;
        }
      } else if (at(0) === "ื" && at(1) === "อ") {
        v = "ya";
        i += 2;
      } else if (at(0) === "า" && at(1) === "ะ") {
        v = "o";
        i += 2;
        closed = false;
      } else if (at(0) === "า") {
        v = "ao";
        i += 1;
        closed = false;
      } else if (at(0) === "อ") {
        v = "oe";
        i += at(1) === "ะ" ? 2 : 1;
        closed = false;
      } else if (at(0) === "ิ") {
        v = "oe";
        i += 1;
      } else if (at(0) === "ะ") {
        v = "e";
        i += 1;
        closed = false;
      } else if (at(0) === "็") {
        v = "e";
        i += 1;
      } else if (at(0) === "ย" && !starts(i)) {
        v = "oej";
        i += 1;
        closed = false;
      } else v = "e";
    } else {
      const ch = at(0);
      if (ch === "ั" && at(1) === "ว") {
        v = "ua";
        i += 2;
        if (at(0) === "ะ") {
          i += 1;
          closed = false;
        }
      } else if (ch === "ั" || ch === "า") {
        v = "a";
        i += 1;
      } else if (ch === "ำ") {
        v = "am";
        i += 1;
        closed = false;
      } else if (ch === "ะ") {
        v = "a";
        i += 1;
        closed = false;
      } else if (ch === "ิ" || ch === "ี") {
        v = "i";
        i += 1;
      } else if (ch === "ึ" || ch === "ื") {
        v = "y";
        i += 1;
        if (ch === "ื" && at(0) === "อ" && !starts(i)) i += 1;
      } else if (ch === "ุ" || ch === "ู") {
        v = "u";
        i += 1;
      } else if (ch === "็" || ch === "อ") {
        v = "o";
        i += 1;
      } else if (ch === "ฤ") {
        v = "ri";
        i += 1;
      } else if (ch === "ว" && isCons(at(1)) && !starts(i + 1)) {
        v = "ua";
        i += 1;
      } else {
        // Bez zapisanej samogłoski: „o” w sylabie zamkniętej (คน kon), „a” w otwartej (สบาย sa-baj).
        v = isCons(ch) && !starts(i) ? "o" : "a";
      }
    }

    let final = "";
    if (closed && isCons(at(0)) && !starts(i) && !(at(0) === "อ" && v !== "o")) {
      final = FINAL[at(0)] ?? "";
      i += 1;
    }
    out.push(init + v + final);
  }
  return out;
}

const THAI = /[ก-๛]/;
const ZWSP = String.fromCharCode(0x200b);

/**
 * Cały tekst: słowa dzieli przeglądarka (Intl.Segmenter zna tajski słownik), każde słowo
 * najpierw ze słownika — w całości albo złożone z kilku znanych słów — a dopiero potem z reguł.
 */
export function readThai(text: string, known: ReadonlyMap<string, string>): string {
  // Bez spacji zerowej szerokości (U+200B) i skrótu ฯ (U+0E2F).
  const pieces = segmentThai(text.replaceAll(ZWSP, "").replaceAll("ฯ", ""));
  const out: string[] = [];
  for (let k = 0; k < pieces.length; k += 1) {
    let word = pieces[k];
    if (!word.trim()) continue;
    // Segmenter tnie też złożenia z rozmówek (เท่า|ไหร่) — sklejamy je z powrotem.
    for (let end = Math.min(pieces.length, k + 4); end > k + 1; end -= 1) {
      const joined = pieces.slice(k, end).join("");
      if (known.has(joined)) {
        word = joined;
        k = end - 1;
        break;
      }
    }
    if (word === "ๆ") {
      if (out.length > 0) out[out.length - 1] += "-" + out[out.length - 1];
      continue;
    }
    if (!THAI.test(word)) {
      out.push(word.trim());
      continue;
    }
    const base = word.replace(/ๆ/g, "");
    const say = known.get(word) ?? fromDictionary(base, known) ?? syllables(base).join("-");
    out.push(word.endsWith("ๆ") && !known.has(word) ? say + "-" + say : say);
  }
  return out.join(" ");
}

function segmentThai(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("th", { granularity: "word" });
    return [...segmenter.segment(text)].map((item) => item.segment);
  }
  return text.split(/\s+/);
}

/** Najmniej kawałków ze słownika, które razem dają dokładnie to słowo — albo nic. */
function fromDictionary(word: string, known: ReadonlyMap<string, string>): string | null {
  const whole = known.get(word);
  if (whole) return whole;
  const best: (string[] | null)[] = Array.from({ length: word.length + 1 }, () => null);
  best[0] = [];
  for (let start = 0; start < word.length; start += 1) {
    const before = best[start];
    if (!before) continue;
    for (let end = word.length; end > start; end -= 1) {
      const say = known.get(word.slice(start, end));
      if (!say) continue;
      const next = [...before, say];
      if (!best[end] || best[end]!.length > next.length) best[end] = next;
    }
  }
  return best[word.length]?.join("-") ?? null;
}
