"use client";

import { useState, useEffect } from "react";
import { getHistory, deleteFromHistory, formatDate, HistoryEntry } from "@/lib/history";

interface Props { onClose: () => void; }

export default function HistoryModal({ onClose }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setEntries(getHistory()); }, []);

  function remove(id: string) {
    deleteFromHistory(id);
    setEntries(getHistory());
    if (selected?.id === id) setSelected(null);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="glass w-full max-w-lg rounded-3xl overflow-hidden" style={{ maxHeight: "85vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>Proposal History</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{entries.length} saved proposals</p>
          </div>
          <button onClick={onClose} className="text-xl cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16 space-y-2" style={{ color: "var(--text-faint)" }}>
            <div className="text-4xl">📋</div>
            <p>No proposals yet</p>
            <p className="text-xs">Generate your first proposal to see it here</p>
          </div>
        ) : selected ? (
          /* Detail view */
          <div className="flex flex-col" style={{ maxHeight: "calc(85vh - 70px)" }}>
            <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: "var(--glass-border)" }}>
              <button onClick={() => setSelected(null)} className="text-sm cursor-pointer" style={{ color: "var(--green)" }}>← Back</button>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{selected.yourName} → {selected.clientName}</p>
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>{formatDate(selected.timestamp)}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
                {selected.proposal}
              </div>
            </div>
            <div className="p-4 flex gap-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <button onClick={() => copy(selected.proposal)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer glow-btn"
                style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
              <button onClick={() => remove(selected.id)}
                className="px-4 py-3 rounded-xl text-sm cursor-pointer transition-all"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.7)" }}>
                🗑
              </button>
            </div>
          </div>
        ) : (
          /* List view */
          <div className="overflow-y-auto divide-y" style={{ maxHeight: "calc(85vh - 70px)", borderColor: "var(--glass-border)" }}>
            {entries.map(entry => (
              <button key={entry.id} onClick={() => setSelected(entry)}
                className="w-full text-left px-5 py-4 transition-colors cursor-pointer hover:bg-emerald-500/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {entry.yourName} <span style={{ color: "var(--text-faint)" }}>→</span> {entry.clientName}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-dim)" }}>{entry.skills}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{formatDate(entry.timestamp)}</p>
                  </div>
                  <span className="text-lg shrink-0" style={{ color: "var(--green)" }}>›</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
