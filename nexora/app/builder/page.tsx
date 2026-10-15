"use client";

import { Crosshair, Grid3x3, Move3d, Redo2, Rotate3d, Save, Scale3d, Undo2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AddPanel, GroundPanel, Inspector, ObjectList, SaveDialog, SavesPanel, objectLabel, type PlacementIntent } from "@/components/builder/panels";
import { WorldView } from "@/components/three/SceneLoader";
import type { TransformMode } from "@/components/three/WorldScene";
import { useReducedMotion } from "@/lib/hooks";
import { useNexora } from "@/lib/store";
import { GROUND_TOOLS } from "@/lib/catalog";
import { AVATAR_MAP } from "@/lib/names";
import type { GroundTool, Vec3 } from "@/lib/types";

type Tab = "add" | "ground" | "edit" | "objects" | "saves";
const TABS: { id: Tab; label: string }[] = [
  { id: "add", label: "Add" },
  { id: "ground", label: "Ground" },
  { id: "edit", label: "Edit" },
  { id: "objects", label: "Objects" },
  { id: "saves", label: "Saves" },
];
const MODES: { id: TransformMode; label: string; key: string; icon: typeof Move3d }[] = [
  { id: "translate", label: "Move", key: "W", icon: Move3d },
  { id: "rotate", label: "Rotate", key: "E", icon: Rotate3d },
  { id: "scale", label: "Scale", key: "R", icon: Scale3d },
];

const isTyping = (el: Element | null) =>
  !!el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement || (el as HTMLElement).isContentEditable);

