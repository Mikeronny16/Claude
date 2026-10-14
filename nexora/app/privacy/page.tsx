"use client";

import { ArrowLeft, Ban, Download, EyeOff, HardDrive, HeartHandshake, MessageSquareOff, ShieldCheck, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Dialog } from "@/components/ui/Dialog";
import { useNexora } from "@/lib/store";

const SAVED = [
  "Your explorer name and sigil (no real name, email or password — there are no accounts)",
  "Your age range, like “12–13” (never your birthday)",
  "Your island, its snapshots, and your quest progress and XP",
  "Your AI creations and the ideas you typed for them",
  "Your settings, reactions and any reports you made",
];

const FEATURES = [
  { icon: EyeOff, title: "Private by default", body: "Nobody else can see your island. Sharing isn't available in this prototype." },
  { icon: MessageSquareOff, title: "No chat or messages", body: "There's no way for strangers to contact you inside NEXORA." },
  { icon: Ban, title: "No ads, no purchases", body: "Nothing to buy, no loot boxes and no ads — ever, in this prototype." },
  { icon: ShieldCheck, title: "Word & info filter", body: "Names, titles and AI ideas are checked for unkind words and personal info like phone numbers, emails, links and addresses." },
  { icon: HeartHandshake, title: "Healthy habits", body: "Optional break reminders, a reduce-motion setting, and no streaks that punish you for taking time off." },
  { icon: Users, title: "Report button", body: "Showcase islands can be reported. In this prototype reports are stored only on your device." },
];

export default function PrivacyPage() {
  const router = useRouter();
  const hydrated = useNexora((s) => s.hydrated);
  const profile = useNexora((s) => s.profile);
  const reset = useNexora((s) => s.resetEverything);
  const [confirm, setConfirm] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const downloadAll = () => {
    const s = useNexora.getState();
    const data = {
      format: "nexora-personal-data",
      exportedAt: new Date().toISOString(),
      note: "Everything NEXORA has saved in this browser.",
      profile: s.profile,
      settings: s.settings,
      world: s.world,
      snapshots: s.saves,
      creations: s.creations,
      progress: s.progress,
      aiUsage: s.aiUsage,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexora-my-data.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
      {!profile && (
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" aria-label="NEXORA home">
            <Logo size={26} />
          </Link>
          <Link href="/" className="btn btn-ghost btn-sm">
            <ArrowLeft size={15} aria-hidden /> Back
          </Link>
        </div>
      )}
      <h1 className="font-display text-2xl sm:text-3xl">Privacy &amp; Safety</h1>
      <p className="mt-2 text-dim">NEXORA is made for creators aged 12–15. Here&apos;s exactly what happens with your stuff, in plain words.</p>

      <section className="panel mt-6 p-5" aria-labelledby="saved-h">
        <h2 id="saved-h" className="flex items-center gap-2 font-bold">
          <HardDrive size={18} className="text-cyan-300" aria-hidden /> What NEXORA saves
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-dim marker:text-violet-300">
          {SAVED.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          <strong>All of it stays in this browser, on this device.</strong> <span className="text-dim">The NEXORA team can&apos;t see your world. If you clear your browser data or switch devices, it&apos;s gone — download a backup if you want to keep it.</span>
        </p>
      </section>

      <section className="panel mt-4 p-5" aria-labelledby="leaves-h">
        <h2 id="leaves-h" className="font-bold">
          What leaves your device
        </h2>
        <p className="mt-2 text-sm text-dim">
          Only one thing, and only when live AI is switched on: the idea you type in the AI Creation Studio is sent to NEXORA&apos;s server and then to an AI service (Anthropic&apos;s Claude) to design your 3D object. Your
          explorer name, age range and island are <em>not</em> sent. When the studio shows <strong className="text-amber-100">Demo mode</strong>, nothing leaves your device at all.
        </p>
      </section>

      <section className="mt-6" aria-labelledby="features-h">
        <h2 id="features-h" className="font-bold">
          How NEXORA keeps things safe
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="panel flex gap-3 p-4">
              <Icon size={20} className="mt-0.5 shrink-0 text-cyan-300" aria-hidden />
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="block text-sm text-dim">{body}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-faint">
          No filter is perfect. If anything on NEXORA makes you feel uncomfortable, stop, and talk to a parent, carer or teacher you trust. If you are ever in danger, contact your local emergency number.
        </p>
      </section>

      <section className="panel mt-6 p-5" aria-labelledby="parents-h">
        <h2 id="parents-h" className="font-bold">
          For parents &amp; guardians
        </h2>
        <p className="mt-2 text-sm text-dim">
          This is a prototype. There are no accounts, no social features and no payments. Data is stored in the browser&apos;s local storage on this device only. You can review everything with “Download my data”
          below and remove it with “Delete everything”. If live AI is enabled by whoever runs this copy of NEXORA, typed creation ideas are processed by Anthropic to generate 3D models; they are filtered first for unsafe
          words and personal information.
        </p>
      </section>

      <section className="panel mt-6 p-5" aria-labelledby="controls-h">
        <h2 id="controls-h" className="font-bold">
          Your controls
        </h2>
        {hydrated && profile ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-ghost" onClick={downloadAll}>
              <Download size={16} aria-hidden /> Download my data
            </button>
            <button type="button" className="btn btn-danger" onClick={() => setConfirm(true)}>
              <Trash2 size={16} aria-hidden /> Delete everything
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-dim">Nothing is saved on this device yet.</p>
        )}
      </section>

      <Dialog
        open={confirm}
        onClose={() => {
          setConfirm(false);
          setUnderstood(false);
        }}
        tone="danger"
        title="Delete everything?"
        description="Your explorer, island, snapshots, AI creations, XP and settings will be erased from this device. This can't be undone."
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setConfirm(false);
                setUnderstood(false);
              }}
            >
              Keep my world
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={!understood}
              onClick={() => {
                reset();
                setConfirm(false);
                router.push("/");
              }}
            >
              <Trash2 size={16} aria-hidden /> Delete forever
            </button>
          </>
        }
      >
        <label className="choice flex cursor-pointer items-center gap-3 p-3">
          <input type="checkbox" className="size-5 accent-rose-400" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} />
          <span className="text-sm font-semibold">I understand my world will be gone for good</span>
        </label>
      </Dialog>
    </div>
  );
}
