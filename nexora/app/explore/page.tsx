"use client";

import { Castle, Coffee, Flag, Info, Palette, Shuffle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { WorldView } from "@/components/three/SceneLoader";
import { THEMES } from "@/lib/catalog";
import { useReducedMotion } from "@/lib/hooks";
import { SHOWCASE } from "@/lib/showcase";
import { useNexora } from "@/lib/store";
import type { ReactionId } from "@/lib/types";

const REACTIONS: { id: ReactionId; label: string; icon: typeof Sparkles }[] = [
  { id: "inspiring", label: "Inspiring", icon: Sparkles },
  { id: "cozy", label: "Cozy", icon: Coffee },
  { id: "epic", label: "Epic", icon: Castle },
  { id: "colorful", label: "Colorful", icon: Palette },
];

const REPORT_REASONS = ["Unkind or mean", "Scary or violent", "Shows personal info", "Something else feels wrong"];

function ReportDialog({ open, onClose, worldId, title }: { open: boolean; onClose: () => void; worldId: string; title: string }) {
  const report = useNexora((s) => s.reportWorld);
  const pushToast = useNexora((s) => s.pushToast);
  const [reason, setReason] = useState<string | null>(null);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Report “${title}”`}
      description="Thanks for helping keep NEXORA kind. What's wrong?"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!reason}
            onClick={() => {
              if (!reason) return;
              report(worldId, reason);
              pushToast({
                tone: "success",
                title: "Report saved",
                body: "In this prototype reports stay on your device. In the full app they go to a human moderator.",
              });
              setReason(null);
              onClose();
            }}
          >
            Send report
          </button>
        </>
      }
    >
      <fieldset>
        <legend className="sr-only">Reason</legend>
        <div className="space-y-2">
          {REPORT_REASONS.map((r) => (
            <label key={r} className="choice flex cursor-pointer items-center gap-3 p-3">
              <input type="radio" name="report-reason" className="size-4 accent-cyan-400" checked={reason === r} onChange={() => setReason(r)} />
              <span className="text-sm font-semibold">{r}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-3 text-xs text-faint">If something upset you, it&apos;s always okay to talk to a parent, carer or teacher.</p>
    </Dialog>
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const quality = useNexora((s) => s.settings.quality);
  const reactions = useNexora((s) => s.progress.reactions);
  const explored = useNexora((s) => s.progress.explored);
  const objectCount = useNexora((s) => s.world.objects.length);
  const { markExplored, toggleReaction, loadWorld, saveSnapshot, pushToast } = useNexora.getState();

  const [activeId, setActiveId] = useState(SHOWCASE[0].id);
  const [remixOpen, setRemixOpen] = useState(false);
  const [keepBackup, setKeepBackup] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const viewer = useRef<HTMLElement>(null);
  const active = SHOWCASE.find((s) => s.id === activeId) ?? SHOWCASE[0];

  const choose = (id: string) => {
    setActiveId(id);
    // On phones the list is below the viewer; scroll up so the change is visible.
    const el = viewer.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };
  const mine = reactions[active.id] ?? [];

  useEffect(() => {
    markExplored(activeId);
  }, [activeId, markExplored]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:py-8">
      <h1 className="font-display text-2xl sm:text-3xl">Explore</h1>
      <p className="mt-1 text-sm text-dim">Visit showcase islands for ideas, react to them, or remix one into your own world.</p>
      <p className="panel mt-3 flex gap-2 p-3 text-xs text-dim" role="note">
        <Info size={16} className="shrink-0 text-cyan-300" aria-hidden />
        These islands were built by the NEXORA team. Sharing your own island with other players isn&apos;t available in this prototype, so nobody else can see your world.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section ref={viewer} className="panel scroll-mt-20 overflow-hidden" aria-labelledby="active-h">
          <div className="relative h-[44vh] min-h-[280px] lg:h-[480px]">
            <WorldView
              key={active.id}
              label={`${active.title}, a showcase island by ${active.author}. ${active.blurb}`}
              world={active.world}
              creations={[]}
              mode="view"
              autoRotate
              reducedMotion={reduced}
              quality={quality}
            />
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 id="active-h" className="font-display text-xl">
                  {active.title}
                </h2>
                <p className="text-xs text-faint">by {active.author} · {active.world.objects.length} objects · {THEMES[active.world.theme].name}</p>
              </div>
              <div className="flex gap-1.5">
                {active.tags.map((t) => (
                  <span key={t} className="chip">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-dim">{active.blurb}</p>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="React to this island">
              {REACTIONS.map(({ id, label, icon: Icon }) => {
                const on = mine.includes(id);
                return (
                  <button key={id} type="button" className="choice flex min-h-10 items-center gap-1.5 px-3 text-sm font-semibold" aria-pressed={on} onClick={() => toggleReaction(active.id, id)}>
                    <Icon size={15} aria-hidden className={on ? "text-cyan-200" : "text-faint"} /> {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={() => setRemixOpen(true)}>
                <Shuffle size={16} aria-hidden /> Remix into my island
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setReportOpen(true)}>
                <Flag size={16} aria-hidden /> Report
              </button>
            </div>
          </div>
        </section>

        <section aria-labelledby="list-h">
          <h2 id="list-h" className="text-sm font-bold uppercase tracking-wider text-faint">
            Showcase islands · visited {explored.length}/{SHOWCASE.length}
          </h2>
          <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {SHOWCASE.map((s) => {
              const t = THEMES[s.world.theme];
              return (
                <li key={s.id}>
                  <button type="button" className="choice flex w-full items-center gap-3 p-2.5 text-left" aria-pressed={s.id === activeId} onClick={() => choose(s.id)}>
                    <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg" style={{ background: `linear-gradient(170deg, ${t.sky} 10%, ${t.fog} 50%, ${t.grass} 100%)` }} aria-hidden>
                      <span className="absolute inset-x-3 bottom-2 h-3 rounded-[50%]" style={{ background: t.grass, boxShadow: `0 6px 0 ${t.rock}` }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{s.title}</span>
                      <span className="block truncate text-xs text-faint">{s.blurb}</span>
                    </span>
                    {explored.includes(s.id) && <span className="chip chip-cyan shrink-0">Visited</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <Dialog
        open={remixOpen}
        onClose={() => setRemixOpen(false)}
        title={`Remix “${active.title}”?`}
        description={`Your island will be replaced with a copy of ${active.title} (${active.world.objects.length} objects) for you to change however you like. You can press Undo in the Builder to go back.`}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setRemixOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (keepBackup && objectCount > 0) saveSnapshot("Before remix");
                loadWorld({ ...active.world, name: `${active.title} Remix` });
                markExplored(active.id);
                setRemixOpen(false);
                pushToast({ tone: "success", title: "Remix ready!", body: keepBackup && objectCount > 0 ? "Your old island is saved as a snapshot." : "Make it your own." });
                router.push("/builder");
              }}
            >
              Remix it
            </button>
          </>
        }
      >
        {objectCount > 0 && (
          <label className="choice flex cursor-pointer items-center gap-3 p-3">
            <input type="checkbox" className="size-5 accent-cyan-400" checked={keepBackup} onChange={(e) => setKeepBackup(e.target.checked)} />
            <span className="text-sm font-semibold">Save my current island as a snapshot first</span>
          </label>
        )}
      </Dialog>
      <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} worldId={active.id} title={active.title} />
    </div>
  );
}
