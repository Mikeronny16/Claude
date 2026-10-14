import { describe, expect, it } from "vitest";
import { levelFromXp, levelProgress, xpForLevel } from "@/lib/levels";
import { dailyQuest, questById, questStatus, QUESTS, type QuestContext } from "@/lib/quests";
import type { Progress, WorldObject } from "@/lib/types";

const progress = (p: Partial<Progress> = {}): Progress => ({
  xp: 0, claimed: [], placedTotal: 0, aiCreations: 0, saves: 0, explored: [], reactions: {}, reports: [], ...p,
});
const obj = (kind: WorldObject["kind"], position: WorldObject["position"] = [0, 0, 0], color = "#ffffff"): WorldObject => ({
  id: Math.random().toString(36), kind, position, rotation: [0, 0, 0], scale: 1, color,
});
const ctx = (objects: WorldObject[], p: Partial<Progress> = {}): QuestContext => ({ objects, progress: progress(p), creations: [] });

describe("levels", () => {
  it("maps xp to levels", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(xpForLevel(5))).toBe(5);
    expect(levelProgress(150)).toMatchObject({ level: 2, current: 50, needed: 200 });
  });
});

describe("quests", () => {
  it("has unique ids", () => {
    expect(new Set(QUESTS.map((q) => q.id)).size).toBe(QUESTS.length);
  });

  it("checks spatial quests", () => {
    const cozy = questById("cozy-corner")!;
    expect(questStatus(cozy, ctx([obj("cottage", [0, 0, 0]), obj("lantern", [4, 0, 0])])).complete).toBe(false);
    expect(questStatus(cozy, ctx([obj("cottage", [0, 0, 0]), obj("lantern", [1.5, 0, 1])])).complete).toBe(true);

    const keeper = questById("lightkeeper")!;
    expect(questStatus(keeper, ctx([obj("lighthouse", [1, 0, 1])])).complete).toBe(false);
    expect(questStatus(keeper, ctx([obj("lighthouse", [4.5, 0, 0])])).complete).toBe(true);
  });

  it("caps progress at the target and reads claim state", () => {
    const grove = questById("grove-keeper")!;
    const s = questStatus(grove, ctx(Array.from({ length: 8 }, () => obj("pine")), { claimed: ["grove-keeper"] }));
    expect(s).toMatchObject({ current: 5, complete: true, claimed: true });
  });

  it("rotates the daily quest by date", () => {
    const a = dailyQuest(new Date(2026, 9, 14));
    const b = dailyQuest(new Date(2026, 9, 15));
    expect(a.id).toBe("daily-2026-10-14");
    expect(a.title).not.toBe(b.title);
  });
});
