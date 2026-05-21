"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  clientName?: string;
}

export default function ShareWinModal({ onClose, clientName }: Props) {
  const [copied, setCopied] = useState<"linkedin" | "twitter" | null>(null);

  const url = "https://claude-hsmg.vercel.app";

  const linkedinPost = `🏆 Just won a new freelance project${clientName ? ` with ${clientName}` : ""}!

I used an AI tool to write my proposal in under 30 seconds instead of spending 2 hours on it — and it worked.

If you're a freelancer tired of writing proposals that get ignored, try this free tool:
👉 ${url}

No signup needed. Free to use. Game changer for Upwork, Fiverr, and email pitches.

#Freelancing #AI #Upwork #Fiverr #FreelanceTips`;

  const twitterPost = `🏆 Just landed a new project using AI!

Wrote my proposal in 30 seconds with this free tool → ${url}

Free, no signup. Works on Upwork, Fiverr & email.

#Freelancing #AI #Upwork`;

  function copy(type: "linkedin" | "twitter") {
    navigator.clipboard.writeText(type === "linkedin" ? linkedinPost : twitterPost);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  function shareTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterPost)}`, "_blank");
  }

  function shareLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  }

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-[60] p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass modal-content w-full max-w-md rounded-3xl overflow-hidden">

        <div className="p-6 text-center space-y-2 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <div className="text-5xl">🏆</div>
          <h2 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>You Won!</h2>
          <p className="text-sm" style={{ color: "var(--text-faint)" }}>
            Share the win — help other freelancers discover DraftWin
          </p>
        </div>

        <div className="p-5 space-y-3">

          {/* LinkedIn */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--glass-border)" }}>
            <div className="flex items-center justify-between px-4 py-2.5"
              style={{ background: "rgba(10,102,194,0.1)", borderBottom: "1px solid var(--glass-border)" }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔵</span>
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>LinkedIn</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copy("linkedin")}
                  className="text-xs px-2.5 py-1 rounded-lg cursor-pointer font-semibold"
                  style={{ background: "rgba(0,0,0,0.2)", color: "var(--text-faint)" }}>
                  {copied === "linkedin" ? "✅" : "Copy"}
                </button>
                <button onClick={shareLinkedIn}
                  className="text-xs px-3 py-1 rounded-lg cursor-pointer font-bold"
                  style={{ background: "rgba(10,102,194,0.3)", color: "#60A5FA" }}>
                  Share →
                </button>
              </div>
            </div>
            <div className="px-4 py-3 text-xs leading-relaxed"
              style={{ color: "var(--text-faint)", maxHeight: 100, overflowY: "auto" }}>
              {linkedinPost}
            </div>
          </div>

          {/* Twitter */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--glass-border)" }}>
            <div className="flex items-center justify-between px-4 py-2.5"
              style={{ background: "rgba(29,161,242,0.08)", borderBottom: "1px solid var(--glass-border)" }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">🐦</span>
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Twitter / X</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copy("twitter")}
                  className="text-xs px-2.5 py-1 rounded-lg cursor-pointer font-semibold"
                  style={{ background: "rgba(0,0,0,0.2)", color: "var(--text-faint)" }}>
                  {copied === "twitter" ? "✅" : "Copy"}
                </button>
                <button onClick={shareTwitter}
                  className="text-xs px-3 py-1 rounded-lg cursor-pointer font-bold"
                  style={{ background: "rgba(29,161,242,0.2)", color: "#60A5FA" }}>
                  Share →
                </button>
              </div>
            </div>
            <div className="px-4 py-3 text-xs leading-relaxed" style={{ color: "var(--text-faint)" }}>
              {twitterPost}
            </div>
          </div>

          <button onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer"
            style={{ color: "var(--text-faint)", border: "1px solid var(--glass-border)" }}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
