"use client";

import { useState } from "react";

const CATEGORIES = [
  {
    icon: "🎬",
    title: "TikTok & Short Video",
    count: 20,
    color: "orange",
    examples: ["Viral hook generator", "POV story scripts", "Trending caption maker"],
  },
  {
    icon: "📸",
    title: "Instagram Content",
    count: 18,
    color: "blue",
    examples: ["Carousel slide writer", "Reel script builder", "Bio optimizer"],
  },
  {
    icon: "💰",
    title: "Marketing & Sales",
    count: 20,
    color: "orange",
    examples: ["AIDA copywriter", "Ad headline maker", "Sales page builder"],
  },
  {
    icon: "🏢",
    title: "Business & Money",
    count: 18,
    color: "blue",
    examples: ["Business idea generator", "Freelance pitch writer", "Income stream finder"],
  },
  {
    icon: "📧",
    title: "Email Marketing",
    count: 12,
    color: "orange",
    examples: ["Welcome sequence writer", "Re-engagement campaign", "Subject line generator"],
  },
  {
    icon: "🌟",
    title: "Personal Brand",
    count: 17,
    color: "blue",
    examples: ["Origin story creator", "LinkedIn authority posts", "Viral thread writer"],
  },
];

const PAIN_POINTS = [
  { icon: "😤", text: "Typing vague prompts and getting totally useless AI answers" },
  { icon: "⏰", text: "Wasting 2+ hours asking AI the same thing 10 different ways" },
  { icon: "📉", text: "Your content is mid while competitors' AI content is fire" },
  { icon: "🤷", text: "You know AI is powerful — but you don't know HOW to use it" },
];

const BENEFITS = [
  { icon: "✅", text: "Copy-paste prompts that work the first time, every time" },
  { icon: "✅", text: "105+ prompts covering every creator and business need" },
  { icon: "✅", text: "Organized in 6 categories — find what you need in 10 seconds" },
  { icon: "✅", text: "Works with ChatGPT, Claude, Gemini, or any AI model" },
];

const FAQS = [
  {
    q: "What exactly do I get?",
    a: "A downloadable text file with 105+ copy-paste AI prompts organized into 6 categories: TikTok, Instagram, Marketing, Business, Email, and Personal Brand.",
  },
  {
    q: "Which AI can I use these with?",
    a: "Any AI: ChatGPT (GPT-4), Claude, Gemini, Grok, Llama — all of them. These prompts are model-agnostic and work everywhere.",
  },
  {
    q: "What crypto can I pay with?",
    a: "USDT (BSC), Bitcoin, Ethereum, and 50+ cryptocurrencies via NOWPayments. Payment confirms within minutes.",
  },
  {
    q: "How do I get my download?",
    a: "Immediately after your payment confirms, you'll see a download button. One click — file is yours. No email needed.",
  },
  {
    q: "Why only $2?",
    a: "Because good tools shouldn't be gated behind $97 'courses'. Every creator and small business deserves prompts that actually work.",
  },
];

