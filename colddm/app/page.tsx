"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang, LanguageSelector } from "@/components/LanguageContext";
import { SCRIPTS } from "@/lib/scripts";

const BASE_URL = "https://colddm.vercel.app";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const STEPS = [
  { n: "01", icon: "📂", title: "Open your scripts", body: "30 scripts organized by situation. Pick the one that fits." },
  { n: "02", icon: "✏️", title: "Fill the brackets", body: "Replace [NAME], [YOUR SERVICE], [RESULT] with your info. Takes 60 seconds." },
  { n: "03", icon: "📤", title: "Send. Get replies.", body: "Hit send. These scripts are written to get responses — not get ignored." },
];

const CATS = [
  { icon: "📱", label: "Instagram DMs",   count: 6,  desc: "Openers that get read" },
  { icon: "📧", label: "Cold Emails",      count: 6,  desc: "Subject lines that get opened" },
  { icon: "🔄", label: "Follow-Ups",       count: 5,  desc: "Revive dead leads" },
  { icon: "🤝", label: "Collabs & Deals",  count: 5,  desc: "Brand & partner outreach" },
  { icon: "💬", label: "Objection Replies",count: 4,  desc: "Handle \"I'll think about it\"" },
  { icon: "📋", label: "Proposals",        count: 4,  desc: "Close after the call" },
];

const TESTIMONIALS = [
  { name: "Carlo M.",  flag: "🇵🇭", role: "Web designer",       text: "Sent 3 of these and landed a $400 client the same week." },
  { name: "Siti R.",   flag: "🇮🇩", role: "Content creator",    text: "Script #15 recovered 2 dead leads I had given up on." },
  { name: "Thanh N.",  flag: "🇻🇳", role: "Copywriter",         text: "Used to spend 40 min on one cold email. Now it's 60 seconds." },
  { name: "James K.",  flag: "🇺🇬", role: "Video editor",       text: "The objection replies alone are worth way more than $5." },
];

const PAIN_ICONS = ["😶", "⏰", "😤", "🤷‍♂️"];

