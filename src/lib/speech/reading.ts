import { thaiReadings } from "@/data/words";
import { readThai } from "./romanize";

const READINGS = thaiReadings();
const THAI = /[ก-๛]/;

/** Tajskie „robaczki” → jak to przeczytać po polsku; dla innego tekstu nic. */
export function reading(text: string) {
  return THAI.test(text) ? readThai(text, READINGS) : "";
}
