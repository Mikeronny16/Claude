"use client";

import { ArrowRight, Box, Hammer, Pencil, ScrollText, Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { QuestIcon } from "@/components/ui/QuestIcon";
import { WorldView } from "@/components/three/SceneLoader";
import { THEMES } from "@/lib/catalog";
import { useLevel, useReducedMotion } from "@/lib/hooks";
import { AVATAR_MAP } from "@/lib/names";
import { claimableCount, dailyQuest, questStatus } from "@/lib/quests";
import { validateName } from "@/lib/safety";
import { questContext, useNexora } from "@/lib/store";
import type { IslandTheme } from "@/lib/types";

function RenameDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const current = useNexora((s) => s.world.name);
  const rename = useNexora((s) => s.renameWorld);
  const [value, setValue] = useState(current);
  const check = validateName(value, { max: 28 });
  const submit = () => {
    if (!check.ok) return;
    rename(value);
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Rename your island"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={submit} aria-disabled={!check.ok}>
            Save name
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
        <label htmlFor="island-name" className="text-sm font-semibold">
          Island name
        </label>
        <input
          id="island-name"
          className="input mt-2"
          value={value}
          maxLength={28}
          autoComplete="off"
          aria-invalid={!check.ok}
          aria-describedby="island-name-help"
          onChange={(e) => setValue(e.target.value)}
        />
        <p id="island-name-help" className={`mt-2 ${check.ok ? "text-xs text-faint" : "field-error"}`} aria-live="polite">
          {check.ok ? "Up to 28 characters. Keep it fun, not personal." : check.message}
        </p>
      </form>
    </Dialog>
  );
}

