"use client";

import { ArrowLeft, ArrowRight, Check, Shuffle, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { THEMES } from "@/lib/catalog";
import { AVATARS, suggestName, suggestWorldName } from "@/lib/names";
import { validateName } from "@/lib/safety";
import { useNexora } from "@/lib/store";
import type { AgeBand, AvatarId, IslandTheme } from "@/lib/types";

type AgeChoice = AgeBand | "under12";
const STEPS = ["Welcome", "Age", "Explorer", "Island", "Promise"] as const;

const AGE_OPTIONS: { id: AgeChoice; label: string }[] = [
  { id: "under12", label: "Under 12" },
  { id: "12-13", label: "12 – 13" },
  { id: "14-15", label: "14 – 15" },
  { id: "16+", label: "16 or older" },
];

const PROMISES = [
  { title: "Keep personal info secret", body: "Never put your real name, school, address, phone number or social accounts in names, titles or AI ideas." },
  { title: "Create kindly", body: "Build things that are fun for everyone. Unkind or unsafe words are blocked automatically." },
  { title: "Take breaks", body: "Your island will wait for you. You can turn on gentle break reminders in your profile." },
];

function RadioCard({ checked, onSelect, children, label }: { checked: boolean; onSelect: () => void; children: React.ReactNode; label: string }) {
  return (
    <button type="button" role="radio" aria-checked={checked} aria-label={label} onClick={onSelect} className="choice relative w-full p-4 text-left">
      {children}
      {checked && (
        <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-cyan-300 text-cyan-950" aria-hidden>
          <Check size={14} />
        </span>
      )}
    </button>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const hydrated = useNexora((s) => s.hydrated);
  const existing = useNexora((s) => s.profile);
  const complete = useNexora((s) => s.completeOnboarding);
  const pushToast = useNexora((s) => s.pushToast);

  const [step, setStep] = useState(0);
  const [age, setAge] = useState<AgeChoice | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("nova");
  const [theme, setTheme] = useState<IslandTheme>("twilight");
  const [worldName, setWorldName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);

  const nameCheck = validateName(name);
  const worldCheck = validateName(worldName, { max: 28 });

  if (hydrated && existing && !finished) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <Logo />
        <h1 className="font-display text-2xl">Welcome back, {existing.name}!</h1>
        <p className="text-dim">You already have a world on this device.</p>
        <Link href="/world" className="btn btn-gold">
          Go to my world <ArrowRight size={18} aria-hidden />
        </Link>
        <Link href="/profile" className="text-sm text-faint underline underline-offset-4">
          Want to start over? Reset from your profile.
        </Link>
      </div>
    );
  }

  const canNext =
    step === 0 ||
    (step === 1 && age !== null && age !== "under12") ||
    (step === 2 && nameCheck.ok) ||
    (step === 3 && worldCheck.ok) ||
    (step === 4 && agreed);

  const next = () => {
    if (step === 2 || step === 3) setTouched(true);
    if (!canNext) return;
    setTouched(false);
    if (step === 2 && !worldName) setWorldName(suggestWorldName());
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setFinished(true);
    complete({ name, avatar, ageBand: age as AgeBand, theme, worldName });
    pushToast({ tone: "success", title: `Welcome to ${worldName.trim()}!`, body: "Your first quest is waiting: place your very first object." });
    router.push("/builder");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pb-8 pt-4 sm:pt-8">
      <div className="flex items-center justify-between">
        <Logo size={26} />
        <ol className="flex gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <li
              key={s}
              aria-current={i === step ? "step" : undefined}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-7 bg-cyan-300" : i < step ? "w-3 bg-violet-400" : "w-3 bg-violet-300/25"}`}
            >
              <span className="sr-only">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <form
        className="mt-8 flex flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        {step === 0 && (
          <section className="animate-rise flex flex-1 flex-col justify-center text-center">
            <div className="animate-float mx-auto grid size-32 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#c4b5fd,#6d28d9_55%,#1e1b4b_80%)] shadow-[0_0_80px_rgba(139,92,246,0.55)]">
              <Sparkles size={44} className="text-amber-200" aria-hidden />
            </div>
            <h1 className="font-display mt-8 text-3xl leading-tight sm:text-4xl">
              Your island is <span className="text-gradient">waiting.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-dim">
              In a minute you&apos;ll have your own floating world to build, decorate and dream up. No sign-up, no email — it&apos;s saved right here on this device.
            </p>
          </section>
        )}

        {step === 1 && (
          <section className="animate-rise" aria-labelledby="age-h">
            <h1 id="age-h" ref={heading} tabIndex={-1} className="font-display text-2xl outline-none">
              How old are you?
            </h1>
            <p className="mt-2 text-sm text-dim">We only keep your age range, never your birthday. It helps us keep NEXORA right for you.</p>
            <div role="radiogroup" aria-labelledby="age-h" className="mt-6 grid grid-cols-2 gap-3">
              {AGE_OPTIONS.map((o) => (
                <RadioCard key={o.id} checked={age === o.id} onSelect={() => setAge(o.id)} label={o.label}>
                  <span className="font-display text-lg">{o.label}</span>
                </RadioCard>
              ))}
            </div>
            {age === "under12" && (
              <div className="panel animate-pop mt-5 p-4" role="alert">
                <p className="font-bold">NEXORA is made for ages 12 to 15.</p>
                <p className="mt-1 text-sm text-dim">
                  Please come back when you&apos;re 12, or explore it together with a parent or guardian. Nothing has been saved.
                </p>
              </div>
            )}
            {age === "16+" && <p className="mt-4 text-sm text-faint">NEXORA is designed for ages 12–15, but you&apos;re welcome to explore it too.</p>}
          </section>
        )}

        {step === 2 && (
          <section className="animate-rise" aria-labelledby="name-h">
            <h1 id="name-h" ref={heading} tabIndex={-1} className="font-display text-2xl outline-none">
              Choose your explorer name
            </h1>
            <p className="mt-2 text-sm text-dim">Pick a fun made-up name — not your real one.</p>
            <label htmlFor="explorer-name" className="mt-6 block text-sm font-semibold">
              Explorer name
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="explorer-name"
                className="input"
                value={name}
                maxLength={20}
                autoComplete="off"
                autoCapitalize="words"
                spellCheck={false}
                placeholder="e.g. Starlit Fox"
                aria-invalid={touched && !nameCheck.ok}
                aria-describedby="name-help"
                onChange={(e) => setName(e.target.value)}
                onBlur={() => name && setTouched(true)}
              />
              <button type="button" className="icon-btn size-[2.9rem]!" onClick={() => setName(suggestName())} aria-label="Suggest a random name">
                <Shuffle size={18} aria-hidden />
              </button>
            </div>
            <p id="name-help" className={`mt-2 ${touched && !nameCheck.ok ? "field-error" : "text-xs text-faint"}`} aria-live="polite">
              {touched && !nameCheck.ok ? nameCheck.message : "3–20 characters. Letters, numbers, spaces, - and _."}
            </p>

            <h2 className="mt-7 text-sm font-semibold" id="avatar-h">
              Pick your sigil
            </h2>
            <div role="radiogroup" aria-labelledby="avatar-h" className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  role="radio"
                  aria-checked={avatar === a.id}
                  aria-label={a.label}
                  onClick={() => setAvatar(a.id)}
                  className="choice grid aspect-square place-items-center p-2"
                >
                  <span className="grid size-12 place-items-center rounded-full text-xl text-white" style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }} aria-hidden>
                    {a.glyph}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="animate-rise" aria-labelledby="island-h">
            <h1 id="island-h" ref={heading} tabIndex={-1} className="font-display text-2xl outline-none">
              Design your island
            </h1>
            <p className="mt-2 text-sm text-dim">Choose a mood. You can change it any time.</p>
            <div role="radiogroup" aria-label="Island theme" className="mt-6 grid grid-cols-2 gap-3">
              {Object.values(THEMES).map((t) => (
                <RadioCard key={t.id} checked={theme === t.id} onSelect={() => setTheme(t.id)} label={`${t.name}: ${t.blurb}`}>
                  <span className="block h-14 rounded-xl" style={{ background: `linear-gradient(160deg, ${t.sky} 0%, ${t.fog} 45%, ${t.grass} 100%)` }} aria-hidden />
                  <span className="font-display mt-3 block text-base">{t.name}</span>
                  <span className="block text-xs text-faint">{t.blurb}</span>
                </RadioCard>
              ))}
            </div>
            <label htmlFor="world-name" className="mt-6 block text-sm font-semibold">
              Island name
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="world-name"
                className="input"
                value={worldName}
                maxLength={28}
                autoComplete="off"
                aria-invalid={touched && !worldCheck.ok}
                aria-describedby="world-help"
                onChange={(e) => setWorldName(e.target.value)}
              />
              <button type="button" className="icon-btn size-[2.9rem]!" onClick={() => setWorldName(suggestWorldName())} aria-label="Suggest a random island name">
                <Shuffle size={18} aria-hidden />
              </button>
            </div>
            <p id="world-help" className={`mt-2 ${touched && !worldCheck.ok ? "field-error" : "text-xs text-faint"}`} aria-live="polite">
              {touched && !worldCheck.ok ? worldCheck.message : "Up to 28 characters."}
            </p>
          </section>
        )}

        {step === 4 && (
          <section className="animate-rise" aria-labelledby="promise-h">
            <h1 id="promise-h" ref={heading} tabIndex={-1} className="font-display text-2xl outline-none">
              The NEXORA promise
            </h1>
            <p className="mt-2 text-sm text-dim">Three simple rules that keep this a great place to create.</p>
            <ol className="mt-6 space-y-3">
              {PROMISES.map((p, i) => (
                <li key={p.title} className="panel flex gap-3 p-4">
                  <span className="font-display grid size-8 shrink-0 place-items-center rounded-full bg-violet-400/25 text-sm text-violet-100">{i + 1}</span>
                  <span>
                    <span className="block font-bold">{p.title}</span>
                    <span className="block text-sm text-dim">{p.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="panel mt-4 flex gap-3 p-4 text-sm text-dim">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-cyan-300" aria-hidden />
              <p>
                Your world is private and saved only on this device. There&apos;s no chat, no ads and nothing to buy.{" "}
                <Link href="/privacy" className="text-cyan-200 underline underline-offset-4">
                  Read the details
                </Link>
                .
              </p>
            </div>
            <label className="choice mt-4 flex cursor-pointer items-center gap-3 p-4">
              <input type="checkbox" className="size-5 accent-cyan-400" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span className="font-semibold">I&apos;ve got it — let&apos;s build!</span>
            </label>
          </section>
        )}

        <div className="mt-auto flex items-center gap-3 pt-8">
          {step > 0 && (
            <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={18} aria-hidden /> Back
            </button>
          )}
          <button type="submit" className="btn btn-gold ml-auto min-w-40" aria-disabled={!canNext}>
            {step === 0 ? "Let's begin" : step === STEPS.length - 1 ? "Create my world" : "Next"}
            <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}
