import { describe, expect, it } from "vitest";
import { checkText, containsBlockedLanguage, containsPersonalInfo, validateName } from "@/lib/safety";

describe("safety filter", () => {
  it("allows friendly fantasy prompts", () => {
    for (const ok of [
      "a glowing crystal tower with lanterns",
      "a knight's sword stuck in a stone",
      "a friendly dragon made of clouds",
      "skillful wizard class tower",
      "a cozy bakery by the sea",
      "x marks the spot treasure chest",
    ]) {
      expect(checkText(ok), ok).toEqual({ ok: true });
    }
  });

  it("blocks unsafe words, including leetspeak, stretching and spacing", () => {
    for (const bad of ["a bloody corpse", "k1ll everyone", "kiiiill", "k i l l", "s.e.x", "a big b0mb", "drugs garden"]) {
      expect(containsBlockedLanguage(bad), bad).toBe(true);
    }
  });

  it("blocks personal info", () => {
    for (const pii of [
      "email me at sam@example.com",
      "call 555 123 4567",
      "my insta is cool",
      "visit www.mysite.com",
      "add me @dragonboy99",
      "I live at 42 Maple Street",
    ]) {
      expect(containsPersonalInfo(pii), pii).toBe(true);
      expect(checkText(pii).ok).toBe(false);
    }
  });

  it("validates explorer names", () => {
    expect(validateName("Starlit Fox").ok).toBe(true);
    expect(validateName("ab").ok).toBe(false);
    expect(validateName("Nova2012")).toMatchObject({ ok: false, code: "personal-info" });
    expect(validateName("<script>")).toMatchObject({ ok: false, code: "invalid" });
    expect(validateName("12345")).toMatchObject({ ok: false });
  });
});
