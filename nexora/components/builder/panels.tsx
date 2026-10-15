"use client";

import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ChevronUp, Copy, Download, FolderOpen, Lock, Minus, Plus,
  RotateCcw, RotateCw, Save, Trash2, WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ConfirmDialog, Dialog } from "@/components/ui/Dialog";
import { ASSETS, ASSET_MAP, CATEGORIES, GROUNDS, GROUND_TOOLS, MAX_OBJECTS, MAX_SAVES, SWATCHES, THEMES } from "@/lib/catalog";
import { useLevel } from "@/lib/hooks";
import { validateName } from "@/lib/safety";
import { useNexora } from "@/lib/store";
import { cellOf, tileKey, tileMap, tileTop } from "@/lib/terrain";
import type { AssetCategory, AssetKind, Creation, GroundTool, Vec3, WorldObject } from "@/lib/types";
import { exportWorldFile, parseWorldFile, type ParsedWorldFile } from "@/lib/world";
import { AssetGlyph } from "./AssetTile";

export interface PlacementIntent {
  kind: AssetKind | "custom";
  creationId?: string;
  name: string;
}

export function objectLabel(obj: WorldObject, creations: Creation[]): string {
  if (obj.kind === "custom") return creations.find((c) => c.id === obj.creationId)?.spec.name ?? "Missing creation";
  return ASSET_MAP[obj.kind].name;
}

export function timeAgo(ts: number): string {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(ts).toLocaleDateString();
}

/* ------------------------------------------------------------------ Add */

