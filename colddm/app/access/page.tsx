"use client";

import { useState } from "react";
import { SCRIPTS } from "@/lib/scripts";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const VALID_CODES = (process.env.NEXT_PUBLIC_DOWNLOAD_CODES || "CDM2025,COLDDM").split(",");

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!VALID_CODES.includes(code.trim().toUpperCase())) {
      setError("Invalid access code. Please check the email from Mike.");
      return;
    }
    setError("");
    setDownloading(true);

    const lines: string[] = [
      "═══════════════════════════════════════════════════",
      "   COLDDM SCRIPTS — 30 FREELANCER SCRIPT KIT",
      "═══════════════════════════════════════════════════",
      "",
      "Copy a script → replace [BRACKETS] with your info → send.",
      "Works for Instagram DMs, cold emails, follow-ups & more.",
      "",
    ];

    const categories = Array.from(new Set(SCRIPTS.map((s) => s.category)));
    for (const cat of categories) {
      const catScripts = SCRIPTS.filter((s) => s.category === cat);
      lines.push(`\n─── ${cat.toUpperCase()} (${catScripts.length} scripts) ───\n`);
      catScripts.forEach((s, i) => {
        lines.push(`${i + 1}. ${s.title}`);
        lines.push(s.script);
        lines.push("");
      });
    }
    lines.push("═══════════════════════════════════════════════════");
    lines.push("colddm.vercel.app · © 2025 ColdDM Scripts");

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ColdDM-Scripts-30-Freelancer-Scripts.txt";
    a.click();
    URL.revokeObjectURL(url);

    setSuccess(true);
    setDownloading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
      style={{ background: "#0d1117" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #00c2ff 0%, #0075ff 40%, transparent 70%)" }} />

      <div className="w-full max-w-sm relative">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: "linear-gradient(135deg, #00c2ff, #2563eb)" }}>C</div>
          <span className="font-bold text-white">ColdDM Scripts</span>
        </div>

        {!success ? (
          <div className="rounded-2xl p-6"
            style={{ background: "#161b27", border: "1px solid rgba(0,194,255,0.25)" }}>
            <h1 className="text-xl font-black text-white mb-2">Enter Access Code</h1>
            <p className="text-sm mb-6" style={{ color: "#64748b" }}>
              Enter the code sent to your email after payment.
            </p>

            <form onSubmit={handleDownload} className="space-y-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. CDM2025"
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none uppercase tracking-widest font-bold"
                style={{ background: "rgba(10,14,22,0.8)", border: "1px solid #1e2a3d" }}
                autoFocus
              />
              {error && <p className="text-xs" style={{ color: "#f87171" }}>⚠️ {error}</p>}
              <button type="submit" disabled={downloading || !code}
                className="w-full py-3 font-black rounded-xl text-white text-sm btn-blue">
                {downloading ? "Preparing download..." : "⬇️ Download My Scripts"}
              </button>
            </form>

            <p className="text-xs text-center mt-4" style={{ color: "#334155" }}>
              Didn&apos;t get a code?{" "}
              <a href="mailto:mikeronny18@gmail.com" style={{ color: "#00c2ff" }}>Email us</a>
            </p>
          </div>
        ) : (
          <div className="rounded-2xl p-6 text-center"
            style={{ background: "#161b27", border: "1px solid rgba(34,197,94,0.2)" }}>
            <div className="text-4xl mb-3">🎉</div>
            <h1 className="text-xl font-black text-white mb-2">Download Started!</h1>
            <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
              Your 30 cold DM scripts are downloading now.
            </p>
            <a href="/" className="text-xs" style={{ color: "#00c2ff" }}>← Back to ColdDM Scripts</a>
          </div>
        )}
      </div>
    </main>
  );
}
