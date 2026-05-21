"use client";

import { useState, useEffect, useCallback } from "react";
import ProposalForm from "@/components/ProposalForm";
import ProposalResult from "@/components/ProposalResult";
import PricingModal from "@/components/PricingModal";
import HistoryModal from "@/components/HistoryModal";
import { saveToHistory, getHistory } from "@/lib/history";

type Tone = "professional" | "friendly" | "creative";
type Platform = "upwork" | "fiverr" | "email" | "linkedin";
type Length = "short" | "medium" | "long";

interface FormData {
  skills: string;
  projectDesc: string;
  yourName: string;
  clientName: string;
  tone: Tone;
  platform: Platform;
  length: Length;
}

function getUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("draftwin_uid");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("draftwin_uid", id); }
  return id;
}

const FEATURES = [
  { icon: "⚡", title: "30-Second Proposals", desc: "Stop spending hours writing. Get a polished, client-ready proposal in under 30 seconds." },
  { icon: "🎯", title: "Perfectly Tailored", desc: "Every proposal is written to match your skills and the client's project — no generic templates." },
  { icon: "💾", title: "History Saved", desc: "All your proposals are saved locally. Review, copy, and reuse any time without re-generating." },
];

const EXAMPLE_PROPOSAL = `Hi Sarah,

I came across your project listing for a photography portfolio website and immediately knew I could deliver exactly what you're looking for.

With 5+ years in web development and a focus on visual-first design, I've built portfolio sites for 20+ photographers — optimizing image galleries for fast load times, elegant layouts, and mobile responsiveness.

For your project specifically, I'd implement a lightbox gallery system, lazy-loading for your high-resolution photos, and a clean minimal aesthetic that keeps the focus on your work.

I can deliver a fully functional portfolio within 10 days. Happy to share past work and discuss your vision.

Looking forward to working with you,
Alex`;

const STEPS = [
  { num: "1", title: "Fill in your details", desc: "Your name, client name, skills, and project description" },
  { num: "2", title: "AI writes for you", desc: "Our AI crafts a proposal tailored to the specific job" },
  { num: "3", title: "Copy & send", desc: "Paste it directly into Upwork, Fiverr, or email" },
];

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
    const saved = localStorage.getItem("draftwin_theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, [refreshCredits]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("draftwin_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => t === "dark" ? "light" : "dark");
  }

  async function generate(formData: FormData) {
    setLoading(true);
    setLastForm(formData);
    setProposal(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      });
      const data = await res.json();
      if (data.needsPurchase) { setShowPricing(true); return; }
      if (data.error) throw new Error(data.error);
      setProposal(data.proposal);
      setCredits(data.creditsLeft);
      saveToHistory({ yourName: formData.yourName, clientName: formData.clientName, skills: formData.skills, proposal: data.proposal });
      setHistoryCount(getHistory().length);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const g = theme === "dark" ? "#10B981" : "#059669";

  return (
    <main className="min-h-screen">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
        <span className="font-extrabold text-lg tracking-tight" style={{ color: g }}>DraftWin</span>
        <div className="flex items-center gap-3">
          {historyCount > 0 && (
            <button onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-all"
              style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
              📋 History
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
              Buy Credits
            </button>
          )}
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all text-base"
            style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
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
              <span style={{ color: g }}>{credits} free credit{credits !== 1 ? "s" : ""} left</span>
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
            Write proposals
            <br />
            <span className="glow-text">that actually win.</span>
          </h1>
          <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: "var(--text-dim)" }}>
            AI-powered freelance proposals tailored to every job. Free to try. No account needed.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 text-sm flex-wrap pt-2">
            {[["500+", "Proposals Generated"], ["3", "Writing Tones"], ["< 30s", "Generation Time"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-extrabold text-xl" style={{ color: g }}>{num}</div>
                <div className="text-xs" style={{ color: "var(--text-faint)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* How It Works */}
      <section className="px-4 py-14 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-10" style={{ color: "var(--text)" }}>
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step) => (
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

      {/* Divider */}
      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* Features */}
      <section className="px-4 py-14 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-10" style={{ color: "var(--text)" }}>
          Why freelancers use DraftWin
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass p-6 space-y-3">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="font-bold" style={{ color: "var(--text)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* Example Proposal Preview */}
      <section className="px-4 py-14 max-w-3xl mx-auto">
        <h2 className="text-center text-2xl font-extrabold mb-3" style={{ color: "var(--text)" }}>
          See what you&apos;ll get
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: "var(--text-dim)" }}>
          A real example — generated for a web developer pitching a photography portfolio
        </p>
        <div className="glass p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "var(--glass-hover)", color: g }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: g }} />
            Example Output
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap mt-4 p-4 rounded-xl"
            style={{ background: theme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
            {EXAMPLE_PROPOSAL}
          </div>
          <div className="mt-4 flex justify-center">
            <div className="px-4 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "var(--glass-hover)", color: "var(--text-faint)", border: "1px solid var(--glass-border)" }}>
              ↑ Your proposals look like this — tailored to each client
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />

      {/* Form Section */}
      <section className="px-4 py-14 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "var(--glass-hover)", color: g, border: "1px solid var(--glass-border)" }}>1</span>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>Your Details</h2>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>Tell us about you and the project</p>
          </div>
        </div>
        <ProposalForm onGenerate={generate} loading={loading} />
      </section>

      {/* Result Section */}
      {(loading || proposal) && (
        <>
          <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, var(--divider), transparent)` }} />
          <section className="px-4 py-14 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: "var(--glass-hover)", color: g, border: "1px solid var(--glass-border)" }}>2</span>
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>Your Proposal</h2>
            </div>
            {loading ? (
              <div className="glass p-10 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: `${g} transparent transparent transparent` }} />
                <p className="font-semibold animate-pulse" style={{ color: g }}>Writing your winning proposal...</p>
              </div>
            ) : proposal ? (
              <ProposalResult
                proposal={proposal}
                creditsLeft={credits ?? 0}
                onRegenerate={() => lastForm && generate(lastForm)}
                onBuy={() => setShowPricing(true)}
                loading={loading}
              />
            ) : null}
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="text-center py-10 text-xs border-t" style={{ borderColor: "var(--glass-border)", color: "var(--text-faint)" }}>
        Free to try · Pay with USDT · No signup needed
      </footer>

      {showPricing && userId && (
        <PricingModal userId={userId} onClose={() => { setShowPricing(false); refreshCredits(userId); }} />
      )}
      {showHistory && (
        <HistoryModal onClose={() => setShowHistory(false)} />
      )}
    </main>
  );
}