export function AddPanel({ placing, onArm }: { placing: PlacementIntent | null; onArm: (p: PlacementIntent | null) => void }) {
  const [cat, setCat] = useState<AssetCategory | "mine">("nature");
  const { level } = useLevel();
  const creations = useNexora((s) => s.creations);
  const count = useNexora((s) => s.world.objects.length);

  return (
    <div>
      <div role="tablist" aria-label="Object categories" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:flex-wrap">
        {[...CATEGORIES, { id: "mine" as const, label: `My creations (${creations.length})` }].map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={cat === c.id}
            onClick={() => setCat(c.id)}
            className={`btn btn-sm shrink-0 ${cat === c.id ? "btn-primary" : "btn-ghost"}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-faint">
        {placing ? `Tap your island to place the ${placing.name}.` : "Pick something, then tap your island to place it."} {count}/{MAX_OBJECTS} objects.
      </p>

      {cat !== "mine" ? (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
          {ASSETS.filter((a) => a.category === cat).map((a) => {
            const locked = level < a.unlockLevel;
            const armed = placing?.kind === a.kind;
            return (
              <li key={a.kind}>
                <button
                  type="button"
                  aria-pressed={armed}
                  aria-disabled={locked}
                  aria-label={locked ? `${a.name}, locked until level ${a.unlockLevel}` : `${a.name}: ${a.description}`}
                  onClick={() => (locked ? undefined : onArm(armed ? null : { kind: a.kind, name: a.name }))}
                  className={`choice flex h-full w-full flex-col items-center gap-1.5 p-2.5 text-center ${locked ? "cursor-not-allowed opacity-55" : ""}`}
                >
                  <span className="relative">
                    <AssetGlyph kind={a.kind} color={a.defaultColor} />
                    {locked && (
                      <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink-700 text-amber-200 ring-1 ring-amber-300/50">
                        <Lock size={11} aria-hidden />
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-semibold leading-tight">{a.name}</span>
                  {locked && <span className="text-[0.65rem] font-bold text-amber-200">Lv {a.unlockLevel}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      ) : creations.length === 0 ? (
        <div className="panel mt-3 p-4 text-center">
          <p className="text-sm text-dim">You haven&apos;t made anything with AI yet.</p>
          <Link href="/create" className="btn btn-primary btn-sm mt-3">
            <WandSparkles size={16} aria-hidden /> Open AI Creation Studio
          </Link>
        </div>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
          {creations.map((c) => {
            const armed = placing?.creationId === c.id;
            const color = c.spec.parts.find((p) => p.glow)?.color ?? c.spec.parts[0].color;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={armed}
                  onClick={() => onArm(armed ? null : { kind: "custom", creationId: c.id, name: c.spec.name })}
                  className="choice flex w-full items-center gap-2 p-2 text-left"
                >
                  <AssetGlyph kind="custom" color={color} size={36} />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">{c.spec.name}</span>
                    <span className="block text-[0.65rem] text-faint">{c.source === "live" ? "AI" : "Demo"} creation</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Edit */

const STEP = 0.5;
const TURN = Math.PI / 12;

function NudgeButton({ label, onClick, children, disabled }: { label: string; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="button" className="icon-btn" onClick={onClick} aria-label={label} title={label} disabled={disabled}>
      {children}
    </button>
  );
}

export function Inspector({ selected, onGoAdd }: { selected: WorldObject | null; onGoAdd: () => void }) {
  const update = useNexora((s) => s.updateObject);
  const duplicate = useNexora((s) => s.duplicateObject);
  const remove = useNexora((s) => s.removeObject);
  const creations = useNexora((s) => s.creations);
  const tiles = useNexora((s) => s.world.tiles);

  if (!selected) {
    return (
      <div className="panel p-4 text-sm text-dim">
        <p className="font-semibold text-white">Nothing selected</p>
        <p className="mt-1">Tap an object on your island (or pick one from the Objects tab) to move, turn, resize or recolor it.</p>
        <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={onGoAdd}>
          <Plus size={16} aria-hidden /> Add something
        </button>
      </div>
    );
  }

  const [x, y, z] = selected.position;
  const under = tileMap(tiles).get(tileKey(cellOf(x), cellOf(z)));
  const groundY = under ? tileTop(under) : 0;
  const move = (d: Vec3) => update(selected.id, { position: [x + d[0], y + d[1], z + d[2]] });
  const turn = (d: number) => update(selected.id, { rotation: [selected.rotation[0], selected.rotation[1] + d, selected.rotation[2]] });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AssetGlyph kind={selected.kind} color={selected.color} size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{objectLabel(selected, creations)}</p>
          <p className="text-xs text-faint">
            X {x.toFixed(1)} · Y {y.toFixed(1)} · Z {z.toFixed(1)} · {Math.round(selected.scale * 100)}%
          </p>
        </div>
      </div>

      {selected.kind !== "custom" && (
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-wider text-faint">Color</legend>
          <div role="radiogroup" aria-label="Object color" className="mt-2 grid grid-cols-8 gap-1.5">
            {SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={selected.color === c}
                aria-label={`Color ${c}`}
                onClick={() => update(selected.id, { color: c })}
                className={`aspect-square w-full min-w-7 rounded-lg ring-offset-2 ring-offset-[#120f3a] transition ${selected.color === c ? "ring-2 ring-cyan-300" : "ring-1 ring-white/10"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid grid-cols-2 gap-3">
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-wider text-faint">Move</legend>
          <div className="mt-2 grid w-fit grid-cols-3 gap-1">
            <span />
            <NudgeButton label="Move back (Z minus)" onClick={() => move([0, 0, -STEP])}>
              <ArrowUp size={18} aria-hidden />
            </NudgeButton>
            <span />
            <NudgeButton label="Move left (X minus)" onClick={() => move([-STEP, 0, 0])}>
              <ArrowLeft size={18} aria-hidden />
            </NudgeButton>
            <span className="grid place-items-center text-[0.65rem] font-bold text-faint" aria-hidden>
              XZ
            </span>
            <NudgeButton label="Move right (X plus)" onClick={() => move([STEP, 0, 0])}>
              <ArrowRight size={18} aria-hidden />
            </NudgeButton>
            <span />
            <NudgeButton label="Move forward (Z plus)" onClick={() => move([0, 0, STEP])}>
              <ArrowDown size={18} aria-hidden />
            </NudgeButton>
            <span />
          </div>
        </fieldset>
        <div className="space-y-3">
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-wider text-faint">Height</legend>
            <div className="mt-2 flex gap-1">
              <NudgeButton label="Lower" onClick={() => move([0, -STEP, 0])} disabled={y <= groundY + 0.01}>
                <ChevronDown size={18} aria-hidden />
              </NudgeButton>
              <NudgeButton label="Raise" onClick={() => move([0, STEP, 0])}>
                <ChevronUp size={18} aria-hidden />
              </NudgeButton>
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-wider text-faint">Turn</legend>
            <div className="mt-2 flex gap-1">
              <NudgeButton label="Turn left 15 degrees" onClick={() => turn(TURN)}>
                <RotateCcw size={18} aria-hidden />
              </NudgeButton>
              <NudgeButton label="Turn right 15 degrees" onClick={() => turn(-TURN)}>
                <RotateCw size={18} aria-hidden />
              </NudgeButton>
              <NudgeButton label="Reset rotation" onClick={() => update(selected.id, { rotation: [0, 0, 0] })}>
                <span className="text-xs font-bold" aria-hidden>
                  0°
                </span>
              </NudgeButton>
            </div>
          </fieldset>
        </div>
      </div>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-wider text-faint">Size</legend>
        <div className="mt-2 flex items-center gap-2">
          <NudgeButton label="Make smaller" onClick={() => update(selected.id, { scale: selected.scale / 1.15 })} disabled={selected.scale <= 0.3}>
            <Minus size={18} aria-hidden />
          </NudgeButton>
          <div className="bar flex-1" role="meter" aria-label="Size" aria-valuemin={30} aria-valuemax={300} aria-valuenow={Math.round(selected.scale * 100)} aria-valuetext={`${Math.round(selected.scale * 100)} percent`}>
            <span style={{ width: `${((selected.scale - 0.3) / 2.7) * 100}%` }} />
          </div>
          <NudgeButton label="Make bigger" onClick={() => update(selected.id, { scale: selected.scale * 1.15 })} disabled={selected.scale >= 3}>
            <Plus size={18} aria-hidden />
          </NudgeButton>
        </div>
      </fieldset>

      <div className="flex gap-2">
        <button type="button" className="btn btn-ghost btn-sm flex-1" onClick={() => duplicate(selected.id)}>
          <Copy size={16} aria-hidden /> Duplicate
        </button>
        <button type="button" className="btn btn-ghost btn-sm flex-1 text-rose-200" onClick={() => remove(selected.id)}>
          <Trash2 size={16} aria-hidden /> Delete
        </button>
      </div>
      <p className="hidden text-xs text-faint lg:block">
        Shortcuts: W move · E rotate · R scale · arrows nudge · Del delete · Ctrl+D duplicate · Ctrl+Z undo · Ctrl+Shift+Z redo · Esc deselect
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ Objects */

export function ObjectList({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  const objects = useNexora((s) => s.world.objects);
  const creations = useNexora((s) => s.creations);
  const clear = useNexora((s) => s.clearWorld);
  const [confirm, setConfirm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-dim">
          {objects.length} of {MAX_OBJECTS} objects
        </p>
        <button type="button" className="btn btn-ghost btn-sm text-rose-200" onClick={() => setConfirm(true)} disabled={objects.length === 0}>
          <Trash2 size={15} aria-hidden /> Clear island
        </button>
      </div>
      {objects.length === 0 ? (
        <p className="panel mt-3 p-4 text-sm text-dim">Your island is empty — add something from the Add tab.</p>
      ) : (
        <ul className="mt-3 space-y-1.5" aria-label="Objects on your island">
          {objects.map((o, i) => (
            <li key={o.id}>
              <button
                type="button"
                aria-pressed={o.id === selectedId}
                onClick={() => onSelect(o.id)}
                className="choice flex w-full items-center gap-3 p-2 text-left"
              >
                <AssetGlyph kind={o.kind} color={o.color} size={32} />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{objectLabel(o, creations)}</span>
                <span className="text-xs text-faint">#{i + 1}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={clear}
        danger
        title="Clear your whole island?"
        description="Every object will be removed. You can still bring them back with Undo."
        confirmLabel="Clear island"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ Saves */

export function SavesPanel({ onSaveRequest }: { onSaveRequest: () => void }) {
  const world = useNexora((s) => s.world);
  const saves = useNexora((s) => s.saves);
  const creations = useNexora((s) => s.creations);
  const restore = useNexora((s) => s.restoreSnapshot);
  const del = useNexora((s) => s.deleteSnapshot);
  const loadWorld = useNexora((s) => s.loadWorld);
  const pushToast = useNexora((s) => s.pushToast);
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imported, setImported] = useState<Extract<ParsedWorldFile, { ok: true }> | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([exportWorldFile(world, creations)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${world.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "island"}.nexora.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    pushToast({ tone: "success", title: "World file downloaded", body: "Keep it safe — you can load it back any time." });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const parsed = parseWorldFile(await f.text());
    if (!parsed.ok) pushToast({ tone: "warn", title: "Couldn't open that file", body: parsed.error });
    else setImported(parsed);
    if (file.current) file.current.value = "";
  };

  const slot = saves.find((s) => s.id === restoreId);

  return (
    <div className="space-y-4">
      <div className="panel flex items-center gap-3 p-3 text-sm">
        <span className="size-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" aria-hidden />
        <span className="text-dim">
          Auto-saved on this device · <span className="text-white">{timeAgo(world.updatedAt)}</span>
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Snapshots ({saves.length}/{MAX_SAVES})</h3>
          <button type="button" className="btn btn-primary btn-sm" onClick={onSaveRequest}>
            <Save size={15} aria-hidden /> Save snapshot
          </button>
        </div>
        {saves.length === 0 ? (
          <p className="mt-2 text-sm text-faint">Snapshots let you try big changes and jump back later.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {saves.map((s) => (
              <li key={s.id} className="panel flex items-center gap-2 p-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-faint">
                    {s.world.objects.length} objects · {timeAgo(s.savedAt)}
                  </p>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRestoreId(s.id)} aria-label={`Restore ${s.name}`}>
                  <FolderOpen size={15} aria-hidden /> Restore
                </button>
                <button type="button" className="icon-btn size-9!" onClick={() => setDeleteId(s.id)} aria-label={`Delete snapshot ${s.name}`}>
                  <Trash2 size={15} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="divider" />
      <div>
        <h3 className="text-sm font-bold">Backup file</h3>
        <p className="mt-1 text-xs text-faint">Download your island as a file, or load one you saved before.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost btn-sm" onClick={download}>
            <Download size={15} aria-hidden /> Download world
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => file.current?.click()}>
            <FolderOpen size={15} aria-hidden /> Load from file
          </button>
          <input ref={file} type="file" accept=".json,application/json" className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      </div>

      <ConfirmDialog
        open={!!slot}
        onClose={() => setRestoreId(null)}
        onConfirm={() => {
          if (!slot) return;
          restore(slot.id);
          pushToast({ tone: "success", title: "Snapshot restored", body: "Changed your mind? Press Undo." });
        }}
        title={`Restore “${slot?.name ?? ""}”?`}
        description="Your island will switch to this snapshot. Your current version can be brought back with Undo."
        confirmLabel="Restore"
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && del(deleteId)}
        danger
        title="Delete this snapshot?"
        description="This snapshot will be gone for good. Your current island isn't affected."
        confirmLabel="Delete"
      />
      <ConfirmDialog
        open={!!imported}
        onClose={() => setImported(null)}
        onConfirm={() => {
          if (!imported) return;
          loadWorld(imported.world, imported.creations);
          pushToast({ tone: "success", title: `Loaded “${imported.world.name}”`, body: "Press Undo to go back." });
        }}
        title={`Load “${imported?.world.name ?? ""}”?`}
        description={`This file has ${imported?.world.objects.length ?? 0} objects. It will replace what's on your island now (Undo brings it back).`}
        confirmLabel="Load world"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ Save dialog */

export function SaveDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const save = useNexora((s) => s.saveSnapshot);
  const pushToast = useNexora((s) => s.pushToast);
  const [name, setName] = useState("");
  const check = name.trim() ? validateName(name, { min: 1, max: 40 }) : ({ ok: true } as const);
  const submit = () => {
    if (!check.ok) return;
    save(name);
    pushToast({ tone: "success", title: "Snapshot saved", body: "Find it in the Saves tab." });
    setName("");
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Save a snapshot"
      description="Snapshots are saved on this device. Name it so you can find it later (optional)."
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={submit} aria-disabled={!check.ok}>
            <Save size={16} aria-hidden /> Save
          </button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor="snap-name" className="text-sm font-semibold">
          Snapshot name
        </label>
        <input
          id="snap-name"
          className="input mt-2"
          value={name}
          maxLength={40}
          placeholder="e.g. Before the big castle"
          autoComplete="off"
          aria-invalid={!check.ok}
          aria-describedby="snap-help"
          onChange={(e) => setName(e.target.value)}
        />
        <p id="snap-help" className={`mt-2 ${check.ok ? "text-xs text-faint" : "field-error"}`} aria-live="polite">
          {check.ok ? "Leave empty to use the date and time." : check.message}
        </p>
      </form>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ Ground */

/** A little block icon: colored top over an earth side, like a ground tile. */
function BlockSwatch({ top, side = "#9a6440" }: { top: string; side?: string }) {
  return (
    <span className="relative block h-9 w-10" aria-hidden>
      <span className="absolute inset-x-0 bottom-0 h-4 rounded-b-md" style={{ background: side, boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.18)" }} />
      <span className="absolute inset-x-0 top-1 h-5 rounded-md" style={{ background: top, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25)" }} />
    </span>
  );
}

const TOOL_GLYPH: Partial<Record<GroundTool, string>> = { raise: "▲", lower: "▼", add: "+", remove: "−" };

export function GroundPanel({ tool, onTool }: { tool: GroundTool; onTool: (t: GroundTool) => void }) {
  const theme = useNexora((s) => THEMES[s.world.theme]);
  const count = useNexora((s) => s.world.tiles.length);
  return (
    <div>
      <p className="text-xs text-faint">Pick a tool, then tap tiles on your island. Water on the edge pours off as a waterfall. {count} tiles.</p>
      <div role="radiogroup" aria-label="Ground tools" className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3">
        {GROUND_TOOLS.map((t) => {
          const isGround = t.id in GROUNDS;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={tool === t.id}
              aria-label={`${t.name}: ${t.hint}`}
              onClick={() => onTool(t.id)}
              className="choice flex flex-col items-center gap-1.5 p-2 text-center"
            >
              {isGround ? (
                <BlockSwatch top={t.id === "grass" ? theme.grass : GROUNDS[t.id as keyof typeof GROUNDS].color} side={t.id === "water" ? "#2b7fa8" : theme.soil} />
              ) : (
                <span className="relative grid h-9 w-10 place-items-center">
                  <BlockSwatch top={theme.grass} side={theme.soil} />
                  <span className={`absolute -right-1 -top-1 grid size-5 place-items-center rounded-full text-[0.7rem] font-black ${t.id === "remove" ? "bg-rose-300 text-rose-950" : "bg-amber-300 text-amber-950"}`}>
                    {TOOL_GLYPH[t.id]}
                  </span>
                </span>
              )}
              <span className="text-xs font-semibold leading-tight">{t.name}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-faint">Every change can be undone with Undo.</p>
    </div>
  );
}
