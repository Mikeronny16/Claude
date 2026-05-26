"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

type PaymentStatus = "pending" | "waiting" | "confirmed" | "paid" | "failed";

function SpinnerIcon() {
  return (
    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function DirectDownload() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const { PROMPTS } = await import("@/lib/prompts");
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
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="rounded-3xl p-8"
      style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 0 60px rgba(249,115,22,0.1)" }}>
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-black text-white mb-2">Payment Confirmed!</h1>
      <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
        Your 120 AI prompts are ready to download.
      </p>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full py-4 text-base font-black rounded-xl btn-orange mb-4">
        {downloading ? (
          <span className="flex items-center justify-center gap-2">
            <SpinnerIcon /> Preparing download...
          </span>
        ) : (
          "⬇️ Download 120 AI Prompts"
        )}
      </button>
      <div className="text-xs space-y-1" style={{ color: "#475569" }}>
        <p>Save this page · Download link stays active</p>
        <p>File: ReadyPrompts-105-AI-Prompts.txt</p>
      </div>
    </div>
  );
}

function PaymentPoller({ paymentId }: { paymentId: string }) {
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [attempts, setAttempts] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);

  const generateToken = useCallback(async (pid: string) => {
    const secret = "rp_secret_2024";
    const encoder = new TextEncoder();
    const data = encoder.encode(pid + secret);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }, []);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/payment/status?payment_id=${paymentId}`);
      const data = await res.json();
      if (data.paid) {
        setStatus("paid");
        generateToken(paymentId).then(setDownloadToken);
      } else if (["waiting", "confirming", "sending"].includes(data.status)) {
        setStatus("waiting");
      } else if (["failed", "expired"].includes(data.status)) {
        setStatus("failed");
      }
    } catch {
      // keep polling
    }
    setAttempts((a) => a + 1);
  }, [paymentId, generateToken]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(() => {
      setAttempts((a) => {
        if (a >= 60) {
          clearInterval(interval);
        }
        return a;
      });
      checkStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const handleDownload = async () => {
    setDownloading(true);
    if (downloadToken) {
      window.location.href = `/api/download?payment_id=${paymentId}&token=${downloadToken}`;
    }
    setTimeout(() => setDownloading(false), 3000);
  };

  if (status === "paid") {
    return (
      <div className="rounded-3xl p-8"
        style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 0 60px rgba(249,115,22,0.1)" }}>
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-white mb-2">Payment Confirmed!</h1>
        <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
          Your 120 AI prompts are ready to download.
        </p>
        <button
          onClick={handleDownload}
          disabled={downloading || !downloadToken}
          className="w-full py-4 text-base font-black rounded-xl btn-orange mb-4">
          {downloading ? (
            <span className="flex items-center justify-center gap-2">
              <SpinnerIcon /> Preparing download...
            </span>
          ) : (
            "⬇️ Download 120 AI Prompts"
          )}
        </button>
        <div className="text-xs space-y-1" style={{ color: "#475569" }}>
          <p>File: ReadyPrompts-105-AI-Prompts.txt</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-3xl p-8"
        style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(239,68,68,0.25)" }}>
        <div className="text-5xl mb-4">😕</div>
        <h1 className="text-xl font-black text-white mb-2">Payment Expired or Failed</h1>
        <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
          Your payment window expired or the transaction failed. No charges were made.
        </p>
        <Link href="/"
          className="block w-full py-3 text-base font-bold rounded-xl text-center"
          style={{ background: "rgba(30,41,59,0.8)", color: "#94a3b8", border: "1px solid rgba(30,41,59,0.8)" }}>
          ← Try again
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-8"
      style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(59,130,246,0.25)" }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <svg className="animate-spin w-8 h-8" style={{ color: "#3b82f6" }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <h1 className="text-xl font-black text-white mb-2">
        {status === "waiting" ? "Payment Received!" : "Waiting for Payment..."}
      </h1>
      <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
        {status === "waiting"
          ? "Confirming on blockchain. Usually 1-3 minutes."
          : "Complete your crypto payment. This page updates automatically."}
      </p>
      <div className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(59,130,246,0.08)", color: "#60a5fa" }}>
        🔄 Checking every 5 seconds... ({attempts} checks)
      </div>
    </div>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id") || searchParams.get("NP_id");

  return (
    <main className="min-h-screen bg-cinema-bg flex flex-col items-center justify-center px-5 py-16 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] opacity-8 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }} />

      <div className="relative max-w-md w-full">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
          <span className="font-bold text-white">ReadyPrompts</span>
        </div>

        {paymentId ? <PaymentPoller paymentId={paymentId} /> : <DirectDownload />}

        <p className="text-xs mt-6" style={{ color: "#1e293b" }}>
          Questions? hello@readyprompts.com
        </p>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-cinema-bg flex items-center justify-center">
        <div className="text-cinema-muted">Loading...</div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