export default function HomePage() {
  const { t } = useLang();
  const [openFaq, setOpenFaq]           = useState<number | null>(null);
  const [openSample, setOpenSample]     = useState<number | null>(null);
  const [showSticky, setShowSticky]     = useState(false);
  const [freeCount, setFreeCount]       = useState(3);
  const [myRef, setMyRef]               = useState("");
  const [incomingRef, setIncomingRef]   = useState("");
  const [copied, setCopied]             = useState(false);
  const [refDismissed, setRefDismissed] = useState(false);

  useEffect(() => {
    const fn = () => setShowSticky(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    let code = localStorage.getItem("cdm_myref");
    if (!code) {
      code = "DM" + Math.random().toString(36).slice(2, 7).toUpperCase();
      localStorage.setItem("cdm_myref", code);
    }
    setMyRef(code);
    if (ref) {
      setIncomingRef(ref);
      localStorage.setItem("cdm_came_via", ref);
      setFreeCount(5);
    } else if (localStorage.getItem("cdm_came_via")) {
      setFreeCount(5);
    }
  }, []);

  const shareUrl = myRef ? `${BASE_URL}/?ref=${myRef}` : BASE_URL;
  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`💬 Get 5 free cold DM scripts: ${shareUrl}`)}`;
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`These DM scripts actually get replies 💬 ${shareUrl}`)}`;

  const handleBuy = useCallback(() => {
    const subject = encodeURIComponent("ColdDM Scripts Purchase — $5");
    const body = encodeURIComponent("Hi Mike,\n\nI want to buy ColdDM Scripts (30 Freelancer Scripts) for $5.\n\nPlease send me payment details and the access code.\n\nThank you!");
    window.open(`mailto:mikeronny18@gmail.com?subject=${subject}&body=${body}`);
  }, []);

  const freeSamples = SCRIPTS.slice(0, freeCount);

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#0d1117", color: "#cbd5e1" }}>

      {/* ── REFERRAL BANNER ───────────────────────────────── */}
      {incomingRef && !refDismissed && (
        <div className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between gap-3 px-5 py-2.5"
          style={{ background: "rgba(5,10,25,0.98)", borderBottom: "1px solid rgba(0,194,255,0.5)", backdropFilter: "blur(12px)" }}>
          <p className="text-sm font-semibold" style={{ color: "#93c5fd" }}>
            🎁 Bonus: <strong style={{ color: "#38d9ff" }}>5 free scripts</strong> unlocked — scroll down ↓
          </p>
          <button onClick={() => setRefDismissed(true)} style={{ color: "#00c2ff", fontSize: 18 }}>✕</button>
        </div>
      )}

      {/* ── STICKY BAR ────────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        transform: showSticky ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s ease",
        background: "rgba(9,13,23,0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(0,194,255,0.15)",
        padding: "10px 20px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ flex: 1 }}>
          <p className="text-sm font-black text-white">ColdDM Scripts</p>
          <p className="text-xs" style={{ color: "#00c2ff" }}>30 scripts · $5 one-time</p>
        </div>
        <button onClick={handleBuy} className="btn-blue px-5 py-2.5 text-sm font-black rounded-xl">✉️ $5</button>
      </div>

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-3 flex items-center justify-between"
        style={{ background: "rgba(9,13,23,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(30,42,61,0.5)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm text-white"
            style={{ background: "linear-gradient(135deg, #00c2ff, #0060e0)" }}>C</div>
          <span className="font-bold text-white text-sm">ColdDM</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button onClick={handleBuy} className="btn-blue text-xs font-bold px-4 py-2 rounded-lg">{t.nav.buy}</button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO — Split layout
      ══════════════════════════════════════════════════════ */}
      <section style={{ paddingTop: incomingRef && !refDismissed ? "8rem" : "6rem", paddingBottom: "4rem" }}
        className="px-5 relative overflow-hidden">

        {/* BG glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 15% 40%, rgba(0,194,255,0.15) 0%, rgba(0,117,255,0.08) 40%, transparent 70%)",
        }} />
        <div className="absolute top-24 left-0 right-0 h-px pointer-events-none" style={{
          background: "linear-gradient(90deg, transparent 5%, rgba(0,194,255,0.35) 30%, rgba(0,117,255,0.5) 50%, rgba(0,194,255,0.35) 70%, transparent 95%)",
        }} />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div>
              <Reveal>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-5"
                  style={{ background: "rgba(0,194,255,0.12)", color: "#38d9ff", border: "1px solid rgba(0,194,255,0.2)" }}>
                  ✦ {t.hero.badge}
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] mb-5 text-white">
                  {t.hero.h1a}<br />
                  <span style={{ background: "linear-gradient(135deg, #00e5ff 0%, #00c2ff 50%, #0075ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 20px rgba(0,194,255,0.6))" }}>
                    {t.hero.h1b}
                  </span><br />
                  {t.hero.h1c}
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="text-base mb-6 leading-relaxed" style={{ color: "#94a3b8" }}>{t.hero.sub}</p>
              </Reveal>
              <Reveal delay={200}>
                <button onClick={handleBuy}
                  className="btn-blue w-full sm:w-auto px-8 py-4 text-base font-black rounded-xl mb-3"
                  style={{ animation: "glowPulse 2.5s ease-in-out infinite" }}>
                  {t.hero.cta}
                </button>
                <p className="text-xs mt-2" style={{ color: "#334155" }}>{t.hero.note}</p>
              </Reveal>
            </div>

            {/* Right — DM preview card */}
            <Reveal delay={120} className="hidden sm:block">
              <div className="rounded-2xl p-5 relative"
                style={{ background: "#0e1420", border: "1px solid rgba(0,194,255,0.25)", boxShadow: "0 0 40px rgba(0,194,255,0.08), inset 0 1px 0 rgba(0,194,255,0.1)" }}>
                {/* phone bar */}
                <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: "1px solid #1e2a3d" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                    style={{ background: "linear-gradient(135deg, #00c2ff, #0060e0)" }}>A</div>
                  <div>
                    <p className="text-xs font-bold text-white">Alex Chen · Designer</p>
                    <p className="text-xs" style={{ color: "#22c55e" }}>● Active now</p>
                  </div>
                </div>
                {/* messages */}
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-white"
                      style={{ background: "linear-gradient(135deg, #00c2ff, #0075ff)" }}>
                      Hey Alex 👋 Your post about brand identity was really good. I help startups with exactly this — would it be weird if I shared one quick idea for your page?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-3 py-2 text-xs"
                      style={{ background: "#1e2a3d", color: "#cbd5e1" }}>
                      Not weird at all! What did you have in mind? 👀
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-white"
                      style={{ background: "linear-gradient(135deg, #00c2ff, #0075ff)" }}>
                      I redesigned your homepage wireframe — takes 2 min to look at. Mind if I send it?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-3 py-2 text-xs"
                      style={{ background: "#1e2a3d", color: "#cbd5e1" }}>
                      Sure, send it over! 🙌
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "1px solid #1e2a3d" }}>
                  <div className="flex-1 rounded-xl px-3 py-2 text-xs" style={{ background: "#1e2a3d", color: "#475569" }}>
                    Message...
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                    style={{ background: "#00c2ff" }}>↑</div>
                </div>
                {/* label */}
                <div className="absolute -top-3 -right-3 px-2 py-1 rounded-lg text-xs font-black"
                  style={{ background: "#00c2ff", color: "white" }}>Script #1</div>
              </div>
            </Reveal>
          </div>

          {/* Stats row */}
          <Reveal delay={260}>
            <div className="grid grid-cols-3 gap-4 mt-10 pt-8" style={{ borderTop: "1px solid rgba(0,194,255,0.15)" }}>
              {[
                { n: "30", label: t.stats.scripts },
                { n: "6",  label: t.stats.categories },
                { n: "$5", label: t.stats.price },
              ].map(({ n, label }) => (
                <div key={String(label)} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black" style={{ background: "linear-gradient(135deg, #00e5ff, #00c2ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{n}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#475569" }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps (unique to this site)
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-5" style={{ background: "#0a0e1a" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{ color: "#00c2ff" }}>How it works</p>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-12 text-white">Ready to send in 60 seconds</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="relative p-6 rounded-2xl"
                  style={{ background: "#111827", border: "1px solid #1e2a3d" }}>
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <div className="text-xs font-black mb-2" style={{ color: "rgba(0,194,255,0.4)", letterSpacing: "0.1em" }}>{s.n}</div>
                  <h3 className="font-black text-white mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{s.body}</p>
                  {i < 2 && (
                    <div className="hidden sm:block absolute top-1/2 -right-3 text-xl font-black z-10" style={{ color: "#00c2ff", textShadow: "0 0 12px rgba(0,194,255,0.8)" }}>→</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FREE SAMPLES — Chat-style preview
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                🎁 {freeCount} free scripts
              </span>
              {freeCount === 3 && (
                <span className="text-xs" style={{ color: "#334155" }}>Share to unlock 2 more ↓</span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Try them right now</h2>
            <p className="text-sm mb-8" style={{ color: "#64748b" }}>Real scripts from the pack. Copy, fill, send.</p>
          </Reveal>

          <div className="space-y-3">
            {freeSamples.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <div className="rounded-2xl overflow-hidden" style={{ background: "#111827", border: "1px solid #1e2a3d" }}>
                  <button onClick={() => setOpenSample(openSample === i ? null : i)}
                    className="w-full p-4 text-left flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ background: "rgba(0,194,255,0.15)", color: "#38d9ff" }}>
                      {s.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white truncate">{s.title}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "#475569" }}>{s.category}</p>
                    </div>
                    <span style={{ color: "#00c2ff", flexShrink: 0, fontSize: 20 }}>{openSample === i ? "−" : "+"}</span>
                  </button>
                  {openSample === i && (
                    <div className="px-4 pb-4 pt-0">
                      {/* chat bubble style */}
                      <div className="rounded-xl p-4 mb-3" style={{ background: "#0d1117", border: "1px solid #1e2a3d" }}>
                        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "#94a3b8" }}>
                          {s.script}
                        </pre>
                      </div>
                      <button onClick={() => navigator.clipboard?.writeText(s.script)}
                        className="text-xs px-4 py-2 rounded-lg font-bold"
                        style={{ background: "rgba(0,194,255,0.12)", color: "#38d9ff", border: "1px solid rgba(0,194,255,0.2)" }}>
                        📋 Copy script
                      </button>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Share to unlock */}
          <Reveal delay={200}>
            <div className="mt-6 rounded-2xl p-5" style={{ background: "#111827", border: "1px solid rgba(0,194,255,0.15)" }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔗</div>
                <div className="flex-1">
                  <p className="font-black text-white text-sm mb-1">Give friends 5 scripts</p>
                  <p className="text-xs mb-3" style={{ color: "#64748b" }}>Share your link — they unlock 5 instead of 3.</p>
                  {myRef && (
                    <>
                      <div className="flex gap-2 mb-2">
                        <div className="flex-1 min-w-0 rounded-lg px-3 py-2 text-xs" style={{ background: "#0d1117", border: "1px solid #1e2a3d", color: "#475569" }}>
                          <span className="truncate block">{BASE_URL}/?ref={myRef}</span>
                        </div>
                        <button onClick={handleCopy} className="px-3 py-2 rounded-lg text-xs font-black flex-shrink-0"
                          style={{ background: copied ? "rgba(34,197,94,0.15)" : "rgba(0,194,255,0.15)", color: copied ? "#4ade80" : "#38d9ff", border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(0,194,255,0.3)"}` }}>
                          {copied ? "✓" : "Copy"}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <a href={waUrl} target="_blank" rel="noopener noreferrer"
                          className="flex-1 text-center text-xs py-2 rounded-lg font-bold"
                          style={{ background: "rgba(37,211,102,0.08)", color: "#22c55e", border: "1px solid rgba(37,211,102,0.15)" }}>
                          📱 WhatsApp
                        </a>
                        <a href={twUrl} target="_blank" rel="noopener noreferrer"
                          className="flex-1 text-center text-xs py-2 rounded-lg font-bold"
                          style={{ background: "rgba(30,42,61,0.5)", color: "#64748b", border: "1px solid #1e2a3d" }}>
                          𝕏 Twitter
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-4 text-center">
              <p className="text-sm mb-3" style={{ color: "#475569" }}>Want all {30 - freeCount} more? ↓</p>
              <button onClick={handleBuy} className="btn-blue px-8 py-3 font-black rounded-xl text-sm">
                ✉️ Get All 30 — $5 Only
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHAT'S INSIDE — Bento grid
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-5" style={{ background: "#0a0e1a" }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-2" style={{ color: "#00c2ff" }}>{t.inside.tag}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 text-white">{t.inside.h2}</h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATS.map((c, i) => (
              <Reveal key={c.label} delay={i * 60}>
                <div className="p-4 rounded-2xl flex flex-col gap-2 h-full"
                  style={{ background: i % 3 === 0 ? "rgba(0,194,255,0.1)" : "#111827", border: `1px solid ${i % 3 === 0 ? "rgba(0,194,255,0.2)" : "#1e2a3d"}` }}>
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-black text-sm text-white">{c.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#00c2ff" }}>{c.count} {t.inside.scripts}</p>
                  </div>
                  <p className="text-xs mt-auto" style={{ color: "#475569" }}>{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PAIN — Minimal list style
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-5">
        <div className="max-w-xl mx-auto">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-black mb-8 text-white">
              {t.pain.h2a}<br />
              <span style={{ color: "#334155" }}>{t.pain.h2b}</span>
            </h2>
          </Reveal>
          <div className="space-y-4">
            {t.pain.items.map((text, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="flex items-start gap-4">
                  <span className="text-xl flex-shrink-0 mt-0.5">{PAIN_ICONS[i]}</span>
                  <p className="text-base" style={{ color: "#64748b" }}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={320}>
            <div className="mt-10 p-5 rounded-2xl" style={{ background: "#111827", border: "1px solid rgba(0,194,255,0.15)" }}>
              <p className="font-black text-white mb-1">{t.solution.h2a} <span style={{ color: "#38d9ff" }}>{t.solution.h2b}</span></p>
              <ul className="space-y-2 mt-3">
                {t.solution.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#94a3b8" }}>
                    <span style={{ color: "#00c2ff" }}>→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS — Horizontal cards
      ══════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#0a0e1a" }}>
        <div className="max-w-3xl mx-auto px-5">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#00c2ff" }}>Results</p>
            <h2 className="text-2xl font-black text-white mb-8">Scripts that actually work</h2>
          </Reveal>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-5 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="flex-shrink-0 w-72 rounded-2xl p-5 snap-start"
              style={{ background: "#111827", border: "1px solid #1e2a3d" }}>
              <div className="flex gap-0.5 mb-3">
                {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#f59e0b", fontSize: 13 }}>{s}</span>)}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#94a3b8" }}>"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: "linear-gradient(135deg, #00c2ff, #0060e0)", color: "white" }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{t.flag} {t.name}</p>
                  <p className="text-xs" style={{ color: "#334155" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRICING — Minimal, bold
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-5">
        <div className="max-w-md mx-auto">
          <Reveal>
            <div className="rounded-3xl p-8 relative overflow-hidden"
              style={{ background: "#0e1420", border: "1px solid rgba(0,194,255,0.4)", boxShadow: "0 0 60px rgba(0,194,255,0.18), 0 0 120px rgba(0,117,255,0.1), inset 0 1px 0 rgba(0,194,255,0.15)" }}>
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{ background: "linear-gradient(90deg, #0060e0, #00c2ff, #00e5ff, #00c2ff, #0075ff)", boxShadow: "0 0 20px rgba(0,194,255,0.8)" }} />

              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#00c2ff" }}>{t.pricing.tag}</p>

              <div className="flex items-end gap-3 mb-2">
                <span className="text-7xl font-black text-white leading-none">{t.pricing.price}</span>
                <div className="mb-2">
                  <p className="text-sm line-through" style={{ color: "#334155" }}>{t.pricing.was}</p>
                  <p className="text-xs" style={{ color: "#22c55e" }}>↓ {t.pricing.note}</p>
                </div>
              </div>
              <p className="text-sm mb-6" style={{ color: "#475569" }}>{t.pricing.sub}</p>

              {/* spots bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1" style={{ color: "#475569" }}>
                  <span>🔥 {t.pricing.badge}</span>
                  <span>60%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#1e2a3d" }}>
                  <div className="h-full rounded-full" style={{ width: "60%", background: "linear-gradient(90deg, #0060e0, #00c2ff, #00e5ff)", boxShadow: "0 0 10px rgba(0,194,255,0.6)" }} />
                </div>
              </div>

              <ul className="space-y-2.5 mb-8">
                {t.pricing.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: "#94a3b8" }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: "rgba(0,194,255,0.15)", color: "#38d9ff" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={handleBuy} className="w-full py-4 font-black text-base rounded-xl btn-blue"
                style={{ animation: "glowPulse 2.5s ease-in-out infinite" }}>
                {t.pricing.cta}
              </button>
              <p className="text-xs text-center mt-3" style={{ color: "#1e2a3d" }}>{t.pricing.secure}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-5" style={{ background: "#0a0e1a" }}>
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-black text-white mb-8">{t.faq.h2}</h2>
          </Reveal>
          <div className="space-y-2">
            {t.faq.items.map(({ q, a }, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="rounded-xl overflow-hidden" style={{ background: "#111827", border: "1px solid #1e2a3d" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left gap-4">
                    <span className="font-semibold text-sm text-white">{q}</span>
                    <span style={{ color: "#00c2ff", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "#64748b" }}>{a}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 px-5 text-center">
        <div className="max-w-lg mx-auto">
          <Reveal>
            <p className="text-5xl mb-6">💬</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
              {t.cta2.h2a}<br />
              <span style={{ background: "linear-gradient(135deg, #00e5ff 0%, #00c2ff 50%, #0075ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 20px rgba(0,194,255,0.5))" }}>
                {t.cta2.h2b}
              </span>
            </h2>
            <p className="mb-8" style={{ color: "#475569" }}>{t.cta2.sub}</p>
            <button onClick={handleBuy} className="btn-blue w-full max-w-xs py-4 text-lg font-black rounded-xl mx-auto block">
              {t.cta2.btn}
            </button>
            <p className="text-xs mt-4" style={{ color: "#1e2a3d" }}>{t.cta2.note}</p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="py-8 px-5" style={{ borderTop: "1px solid #1e2a3d" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-black"
              style={{ background: "linear-gradient(135deg, #00c2ff, #0060e0)" }}>C</div>
            <span className="font-bold text-sm text-white">ColdDM Scripts</span>
          </div>
          <p className="text-xs" style={{ color: "#1e2a3d" }}>{t.footer.copy}</p>
        </div>
      </footer>

      <div style={{ height: 80 }} />
    </main>
  );
}
