"use client";

import { useState, useEffect } from "react";
import { Translations } from "@/lib/i18n";

interface Props {
  proposal: string;
  score: number | null;
  creditsLeft: number;
  onRegenerate: () => void;
  onBuy: () => void;
  loading: boolean;
  translations: Translations;
  userId: string;
  clientName?: string;
  yourName?: string;
  onCreditsUpdate?: (n: number) => void;
  onSaveSnippet?: (text: string) => void;
}

function ScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  const radius = 17;
  const circ = 2 * Math.PI * radius;
  const color = score >= 8 ? "#10B981" : score >= 6 ? "#F59E0B" : "#EF4444";
  const label = score >= 8 ? "Strong" : score >= 6 ? "Good" : "Weak";
  const offset = animated ? circ * (1 - score / 10) : circ;
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: 42, height: 42 }}>
        <svg width="42" height="42" viewBox="0 0 42 42" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="21" cy="21" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
          <circle cx="21" cy="21" r={radius} fill="none" stroke={color} strokeWidth="3.5"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.1s ease-out" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-extrabold" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="text-xs font-semibold" style={{ color, opacity: 0.85 }}>· {label}</div>
    </div>
  );
}

export default function ProposalResult({ proposal, score, creditsLeft, onRegenerate, onBuy, loading, translations: T, userId, clientName, yourName, onCreditsUpdate, onSaveSnippet }: Props) {
  const [text, setText] = useState(proposal);
  const [copied, setCopied] = useState(false);
  const [edited, setEdited] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [daysSince, setDaysSince] = useState(3);
  const [followUpText, setFollowUpText] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpCopied, setFollowUpCopied] = useState(false);
  const [localCredits, setLocalCredits] = useState(creditsLeft);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadPDF() {
    import("jspdf").then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text("DraftWin Proposal", margin, 25);

      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.4);
      doc.line(margin, 30, pageWidth - margin, 30);

      doc.setFontSize(10.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);

      const lines = doc.splitTextToSize(text, maxWidth);
      let y = 40;
      for (const line of lines) {
        if (y > doc.internal.pageSize.getHeight() - 25) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 6;
      }

      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Powered by DraftWin — https://claude-hsmg.vercel.app`, margin, pageHeight - 12);
      doc.text(new Date().toLocaleDateString(), pageWidth - margin - 20, pageHeight - 12);

      doc.save(`proposal-${Date.now()}.pdf`);
    });
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

  async function generateFollowUp() {
    setFollowUpLoading(true);
    setFollowUpText("");
    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, originalProposal: text, clientName, yourName, daysSince }),
      });
      const data = await res.json();
      if (data.error === "No credits") { onBuy(); return; }
      if (data.followUp) {
        setFollowUpText(data.followUp);
        setLocalCredits(data.creditsLeft);
        onCreditsUpdate?.(data.creditsLeft);
      }
    } catch {
      // silently fail
    } finally {
      setFollowUpLoading(false);
    }
  }

  function copyFollowUp() {
    navigator.clipboard.writeText(followUpText);
    setFollowUpCopied(true);
    setTimeout(() => setFollowUpCopied(false), 2000);
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
            {score !== null && <ScoreRing score={score} />}
            {edited && (
              <button onClick={reset} className="text-xs px-2 py-1 rounded-lg cursor-pointer transition-all"
                style={{ color: "var(--text-faint)", border: "1px solid var(--glass-border)" }}>
                ↩ Reset
              </button>
            )}
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>{localCredits} credit{localCredits !== 1 ? "s" : ""} left</span>
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
        <button onClick={onRegenerate} disabled={loading || localCredits <= 0}
          className="py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all disabled:opacity-40"
          style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
          {loading ? "..." : T.btnRegenerate}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={downloadPDF}
          className="py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
          📄 Download PDF
        </button>
        <button onClick={() => setShowEmailInput(v => !v)}
          className="py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
          📤 Send via Email
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => { setShowFollowUp(v => !v); setFollowUpText(""); }}
          className="py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: showFollowUp ? "rgba(16,185,129,0.1)" : "var(--glass)",
            border: `1px solid ${showFollowUp ? "rgba(16,185,129,0.4)" : "var(--glass-border)"}`,
            color: showFollowUp ? "var(--green)" : "var(--text-dim)",
          }}>
          💬 Follow-Up Msg
        </button>
        <button onClick={() => onSaveSnippet?.(text)}
          className="py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
          ✂️ Save Snippet
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

      {showFollowUp && (
        <div className="glass p-5 space-y-4" style={{ borderColor: "rgba(16,185,129,0.2)" }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>💬 Follow-Up Message Generator</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>1 credit — generates a natural follow-up to send after your proposal</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: "var(--text-faint)" }}>Days since you sent the proposal</label>
            <div className="flex gap-2">
              {[3, 5, 7, 10].map(d => (
                <button key={d} type="button" onClick={() => setDaysSince(d)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all"
                  style={{
                    background: daysSince === d ? "rgba(16,185,129,0.15)" : "var(--glass)",
                    border: `1px solid ${daysSince === d ? "rgba(16,185,129,0.5)" : "var(--glass-border)"}`,
                    color: daysSince === d ? "var(--green)" : "var(--text-dim)",
                  }}>
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {!followUpText ? (
            <button onClick={generateFollowUp} disabled={followUpLoading || localCredits <= 0}
              className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer glow-btn disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
              {followUpLoading ? "Writing..." : "✨ Generate — 1 Credit"}
            </button>
          ) : (
            <div className="space-y-3">
              <textarea value={followUpText} readOnly rows={5}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none leading-relaxed"
                style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "var(--text-dim)" }}
              />
              <div className="grid grid-cols-2 gap-2">
                <button onClick={copyFollowUp}
                  className="py-2.5 rounded-xl font-bold text-sm cursor-pointer glow-btn"
                  style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
                  {followUpCopied ? "✅ Copied!" : "📋 Copy"}
                </button>
                <button onClick={() => setFollowUpText("")}
                  className="py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
                  🔄 Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {localCredits <= 0 && (
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
