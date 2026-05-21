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
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-purple-400">Your Proposal ✨</h2>
        <span className="text-xs text-gray-500">{creditsLeft} credits left</span>
      </div>

      <div className="bg-[#0a0a12] border border-[#1e1e35] rounded-xl p-5 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
        {proposal}
      </div>

      <div className="flex gap-3">
        <button
          onClick={copy}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-semibold glow-btn"
        >
          {copied ? "✅ Copied!" : "📋 Copy"}
        </button>
        <button
          onClick={onRegenerate}
          disabled={loading || creditsLeft <= 0}
          className="flex-1 py-3 rounded-xl border border-[#1e1e35] font-semibold text-gray-300 hover:border-purple-500/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "🔄 Regenerate"}
        </button>
      </div>

      {creditsLeft <= 0 && (
        <div className="text-center space-y-2 pt-2">
          <p className="text-yellow-400 text-sm font-medium">Credits used up — buy more to keep winning 🏆</p>
          <button
            onClick={onBuy}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 font-bold"
          >
            💳 Buy Credits (USDT)
          </button>
        </div>
      )}
    </div>
  );
}
