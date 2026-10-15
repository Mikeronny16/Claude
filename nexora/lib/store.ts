import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ASSET_MAP, MAX_CREATIONS, MAX_OBJECTS, MAX_SAVES } from "./catalog";
import { levelFromXp } from "./levels";
import { uid } from "./names";
import { dayKey, questById, questStatus, type QuestContext } from "./quests";
import { applyGroundTool, clampToLand, generateTiles, hashSeed } from "./terrain";
import type {
  AgeBand, AiUsage, AssetKind, AvatarId, Creation, CreationSource, CreationSpec, GroundTool, IslandTheme, Profile,
  Progress, ReactionId, SaveSlot, Settings, Tile, Vec3, World, WorldObject,
} from "./types";
import { clampScale, sanitizeCreation, sanitizeWorld, snap, wrapAngle } from "./world";

const HISTORY_LIMIT = 80;

export const DEFAULT_SETTINGS: Settings = {
  reducedMotion: false,
  quality: "high",
  breakReminderMinutes: 0,
  snapToGrid: false,
};

const emptyProgress = (): Progress => ({
  xp: 0,
  claimed: [],
  placedTotal: 0,
  tilesPainted: 0,
  aiCreations: 0,
  saves: 0,
  explored: [],
  reactions: {},
  reports: [],
});

const emptyWorld = (name = "My Island", theme: IslandTheme = "twilight", seed = 1): World => ({
  name,
  theme,
  tiles: generateTiles(seed),
  objects: [],
  updatedAt: Date.now(),
});

/** What undo/redo restores: the objects and the ground they stand on. */
interface Snapshot {
  objects: WorldObject[];
  tiles: Tile[];
}

export interface Toast {
  id: string;
  tone: "info" | "success" | "xp" | "warn";
  title: string;
  body?: string;
}

export interface OnboardingInput {
  name: string;
  avatar: AvatarId;
  ageBand: AgeBand;
  theme: IslandTheme;
  worldName: string;
}

export type ObjectPatch = Partial<Pick<WorldObject, "position" | "rotation" | "scale" | "color">>;

interface PersistedState {
  profile: Profile | null;
  settings: Settings;
  world: World;
  saves: SaveSlot[];
  creations: Creation[];
  progress: Progress;
  aiUsage: AiUsage;
}

export interface NexoraState extends PersistedState {
  hydrated: boolean;
  past: Snapshot[];
  future: Snapshot[];
  selectedId: string | null;
  toasts: Toast[];
  levelUp: number | null;

