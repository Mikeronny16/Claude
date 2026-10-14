"use client";

import { Award, Check, Pencil, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { QuestIcon } from "@/components/ui/QuestIcon";
import { useLevel } from "@/lib/hooks";
import { AVATARS, AVATAR_MAP, suggestName } from "@/lib/names";
import { QUESTS } from "@/lib/quests";
import { validateName } from "@/lib/safety";
import { useNexora } from "@/lib/store";
import type { Settings } from "@/lib/types";

function Switch({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-faint">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-cyan-400" : "bg-violet-300/25"}`}
      >
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-1"}`} aria-hidden />
      </button>
    </div>
  );
}

function Segmented<T extends string | number>({ label, hint, value, options, onChange }: { label: string; hint: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-semibold" id={id}>
          {label}
        </p>
        <p className="text-xs text-faint">{hint}</p>
      </div>
      <div role="radiogroup" aria-labelledby={id} className="flex rounded-xl bg-violet-400/10 p-1">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={`min-h-9 rounded-lg px-3 text-sm font-semibold transition ${value === o.value ? "bg-violet-500 text-white shadow" : "text-dim hover:text-white"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EditProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const profile = useNexora((s) => s.profile)!;
  const update = useNexora((s) => s.updateProfile);
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const check = validateName(name);
  const submit = () => {
    if (!check.ok) return;
    update({ name, avatar });
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit your explorer"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={submit} aria-disabled={!check.ok}>
            Save
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
        <label htmlFor="edit-name" className="text-sm font-semibold">
          Explorer name
        </label>
        <div className="mt-2 flex gap-2">
          <input id="edit-name" className="input" value={name} maxLength={20} autoComplete="off" aria-invalid={!check.ok} aria-describedby="edit-name-help" onChange={(e) => setName(e.target.value)} />
          <button type="button" className="btn btn-ghost" onClick={() => setName(suggestName())}>
            Random
          </button>
        </div>
        <p id="edit-name-help" className={`mt-2 ${check.ok ? "text-xs text-faint" : "field-error"}`} aria-live="polite">
          {check.ok ? "A made-up name, not your real one." : check.message}
        </p>
        <p className="mt-4 text-sm font-semibold" id="edit-avatar">
          Sigil
        </p>
        <div role="radiogroup" aria-labelledby="edit-avatar" className="mt-2 grid grid-cols-6 gap-2">
          {AVATARS.map((a) => (
            <button key={a.id} type="button" role="radio" aria-checked={avatar === a.id} aria-label={a.label} onClick={() => setAvatar(a.id)} className="choice grid aspect-square place-items-center">
              <span className="grid size-9 place-items-center rounded-full text-white" style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }} aria-hidden>
                {a.glyph}
              </span>
            </button>
          ))}
        </div>
      </form>
    </Dialog>
  );
}

const AGE_LABEL = { "12-13": "12–13", "14-15": "14–15", "16+": "16+" } as const;

export default function ProfilePage() {
  const profile = useNexora((s) => s.profile)!;
  const progress = useNexora((s) => s.progress);
  const settings = useNexora((s) => s.settings);
  const creations = useNexora((s) => s.creations);
  const updateSettings = useNexora((s) => s.updateSettings);
  const lvl = useLevel();
  const [editing, setEditing] = useState(false);
  const a = AVATAR_MAP[profile.avatar] ?? AVATAR_MAP.nova;
  const set = <K extends keyof Settings>(k: K) => (v: Settings[K]) => updateSettings({ [k]: v } as Partial<Settings>);

  const stats = [
    { label: "Objects placed", value: progress.placedTotal },
    { label: "AI creations", value: creations.length },
    { label: "Snapshots saved", value: progress.saves },
    { label: "Islands visited", value: progress.explored.length },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:py-8">
      <h1 className="sr-only">Your profile</h1>
      <section className="panel panel-glow flex flex-wrap items-center gap-4 p-5" aria-label="Explorer">
        <span className="grid size-20 place-items-center rounded-full text-3xl text-white shadow-[0_0_40px_rgba(139,92,246,0.5)]" style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }} aria-hidden>
          {a.glyph}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-2xl">{profile.name}</p>
          <p className="text-sm text-dim">
            Level {lvl.level} {lvl.title} · Age group {AGE_LABEL[profile.ageBand]} · Since {new Date(profile.createdAt).toLocaleDateString()}
          </p>
          <div className="bar mt-2 max-w-xs" role="progressbar" aria-label="XP to next level" aria-valuemin={0} aria-valuemax={lvl.needed} aria-valuenow={lvl.current}>
            <span style={{ width: `${Math.round(lvl.ratio * 100)}%` }} />
          </div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => setEditing(true)}>
          <Pencil size={16} aria-hidden /> Edit
        </button>
      </section>

      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel p-3 text-center">
            <dt className="text-xs text-faint">{s.label}</dt>
            <dd className="font-display text-2xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="panel mt-4 p-4 sm:p-5" aria-labelledby="badges-h">
        <h2 id="badges-h" className="flex items-center gap-2 font-bold">
          <Award size={18} className="text-amber-200" aria-hidden /> Badges ({QUESTS.filter((q) => progress.claimed.includes(q.id)).length}/{QUESTS.length})
        </h2>
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {QUESTS.map((q) => {
            const earned = progress.claimed.includes(q.id);
            return (
              <li key={q.id} className={`flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-center ${earned ? "bg-amber-300/10" : "bg-violet-400/5 opacity-60"}`}>
                <span className={`relative grid size-11 place-items-center rounded-full ${earned ? "bg-gradient-to-br from-amber-200 to-amber-500 text-amber-950" : "bg-violet-400/15 text-faint"}`}>
                  <QuestIcon name={q.icon} size={18} />
                  {earned && (
                    <span className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-emerald-400 text-emerald-950">
                      <Check size={10} aria-hidden />
                    </span>
                  )}
                </span>
                <span className="text-[0.7rem] font-semibold leading-tight">{q.title}</span>
                <span className="sr-only">{earned ? "earned" : "not earned yet"}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel mt-4 divide-y divide-violet-300/10 px-4 sm:px-5" aria-labelledby="settings-h">
        <h2 id="settings-h" className="py-4 font-bold">
          Settings
        </h2>
        <Switch checked={settings.reducedMotion} onChange={set("reducedMotion")} label="Reduce motion" hint="Stops spinning, floating and sparkle animations." />
        <Segmented
          label="Graphics"
          hint="Low is smoother on older phones and saves battery."
          value={settings.quality}
          options={[
            { value: "low", label: "Low" },
            { value: "high", label: "High" },
          ]}
          onChange={set("quality")}
        />
        <Segmented
          label="Break reminders"
          hint="A gentle nudge to rest your eyes."
          value={settings.breakReminderMinutes}
          options={[
            { value: 0, label: "Off" },
            { value: 30, label: "30 min" },
            { value: 60, label: "60 min" },
          ]}
          onChange={set("breakReminderMinutes")}
        />
        <Switch checked={settings.snapToGrid} onChange={set("snapToGrid")} label="Snap to grid" hint="Line objects up neatly in the World Builder." />
      </section>

      <Link href="/privacy" className="panel mt-4 flex items-center gap-3 p-4 hover:border-violet-300/40">
        <ShieldCheck size={22} className="text-cyan-300" aria-hidden />
        <span className="flex-1">
          <span className="block font-bold">Privacy &amp; Safety</span>
          <span className="block text-sm text-dim">See what&apos;s saved, download your data, or delete everything.</span>
        </span>
      </Link>

      {editing && <EditProfileDialog open onClose={() => setEditing(false)} />}
    </div>
  );
}
