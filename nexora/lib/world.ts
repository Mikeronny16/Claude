import { ASSET_MAP, GRID_LIMIT, MAX_OBJECTS, THEMES } from "./catalog";
import { sanitizeSpec } from "./ai/spec";
import { validateName } from "./safety";
import { generateTiles, sanitizeTiles, settleObjects } from "./terrain";
import type { AssetKind, Creation, IslandTheme, Vec3, World, WorldObject } from "./types";

const HEX = /^#[0-9a-f]{6}$/i;
export const MIN_SCALE = 0.3;
export const MAX_SCALE = 3;

const finite = (v: unknown, fallback = 0) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const clampN = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Coarse bounds check; settleObjects() then puts objects onto real tiles. */
function boundPosition([x, y, z]: Vec3): Vec3 {
  const lim = GRID_LIMIT + 0.5;
  return [clampN(x, -lim, lim), clampN(y, -1, 12), clampN(z, -lim, lim)];
}

export function snap(v: number, step = 0.5): number {
  return Math.round(v / step) * step;
}

export function clampScale(s: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
}

export function wrapAngle(a: number): number {
  const t = Math.PI * 2;
  return ((((a + Math.PI) % t) + t) % t) - Math.PI;
}

export function sanitizeObject(raw: unknown): WorldObject | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const kind = o.kind === "custom" ? "custom" : ASSET_MAP[o.kind as AssetKind] ? (o.kind as AssetKind) : null;
  if (!kind) return null;
  if (kind === "custom" && typeof o.creationId !== "string") return null;
  const pos = Array.isArray(o.position) ? o.position : [];
  const rot = Array.isArray(o.rotation) ? o.rotation : [];
  return {
    id: typeof o.id === "string" && o.id.length <= 40 ? o.id : `o${Math.random().toString(36).slice(2, 10)}`,
    kind,
    ...(kind === "custom" ? { creationId: String(o.creationId).slice(0, 40) } : {}),
    position: boundPosition([finite(pos[0]), finite(pos[1]), finite(pos[2])]),
    rotation: [wrapAngle(finite(rot[0])), wrapAngle(finite(rot[1])), wrapAngle(finite(rot[2]))],
    scale: clampScale(finite(o.scale, 1)),
    color: typeof o.color === "string" && HEX.test(o.color) ? o.color.toLowerCase() : kind === "custom" ? "#ffffff" : ASSET_MAP[kind].defaultColor,
  };
}

export function sanitizeWorld(raw: unknown, fallbackName = "My Island"): World | null {
  if (!raw || typeof raw !== "object") return null;
  const w = raw as Record<string, unknown>;
  const objects = (Array.isArray(w.objects) ? w.objects : [])
    .slice(0, MAX_OBJECTS)
    .map(sanitizeObject)
    .filter((o): o is WorldObject => o !== null);
  const ids = new Set<string>();
  for (const o of objects) {
    if (ids.has(o.id)) o.id = `${o.id}x${ids.size}`;
    ids.add(o.id);
  }
  const name = typeof w.name === "string" && validateName(w.name, { max: 28 }).ok ? w.name.trim() : fallbackName;
  const theme = typeof w.theme === "string" && w.theme in THEMES ? (w.theme as IslandTheme) : "twilight";
  // Worlds saved before tiles existed get a starter island.
  const tiles = sanitizeTiles(w.tiles) ?? generateTiles(1);
  return { name, theme, tiles, objects: settleObjects(objects, tiles), updatedAt: finite(w.updatedAt, Date.now()) };
}

export function sanitizeCreation(raw: unknown): Creation | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  const prompt = typeof c.prompt === "string" ? c.prompt.slice(0, 160) : "";
  const spec = sanitizeSpec(c.spec, prompt);
  if (!spec || typeof c.id !== "string") return null;
  return {
    id: c.id.slice(0, 40),
    prompt,
    spec,
    source: c.source === "live" ? "live" : "demo",
    createdAt: finite(c.createdAt, Date.now()),
  };
}

export const FILE_FORMAT = "nexora-world";

export function exportWorldFile(world: World, creations: Creation[]): string {
  const used = new Set(world.objects.filter((o) => o.kind === "custom").map((o) => o.creationId));
  return JSON.stringify(
    { format: FILE_FORMAT, version: 1, exportedAt: new Date().toISOString(), world, creations: creations.filter((c) => used.has(c.id)) },
    null,
    2,
  );
}

export type ParsedWorldFile = { ok: true; world: World; creations: Creation[] } | { ok: false; error: string };

export function parseWorldFile(text: string): ParsedWorldFile {
  if (text.length > 1_000_000) return { ok: false, error: "That file is too big to be a NEXORA world." };
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't a NEXORA world (it couldn't be read)." };
  }
  const d = data as Record<string, unknown>;
  if (!d || d.format !== FILE_FORMAT) return { ok: false, error: "That file isn't a NEXORA world." };
  const world = sanitizeWorld(d.world);
  if (!world) return { ok: false, error: "That world file is damaged." };
  const creations = (Array.isArray(d.creations) ? d.creations : [])
    .map(sanitizeCreation)
    .filter((c): c is Creation => c !== null);
  return { ok: true, world, creations };
}
