/**
 * Demo-mode creation generator. Runs entirely offline, with no AI model:
 * it reads keywords (subject, colors, size, motion) from the prompt and
 * assembles a model from hand-made templates. Same prompt → same result.
 */
import type { CreationAnimation, CreationPart, CreationSpec, PartShape, Vec3 } from "../types";
import { sanitizeSpec, titleFromPrompt } from "./spec";

type Rand = () => number;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): Rand {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Palette {
  main: string;
  accent: string;
  glow: string;
}

const COLOR_WORDS: Record<string, Palette> = {
  red: { main: "#f87171", accent: "#7f1d1d", glow: "#fca5a5" },
  orange: { main: "#fb923c", accent: "#7c2d12", glow: "#fdba74" },
  gold: { main: "#fbbf24", accent: "#78350f", glow: "#fde68a" },
  golden: { main: "#fbbf24", accent: "#78350f", glow: "#fde68a" },
  yellow: { main: "#fde047", accent: "#854d0e", glow: "#fef08a" },
  green: { main: "#34d399", accent: "#065f46", glow: "#6ee7b7" },
  forest: { main: "#22c55e", accent: "#78350f", glow: "#86efac" },
  blue: { main: "#60a5fa", accent: "#1e3a8a", glow: "#93c5fd" },
  ocean: { main: "#0ea5e9", accent: "#0c4a6e", glow: "#67e8f9" },
  ice: { main: "#bae6fd", accent: "#0369a1", glow: "#e0f2fe" },
  cyan: { main: "#22d3ee", accent: "#155e75", glow: "#a5f3fc" },
  purple: { main: "#a78bfa", accent: "#4c1d95", glow: "#c4b5fd" },
  violet: { main: "#8b5cf6", accent: "#3b0764", glow: "#c4b5fd" },
  pink: { main: "#f472b6", accent: "#831843", glow: "#fbcfe8" },
  white: { main: "#f1f5f9", accent: "#64748b", glow: "#ffffff" },
  silver: { main: "#cbd5e1", accent: "#475569", glow: "#f1f5f9" },
  black: { main: "#334155", accent: "#0f172a", glow: "#a78bfa" },
  shadow: { main: "#334155", accent: "#0f172a", glow: "#a78bfa" },
  fire: { main: "#f97316", accent: "#7c2d12", glow: "#fde047" },
  lava: { main: "#ea580c", accent: "#292524", glow: "#fbbf24" },
  sunset: { main: "#fb7185", accent: "#7c2d12", glow: "#fbbf24" },
  night: { main: "#6366f1", accent: "#1e1b4b", glow: "#a5b4fc" },
  candy: { main: "#f9a8d4", accent: "#a78bfa", glow: "#fef08a" },
  rainbow: { main: "#f472b6", accent: "#22d3ee", glow: "#fde047" },
};

const DEFAULT_PALETTES: Palette[] = [
  { main: "#a78bfa", accent: "#312e81", glow: "#67e8f9" },
  { main: "#22d3ee", accent: "#1e1b4b", glow: "#fbbf24" },
  { main: "#fbbf24", accent: "#4c1d95", glow: "#fde68a" },
  { main: "#f472b6", accent: "#312e81", glow: "#a5f3fc" },
];

const BROWN = "#8b5a2b";
const STONE = "#94a3b8";

function p(shape: PartShape, position: Vec3, scale: Vec3, color: string, glow = false, rotation: Vec3 = [0, 0, 0]): CreationPart {
  return { shape, position, rotation, scale, color, glow };
}

interface Template {
  noun: string;
  keywords: string[];
  animation?: CreationAnimation;
  build: (pal: Palette, r: Rand) => CreationPart[];
}

const TEMPLATES: Template[] = [
  {
    noun: "Tree",
    keywords: ["tree", "trees", "forest", "oak", "pine", "willow", "sakura", "bonsai", "palm"],
    build: (pal, r) => {
      const h = 1 + r() * 0.6;
      return [
        p("cylinder", [0, h / 2, 0], [0.3, h, 0.3], BROWN),
        p("sphere", [0, h + 0.4, 0], [1.4, 1.1, 1.4], pal.main),
        p("sphere", [0.45, h + 0.1, 0.2], [0.8, 0.7, 0.8], pal.main),
        p("sphere", [-0.4, h + 0.15, -0.25], [0.8, 0.7, 0.8], pal.main),
        p("sphere", [0.2, h + 0.95, 0.3], [0.18, 0.18, 0.18], pal.glow, true),
        p("sphere", [-0.35, h + 0.6, 0.55], [0.15, 0.15, 0.15], pal.glow, true),
      ];
    },
  },
  {
    noun: "Tower",
    keywords: ["tower", "castle", "spire", "fortress", "keep", "palace", "temple"],
    build: (pal) => [
      p("cylinder", [0, 0.9, 0], [0.9, 1.8, 0.9], STONE),
      p("cylinder", [0, 1.9, 0], [1.05, 0.2, 1.05], pal.accent),
      p("cone", [0, 2.45, 0], [1.1, 0.9, 1.1], pal.main),
      p("box", [0, 1.2, 0.46], [0.22, 0.35, 0.05], pal.glow, true),
      p("box", [0, 0.25, 0.46], [0.3, 0.5, 0.05], BROWN),
      p("cylinder", [0, 2.95, 0], [0.04, 0.3, 0.04], BROWN),
      p("box", [0.12, 3.0, 0], [0.22, 0.14, 0.02], pal.glow, true),
    ],
  },
  {
    noun: "Crystal",
    keywords: ["crystal", "gem", "jewel", "diamond", "shard", "geode", "quartz"],
    animation: "pulse",
    build: (pal, r) => [
      p("octahedron", [0, 1.1, 0], [0.8, 2.2, 0.8], pal.main, true),
      p("octahedron", [0.55, 0.5, 0.2], [0.45, 1.1, 0.45], pal.glow, true, [0, 0, -20]),
      p("octahedron", [-0.5, 0.45, -0.15], [0.4, 0.9 + r() * 0.3, 0.4], pal.glow, true, [0, 0, 18]),
      p("octahedron", [0.1, 0.35, -0.55], [0.35, 0.7, 0.35], pal.main, true, [20, 0, 0]),
      p("cylinder", [0, 0.06, 0], [1.6, 0.12, 1.6], pal.accent),
    ],
  },
  {
    noun: "Mushroom",
    keywords: ["mushroom", "toadstool", "fungus", "shroom"],
    build: (pal) => [
      p("cylinder", [0, 0.55, 0], [0.45, 1.1, 0.45], "#fef3c7"),
      p("sphere", [0, 1.2, 0], [1.6, 0.8, 1.6], pal.main),
      p("sphere", [0.35, 1.5, 0.3], [0.2, 0.12, 0.2], "#ffffff"),
      p("sphere", [-0.4, 1.45, 0.1], [0.18, 0.1, 0.18], "#ffffff"),
      p("sphere", [0.05, 1.55, -0.4], [0.16, 0.1, 0.16], "#ffffff"),
      p("sphere", [0.6, 0.15, 0.5], [0.3, 0.3, 0.3], pal.glow, true),
    ],
  },
  {
    noun: "Companion",
    keywords: ["dragon", "cat", "dog", "pet", "creature", "fox", "bunny", "rabbit", "bird", "owl", "slime", "critter", "animal", "monster", "dino", "unicorn"],
    animation: "bob",
    build: (pal) => [
      p("sphere", [0, 0.6, 0], [1.1, 0.9, 1.3], pal.main),
      p("sphere", [0, 1.2, 0.45], [0.75, 0.7, 0.7], pal.main),
      p("sphere", [0.17, 1.28, 0.78], [0.14, 0.14, 0.08], pal.glow, true),
      p("sphere", [-0.17, 1.28, 0.78], [0.14, 0.14, 0.08], pal.glow, true),
      p("cone", [0.22, 1.6, 0.35], [0.2, 0.35, 0.2], pal.accent, false, [0, 0, -15]),
      p("cone", [-0.22, 1.6, 0.35], [0.2, 0.35, 0.2], pal.accent, false, [0, 0, 15]),
      p("capsule", [0, 0.5, -0.75], [0.25, 0.8, 0.25], pal.accent, false, [-60, 0, 0]),
      p("sphere", [0.3, 0.15, 0.3], [0.25, 0.25, 0.3], pal.accent),
      p("sphere", [-0.3, 0.15, 0.3], [0.25, 0.25, 0.3], pal.accent),
    ],
  },
  {
    noun: "Robot",
    keywords: ["robot", "bot", "mech", "android", "machine", "golem"],
    build: (pal) => [
      p("box", [0, 0.75, 0], [0.9, 0.9, 0.6], pal.main),
      p("box", [0, 1.45, 0], [0.65, 0.5, 0.5], pal.main),
      p("box", [0.14, 1.5, 0.26], [0.14, 0.1, 0.02], pal.glow, true),
      p("box", [-0.14, 1.5, 0.26], [0.14, 0.1, 0.02], pal.glow, true),
      p("cylinder", [0, 1.85, 0], [0.04, 0.3, 0.04], pal.accent),
      p("sphere", [0, 2.02, 0], [0.12, 0.12, 0.12], pal.glow, true),
      p("capsule", [0.6, 0.75, 0], [0.22, 0.7, 0.22], pal.accent),
      p("capsule", [-0.6, 0.75, 0], [0.22, 0.7, 0.22], pal.accent),
      p("box", [0, 0.15, 0], [0.7, 0.3, 0.5], pal.accent),
    ],
  },
  {
    noun: "Sky Ship",
    keywords: ["ship", "boat", "airship", "blimp", "zeppelin", "submarine", "sailboat"],
    animation: "bob",
    build: (pal) => [
      p("capsule", [0, 0.45, 0], [0.7, 1.8, 0.7], BROWN, false, [90, 0, 0]),
      p("cylinder", [0, 1.2, 0], [0.06, 1.4, 0.06], BROWN),
      p("box", [0, 1.35, 0.05], [0.05, 0.9, 0.9], pal.main, false, [0, 90, 0]),
      p("sphere", [0, 2.4, 0], [1.3, 0.8, 2], pal.accent),
      p("sphere", [0, 0.7, 1.05], [0.15, 0.15, 0.15], pal.glow, true),
    ],
  },
  {
    noun: "House",
    keywords: ["house", "home", "cottage", "cabin", "hut", "shop", "bakery", "school", "library", "cafe"],
    build: (pal) => [
      p("box", [0, 0.55, 0], [1.4, 1.1, 1.2], "#fef3c7"),
      p("cone", [0, 1.5, 0], [1.4, 0.8, 1.4], pal.main, false, [0, 45, 0]),
      p("box", [0, 0.35, 0.61], [0.35, 0.7, 0.04], BROWN),
      p("box", [0.45, 0.7, 0.61], [0.28, 0.28, 0.04], pal.glow, true),
      p("box", [-0.45, 0.7, 0.61], [0.28, 0.28, 0.04], pal.glow, true),
      p("box", [0.4, 1.75, -0.2], [0.2, 0.5, 0.2], pal.accent),
    ],
  },
  {
    noun: "Flower",
    keywords: ["flower", "rose", "tulip", "lily", "sunflower", "blossom", "plant", "garden"],
    build: (pal) => {
      const petals = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return p("sphere", [Math.cos(a) * 0.38, 1.6, Math.sin(a) * 0.38], [0.42, 0.18, 0.42], pal.main);
      });
      return [
        p("cylinder", [0, 0.8, 0], [0.1, 1.6, 0.1], "#22c55e"),
        p("sphere", [0.25, 0.7, 0], [0.45, 0.12, 0.25], "#22c55e", false, [0, 0, 25]),
        ...petals,
        p("sphere", [0, 1.62, 0], [0.32, 0.25, 0.32], pal.glow, true),
      ];
    },
  },
  {
    noun: "Lantern",
    keywords: ["lamp", "lantern", "light", "torch", "beacon", "candle", "streetlight"],
    animation: "pulse",
    build: (pal) => [
      p("cylinder", [0, 0.9, 0], [0.12, 1.8, 0.12], pal.accent),
      p("box", [0, 1.95, 0], [0.45, 0.5, 0.45], pal.glow, true),
      p("cone", [0, 2.35, 0], [0.6, 0.3, 0.6], pal.main, false, [0, 45, 0]),
      p("cylinder", [0, 0.06, 0], [0.6, 0.12, 0.6], pal.accent),
    ],
  },
  {
    noun: "Rocket",
    keywords: ["rocket", "spaceship", "spacecraft", "shuttle", "ufo"],
    build: (pal) => [
      p("cylinder", [0, 1.3, 0], [0.7, 1.6, 0.7], "#e2e8f0"),
      p("cone", [0, 2.45, 0], [0.7, 0.7, 0.7], pal.main),
      p("sphere", [0, 1.6, 0.33], [0.25, 0.25, 0.08], pal.glow, true),
      p("box", [0.4, 0.6, 0], [0.12, 0.6, 0.5], pal.main),
      p("box", [-0.4, 0.6, 0], [0.12, 0.6, 0.5], pal.main),
      p("cone", [0, 0.3, 0], [0.45, 0.6, 0.45], "#fbbf24", true, [180, 0, 0]),
    ],
  },
  {
    noun: "Planet",
    keywords: ["planet", "orb", "moon", "star", "sun", "globe", "galaxy", "comet", "bubble"],
    animation: "spin",
    build: (pal) => [
      p("sphere", [0, 1.4, 0], [1.3, 1.3, 1.3], pal.main),
      p("torus", [0, 1.4, 0], [2.2, 2.2, 0.6], pal.glow, true, [70, 0, 15]),
      p("sphere", [1.15, 2.1, 0.2], [0.25, 0.25, 0.25], pal.accent),
      p("cylinder", [0, 0.25, 0], [0.12, 0.5, 0.12], pal.accent),
      p("cylinder", [0, 0.04, 0], [0.7, 0.08, 0.7], pal.accent),
    ],
  },
  {
    noun: "Monument",
    keywords: ["statue", "monument", "obelisk", "pillar", "shrine", "altar", "fountain", "totem"],
    build: (pal) => [
      p("box", [0, 0.15, 0], [1.3, 0.3, 1.3], STONE),
      p("cylinder", [0, 1.0, 0], [0.5, 1.4, 0.5], pal.main),
      p("icosahedron", [0, 2.05, 0], [0.75, 0.75, 0.75], pal.glow, true),
      p("torus", [0, 1.7, 0], [0.8, 0.8, 0.8], pal.accent, false, [90, 0, 0]),
    ],
  },
];

