import type { AssetKind, IslandTheme, Vec3, World, WorldObject } from "./types";

export interface ShowcaseWorld {
  id: string;
  title: string;
  author: string;
  blurb: string;
  tags: string[];
  world: World;
}

let n = 0;
function o(kind: AssetKind, position: Vec3, color: string, scale = 1, rotY = 0): WorldObject {
  n += 1;
  return { id: `sc${n}`, kind, position, rotation: [0, rotY, 0], scale, color };
}

function ring(kind: AssetKind, count: number, radius: number, color: string, scale = 1, y = 0, offset = 0): WorldObject[] {
  return Array.from({ length: count }, (_, i) => {
    const a = offset + (i / count) * Math.PI * 2;
    return o(kind, [Math.cos(a) * radius, y, Math.sin(a) * radius], color, scale, -a);
  });
}

const world = (name: string, theme: IslandTheme, objects: WorldObject[]): World => ({ name, theme, objects, updatedAt: 0 });

/**
 * Hand-built example worlds. In this prototype Explore only shows these
 * team-made worlds; player sharing is not live yet.
 */
export const SHOWCASE: ShowcaseWorld[] = [
  {
    id: "lantern-harbor",
    title: "Lantern Harbor",
    author: "NEXORA Team",
    blurb: "A sleepy fishing village where lanterns guide sky-ships home.",
    tags: ["cozy", "village"],
    world: world("Lantern Harbor", "ember", [
      o("lighthouse", [4.4, 0, -1.2], "#f87171", 1.2),
      o("cottage", [-1.2, 0, 1.4], "#f59e0b", 1, 0.4),
      o("cottage", [1.4, 0, 2.2], "#fb923c", 0.9, -0.3),
      o("cottage", [-2.6, 0, -1], "#fbbf24", 1.1, 1.2),
      o("lantern", [0.2, 0, 0.4], "#fcd34d"),
      o("lantern", [2.6, 0, 0.2], "#fcd34d"),
      o("lantern", [-2.4, 0, 1.8], "#fcd34d"),
      o("campfire", [0, 0, -1.6], "#fb923c"),
      o("fence", [-3.6, 0, 0.8], "#d6a46b", 1, 1.4),
      o("fence", [-3.2, 0, 2.2], "#d6a46b", 1, 0.9),
      o("pine", [-4, 0, -2.6], "#34d399", 1.2),
      o("pine", [-1, 0, -3.8], "#34d399"),
      o("roundTree", [2.4, 0, -3], "#fbbf24"),
      o("flowers", [0.9, 0, 3.6], "#f472b6"),
      o("flag", [3.2, 0, 1.6], "#8b5cf6"),
      o("wisp", [4.4, 3.8, -1.2], "#fde68a", 0.7),
    ]),
  },
  {
    id: "crystal-hollow",
    title: "Crystal Hollow",
    author: "NEXORA Team",
    blurb: "A ring of humming crystals around an ancient portal.",
    tags: ["magic", "glow"],
    world: world("Crystal Hollow", "aurora", [
      o("portal", [0, 0, 0], "#c084fc", 1.3),
      ...ring("crystal", 6, 2.6, "#22d3ee", 0.9),
      ...ring("wisp", 4, 3.8, "#67e8f9", 0.8, 1.6, 0.4),
      o("runestone", [-3.8, 0, 2.4], "#fbbf24", 1.1),
      o("runestone", [3.6, 0, -2.6], "#fbbf24"),
      o("boulder", [4.2, 0, 1.8], "#94a3b8", 1.3),
      o("boulder", [-4.4, 0, -1.4], "#94a3b8"),
      o("pine", [-2, 0, -4.4], "#60a5fa", 1.1),
      o("pine", [1.6, 0, 4.4], "#60a5fa"),
    ]),
  },
  {
    id: "mushroom-meadow",
    title: "Mushroom Meadow",
    author: "NEXORA Team",
    blurb: "Giant mushrooms, wildflowers and a windmill that never stops.",
    tags: ["nature", "colorful"],
    world: world("Mushroom Meadow", "verdant", [
      o("windmill", [-2.6, 0, -2], "#fde68a", 1.2, 0.6),
      o("mushroom", [1.6, 0, -1.2], "#f472b6", 1.6),
      o("mushroom", [2.8, 0, 0.6], "#a78bfa", 1.1),
      o("mushroom", [0.6, 0, 1.8], "#fb923c", 0.8),
      ...ring("flowers", 7, 4.2, "#fbbf24", 1, 0, 0.2),
      o("roundTree", [-1.2, 0, 2.6], "#34d399", 1.2),
      o("roundTree", [3.4, 0, -3], "#f472b6"),
      o("cottage", [-3.6, 0, 1.6], "#f59e0b", 0.9, 1.1),
      o("lantern", [-2.4, 0, 2.6], "#fcd34d"),
      o("boulder", [0, 0, -3.8], "#94a3b8"),
    ]),
  },
  {
    id: "sky-citadel",
    title: "Sky Citadel",
    author: "NEXORA Team",
    blurb: "Wizard towers, banners and stepping stones floating in the clouds.",
    tags: ["epic", "castle"],
    world: world("Sky Citadel", "twilight", [
      o("tower", [0, 0, 0], "#818cf8", 1.6),
      o("tower", [-2.6, 0, 1.6], "#a78bfa", 1.1),
      o("tower", [2.6, 0, 1.6], "#a78bfa", 1.1),
      o("flag", [-1.2, 0, 2.8], "#fbbf24"),
      o("flag", [1.2, 0, 2.8], "#fbbf24"),
      o("boulder", [3.4, 1.8, -2.4], "#94a3b8", 0.8),
      o("boulder", [4.2, 3, -0.6], "#94a3b8", 0.7),
      o("crystal", [4.2, 3.6, -0.6], "#22d3ee", 0.6),
      o("wisp", [-3, 3.2, -2.6], "#67e8f9"),
      o("runestone", [0, 0, -3.2], "#fbbf24", 1.2),
      o("lantern", [-1.6, 0, -1.8], "#fcd34d"),
      o("lantern", [1.6, 0, -1.8], "#fcd34d"),
      o("pine", [-4.2, 0, -1.4], "#34d399"),
      o("pine", [4.6, 0, 1.2], "#34d399"),
    ]),
  },
];

export const SHOWCASE_MAP = Object.fromEntries(SHOWCASE.map((s) => [s.id, s]));