export default function HomePage() {
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

  return (
    <main className="min-h-screen bg-cinema-bg overflow-x-hidden">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,8,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(30,41,59,0.5)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>
            R
          </div>
          <span className="font-bold text-white tracking-tight">ReadyPrompts</span>
        </div>
        <button
          onClick={handleBuy}
          disabled={loading}
          className="text-sm font-bold px-4 py-2 rounded-lg transition-all"
          style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white", boxShadow: "0 0 16px rgba(249,115,22,0.3)" }}>
          {loading ? "..." : "Get for $2 →"}
        </button>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-20 px-5 text-center bg-grid overflow-hidden">
        {/* Orange glow blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }} />
        {/* Blue glow blob */}
        <div className="absolute top-20 right-0 w-[300px] h-[300px] rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }} />

        <div className="relative max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "#fb923c" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            105+ Prompts · Instant Download · $2 One-Time
          </div>

          {/* Burmese headline */}
          <p className="text-base font-medium mb-3" style={{ color: "#94a3b8" }}>
            AI ကိုသုံးနေပေမဲ့ ရလဒ်တွေကအမြဲမကောင်းဘူးလား?
          </p>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Stop Getting{" "}
            <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Trash Results
            </span>
            <br />
            from Your AI.
          </h1>

          <p className="text-lg sm:text-xl font-medium mb-2" style={{ color: "#cbd5e1" }}>
            105 copy-paste prompts for creators, marketers & business owners.
          </p>
          <p className="text-base mb-10" style={{ color: "#64748b" }}>
            TikTok · Instagram · Marketing · Business · Email · Personal Brand
          </p>

          {/* CTA Block */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleBuy}
              disabled={loading}
              className="w-full max-w-sm py-4 px-8 text-lg font-black rounded-xl transition-all btn-orange"
              style={{ fontSize: "1.125rem", letterSpacing: "-0.01em" }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Redirecting...
                </span>
              ) : (
                "⚡ Get All 105 Prompts — $2 Only"
              )}
            </button>
            <p className="text-xs" style={{ color: "#475569" }}>
              Pay with crypto · Instant download · No subscription
            </p>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-8 px-5" style={{ background: "rgba(10,15,26,0.8)", borderTop: "1px solid rgba(30,41,59,0.5)", borderBottom: "1px solid rgba(30,41,59,0.5)" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { num: "105+", label: "Prompts" },
            { num: "6", label: "Categories" },
            { num: "$2", label: "One-time" },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl font-black" style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
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
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>
            Sound familiar?
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 leading-tight">
            You&apos;re not bad at AI.
            <br />
            <span style={{ color: "#64748b" }}>You just have the wrong prompts.</span>
          </h2>
          <div className="space-y-3">
            {PAIN_POINTS.map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
                <span className="text-xl mt-0.5">{icon}</span>
                <p className="text-base font-medium" style={{ color: "#cbd5e1" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLUTION ─── */}
      <section className="py-16 px-5" style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#3b82f6" }}>
            The fix
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10 leading-tight">
            105 prompts that{" "}
            <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              work the first time.
            </span>
          </h2>
          <div className="space-y-3">
            {BENEFITS.map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.12)" }}>
                <span className="text-xl mt-0.5">{icon}</span>
                <p className="text-base font-medium" style={{ color: "#cbd5e1" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT'S INSIDE ─── */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>
            What&apos;s inside
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">
            6 Categories. 105 Prompts. Zero Fluff.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES.map(({ icon, title, count, color, examples }) => (
              <div key={title} className="p-5 rounded-2xl transition-all"
                style={{
                  background: color === "orange" ? "rgba(249,115,22,0.06)" : "rgba(59,130,246,0.06)",
                  border: `1px solid ${color === "orange" ? "rgba(249,115,22,0.18)" : "rgba(59,130,246,0.18)"}`,
                }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-white">{title}</h3>
                    <p className="text-xs" style={{ color: color === "orange" ? "#f97316" : "#60a5fa" }}>
                      {count} prompts
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
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">
            Without vs. With ReadyPrompts
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#f87171" }}>❌ Without</p>
              <ul className="space-y-2 text-sm" style={{ color: "#94a3b8" }}>
                <li>Type something vague</li>
                <li>Get generic garbage</li>
                <li>Try 10 variations</li>
                <li>Give up on AI</li>
                <li>2+ hours wasted</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.18)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#fb923c" }}>✅ With</p>
              <ul className="space-y-2 text-sm" style={{ color: "#cbd5e1" }}>
                <li>Pick the right prompt</li>
                <li>Get usable output</li>
                <li>Paste. Done.</li>
                <li>AI becomes your tool</li>
                <li>5 minutes max</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-20 px-5">
        <div className="max-w-sm mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-3" style={{ color: "#f97316" }}>
            Limited time price
          </p>
          <div className="rounded-3xl p-8 text-center relative overflow-hidden"
            style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 0 60px rgba(249,115,22,0.12)" }}>
            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl rounded-full"
              style={{ background: "radial-gradient(#f97316, transparent)" }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 blur-2xl rounded-full"
              style={{ background: "radial-gradient(#3b82f6, transparent)" }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.25)" }}>
                🔥 Only 47 spots left at this price
              </div>

              <div className="mb-2">
                <span className="text-lg line-through" style={{ color: "#475569" }}>$20</span>
              </div>
              <div className="text-7xl font-black mb-1" style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                $2
              </div>
              <p className="text-sm mb-1" style={{ color: "#64748b" }}>One-time payment · No subscription</p>
              <p className="text-xs mb-8" style={{ color: "#475569" }}>90% off · Price goes up soon</p>

              <ul className="text-left space-y-2 mb-8">
                {[
                  "105+ copy-paste AI prompts",
                  "6 categories (TikTok, IG, Marketing...)",
                  "Works with any AI model",
                  "Instant download after payment",
                  "Yours forever",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#cbd5e1" }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "rgba(249,115,22,0.2)", color: "#f97316" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleBuy}
                disabled={loading}
                className="w-full py-4 text-base font-black rounded-xl btn-orange">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Setting up payment...
                  </span>
                ) : (
                  "⚡ Buy Now with Crypto"
                )}
              </button>
              <p className="text-xs mt-3" style={{ color: "#334155" }}>
                Secure payment via NOWPayments · USDT, BTC, ETH & more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 px-5" style={{ background: "rgba(10,15,26,0.6)" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">Quick answers</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="rounded-xl overflow-hidden"
                style={{ background: "rgba(15,20,30,0.8)", border: "1px solid rgba(30,41,59,0.6)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                  style={{ cursor: "pointer" }}>
                  <span className="font-semibold text-sm text-white pr-4">{q}</span>
                  <span style={{ color: "#f97316", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                    {a}
                  </div>
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
            Your AI can do way{" "}
            <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              more than this.
            </span>
          </h2>
          <p className="text-base mb-8" style={{ color: "#64748b" }}>
            105 prompts. $2. Instant download. What&apos;s the risk?
          </p>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full max-w-xs py-4 text-lg font-black rounded-xl btn-orange mx-auto block">
            {loading ? "Loading..." : "⚡ Get 105 Prompts for $2"}
          </button>
          <p className="text-xs mt-4" style={{ color: "#334155" }}>
            Pay with crypto · No account needed · Download immediately
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 px-5 text-center" style={{ borderTop: "1px solid rgba(30,41,59,0.5)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
          <span className="font-bold text-sm text-white">ReadyPrompts</span>
        </div>
        <p className="text-xs" style={{ color: "#334155" }}>
          © 2025 ReadyPrompts · 105 AI prompts for $2 · All rights reserved
        </p>
      </footer>
    </main>
  );
}
