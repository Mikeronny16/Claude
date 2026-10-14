import { beforeEach, describe, expect, it } from "vitest";
import { useNexora } from "@/lib/store";

const s = () => useNexora.getState();

describe("world store", () => {
  beforeEach(() => {
    useNexora.setState({
      world: { name: "Test", theme: "twilight", objects: [], updatedAt: 0 },
      past: [], future: [], selectedId: null, saves: [], creations: [],
      progress: { xp: 0, claimed: [], placedTotal: 0, aiCreations: 0, saves: 0, explored: [], reactions: {}, reports: [] },
      settings: { reducedMotion: false, quality: "high", breakReminderMinutes: 0, snapToGrid: false },
      toasts: [], levelUp: null,
    });
  });

  it("adds, edits, undoes and redoes", () => {
    const id = s().addObject("pine")!;
    expect(s().selectedId).toBe(id);
    s().updateObject(id, { position: [1, 0, 1], scale: 2 });
    s().updateObject(id, { color: "#ff0000" });
    expect(s().world.objects[0]).toMatchObject({ position: [1, 0, 1], scale: 2, color: "#ff0000" });

    s().undo();
    expect(s().world.objects[0].color).not.toBe("#ff0000");
    s().undo();
    expect(s().world.objects[0].scale).toBe(1);
    s().undo();
    expect(s().world.objects).toHaveLength(0);
    expect(s().selectedId).toBeNull();

    s().redo();
    s().redo();
    expect(s().world.objects[0].scale).toBe(2);
    // A new edit clears the redo stack.
    s().removeObject(id);
    expect(s().future).toHaveLength(0);
    expect(s().world.objects).toHaveLength(0);
  });

  it("skips no-op edits so undo isn't cluttered", () => {
    const id = s().addObject("boulder")!;
    const before = s().past.length;
    s().updateObject(id, { scale: 1 });
    expect(s().past.length).toBe(before);
  });

  it("respects unlock levels", () => {
    expect(s().addObject("portal")).toBeNull();
    useNexora.setState({ progress: { ...s().progress, xp: 300 } });
    expect(s().addObject("portal")).not.toBeNull();
  });

  it("saves and restores snapshots, and restore is undoable", () => {
    s().addObject("crystal");
    const slot = s().saveSnapshot("Before");
    s().addObject("lantern");
    s().addObject("lantern");
    s().restoreSnapshot(slot.id);
    expect(s().world.objects).toHaveLength(1);
    s().undo();
    expect(s().world.objects).toHaveLength(3);
    expect(s().progress.saves).toBe(1);
  });

  it("only lets completed quests be claimed once, and reports level-ups", () => {
    expect(s().claimQuest("first-spark")).toBe(false);
    s().addObject("pine");
    expect(s().claimQuest("first-spark")).toBe(true);
    expect(s().claimQuest("first-spark")).toBe(false);
    expect(s().progress.xp).toBe(50);
    for (let i = 0; i < 4; i++) s().addObject("pine");
    s().claimQuest("grove-keeper");
    expect(s().progress.xp).toBe(150);
    expect(s().levelUp).toBe(2);
  });
});
