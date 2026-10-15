import type { AssetCategory, AssetKind, GroundTool, GroundType, IslandTheme } from "./types";

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
  { kind: "pine", name: "Pine Tree", category: "nature", description: "A tall evergreen.", defaultColor: "#3fae6a", unlockLevel: 1 },
  { kind: "roundTree", name: "Bloom Tree", category: "nature", description: "A round, leafy tree.", defaultColor: "#7cc35a", unlockLevel: 1 },
  { kind: "palm", name: "Palm Tree", category: "nature", description: "Sunny and swaying.", defaultColor: "#8fcf4a", unlockLevel: 1 },
  { kind: "mushroom", name: "Giant Mushroom", category: "nature", description: "Bouncy and bright.", defaultColor: "#ef5b6b", unlockLevel: 1 },
  { kind: "flowers", name: "Flower Patch", category: "nature", description: "A cluster of blossoms.", defaultColor: "#f472b6", unlockLevel: 1 },
  { kind: "pumpkins", name: "Pumpkin Patch", category: "nature", description: "Plump orange pumpkins.", defaultColor: "#f59e0b", unlockLevel: 1 },
  { kind: "boulder", name: "Boulder", category: "nature", description: "A mossy rock.", defaultColor: "#a8a3bd", unlockLevel: 1 },
  { kind: "cottage", name: "Cottage", category: "build", description: "A cozy little home.", defaultColor: "#e0673f", unlockLevel: 1 },
  { kind: "tower", name: "Wizard Tower", category: "build", description: "Stone tower with a pointy roof.", defaultColor: "#7c6cf0", unlockLevel: 1 },
  { kind: "lighthouse", name: "Lighthouse", category: "build", description: "Guides sky-ships home.", defaultColor: "#f05252", unlockLevel: 1, emitsLight: true },
  { kind: "windmill", name: "Windmill", category: "build", description: "Its sails spin in the breeze.", defaultColor: "#fde68a", unlockLevel: 2 },
  { kind: "fence", name: "Fence", category: "build", description: "Mark a path or garden.", defaultColor: "#d6a46b", unlockLevel: 1 },
  { kind: "crystal", name: "Crystal", category: "magic", description: "Glows softly at night.", defaultColor: "#22d3ee", unlockLevel: 1, emitsLight: true },
  { kind: "portal", name: "Portal Ring", category: "magic", description: "A swirling gateway.", defaultColor: "#c084fc", unlockLevel: 3, emitsLight: true },
  { kind: "wisp", name: "Wisp Orb", category: "magic", description: "A floating spirit light.", defaultColor: "#67e8f9", unlockLevel: 1, emitsLight: true },
  { kind: "runestone", name: "Rune Stone", category: "magic", description: "Ancient, humming stone.", defaultColor: "#fbbf24", unlockLevel: 4, emitsLight: true },
  { kind: "lantern", name: "Lantern", category: "light", description: "A warm glowing lamp post.", defaultColor: "#fcd34d", unlockLevel: 1, emitsLight: true },
  { kind: "campfire", name: "Campfire", category: "light", description: "Crackling and cozy.", defaultColor: "#fb923c", unlockLevel: 1, emitsLight: true },
  { kind: "flag", name: "Banner", category: "light", description: "Show your colors.", defaultColor: "#8b5cf6", unlockLevel: 1 },
  { kind: "fox", name: "Fox", category: "creatures", description: "Curious and fluffy.", defaultColor: "#f08a3c", unlockLevel: 1 },
  { kind: "bunny", name: "Bunny", category: "creatures", description: "Hops around happily.", defaultColor: "#f5f0ff", unlockLevel: 1 },
  { kind: "slime", name: "Slime", category: "creatures", description: "Squishy and friendly.", defaultColor: "#5eead4", unlockLevel: 1 },
  { kind: "owl", name: "Owl", category: "creatures", description: "Wise night watcher.", defaultColor: "#a7825a", unlockLevel: 2 },
];

export const ASSET_MAP = Object.fromEntries(ASSETS.map((a) => [a.kind, a])) as Record<AssetKind, AssetDef>;

export const CATEGORIES: { id: AssetCategory; label: string }[] = [
  { id: "nature", label: "Nature" },
  { id: "build", label: "Buildings" },
  { id: "creatures", label: "Creatures" },
  { id: "magic", label: "Magic" },
  { id: "light", label: "Lights" },
];

