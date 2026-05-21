"use client";

import { useState, useEffect, useCallback } from "react";
import ProposalForm from "@/components/ProposalForm";
import ProposalResult from "@/components/ProposalResult";
import PricingModal from "@/components/PricingModal";

type Tone = "professional" | "friendly" | "creative";

interface FormData {
  skills: string;
  projectDesc: string;
  yourName: string;
  clientName: string;
  tone: Tone;
}

function getUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("draftwin_uid");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("draftwin_uid", id); }
  return id;
}

export default function Home() {
  const [userId, setUserId] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [proposal, setProposal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [lastForm, setLastForm] = useState<FormData | null>(null);

  const refreshCredits = useCallback(async (uid: string) => {
    const res = await fetch(`/api/credits?userId=${uid}`);
    const data = await res.json();
    setCredits(data.credits);
  }, []);

  useEffect(() => {
    const uid = getUserId();
    setUserId(uid);
    refreshCredits(uid);
  }, [refreshCredits]);

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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="relative text-center px-4 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full" style={{background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)"}} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Credits badge */}
          {credits !== null && (
            <div className="inline-flex items-center gap-2 glass px-4 py-2 text-sm rounded-full mx-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="text-emerald-300">{credits} free credit{credits !== 1 ? "s" : ""} left</span>
              {credits <= 1 && (
                <button onClick={() => setShowPricing(true)} className="text-emerald-400 underline ml-1 font-semibold">
                  Buy more
                </button>
              )}
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-white">Write proposals</span>
            <br />
            <span className="glow-text" style={{color: "#10B981"}}>that actually win.</span>
          </h1>

          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            AI-powered freelance proposals tailored to every job. Free to try. No account needed.
          </p>

          {/* Steps */}
          <div className="flex items-center justify-center gap-3 text-sm text-white/40 flex-wrap">
            {["Fill in details", "AI generates", "Copy & send"].map((s, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-emerald-800">→</span>}
                <span className="glass px-3 py-1.5 rounded-full text-white/60">{s}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px" style={{background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)"}} />

      {/* Form Section */}
      <section className="px-4 py-16 max-w-2xl mx-auto">
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)"}}>1</span>
            <h2 className="text-xl font-bold text-white">Your Details</h2>
          </div>
          <p className="text-white/40 text-sm pl-11">Tell us about you and the project</p>
        </div>
        <ProposalForm onGenerate={generate} loading={loading} />
      </section>

      {/* Result Section */}
      {(loading || proposal) && (
        <>
          <div className="w-full h-px" style={{background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)"}} />
          <section className="px-4 py-16 max-w-2xl mx-auto">
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)"}}>2</span>
                <h2 className="text-xl font-bold text-white">Your Proposal</h2>
              </div>
            </div>
            {loading ? (
              <div className="glass p-10 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-emerald-400 font-semibold animate-pulse">Writing your winning proposal...</p>
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
      <footer className="text-center py-10 text-white/20 text-xs border-t" style={{borderColor: "rgba(16,185,129,0.08)"}}>
        Free to try · Pay with USDT · No signup needed
      </footer>

      {showPricing && userId && (
        <PricingModal userId={userId} onClose={() => { setShowPricing(false); refreshCredits(userId); }} />
      )}
    </main>
  );
}
