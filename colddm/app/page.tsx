"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang, LanguageSelector } from "@/components/LanguageContext";
import { SCRIPTS } from "@/lib/scripts";

const BASE_URL = "https://colddm.vercel.app";

function useInView(threshold = 0.15) {
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

function useCountUp(to: number, visible: boolean, duration = 1400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, to, duration]);
  return count;
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const CATEGORIES_META = [
  { icon: "📱", key: "Instagram DMs — Client Outreach",   count: 6,  color: "blue"  as const, examples: ["Noticed Your Work opener", "Social Proof DM", "Free Value First"] },
  { icon: "📧", key: "Cold Emails — Freelance Pitch",      count: 6,  color: "slate" as const, examples: ["Quick Idea for Business", "I Found 3 Things", "2-Minute Read"] },
  { icon: "🔄", key: "Follow-Up Messages",                 count: 5,  color: "blue"  as const, examples: ["No-Reply Follow-Up", "Value Add Follow-Up", "Last Message Breakup"] },
  { icon: "🤝", key: "Collab & Partnership DMs",           count: 5,  color: "slate" as const, examples: ["Brand Collab Outreach", "Podcast Guest Request", "Cross-Promo Pitch"] },
  { icon: "💬", key: "Objection Replies",                  count: 4,  color: "blue"  as const, examples: ["Can't Afford It reply", "I'll Think About It reply", "Already Have Someone reply"] },
  { icon: "📋", key: "Proposal Openers",                   count: 4,  color: "slate" as const, examples: ["Discovery Call Closer", "Here's What I'd Do", "Why Me Pitch"] },
];

const TESTIMONIALS = [
  { name: "Carlo M.",   country: "🇵🇭 Philippines", stars: 5, text: "Sent 3 of these scripts and landed a $400 web design client in the same week." },
  { name: "Siti R.",    country: "🇮🇩 Indonesia",  stars: 5, text: "The follow-up scripts are insane. I recovered 2 dead leads with script #15." },
  { name: "Thanh N.",   country: "🇻🇳 Vietnam",    stars: 5, text: "I used to spend 40 minutes writing one cold email. Now it's 60 seconds." },
  { name: "James K.",   country: "🇺🇬 Uganda",     stars: 5, text: "The objection reply scripts alone are worth way more than $5." },
];

