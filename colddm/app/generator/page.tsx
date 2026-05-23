"use client";

import { useState } from "react";
import Link from "next/link";

const PLATFORMS = [
  { id: "Instagram", icon: "📸" },
  { id: "LinkedIn",  icon: "💼" },
  { id: "TikTok",    icon: "🎬" },
  { id: "Email",     icon: "📧" },
];

type State = "idle" | "loading" | "done" | "error";

export default function GeneratorPage() {
  const [jobTitle, setJobTitle]       = useState("");
  const [targetClient, setTargetClient] = useState("");
  const [platform, setPlatform]       = useState("Instagram");
  const [messages, setMessages]       = useState<string[]>([]);
  const [state, setState]             = useState<State>("idle");
  const [copied, setCopied]           = useState<number | null>(null);

  async function generate() {
    if (!jobTitle.trim() || !targetClient.trim()) return;
    setState("loading");
    setMessages([]);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, targetClient, platform }),
    });

    if (!res.ok) { setState("error"); return; }
    const data = await res.json();
    setMessages(data.messages ?? []);
    setState("done");
  }

  function copy(idx: number) {
    navigator.clipboard?.writeText(messages[idx]);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-2">
        <span className="text-xs font-bold text-[#f97316] tracking-widest uppercase">⚡ ColdFlow AI</span>
      </div>

      <div className="flex-1 px-5 pb-6 space-y-5 max-w-lg mx-auto w-full">

        {/* Job Title */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Your Job Title</label>
          <input
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
            placeholder="e.g., Freelance Video Editor"
            className="w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all"
            style={{
              background: "#1a1a1a",
              border: "1.5px solid #2a2a2a",
            }}
            onFocus={e => (e.target.style.borderColor = "#f97316")}
            onBlur={e => (e.target.style.borderColor = "#2a2a2a")}
          />
        </div>

        {/* Target Client */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Target Client</label>
          <input
            value={targetClient}
            onChange={e => setTargetClient(e.target.value)}
            placeholder="e.g., Restaurant owners"
            className="w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all"
            style={{
              background: "#1a1a1a",
              border: "1.5px solid #2a2a2a",
            }}
            onFocus={e => (e.target.style.borderColor = "#f97316")}
            onBlur={e => (e.target.style.borderColor = "#2a2a2a")}
          />
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Platform</label>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: platform === p.id ? "rgba(249,115,22,0.15)" : "#1a1a1a",
                  border: `1.5px solid ${platform === p.id ? "#f97316" : "#2a2a2a"}`,
                  color: platform === p.id ? "#f97316" : "#64748b",
                }}
              >
                <span>{p.icon}</span> {p.id}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={state === "loading" || !jobTitle.trim() || !targetClient.trim()}
          className="w-full py-4 rounded-xl text-base font-black tracking-wide transition-all"
          style={{
            background: state === "loading" || !jobTitle.trim() || !targetClient.trim()
              ? "#2a2a2a"
              : "linear-gradient(135deg, #f97316, #ea580c)",
            color: state === "loading" || !jobTitle.trim() || !targetClient.trim()
              ? "#4a4a4a"
              : "white",
            boxShadow: state !== "loading" && jobTitle.trim() && targetClient.trim()
              ? "0 0 24px rgba(249,115,22,0.4)"
              : "none",
          }}
        >
          {state === "loading" ? "✨ Generating..." : "✨ Generate Messages"}
        </button>

        {/* Error */}
        {state === "error" && (
          <p className="text-center text-sm text-red-400">Something went wrong — try again.</p>
        )}

        {/* Results */}
        {state === "done" && messages.length > 0 && (
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#64748b]">
              {messages.length} Messages Generated
            </p>
            {messages.map((msg, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#141414", border: "1px solid #2a2a2a" }}
              >
                <div className="px-4 py-2.5 flex items-center justify-between"
                  style={{ borderBottom: "1px solid #2a2a2a" }}>
                  <span className="text-xs font-bold text-[#f97316]">Message {i + 1}</span>
                  <button
                    onClick={() => copy(i)}
                    className="text-xs px-3 py-1 rounded-lg font-semibold transition-all"
                    style={{
                      background: copied === i ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.1)",
                      color: copied === i ? "#4ade80" : "#f97316",
                      border: `1px solid ${copied === i ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.2)"}`,
                    }}
                  >
                    {copied === i ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <p className="px-4 py-3.5 text-sm leading-relaxed text-[#cbd5e1] whitespace-pre-wrap">
                  {msg}
                </p>
              </div>
            ))}

            {/* Upsell */}
            <div
              className="mt-4 p-4 rounded-2xl text-center"
              style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}
            >
              <p className="text-sm font-bold text-white mb-1">Want 30 proven scripts? 📩</p>
              <p className="text-xs text-[#64748b] mb-3">
                Copy-paste scripts for every situation — no AI needed.
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2.5 rounded-xl text-sm font-black"
                style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)" }}
              >
                Get ColdDM Scripts — $5 only →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div
        className="sticky bottom-0 flex items-center justify-around px-6 py-4"
        style={{ background: "#0f0f0f", borderTop: "1px solid #1a1a1a" }}
      >
        <Link href="/generator" className="flex flex-col items-center gap-1">
          <span className="text-lg">✨</span>
          <span className="text-xs font-semibold text-[#f97316]">Generator</span>
        </Link>
        <Link href="/" className="flex flex-col items-center gap-1">
          <span className="text-lg">📋</span>
          <span className="text-xs font-semibold text-[#64748b]">Scripts</span>
        </Link>
        <Link href="https://readyprompts.vercel.app" className="flex flex-col items-center gap-1">
          <span className="text-lg">🚀</span>
          <span className="text-xs font-semibold text-[#64748b]">Prompts</span>
        </Link>
      </div>

    </main>
  );
}
