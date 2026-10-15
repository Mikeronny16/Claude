import { GRID_LIMIT, MAX_LEVEL, MIN_TILES, TILE_STEP } from "./catalog";
import type { GroundTool, GroundType, Tile, Vec3, WorldObject } from "./types";

/** How far a water surface sits below the surrounding land. */
export const WATER_DROP = 0.14;
/** Highest an object may float above the ground. */
export const MAX_ABOVE_GROUND = 8;

const GROUND_TYPES: GroundType[] = ["grass", "dirt", "sand", "stone", "water"];

export const tileKey = (x: number, z: number) => `${x},${z}`;
export const cellOf = (v: number) => Math.round(v);

export function tileTop(t: Tile): number {
  return t.h * TILE_STEP - (t.ground === "water" ? WATER_DROP : 0);
}

export function tileMap(tiles: Tile[]): Map<string, Tile> {
  return new Map(tiles.map((t) => [tileKey(t.x, t.z), t]));
}

export function tileAt(map: Map<string, Tile>, x: number, z: number): Tile | undefined {
  return map.get(tileKey(cellOf(x), cellOf(z)));
}

export function nearestTile(tiles: Tile[], x: number, z: number, accept: (t: Tile) => boolean = () => true): Tile {
  let best = tiles[0];
  let bestD = Infinity;
  for (const t of tiles) {
    if (!accept(t)) continue;
    const d = (t.x - x) ** 2 + (t.z - z) ** 2;
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return best;
}

/**
 * Moves a point onto the island: off-island points slide onto the nearest
 * tile, and nothing sinks below the ground or floats too high.
 */
export function clampToLand([x, y, z]: Vec3, tiles: Tile[], opts: { avoidWater?: boolean; map?: Map<string, Tile> } = {}): Vec3 {
  if (tiles.length === 0) return [x, Math.max(0, y), z];
  const map = opts.map ?? tileMap(tiles);
  let t = tileAt(map, x, z);
  const ok = (c: Tile) => !opts.avoidWater || c.ground !== "water";
  if (!t || !ok(t)) {
    t = nearestTile(tiles, x, z, ok);
    x = Math.min(t.x + 0.42, Math.max(t.x - 0.42, x));
    z = Math.min(t.z + 0.42, Math.max(t.z - 0.42, z));
  }
  const top = tileTop(t);
  return [x, Math.min(top + MAX_ABOVE_GROUND, Math.max(top, y)), z];
}

export function settleObjects(objects: WorldObject[], tiles: Tile[], opts: { avoidWater?: boolean } = {}): WorldObject[] {
  const map = tileMap(tiles);
  return objects.map((o) => ({ ...o, position: clampToLand(o.position, tiles, { ...opts, map }) }));
}

function seeded(seed: number) {
  let s = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function hashSeed(text: string): number {
  let h = 7;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 2147483646;
  return h;
}

export interface IslandRecipe {
  /** Base radius in tiles. */
  radius?: number;
  /** Hill center cell; null for a flat island. */
  hill?: [number, number] | null;
  /** Pond center cell; null for no pond. */
  pond?: [number, number] | null;
  /** Run a stream from the pond to the edge (makes a waterfall). */
  stream?: boolean;
  /** Stone path from the center outward. */
  path?: boolean;
}

/** Deterministic starter island: irregular coast, a hill, a pond with a waterfall stream, sand and a stone path. */
export function generateTiles(seed = 1, recipe: IslandRecipe = {}): Tile[] {
  const r = seeded(seed);
  const radius = recipe.radius ?? 5.2;
  const phase = r() * 10;
  const tiles: Tile[] = [];
  for (let x = -GRID_LIMIT + 1; x <= GRID_LIMIT - 1; x++) {
    for (let z = -GRID_LIMIT + 1; z <= GRID_LIMIT - 1; z++) {
      const a = Math.atan2(z, x);
      const coast = radius + Math.sin(a * 3 + phase) * 0.6 + Math.sin(a * 5 + phase * 2) * 0.35;
      if (Math.hypot(x, z) <= coast || (x === 0 && z === 0)) tiles.push({ x, z, h: 0, ground: "grass" });
    }
  }
  const map = tileMap(tiles);
  const angle = r() * Math.PI * 2;

  const hill = recipe.hill === undefined ? ([Math.round(Math.cos(angle) * 2.6), Math.round(Math.sin(angle) * 2.6)] as [number, number]) : recipe.hill;
  if (hill) {
    for (const t of tiles) {
      const d = Math.hypot(t.x - hill[0], t.z - hill[1]);
      if (d <= 0.9) t.h = 2;
      else if (d <= 2.1) t.h = 1;
    }
  }

  const pond =
    recipe.pond === undefined ? ([Math.round(Math.cos(angle + Math.PI) * 2.2), Math.round(Math.sin(angle + Math.PI) * 2.2)] as [number, number]) : recipe.pond;
  if (pond) {
    const water = (t: Tile | undefined) => {
      if (!t) return;
      t.ground = "water";
      t.h = 0;
    };
    for (const t of tiles) if (Math.hypot(t.x - pond[0], t.z - pond[1]) <= 1.1) water(t);
    if (recipe.stream !== false) {
      // Walk straight away from the center (along the main axis, so the
      // stream leaves through a tile side) until it falls off the edge.
      const alongX = Math.abs(pond[0]) >= Math.abs(pond[1]);
      const dx = alongX ? Math.sign(pond[0]) || 1 : 0;
      const dz = alongX ? 0 : Math.sign(pond[1]) || 1;
      for (let s = 1; s < GRID_LIMIT * 2; s++) {
        const t = tileAt(map, pond[0] + dx * s, pond[1] + dz * s);
        if (!t) break;
        water(t);
      }
    }
    for (const t of tiles) {
      if (t.ground !== "grass" || t.h !== 0) continue;
      let nearWater = false;
      for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) if (map.get(tileKey(t.x + dx, t.z + dz))?.ground === "water") nearWater = true;
      if (nearWater && r() < 0.75) t.ground = "sand";
    }
  }

  if (recipe.path !== false) {
    const pa = angle + Math.PI / 2;
    for (let s = 0; s < GRID_LIMIT; s++) {
      const t = tileAt(map, Math.cos(pa) * s, Math.sin(pa) * s);
      if (!t) break;
      if (t.h === 0 && t.ground === "grass") t.ground = "stone";
    }
  }

  for (let i = 0; i < 3; i++) {
    const t = tiles[Math.floor(r() * tiles.length)];
    if (t.ground === "grass") t.ground = "dirt";
  }
  return tiles;
}

export function sanitizeTiles(raw: unknown): Tile[] | null {
  if (!Array.isArray(raw)) return null;
  const seen = new Set<string>();
  const out: Tile[] = [];
  for (const item of raw.slice(0, (GRID_LIMIT * 2 + 1) ** 2)) {
    if (!item || typeof item !== "object") continue;
    const t = item as Record<string, unknown>;
    const x = Number(t.x);
    const z = Number(t.z);
    const h = Number(t.h);
    if (![x, z, h].every(Number.isInteger)) continue;
    if (Math.abs(x) > GRID_LIMIT || Math.abs(z) > GRID_LIMIT || h < 0 || h > MAX_LEVEL) continue;
    const ground = GROUND_TYPES.includes(t.ground as GroundType) ? (t.ground as GroundType) : "grass";
    const key = tileKey(x, z);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ x, z, h: ground === "water" ? Math.min(h, MAX_LEVEL) : h, ground });
  }
  return out.length >= MIN_TILES ? out : null;
}

