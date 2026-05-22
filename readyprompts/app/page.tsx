"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang, LanguageSelector } from "@/components/LanguageContext";
import { PROMPTS } from "@/lib/prompts";

// ─── Intersection Observer hook ───────────────────────────────
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

// ─── Count-up hook ────────────────────────────────────────────
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

// ─── Fade-up wrapper ──────────────────────────────────────────
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

// ─── Data ─────────────────────────────────────────────────────
const CATEGORIES_META = [
  { icon: "🎬", key: "TikTok & Short Video",  count: 20, color: "orange" as const, examples: ["Viral hook generator", "POV story scripts", "Trending caption maker"] },
  { icon: "📸", key: "Instagram Content",      count: 18, color: "blue"   as const, examples: ["Carousel slide writer", "Reel script builder", "Bio optimizer"] },
  { icon: "💰", key: "Marketing & Sales",      count: 20, color: "orange" as const, examples: ["AIDA copywriter", "Ad headline maker", "Sales page builder"] },
  { icon: "🏢", key: "Business & Money",       count: 18, color: "blue"   as const, examples: ["Business idea generator", "Freelance pitch writer", "Income stream finder"] },
  { icon: "📧", key: "Email Marketing",        count: 12, color: "orange" as const, examples: ["Welcome sequence writer", "Re-engagement campaign", "Subject line generator"] },
  { icon: "🌟", key: "Personal Brand",         count: 17, color: "blue"   as const, examples: ["Origin story creator", "LinkedIn authority posts", "Viral thread writer"] },
];

const FREE_SAMPLES = PROMPTS.slice(0, 3);

const TESTIMONIALS = [
  { name: "Aisha R.",    country: "🇮🇩 Indonesia", stars: 5, text: "Used the TikTok hooks — my next video got 3x more views. Worth every cent." },
  { name: "Kevin T.",   country: "🇵🇭 Philippines", stars: 5, text: "The cold email prompts helped me land my first freelance client in a week." },
  { name: "Nattaya S.", country: "🇹🇭 Thailand",    stars: 5, text: "I saved at least 2 hours per week on content. $2 is a joke for this value." },
  { name: "Yuna K.",    country: "🇯🇵 Japan",        stars: 5, text: "The marketing prompts are genuinely different from what I find for free online." },
  { name: "Ravi M.",    country: "🇮🇳 India",        stars: 5, text: "ChatGPT results were always mid. These prompts changed everything." },
];

const AI_TOOLS = [
  { name: "ChatGPT",    emoji: "🟢" },
  { name: "Claude",     emoji: "🟠" },
  { name: "Gemini",     emoji: "🔵" },
  { name: "Grok",       emoji: "⚫" },
  { name: "Copilot",    emoji: "🟣" },
  { name: "Llama",      emoji: "🦙" },
];

