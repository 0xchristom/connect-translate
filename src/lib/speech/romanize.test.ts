import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { thaiReadings } from "../../data/words.ts";
import { readThai, syllables } from "./romanize.ts";

const known = thaiReadings();

describe("syllables", () => {
  const cases: [string, string][] = [
    ["สวัสดี", "sa-wat-di"],
    ["ขอบคุณ", "kop-kun"],
    ["ครับ", "krap"],
    ["ตรง", "trong"],
    ["ไม่", "maj"],
    ["เป็น", "pen"],
    ["เท่าไหร่", "tao-raj"],
    ["ที่ไหน", "ti-naj"],
    ["อยู่", "ju"],
    ["หนึ่ง", "nyng"],
    ["ด้วย", "duaj"],
    ["เลี้ยว", "liao"],
    ["รถพยาบาล", "rot-pa-ja-ban"],
    ["สนามบิน", "sa-nam-bin"],
    ["อร่อย", "a-roj"],
    ["ตำรวจ", "tam-ruat"],
    ["โปแลนด์", "po-len"],
    ["กรุงเทพ", "grung-tep"],
    ["ไทย", "taj"],
    ["เอา", "ao"],
    ["เดือน", "dyan"],
    ["ตัว", "tua"],
    ["ใกล้", "glaj"],
    ["แปล", "ple"],
  ];
  for (const [thai, expected] of cases) {
    it(thai + " → " + expected, () => assert.equal(syllables(thai).join("-"), expected));
  }
});

describe("readThai", () => {
  it("uses the phrasebook spelling for known words", () => {
    assert.equal(readThai("ห้องน้ำอยู่ที่ไหนครับ", known), "hong-nam ju ti-naj krap");
  });

  it("reads unknown words from spelling rules", () => {
    assert.equal(readThai("กรุงเทพ", known), "grung-tep");
  });

  it("repeats words marked with ๆ and passes digits through", () => {
    assert.equal(readThai("ช้าๆ 50 บาท", known), "cza-cza 50 bat");
  });
});
