"use client";

import { useState } from "react";
import { useLang, LanguageSelector } from "@/components/LanguageContext";

const CATEGORIES_META = [
  { icon: "🎬", key: "TikTok & Short Video", count: 20, color: "orange" as const, examples: ["Viral hook generator", "POV story scripts", "Trending caption maker"] },
  { icon: "📸", key: "Instagram Content", count: 18, color: "blue" as const, examples: ["Carousel slide writer", "Reel script builder", "Bio optimizer"] },
  { icon: "💰", key: "Marketing & Sales", count: 20, color: "orange" as const, examples: ["AIDA copywriter", "Ad headline maker", "Sales page builder"] },
  { icon: "🏢", key: "Business & Money", count: 18, color: "blue" as const, examples: ["Business idea generator", "Freelance pitch writer", "Income stream finder"] },
  { icon: "📧", key: "Email Marketing", count: 12, color: "orange" as const, examples: ["Welcome sequence writer", "Re-engagement campaign", "Subject line generator"] },
  { icon: "🌟", key: "Personal Brand", count: 17, color: "blue" as const, examples: ["Origin story creator", "LinkedIn authority posts", "Viral thread writer"] },
];

export default function HomePage() {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create", { method: "POST" });
      const data = await res.json();
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        alert("Payment setup failed. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const BuyButton = ({ className = "", size = "lg" }: { className?: string; size?: "sm" | "lg" }) => (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={`btn-orange ${size === "lg" ? "py-4 text-base" : "py-2 text-sm"} px-6 font-black rounded-xl ${className}`}>
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t.pricing.cta.includes("Buy") ? "Redirecting..." : "..."}
        </span>
      ) : size === "sm" ? t.nav.buy : t.hero.cta}
    </button>
  );

  return (
    <main className="min-h-screen bg-cinema-bg overflow-x-hidden">
      {/* ─── NAV ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-5 py-3 flex items-center justify-between"
        style={{ background: "rgba(5,8,15,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(30,41,59,0.5)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
          <span className="font-bold text-white tracking-tight text-sm">ReadyPrompts</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <BuyButton size="sm" />
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-20 px-5 text-center bg-grid overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }} />
        <div className="absolute top-20 right-0 w-[300px] h-[300px] rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }} />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "#fb923c" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            {t.hero.badge}
          </div>

          <p className="text-sm font-medium mb-3" style={{ color: "#94a3b8" }}>{t.hero.eyebrow}</p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            {t.hero.h1a}{" "}
            <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {t.hero.h1b}
            </span>
            <br />
            {t.hero.h1c}
          </h1>

          <p className="text-lg sm:text-xl font-medium mb-2" style={{ color: "#cbd5e1" }}>{t.hero.sub}</p>
          <p className="text-sm mb-10" style={{ color: "#64748b" }}>{t.hero.cats}</p>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleBuy}
              disabled={loading}
              className="w-full max-w-sm py-4 px-8 text-lg font-black rounded-xl btn-orange">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  ...
                </span>
              ) : t.hero.cta}
            </button>
            <p className="text-xs" style={{ color: "#475569" }}>{t.hero.note}</p>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-8 px-5" style={{ background: "rgba(10,15,26,0.8)", borderTop: "1px solid rgba(30,41,59,0.5)", borderBottom: "1px solid rgba(30,41,59,0.5)" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { num: "105+", label: t.stats.prompts },
            { num: "6", label: t.stats.categories },
            { num: "$2", label: t.stats.price },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl font-black"
                style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {num}
              </div>
              <div className="text-xs font-medium mt-0.5" style={{ color: "#64748b" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PAIN POINTS ─── */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>{t.pain.tag}</p>
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 leading-tight">
            {t.pain.h2a}<br />
            <span style={{ color: "#64748b" }}>{t.pain.h2b}</span>
          </h2>
          <div className="space-y-3">
            {t.pain.items.map((text, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
                <span className="text-xl mt-0.5">{["😤", "⏰", "📉", "🤷"][i]}</span>
                <p className="text-base font-medium" style={{ color: "#cbd5e1" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLUTION ─── */}
      <section className="py-16 px-5" style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#3b82f6" }}>{t.solution.tag}</p>
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 leading-tight">
            {t.solution.h2a}{" "}
            <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {t.solution.h2b}
            </span>
          </h2>
          <div className="space-y-3">
            {t.solution.items.map((text, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.12)" }}>
                <span className="text-xl mt-0.5">✅</span>
                <p className="text-base font-medium" style={{ color: "#cbd5e1" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT'S INSIDE ─── */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>{t.inside.tag}</p>
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">{t.inside.h2}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES_META.map(({ icon, key, count, color, examples }) => (
              <div key={key} className="p-5 rounded-2xl"
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
                      <span style={{ color: color === "orange" ? "#f97316" : "#60a5fa" }}>→</span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPARE ─── */}
      <section className="py-16 px-5" style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="max-w-2xl mx-auto">
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
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-20 px-5">
        <div className="max-w-sm mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>{t.pricing.tag}</p>
          <div className="rounded-3xl p-8 text-center relative overflow-hidden"
            style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 0 60px rgba(249,115,22,0.12)" }}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl rounded-full"
              style={{ background: "radial-gradient(#f97316, transparent)" }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 blur-2xl rounded-full"
              style={{ background: "radial-gradient(#3b82f6, transparent)" }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.25)" }}>
                {t.pricing.badge}
              </div>

              <div className="mb-2">
                <span className="text-lg line-through" style={{ color: "#475569" }}>{t.pricing.was}</span>
              </div>
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

              <button onClick={handleBuy} disabled={loading}
                className="w-full py-4 text-base font-black rounded-xl btn-orange">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    ...
                  </span>
                ) : t.pricing.cta}
              </button>
              <p className="text-xs mt-3" style={{ color: "#334155" }}>{t.pricing.secure}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 px-5" style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">{t.faq.h2}</h2>
          <div className="space-y-3">
            {t.faq.items.map(({ q, a }, i) => (
              <div key={i} className="rounded-xl overflow-hidden"
                style={{ background: "rgba(15,20,30,0.8)", border: "1px solid rgba(30,41,59,0.6)" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left" style={{ cursor: "pointer" }}>
                  <span className="font-semibold text-sm text-white pr-4">{q}</span>
                  <span style={{ color: "#f97316", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />
        <div className="relative max-w-lg mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
            {t.cta2.h2a}{" "}
            <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {t.cta2.h2b}
            </span>
          </h2>
          <p className="text-base mb-8" style={{ color: "#64748b" }}>{t.cta2.sub}</p>
          <button onClick={handleBuy} disabled={loading}
            className="w-full max-w-xs py-4 text-lg font-black rounded-xl btn-orange mx-auto block">
            {loading ? "..." : t.cta2.btn}
          </button>
          <p className="text-xs mt-4" style={{ color: "#334155" }}>{t.cta2.note}</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 px-5 text-center" style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
          <span className="font-bold text-sm text-white">ReadyPrompts</span>
        </div>
        <p className="text-xs" style={{ color: "#334155" }}>{t.footer.copy}</p>
      </footer>
    </main>
  );
}
