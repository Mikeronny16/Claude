import { Compass, Hammer, ScrollText, ShieldCheck, WandSparkles } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { HeroScene, LandingCta } from "./landing-client";

const FEATURES = [
  { icon: Hammer, title: "Build in 3D", body: "Place, move, spin and resize trees, towers, crystals and more on a real floating island." },
  { icon: WandSparkles, title: "Create with AI", body: "Describe an idea — “a sleepy moon lantern” — and watch it become a 3D object." },
  { icon: ScrollText, title: "Creative quests", body: "Daily challenges and goals that reward you with XP, levels and new items." },
  { icon: Compass, title: "Get inspired", body: "Visit showcase islands, react to them and remix ideas into your own world." },
];

export default function Landing() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <Link href="/privacy" className="btn btn-ghost btn-sm">
          <ShieldCheck size={16} aria-hidden /> Safety
        </Link>
      </header>

      <section className="relative mx-auto grid grid-cols-1 max-w-6xl items-center gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:pb-16 lg:pt-6">
        <div className="relative z-10 order-2 lg:order-1">
          <p className="chip chip-cyan animate-rise">A floating world, made by you</p>
          <h1 className="font-display animate-rise mt-4 text-[2.15rem] leading-[1.08] sm:text-5xl lg:text-6xl">
            Shape your own <span className="text-gradient">sky island.</span>
          </h1>
          <p className="animate-rise mt-4 max-w-xl text-base text-dim sm:text-lg">
            Place glowing crystals, wizard towers and cozy cottages. Describe anything and watch it appear in 3D. Finish creative quests to level up your world.
          </p>
          <div className="animate-rise mt-6">
            <LandingCta />
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 text-xs text-dim" aria-label="Safety promises">
            {["Private by default", "No chat with strangers", "No ads or purchases", "Made for ages 12–15"].map((t) => (
              <li key={t} className="chip">
                <ShieldCheck size={12} aria-hidden className="text-cyan-300" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative order-1 -mx-4 h-[46vh] min-h-[300px] sm:mx-0 sm:h-[460px] sm:rounded-[2rem] lg:order-2 lg:h-[560px]">
          <div className="absolute inset-0 overflow-hidden sm:rounded-[2rem] sm:border sm:border-violet-300/20">
            <HeroScene />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070620] to-transparent sm:hidden" aria-hidden />
        </div>
      </section>

      <section aria-labelledby="features" className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 id="features" className="sr-only">
          What you can do
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="panel p-5">
              <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/40 to-cyan-400/20 text-cyan-200">
                <Icon size={20} aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-base">{title}</h3>
              <p className="mt-1 text-sm text-dim">{body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-xs text-faint">
          NEXORA prototype · Your world is saved only on this device ·{" "}
          <Link href="/privacy" className="underline decoration-dotted underline-offset-4 hover:text-white">
            Privacy &amp; safety
          </Link>
        </p>
      </section>
    </div>
  );
}
