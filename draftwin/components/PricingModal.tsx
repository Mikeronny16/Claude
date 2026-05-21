"use client";

import { useState } from "react";

const PACKAGES = [
  { id: "starter", credits: 20, usd: 5, label: "Starter", note: "Try it out" },
  { id: "pro", credits: 70, usd: 15, label: "Pro", note: "Most popular", highlight: true },
  { id: "unlimited", credits: 200, usd: 39, label: "Power", note: "Best value" },
];

interface Props {
  userId: string;
  onClose: () => void;
}

type Step = "pick" | "paying" | "done";

interface PaymentInfo {
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  credits: number;
}

export default function PricingModal({ userId, onClose }: Props) {
  const [step, setStep] = useState<Step>("pick");
  const [payInfo, setPayInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function selectPackage(packageId: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, packageId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPayInfo(data);
      setStep("paying");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating payment");
    } finally {
      setLoading(false);
    }
  }

  function copyAddress() {
    if (!payInfo) return;
    navigator.clipboard.writeText(payInfo.payAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 space-y-5 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">✕</button>

        {step === "pick" && (
          <>
            <h2 className="text-xl font-bold glow-text">Buy Credits</h2>
            <p className="text-gray-400 text-sm">Pay with USDT (BSC) — instant, no bank needed</p>
            <div className="space-y-3">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => selectPackage(pkg.id)}
                  disabled={loading}
                  className={`w-full p-4 rounded-xl border text-left transition-all hover:border-purple-500/70 ${
                    pkg.highlight ? "border-purple-500 bg-purple-500/10" : "border-[#1e1e35]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">{pkg.label}</span>
                      {pkg.highlight && <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Popular</span>}
                      <p className="text-sm text-gray-400 mt-0.5">{pkg.credits} proposals · {pkg.note}</p>
                    </div>
                    <span className="text-2xl font-black text-purple-400">${pkg.usd}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 text-center">Credits never expire · One-time purchase</p>
          </>
        )}

        {step === "paying" && payInfo && (
          <>
            <h2 className="text-xl font-bold">Send Payment</h2>
            <div className="bg-[#0a0a12] border border-[#1e1e35] rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Amount</span>
                <span className="font-bold text-white">{payInfo.payAmount} {payInfo.payCurrency.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Network</span>
                <span className="text-white">BSC (BNB Smart Chain)</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 text-sm">Send to address</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-purple-300 break-all flex-1">{payInfo.payAddress}</code>
                  <button onClick={copyAddress} className="text-xs bg-purple-600 px-2 py-1 rounded shrink-0">
                    {copied ? "✓" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-yellow-400 text-xs">⚠️ Send exactly {payInfo.payAmount} USDT on BSC network. Wrong network = lost funds.</p>
            <p className="text-gray-500 text-xs">Credits auto-add within 1-5 minutes after confirmation. Come back and refresh.</p>
            <button
              onClick={() => { setStep("done"); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-semibold glow-btn"
            >
              I&apos;ve Sent the Payment ✅
            </button>
          </>
        )}

        {step === "done" && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold">Payment Sent!</h2>
            <p className="text-gray-400 text-sm">Your credits will appear within 1-5 minutes after blockchain confirmation. Refresh the page to see them.</p>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-semibold glow-btn">
              Got It
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
