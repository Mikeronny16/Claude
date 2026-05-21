"use client";

import { useRef, useState } from "react";

interface Props {
  message: string;
  senderMood: string | null;
  reaction: string | null;
  username: string;
  displayName: string;
  avatarEmoji: string;
  onClose: () => void;
}

export default function ShareCard({ message, senderMood, reaction, username, displayName, avatarEmoji, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function downloadCard() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement("a");
      link.download = `whispr-message.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // fallback: just copy message
    } finally {
      setDownloading(false);
    }
  }

  function copyMessage() {
    navigator.clipboard.writeText(`${message}\n\n— via whispr.app/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="w-full max-w-sm space-y-4">

        {/* The shareable card */}
        <div ref={cardRef} style={{
          background: "linear-gradient(135deg, #040d1a 0%, #061525 50%, #040f1e 100%)",
          border: "1px solid rgba(6,182,212,0.3)",
          borderRadius: "1.5rem",
          padding: "2rem",
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Glow */}
          <div style={{ position: "absolute", top: "-50%", left: "-20%", width: "140%", height: "200%", background: "radial-gradient(circle at 50% 40%, rgba(6,182,212,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
              {avatarEmoji}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#f0f9ff", fontSize: "0.95rem" }}>{displayName}</div>
              <div style={{ color: "rgba(6,182,212,0.7)", fontSize: "0.75rem" }}>@{username}</div>
            </div>
            {senderMood && <div style={{ marginLeft: "auto", fontSize: "1.75rem" }}>{senderMood}</div>}
          </div>

          {/* Message */}
          <div style={{ color: "#e0f2fe", fontSize: "1rem", lineHeight: 1.65, fontWeight: 500, marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
            &ldquo;{message}&rdquo;
          </div>

          {reaction && (
            <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{reaction}</div>
          )}

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid rgba(6,182,212,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ color: "#06b6d4", fontWeight: 800, fontSize: "0.9rem" }}>Whispr</span>
              <span style={{ color: "rgba(240,249,255,0.3)", fontSize: "0.75rem" }}>👻 anonymous</span>
            </div>
            <div style={{ color: "rgba(6,182,212,0.6)", fontSize: "0.7rem", fontWeight: 600 }}>
              whispr.app/{username}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={downloadCard} disabled={downloading}
            className="py-3 rounded-2xl font-bold text-sm cursor-pointer glow-btn disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "white" }}>
            {downloading ? "Saving..." : "📥 Download Card"}
          </button>
          <button onClick={copyMessage}
            className="py-3 rounded-2xl font-bold text-sm cursor-pointer"
            style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}>
            {copied ? "✅ Copied!" : "📋 Copy Text"}
          </button>
        </div>

        <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>
          Screenshot or download → post on TikTok, IG, Twitter
        </p>

        <button onClick={onClose} className="w-full py-2 text-sm cursor-pointer" style={{ color: "var(--text-faint)" }}>
          Close
        </button>
      </div>
    </div>
  );
}