/** Curated swatches with enough contrast against the scene. */
export const SWATCHES = [
  "#8b5cf6", "#a78bfa", "#c084fc", "#f472b6", "#ef5b6b", "#fb923c",
  "#fbbf24", "#fde68a", "#7cc35a", "#3fae6a", "#22d3ee", "#60a5fa",
  "#f5f0ff", "#a8a3bd", "#d6a46b", "#7c2d12",
];

export interface ThemeDef {
  id: IslandTheme;
  name: string;
  blurb: string;
  /** Grass color for ground tiles. */
  grass: string;
  /** Earth band just under the grass. */
  soil: string;
  /** Rocky cliffs under the island. */
  rock: string;
  /** Sky above (top of the dome). */
  sky: string;
  /** Horizon color; also the fog color. */
  fog: string;
  /** Glow, rune ring and highlights. */
  accent: string;
  cloud: string;
}

/** Bright, cozy palettes (inspired by soft "pastel sky" island builders). */
export const THEMES: Record<IslandTheme, ThemeDef> = {
  twilight: { id: "twilight", name: "Twilight", blurb: "Lavender sky and soft clouds.", grass: "#7ccc54", soil: "#a0673f", rock: "#8a6a9a", sky: "#4b3388", fog: "#a98bd6", accent: "#f5d0fe", cloud: "#f3e8ff" },
  aurora: { id: "aurora", name: "Aurora", blurb: "Misty teal forest air.", grass: "#5fbf6f", soil: "#8a5a3c", rock: "#5a6b7d", sky: "#123f4c", fog: "#7fb8ad", accent: "#a7f3d0", cloud: "#e6fffa" },
  ember: { id: "ember", name: "Ember", blurb: "Golden sunset warmth.", grass: "#a9c94a", soil: "#a0623c", rock: "#8a5a5a", sky: "#5b2a52", fog: "#eaa98a", accent: "#ffd59e", cloud: "#ffeedd" },
  verdant: { id: "verdant", name: "Verdant", blurb: "Fresh meadows and blue sky.", grass: "#66c24c", soil: "#94603a", rock: "#6b7488", sky: "#2b6ea3", fog: "#a8dcea", accent: "#e6ffd9", cloud: "#ffffff" },
};

export interface GroundDef {
  id: GroundType;
  name: string;
  /** Fixed color; grass uses the theme's grass instead. */
  color: string;
}

export const GROUNDS: Record<GroundType, GroundDef> = {
  grass: { id: "grass", name: "Grass", color: "#7ccc54" },
  dirt: { id: "dirt", name: "Dirt", color: "#a8724a" },
  sand: { id: "sand", name: "Sand", color: "#f0d39a" },
  stone: { id: "stone", name: "Stone path", color: "#c4bfd6" },
  water: { id: "water", name: "Water", color: "#4cc3ea" },
};

export const GROUND_TOOLS: { id: GroundTool; name: string; hint: string }[] = [
  { id: "grass", name: "Grass", hint: "Paint grass" },
  { id: "dirt", name: "Dirt", hint: "Paint a dirt patch" },
  { id: "sand", name: "Sand", hint: "Paint sand" },
  { id: "stone", name: "Stone", hint: "Paint a stone path" },
  { id: "water", name: "Water", hint: "Make a pond — water at the edge becomes a waterfall" },
  { id: "raise", name: "Raise", hint: "Raise a tile one step" },
  { id: "lower", name: "Lower", hint: "Lower a tile one step" },
  { id: "add", name: "Add land", hint: "Tap next to the edge to grow your island" },
  { id: "remove", name: "Remove", hint: "Remove an edge tile" },
];

/** World units per height level. */
export const TILE_STEP = 0.5;
export const MAX_LEVEL = 4;
/** Tiles live on cells from -GRID_LIMIT to GRID_LIMIT. */
export const GRID_LIMIT = 8;
export const MAX_TILES = (GRID_LIMIT * 2 + 1) ** 2;
export const MIN_TILES = 12;
/** Rough radius of a starter island, in world units. */
export const ISLAND_RADIUS = 6;
export const MAX_OBJECTS = 120;
export const MAX_SAVES = 6;
export const MAX_CREATIONS = 30;
export const DAILY_AI_LIMIT = 15;
