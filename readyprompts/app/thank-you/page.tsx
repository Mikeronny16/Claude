"use client";

import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-cinema-bg flex flex-col items-center justify-center px-5 py-16 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }} />

      <div className="relative max-w-md w-full">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, #f97316, #3b82f6)" }}>R</div>
          <span className="font-bold text-white">ReadyPrompts</span>
        </div>

        <div className="rounded-3xl p-8"
          style={{ background: "rgba(10,15,26,0.9)", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 0 60px rgba(249,115,22,0.1)" }}>
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-black text-white mb-2">Payment Sent!</h1>
          <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
            Thank you! Mike will review your payment and send your access code to your email within a few hours.
          </p>
          <div className="rounded-xl p-4 mb-6 text-left space-y-2"
            style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
            <p className="text-xs font-bold" style={{ color: "#fb923c" }}>Next steps:</p>
            <p className="text-sm" style={{ color: "#94a3b8" }}>1. Mike sends you an access code (few hours)</p>
            <p className="text-sm" style={{ color: "#94a3b8" }}>2. Go to <span style={{ color: "#f97316" }}>/access</span> and enter your code</p>
            <p className="text-sm" style={{ color: "#94a3b8" }}>3. Download your 120 AI prompts instantly</p>
          </div>
          <Link href="/access"
            className="block w-full py-4 text-base font-black rounded-xl btn-orange mb-3">
            I have my code → Enter it here
          </Link>
          <Link href="/"
            className="block w-full py-3 text-sm font-semibold rounded-xl text-center"
            style={{ background: "rgba(30,41,59,0.6)", color: "#64748b", border: "1px solid rgba(30,41,59,0.8)" }}>
            ← Back to home
          </Link>
        </div>

        <p className="text-xs mt-6" style={{ color: "#1e293b" }}>
          Questions? mikeronny18@gmail.com
        </p>
      </div>
    </main>
  );
}
