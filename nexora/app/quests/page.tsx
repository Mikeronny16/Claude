"use client";

import { ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { AssetGlyph } from "@/components/builder/AssetTile";
import { QuestIcon } from "@/components/ui/QuestIcon";
import { ASSETS } from "@/lib/catalog";
import { useLevel } from "@/lib/hooks";
import { allQuests, questStatus, type QuestStatus } from "@/lib/quests";
import { questContext, useNexora } from "@/lib/store";

function QuestCard({ s, daily = false }: { s: QuestStatus; daily?: boolean }) {
  const claim = useNexora((st) => st.claimQuest);
  const { quest, current, complete, claimed } = s;
  const ready = complete && !claimed;
  return (
    <li
      className={`panel flex flex-col gap-3 p-4 transition ${ready ? "border-amber-300/60 shadow-[0_0_30px_rgba(251,191,36,0.18)]" : ""} ${claimed ? "opacity-75" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${claimed ? "bg-emerald-400/15 text-emerald-200" : daily ? "bg-amber-300/15 text-amber-200" : "bg-violet-400/20 text-violet-200"}`}>
          {claimed ? <Check size={20} aria-hidden /> : <QuestIcon name={quest.icon} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold">{quest.title}</h3>
            {daily && <span className="chip chip-gold">Daily</span>}
          </div>
          <p className="mt-0.5 text-sm text-dim">{quest.description}</p>
        </div>
        <span className="chip chip-gold shrink-0">+{quest.xp} XP</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="bar flex-1" role="progressbar" aria-label={`${quest.title} progress`} aria-valuemin={0} aria-valuemax={quest.target} aria-valuenow={current}>
          <span style={{ width: `${(current / quest.target) * 100}%` }} />
        </div>
        <span className="w-12 text-right text-xs text-faint">
          {current}/{quest.target}
        </span>
      </div>
      <div className="flex justify-end">
        {claimed ? (
          <span className="text-sm font-semibold text-emerald-200">Reward claimed</span>
        ) : ready ? (
          <button type="button" className="btn btn-gold btn-sm" onClick={() => claim(quest.id)}>
            <Sparkles size={15} aria-hidden /> Claim +{quest.xp} XP
          </button>
        ) : (
          <Link href={quest.href} className="btn btn-ghost btn-sm">
            Go <ArrowRight size={15} aria-hidden />
            <span className="sr-only"> to work on {quest.title}</span>
          </Link>
        )}
      </div>
    </li>
  );
}

export default function QuestsPage() {
  const world = useNexora((s) => s.world);
  const progress = useNexora((s) => s.progress);
  const creations = useNexora((s) => s.creations);
  const lvl = useLevel();

  const statuses = useMemo(() => {
    const ctx = questContext({ world, progress, creations });
    return allQuests().map((q) => questStatus(q, ctx));
  }, [world, progress, creations]);

  const [daily, ...rest] = statuses;
  const ready = rest.filter((s) => s.complete && !s.claimed);
  const active = rest.filter((s) => !s.complete && !s.claimed);
  const done = rest.filter((s) => s.claimed);

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:py-8">
      <h1 className="font-display text-2xl sm:text-3xl">Quests</h1>
      <p className="mt-1 text-sm text-dim">Creative goals that earn XP. Level up to unlock new things to build.</p>

      <section className="panel panel-glow mt-4 flex flex-wrap items-center gap-4 p-4 sm:p-5" aria-labelledby="lvl-h">
        <span className="font-display grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 text-2xl text-white shadow-[0_0_40px_rgba(139,92,246,0.55)]">
          {lvl.level}
        </span>
        <div className="min-w-[12rem] flex-1">
          <h2 id="lvl-h" className="font-display text-lg">
            {lvl.title}
          </h2>
          <div className="bar mt-2" role="progressbar" aria-label="XP to next level" aria-valuemin={0} aria-valuemax={lvl.needed} aria-valuenow={lvl.current}>
            <span style={{ width: `${Math.round(lvl.ratio * 100)}%` }} />
          </div>
          <p className="mt-1 text-xs text-faint">
            {progress.xp} XP total · {lvl.needed - lvl.current} XP to level {lvl.level + 1}
          </p>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Level unlocks">
          {ASSETS.filter((a) => a.unlockLevel > 1).map((a) => {
            const unlocked = lvl.level >= a.unlockLevel;
            return (
              <li key={a.kind} className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs ${unlocked ? "bg-emerald-400/10" : "bg-violet-400/10"}`}>
                <AssetGlyph kind={a.kind} color={unlocked ? a.defaultColor : "#64748b"} size={26} />
                <span>
                  <span className="block font-bold">{a.name}</span>
                  <span className="block text-faint">{unlocked ? "Unlocked" : <><Lock size={10} className="inline" aria-hidden /> Level {a.unlockLevel}</>}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-6" aria-labelledby="daily-h">
        <h2 id="daily-h" className="text-sm font-bold uppercase tracking-wider text-faint">
          Today&apos;s challenge · new one every day
        </h2>
        <ul className="mt-2">
          <QuestCard s={daily} daily />
        </ul>
      </section>

      {ready.length > 0 && (
        <section className="mt-6" aria-labelledby="ready-h">
          <h2 id="ready-h" className="text-sm font-bold uppercase tracking-wider text-amber-200">
            Ready to claim ({ready.length})
          </h2>
          <ul className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
            {ready.map((s) => (
              <QuestCard key={s.quest.id} s={s} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6" aria-labelledby="active-h">
        <h2 id="active-h" className="text-sm font-bold uppercase tracking-wider text-faint">
          In progress ({active.length})
        </h2>
        {active.length === 0 ? (
          <p className="mt-2 text-sm text-dim">You&apos;ve finished every quest — amazing! Come back tomorrow for a new daily challenge.</p>
        ) : (
          <ul className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
            {active.map((s) => (
              <QuestCard key={s.quest.id} s={s} />
            ))}
          </ul>
        )}
      </section>

      {done.length > 0 && (
        <section className="mt-6" aria-labelledby="done-h">
          <h2 id="done-h" className="text-sm font-bold uppercase tracking-wider text-faint">
            Completed ({done.length})
          </h2>
          <ul className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
            {done.map((s) => (
              <QuestCard key={s.quest.id} s={s} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
