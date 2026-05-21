"use client";

import { useState } from "react";
import { Translations } from "@/lib/i18n";

interface Props {
  proposal: string;
  creditsLeft: number;
  onRegenerate: () => void;
  onBuy: () => void;
  loading: boolean;
  translations: Translations;
}

export default function ProposalResult({ proposal, creditsLeft, onRegenerate, onBuy, loading, translations: T }: Props) {
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
            <span className="font-semibold text-sm" style={{ color: "var(--green)" }}>Ready to send</span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>{creditsLeft} credit{creditsLeft !== 1 ? "s" : ""} left</span>
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
          style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
          {proposal}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={copy}
          className="py-3.5 rounded-xl font-semibold text-sm cursor-pointer glow-btn"
          style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
          {copied ? T.btnCopied : T.btnCopy}
        </button>
        <button onClick={onRegenerate} disabled={loading || creditsLeft <= 0}
          className="py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all disabled:opacity-40"
          style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
          {loading ? "..." : T.btnRegenerate}
        </button>
      </div>

      {creditsLeft <= 0 && (
        <div className="glass p-5 text-center space-y-3" style={{ borderColor: "rgba(245,158,11,0.3)" }}>
          <p className="font-semibold text-sm" style={{ color: "#F59E0B" }}>Credits used up — keep winning 🏆</p>
          <button onClick={onBuy}
            className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "white" }}>
            💳 {T.buyCredits}
          </button>
        </div>
      )}
    </div>
  );
}
