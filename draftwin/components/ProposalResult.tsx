"use client";

import { useState } from "react";
import { Translations } from "@/lib/i18n";

interface Props {
  proposal: string;
  score: number | null;
  creditsLeft: number;
  onRegenerate: () => void;
  onBuy: () => void;
  loading: boolean;
  translations: Translations;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 8 ? "#10B981" : score >= 6 ? "#F59E0B" : "#EF4444";
  const label = score >= 8 ? "Strong" : score >= 6 ? "Good" : "Weak";
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
      style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
      <span>{score}/10</span>
      <span style={{ opacity: 0.7 }}>· {label}</span>
    </div>
  );
}

export default function ProposalResult({ proposal, score, creditsLeft, onRegenerate, onBuy, loading, translations: T }: Props) {
  const [text, setText] = useState(proposal);
  const [copied, setCopied] = useState(false);
  const [edited, setEdited] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proposal-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function sendViaEmail() {
    if (!sendEmail.trim()) return;
    const subject = encodeURIComponent("My Proposal");
    const body = encodeURIComponent(text);
    window.open(`mailto:${sendEmail.trim()}?subject=${subject}&body=${body}`, "_blank");
    setShowEmailInput(false);
    setSendEmail("");
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    setEdited(true);
  }

  function reset() {
    setText(proposal);
    setEdited(false);
  }

  return (
    <div className="space-y-4">
      <div className="glass p-6 md:p-8">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--green)" }} />
            <span className="font-semibold text-sm" style={{ color: "var(--green)" }}>Ready to send</span>
          </div>
          <div className="flex items-center gap-2">
            {score !== null && <ScoreBadge score={score} />}
            {edited && (
              <button onClick={reset} className="text-xs px-2 py-1 rounded-lg cursor-pointer transition-all"
                style={{ color: "var(--text-faint)", border: "1px solid var(--glass-border)" }}>
                ↩ Reset
              </button>
            )}
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>{creditsLeft} credit{creditsLeft !== 1 ? "s" : ""} left</span>
          </div>
        </div>

        <textarea
          value={text}
          onChange={handleChange}
          rows={12}
          className="w-full text-sm leading-relaxed p-4 rounded-xl resize-none"
          style={{
            background: "rgba(0,0,0,0.15)",
            border: `1px solid ${edited ? "var(--green)" : "var(--glass-border)"}`,
            color: "var(--text-dim)",
            fontFamily: "inherit",
          }}
        />
        {edited && (
          <p className="text-xs mt-2" style={{ color: "var(--text-faint)" }}>✏️ Edited — copy when ready</p>
        )}
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
      <div className="grid grid-cols-2 gap-3">
        <button onClick={download}
          className="py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
          ⬇️ Download .txt
        </button>
        <button onClick={() => setShowEmailInput(v => !v)}
          className="py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
          📤 Send via Email
        </button>
      </div>

      {showEmailInput && (
        <div className="flex gap-2">
          <input
            type="email"
            value={sendEmail}
            onChange={e => setSendEmail(e.target.value)}
            placeholder="recipient@email.com"
            className="flex-1 px-4 py-2.5 text-sm"
            onKeyDown={e => e.key === "Enter" && sendViaEmail()}
          />
          <button onClick={sendViaEmail}
            className="px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer glow-btn shrink-0"
            style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
            Send
          </button>
        </div>
      )}

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
