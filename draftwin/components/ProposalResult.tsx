"use client";

import { useState } from "react";

interface Props {
  proposal: string;
  creditsLeft: number;
  onRegenerate: () => void;
  onBuy: () => void;
  loading: boolean;
}

export default function ProposalResult({ proposal, creditsLeft, onRegenerate, onBuy, loading }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="glass p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold text-sm">Ready to send</span>
          </div>
          <span className="text-xs text-white/30">{creditsLeft} credit{creditsLeft !== 1 ? "s" : ""} left</span>
        </div>

        <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
          style={{background: "rgba(0,0,0,0.2)", border: "1px solid rgba(16,185,129,0.08)"}}>
          {proposal}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={copy}
          className="py-3.5 rounded-xl font-semibold text-sm cursor-pointer glow-btn"
          style={{background: "linear-gradient(135deg, #10B981, #059669)", color: "white"}}>
          {copied ? "✅ Copied!" : "📋 Copy Proposal"}
        </button>
        <button onClick={onRegenerate} disabled={loading || creditsLeft <= 0}
          className="py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all disabled:opacity-40"
          style={{background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "rgba(255,255,255,0.7)"}}>
          {loading ? "..." : "🔄 Regenerate"}
        </button>
      </div>

      {creditsLeft <= 0 && (
        <div className="glass p-5 text-center space-y-3" style={{borderColor: "rgba(245,158,11,0.3)"}}>
          <p className="text-amber-400 font-semibold text-sm">Credits used up — keep winning 🏆</p>
          <button onClick={onBuy}
            className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer"
            style={{background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "white"}}>
            💳 Buy Credits with USDT
          </button>
        </div>
      )}
    </div>
  );
}
