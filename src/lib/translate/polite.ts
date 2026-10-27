import type { Speaker } from "@/data/phrases";

const PARTICLE_END = /(ครับ|คับ|ค่ะ|คะ|ค่า|จ้ะ|จ้า|นะ)$/;
/** TranslateGemma nie zna płci mówiącego i pisze obie końcówki: „ไหมคะ/ครับ”. */
const BOTH = /(ครับ|ค่ะ|คะ)\s*\/\s*(ครับ|ค่ะ|คะ)/g;
const PARTICLE = /(ครับ|ค่ะ|คะ)(?=\s|\?|$)/g;

/**
 * Tłumacz zwraca tajski „neutralny”: bez ครับ/ค่ะ i z ฉัน („ja” u kobiet i w piśmie).
 * Dodajemy grzeczną końcówkę mówiącego, a mężczyźnie dajemy ผม — tak mówi się na co dzień.
 */
export function politeThai(text: string, speaker: Speaker, question: boolean) {
  let thai = text
    .trim()
    .replace(/[.!?。]+$/, "")
    .replace(BOTH, (_, a: string, b: string) => (a === "ครับ" ? b : a));
  // Końcówka zależy od tego, kto mówi, nie od tego, co zgadł model.
  thai = thai.replace(PARTICLE, (particle: string, offset: number) => {
    if (speaker === "m") return "ครับ";
    if (particle !== "ครับ") return particle;
    return thai[offset + particle.length] === "?" ? "คะ" : "ค่ะ";
  });
  if (speaker === "m") thai = thai.replaceAll("ฉัน", "ผม");
  if (PARTICLE_END.test(thai)) {
    return thai.endsWith("นะ") ? thai + (speaker === "m" ? "ครับ" : "คะ") : thai;
  }
  if (speaker === "m") return thai + "ครับ";
  return thai + (question ? "คะ" : "ค่ะ");
}
