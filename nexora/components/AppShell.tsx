"use client";

import { Compass, Globe, Hammer, ScrollText, ShieldCheck, UserRound, WandSparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, type ReactNode } from "react";
import { useLevel, useReducedMotion } from "@/lib/hooks";
import { AVATAR_MAP } from "@/lib/names";
import { claimableCount } from "@/lib/quests";
import { questContext, useNexora } from "@/lib/store";
import { LogoMark, Logo } from "./Logo";
import { LevelUp } from "./ui/LevelUp";
import { Toasts } from "./ui/Toasts";

const NAV = [
  { href: "/world", label: "My World", short: "World", icon: Globe },
  { href: "/builder", label: "World Builder", short: "Build", icon: Hammer },
  { href: "/create", label: "AI Creation", short: "Create", icon: WandSparkles },
  { href: "/quests", label: "Quests", short: "Quests", icon: ScrollText },
  { href: "/explore", label: "Explore", short: "Explore", icon: Compass },
];
const SECONDARY = [
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/privacy", label: "Privacy & Safety", icon: ShieldCheck },
];

/** Routes that work before onboarding. */
const PUBLIC = new Set(["/", "/onboarding", "/privacy"]);
/** Routes that render without the app navigation. */
const BARE = new Set(["/", "/onboarding"]);

function useClaimable() {
  const world = useNexora((s) => s.world);
  const progress = useNexora((s) => s.progress);
  const creations = useNexora((s) => s.creations);
  return useMemo(() => claimableCount(questContext({ world, progress, creations })), [world, progress, creations]);
}

function Avatar({ size = 36 }: { size?: number }) {
  const profile = useNexora((s) => s.profile);
  if (!profile) return null;
  const a = AVATAR_MAP[profile.avatar] ?? AVATAR_MAP.nova;
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-white shadow-lg"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${a.from}, ${a.to})`, fontSize: size * 0.45 }}
      aria-hidden
    >
      {a.glyph}
    </span>
  );
}

function LevelPill() {
  const lvl = useLevel();
  return (
    <span className="chip chip-gold" aria-label={`Level ${lvl.level}, ${lvl.title}`}>
      Lv {lvl.level}
    </span>
  );
}

function SideNav({ pathname, claimable }: { pathname: string; claimable: number }) {
  const lvl = useLevel();
  const profile = useNexora((s) => s.profile);
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-violet-300/10 bg-[#080622]/80 px-4 py-5 backdrop-blur-xl lg:flex">
      <Link href="/world" className="mb-8 px-2" aria-label="NEXORA home">
        <Logo />
      </Link>
      <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
        {[...NAV, ...SECONDARY].map((item, i) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <div key={item.href}>
              {i === NAV.length && <div className="divider my-3" />}
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  active ? "bg-violet-400/20 text-white shadow-[inset_0_0_0_1px_rgba(167,139,250,0.4)]" : "text-dim hover:bg-violet-400/10 hover:text-white"
                }`}
              >
                <Icon size={18} aria-hidden className={active ? "text-cyan-300" : ""} />
                {item.label}
                {item.href === "/quests" && claimable > 0 && (
                  <span className="ml-auto rounded-full bg-amber-300 px-2 py-0.5 text-xs font-bold text-amber-950" aria-label={`${claimable} rewards ready`}>
                    {claimable}
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>
      {profile && (
        <Link href="/profile" className="panel mt-4 flex items-center gap-3 p-3 hover:border-violet-300/40">
          <Avatar size={40} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">{profile.name}</span>
            <span className="block text-xs text-faint">
              Lv {lvl.level} · {lvl.title}
            </span>
            <span className="bar mt-1.5 block" aria-hidden>
              <span style={{ width: `${Math.round(lvl.ratio * 100)}%` }} />
            </span>
          </span>
        </Link>
      )}
    </aside>
  );
}

function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[var(--top-h)] items-center justify-between border-b border-violet-300/10 bg-[#080622]/85 px-4 backdrop-blur-xl lg:hidden">
      <Link href="/world" aria-label="NEXORA home">
        <Logo size={26} />
      </Link>
      <div className="flex items-center gap-2">
        <LevelPill />
        <Link href="/profile" aria-label="Your profile" className="rounded-full">
          <Avatar size={34} />
        </Link>
      </div>
    </header>
  );
}

function BottomNav({ pathname, claimable }: { pathname: string; claimable: number }) {
  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-violet-300/10 bg-[#080622]/90 backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid h-[var(--nav-h)] max-w-lg grid-cols-5">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={item.href === "/quests" && claimable > 0 ? `${item.label}, ${claimable} rewards ready` : item.label}
                className={`relative flex h-full flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold ${active ? "text-white" : "text-faint"}`}
              >
                <span className={`grid h-8 w-12 place-items-center rounded-full transition ${active ? "bg-violet-400/25 text-cyan-200" : ""}`}>
                  <Icon size={20} aria-hidden />
                </span>
                {item.short}
                {item.href === "/quests" && claimable > 0 && (
                  <span className="absolute right-[18%] top-1.5 grid size-4 place-items-center rounded-full bg-amber-300 text-[0.6rem] font-bold text-amber-950" aria-hidden>
                    {claimable}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function FullScreenLoader() {
  return (
    <div className="grid min-h-dvh place-items-center" role="status">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-float">
          <LogoMark size={64} />
        </div>
        <p className="text-sm text-dim">Opening your world…</p>
      </div>
    </div>
  );
}

function BreakReminder() {
  const minutes = useNexora((s) => s.settings.breakReminderMinutes);
  const pushToast = useNexora((s) => s.pushToast);
  useEffect(() => {
    if (!minutes) return;
    const id = setInterval(() => {
      pushToast({ tone: "info", title: "Time for a quick break?", body: `You've been creating for ${minutes} minutes. Stretch, drink some water and rest your eyes — your island will wait for you.` });
    }, minutes * 60_000);
    return () => clearInterval(id);
  }, [minutes, pushToast]);
  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const hydrated = useNexora((s) => s.hydrated);
  const profile = useNexora((s) => s.profile);
  const reduced = useReducedMotion();
  const claimable = useClaimable();

  useEffect(() => {
    try {
      const p = useNexora.persist;
      if (p?.rehydrate) void p.rehydrate();
      else useNexora.setState({ hydrated: true });
    } catch {
      useNexora.setState({ hydrated: true });
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
  }, [reduced]);

  const needsProfile = !PUBLIC.has(pathname);
  useEffect(() => {
    if (hydrated && needsProfile && !profile) router.replace("/onboarding");
  }, [hydrated, needsProfile, profile, router]);

  const chrome = hydrated && !!profile && !BARE.has(pathname);
  const blocked = needsProfile && (!hydrated || !profile);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {chrome && <TopBar />}
      {chrome && <SideNav pathname={pathname} claimable={claimable} />}
      <main
        id="main"
        tabIndex={-1}
        className={`relative z-10 outline-none ${chrome ? "pt-[var(--top-h)] pb-[calc(var(--nav-h)+env(safe-area-inset-bottom))] lg:pt-0 lg:pb-0 lg:pl-64" : ""}`}
      >
        {blocked ? <FullScreenLoader /> : children}
      </main>
      {chrome && <BottomNav pathname={pathname} claimable={claimable} />}
      <Toasts />
      <LevelUp />
      <BreakReminder />
    </>
  );
}
