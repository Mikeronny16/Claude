"use client";

import { useState, useEffect } from "react";
import { getHistory, ProposalStatus } from "@/lib/history";

interface Props {
  onClose: () => void;
  credits: number;
  userId: string;
}

export default function DashboardModal({ onClose, credits, userId }: Props) {
  const [copied, setCopied] = useState<"ref" | "id" | null>(null);
  const [refClaimed, setRefClaimed] = useState(false);

  const history = getHistory();
  const totalProposals = history.length;
  const sent = history.filter(e => e.status === "sent" || e.status === "won" || e.status === "lost");
  const won = history.filter(e => e.status === "won");
  const winRate = sent.length > 0 ? Math.round((won.length / sent.length) * 100) : null;
  const avgScore = history.filter(e => e.score).length > 0
    ? Math.round(history.filter(e => e.score).reduce((a, e) => a + (e.score ?? 0), 0) / history.filter(e => e.score).length * 10) / 10
    : null;

  const refLink = typeof window !== "undefined" ? `${window.location.origin}?ref=${userId}` : "";

  useEffect(() => {
    setRefClaimed(!!localStorage.getItem("draftwin_ref_claimed"));
  }, []);

  function copyRef() {
    navigator.clipboard.writeText(refLink);
    setCopied("ref");
    setTimeout(() => setCopied(null), 2000);
  }

  const stats = [
    { label: "Credits Left", value: credits, color: credits > 2 ? "var(--green)" : "#F59E0B", icon: "⚡" },
    { label: "Proposals Made", value: totalProposals, color: "var(--green)", icon: "✍️" },
    { label: "Win Rate", value: winRate !== null ? `${winRate}%` : "—", color: winRate !== null && winRate >= 50 ? "var(--green)" : "#F59E0B", icon: "🏆" },
    { label: "Avg Score", value: avgScore !== null ? `${avgScore}/10` : "—", color: "var(--green)", icon: "⭐" },
  ];

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="glass modal-content w-full max-w-md rounded-3xl overflow-hidden" style={{ maxHeight: "88vh", overflowY: "auto" }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>📊 Dashboard</h2>
          <button onClick={onClose} className="text-xl cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>
        </div>

        <div className="p-5 space-y-5">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(s => (
              <div key={s.label} className="glass p-4 text-center space-y-1 rounded-2xl">
                <div className="text-xl">{s.icon}</div>
                <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "var(--text-faint)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Proposals */}
          {history.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Recent Proposals</p>
              <div className="space-y-2">
                {history.slice(0, 3).map(entry => {
                  const statusEmoji: Record<NonNullable<ProposalStatus>, string> = { sent: "📤", won: "🏆", lost: "❌" };
                  return (
                    <div key={entry.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                          {entry.yourName} → {entry.clientName}
                        </p>
                        <p className="text-xs truncate" style={{ color: "var(--text-faint)" }}>{entry.skills}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {entry.score && (
                          <span className="text-xs font-bold" style={{ color: entry.score >= 8 ? "var(--green)" : "#F59E0B" }}>{entry.score}/10</span>
                        )}
                        {entry.status && statusEmoji[entry.status] && (
                          <span className="text-sm">{statusEmoji[entry.status]}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Referral Section */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid var(--glass-border)" }}>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--text)" }}>🔗 Referral Link</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
                Share this link — friend gets +1 credit, you get +2 credits
              </p>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs flex-1 truncate px-3 py-2 rounded-xl"
                style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--green)" }}>
                {refLink}
              </code>
              <button onClick={copyRef}
                className="px-3 py-2 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
                {copied === "ref" ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            {refClaimed && (
              <p className="text-xs" style={{ color: "var(--green)" }}>✅ You used a referral link — bonus credit applied!</p>
            )}
          </div>

          {/* User ID */}
          <div className="text-center">
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              Your ID: <span style={{ color: "var(--text-dim)" }}>{userId.slice(0, 16)}...</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
