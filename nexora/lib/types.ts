export type Vec3 = [number, number, number];

export type AssetCategory = "nature" | "build" | "magic" | "light";

export type AssetKind =
  | "pine"
  | "roundTree"
  | "mushroom"
  | "flowers"
  | "boulder"
  | "cottage"
  | "tower"
  | "lighthouse"
  | "windmill"
  | "fence"
  | "crystal"
  | "portal"
  | "wisp"
  | "runestone"
  | "lantern"
  | "campfire"
  | "flag";

export type ObjectKind = AssetKind | "custom";

export interface WorldObject {
  id: string;
  kind: ObjectKind;
  /** Set when kind === "custom": id of an AI creation in the library. */
  creationId?: string;
  position: Vec3;
  /** Euler rotation in radians. */
  rotation: Vec3;
  /** Uniform scale keeps models readable and kid-friendly. */
  scale: number;
  color: string;
}

export type IslandTheme = "twilight" | "aurora" | "ember" | "verdant";

export interface World {
  name: string;
  theme: IslandTheme;
  objects: WorldObject[];
  updatedAt: number;
}

export type AgeBand = "12-13" | "14-15" | "16+";

export interface Profile {
  name: string;
  avatar: AvatarId;
  ageBand: AgeBand;
  createdAt: number;
}

export type AvatarId = "nova" | "wisp" | "drake" | "golem" | "owl" | "comet";

export type Quality = "low" | "high";

export interface Settings {
  reducedMotion: boolean;
  quality: Quality;
  /** Minutes between gentle "take a break" reminders. 0 disables. */
  breakReminderMinutes: 0 | 30 | 60;
  snapToGrid: boolean;
}

export interface SaveSlot {
  id: string;
  name: string;
  savedAt: number;
  world: World;
}

export type PartShape =
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "icosahedron"
  | "octahedron"
  | "capsule";

export interface CreationPart {
  shape: PartShape;
  position: Vec3;
  /** Degrees, easier for models and people to reason about. */
  rotation: Vec3;
  scale: Vec3;
  color: string;
  glow: boolean;
}

export type CreationAnimation = "none" | "spin" | "bob" | "pulse";

export interface CreationSpec {
  name: string;
  description: string;
  animation: CreationAnimation;
  parts: CreationPart[];
}

export type CreationSource = "live" | "demo";

export interface Creation {
  id: string;
  prompt: string;
  spec: CreationSpec;
  source: CreationSource;
  createdAt: number;
}

export type ReactionId = "inspiring" | "cozy" | "epic" | "colorful";

export interface Progress {
  xp: number;
  claimed: string[];
  /** Total objects ever placed (does not go down on delete). */
  placedTotal: number;
  aiCreations: number;
  saves: number;
  explored: string[];
  reactions: Record<string, ReactionId[]>;
  reports: { worldId: string; reason: string; at: number }[];
}

export interface AiUsage {
  day: string;
  count: number;
}
