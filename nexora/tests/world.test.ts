import { describe, expect, it } from "vitest";
import { ISLAND_RADIUS } from "@/lib/catalog";
import { clampPosition, exportWorldFile, parseWorldFile, sanitizeWorld } from "@/lib/world";

describe("world helpers", () => {
  it("keeps positions on the island", () => {
    const [x, y, z] = clampPosition([100, -5, 0]);
    expect(Math.hypot(x, z)).toBeLessThan(ISLAND_RADIUS);
    expect(y).toBe(0);
  });

  it("drops unknown kinds and repairs bad fields", () => {
    const w = sanitizeWorld({
      name: "call 5551234567",
      theme: "lava",
      objects: [
        { id: "a", kind: "pine", position: [1, 2, 3], rotation: [0, 0, 0], scale: 99, color: "#ABCDEF" },
        { id: "b", kind: "nuke" },
        { id: "a", kind: "custom" },
      ],
    })!;
    expect(w.name).toBe("My Island");
    expect(w.theme).toBe("twilight");
    expect(w.objects).toHaveLength(1);
    expect(w.objects[0]).toMatchObject({ scale: 3, color: "#abcdef" });
  });

  it("round-trips through the export format and rejects other files", () => {
    const world = sanitizeWorld({ name: "Starlit Isle", theme: "aurora", objects: [{ id: "x", kind: "crystal", position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, color: "#22d3ee" }] })!;
    const parsed = parseWorldFile(exportWorldFile(world, []));
    expect(parsed.ok && parsed.world.objects[0].kind).toBe("crystal");
    expect(parseWorldFile("{}").ok).toBe(false);
    expect(parseWorldFile("not json").ok).toBe(false);
  });
});
