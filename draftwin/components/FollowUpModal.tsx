"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  userId: string;
  onCreditsUpdate: (n: number) => void;
  onBuy: () => void;
  creditsLeft: number;
  defaultProposal?: string;
  defaultClientName?: string;
  defaultYourName?: string;
}

export default function FollowUpModal({ onClose, userId, onCreditsUpdate, onBuy, creditsLeft, defaultProposal = "", defaultClientName = "", defaultYourName = "" }: Props) {
  const [originalProposal, setOriginalProposal] = useState(defaultProposal);
  const [clientName, setClientName] = useState(defaultClientName);
  const [yourName, setYourName] = useState(defaultYourName);
  const [daysSince, setDaysSince] = useState(3);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const g = "var(--green)";

  async function generate() {
    if (!originalProposal.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, originalProposal: originalProposal.trim(), clientName: clientName.trim() || "the client", yourName: yourName.trim() || "there", daysSince }),
      });
      const data = await res.json();
      if (data.error === "No credits") { onBuy(); return; }
      if (data.error) { setError(data.error); return; }
      setResult(data.followUp);
      onCreditsUpdate(data.creditsLeft);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
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
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>💬 Follow-Up Generator</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>Never lose a prospect who went silent (1 credit)</p>
          </div>
          <button onClick={onClose} className="text-xl cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>
        </div>

        <div className="p-5 space-y-4">
          {!result ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: g }}>
                  Original proposal
                </label>
                <textarea
                  value={originalProposal}
                  onChange={e => setOriginalProposal(e.target.value)}
                  placeholder="Paste the proposal you sent and haven't heard back from..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: g }}>Client name</label>
                  <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Sarah"
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: g }}>Your name</label>
                  <input value={yourName} onChange={e => setYourName(e.target.value)} placeholder="e.g. Alex"
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: g }}>Days since sent</label>
                <div className="flex gap-2">
                  {[2, 3, 5, 7, 14].map(d => (
                    <button key={d} onClick={() => setDaysSince(d)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
                      style={{
                        background: daysSince === d ? "rgba(16,185,129,0.15)" : "rgba(0,0,0,0.12)",
                        border: `1px solid ${daysSince === d ? "rgba(16,185,129,0.5)" : "var(--glass-border)"}`,
                        color: daysSince === d ? g : "var(--text-dim)",
                      }}>
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-xs px-4 py-2 rounded-xl text-center"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>{creditsLeft} credit{creditsLeft !== 1 ? "s" : ""} left</span>
                <button onClick={generate} disabled={loading || !originalProposal.trim() || creditsLeft <= 0}
                  className="px-6 py-3 rounded-xl font-bold text-sm cursor-pointer glow-btn disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
                  {loading ? "Writing..." : "💬 Generate Follow-Up — 1 Credit"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 rounded-2xl text-sm"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: g }}>
                ✅ Follow-up message ready — personalized to your original proposal
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: g }}>Your follow-up</label>
                <textarea
                  value={result}
                  readOnly
                  rows={8}
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
                <button onClick={() => { setResult(null); }}
                  className="py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
                  style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
                  🔄 Write Another
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