const ABSTRACT_SHAPES: PartShape[] = ["icosahedron", "octahedron", "torus", "sphere", "box", "cone"];

function abstractSculpture(pal: Palette, r: Rand): CreationPart[] {
  const parts: CreationPart[] = [p("cylinder", [0, 0.1, 0], [1.2, 0.2, 1.2], pal.accent)];
  let y = 0.2;
  const count = 3 + Math.floor(r() * 3);
  for (let i = 0; i < count; i++) {
    const s = 0.5 + r() * 0.5;
    const shape = ABSTRACT_SHAPES[Math.floor(r() * ABSTRACT_SHAPES.length)];
    y += s / 2;
    parts.push(p(shape, [(r() - 0.5) * 0.4, y, (r() - 0.5) * 0.4], [s, s, s], i % 2 ? pal.main : pal.glow, i % 2 === 0, [r() * 60, r() * 90, 0]));
    y += s / 2 - 0.05;
  }
  return parts;
}

const words = (prompt: string) => prompt.toLowerCase().split(/[^a-z]+/).filter(Boolean);

export function demoCreate(prompt: string): CreationSpec {
  const w = words(prompt);
  const r = mulberry32(hash(prompt.toLowerCase().trim()));
  const template = TEMPLATES.find((t) => t.keywords.some((k) => w.includes(k)));
  const colorWord = w.find((x) => COLOR_WORDS[x]);
  const pal = colorWord ? COLOR_WORDS[colorWord] : DEFAULT_PALETTES[Math.floor(r() * DEFAULT_PALETTES.length)];

  let parts = template ? template.build(pal, r) : abstractSculpture(pal, r);

  if (w.some((x) => ["glowing", "glow", "neon", "magic", "magical", "shiny", "enchanted", "sparkly"].includes(x))) {
    parts = parts.map((part, i) => (i % 2 === 0 ? { ...part, glow: true } : part));
  }
  const size = w.some((x) => ["tiny", "small", "mini", "little", "baby"].includes(x)) ? 0.7
    : w.some((x) => ["giant", "huge", "big", "tall", "massive", "enormous"].includes(x)) ? 1.25 : 1;
  if (size !== 1) {
    parts = parts.map((part) => ({
      ...part,
      position: part.position.map((v) => v * size) as Vec3,
      scale: part.scale.map((v) => v * size) as Vec3,
    }));
  }

  let animation: CreationAnimation = template?.animation ?? "none";
  if (w.some((x) => ["spinning", "spin", "rotating", "twirling"].includes(x))) animation = "spin";
  else if (w.some((x) => ["floating", "float", "hovering", "flying", "levitating"].includes(x))) animation = "bob";
  else if (w.some((x) => ["pulsing", "glowing", "breathing"].includes(x))) animation = "pulse";

  const noun = template?.noun ?? "Sculpture";
  const name = w.length <= 4 ? titleFromPrompt(prompt) : `${titleFromPrompt(prompt).split(" ")[0]} ${noun}`;
  const spec = sanitizeSpec(
    {
      name,
      description: template
        ? `A ${noun.toLowerCase()} shaped from your idea by the demo generator.`
        : "An abstract sculpture inspired by your words (demo generator).",
      animation,
      parts,
    },
    prompt,
  );
  // sanitizeSpec only returns null for empty part lists, which templates never produce.
  return spec!;
}
