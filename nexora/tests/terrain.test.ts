import { describe, expect, it } from "vitest";
import { MAX_LEVEL, MIN_TILES } from "@/lib/catalog";
import { addableCells, applyGroundTool, clampToLand, generateTiles, sanitizeTiles, tileTop, waterfallEdges } from "@/lib/terrain";
import type { Tile, WorldObject } from "@/lib/types";

const flat = (n = 2): Tile[] => {
  const t: Tile[] = [];
  for (let x = -n; x <= n; x++) for (let z = -n; z <= n; z++) t.push({ x, z, h: 0, ground: "grass" });
  return t;
};
const obj = (x: number, y: number, z: number): WorldObject => ({ id: "o", kind: "pine", position: [x, y, z], rotation: [0, 0, 0], scale: 1, color: "#fff" });

describe("terrain", () => {
  it("generates the same island for the same seed, with a hill, pond, waterfall and path", () => {
    const a = generateTiles(7);
    expect(generateTiles(7)).toEqual(a);
    expect(a.length).toBeGreaterThan(60);
    expect(a.some((t) => t.h === 2)).toBe(true);
    expect(a.some((t) => t.ground === "water")).toBe(true);
    expect(a.some((t) => t.ground === "stone")).toBe(true);
    expect(waterfallEdges(a).length).toBeGreaterThan(0);
    expect(new Set(a.map((t) => `${t.x},${t.z}`)).size).toBe(a.length);
  });

  it("paints, raises within limits, and moves resting objects with the tile", () => {
    const tiles = flat();
    const r1 = applyGroundTool(tiles, [obj(0, 0, 0)], 0, 0, "raise");
    expect(r1 && r1.ok && r1.objects[0].position[1]).toBe(0.5);
    let t = tiles;
    for (let i = 0; i < MAX_LEVEL; i++) {
      const r = applyGroundTool(t, [], 1, 1, "raise");
      if (r && r.ok) t = r.tiles;
    }
    const capped = applyGroundTool(t, [], 1, 1, "raise");
    expect(capped && !capped.ok).toBe(true);
    expect(applyGroundTool(tiles, [], 0, 0, "lower")).toMatchObject({ ok: false });
    expect(applyGroundTool(tiles, [], 0, 0, "grass")).toBeNull();
    const w = applyGroundTool(tiles, [obj(0, 0, 0)], 0, 0, "water");
    expect(w && w.ok && w.objects[0].position[1]).toBeCloseTo(-0.14);
  });

  it("adds land only next to the island and refuses unsafe removals", () => {
    const tiles = flat();
    expect(applyGroundTool(tiles, [], 3, 0, "add")).toMatchObject({ ok: true });
    expect(applyGroundTool(tiles, [], 5, 5, "add")).toMatchObject({ ok: false });
    expect(applyGroundTool(tiles, [obj(1, 0, 1)], 1, 1, "remove")).toMatchObject({ ok: false });
    expect(applyGroundTool(flat(1).concat(flat(1).map((t) => ({ ...t, x: t.x + 3 }))).slice(0, MIN_TILES), [], 0, 0, "remove")).toMatchObject({ ok: false });
  });

  it("lists every empty cell next to the island as addable", () => {
    const cells = addableCells(flat(1));
    expect(cells).toHaveLength(12);
    for (const c of cells) expect(applyGroundTool(flat(1), [], c.x, c.z, "add")).toMatchObject({ ok: true });
  });

  it("clamps positions onto land and above the ground", () => {
    const tiles = flat(1).map((t) => (t.x === 1 ? { ...t, h: 2 } : t));
    const [x, y, z] = clampToLand([9, -4, 0], tiles);
    expect(Math.round(x)).toBe(1);
    expect(Math.round(z)).toBe(0);
    expect(y).toBe(tileTop({ x: 1, z: 0, h: 2, ground: "grass" }));
  });

  it("sanitizes stored tiles", () => {
    expect(sanitizeTiles("nope")).toBeNull();
    expect(sanitizeTiles([{ x: 0, z: 0, h: 0, ground: "grass" }])).toBeNull();
    const t = sanitizeTiles([...flat(), { x: 0, z: 0, h: 1, ground: "lava" }, { x: 99, z: 0, h: 0, ground: "grass" }, { x: 1.5, z: 0, h: 0 }])!;
    expect(t).toHaveLength(25);
  });
});
