import { describe, expect, it } from "vitest";
import { exportWorldFile, parseWorldFile, sanitizeWorld } from "@/lib/world";

describe("world helpers", () => {
  it("gives old worlds (saved before tiles) a starter island and settles objects onto it", () => {
    const w = sanitizeWorld({ name: "Old Isle", theme: "aurora", objects: [{ id: "a", kind: "pine", position: [90, -9, 0], rotation: [0, 0, 0], scale: 1, color: "#22d3ee" }] })!;
    expect(w.tiles.length).toBeGreaterThan(40);
    const o = w.objects[0];
    expect(w.tiles.some((t) => t.x === Math.round(o.position[0]) && t.z === Math.round(o.position[2]))).toBe(true);
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
