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
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("draftwin_uid", id);
  }
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
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      });
      const data = await res.json();
      if (data.needsPurchase) {
        setShowPricing(true);
        return;
      }
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
    <main className="min-h-screen flex flex-col items-center px-4 py-12 gap-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-black tracking-tight glow-text">
          Draft<span className="text-purple-400">Win</span>
        </h1>
        <p className="text-gray-400 text-lg">Write winning freelance proposals in seconds ✍️</p>
        {credits !== null && (
          <div className="inline-flex items-center gap-2 bg-[#12121e] border border-[#1e1e35] rounded-full px-4 py-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
            <span className="text-gray-300">{credits} free credit{credits !== 1 ? "s" : ""} remaining</span>
            {credits <= 1 && (
              <button
                onClick={() => setShowPricing(true)}
                className="text-purple-400 underline ml-1"
              >
                Buy more
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-xl space-y-6">
        {/* How it works */}
        {!proposal && (
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { step: "1", text: "Fill in your skills & project details" },
              { step: "2", text: "AI writes a tailored proposal instantly" },
              { step: "3", text: "Copy & send — start winning clients" },
            ].map((s) => (
              <div key={s.step} className="card p-3 space-y-1">
                <div className="text-purple-400 font-black text-lg">{s.step}</div>
                <p className="text-gray-400 text-xs">{s.text}</p>
              </div>
            ))}
          </div>
        )}

        <ProposalForm onGenerate={generate} loading={loading} />

        {proposal && (
          <ProposalResult
            proposal={proposal}
            creditsLeft={credits ?? 0}
            onRegenerate={() => lastForm && generate(lastForm)}
            onBuy={() => setShowPricing(true)}
            loading={loading}
          />
        )}
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-xs mt-auto">
        Free to try · Pay with USDT · No signup needed
      </p>

      {showPricing && userId && (
        <PricingModal
          userId={userId}
          onClose={() => {
            setShowPricing(false);
            refreshCredits(userId);
          }}
        />
      )}
    </main>
  );
}