// ─── Main Page ────────────────────────────────────────────────
export default function HomePage() {
  const { t } = useLang();
  const [openFaq, setOpenFaq]         = useState<number | null>(null);
  const [showSticky, setShowSticky]   = useState(false);
  const [openSample, setOpenSample]   = useState<number | null>(null);

  // sticky bar on scroll
  useEffect(() => {
    const fn = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleBuy = useCallback(() => {
    const subject = encodeURIComponent("ReadyPrompts Purchase — $2");
    const body = encodeURIComponent(
      "Hi Mike,\n\nI want to buy ReadyPrompts (105 AI Prompt Kit) for $2.\n\nPlease send me your payment details and the access code after payment.\n\nThank you!"
    );
    window.open(`mailto:mikeronny18@gmail.com?subject=${subject}&body=${body}`);
  }, []);

  // stats section
  const statsRef = useInView();
  const count105 = useCountUp(105, statsRef.visible);
  const count6   = useCountUp(6,   statsRef.visible);
  const count47  = useCountUp(47,  statsRef.visible);

  return (
    <main className="min-h-screen bg-cinema-bg overflow-x-hidden">

      {/* ── STICKY BOTTOM BAR ─────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        transform: showSticky ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s ease",
        background: "rgba(5,8,15,0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(249,115,22,0.25)",
        padding: "12px 20px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ flex: 1 }}>
          <p className="text-sm font-black text-white">ReadyPrompts</p>
          <p className="text-xs" style={{ color: "#f97316" }}>105 AI Prompts · $2 only</p>
        </div>
        <button onClick={handleBuy} className="btn-orange px-5 py-3 text-sm font-black rounded-xl">
          ✉️ Get for $2
        </button>
      </div>

      {/* ── NAV ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-3 flex items-center justify-between"
        style={{ background: "rgba(5,8,15,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(30,41,59,0.5)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
          <span className="font-bold text-white text-sm tracking-tight">ReadyPrompts</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button onClick={handleBuy}
            className="btn-orange text-xs font-bold px-4 py-2 rounded-lg">
            {t.nav.buy}
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-5 text-center bg-grid overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }} />
        <div className="absolute top-20 right-0 w-[300px] h-[300px] rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }} />

        <div className="relative max-w-3xl mx-auto">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "#fb923c" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              {t.hero.badge}
            </div>
          </FadeUp>

          {/* social proof */}
          <FadeUp delay={80}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }}>
              ⬇️ <span>47 people downloaded this week</span>
            </div>
          </FadeUp>

          <FadeUp delay={120}>
            <p className="text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>{t.hero.eyebrow}</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
              {t.hero.h1a}{" "}
              <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
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
                className="w-full max-w-sm py-4 px-8 text-lg font-black rounded-xl btn-orange"
                style={{ animation: "glowPulse 2.5s ease-in-out infinite" }}>
                {t.hero.cta}
              </button>
              <p className="text-xs" style={{ color: "#475569" }}>{t.hero.note}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────── */}
      <section ref={statsRef.ref} className="py-8 px-5"
        style={{ background: "rgba(10,15,26,0.8)", borderTop: "1px solid rgba(30,41,59,0.5)", borderBottom: "1px solid rgba(30,41,59,0.5)" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { num: `${count105}+`, label: t.stats.prompts },
            { num: count6,          label: t.stats.categories },
            { num: `$${count47 === 47 ? 2 : "2"}`, label: t.stats.price },
          ].map(({ num, label }) => (
            <div key={String(label)}>
              <div className="text-2xl sm:text-3xl font-black"
                style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {num}
              </div>
              <div className="text-xs font-medium mt-0.5" style={{ color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAIN POINTS ───────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>{t.pain.tag}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 leading-tight">
              {t.pain.h2a}<br /><span style={{ color: "#64748b" }}>{t.pain.h2b}</span>
            </h2>
          </FadeUp>
          <div className="space-y-3">
            {t.pain.items.map((text, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
                  <span className="text-xl mt-0.5">{["😤","⏰","📉","🤷"][i]}</span>
                  <p className="text-base font-medium" style={{ color: "#cbd5e1" }}>{text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE SAMPLE PROMPTS ───────────────────────────── */}
      <section className="py-16 px-5" style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }}>
              🎁 3 Free Sample Prompts — No purchase needed
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Try Before You Buy</h2>
            <p className="text-sm mb-8" style={{ color: "#64748b" }}>
              Here are 3 real prompts from the kit. Copy, paste, use now — for free.
            </p>
          </FadeUp>
          <div className="space-y-3">
            {FREE_SAMPLES.map((p, i) => (
              <FadeUp key={p.id} delay={i * 100}>
                <div className="rounded-xl overflow-hidden"
                  style={{ background: "rgba(15,20,30,0.9)", border: "1px solid rgba(249,115,22,0.15)" }}>
                  <button onClick={() => setOpenSample(openSample === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}>#{p.id}</span>
                      <span className="font-bold text-sm text-white">{p.title}</span>
                    </div>
                    <span style={{ color: "#f97316", flexShrink: 0 }}>{openSample === i ? "−" : "+"}</span>
                  </button>
                  {openSample === i && (
                    <div className="px-4 pb-4">
                      <p className="text-sm leading-relaxed mb-3" style={{ color: "#94a3b8" }}>{p.prompt}</p>
                      <button
                        onClick={() => navigator.clipboard?.writeText(p.prompt)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                        style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}>
                        📋 Copy prompt
                      </button>
                    </div>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={300}>
            <div className="mt-8 p-4 rounded-xl text-center"
              style={{ background: "rgba(249,115,22,0.06)", border: "1px dashed rgba(249,115,22,0.25)" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "#cbd5e1" }}>
                Want all 105? The other 102 are waiting. 👇
              </p>
              <button onClick={handleBuy}
                className="btn-orange px-6 py-3 text-sm font-black rounded-xl">
                ✉️ Get All 105 — $2 Only
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
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 leading-tight">
              {t.solution.h2a}{" "}
              <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t.solution.h2b}
              </span>
            </h2>
          </FadeUp>
          <div className="space-y-3">
            {t.solution.items.map((text, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.12)" }}>
                  <span className="text-xl mt-0.5">✅</span>
                  <p className="text-base font-medium" style={{ color: "#cbd5e1" }}>{text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ─────────────────────────────────── */}
      <section className="py-16 px-5" style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>{t.inside.tag}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">{t.inside.h2}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES_META.map(({ icon, key, count, color, examples }, i) => (
              <FadeUp key={key} delay={i * 70}>
                <div className="p-5 rounded-2xl h-full"
                  style={{
                    background: color === "orange" ? "rgba(249,115,22,0.06)" : "rgba(59,130,246,0.06)",
                    border: `1px solid ${color === "orange" ? "rgba(249,115,22,0.18)" : "rgba(59,130,246,0.18)"}`,
                  }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <h3 className="font-bold text-sm text-white">{key}</h3>
                      <p className="text-xs" style={{ color: color === "orange" ? "#f97316" : "#60a5fa" }}>
                        {count} {t.inside.prompts}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {examples.map((ex) => (
                      <li key={ex} className="text-xs flex items-center gap-1.5" style={{ color: "#94a3b8" }}>
                        <span style={{ color: color === "orange" ? "#f97316" : "#60a5fa" }}>→</span>{ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKS WITH ────────────────────────────────────── */}
      <section className="py-12 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "#64748b" }}>
              Works with every AI model
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {AI_TOOLS.map(({ name, emoji }) => (
                <div key={name} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ background: "rgba(15,20,30,0.8)", border: "1px solid rgba(30,41,59,0.8)", color: "#94a3b8" }}>
                  <span>{emoji}</span>{name}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── COMPARE ───────────────────────────────────────── */}
      <section className="py-16 px-5" style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">{t.compare.h2}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#f87171" }}>{t.compare.without}</p>
                <ul className="space-y-2 text-sm" style={{ color: "#94a3b8" }}>
                  {t.compare.left.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-2xl" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.18)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#fb923c" }}>{t.compare.with}</p>
                <ul className="space-y-2 text-sm" style={{ color: "#cbd5e1" }}>
                  {t.compare.right.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>Real buyers</p>
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">What people are saying</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div className="p-5 rounded-2xl h-full"
                  style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(30,41,59,0.6)" }}>
                  <div className="flex items-center gap-1 mb-3">
                    {"★★★★★".split("").map((s, j) => (
                      <span key={j} style={{ color: "#f59e0b", fontSize: 14 }}>{s}</span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#cbd5e1" }}>"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)", color: "white" }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>{t.country}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section className="py-20 px-5" style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="max-w-sm mx-auto">
          <FadeUp>
            <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>{t.pricing.tag}</p>
            <div className="rounded-3xl p-8 text-center relative overflow-hidden"
              style={{ background: "rgba(10,15,26,0.95)", border: "1px solid rgba(249,115,22,0.3)", boxShadow: "0 0 60px rgba(249,115,22,0.12)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl rounded-full"
                style={{ background: "radial-gradient(#f97316, transparent)" }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 blur-2xl rounded-full"
                style={{ background: "radial-gradient(#3b82f6, transparent)" }} />
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                  style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.25)" }}>
                  {t.pricing.badge}
                </div>

                {/* progress bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: "#64748b" }}>
                    <span>🔥 47 of 100 early spots claimed</span>
                    <span>47%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(30,41,59,0.8)" }}>
                    <div className="h-full rounded-full"
                      style={{ width: "47%", background: "linear-gradient(90deg, #f97316, #fb923c)", transition: "width 1.5s ease" }} />
                  </div>
                </div>

                <div className="mb-1"><span className="text-lg line-through" style={{ color: "#475569" }}>{t.pricing.was}</span></div>
                <div className="text-7xl font-black mb-1"
                  style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {t.pricing.price}
                </div>
                <p className="text-sm mb-1" style={{ color: "#64748b" }}>{t.pricing.sub}</p>
                <p className="text-xs mb-8" style={{ color: "#475569" }}>{t.pricing.note}</p>

                <ul className="text-left space-y-2 mb-8">
                  {t.pricing.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#cbd5e1" }}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "rgba(249,115,22,0.2)", color: "#f97316" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <button onClick={handleBuy}
                  className="w-full py-4 text-base font-black rounded-xl btn-orange"
                  style={{ animation: "glowPulse 2.5s ease-in-out infinite" }}>
                  {t.pricing.cta}
                </button>
                <p className="text-xs mt-3" style={{ color: "#334155" }}>{t.pricing.secure}</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="text-2xl font-black text-center mb-10">{t.faq.h2}</h2>
          </FadeUp>
          <div className="space-y-3">
            {t.faq.items.map(({ q, a }, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div className="rounded-xl overflow-hidden"
                  style={{ background: "rgba(15,20,30,0.8)", border: "1px solid rgba(30,41,59,0.6)" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-semibold text-sm text-white pr-4">{q}</span>
                    <span style={{ color: "#f97316", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
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
      <section className="py-20 px-5 text-center relative overflow-hidden"
        style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />
        <div className="relative max-w-lg mx-auto">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
              {t.cta2.h2a}{" "}
              <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t.cta2.h2b}
              </span>
            </h2>
            <p className="text-base mb-8" style={{ color: "#64748b" }}>{t.cta2.sub}</p>
            <button onClick={handleBuy}
              className="w-full max-w-xs py-4 text-lg font-black rounded-xl btn-orange mx-auto block">
              {t.cta2.btn}
            </button>
            <p className="text-xs mt-4" style={{ color: "#334155" }}>{t.cta2.note}</p>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="py-8 px-5 text-center" style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
          <span className="font-bold text-sm text-white">ReadyPrompts</span>
        </div>
        <p className="text-xs" style={{ color: "#334155" }}>{t.footer.copy}</p>
      </footer>

      {/* bottom padding for sticky bar */}
      <div style={{ height: 80 }} />
    </main>
  );
}