export type GroundEdit = { ok: true; tiles: Tile[]; objects: WorldObject[] } | { ok: false; reason: string } | null;

const objectsInCell = (objects: WorldObject[], x: number, z: number) => objects.filter((o) => cellOf(o.position[0]) === x && cellOf(o.position[2]) === z);

/**
 * Applies a ground tool to one cell. Returns null when nothing changes,
 * a reason when the edit isn't allowed, or the new tiles and objects
 * (objects resting on a tile move with it).
 */
export function applyGroundTool(tiles: Tile[], objects: WorldObject[], x: number, z: number, tool: GroundTool): GroundEdit {
  const map = tileMap(tiles);
  const key = tileKey(x, z);
  const cur = map.get(key);

  if (tool === "add") {
    if (cur) return null;
    if (Math.abs(x) > GRID_LIMIT || Math.abs(z) > GRID_LIMIT) return { ok: false, reason: "Your island can't grow any bigger in that direction." };
    const neighbors = [map.get(tileKey(x + 1, z)), map.get(tileKey(x - 1, z)), map.get(tileKey(x, z + 1)), map.get(tileKey(x, z - 1))].filter((t): t is Tile => !!t);
    if (neighbors.length === 0) return { ok: false, reason: "New land has to touch your island." };
    const h = Math.min(...neighbors.map((t) => t.h));
    return { ok: true, tiles: [...tiles, { x, z, h, ground: "grass" }], objects };
  }

  if (!cur) return null;

  if (tool === "remove") {
    if (objectsInCell(objects, x, z).length > 0) return { ok: false, reason: "Move or delete the objects on this tile first." };
    if (tiles.length <= MIN_TILES) return { ok: false, reason: `Your island needs at least ${MIN_TILES} tiles.` };
    return { ok: true, tiles: tiles.filter((t) => t !== cur), objects };
  }

  let next: Tile;
  if (tool === "raise") {
    if (cur.h >= MAX_LEVEL) return { ok: false, reason: "That tile is already as high as it goes." };
    next = { ...cur, h: cur.h + 1, ground: cur.ground === "water" ? "grass" : cur.ground };
  } else if (tool === "lower") {
    if (cur.h <= 0) return { ok: false, reason: "That tile is already at the lowest level." };
    next = { ...cur, h: cur.h - 1 };
  } else {
    if (cur.ground === tool) return null;
    next = { ...cur, ground: tool };
  }

  const oldTop = tileTop(cur);
  const newTop = tileTop(next);
  const moved = objects.map((o) => {
    if (cellOf(o.position[0]) !== x || cellOf(o.position[2]) !== z) return o;
    const resting = Math.abs(o.position[1] - oldTop) < 0.06;
    const y = resting ? newTop : Math.max(newTop, o.position[1]);
    return y === o.position[1] ? o : { ...o, position: [o.position[0], y, o.position[2]] as Vec3 };
  });
  return { ok: true, tiles: tiles.map((t) => (t === cur ? next : t)), objects: moved };
}