  completeOnboarding: (input: OnboardingInput) => void;
  updateProfile: (patch: Partial<Pick<Profile, "name" | "avatar">>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  renameWorld: (name: string) => void;
  setTheme: (theme: IslandTheme) => void;

  select: (id: string | null) => void;
  addObject: (kind: AssetKind | "custom", opts?: { position?: Vec3; creationId?: string; color?: string }) => string | null;
  updateObject: (id: string, patch: ObjectPatch) => void;
  duplicateObject: (id: string) => string | null;
  removeObject: (id: string) => void;
  clearWorld: () => void;
  /** Applies a ground tool to the tile at cell (x, z). Returns true if the island changed. */
  paintTile: (x: number, z: number, tool: GroundTool) => boolean;
  undo: () => void;
  redo: () => void;

  saveSnapshot: (name?: string) => SaveSlot;
  restoreSnapshot: (id: string) => void;
  deleteSnapshot: (id: string) => void;
  loadWorld: (world: World, creations?: Creation[]) => void;

  addCreation: (prompt: string, spec: CreationSpec, source: CreationSource) => Creation;
  deleteCreation: (id: string) => void;
  recordAiUse: () => void;

  claimQuest: (id: string) => boolean;
  markExplored: (worldId: string) => void;
  toggleReaction: (worldId: string, reaction: ReactionId) => void;
  reportWorld: (worldId: string, reason: string) => void;

  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  dismissLevelUp: () => void;
  resetEverything: () => void;
}

export function questContext(s: Pick<NexoraState, "world" | "progress" | "creations">): QuestContext {
  return { objects: s.world.objects, tiles: s.world.tiles, progress: s.progress, creations: s.creations };
}

export const useNexora = create<NexoraState>()(
  persist(
    (set, get) => {
      /** Apply a change to objects and/or tiles, recording it for undo. */
      const commit = (next: Partial<Snapshot>, extra: Partial<NexoraState> = {}) => {
        const { world, past } = get();
        set({
          world: { ...world, objects: next.objects ?? world.objects, tiles: next.tiles ?? world.tiles, updatedAt: Date.now() },
          past: [...past, { objects: world.objects, tiles: world.tiles }].slice(-HISTORY_LIMIT),
          future: [],
          ...extra,
        });
      };

      /** Keep positions on land (and on the grid when snapping is on). */
      const prepPosition = (p: Vec3, opts: { avoidWater?: boolean } = {}): Vec3 => {
        const tiles = get().world.tiles;
        const c = clampToLand(p, tiles, opts);
        return get().settings.snapToGrid ? clampToLand([snap(c[0]), snap(c[1], 0.25), snap(c[2])], tiles, opts) : c;
      };

      const toast = (t: Omit<Toast, "id">) => {
        const item = { ...t, id: uid("t") };
        set({ toasts: [...get().toasts, item].slice(-4) });
      };

      return {
        hydrated: false,
        profile: null,
        settings: DEFAULT_SETTINGS,
        world: emptyWorld(),
        saves: [],
        creations: [],
        progress: emptyProgress(),
        aiUsage: { day: "", count: 0 },
        past: [],
        future: [],
        selectedId: null,
        toasts: [],
        levelUp: null,

        completeOnboarding: ({ name, avatar, ageBand, theme, worldName }) => {
          set({
            profile: { name: name.trim(), avatar, ageBand, createdAt: Date.now() },
            world: emptyWorld(worldName.trim(), theme, hashSeed(`${name}:${worldName}`)),
            past: [],
            future: [],
            selectedId: null,
          });
        },

        updateProfile: (patch) => {
          const { profile } = get();
          if (!profile) return;
          set({ profile: { ...profile, ...patch, name: (patch.name ?? profile.name).trim() } });
        },

        updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),

        renameWorld: (name) => set({ world: { ...get().world, name: name.trim(), updatedAt: Date.now() } }),

        setTheme: (theme) => set({ world: { ...get().world, theme, updatedAt: Date.now() } }),

        select: (id) => set({ selectedId: id }),

        addObject: (kind, opts = {}) => {
          const { world, progress, creations } = get();
          if (world.objects.length >= MAX_OBJECTS) {
            toast({ tone: "warn", title: "Your island is full", body: `Islands hold up to ${MAX_OBJECTS} objects. Remove something to make room.` });
            return null;
          }
          if (kind === "custom") {
            if (!opts.creationId || !creations.some((c) => c.id === opts.creationId)) return null;
          } else if (levelFromXp(progress.xp) < ASSET_MAP[kind].unlockLevel) {
            toast({ tone: "warn", title: "Still locked", body: `Reach level ${ASSET_MAP[kind].unlockLevel} to unlock the ${ASSET_MAP[kind].name}.` });
            return null;
          }
          // Spread new objects around the center so repeated taps don't stack.
          const n = world.objects.length;
          const angle = n * 2.399;
          const radius = Math.min(4, 0.8 + Math.sqrt(n) * 0.9);
          const position = opts.position ? prepPosition(opts.position) : prepPosition([Math.cos(angle) * radius, 0, Math.sin(angle) * radius], { avoidWater: true });
          const obj: WorldObject = {
            id: uid("o"),
            kind,
            ...(kind === "custom" ? { creationId: opts.creationId } : {}),
            position,
            rotation: [0, 0, 0],
            scale: 1,
            color: opts.color ?? (kind === "custom" ? "#ffffff" : ASSET_MAP[kind].defaultColor),
          };
          commit({ objects: [...world.objects, obj] }, {
            selectedId: obj.id,
            progress: { ...progress, placedTotal: progress.placedTotal + 1 },
          });
          return obj.id;
        },

        updateObject: (id, patch) => {
          const { world } = get();
          const idx = world.objects.findIndex((o) => o.id === id);
          if (idx < 0) return;
          const cur = world.objects[idx];
          const next: WorldObject = {
            ...cur,
            ...(patch.position ? { position: prepPosition(patch.position) } : {}),
            ...(patch.rotation ? { rotation: patch.rotation.map(wrapAngle) as Vec3 } : {}),
            ...(patch.scale !== undefined ? { scale: clampScale(patch.scale) } : {}),
            ...(patch.color ? { color: patch.color } : {}),
          };
          if (JSON.stringify(next) === JSON.stringify(cur)) return;
          const objects = world.objects.slice();
          objects[idx] = next;
          commit({ objects });
        },

        duplicateObject: (id) => {
          const { world, progress } = get();
          const src = world.objects.find((o) => o.id === id);
          if (!src) return null;
          if (world.objects.length >= MAX_OBJECTS) {
            toast({ tone: "warn", title: "Your island is full", body: `Islands hold up to ${MAX_OBJECTS} objects.` });
            return null;
          }
          const copy: WorldObject = {
            ...src,
            id: uid("o"),
            position: prepPosition([src.position[0] + 0.9, src.position[1], src.position[2] + 0.9]),
          };
          commit({ objects: [...world.objects, copy] }, { selectedId: copy.id, progress: { ...progress, placedTotal: progress.placedTotal + 1 } });
          return copy.id;
        },

        removeObject: (id) => {
          const { world, selectedId } = get();
          if (!world.objects.some((o) => o.id === id)) return;
          commit({ objects: world.objects.filter((o) => o.id !== id) }, { selectedId: selectedId === id ? null : selectedId });
        },

        clearWorld: () => {
          if (get().world.objects.length === 0) return;
          commit({ objects: [] }, { selectedId: null });
        },

        paintTile: (x, z, tool) => {
          const { world, progress } = get();
          const edit = applyGroundTool(world.tiles, world.objects, x, z, tool);
          if (!edit) return false;
          if (!edit.ok) {
            toast({ tone: "warn", title: "Can't do that here", body: edit.reason });
            return false;
          }
          commit({ tiles: edit.tiles, objects: edit.objects }, { progress: { ...progress, tilesPainted: progress.tilesPainted + 1 } });
          return true;
        },

        undo: () => {
          const { past, future, world, selectedId } = get();
          if (past.length === 0) return;
          const prev = past[past.length - 1];
          set({
            world: { ...world, objects: prev.objects, tiles: prev.tiles, updatedAt: Date.now() },
            past: past.slice(0, -1),
            future: [{ objects: world.objects, tiles: world.tiles }, ...future].slice(0, HISTORY_LIMIT),
            selectedId: prev.objects.some((o) => o.id === selectedId) ? selectedId : null,
          });
        },

        redo: () => {
          const { past, future, world, selectedId } = get();
          if (future.length === 0) return;
          const next = future[0];
          set({
            world: { ...world, objects: next.objects, tiles: next.tiles, updatedAt: Date.now() },
            past: [...past, { objects: world.objects, tiles: world.tiles }].slice(-HISTORY_LIMIT),
            future: future.slice(1),
            selectedId: next.objects.some((o) => o.id === selectedId) ? selectedId : null,
          });
        },

        saveSnapshot: (name) => {
          const { world, saves, progress } = get();
          const slot: SaveSlot = {
            id: uid("s"),
            name: name?.trim() || `${world.name} · ${new Date().toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`,
            savedAt: Date.now(),
            world: structuredClone(world),
          };
          const nextSaves = [slot, ...saves];
          set({ saves: nextSaves.slice(0, MAX_SAVES), progress: { ...progress, saves: progress.saves + 1 } });
          if (nextSaves.length > MAX_SAVES) {
            toast({ tone: "info", title: "Oldest snapshot replaced", body: `You can keep ${MAX_SAVES} snapshots at a time.` });
          }
          return slot;
        },

        restoreSnapshot: (id) => {
          const slot = get().saves.find((s) => s.id === id);
          if (!slot) return;
          const restored = structuredClone(slot.world);
          // Restoring is undoable: the current island goes onto the history stack.
          commit({ objects: restored.objects, tiles: restored.tiles }, { selectedId: null });
          set({ world: { ...get().world, name: restored.name, theme: restored.theme } });
        },

        deleteSnapshot: (id) => set({ saves: get().saves.filter((s) => s.id !== id) }),

        loadWorld: (world, extraCreations = []) => {
          const { creations } = get();
          const known = new Set(creations.map((c) => c.id));
          const merged = [...extraCreations.filter((c) => !known.has(c.id)), ...creations].slice(0, MAX_CREATIONS);
          set({ creations: merged });
          const copy = structuredClone(world);
          commit({ objects: copy.objects, tiles: copy.tiles }, { selectedId: null });
          set({ world: { ...get().world, name: world.name, theme: world.theme } });
        },

        addCreation: (prompt, spec, source) => {
          const { creations, progress } = get();
          const creation: Creation = { id: uid("c"), prompt: prompt.trim(), spec, source, createdAt: Date.now() };
          set({
            creations: [creation, ...creations].slice(0, MAX_CREATIONS),
            progress: { ...progress, aiCreations: progress.aiCreations + 1 },
          });
          return creation;
        },

        deleteCreation: (id) => {
          const { world, creations } = get();
          if (world.objects.some((o) => o.creationId === id)) {
            commit({ objects: world.objects.filter((o) => o.creationId !== id) }, { selectedId: null });
          }
          set({ creations: creations.filter((c) => c.id !== id) });
        },

        recordAiUse: () => {
          const today = dayKey();
          const { aiUsage } = get();
          set({ aiUsage: { day: today, count: aiUsage.day === today ? aiUsage.count + 1 : 1 } });
        },

        claimQuest: (id) => {
          const state = get();
          const quest = questById(id);
          if (!quest) return false;
          const status = questStatus(quest, questContext(state));
          if (!status.complete || status.claimed) return false;
          const before = levelFromXp(state.progress.xp);
          const xp = state.progress.xp + quest.xp;
          const after = levelFromXp(xp);
          set({
            progress: { ...state.progress, xp, claimed: [...state.progress.claimed, id] },
            levelUp: after > before ? after : state.levelUp,
          });
          toast({ tone: "xp", title: `+${quest.xp} XP`, body: `Quest complete: ${quest.title}` });
          return true;
        },

        markExplored: (worldId) => {
          const { progress } = get();
          if (progress.explored.includes(worldId)) return;
          set({ progress: { ...progress, explored: [...progress.explored, worldId] } });
        },

        toggleReaction: (worldId, reaction) => {
          const { progress } = get();
          const cur = progress.reactions[worldId] ?? [];
          const next = cur.includes(reaction) ? cur.filter((r) => r !== reaction) : [...cur, reaction];
          set({ progress: { ...progress, reactions: { ...progress.reactions, [worldId]: next } } });
        },

        reportWorld: (worldId, reason) => {
          const { progress } = get();
          set({ progress: { ...progress, reports: [...progress.reports, { worldId, reason, at: Date.now() }].slice(-50) } });
        },

        pushToast: toast,
        dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
        dismissLevelUp: () => set({ levelUp: null }),

        resetEverything: () => {
          set({
            profile: null,
            settings: DEFAULT_SETTINGS,
            world: emptyWorld(),
            saves: [],
            creations: [],
            progress: emptyProgress(),
            aiUsage: { day: "", count: 0 },
            past: [],
            future: [],
            selectedId: null,
            toasts: [],
            levelUp: null,
          });
          useNexora.persist.clearStorage();
        },
      };
    },
    {
      name: "nexora-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s): PersistedState => ({
        profile: s.profile,
        settings: s.settings,
        world: s.world,
        saves: s.saves,
        creations: s.creations,
        progress: s.progress,
        aiUsage: s.aiUsage,
      }),
      // Never trust what's in storage: it may be old, edited, or corrupted.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PersistedState>;
        const world = sanitizeWorld(p.world) ?? current.world;
        return {
          ...current,
          profile: p.profile && typeof p.profile.name === "string" ? p.profile : null,
          settings: { ...DEFAULT_SETTINGS, ...(p.settings ?? {}) },
          world,
          saves: (Array.isArray(p.saves) ? p.saves : [])
            .map((s) => {
              const w = sanitizeWorld(s?.world);
              return w && typeof s.id === "string" ? { id: s.id, name: String(s.name).slice(0, 60), savedAt: Number(s.savedAt) || Date.now(), world: w } : null;
            })
            .filter((s): s is SaveSlot => s !== null)
            .slice(0, MAX_SAVES),
          creations: (Array.isArray(p.creations) ? p.creations : [])
            .map(sanitizeCreation)
            .filter((c): c is Creation => c !== null)
            .slice(0, MAX_CREATIONS),
          progress: { ...emptyProgress(), ...(p.progress ?? {}) },
          aiUsage: p.aiUsage && typeof p.aiUsage.day === "string" ? p.aiUsage : { day: "", count: 0 },
        };
      },
      onRehydrateStorage: () => () => {
        useNexora.setState({ hydrated: true });
      },
    },
  ),
);
