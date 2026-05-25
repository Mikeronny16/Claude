"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ResultCard from "@/components/ResultCard";

type State = "idle" | "processing" | "done" | "error";

const STEPS = [
  { n: "01", emoji: "📸", title: "Upload Your Photo", desc: "Drop a selfie or any clear face photo" },
  { n: "02", emoji: "🤖", title: "AI Transforms", desc: "Our model converts you into a cute toy figure in ~40s" },
  { n: "03", emoji: "🧸", title: "Download & Share", desc: "Save your toy version and share with friends" },
];

const EXAMPLES = [
  { label: "Kawaii Style", emoji: "🧸" },
  { label: "Action Figure", emoji: "⚔️" },
  { label: "Soft Plushie", emoji: "🪆" },
];

const PROCESSING_MESSAGES = [
  "Sculpting your toy shape...",
  "Adding soft textures...",
  "Painting cute details...",
  "Applying final gloss...",
  "Almost ready! 🧸",
];

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<Blob | null>(null);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);

  function onImage(f: Blob, p: string) {
    setFile(f);
    setPreview(p);
    setResult(null);
    setState("idle");
  }

  async function toyify() {
    if (!file) return;
    setState("processing");
    setErrMsg("");
    setMsgIdx(0);

    const interval = setInterval(() => {
      setMsgIdx(prev => Math.min(prev + 1, PROCESSING_MESSAGES.length - 1));
    }, 10000);

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/transform", { method: "POST", body: form });
      const { id, error } = await res.json();
      if (error) throw new Error(error);

      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        const poll = await fetch(`/api/transform?id=${id}`);
        const data = await poll.json();

        if (data.status === "succeeded") {
          clearInterval(interval);
          const output = Array.isArray(data.output) ? data.output[0] : data.output;
          setResult(output);
          setState("done");
          return;
        }
        if (data.status === "failed" || data.error) {
          clearInterval(interval);
          throw new Error(data.error || "Transform failed");
        }
      }
      clearInterval(interval);
      throw new Error("Timed out after 3 minutes");
    } catch (err: unknown) {
      clearInterval(interval);
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrMsg(msg);
      setState("error");
    }
  }

  function reset() {
    setPreview(null);
    setFile(null);
    setResult(null);
    setState("idle");
    setMsgIdx(0);
  }

  const purple = "#8B5CF6";

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10 gap-8" style={{ background: "#07070F" }}>

      {/* Hero */}
      <div className="text-center space-y-3 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: `${purple}18`, border: `1px solid ${purple}40`, color: purple }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: purple, display: "inline-block", animation: "pulse 2s infinite" }} />
          Free · No signup · AI-powered
        </div>
        <h1 className="text-5xl font-black tracking-tight glow-text">
          TOY<span style={{ color: purple }}>NAR</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Upload your photo — AI transforms you into a<br />
          <span style={{ color: "white", fontWeight: 700 }}>collectible toy figure 🧸</span> in ~40 seconds
        </p>
      </div>

      {/* Main tool */}
      <div className="w-full max-w-md space-y-6">
        {state === "idle" && !preview && (
          <>
            <UploadZone onImage={onImage} />

            {/* How it works */}
            <div className="space-y-3">
              <p className="text-xs font-bold tracking-widest text-center" style={{ color: "#555" }}>HOW IT WORKS</p>
              <div className="grid grid-cols-3 gap-3">
                {STEPS.map(s => (
                  <div key={s.n} className="text-center space-y-2 p-3 rounded-2xl"
                    style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.12)" }}>
                    <div className="text-2xl">{s.emoji}</div>
                    <p className="text-[10px] font-bold" style={{ color: purple, letterSpacing: "0.05em" }}>{s.n}</p>
                    <p className="text-xs font-semibold text-white leading-tight">{s.title}</p>
                    <p className="text-[10px] text-gray-500 leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Example styles */}
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest text-center" style={{ color: "#555" }}>WHAT YOU GET</p>
              <div className="flex gap-2">
                {EXAMPLES.map(e => (
                  <div key={e.label} className="flex-1 py-3 px-2 rounded-xl text-center"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="text-3xl mb-1">{e.emoji}</div>
                    <p className="text-[10px] text-gray-500 font-semibold">{e.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-4 py-2">
              {[["🧸", "10K+", "toys made"], ["⚡", "~40s", "generation"], ["❤️", "Free", "to try"]].map(([emoji, val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-base">{emoji}</div>
                  <div className="text-sm font-bold text-white">{val}</div>
                  <div className="text-[10px] text-gray-600">{label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Preview + Button */}
        {preview && state !== "done" && (
          <div className="space-y-4">
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full rounded-2xl border border-[#1E1E35]" />
              <button onClick={reset}
                className="absolute top-2 right-2 bg-black/70 rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-black/90 transition-colors">
                ✕
              </button>
            </div>

            {state === "idle" && (
              <button onClick={toyify}
                className="w-full py-4 rounded-2xl font-bold text-lg glow-btn cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${purple}, #EC4899)` }}>
                🧸 Toyify Me!
              </button>
            )}

            {state === "processing" && (
              <div className="text-center space-y-4 py-2">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-transparent"
                    style={{ borderTopColor: purple, animation: "spin 0.9s linear infinite" }} />
                  <div className="absolute inset-2 rounded-full border-2 border-transparent"
                    style={{ borderTopColor: "#EC4899", animation: "spin 1.4s linear infinite reverse" }} />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">🧸</div>
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: purple }}>{PROCESSING_MESSAGES[msgIdx]}</p>
                  <p className="text-gray-600 text-xs mt-1">This takes ~30–60 seconds</p>
                </div>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full"
                      style={{ background: purple, opacity: 0.3 + (i * 0.2), animation: `bounce ${0.6 + i * 0.1}s ease-in-out infinite alternate` }} />
                  ))}
                </div>
              </div>
            )}

            {state === "error" && (
              <div className="text-center space-y-3 p-4 rounded-2xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-red-400 text-sm">❌ {errMsg}</p>
                <div className="flex gap-3">
                  <button onClick={() => setState("idle")}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold cursor-pointer"
                    style={{ color: purple, border: `1px solid ${purple}40` }}>
                    Try again
                  </button>
                  <button onClick={reset}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold cursor-pointer"
                    style={{ color: "#888", border: "1px solid rgba(255,255,255,0.08)" }}>
                    New photo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {state === "done" && result && preview && (
          <div className="space-y-4">
            <div className="text-center py-2 space-y-1">
              <div className="text-3xl">🎉</div>
              <p className="font-bold text-white">Your toy is ready!</p>
              <p className="text-xs text-gray-500">Download or share with friends</p>
            </div>
            <ResultCard original={preview} result={result} />
            <button onClick={reset}
              className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors hover:text-white"
              style={{ border: "1px solid rgba(139,92,246,0.2)", color: "#888" }}>
              🔄 Try another photo
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-700 text-xs">Free · No signup · Powered by AI · Made by Mike Ronny</p>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bounce { from{transform:translateY(0)} to{transform:translateY(-6px)} }
      `}</style>
    </main>
  );
}
