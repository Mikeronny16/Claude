"use client";

import { useState, useEffect, useCallback } from "react";
import ProposalForm from "@/components/ProposalForm";
import ProposalResult from "@/components/ProposalResult";
import PricingModal from "@/components/PricingModal";
import HistoryModal from "@/components/HistoryModal";
import LangSelector from "@/components/LangSelector";
import DashboardModal from "@/components/DashboardModal";
import { saveToHistory, getHistory } from "@/lib/history";
import { LangCode, LANGUAGES, useTranslations, PROPOSAL_LANG_NAMES } from "@/lib/i18n";

type Tone = "professional" | "friendly" | "creative";
type Platform = "upwork" | "fiverr" | "email" | "linkedin";
type Length = "short" | "medium" | "long";
type Mode = "proposal" | "cover-letter";

interface FormData {
  skills: string;
  projectDesc: string;
  yourName: string;
  clientName: string;
  tone: Tone;
  platform: Platform;
  length: Length;
  mode: Mode;
}

function getUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("draftwin_uid");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("draftwin_uid", id); }
  return id;
}

const TEMPLATES = [
  {
    emoji: "🌐", labelKey: "Web Developer",
    skills: "React, Next.js, Node.js, 5 years experience, 50+ projects delivered",
    projectDesc: "Looking for a skilled developer to build a modern, responsive e-commerce website with product listings, cart, and checkout functionality.",
    tone: "professional" as Tone, platform: "upwork" as Platform, length: "medium" as Length,
  },
  {
    emoji: "✍️", labelKey: "Copywriter",
    skills: "SEO copywriting, blog content, email marketing, 3 years experience",
    projectDesc: "Need a talented writer to create engaging weekly blog posts for our SaaS company. Topics include productivity, remote work, and business growth.",
    tone: "friendly" as Tone, platform: "upwork" as Platform, length: "medium" as Length,
  },
  {
    emoji: "🎨", labelKey: "Logo Designer",
    skills: "Logo design, brand identity, Illustrator, Figma, 200+ logos created",
    projectDesc: "We need a modern, minimalist logo and full brand identity package for our new tech startup in the fintech space.",
    tone: "creative" as Tone, platform: "fiverr" as Platform, length: "short" as Length,
  },
  {
    emoji: "📱", labelKey: "App Developer",
    skills: "React Native, iOS, Android, Firebase, 4 years mobile dev experience",
    projectDesc: "Looking for a mobile developer to build a fitness tracking app with workout logs, progress charts, and push notifications.",
    tone: "professional" as Tone, platform: "email" as Platform, length: "medium" as Length,
  },
];

const TESTIMONIALS = [
  { name: "James K.", role: "Full-stack Developer", text: "I used to spend 2 hours on every proposal. Now it takes 30 seconds and my win rate has genuinely gone up. Can't believe this is free.", platform: "Upwork" },
  { name: "Maria L.", role: "Freelance Copywriter", text: "The platform-specific tone is a game changer. My Upwork proposals finally sound natural, not copy-pasted. Landed 3 clients in one week.", platform: "Upwork + Email" },
  { name: "David T.", role: "UI/UX Designer", text: "Generated 15 proposals in one afternoon. Landed 3 clients. The LinkedIn tone option is especially good — concise and professional.", platform: "LinkedIn" },
];

const EXAMPLE_PROPOSAL = `Hi Sarah,

I came across your project listing for a photography portfolio website and immediately knew I could deliver exactly what you're looking for.

With 5+ years in web development and a focus on visual-first design, I've built portfolio sites for 20+ photographers — optimizing image galleries for fast load times, elegant layouts, and mobile responsiveness.

For your project specifically, I'd implement a lightbox gallery system, lazy-loading for your high-resolution photos, and a clean minimal aesthetic that keeps the focus on your work.

I can deliver a fully functional portfolio within 10 days. Happy to share past work and discuss your vision.

Looking forward to working with you,
Alex`;

