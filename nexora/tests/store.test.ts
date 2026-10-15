import { beforeEach, describe, expect, it } from "vitest";
import { useNexora } from "@/lib/store";
import { generateTiles, tileTop } from "@/lib/terrain";

const s = () => useNexora.getState();

describe("world store", () => {
  beforeEach(() => {
    useNexora.setState({
      world: { name: "Test", theme: "twilight", tiles: generateTiles(3), objects: [], updatedAt: 0 },
      past: [], future: [], selectedId: null, saves: [], creations: [],
      progress: { xp: 0, claimed: [], placedTotal: 0, tilesPainted: 0, aiCreations: 0, saves: 0, explored: [], reactions: {}, reports: [] },
      settings: { reducedMotion: false, quality: "high", breakReminderMinutes: 0, snapToGrid: false },
      toasts: [], levelUp: null,
    });
  });

  it("adds, edits, undoes and redoes", () => {
    const id = s().addObject("pine")!;
    expect(s().selectedId).toBe(id);
    useNexora.setState({ world: { ...s().world, tiles: s().world.tiles.map((t) => ({ ...t, h: 0, ground: "grass" as const })) } });
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

  it("paints, raises and lowers tiles with undo, carrying objects along", () => {
    useNexora.setState({ world: { ...s().world, tiles: s().world.tiles.map((t) => ({ ...t, h: 0, ground: "grass" as const })) } });
    const id = s().addObject("bunny", { position: [0, 0, 0] })!;
    expect(s().paintTile(0, 0, "raise")).toBe(true);
    expect(s().paintTile(0, 0, "raise")).toBe(true);
    const tile = s().world.tiles.find((t) => t.x === 0 && t.z === 0)!;
    expect(tile.h).toBe(2);
    expect(s().world.objects.find((o) => o.id === id)!.position[1]).toBeCloseTo(tileTop(tile));
    expect(s().paintTile(0, 0, "sand")).toBe(true);
    expect(s().progress.tilesPainted).toBe(3);
    // Can't remove a tile that has an object on it.
    expect(s().paintTile(0, 0, "remove")).toBe(false);
    s().undo();
    s().undo();
    expect(s().world.tiles.find((t) => t.x === 0 && t.z === 0)!.h).toBe(1);
    expect(s().world.objects.find((o) => o.id === id)!.position[1]).toBeCloseTo(0.5);
    s().redo();
    expect(s().world.tiles.find((t) => t.x === 0 && t.z === 0)!.h).toBe(2);
  });

  it("keeps placed objects on land", () => {
    const id = s().addObject("pine", { position: [40, -3, -40] })!;
    const o = s().world.objects.find((x) => x.id === id)!;
    const t = s().world.tiles.find((x) => x.x === Math.round(o.position[0]) && x.z === Math.round(o.position[2]));
    expect(t).toBeDefined();
    expect(o.position[1]).toBeCloseTo(tileTop(t!));
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
