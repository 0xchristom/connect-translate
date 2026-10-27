import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { categories } from "../../data/phrases.ts";
import { cues, hallucinations } from "../../data/cues.ts";
import { createMatcher, extractNumbers, sayNumber, similarity } from "./intent.ts";

const { match, phraseById } = createMatcher(categories, cues, hallucinations);

describe("cue data", () => {
  it("points every reply at a real phrase and every cue at a real category", () => {
    const ids = new Set(
      categories.flatMap((category) => category.phrases.map((phrase) => phrase.id)),
    );
    const sections = new Set(categories.map((category) => category.id));
    for (const cue of cues) {
      assert.ok(sections.has(cue.categoryId), cue.id + " → " + cue.categoryId);
      for (const id of cue.replies) assert.ok(ids.has(id), cue.id + " → " + id);
    }
  });
});

describe("match (Thai)", () => {
  it("suggests spice replies when the waiter asks about spice", () => {
    const hit = match("เผ็ดไหมคะ");
    assert.equal(hit?.categoryId, "jedzenie");
    assert.equal(hit?.group, "Ostrość");
    assert.deepEqual(hit?.phraseIds.slice(0, 2), ["notspicy", "littlespicy"]);
  });

  it("tolerates spaces and punctuation from the transcriber", () => {
    const hit = match(" ทาน ที่นี่ หรือ กลับบ้าน คะ? ");
    assert.equal(hit?.categoryId, "odpowiedzi");
    assert.ok(hit?.phraseIds.includes("takeaway"));
  });

  it("prefers a specific cue over a generic one", () => {
    const hit = match("มาจากประเทศอะไรครับ");
    assert.equal(hit?.phraseIds[0], "from-poland");
  });

  it("recognises a phrase from the book said back verbatim", () => {
    const hit = match("ห้องน้ำอยู่ที่ไหนครับ");
    assert.equal(hit?.categoryId, "kierunki");
    assert.equal(hit?.phraseIds[0], "where-toilet");
  });

  it("reads prices said in words or digits", () => {
    const words = match("สองร้อยห้าสิบบาทค่ะ");
    assert.deepEqual(words?.numbers, [250]);
    assert.equal(words?.categoryId, "zakupy");
    assert.deepEqual(match("150 บาท")?.numbers, [150]);
  });

  it("handles real transcripts from the Thai Whisper model", () => {
    assert.equal(match("เผ็ด มั้ย ครับ")?.phraseIds[0], "notspicy");
    const price = match("สาม ร้อย");
    assert.deepEqual(price?.numbers, [300]);
    assert.deepEqual(price?.phraseIds, ["expensive", "discount", "take-this"]);
    assert.ok(!match("เผ็ดไหมครับ")?.phraseIds.includes("isspicy"));
    assert.equal(match("ราคาเท่าไร")?.categoryId, "zakupy");
    assert.ok(match("สบายดีไหมครับ")?.phraseIds.includes("imfine"));
  });

  it("drops Whisper's silence hallucinations", () => {
    assert.equal(match("ขอบคุณที่รับชม"), null);
    assert.equal(match("   "), null);
  });

  it("returns an empty suggestion for speech it cannot place", () => {
    const hit = match("ฝนตกหนักมาก");
    assert.equal(hit?.categoryId, null);
    assert.deepEqual(hit?.phraseIds, []);
  });
});

describe("match (Polish)", () => {
  it("finds the phrase the user wants to say, ignoring case and diacritics", () => {
    const hit = match("Gdzie jest toaleta", "pl");
    assert.equal(hit?.phraseIds[0], "where-toilet");
    assert.equal(phraseById(hit!.phraseIds[0])?.categoryId, "kierunki");
  });

  it("falls back to topic cues", () => {
    const hit = match("chcę zapłacić kartą", "pl");
    assert.ok(hit?.phraseIds.includes("card"));
  });
});

describe("numbers", () => {
  it("parses Thai number words", () => {
    assert.deepEqual(extractNumbers("หนึ่งร้อยยี่สิบห้า"), [125]);
    assert.deepEqual(extractNumbers("สองพันห้าร้อย"), [2500]);
    assert.deepEqual(extractNumbers("สิบเอ็ด"), [11]);
    assert.deepEqual(extractNumbers("๓๐๐ บาท"), [300]);
    assert.deepEqual(extractNumbers("1,200 บาท"), [1200]);
  });

  it("does not read digits hidden inside other words", () => {
    assert.deepEqual(extractNumbers("ไปห้างไหม"), []);
  });

  it("says numbers back in Thai", () => {
    assert.deepEqual(sayNumber(250), { th: "สองร้อยห้าสิบ", say: "song-roj-ha-sip" });
    assert.deepEqual(sayNumber(21), { th: "ยี่สิบเอ็ด", say: "ji-sip-et" });
    assert.deepEqual(sayNumber(10), { th: "สิบ", say: "sip" });
  });
});

describe("similarity", () => {
  it("scores identical strings as 1 and unrelated ones low", () => {
    assert.equal(similarity("ไม่เผ็ด", "ไม่เผ็ด"), 1);
    assert.ok(similarity("ไม่เผ็ด", "โรงแรม") < 0.2);
  });
});
