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

  it("keeps only the speaker's particle when the model wrote both", () => {
    const both = "คุณทำให้เผ็ดน้อยลงได้ไหมคะ/ครับ? ฉันไม่ทานเนื้อค่ะ/ครับ";
    assert.equal(politeThai(both, "f", true), "คุณทำให้เผ็ดน้อยลงได้ไหมคะ? ฉันไม่ทานเนื้อค่ะ");
    assert.equal(politeThai(both, "m", true), "คุณทำให้เผ็ดน้อยลงได้ไหมครับ? ผมไม่ทานเนื้อครับ");
  });

  it("follows นะ with the high-tone particle for women", () => {
    assert.equal(politeThai("ขอบคุณนะ", "f", false), "ขอบคุณนะคะ");
  });
});
