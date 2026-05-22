"use client";

import { useState } from "react";
import { PROMPTS } from "@/lib/prompts";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const VALID_CODES = (process.env.NEXT_PUBLIC_DOWNLOAD_CODES || "RP2025,READYPROMPTS").split(",");

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!VALID_CODES.includes(code.trim().toUpperCase())) {
      setError("Invalid access code. Please check your email from Mike.");
      return;
    }
    setError("");
    setDownloading(true);

    const lines: string[] = [
      "═══════════════════════════════════════════════════",
      "   READYPROMPTS — 105 ULTIMATE AI PROMPT KIT",
      "═══════════════════════════════════════════════════",
      "",
      "Works with ChatGPT, Claude, Gemini & any AI model.",
      "Replace [BRACKETS] with your specific info.",
      "",
    ];

    const categories = [...new Set(PROMPTS.map((p) => p.category))];
    for (const cat of categories) {
      const catPrompts = PROMPTS.filter((p) => p.category === cat);
      lines.push(`\n─── ${cat.toUpperCase()} (${catPrompts.length} prompts) ───\n`);
      catPrompts.forEach((p, i) => {
        lines.push(`${i + 1}. ${p.title}`);
        lines.push(p.prompt);
        lines.push("");
      });
    }
    lines.push("═══════════════════════════════════════════════════");
    lines.push("readyprompts.vercel.app · © 2025 ReadyPrompts");

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ReadyPrompts-105-AI-Prompts.txt";
    a.click();
    URL.revokeObjectURL(url);

    setSuccess(true);
    setDownloading(false);
  };

  return (
    <main className="min-h-screen bg-cinema-bg flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }} />

      <div className="w-full max-w-sm relative">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
          <span className="font-bold text-white">ReadyPrompts</span>
        </div>

        {!success ? (
          <div className="rounded-2xl p-6"
            style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(249,115,22,0.2)" }}>
            <h1 className="text-xl font-black text-white mb-2">Enter Access Code</h1>
            <p className="text-sm mb-6" style={{ color: "#64748b" }}>
              Enter the code sent to your email after payment.
            </p>

            <form onSubmit={handleDownload} className="space-y-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. RP2025"
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none uppercase tracking-widest font-bold"
                style={{ background: "rgba(15,20,30,0.8)", border: "1px solid rgba(30,41,59,0.8)" }}
                autoFocus
              />
              {error && <p className="text-xs" style={{ color: "#f87171" }}>⚠️ {error}</p>}
              <button type="submit" disabled={downloading || !code}
                className="w-full py-3 font-black rounded-xl text-white text-sm btn-orange">
                {downloading ? "Preparing download..." : "⬇️ Download My Prompts"}
              </button>
            </form>

            <p className="text-xs text-center mt-4" style={{ color: "#334155" }}>
              Didn&apos;t get a code?{" "}
              <a href="mailto:mikeronny18@gmail.com" style={{ color: "#f97316" }}>Email us</a>
            </p>
          </div>
        ) : (
          <div className="rounded-2xl p-6 text-center"
            style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <div className="text-4xl mb-3">🎉</div>
            <h1 className="text-xl font-black text-white mb-2">Download Started!</h1>
            <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
              Your 105 AI prompts are downloading now.
            </p>
            <a href="/" className="text-xs" style={{ color: "#f97316" }}>← Back to ReadyPrompts</a>
          </div>
        )}
      </div>
    </main>
  );
}
