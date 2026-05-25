"use client";

import { useState } from "react";
import Link from "next/link";

const DEMO_MESSAGES = [
  { mood: "❤️", text: "You're honestly one of the most genuine people I know. Don't change.", time: "2m ago", color: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.25)" },
  { mood: "🔥", text: "Your confidence has grown so much this year. It's inspiring fr.", time: "14m ago", color: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)" },
  { mood: "🤔", text: "Why are you always so quiet in group settings but so fun 1 on 1?", time: "1h ago", color: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)" },
  { mood: "💬", text: "You give the best advice. Everyone knows it but nobody says it enough.", time: "3h ago", color: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
];

const STEPS = [
  { emoji: "⚡", title: "Create your link", desc: "Pick a username. Get whispr.app/you in 30 seconds.", color: "#06b6d4" },
  { emoji: "📲", title: "Share everywhere", desc: "TikTok bio, Instagram story, Twitter, Snapchat.", color: "#f59e0b" },
  { emoji: "💌", title: "Get real messages", desc: "People say what they actually think — anonymously.", color: "#a78bfa" },
];

const STATS = [
  { value: "100%", label: "Anonymous" },
  { value: "Free", label: "Forever" },
  { value: "30s", label: "Setup time" },
];

const FAQ = [
  {
    q: "Can people see who sent the message?",
    a: "No. Messages are 100% anonymous. The sender is never stored or shown — not even to admins.",
  },
  {
    q: "Is Whispr really free?",
    a: "Yes, completely free. Create a link, share it, receive unlimited messages. No credit card, no paywall.",
  },
  {
    q: "Do I need an account to send a message?",
    a: "Senders don't need an account at all. Only the person receiving messages needs to sign up for a link.",
  },
  {
    q: "What are mood tags?",
    a: "Senders pick an emoji mood (💬 ❤️ 🔥 🤔 😂 🥳) to give context to their message. It makes replies more expressive.",
  },
  {
    q: "What is the leaderboard?",
    a: "A public ranking of who gets the most messages. It resets weekly so new people can reach the top.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden glass card-hover">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left gap-4"
      >
        <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{q}</span>
        <span style={{ color: "var(--text-dim)", flexShrink: 0, fontSize: 18 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{a}</div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const a = "#06b6d4";

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 sticky top-0 z-40"
        style={{ background: "rgba(4,13,26,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <span className="font-extrabold text-xl tracking-tight" style={{ color: a }}>Whispr</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/leaderboard" className="text-xs px-3 py-1.5 rounded-xl font-semibold hidden sm:block" style={{ color: "rgba(6,182,212,0.7)", border: "1px solid rgba(6,182,212,0.2)" }}>
            🏆 Leaderboard
          </Link>
          <Link href="/login" className="text-sm px-3 py-2 rounded-xl cursor-pointer" style={{ color: "var(--text-dim)" }}>
            Login
          </Link>
          <Link href="/join" className="text-sm px-4 py-2 rounded-xl font-bold glow-btn" style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center px-4 pt-16 pb-12 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 65%)", animation: "float-slow 9s ease-in-out infinite" }} />
          <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)", animation: "float-alt 13s ease-in-out infinite" }} />
          <div className="absolute bottom-1/4 left-1/5 w-[200px] h-[200px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)", animation: "float-slow-3 11s ease-in-out infinite" }} />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm glass mb-6" style={{ color: a }}>
            <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: "#22c55e" }} />
            100% anonymous · No account needed to send
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5" style={{ color: "var(--text)" }}>
            What do people{" "}
            <span className="glow-text" style={{ fontStyle: "italic" }}>really</span>
            <br />think of you?
          </h1>

          <p className="text-base mb-8 max-w-sm mx-auto" style={{ color: "var(--text-dim)", lineHeight: 1.7 }}>
            Create your free link. Share it. Get brutally honest — and sometimes surprisingly sweet — anonymous messages.
          </p>

          {/* CTA */}
          <Link href="/join" className="inline-block px-8 py-4 rounded-2xl font-extrabold text-base glow-btn glow-pulse"
            style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white", fontSize: "1rem" }}>
            ✨ Create My Free Whispr Link
          </Link>

          <p className="text-xs mt-3" style={{ color: "var(--text-faint)" }}>Takes 30 seconds · No credit card</p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mt-10">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-extrabold text-xl" style={{ color: a }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo messages */}
      <section className="px-4 pb-14 max-w-lg mx-auto">
        <p className="text-center text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "var(--text-faint)" }}>
          Real messages people receive
        </p>
        <div className="space-y-3">
          {DEMO_MESSAGES.map((m, i) => (
            <div key={i} className="p-4 rounded-2xl flex items-start gap-3 card-hover"
              style={{ background: m.color, border: `1px solid ${m.border}`, animationDelay: `${i * 0.08}s` }}>
              <span className="text-2xl shrink-0 mt-0.5">{m.mood}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{m.text}</p>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-faint)" }}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-14" style={{ background: "rgba(6,182,212,0.02)", borderTop: "1px solid rgba(6,182,212,0.08)", borderBottom: "1px solid rgba(6,182,212,0.08)" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-center text-xl font-extrabold mb-8" style={{ color: "var(--text)" }}>How it works</h2>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-5 glass p-5 rounded-2xl card-hover">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  {s.emoji}
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: "var(--text)" }}>{s.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>{s.desc}</div>
                </div>
                <div className="ml-auto font-black text-2xl shrink-0" style={{ color: `${s.color}40` }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard tease */}
      <section className="px-4 py-14 max-w-lg mx-auto text-center">
        <div className="glass p-6 rounded-3xl space-y-3" style={{ borderColor: "rgba(245,158,11,0.25)" }}>
          <div className="text-4xl">🏆</div>
          <h3 className="font-extrabold text-lg" style={{ color: "var(--text)" }}>Who&apos;s getting the most messages?</h3>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>Check the public leaderboard and compete with friends.</p>
          <Link href="/leaderboard" className="inline-block px-6 py-3 rounded-2xl font-bold text-sm"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}>
            View Leaderboard →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-14 max-w-lg mx-auto">
        <h2 className="text-xl font-extrabold mb-8 text-center" style={{ color: "var(--text)" }}>Frequently asked</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 max-w-md mx-auto text-center">
        <div className="glass p-8 rounded-3xl space-y-5" style={{ borderColor: "rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.04)" }}>
          <div className="text-5xl">👻</div>
          <h3 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>Ready to find out the truth?</h3>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>Join thousands discovering what people really think.</p>
          <Link href="/join" className="block w-full py-4 rounded-2xl font-extrabold text-base glow-btn"
            style={{ background: `linear-gradient(135deg, ${a}, #0891b2)`, color: "white" }}>
            Create My Whispr → Free
          </Link>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>Already have an account? <Link href="/login" style={{ color: a }}>Login</Link></p>
        </div>
      </section>

      <footer className="text-center py-8 border-t text-xs" style={{ borderColor: "rgba(6,182,212,0.1)", color: "var(--text-faint)" }}>
        <div className="flex items-center justify-center gap-4 mb-2">
          <Link href="/leaderboard" style={{ color: "rgba(6,182,212,0.5)" }}>Leaderboard</Link>
          <span>·</span>
          <Link href="/join" style={{ color: "rgba(6,182,212,0.5)" }}>Join</Link>
          <span>·</span>
          <Link href="/login" style={{ color: "rgba(6,182,212,0.5)" }}>Login</Link>
        </div>
        <p><span style={{ color: a, fontWeight: 700 }}>Whispr</span> · Anonymous messages · Built by Mike Ronny</p>
      </footer>
    </main>
  );
}
