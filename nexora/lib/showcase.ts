import { generateTiles, settleObjects, type IslandRecipe } from "./terrain";
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

/** Builds a showcase world: generated ground, objects settled onto dry land. */
function world(name: string, theme: IslandTheme, seed: number, recipe: IslandRecipe, objects: WorldObject[]): World {
  const tiles = generateTiles(seed, recipe);
  return { name, theme, tiles, objects: settleObjects(objects, tiles, { avoidWater: true }), updatedAt: 0 };
}

/**
 * Hand-built example worlds. In this prototype Explore only shows these
 * team-made worlds; player sharing is not live yet.
 */
export const SHOWCASE: ShowcaseWorld[] = [
  {
    id: "lantern-harbor",
    title: "Lantern Harbor",
    author: "NEXORA Team",
    blurb: "A sleepy village where lanterns guide sky-ships home.",
    tags: ["cozy", "village"],
    world: world("Lantern Harbor", "ember", 11, { radius: 5.4, hill: [-3, -2], pond: [3, 2] }, [
      o("lighthouse", [-3, 2, -2], "#f05252", 1.1),
      o("cottage", [-0.6, 0, 1.2], "#e0673f", 1, 0.4),
      o("cottage", [1.2, 0, -1.4], "#fb923c", 0.9, -0.3),
      o("cottage", [-2.4, 0, 1.4], "#e0673f", 1.05, 1.2),
      o("lantern", [0.6, 0, 0.2], "#fcd34d"),
      o("lantern", [-1.6, 0, 2.6], "#fcd34d"),
      o("campfire", [0.2, 0, -0.4], "#fb923c"),
      o("fence", [-3.6, 0, 0.8], "#d6a46b", 1, 1.4),
      o("pine", [-4, 0, -0.4], "#3fae6a", 1.2),
      o("pine", [-1, 0, -3.6], "#3fae6a"),
      o("palm", [3.4, 0, -0.6], "#8fcf4a"),
      o("pumpkins", [1.8, 0, 3.4], "#f59e0b"),
      o("flag", [2.2, 0, 0.2], "#8b5cf6"),
      o("fox", [0.9, 0, 1.2], "#f08a3c", 1, 0.8),
      o("wisp", [-3, 3.6, -2], "#fde68a", 0.7),
    ]),
  },
  {
    id: "crystal-hollow",
    title: "Crystal Hollow",
    author: "NEXORA Team",
    blurb: "A ring of humming crystals around an ancient portal.",
    tags: ["magic", "glow"],
    world: world("Crystal Hollow", "aurora", 23, { radius: 5.3, hill: [0, 0], pond: [3, -3] }, [
      o("portal", [0, 0, 0], "#c084fc", 1.2),
      ...ring("crystal", 6, 2.7, "#22d3ee", 0.9),
      ...ring("wisp", 4, 3.8, "#67e8f9", 0.8, 1.6, 0.4),
      o("runestone", [-3.8, 0, 2.2], "#fbbf24", 1.1),
      o("runestone", [3.4, 0, 2.4], "#fbbf24"),
      o("boulder", [-1.4, 0, -4], "#a8a3bd", 1.3),
      o("slime", [1.6, 0, 3.6], "#5eead4"),
      o("pine", [-2.4, 0, -3.6], "#3fae6a", 1.1),
      o("pine", [-4, 0, -1.2], "#3fae6a"),
    ]),
  },
  {
    id: "mushroom-meadow",
    title: "Mushroom Meadow",
    author: "NEXORA Team",
    blurb: "Giant mushrooms, wildflowers and a windmill that never stops.",
    tags: ["nature", "colorful"],
    world: world("Mushroom Meadow", "verdant", 37, { radius: 5.4, hill: [-3, -2], pond: [2, 3] }, [
      o("windmill", [-3, 0, -2], "#fde68a", 1.1, 0.6),
      o("mushroom", [1.6, 0, -1.2], "#ef5b6b", 1.6),
      o("mushroom", [3, 0, 0.4], "#a78bfa", 1.1),
      o("mushroom", [0.4, 0, 1.4], "#fb923c", 0.8),
      ...ring("flowers", 6, 4.3, "#fbbf24", 1, 0, 0.9),
      o("roundTree", [-1.6, 0, 2.4], "#7cc35a", 1.2),
      o("roundTree", [3.2, 0, -3], "#f472b6"),
      o("bunny", [-0.4, 0, -0.2], "#f5f0ff", 1, 0.6),
      o("bunny", [0.8, 0, -2.6], "#fbcfe8", 0.9, -0.4),
      o("pumpkins", [-3.4, 0, 1.4], "#f59e0b"),
      o("boulder", [0, 0, -4], "#a8a3bd"),
    ]),
  },
  {
    id: "sky-citadel",
    title: "Sky Citadel",
    author: "NEXORA Team",
    blurb: "Wizard towers, banners and stepping stones floating in the clouds.",
    tags: ["epic", "castle"],
    world: world("Sky Citadel", "twilight", 51, { radius: 5.6, hill: [0, -1], pond: [-3, 3] }, [
      o("tower", [0, 0, -1], "#7c6cf0", 1.5),
      o("tower", [-2.6, 0, 1.2], "#a78bfa", 1.05),
      o("tower", [2.6, 0, 1.2], "#a78bfa", 1.05),
      o("flag", [-1.2, 0, 2.4], "#fbbf24"),
      o("flag", [1.2, 0, 2.4], "#fbbf24"),
      o("boulder", [3.4, 2.6, -2.4], "#a8a3bd", 0.8),
      o("boulder", [4.2, 3.6, -0.6], "#a8a3bd", 0.7),
      o("crystal", [4.2, 4.3, -0.6], "#22d3ee", 0.6),
      o("wisp", [-3, 3.4, -2.6], "#67e8f9"),
      o("owl", [1.4, 0, 0.4], "#a7825a", 1, -0.5),
      o("runestone", [0, 0, 3.4], "#fbbf24", 1.1),
      o("lantern", [-1.6, 0, -2.4], "#fcd34d"),
      o("lantern", [1.6, 0, -2.4], "#fcd34d"),
      o("pine", [-4.2, 0, -1.4], "#3fae6a"),
      o("pine", [4.4, 0, 1.6], "#3fae6a"),
    ]),
  },
];

export const SHOWCASE_MAP = Object.fromEntries(SHOWCASE.map((s) => [s.id, s]));
