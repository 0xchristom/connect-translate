import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { politeThai } from "./polite.ts";

describe("politeThai", () => {
  it("adds the speaker's particle", () => {
    assert.equal(politeThai("ห้องน้ำอยู่ที่ไหน", "m", true), "ห้องน้ำอยู่ที่ไหนครับ");
    assert.equal(politeThai("ห้องน้ำอยู่ที่ไหน", "f", true), "ห้องน้ำอยู่ที่ไหนคะ");
    assert.equal(politeThai("ขอบคุณ.", "f", false), "ขอบคุณค่ะ");
  });

  it("uses ผม for men and keeps an existing particle", () => {
    assert.equal(politeThai("ฉันหิว", "m", false), "ผมหิวครับ");
    assert.equal(politeThai("ฉันหิวค่ะ", "f", false), "ฉันหิวค่ะ");
  });

  it("follows นะ with the high-tone particle for women", () => {
    assert.equal(politeThai("ขอบคุณนะ", "f", false), "ขอบคุณนะคะ");
  });
});
