"use client";

import { useState } from "react";

const PACKAGES = [
  { id: "starter", credits: 20, usd: 5, label: "Starter", note: "Try it out" },
  { id: "pro", credits: 70, usd: 15, label: "Pro", note: "Most popular", highlight: true },
  { id: "unlimited", credits: 200, usd: 39, label: "Power", note: "Best value" },
];

interface Props { userId: string; onClose: () => void; }
type Step = "pick" | "paying" | "done" | "gmail-sent";
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

  function openGmail(pkg: typeof PACKAGES[0]) {
    const subject = encodeURIComponent(`DraftWin Credits - ${pkg.label} Package ($${pkg.usd})`);
    const body = encodeURIComponent(
      `Hi Mike,\n\nI want to buy the ${pkg.label} package — ${pkg.credits} credits for $${pkg.usd}.\n\nMy DraftWin User ID: ${userId}\n\nPlease let me know how to send payment.\n\nThank you!`
    );
    window.open(`https://mail.google.com/mail/?view=cm&to=mikeronny18@gmail.com&su=${subject}&body=${body}`, "_blank");
    setStep("gmail-sent");
  }

  function copyAddress() {
    if (!payInfo) return;
    navigator.clipboard.writeText(payInfo.payAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
      <div className="glass w-full max-w-md p-6 space-y-5 relative rounded-3xl" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} className="absolute top-5 right-5 text-xl cursor-pointer" style={{ color: "var(--text-faint)" }}>✕</button>

        {step === "pick" && (
          <>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Buy Credits</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>Pay with USDT on BSC — instant, no bank needed</p>
            </div>

            {/* USDT Packages */}
            <div className="space-y-3">
              {PACKAGES.map(pkg => (
                <button key={pkg.id} onClick={() => selectPackage(pkg.id)} disabled={loading}
                  className="w-full p-4 rounded-2xl text-left cursor-pointer transition-all glass-hover"
                  style={{
                    background: pkg.highlight ? "rgba(16,185,129,0.08)" : "var(--glass)",
                    border: `1px solid ${pkg.highlight ? "rgba(16,185,129,0.4)" : "var(--glass-border)"}`,
                  }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: "var(--text)" }}>{pkg.label}</span>
                        {pkg.highlight && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.2)", color: "var(--green)" }}>Popular</span>}
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: "var(--text-faint)" }}>{pkg.credits} proposals · {pkg.note}</p>
                    </div>
                    <span className="text-2xl font-black" style={{ color: "var(--green)" }}>${pkg.usd}</span>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-center" style={{ color: "var(--text-faint)" }}>Credits never expire · One-time purchase</p>

            {/* Myanmar Manual Payment */}
            <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)" }}>
              <div className="flex items-center gap-2">
                <span>🇲🇲</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#FBBF24" }}>Myanmar Users</p>
                  <p className="text-xs" style={{ color: "var(--text-faint)" }}>No crypto? Contact directly via Gmail — we&apos;ll sort it out.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PACKAGES.map(pkg => (
                  <button key={pkg.id} onClick={() => openGmail(pkg)}
                    className="py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all text-center"
                    style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "#FBBF24" }}>
                    <div className="font-bold">${pkg.usd}</div>
                    <div className="opacity-70">{pkg.credits} credits</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-center" style={{ color: "var(--text-faint)" }}>Opens Gmail → email Mike directly → credits added manually</p>
            </div>
          </>
        )}

        {step === "paying" && payInfo && (
          <>
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Send Payment</h2>
            <div className="space-y-3 p-4 rounded-2xl" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-faint)" }}>Amount</span>
                <span className="font-bold" style={{ color: "var(--text)" }}>{payInfo.payAmount} {payInfo.payCurrency.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-faint)" }}>Network</span>
                <span style={{ color: "var(--text)" }}>BSC (BNB Smart Chain)</span>
              </div>
              <div className="space-y-2">
                <span className="text-sm" style={{ color: "var(--text-faint)" }}>Send to address</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs break-all flex-1" style={{ color: "var(--green)" }}>{payInfo.payAddress}</code>
                  <button onClick={copyAddress} className="text-xs px-3 py-1.5 rounded-lg shrink-0 cursor-pointer font-semibold"
                    style={{ background: "rgba(16,185,129,0.2)", color: "var(--green)" }}>
                    {copied ? "✓" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-amber-400 text-xs">⚠️ BSC network only. Wrong network = lost funds.</p>
            <button onClick={() => setStep("done")}
              className="w-full py-3.5 rounded-xl font-bold cursor-pointer glow-btn"
              style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
              I&apos;ve Sent the Payment ✅
            </button>
          </>
        )}

        {step === "done" && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Payment Sent!</h2>
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>Credits will appear within 1–5 minutes. Refresh to see them.</p>
            <button onClick={onClose} className="w-full py-3.5 rounded-xl font-bold cursor-pointer glow-btn"
              style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
              Got It
            </button>
          </div>
        )}

        {step === "gmail-sent" && (
          <div className="text-center space-y-4 py-4">
            <div className="text-5xl">📧</div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Email Opened!</h2>
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>Send the email to Mike — credits will be added manually within a few hours.</p>
            <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#FBBF24" }}>
              mikeronny18@gmail.com
            </div>
            <button onClick={onClose} className="w-full py-3.5 rounded-xl font-bold cursor-pointer glow-btn"
              style={{ background: "linear-gradient(135deg, var(--green), var(--green-dim))", color: "white" }}>
              Got It ✅
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
