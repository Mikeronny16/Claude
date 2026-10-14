import type { AvatarId } from "./types";

const ADJECTIVES = [
  "Starlit", "Velvet", "Nova", "Ember", "Crystal", "Lunar", "Echo", "Misty", "Cosmic", "Aurora",
  "Golden", "Silent", "Brave", "Clever", "Drifting", "Glimmer", "Hidden", "Mossy", "Swift", "Violet",
];
const NOUNS = [
  "Fox", "Wisp", "Comet", "Lynx", "Owl", "Sprite", "Golem", "Drake", "Nimbus", "Pixel",
  "Rune", "Lantern", "Falcon", "Otter", "Spark", "Willow", "Voyager", "Tide", "Moth", "Quill",
];
const WORLD_WORDS = ["Isle", "Haven", "Reach", "Hollow", "Spire", "Drift", "Vale", "Atoll"];

export function suggestName(rand: () => number = Math.random): string {
  const a = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(rand() * NOUNS.length)];
  return `${a} ${n}`;
}

export function suggestWorldName(rand: () => number = Math.random): string {
  const a = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
  const w = WORLD_WORDS[Math.floor(rand() * WORLD_WORDS.length)];
  return `${a} ${w}`;
}

/** Works on plain http (LAN testing on a phone) where crypto.randomUUID is unavailable. */
export function uid(prefix = ""): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export const AVATARS: { id: AvatarId; label: string; glyph: string; from: string; to: string }[] = [
  { id: "nova", label: "Nova star", glyph: "✦", from: "#8b5cf6", to: "#22d3ee" },
  { id: "wisp", label: "Wisp spirit", glyph: "❋", from: "#22d3ee", to: "#34d399" },
  { id: "drake", label: "Little drake", glyph: "◆", from: "#f472b6", to: "#fbbf24" },
  { id: "golem", label: "Stone golem", glyph: "⬢", from: "#818cf8", to: "#94a3b8" },
  { id: "owl", label: "Night owl", glyph: "◉", from: "#fbbf24", to: "#fb923c" },
  { id: "comet", label: "Comet", glyph: "☄", from: "#a78bfa", to: "#f472b6" },
];

export const AVATAR_MAP = Object.fromEntries(AVATARS.map((a) => [a.id, a])) as Record<AvatarId, (typeof AVATARS)[number]>;