export default function BuilderPage() {
  const world = useNexora((s) => s.world);
  const creations = useNexora((s) => s.creations);
  const selectedId = useNexora((s) => s.selectedId);
  const canUndo = useNexora((s) => s.past.length > 0);
  const canRedo = useNexora((s) => s.future.length > 0);
  const settings = useNexora((s) => s.settings);
  const profile = useNexora((s) => s.profile);
  const { select, undo, redo, addObject, updateObject, removeObject, duplicateObject, updateSettings, paintTile } = useNexora.getState();
  const reduced = useReducedMotion();

  const [tab, setTab] = useState<Tab>("add");
  const [mode, setMode] = useState<TransformMode>("translate");
  const [placing, setPlacing] = useState<PlacementIntent | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [groundTool, setGroundTool] = useState<GroundTool>("grass");
  const grounding = tab === "ground";
  const avatar = profile ? AVATAR_MAP[profile.avatar] : null;

  const openTab = (t: Tab) => {
    setTab(t);
    if (t === "ground") {
      setPlacing(null);
      select(null);
    }
  };

  const selected = world.objects.find((o) => o.id === selectedId) ?? null;

  const place = useCallback(
    (position?: Vec3) => {
      if (!placing) return;
      addObject(placing.kind, { position, creationId: placing.creationId });
      setPlacing(null);
    },
    [placing, addObject],
  );

  const selectFromScene = useCallback(
    (id: string | null) => {
      select(id);
      if (id) setTab("edit");
    },
    [select],
  );

  // Keyboard shortcuts (ignored while typing or when a dialog is open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(document.activeElement) || document.querySelector("dialog[open]")) return;
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      const state = useNexora.getState();
      const sel = state.world.objects.find((o) => o.id === state.selectedId);
      if (mod && k === "z") {
        e.preventDefault();
        if (e.shiftKey) state.redo();
        else state.undo();
      } else if (mod && k === "y") {
        e.preventDefault();
        state.redo();
      } else if (mod && k === "d" && sel) {
        e.preventDefault();
        state.duplicateObject(sel.id);
      } else if (!mod && (k === "delete" || k === "backspace") && sel) {
        e.preventDefault();
        state.removeObject(sel.id);
      } else if (k === "escape") {
        setPlacing(null);
        state.select(null);
      } else if (!mod && k === "w") setMode("translate");
      else if (!mod && k === "e") setMode("rotate");
      else if (!mod && k === "r") setMode("scale");
      else if (sel && k.startsWith("arrow") && !(document.activeElement && document.activeElement.closest("[role=radiogroup],[role=tablist]"))) {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 0.25;
        const [x, y, z] = sel.position;
        const d: Record<string, Vec3> = { arrowleft: [-step, 0, 0], arrowright: [step, 0, 0], arrowup: [0, 0, -step], arrowdown: [0, 0, step] };
        const delta = d[k];
        if (delta) state.updateObject(sel.id, { position: [x + delta[0], y + delta[1], z + delta[2]] });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-[calc(100dvh-var(--top-h)-var(--nav-h)-env(safe-area-inset-bottom))] flex-col lg:h-dvh lg:flex-row">
      <h1 className="sr-only">World Builder: {world.name}</h1>

      {/* Canvas area */}
      <section className="relative min-h-0 flex-1" aria-label="3D island editor">
        <WorldView
          label={`3D editor for ${world.name}. ${world.objects.length} objects. Use the panel controls or keyboard shortcuts to edit.`}
          world={world}
          creations={creations}
          mode="edit"
          selectedId={selectedId}
          onSelect={selectFromScene}
          transformMode={mode}
          onTransformCommit={updateObject}
          placing={!!placing}
          onPlace={place}
          reducedMotion={reduced}
          quality={settings.quality}
          snap={settings.snapToGrid}
          groundTool={grounding ? groundTool : null}
          onGroundTool={(x, z) => paintTile(x, z, groundTool)}
          explorer={avatar ? { from: avatar.from, to: avatar.to } : null}
          fallbackDetail="use the Add, Edit and Objects tabs to build."
        />

        {/* Toolbar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-2 sm:p-3">
          <div className="panel panel-strong pointer-events-auto flex items-center gap-1 p-1" role="toolbar" aria-label="History">
            <button type="button" className="icon-btn" onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo (Ctrl+Z)">
              <Undo2 size={18} aria-hidden />
            </button>
            <button type="button" className="icon-btn" onClick={redo} disabled={!canRedo} aria-label="Redo" title="Redo (Ctrl+Shift+Z)">
              <Redo2 size={18} aria-hidden />
            </button>
            <button type="button" className="icon-btn" onClick={() => setSaveOpen(true)} aria-label="Save snapshot" title="Save snapshot">
              <Save size={18} aria-hidden />
            </button>
          </div>
          <div className="panel panel-strong pointer-events-auto flex items-center gap-1 p-1" role="toolbar" aria-label="Transform tools">
            {MODES.map(({ id, label, key, icon: Icon }) => (
              <button key={id} type="button" className="icon-btn" aria-pressed={mode === id} onClick={() => setMode(id)} aria-label={`${label} tool`} title={`${label} (${key})`}>
                <Icon size={18} aria-hidden />
              </button>
            ))}
            <span className="mx-0.5 h-6 w-px bg-violet-300/20" aria-hidden />
            <button
              type="button"
              className="icon-btn"
              aria-pressed={settings.snapToGrid}
              onClick={() => updateSettings({ snapToGrid: !settings.snapToGrid })}
              aria-label="Snap to grid"
              title="Snap to grid"
            >
              <Grid3x3 size={18} aria-hidden />
            </button>
          </div>
        </div>

        {/* Placement banner */}
        <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3">
          {grounding && (
            <div className="panel panel-strong animate-rise pointer-events-auto flex max-w-full items-center gap-2 border-cyan-300/50 p-2 px-3">
              <span className="size-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" aria-hidden />
              <p className="min-w-0 truncate text-sm font-semibold">{GROUND_TOOLS.find((t) => t.id === groundTool)?.hint} — tap tiles on your island</p>
            </div>
          )}
          {placing && (
            <div className="panel panel-strong animate-rise pointer-events-auto flex max-w-full items-center gap-2 border-amber-300/50 p-2 pl-3 shadow-[0_0_30px_rgba(251,191,36,0.25)]">
              <Crosshair size={18} className="shrink-0 text-amber-200" aria-hidden />
              <p className="min-w-0 truncate text-sm font-semibold">Tap your island to place the {placing.name}</p>
              <button type="button" className="btn btn-gold btn-sm shrink-0" onClick={() => place()} aria-label={`Auto-place the ${placing.name}`}>
                Auto-place
              </button>
              <button type="button" className="icon-btn size-9! shrink-0" onClick={() => setPlacing(null)} aria-label="Cancel placing">
                <X size={16} aria-hidden />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Side / bottom panel */}
      <aside className="panel panel-strong flex h-[44%] min-h-[15rem] flex-col rounded-b-none border-x-0 border-b-0 lg:h-auto lg:w-[24rem] lg:rounded-none lg:border-y-0 lg:border-r-0" aria-label="Builder panel">
        {selected && (
          <div className="flex items-center gap-2 border-b border-violet-300/15 px-3 py-2 text-sm">
            <span className="size-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" aria-hidden />
            <span className="min-w-0 flex-1 truncate">
              <span className="text-faint">Selected: </span>
              <span className="font-semibold">{objectLabel(selected, creations)}</span>
            </span>
            {tab !== "edit" && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => openTab("edit")}>
                Edit
              </button>
            )}
            <button type="button" className="icon-btn size-9!" onClick={() => duplicateObject(selected.id)} aria-label="Duplicate selected" title="Duplicate">
              <span aria-hidden className="text-xs font-bold">×2</span>
            </button>
            <button type="button" className="icon-btn size-9!" onClick={() => removeObject(selected.id)} aria-label="Delete selected" title="Delete">
              <X size={16} aria-hidden />
            </button>
          </div>
        )}
        <div role="tablist" aria-label="Builder sections" className="grid grid-cols-5 gap-1 p-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => openTab(t.id)}
              className={`min-h-10 rounded-xl text-[0.82rem] font-bold transition ${tab === t.id ? "bg-violet-400/25 text-white shadow-[inset_0_0_0_1px_rgba(167,139,250,0.45)]" : "text-faint hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {tab === "add" && <AddPanel placing={placing} onArm={setPlacing} />}
          {tab === "ground" && <GroundPanel tool={groundTool} onTool={setGroundTool} />}
          {tab === "edit" && <Inspector selected={selected} onGoAdd={() => setTab("add")} />}
          {tab === "objects" && (
            <ObjectList
              selectedId={selectedId}
              onSelect={(id) => {
                select(id);
                setTab("edit");
              }}
            />
          )}
          {tab === "saves" && <SavesPanel onSaveRequest={() => setSaveOpen(true)} />}
        </div>
      </aside>

      <SaveDialog open={saveOpen} onClose={() => setSaveOpen(false)} />
    </div>
  );
}
