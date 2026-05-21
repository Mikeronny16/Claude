"use client";

import { useState } from "react";

const PACKAGES = [
  { id: "starter", credits: 20, usd: 5, label: "Starter", note: "Try it out" },
  { id: "pro", credits: 70, usd: 15, label: "Pro", note: "Most popular", highlight: true },
  { id: "unlimited", credits: 200, usd: 39, label: "Power", note: "Best value" },
];

interface Props { userId: string; onClose: () => void; }
type Step = "pick" | "paying" | "done";
interface PaymentInfo { payAddress: string; payAmount: number; payCurrency: string; credits: number; }

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
      alert(err instanceof Error ? err.message : "Error");
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
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-4"
      style={{background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)"}}>
      <div className="glass w-full max-w-md p-6 space-y-5 relative rounded-3xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-white/30 hover:text-white text-xl cursor-pointer">✕</button>

        {step === "pick" && (
          <>
            <div>
              <h2 className="text-xl font-bold text-white">Buy Credits</h2>
              <p className="text-white/40 text-sm mt-1">Pay with USDT on BSC — instant, no bank needed</p>
            </div>
            <div className="space-y-3">
              {PACKAGES.map(pkg => (
                <button key={pkg.id} onClick={() => selectPackage(pkg.id)} disabled={loading}
                  className="w-full p-4 rounded-2xl text-left cursor-pointer transition-all glass-hover"
                  style={{
                    background: pkg.highlight ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.03)",
                    border: `1px solid ${pkg.highlight ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.1)"}`,
                  }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{pkg.label}</span>
                        {pkg.highlight && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background: "rgba(16,185,129,0.2)", color: "#10B981"}}>Popular</span>}
                      </div>
                      <p className="text-sm text-white/40 mt-0.5">{pkg.credits} proposals · {pkg.note}</p>
                    </div>
                    <span className="text-2xl font-black" style={{color: "#10B981"}}>${pkg.usd}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-white/20 text-center">Credits never expire · One-time purchase</p>
          </>
        )}

        {step === "paying" && payInfo && (
          <>
            <h2 className="text-xl font-bold text-white">Send Payment</h2>
            <div className="space-y-3 p-4 rounded-2xl" style={{background: "rgba(0,0,0,0.3)", border: "1px solid rgba(16,185,129,0.1)"}}>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Amount</span>
                <span className="font-bold text-white">{payInfo.payAmount} {payInfo.payCurrency.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Network</span>
                <span className="text-white">BSC (BNB Smart Chain)</span>
              </div>
              <div className="space-y-2">
                <span className="text-white/40 text-sm">Send to address</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs break-all flex-1" style={{color: "#10B981"}}>{payInfo.payAddress}</code>
                  <button onClick={copyAddress} className="text-xs px-3 py-1.5 rounded-lg shrink-0 cursor-pointer font-semibold"
                    style={{background: "rgba(16,185,129,0.2)", color: "#10B981"}}>
                    {copied ? "✓" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-amber-400 text-xs">⚠️ BSC network only. Wrong network = lost funds.</p>
            <button onClick={() => setStep("done")}
              className="w-full py-3.5 rounded-xl font-bold cursor-pointer glow-btn"
              style={{background: "linear-gradient(135deg, #10B981, #059669)", color: "white"}}>
              I&apos;ve Sent the Payment ✅
            </button>
          </>
        )}

        {step === "done" && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-white">Payment Sent!</h2>
            <p className="text-white/40 text-sm">Credits will appear within 1–5 minutes. Refresh to see them.</p>
            <button onClick={onClose} className="w-full py-3.5 rounded-xl font-bold cursor-pointer glow-btn"
              style={{background: "linear-gradient(135deg, #10B981, #059669)", color: "white"}}>
              Got It
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
