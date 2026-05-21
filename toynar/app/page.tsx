"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ResultCard from "@/components/ResultCard";

type State = "idle" | "processing" | "done" | "error";

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<Blob | null>(null);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState("");

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

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/transform", { method: "POST", body: form });
      const { id, error } = await res.json();
      if (error) throw new Error(error);

      // Poll for result
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        const poll = await fetch(`/api/transform?id=${id}`);
        const data = await poll.json();

        if (data.status === "succeeded") {
          const output = Array.isArray(data.output) ? data.output[0] : data.output;
          setResult(output);
          setState("done");
          return;
        }
        if (data.status === "failed" || data.error) {
          throw new Error(data.error || "Transform failed");
        }
      }
      throw new Error("Timed out");
    } catch (err: unknown) {
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
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 gap-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-black tracking-tight glow-text">
          TOY<span className="text-purple">NAR</span>
        </h1>
        <p className="text-gray-400 text-lg">Turn yourself into a collectible toy 🧸</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Step 1 — Upload */}
        {!preview && <UploadZone onImage={onImage} />}

        {/* Step 2 — Preview + Button */}
        {preview && state !== "done" && (
          <div className="space-y-4">
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full rounded-2xl border border-[#1E1E35]" />
              <button
                onClick={reset}
                className="absolute top-2 right-2 bg-black/60 rounded-full px-3 py-1 text-sm hover:bg-black/80"
              >
                ✕
              </button>
            </div>

            {state === "idle" && (
              <button
                onClick={toyify}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple to-pink-500 font-bold text-lg glow-btn"
              >
                🧸 Toyify Me!
              </button>
            )}

            {state === "processing" && (
              <div className="text-center space-y-3 py-4">
                <div className="flex justify-center">
                  <div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-purple font-semibold animate-pulse">Toyifying your face...</p>
                <p className="text-gray-500 text-sm">This takes about 30–60 seconds</p>
              </div>
            )}

            {state === "error" && (
              <div className="text-center space-y-3">
                <p className="text-red-400">❌ {errMsg}</p>
                <button onClick={() => setState("idle")} className="text-purple underline text-sm">
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Result */}
        {state === "done" && result && preview && (
          <div className="space-y-4">
            <ResultCard original={preview} result={result} />
            <button onClick={reset} className="w-full py-3 rounded-xl border border-[#1E1E35] text-gray-400 hover:text-white hover:border-purple/50 transition-colors">
              Try another photo
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-xs mt-auto">Free · No signup · Powered by AI</p>
    </main>
  );
}
