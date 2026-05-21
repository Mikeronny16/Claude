"use client";

import { useState, useEffect } from "react";
import { getHistory, deleteFromHistory, updateHistoryStatus, formatDate, HistoryEntry, ProposalStatus } from "@/lib/history";
import { Translations } from "@/lib/i18n";
import ShareWinModal from "@/components/ShareWinModal";

interface Props { onClose: () => void; translations: Translations; }

const STATUS_CONFIG: Record<NonNullable<ProposalStatus>, { emoji: string; label: string; color: string }> = {
  sent:  { emoji: "📤", label: "Sent",  color: "#60A5FA" },
  won:   { emoji: "🏆", label: "Won",   color: "#10B981" },
  lost:  { emoji: "❌", label: "Lost",  color: "#EF4444" },
};

export default function HistoryModal({ onClose, translations: T }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [showShareWin, setShowShareWin] = useState(false);
  const [shareWinClientName, setShareWinClientName] = useState<string | undefined>(undefined);

  useEffect(() => { setEntries(getHistory()); }, []);

  function reload() {
    const updated = getHistory();
    setEntries(updated);
    if (selected) {
      const fresh = updated.find(e => e.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }

  function remove(id: string) {
    deleteFromHistory(id);
    if (selected?.id === id) setSelected(null);
    reload();
  }

  function setStatus(id: string, status: ProposalStatus) {
    updateHistoryStatus(id, status);
    reload();
    if (status === "won") {
      const entry = entries.find(e => e.id === id);
      setShareWinClientName(entry?.clientName);
      setShowShareWin(true);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const sent = entries.filter(e => e.status === "sent" || e.status === "won" || e.status === "lost");
  const won = entries.filter(e => e.status === "won");
  const winRate = sent.length > 0 ? Math.round((won.length / sent.length) * 100) : null;

  return (
    <>
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="glass modal-content w-full max-w-lg rounded-3xl overflow-hidden" style={{ maxHeight: "85vh" }}>

        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>{T.historyTitle}</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{entries.length} saved proposals</p>
          </div>
          <button onClick={onClose} className="text-xl cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>
        </div>

        {/* Win Rate Stats */}
        {sent.length > 0 && !selected && (
          <div className="px-5 py-3 border-b flex items-center gap-4" style={{ borderColor: "var(--glass-border)", background: "rgba(16,185,129,0.03)" }}>
            {[
              { label: "Sent", value: sent.length, color: "#60A5FA" },
              { label: "Won", value: won.length, color: "#10B981" },
              { label: "Win Rate", value: winRate !== null ? `${winRate}%` : "—", color: winRate !== null && winRate >= 50 ? "#10B981" : "#F59E0B" },
            ].map(stat => (
              <div key={stat.label} className="text-center flex-1">
                <div className="font-extrabold text-lg" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs" style={{ color: "var(--text-faint)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-16 space-y-2" style={{ color: "var(--text-faint)" }}>
            <div className="text-4xl">📋</div>
            <p>{T.historyEmpty}</p>
          </div>
        ) : selected ? (
          <div className="flex flex-col" style={{ maxHeight: "calc(85vh - 70px)" }}>
            <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: "var(--glass-border)" }}>
              <button onClick={() => setSelected(null)} className="text-sm cursor-pointer" style={{ color: "var(--green)" }}>← Back</button>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{selected.yourName} → {selected.clientName}</p>
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>{formatDate(selected.timestamp)}</p>
              </div>
              {selected.score !== null && selected.score !== undefined && (
                <span className="text-xs font-bold px-2 py-1 rounded-lg shrink-0"
                  style={{ background: selected.score >= 8 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: selected.score >= 8 ? "#10B981" : "#F59E0B" }}>
                  {selected.score}/10
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
                {selected.proposal}
              </div>

              {/* Status Tracker */}
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Track this proposal</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(STATUS_CONFIG) as [NonNullable<ProposalStatus>, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
                    <button key={key}
                      onClick={() => setStatus(selected.id, selected.status === key ? null : key)}
                      className="py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                      style={{
                        background: selected.status === key ? `${cfg.color}18` : "var(--glass)",
                        border: `1px solid ${selected.status === key ? `${cfg.color}50` : "var(--glass-border)"}`,
                        color: selected.status === key ? cfg.color : "var(--text-dim)",
                      }}>
                      {cfg.emoji} {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 flex gap-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <button onClick={() => copy(selected.proposal)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer glow-btn"
                style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
                {copied ? T.btnCopied : T.btnCopy}
              </button>
              <button onClick={() => remove(selected.id)}
                className="px-4 py-3 rounded-xl text-sm cursor-pointer transition-all"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.7)" }}>
                🗑
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 70px)" }}>
            {entries.map(entry => (
              <button key={entry.id} onClick={() => setSelected(entry)}
                className="w-full text-left px-5 py-4 transition-colors cursor-pointer hover:bg-emerald-500/5 border-b"
                style={{ borderColor: "var(--glass-border)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{entry.yourName} <span style={{ color: "var(--text-faint)" }}>→</span> {entry.clientName}</p>
                      {entry.status && STATUS_CONFIG[entry.status] && (
                        <span className="text-xs">{STATUS_CONFIG[entry.status].emoji}</span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-dim)" }}>{entry.skills}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{formatDate(entry.timestamp)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {entry.score !== null && entry.score !== undefined && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ background: entry.score >= 8 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: entry.score >= 8 ? "#10B981" : "#F59E0B" }}>
                        {entry.score}/10
                      </span>
                    )}
                    <span className="text-lg" style={{ color: "var(--green)" }}>›</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    {showShareWin && (
      <ShareWinModal onClose={() => setShowShareWin(false)} clientName={shareWinClientName} />
    )}
    </>
  );
}
