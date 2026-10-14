import { ASSET_MAP, ISLAND_RADIUS } from "./catalog";
import type { AssetCategory, Creation, Progress, WorldObject } from "./types";

export interface QuestContext {
  objects: WorldObject[];
  progress: Progress;
  creations: Creation[];
}

export type QuestIcon = "sparkles" | "trees" | "home" | "lighthouse" | "palette" | "flame" | "wand" | "box" | "save" | "compass" | "castle" | "cloud";

export interface QuestDef {
  id: string;
  title: string;
  description: string;
  xp: number;
  target: number;
  icon: QuestIcon;
  /** Where the player goes to work on it. */
  href: string;
  measure: (ctx: QuestContext) => number;
}

const categoryOf = (o: WorldObject): AssetCategory | "custom" => (o.kind === "custom" ? "custom" : ASSET_MAP[o.kind].category);
const countCategory = (ctx: QuestContext, c: AssetCategory) => ctx.objects.filter((o) => categoryOf(o) === c).length;
const distXZ = (a: WorldObject, b: WorldObject) => Math.hypot(a.position[0] - b.position[0], a.position[2] - b.position[2]);

export const QUESTS: QuestDef[] = [
  {
    id: "first-spark",
    title: "First Spark",
    description: "Place your very first object on your island.",
    xp: 50, target: 1, icon: "sparkles", href: "/builder",
    measure: (c) => c.progress.placedTotal,
  },
  {
    id: "grove-keeper",
    title: "Grove Keeper",
    description: "Grow a little forest: have 5 nature objects on your island.",
    xp: 100, target: 5, icon: "trees", href: "/builder",
    measure: (c) => countCategory(c, "nature"),
  },
  {
    id: "cozy-corner",
    title: "Cozy Corner",
    description: "Build a cottage with a lantern or campfire right next to it.",
    xp: 120, target: 1, icon: "home", href: "/builder",
    measure: (c) => {
      const homes = c.objects.filter((o) => o.kind === "cottage");
      const lights = c.objects.filter((o) => o.kind === "lantern" || o.kind === "campfire");
      return homes.some((h) => lights.some((l) => distXZ(h, l) <= 2.5)) ? 1 : 0;
    },
  },
  {
    id: "lightkeeper",
    title: "Lightkeeper",
    description: "Place a lighthouse near the edge of your island.",
    xp: 150, target: 1, icon: "lighthouse", href: "/builder",
    measure: (c) =>
      c.objects.some((o) => o.kind === "lighthouse" && Math.hypot(o.position[0], o.position[2]) >= ISLAND_RADIUS * 0.6) ? 1 : 0,
  },
  {
    id: "palette-painter",
    title: "Palette Painter",
    description: "Use at least 4 different colors across your world.",
    xp: 100, target: 4, icon: "palette", href: "/builder",
    measure: (c) => new Set(c.objects.map((o) => o.color.toLowerCase())).size,
  },
  {
    id: "night-glow",
    title: "Night Glow",
    description: "Light up the night with 3 glowing objects (lanterns, crystals, wisps…).",
    xp: 120, target: 3, icon: "flame", href: "/builder",
    measure: (c) => c.objects.filter((o) => o.kind !== "custom" && ASSET_MAP[o.kind].emitsLight).length,
  },
  {
    id: "dream-weaver",
    title: "Dream Weaver",
    description: "Describe an idea in the AI Creation Studio and bring it to life.",
    xp: 150, target: 1, icon: "wand", href: "/create",
    measure: (c) => c.progress.aiCreations,
  },
  {
    id: "make-it-real",
    title: "Make It Real",
    description: "Place one of your AI creations on your island.",
    xp: 100, target: 1, icon: "box", href: "/builder",
    measure: (c) => c.objects.filter((o) => o.kind === "custom").length,
  },
  {
    id: "time-capsule",
    title: "Time Capsule",
    description: "Save a snapshot of your world so you can come back to it.",
    xp: 60, target: 1, icon: "save", href: "/builder",
    measure: (c) => c.progress.saves,
  },
  {
    id: "wanderer",
    title: "Wanderer",
    description: "Visit 3 showcase worlds in Explore for inspiration.",
    xp: 80, target: 3, icon: "compass", href: "/explore",
    measure: (c) => c.progress.explored.length,
  },
  {
    id: "sky-architect",
    title: "Sky Architect",
    description: "Make something float: raise an object high above the ground.",
    xp: 100, target: 1, icon: "cloud", href: "/builder",
    measure: (c) => (c.objects.some((o) => o.position[1] >= 1.5) ? 1 : 0),
  },
  {
    id: "master-builder",
    title: "Master Builder",
    description: "Fill your island with 20 objects.",
    xp: 200, target: 20, icon: "castle", href: "/builder",
    measure: (c) => c.objects.length,
  },
];

interface DailyTemplate {
  title: string;
  description: string;
  target: number;
  icon: QuestIcon;
  measure: (ctx: QuestContext) => number;
}

const DAILY_TEMPLATES: DailyTemplate[] = [
  { title: "Village Day", description: "Today's theme: a tiny village. Have 3 buildings on your island.", target: 3, icon: "home", measure: (c) => countCategory(c, "build") },
  { title: "Enchanted Garden", description: "Today's theme: magic garden. Have 2 magic objects and 3 nature objects.", target: 5, icon: "trees", measure: (c) => Math.min(countCategory(c, "magic"), 2) + Math.min(countCategory(c, "nature"), 3) },
  { title: "Festival of Lights", description: "Today's theme: celebration! Have 4 light-category objects.", target: 4, icon: "flame", measure: (c) => countCategory(c, "light") },
  { title: "Rainbow Island", description: "Today's theme: color burst. Use 6 different colors.", target: 6, icon: "palette", measure: (c) => new Set(c.objects.map((o) => o.color.toLowerCase())).size },
];

export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function dailyQuest(date = new Date()): QuestDef {
  const key = dayKey(date);
  const dayNumber = Math.floor(new Date(`${key}T00:00:00Z`).getTime() / 86_400_000);
  const t = DAILY_TEMPLATES[dayNumber % DAILY_TEMPLATES.length];
  return { id: `daily-${key}`, xp: 75, href: "/builder", ...t };
}

export function allQuests(date = new Date()): QuestDef[] {
  return [dailyQuest(date), ...QUESTS];
}

export function questById(id: string, date = new Date()): QuestDef | undefined {
  return allQuests(date).find((q) => q.id === id);
}

export interface QuestStatus {
  quest: QuestDef;
  current: number;
  complete: boolean;
  claimed: boolean;
}

export function questStatus(quest: QuestDef, ctx: QuestContext): QuestStatus {
  const current = Math.min(quest.measure(ctx), quest.target);
  return {
    quest,
    current,
    complete: current >= quest.target,
    claimed: ctx.progress.claimed.includes(quest.id),
  };
}

export function claimableCount(ctx: QuestContext, date = new Date()): number {
  return allQuests(date).filter((q) => {
    const s = questStatus(q, ctx);
    return s.complete && !s.claimed;
  }).length;
}
