import type { Speaker } from "@/data/phrases";

const PARTICLE_END = /(ครับ|คับ|ค่ะ|คะ|ค่า|จ้ะ|จ้า|นะ)$/;

/**
 * Tłumacz zwraca tajski „neutralny”: bez ครับ/ค่ะ i z ฉัน („ja” u kobiet i w piśmie).
 * Dodajemy grzeczną końcówkę mówiącego, a mężczyźnie dajemy ผม — tak mówi się na co dzień.
 */
export function politeThai(text: string, speaker: Speaker, question: boolean) {
  let thai = text.trim().replace(/[.!?。]+$/, "");
  if (speaker === "m") thai = thai.replaceAll("ฉัน", "ผม");
  if (PARTICLE_END.test(thai)) {
    return thai.endsWith("นะ") ? thai + (speaker === "m" ? "ครับ" : "คะ") : thai;
  }
  if (speaker === "m") return thai + "ครับ";
  return thai + (question ? "คะ" : "ค่ะ");
}