export default function MyWorld() {
  const world = useNexora((s) => s.world);
  const creations = useNexora((s) => s.creations);
  const progress = useNexora((s) => s.progress);
  const profile = useNexora((s) => s.profile);
  const quality = useNexora((s) => s.settings.quality);
  const setTheme = useNexora((s) => s.setTheme);
  const reduced = useReducedMotion();
  const lvl = useLevel();
  const [renaming, setRenaming] = useState(false);
  const avatar = profile ? AVATAR_MAP[profile.avatar] : null;

  const ctx = useMemo(() => questContext({ world, progress, creations }), [world, progress, creations]);
  const daily = useMemo(() => questStatus(dailyQuest(), ctx), [ctx]);
  const ready = useMemo(() => claimableCount(ctx), [ctx]);

  const stats = [
    { label: "Objects", value: world.objects.length },
    { label: "AI creations", value: creations.length },
    { label: "Quests done", value: progress.claimed.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-dim">Welcome back, {profile?.name}</p>
          <div className="flex items-center gap-2">
            <h1 className="font-display truncate text-2xl sm:text-3xl">{world.name}</h1>
            <button type="button" className="icon-btn size-9!" onClick={() => setRenaming(true)} aria-label="Rename island">
              <Pencil size={15} aria-hidden />
            </button>
          </div>
        </div>
        <Link href="/builder" className="btn btn-gold hidden sm:inline-flex">
          <Hammer size={18} aria-hidden /> Open World Builder
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="panel relative h-[52vh] min-h-[300px] overflow-hidden lg:h-[560px]" aria-label="Your island">
          <WorldView
            label={`Your island ${world.name}, with ${world.objects.length} objects, slowly turning. Drag to look around.`}
            world={world}
            creations={creations}
            mode="view"
            autoRotate
            reducedMotion={reduced}
            quality={quality}
            explorer={avatar ? { from: avatar.from, to: avatar.to } : null}
          />
          {world.objects.length === 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4">
              <div className="panel panel-strong pointer-events-auto flex max-w-sm items-center gap-3 p-3">
                <Sparkles size={20} className="shrink-0 text-amber-200" aria-hidden />
                <p className="text-sm">Your island is empty. Let&apos;s place your first object!</p>
                <Link href="/builder" className="btn btn-gold btn-sm shrink-0">
                  Build
                </Link>
              </div>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <span className="chip chip-cyan">{THEMES[world.theme].name} island</span>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <section className="panel p-4" aria-labelledby="level-h">
            <div className="flex items-center gap-3">
              <span className="font-display grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-lg text-white shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                {lvl.level}
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="level-h" className="font-bold">
                  Level {lvl.level} · {lvl.title}
                </h2>
                <div className="bar mt-1.5" role="progressbar" aria-label="XP to next level" aria-valuemin={0} aria-valuemax={lvl.needed} aria-valuenow={lvl.current}>
                  <span style={{ width: `${Math.round(lvl.ratio * 100)}%` }} />
                </div>
                <p className="mt-1 text-xs text-faint">
                  {lvl.current} / {lvl.needed} XP to level {lvl.level + 1}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-violet-400/10 p-2">
                  <dt className="text-[0.7rem] text-faint">{s.label}</dt>
                  <dd className="font-display text-lg">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={`panel p-4 ${daily.complete && !daily.claimed ? "border-amber-300/60 shadow-[0_0_30px_rgba(251,191,36,0.2)]" : ""}`} aria-labelledby="daily-h">
            <p className="chip chip-gold">Today&apos;s challenge</p>
            <div className="mt-3 flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-300/15 text-amber-200">
                <QuestIcon name={daily.quest.icon} />
              </span>
              <div className="min-w-0">
                <h2 id="daily-h" className="font-bold">
                  {daily.quest.title}
                </h2>
                <p className="text-sm text-dim">{daily.quest.description}</p>
              </div>
            </div>
            <div className="bar mt-3" role="progressbar" aria-label="Challenge progress" aria-valuemin={0} aria-valuemax={daily.quest.target} aria-valuenow={daily.current}>
              <span style={{ width: `${(daily.current / daily.quest.target) * 100}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-faint">
                {daily.current}/{daily.quest.target} · +{daily.quest.xp} XP
              </span>
              <Link href={daily.complete ? "/quests" : "/builder"} className="font-bold text-cyan-200 hover:underline">
                {daily.claimed ? "Done for today ✓" : daily.complete ? "Claim reward" : "Start"} <ArrowRight size={14} className="inline" aria-hidden />
              </Link>
            </div>
          </section>

          <nav aria-label="Quick actions" className="grid grid-cols-3 gap-2">
            <Link href="/builder" className="choice flex flex-col items-center gap-1.5 p-3 text-center text-xs font-bold">
              <Hammer size={20} className="text-cyan-300" aria-hidden /> Build
            </Link>
            <Link href="/create" className="choice flex flex-col items-center gap-1.5 p-3 text-center text-xs font-bold">
              <WandSparkles size={20} className="text-violet-300" aria-hidden /> Create
            </Link>
            <Link href="/quests" className="choice relative flex flex-col items-center gap-1.5 p-3 text-center text-xs font-bold">
              <ScrollText size={20} className="text-amber-200" aria-hidden /> Quests
              {ready > 0 && <span className="absolute right-2 top-2 rounded-full bg-amber-300 px-1.5 text-[0.65rem] text-amber-950">{ready}</span>}
            </Link>
          </nav>
        </div>
      </div>

      <section className="panel mt-4 p-4" aria-labelledby="theme-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="theme-h" className="font-bold">
            Island mood
          </h2>
          <p className="text-xs text-faint">Changes the sky, grass and glow.</p>
        </div>
        <div role="radiogroup" aria-labelledby="theme-h" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.values(THEMES).map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={world.theme === t.id}
              onClick={() => setTheme(t.id as IslandTheme)}
              className="choice flex items-center gap-3 p-2.5 text-left"
            >
              <span className="size-9 shrink-0 rounded-lg" style={{ background: `linear-gradient(160deg, ${t.sky}, ${t.grass})` }} aria-hidden />
              <span>
                <span className="block text-sm font-bold">{t.name}</span>
                <span className="block text-[0.7rem] text-faint">{t.blurb}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {creations.length > 0 && (
        <section className="mt-4" aria-labelledby="recent-h">
          <div className="flex items-center justify-between">
            <h2 id="recent-h" className="font-bold">
              Recent creations
            </h2>
            <Link href="/create" className="text-sm font-semibold text-cyan-200 hover:underline">
              Studio <ArrowRight size={14} className="inline" aria-hidden />
            </Link>
          </div>
          <ul className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
            {creations.slice(0, 8).map((c) => (
              <li key={c.id} className="panel flex w-44 shrink-0 items-center gap-2 p-2.5">
                <Box size={18} className="shrink-0 text-violet-300" aria-hidden />
                <span className="truncate text-sm font-semibold">{c.spec.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {renaming && <RenameDialog open onClose={() => setRenaming(false)} />}
    </div>
  );
}