export type Side = "+x" | "-x" | "+z" | "-z";

/** Water tiles on the island's edge, with the open sides where a waterfall pours out. */
export function waterfallEdges(tiles: Tile[]): { tile: Tile; side: Side }[] {
  const map = tileMap(tiles);
  const out: { tile: Tile; side: Side }[] = [];
  for (const t of tiles) {
    if (t.ground !== "water") continue;
    if (!map.has(tileKey(t.x + 1, t.z))) out.push({ tile: t, side: "+x" });
    if (!map.has(tileKey(t.x - 1, t.z))) out.push({ tile: t, side: "-x" });
    if (!map.has(tileKey(t.x, t.z + 1))) out.push({ tile: t, side: "+z" });
    if (!map.has(tileKey(t.x, t.z - 1))) out.push({ tile: t, side: "-z" });
  }
  return out;
}

/** Empty cells next to the island where the "Add land" tool can place a tile (and the height it would get). */
export function addableCells(tiles: Tile[]): { x: number; z: number; h: number }[] {
  const map = tileMap(tiles);
  const out = new Map<string, { x: number; z: number; h: number }>();
  for (const t of tiles) {
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const x = t.x + dx;
      const z = t.z + dz;
      if (Math.abs(x) > GRID_LIMIT || Math.abs(z) > GRID_LIMIT || map.has(tileKey(x, z))) continue;
      const k = tileKey(x, z);
      const prev = out.get(k);
      if (!prev || t.h < prev.h) out.set(k, { x, z, h: t.h });
    }
  }
  return [...out.values()];
}