export default function HomePage() {
  const { t } = useLang();
  const [openFaq, setOpenFaq]         = useState<number | null>(null);
  const [showSticky, setShowSticky]   = useState(false);
  const [openSample, setOpenSample]   = useState<number | null>(null);
  const [freeCount, setFreeCount]     = useState(3);
  const [myRef, setMyRef]             = useState("");
  const [incomingRef, setIncomingRef] = useState("");
  const [copied, setCopied]           = useState(false);
  const [refDismissed, setRefDismissed] = useState(false);

  useEffect(() => {
    const fn = () => setShowSticky(window.scrollY > 600);
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

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`💬 Get 5 free cold DM scripts here (I unlocked bonus access for you): ${shareUrl}`)}`;
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`These cold DM scripts actually get replies 💬 Get 5 free ones: ${shareUrl}`)}`;

  const freeSamples = SCRIPTS.slice(0, freeCount);

  const handleBuy = useCallback(() => {
    const subject = encodeURIComponent("ColdDM Scripts Purchase — $5");
    const body = encodeURIComponent(
      "Hi Mike,\n\nI want to buy ColdDM Scripts (30 Freelancer Scripts) for $5.\n\nPlease send me your payment details and the access code after payment.\n\nThank you!"
    );
    window.open(`mailto:mikeronny18@gmail.com?subject=${subject}&body=${body}`);
  }, []);

  const statsRef = useInView();
  const count30  = useCountUp(30,  statsRef.visible);
  const count6   = useCountUp(6,   statsRef.visible);

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#0d1117" }}>

      {/* ── REFERRAL BANNER ───────────────────────────────── */}
      {incomingRef && !refDismissed && (
        <div className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between gap-3 px-5 py-2.5"
          style={{ background: "rgba(5,15,30,0.97)", borderBottom: "1px solid rgba(59,130,246,0.35)", backdropFilter: "blur(12px)" }}>
          <p className="text-sm font-semibold flex items-center gap-2" style={{ color: "#93c5fd" }}>
            <span>🎁</span>
            <span>Bonus unlocked! <strong style={{ color: "#60a5fa" }}>5 free scripts</strong> instead of 3 — scroll down ↓</span>
          </p>
          <button onClick={() => setRefDismissed(true)} style={{ color: "#3b82f6" }}>✕</button>
        </div>
      )}

      {/* ── STICKY BAR ────────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        transform: showSticky ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s ease",
        background: "rgba(10,14,22,0.96)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(59,130,246,0.2)",
        padding: "12px 20px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ flex: 1 }}>
          <p className="text-sm font-black text-white">ColdDM Scripts</p>
          <p className="text-xs" style={{ color: "#3b82f6" }}>30 Scripts · $5 only</p>
        </div>
        <button onClick={handleBuy} className="btn-blue px-5 py-3 text-sm font-black rounded-xl">
          ✉️ Get for $5
        </button>
      </div>

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-3 flex items-center justify-between"
        style={{ background: "rgba(10,14,22,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(30,42,61,0.6)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>C</div>
          <span className="font-bold text-white text-sm tracking-tight">ColdDM Scripts</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button onClick={handleBuy} className="btn-blue text-xs font-bold px-4 py-2 rounded-lg">
            {t.nav.buy}
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative pb-20 px-5 text-center bg-grid overflow-hidden"
        style={{ paddingTop: incomingRef && !refDismissed ? "8rem" : "7rem" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }} />
        <div className="absolute top-20 right-0 w-[250px] h-[250px] rounded-full opacity-6 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #60a5fa 0%, transparent 70%)" }} />

        <div className="relative max-w-3xl mx-auto">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {t.hero.badge}
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }}>
              ⬇️ <span>47 freelancers downloaded this week</span>
            </div>
          </FadeUp>

          <FadeUp delay={120}>
            <p className="text-sm font-medium mb-3" style={{ color: "#64748b" }}>{t.hero.eyebrow}</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight text-white">
              {t.hero.h1a}{" "}
              <span style={{ background: "linear-gradient(135deg, #3b82f6, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t.hero.h1b}
              </span>
              <br />{t.hero.h1c}
            </h1>
            <p className="text-lg font-medium mb-2" style={{ color: "#cbd5e1" }}>{t.hero.sub}</p>
            <p className="text-sm mb-8" style={{ color: "#64748b" }}>{t.hero.cats}</p>
          </FadeUp>

          <FadeUp delay={200}>
            <div className="flex flex-col items-center gap-3">
              <button onClick={handleBuy}
                className="w-full max-w-sm py-4 px-8 text-lg font-black rounded-xl btn-blue"
                style={{ animation: "glowPulse 2.5s ease-in-out infinite" }}>
                {t.hero.cta}
              </button>
              <p className="text-xs" style={{ color: "#475569" }}>{t.hero.note}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section ref={statsRef.ref} className="py-8 px-5"
        style={{ background: "rgba(16,21,35,0.8)", borderTop: "1px solid #1e2a3d", borderBottom: "1px solid #1e2a3d" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { num: `${count30}+`, label: t.stats.scripts },
            { num: count6,        label: t.stats.categories },
            { num: "$5",          label: t.stats.price },
          ].map(({ num, label }) => (
            <div key={String(label)}>
              <div className="text-2xl sm:text-3xl font-black mb-0.5"
                style={{ background: "linear-gradient(135deg, #3b82f6, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {num}
              </div>
              <div className="text-xs font-medium" style={{ color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAIN POINTS ───────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#3b82f6" }}>{t.pain.tag}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 leading-tight text-white">
              {t.pain.h2a}<br /><span style={{ color: "#64748b" }}>{t.pain.h2b}</span>
            </h2>
          </FadeUp>
          <div className="space-y-3">
            {t.pain.items.map((text, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
                  <span className="text-xl mt-0.5">{["😶","⏰","😤","🤷"][i]}</span>
                  <p className="text-base font-medium" style={{ color: "#cbd5e1" }}>{text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE SAMPLES ──────────────────────────────────── */}
      <section className="py-16 px-5" style={{ background: "rgba(16,21,35,0.6)" }}>
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }}>
              🎁 {freeCount} Free Sample Scripts — No purchase needed
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">Try Before You Buy</h2>
            <p className="text-sm mb-8" style={{ color: "#64748b" }}>
              {freeCount === 5
                ? "You unlocked 5 real scripts — copy, fill in the brackets, send."
                : "Here are 3 real scripts from the pack. Copy, fill the brackets, send — free."}
            </p>
          </FadeUp>
          <div className="space-y-3">
            {freeSamples.map((s, i) => (
              <FadeUp key={s.id} delay={i * 100}>
                <div className="rounded-xl overflow-hidden"
                  style={{ background: "rgba(16,21,35,0.9)", border: "1px solid #1e2a3d" }}>
                  <button onClick={() => setOpenSample(openSample === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>#{s.id}</span>
                      <div>
                        <p className="font-bold text-sm text-white">{s.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{s.category}</p>
                      </div>
                    </div>
                    <span style={{ color: "#3b82f6", flexShrink: 0 }}>{openSample === i ? "−" : "+"}</span>
                  </button>
                  {openSample === i && (
                    <div className="px-4 pb-4">
                      <pre className="text-sm leading-relaxed mb-3 whitespace-pre-wrap font-sans"
                        style={{ color: "#94a3b8" }}>{s.script}</pre>
                      <button
                        onClick={() => navigator.clipboard?.writeText(s.script)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                        style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
                        📋 Copy script
                      </button>
                    </div>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Share panel */}
          <FadeUp delay={280}>
            <div className="mt-6 rounded-xl p-4"
              style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)" }}>
              <p className="text-sm font-black text-white mb-1">🔗 Give Friends 5 Free Scripts</p>
              <p className="text-xs mb-3" style={{ color: "#64748b" }}>
                Share your link — friends unlock 5 scripts instead of 3.
              </p>
              {myRef && (
                <>
                  <div className="flex gap-2 mb-2">
                    <div className="flex-1 min-w-0 px-3 py-2 rounded-lg text-xs overflow-hidden"
                      style={{ background: "rgba(10,14,22,0.9)", border: "1px solid #1e2a3d", color: "#64748b" }}>
                      <span className="truncate block">{BASE_URL}/?ref={myRef}</span>
                    </div>
                    <button onClick={handleCopy}
                      className="px-3 py-2 rounded-lg text-xs font-black flex-shrink-0 transition-all"
                      style={{
                        background: copied ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)",
                        color: copied ? "#4ade80" : "#60a5fa",
                        border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.25)"}`,
                      }}>
                      {copied ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <a href={waUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center text-xs py-2 rounded-lg font-bold"
                      style={{ background: "rgba(37,211,102,0.1)", color: "#22c55e", border: "1px solid rgba(37,211,102,0.2)" }}>
                      📱 WhatsApp
                    </a>
                    <a href={twUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center text-xs py-2 rounded-lg font-bold"
                      style={{ background: "rgba(30,42,61,0.6)", color: "#94a3b8", border: "1px solid #1e2a3d" }}>
                      𝕏 Twitter
                    </a>
                  </div>
                </>
              )}
            </div>
          </FadeUp>

          <FadeUp delay={340}>
            <div className="mt-4 p-4 rounded-xl text-center"
              style={{ background: "rgba(59,130,246,0.05)", border: "1px dashed rgba(59,130,246,0.2)" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "#cbd5e1" }}>
                Want all 30? The other {30 - freeCount} scripts are waiting. 👇
              </p>
              <button onClick={handleBuy} className="btn-blue px-6 py-3 text-sm font-black rounded-xl">
                ✉️ Get All 30 — $5 Only
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SOLUTION ──────────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#3b82f6" }}>{t.solution.tag}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 leading-tight text-white">
              {t.solution.h2a}{" "}
              <span style={{ background: "linear-gradient(135deg, #3b82f6, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t.solution.h2b}
              </span>
            </h2>
          </FadeUp>
          <div className="space-y-3">
            {t.solution.items.map((text, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
                  <span className="text-xl mt-0.5">✅</span>
                  <p className="text-base font-medium" style={{ color: "#cbd5e1" }}>{text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ─────────────────────────────────── */}
      <section className="py-16 px-5" style={{ background: "rgba(16,21,35,0.6)" }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#3b82f6" }}>{t.inside.tag}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 text-white">{t.inside.h2}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES_META.map(({ icon, key, count, color, examples }, i) => (
              <FadeUp key={key} delay={i * 70}>
                <div className="p-5 rounded-2xl h-full"
                  style={{
                    background: color === "blue" ? "rgba(59,130,246,0.06)" : "rgba(22,27,39,0.9)",
                    border: `1px solid ${color === "blue" ? "rgba(59,130,246,0.18)" : "#1e2a3d"}`,
                  }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <h3 className="font-bold text-sm text-white">{key}</h3>
                      <p className="text-xs" style={{ color: color === "blue" ? "#60a5fa" : "#64748b" }}>
                        {count} {t.inside.scripts}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {examples.map((ex) => (
                      <li key={ex} className="text-xs flex items-center gap-1.5" style={{ color: "#64748b" }}>
                        <span style={{ color: color === "blue" ? "#3b82f6" : "#475569" }}>→</span>{ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARE ───────────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 text-white">{t.compare.h2}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#f87171" }}>{t.compare.without}</p>
                <ul className="space-y-2 text-sm" style={{ color: "#94a3b8" }}>
                  {t.compare.left.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-2xl" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#60a5fa" }}>{t.compare.with}</p>
                <ul className="space-y-2 text-sm" style={{ color: "#cbd5e1" }}>
                  {t.compare.right.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="py-16 px-5" style={{ background: "rgba(16,21,35,0.6)" }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#3b82f6" }}>Real freelancers</p>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 text-white">Scripts that get replies</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div className="p-5 rounded-2xl h-full"
                  style={{ background: "rgba(16,21,35,0.9)", border: "1px solid #1e2a3d" }}>
                  <div className="flex items-center gap-1 mb-3">
                    {"★★★★★".split("").map((s, j) => (
                      <span key={j} style={{ color: "#f59e0b", fontSize: 14 }}>{s}</span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#cbd5e1" }}>"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white" }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <p className="text-xs" style={{ color: "#475569" }}>{t.country}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section className="py-20 px-5">
        <div className="max-w-sm mx-auto">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#3b82f6" }}>{t.pricing.tag}</p>
            <div className="rounded-3xl p-8 text-center relative overflow-hidden"
              style={{ background: "#161b27", border: "1px solid rgba(59,130,246,0.3)", boxShadow: "0 0 60px rgba(59,130,246,0.1)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl rounded-full"
                style={{ background: "radial-gradient(#3b82f6, transparent)" }} />
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                  style={{ background: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.25)" }}>
                  {t.pricing.badge}
                </div>

                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: "#475569" }}>
                    <span>🔥 30 of 50 early spots claimed</span>
                    <span>60%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(30,42,61,0.8)" }}>
                    <div className="h-full rounded-full"
                      style={{ width: "60%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)", transition: "width 1.5s ease" }} />
                  </div>
                </div>

                <div className="mb-1"><span className="text-lg line-through" style={{ color: "#334155" }}>{t.pricing.was}</span></div>
                <div className="text-7xl font-black mb-1"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {t.pricing.price}
                </div>
                <p className="text-sm mb-1" style={{ color: "#64748b" }}>{t.pricing.sub}</p>
                <p className="text-xs mb-8" style={{ color: "#334155" }}>{t.pricing.note}</p>

                <ul className="text-left space-y-2 mb-8">
                  {t.pricing.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#cbd5e1" }}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <button onClick={handleBuy}
                  className="w-full py-4 text-base font-black rounded-xl btn-blue"
                  style={{ animation: "glowPulse 2.5s ease-in-out infinite" }}>
                  {t.pricing.cta}
                </button>
                <p className="text-xs mt-3" style={{ color: "#1e2a3d" }}>{t.pricing.secure}</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-16 px-5" style={{ background: "rgba(16,21,35,0.6)" }}>
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl font-black text-center mb-10 text-white">{t.faq.h2}</h2>
          </FadeUp>
          <div className="space-y-3">
            {t.faq.items.map(({ q, a }, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="rounded-xl overflow-hidden"
                  style={{ background: "#161b27", border: "1px solid #1e2a3d" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-semibold text-sm text-white pr-4">{q}</span>
                    <span style={{ color: "#3b82f6", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{a}</div>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="py-20 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />
        <div className="relative max-w-lg mx-auto">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight text-white">
              {t.cta2.h2a}{" "}
              <span style={{ background: "linear-gradient(135deg, #3b82f6, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t.cta2.h2b}
              </span>
            </h2>
            <p className="text-base mb-8" style={{ color: "#64748b" }}>{t.cta2.sub}</p>
            <button onClick={handleBuy}
              className="w-full max-w-xs py-4 text-lg font-black rounded-xl btn-blue mx-auto block">
              {t.cta2.btn}
            </button>
            <p className="text-xs mt-4" style={{ color: "#1e2a3d" }}>{t.cta2.note}</p>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="py-8 px-5 text-center" style={{ borderTop: "1px solid #1e2a3d" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>C</div>
          <span className="font-bold text-sm text-white">ColdDM Scripts</span>
        </div>
        <p className="text-xs" style={{ color: "#1e2a3d" }}>{t.footer.copy}</p>
      </footer>

      <div style={{ height: 80 }} />
    </main>
  );
}
