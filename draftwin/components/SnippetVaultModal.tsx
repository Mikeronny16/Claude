"use client";

import { useState, useEffect } from "react";

interface Snippet {
  id: string;
  label: string;
  text: string;
  createdAt: number;
}

function getSnippets(): Snippet[] {
  try {
    return JSON.parse(localStorage.getItem("draftwin_snippets") ?? "[]");
  } catch {
    return [];
  }
}

function saveSnippets(snippets: Snippet[]) {
  localStorage.setItem("draftwin_snippets", JSON.stringify(snippets.slice(0, 30)));
}

interface Props {
  onClose: () => void;
  initialText?: string;
}

export default function SnippetVaultModal({ onClose, initialText = "" }: Props) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newText, setNewText] = useState(initialText);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(!!initialText);

  useEffect(() => { setSnippets(getSnippets()); }, []);

  function add() {
    if (!newText.trim()) return;
    const updated = [
      { id: crypto.randomUUID(), label: newLabel.trim() || "My snippet", text: newText.trim(), createdAt: Date.now() },
      ...snippets,
    ];
    setSnippets(updated);
    saveSnippets(updated);
    setNewLabel("");
    setNewText("");
    setShowAdd(false);
  }

  function remove(id: string) {
    const updated = snippets.filter(s => s.id !== id);
    setSnippets(updated);
    saveSnippets(updated);
  }

  function copy(s: Snippet) {
    navigator.clipboard.writeText(s.text);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass w-full max-w-md rounded-3xl overflow-hidden" style={{ maxHeight: "88vh", overflowY: "auto" }}>

        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>✂️ Snippet Vault</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>Save your best lines — reuse in any proposal</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAdd(v => !v)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer glow-btn"
              style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
              + Add
            </button>
            <button onClick={onClose} className="text-xl cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>
          </div>
        </div>

        <div className="p-5 space-y-4">

          {showAdd && (
            <div className="space-y-3 p-4 rounded-2xl" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <input
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Label (e.g. Strong opening line)"
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
              />
              <textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="Paste your best line or paragraph here..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--glass-border)", color: "var(--text)" }}
              />
              <button onClick={add} disabled={!newText.trim()}
                className="w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer glow-btn disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
                💾 Save Snippet
              </button>
            </div>
          )}

          {snippets.length === 0 && !showAdd && (
            <div className="text-center py-10 space-y-2">
              <p className="text-3xl">✂️</p>
              <p className="text-sm font-semibold" style={{ color: "var(--text-dim)" }}>No snippets yet</p>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>Save your best proposal lines for quick reuse</p>
              <button onClick={() => setShowAdd(true)}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                style={{ background: "rgba(16,185,129,0.1)", color: "var(--green)", border: "1px solid rgba(16,185,129,0.3)" }}>
                + Add your first snippet
              </button>
            </div>
          )}

          <div className="space-y-2">
            {snippets.map(s => (
              <div key={s.id} className="p-4 rounded-2xl space-y-2"
                style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: "var(--green)" }}>{s.label}</span>
                  <button onClick={() => remove(s.id)}
                    className="text-xs cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {s.text.length > 150 ? s.text.slice(0, 150) + "..." : s.text}
                </p>
                <button onClick={() => copy(s)}
                  className="text-xs px-3 py-1.5 rounded-lg cursor-pointer font-semibold transition-all"
                  style={{
                    background: copiedId === s.id ? "rgba(16,185,129,0.15)" : "rgba(0,0,0,0.1)",
                    color: copiedId === s.id ? "var(--green)" : "var(--text-faint)",
                    border: "1px solid var(--glass-border)",
                  }}>
                  {copiedId === s.id ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
