"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  userId: string;
  onCreditsUpdate: (n: number) => void;
  onBuy: () => void;
  creditsLeft: number;
}

export default function RewriterModal({ onClose, userId, onCreditsUpdate, onBuy, creditsLeft }: Props) {
  const [oldProposal, setOldProposal] = useState("");
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState<{ improved: string; tip: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function rewrite() {
    if (!oldProposal.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, oldProposal: oldProposal.trim(), feedback: feedback.trim() }),
      });
      const data = await res.json();
      if (data.error === "No credits") { onBuy(); return; }
      if (data.error) { setError(data.error); return; }
      setResult({ improved: data.improved, tip: data.tip });
      onCreditsUpdate(data.creditsLeft);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result.improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass modal-content w-full max-w-lg rounded-3xl overflow-hidden" style={{ maxHeight: "90vh", overflowY: "auto" }}>

        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>🔄 Proposal Rewriter</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>Paste a losing proposal — AI makes it stronger (1 credit)</p>
          </div>
          <button onClick={onClose} className="text-xl cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>
        </div>

        <div className="p-5 space-y-4">

          {!result ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--green)" }}>
                  Your old proposal
                </label>
                <textarea
                  value={oldProposal}
                  onChange={e => setOldProposal(e.target.value)}
                  placeholder="Paste your existing proposal here — one you didn't win, or one you want to improve..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--green)" }}>
                  Focus area (optional)
                </label>
                <input
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="e.g. 'make the opening stronger' or 'add more urgency'"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
                />
              </div>

              {error && (
                <p className="text-xs px-4 py-2 rounded-xl text-center"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>{creditsLeft} credit{creditsLeft !== 1 ? "s" : ""} left</span>
                <button onClick={rewrite} disabled={loading || !oldProposal.trim() || creditsLeft <= 0}
                  className="px-6 py-3 rounded-xl font-bold text-sm cursor-pointer glow-btn disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
                  {loading ? "Rewriting..." : "✨ Rewrite It — 1 Credit"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 rounded-2xl text-sm"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "var(--green)" }}>
                💡 <strong>What changed:</strong> {result.tip}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--green)" }}>
                  Improved version
                </label>
                <textarea
                  value={result.improved}
                  readOnly
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none leading-relaxed"
                  style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "var(--text-dim)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={copy}
                  className="py-3 rounded-xl font-bold text-sm cursor-pointer glow-btn"
                  style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
                <button onClick={() => { setResult(null); setOldProposal(""); setFeedback(""); }}
                  className="py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
                  style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
                  🔄 Rewrite Another
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
