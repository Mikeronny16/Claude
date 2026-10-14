import { describe, expect, it } from "vitest";
import { demoCreate } from "@/lib/ai/demo";
import { MAX_PARTS, sanitizeSpec } from "@/lib/ai/spec";

describe("sanitizeSpec", () => {
  it("rejects junk", () => {
    expect(sanitizeSpec(null)).toBeNull();
    expect(sanitizeSpec({ parts: [] })).toBeNull();
    expect(sanitizeSpec({ parts: [{ shape: "teapot" }] })).toBeNull();
  });

  it("clamps numbers, fixes colors, caps parts and grounds the model", () => {
    const spec = sanitizeSpec({
      name: "Visit www.bad.com",
      description: 42,
      animation: "explode",
      parts: Array.from({ length: 40 }, () => ({
        shape: "box",
        position: [99, -50, "x"],
        rotation: [720, 0, 0],
        scale: [0, 100, 1],
        color: "red",
        glow: "yes",
      })),
    }, "castle in the sky")!;
    expect(spec.parts).toHaveLength(MAX_PARTS);
    const part = spec.parts[0];
    expect(part.position[0]).toBe(1.5);
    expect(part.position[2]).toBe(0);
    expect(part.rotation[0]).toBe(180);
    expect(part.scale).toEqual([0.05, 2.5, 1]);
    expect(part.color).toBe("#a78bfa");
    expect(part.glow).toBe(false);
    expect(spec.animation).toBe("none");
    expect(spec.name).toBe("Castle Sky");
    // Lowest point sits on the ground.
    expect(Math.min(...spec.parts.map((p) => p.position[1] - p.scale[1] / 2))).toBeCloseTo(0);
  });
});

describe("demo generator", () => {
  it("is deterministic and picks templates and colors from keywords", () => {
    const a = demoCreate("a giant red dragon");
    const b = demoCreate("a giant red dragon");
    expect(a).toEqual(b);
    expect(a.animation).toBe("bob");
    expect(a.parts.some((p) => p.color === "#f87171")).toBe(true);
  });

  it("always returns a valid spec, even for unknown ideas", () => {
    for (const prompt of ["zzzz", "a feeling of hope", "glowing spinning thing", "tiny ice crystal"]) {
      const spec = demoCreate(prompt);
      expect(sanitizeSpec(spec, prompt)).toEqual(spec);
      expect(spec.parts.length).toBeGreaterThan(0);
    }
    expect(demoCreate("spinning star").animation).toBe("spin");
  });
});
