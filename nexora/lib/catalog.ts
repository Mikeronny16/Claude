import type { AssetCategory, AssetKind, IslandTheme } from "./types";

export interface AssetDef {
  kind: AssetKind;
  name: string;
  category: AssetCategory;
  description: string;
  defaultColor: string;
  /** Level required to place it. 1 = available from the start. */
  unlockLevel: number;
  /** Counts toward light-related quests. */
  emitsLight?: boolean;
}

export const ASSETS: AssetDef[] = [
  { kind: "pine", name: "Pine Tree", category: "nature", description: "A tall evergreen.", defaultColor: "#34d399", unlockLevel: 1 },
  { kind: "roundTree", name: "Bloom Tree", category: "nature", description: "A round, leafy tree.", defaultColor: "#a78bfa", unlockLevel: 1 },
  { kind: "mushroom", name: "Giant Mushroom", category: "nature", description: "Bouncy and bright.", defaultColor: "#f472b6", unlockLevel: 1 },
  { kind: "flowers", name: "Flower Patch", category: "nature", description: "A cluster of blossoms.", defaultColor: "#fbbf24", unlockLevel: 1 },
  { kind: "boulder", name: "Boulder", category: "nature", description: "A mossy rock.", defaultColor: "#94a3b8", unlockLevel: 1 },
  { kind: "cottage", name: "Cottage", category: "build", description: "A cozy little home.", defaultColor: "#f59e0b", unlockLevel: 1 },
  { kind: "tower", name: "Wizard Tower", category: "build", description: "Stone tower with a pointy roof.", defaultColor: "#818cf8", unlockLevel: 1 },
  { kind: "lighthouse", name: "Lighthouse", category: "build", description: "Guides sky-ships home.", defaultColor: "#f87171", unlockLevel: 1, emitsLight: true },
  { kind: "windmill", name: "Windmill", category: "build", description: "Its sails spin in the breeze.", defaultColor: "#fde68a", unlockLevel: 2 },
  { kind: "fence", name: "Fence", category: "build", description: "Mark a path or garden.", defaultColor: "#d6a46b", unlockLevel: 1 },
  { kind: "crystal", name: "Crystal", category: "magic", description: "Glows softly at night.", defaultColor: "#22d3ee", unlockLevel: 1, emitsLight: true },
  { kind: "portal", name: "Portal Ring", category: "magic", description: "A swirling gateway.", defaultColor: "#c084fc", unlockLevel: 3, emitsLight: true },
  { kind: "wisp", name: "Wisp Orb", category: "magic", description: "A floating spirit light.", defaultColor: "#67e8f9", unlockLevel: 1, emitsLight: true },
  { kind: "runestone", name: "Rune Stone", category: "magic", description: "Ancient, humming stone.", defaultColor: "#fbbf24", unlockLevel: 4, emitsLight: true },
  { kind: "lantern", name: "Lantern", category: "light", description: "A warm glowing lamp post.", defaultColor: "#fcd34d", unlockLevel: 1, emitsLight: true },
  { kind: "campfire", name: "Campfire", category: "light", description: "Crackling and cozy.", defaultColor: "#fb923c", unlockLevel: 1, emitsLight: true },
  { kind: "flag", name: "Banner", category: "light", description: "Show your colors.", defaultColor: "#8b5cf6", unlockLevel: 1 },
];

export const ASSET_MAP = Object.fromEntries(ASSETS.map((a) => [a.kind, a])) as Record<AssetKind, AssetDef>;

export const CATEGORIES: { id: AssetCategory; label: string }[] = [
  { id: "nature", label: "Nature" },
  { id: "build", label: "Buildings" },
  { id: "magic", label: "Magic" },
  { id: "light", label: "Lights" },
];

/** Curated swatches with enough contrast against the dark scene. */
export const SWATCHES = [
  "#8b5cf6", "#a78bfa", "#c084fc", "#f472b6", "#f87171", "#fb923c",
  "#fbbf24", "#fde68a", "#34d399", "#22d3ee", "#60a5fa", "#818cf8",
  "#e2e8f0", "#94a3b8", "#d6a46b", "#7c2d12",
];

export interface ThemeDef {
  id: IslandTheme;
  name: string;
  blurb: string;
  grass: string;
  rock: string;
  sky: string;
  fog: string;
  accent: string;
}

export const THEMES: Record<IslandTheme, ThemeDef> = {
  twilight: { id: "twilight", name: "Twilight", blurb: "Violet dusk and starlight.", grass: "#6d5bd0", rock: "#2a2461", sky: "#0b0a2b", fog: "#14123d", accent: "#a78bfa" },
  aurora: { id: "aurora", name: "Aurora", blurb: "Cool cyan glow and frost.", grass: "#2bb5b8", rock: "#1c3557", sky: "#061527", fog: "#0b2238", accent: "#22d3ee" },
  ember: { id: "ember", name: "Ember", blurb: "Golden sunset warmth.", grass: "#d99a2b", rock: "#4a2a2a", sky: "#1a0b1f", fog: "#2a1229", accent: "#fbbf24" },
  verdant: { id: "verdant", name: "Verdant", blurb: "Lush meadows and moss.", grass: "#3fae6a", rock: "#30364f", sky: "#08122a", fog: "#10203a", accent: "#34d399" },
};

/** Radius of the walkable top of the island, in world units. */
export const ISLAND_RADIUS = 6;
export const MAX_OBJECTS = 120;
export const MAX_SAVES = 6;
export const MAX_CREATIONS = 30;
export const DAILY_AI_LIMIT = 15;
