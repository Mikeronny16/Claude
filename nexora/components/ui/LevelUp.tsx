"use client";

import { ASSETS } from "@/lib/catalog";
import { levelTitle } from "@/lib/levels";
import { useNexora } from "@/lib/store";
import { Dialog } from "./Dialog";

export function LevelUp() {
  const level = useNexora((s) => s.levelUp);
  const dismiss = useNexora((s) => s.dismissLevelUp);
  const unlocked = level ? ASSETS.filter((a) => a.unlockLevel === level) : [];
  return (
    <Dialog
      open={level !== null}
      onClose={dismiss}
      tone="celebrate"
      title={level ? `Level ${level}: ${levelTitle(level)}!` : ""}
      description="Your creativity is leveling up your world."
      footer={
        <button type="button" className="btn btn-gold" onClick={dismiss}>
          Keep building
        </button>
      }
    >
      <div className="relative mx-auto grid size-28 place-items-center">
        <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-amber-300/50" aria-hidden />
        <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-400 shadow-[0_0_50px_rgba(139,92,246,0.7)]">
          <span className="font-display text-3xl text-white">{level}</span>
        </div>
      </div>
      {unlocked.length > 0 && (
        <p className="mt-4 text-center text-sm">
          <span className="chip chip-gold">Unlocked</span>{" "}
          <span className="text-dim">{unlocked.map((a) => a.name).join(", ")} — find it in the World Builder.</span>
        </p>
      )}
    </Dialog>
  );
}