export default function Home() {
  const [userId, setUserId] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [proposal, setProposal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [lastForm, setLastForm] = useState<FormData | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [prefill, setPrefill] = useState<Partial<FormData> | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [lang, setLang] = useState<LangCode>("en");
  const [score, setScore] = useState<number | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const T = useTranslations(lang);
  const isRtl = lang === "ar";

  const refreshCredits = useCallback(async (uid: string) => {
    const res = await fetch(`/api/credits?userId=${uid}`);
    const data = await res.json();
    setCredits(data.credits);
  }, []);

  useEffect(() => {
    const uid = getUserId();
    setUserId(uid);
    refreshCredits(uid);
    setHistoryCount(getHistory().length);
    const savedTheme = localStorage.getItem("draftwin_theme") as "dark" | "light" | null;
    if (savedTheme) setTheme(savedTheme);
    const savedLang = localStorage.getItem("draftwin_lang") as LangCode | null;
    if (savedLang && LANGUAGES.find(l => l.code === savedLang)) setLang(savedLang);

    // Handle referral link
    const params = new URLSearchParams(window.location.search);
    const refId = params.get("ref");
    if (refId && refId !== uid && !localStorage.getItem("draftwin_ref_claimed")) {
      fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUserId: uid, refUserId: refId }),
      }).then(r => r.json()).then(data => {
        if (data.ok) {
          localStorage.setItem("draftwin_ref_claimed", "1");
          refreshCredits(uid);
        }
      }).catch(() => {});
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [refreshCredits]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("draftwin_theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    localStorage.setItem("draftwin_lang", lang);
  }, [lang, isRtl]);

  function toggleTheme() { setTheme(t => t === "dark" ? "light" : "dark"); }

  function applyTemplate(tpl: typeof TEMPLATES[0]) {
    setPrefill({ skills: tpl.skills, projectDesc: tpl.projectDesc, tone: tpl.tone, platform: tpl.platform, length: tpl.length });
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
  }

  async function generate(formData: FormData) {
    setLoading(true);
    setLastForm(formData);
    setProposal(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData, language: PROPOSAL_LANG_NAMES[lang] }),
      });
      const data = await res.json();
      if (data.needsPurchase) { setShowPricing(true); return; }
      if (data.error) throw new Error(data.error);
      setProposal(data.proposal);
      setScore(data.score ?? null);
      setCredits(data.creditsLeft);
      saveToHistory({ yourName: formData.yourName, clientName: formData.clientName, skills: formData.skills, proposal: data.proposal, score: data.score ?? null });
      setHistoryCount(getHistory().length);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const g = theme === "dark" ? "#10B981" : "#059669";

  const FAQS = [
    { q: T.faq1q, a: T.faq1a },
    { q: T.faq2q, a: T.faq2a },
    { q: T.faq3q, a: T.faq3a },
    { q: T.faq4q, a: T.faq4a },
    { q: T.faq5q, a: T.faq5a },
  ];

  return (
    <main className="min-h-screen">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
        <span className="font-extrabold text-lg tracking-tight" style={{ color: g }}>DraftWin</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowDashboard(true)}
            className="px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-all"
            style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
            📊
          </button>
          {historyCount > 0 && (
            <button onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-all"
              style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
              📋
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--glass-hover)", color: g }}>
                {historyCount}
              </span>
            </button>
          )}
          {credits !== null && credits <= 2 && (
            <button onClick={() => setShowPricing(true)}
              className="px-3 py-1.5 rounded-xl text-sm font-semibold cursor-pointer glow-btn"
              style={{ background: `linear-gradient(135deg, ${g}, var(--green-dim))`, color: "white" }}>
              {T.buyCredits}
            </button>
          )}
          <LangSelector lang={lang} onChange={setLang} />
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all text-base"
            style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center px-4 pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[500px] rounded-full" style={{ background: `radial-gradient(circle, ${theme === "dark" ? "rgba(16,185,129,0.07)" : "rgba(5,150,105,0.06)"} 0%, transparent 70%)` }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          {credits !== null && (
            <div className="inline-flex items-center gap-2 glass px-4 py-2 text-sm rounded-full">
              <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: g }} />
              <span style={{ color: g }}>{credits} {credits !== 1 ? T.heroCreditsPlural : T.heroCredits}</span>
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight whitespace-pre-line" style={{ color: "var(--text)" }}>
            {T.heroTitle.split("\n")[0]}
            <br />
            <span className="glow-text">{T.heroTitle.split("\n")[1]}</span>
          </h1>
          <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: "var(--text-dim)" }}>
            {T.heroSubtitle}
          </p>
          <div className="flex items-center justify-center gap-8 pt-2 flex-wrap">
            {[["1,200+", T.statsProposals], ["4.8★", T.statsRating], ["< 30s", T.statsTime]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-extrabold text-2xl" style={{ color: g }}>{num}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* How It Works */}
      <section className="px-4 py-14 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-10" style={{ color: "var(--text)" }}>{T.howItWorksTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { num: "1", title: T.step1Title, desc: T.step1Desc },
            { num: "2", title: T.step2Title, desc: T.step2Desc },
            { num: "3", title: T.step3Title, desc: T.step3Desc },
          ].map((step) => (
            <div key={step.num} className="glass p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto"
                style={{ background: "var(--glass-hover)", color: g, border: `1px solid var(--glass-border)` }}>
                {step.num}
              </div>
              <h3 className="font-bold" style={{ color: "var(--text)" }}>{step.title}</h3>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* Features */}
      <section className="px-4 py-14 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-10" style={{ color: "var(--text)" }}>{T.featuresTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: "⚡", title: T.feat1Title, desc: T.feat1Desc },
            { icon: "🎯", title: T.feat2Title, desc: T.feat2Desc },
            { icon: "💾", title: T.feat3Title, desc: T.feat3Desc },
          ].map((f) => (
            <div key={f.title} className="glass p-6 space-y-3">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="font-bold" style={{ color: "var(--text)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* Testimonials */}
      <section className="px-4 py-14 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-3" style={{ color: "var(--text)" }}>{T.testimonialsTitle}</h2>
        <p className="text-center text-sm mb-10" style={{ color: "var(--text-dim)" }}>{T.testimonialsSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="glass p-6 space-y-4">
              <div className="flex gap-0.5">{Array(5).fill(0).map((_, i) => <span key={i} style={{ color: g }}>★</span>)}</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--glass-border)" }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-faint)" }}>{t.role}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--glass-hover)", color: g }}>{t.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* Example Proposal */}
      <section className="px-4 py-14 max-w-3xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-3" style={{ color: "var(--text)" }}>{T.exampleTitle}</h2>
        <p className="text-center text-sm mb-8" style={{ color: "var(--text-dim)" }}>{T.exampleSubtitle}</p>
        <div className="glass p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "var(--glass-hover)", color: g }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: g }} />
            {T.exampleBadge}
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap mt-4 p-4 rounded-xl"
            style={{ background: theme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
            {EXAMPLE_PROPOSAL}
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* Quick Templates */}
      <section className="px-4 py-14 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-3" style={{ color: "var(--text)" }}>{T.templatesTitle}</h2>
        <p className="text-center text-sm mb-8" style={{ color: "var(--text-dim)" }}>{T.templatesSubtitle}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEMPLATES.map((tpl) => (
            <button key={tpl.labelKey} onClick={() => applyTemplate(tpl)}
              className="glass p-5 text-center space-y-2 cursor-pointer transition-all glass-hover rounded-2xl">
              <div className="text-3xl">{tpl.emoji}</div>
              <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{tpl.labelKey}</div>
              <div className="text-xs" style={{ color: "var(--text-faint)" }}>
                {tpl.platform.charAt(0).toUpperCase() + tpl.platform.slice(1)} · {tpl.tone}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* Form Section */}
      <section id="form-section" className="px-4 py-14 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "var(--glass-hover)", color: g, border: "1px solid var(--glass-border)" }}>1</span>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>{T.formTitle}</h2>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>{T.formSubtitle}</p>
          </div>
        </div>
        <ProposalForm onGenerate={generate} loading={loading} prefill={prefill} translations={T} />
      </section>

      {/* Result Section */}
      {(loading || proposal) && (
        <>
          <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />
          <section className="px-4 py-14 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: "var(--glass-hover)", color: g, border: "1px solid var(--glass-border)" }}>2</span>
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>{T.resultTitle}</h2>
            </div>
            {loading ? (
              <div className="glass p-10 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: `${g} transparent transparent transparent` }} />
                <p className="font-semibold animate-pulse" style={{ color: g }}>{T.loadingText}</p>
              </div>
            ) : proposal ? (
              <ProposalResult
                proposal={proposal}
                score={score}
                creditsLeft={credits ?? 0}
                onRegenerate={() => lastForm && generate(lastForm)}
                onBuy={() => setShowPricing(true)}
                loading={loading}
                translations={T}
              />
            ) : null}
          </section>
        </>
      )}

      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* FAQ */}
      <section className="px-4 py-14 max-w-2xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-10" style={{ color: "var(--text)" }}>{T.faqTitle}</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="glass overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                style={{ color: "var(--text)" }}>
                <span className="font-semibold text-sm pr-4">{faq.q}</span>
                <span className="text-lg shrink-0 transition-transform" style={{ color: g, transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 pb-14 max-w-2xl mx-auto">
        <div className="glass p-8 text-center space-y-4" style={{ border: `1px solid ${g}30` }}>
          <h3 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>{T.ctaTitle}</h3>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>{T.ctaSubtitle}</p>
          <button
            onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3.5 rounded-2xl font-bold cursor-pointer glow-btn"
            style={{ background: `linear-gradient(135deg, ${g}, var(--green-dim))`, color: "white" }}>
            {T.ctaBtn}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 border-t space-y-2" style={{ borderColor: "var(--glass-border)" }}>
        <p className="text-xs" style={{ color: "var(--text-faint)" }}>{T.footerText}</p>
        <p className="text-xs" style={{ color: "var(--text-faint)" }}>
          {T.footerBy}{" "}
          <span className="font-semibold" style={{ color: "var(--green)" }}>Mike Ronny</span>
        </p>
      </footer>

      {showDashboard && userId && credits !== null && (
        <DashboardModal credits={credits} userId={userId} onClose={() => setShowDashboard(false)} />
      )}
      {showPricing && userId && (
        <PricingModal userId={userId} onClose={() => { setShowPricing(false); refreshCredits(userId); }} />
      )}
      {showHistory && (
        <HistoryModal onClose={() => setShowHistory(false)} translations={T} />
      )}
    </main>
  );
}
