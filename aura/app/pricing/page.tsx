"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Check, Zap, Crown, Globe, X, Copy, ExternalLink } from "lucide-react"

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0",
    currency: "",
    period: "",
    desc: "Try it out",
    color: "#ffffff",
    features: [
      "3 outfit ratings",
      "Basic score card",
      "Watermarked result",
      "Standard mode only",
    ],
    cta: "Get Started Free",
    ctaLink: "/rate",
    highlight: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "5,000",
    currency: "MMK",
    period: "one-time",
    desc: "Most popular",
    color: "#FF00FF",
    features: [
      "10 outfit ratings",
      "HD result cards",
      "No watermark",
      "All 3 rating modes",
      "Share to Instagram/TikTok",
    ],
    cta: "Buy with KBZPay / Wave",
    highlight: true,
    credits: 10,
  },
  {
    id: "pro",
    name: "Pro",
    price: "10,000",
    currency: "MMK",
    period: "one-time",
    desc: "For fashion lovers",
    color: "#FFD700",
    features: [
      "25 outfit ratings",
      "HD result cards",
      "No watermark",
      "All 3 rating modes",
      "Community leaderboard entry",
      "Style DNA unlock",
      "Priority analysis",
    ],
    cta: "Buy with KBZPay / Wave",
    highlight: false,
    credits: 25,
  },
]

const INTL_PLANS = [
  { name: "10 Credits", price: "$3", credits: 10 },
  { name: "25 Credits", price: "$6", credits: 25 },
]

interface PaymentModalProps {
  plan: typeof PLANS[1]
  onClose: () => void
}

function PaymentModal({ plan, onClose }: PaymentModalProps) {
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState<"info" | "confirm">("info")
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState("")

  const KBZPAY_NUMBER = "09790543312"
  const WAVE_NUMBER = "09790543312"

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const redeemCode = () => {
    // Simple code validation — admin gives codes like AURA-XXXX
    if (code.toUpperCase().startsWith("AURA-")) {
      const credits = plan.credits ?? 10
      const current = parseInt(localStorage.getItem("aura_credits") ?? "0")
      localStorage.setItem("aura_credits", String(current + credits))
      localStorage.setItem("aura_tier", plan.id)
      onClose()
      window.location.href = "/rate"
    } else {
      setCodeError("Invalid code. Contact admin on Messenger.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="w-full max-w-md rounded-3xl bg-[#161616] border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <h3 className="font-black text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Buy {plan.name} Pack
            </h3>
            <p className="text-white/40 text-sm">{plan.price} {plan.currency} · {plan.credits} credits</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X size={14} />
          </button>
        </div>

        {step === "info" ? (
          <div className="p-5 space-y-4">
            {/* KBZPay */}
            <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/20 flex items-center justify-center text-sm">💳</div>
                  <span className="font-bold text-sm">KBZPay</span>
                </div>
                <span className="text-[#FFD700] font-black">{plan.price} MMK</span>
              </div>
              <div className="flex items-center justify-between bg-black/30 rounded-xl p-3">
                <span className="font-mono text-white/80">{KBZPAY_NUMBER}</span>
                <button onClick={() => copyNumber(KBZPAY_NUMBER)} className="text-[#00E5FF] text-xs flex items-center gap-1">
                  <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Wave Money */}
            <div className="rounded-2xl border border-[#FF00FF]/20 bg-[#FF00FF]/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FF00FF]/20 flex items-center justify-center text-sm">🌊</div>
                  <span className="font-bold text-sm">Wave Money</span>
                </div>
                <span className="text-[#FFD700] font-black">{plan.price} MMK</span>
              </div>
              <div className="flex items-center justify-between bg-black/30 rounded-xl p-3">
                <span className="font-mono text-white/80">{WAVE_NUMBER}</span>
                <button onClick={() => copyNumber(WAVE_NUMBER)} className="text-[#00E5FF] text-xs flex items-center gap-1">
                  <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2 text-sm text-white/50">
              {["Pay the amount above via KBZPay or Wave", "Screenshot your payment confirmation", "Send screenshot to our Messenger page", "You will receive your unlock code within 1 hour"].map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#FF00FF]/20 text-[#FF00FF] text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href="https://m.me/your-page-id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:border-white/20 transition-colors text-sm font-semibold"
              >
                <ExternalLink size={14} /> Send Screenshot
              </a>
              <button
                onClick={() => setStep("confirm")}
                className="py-3 rounded-xl bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white font-bold text-sm glow-pink"
              >
                I Have a Code
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <p className="text-white/60 text-sm">Enter the unlock code sent by admin:</p>
            <input
              value={code}
              onChange={e => { setCode(e.target.value); setCodeError("") }}
              placeholder="AURA-XXXX"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-center text-lg uppercase tracking-widest focus:outline-none focus:border-[#FF00FF]/60 transition-colors"
            />
            {codeError && <p className="text-red-400 text-xs text-center">{codeError}</p>}
            <button
              onClick={redeemCode}
              disabled={code.length < 5}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white font-bold glow-pink disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Redeem Code
            </button>
            <button onClick={() => setStep("info")} className="w-full text-white/40 text-sm hover:text-white/70 transition-colors">
              ← Back
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[1] | null>(null)

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-20">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] flex items-center justify-center glow-pink">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-black text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>AURA</span>
          </Link>
          <Link href="/rate" className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white">
            Try Free
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-14">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] text-xs font-semibold mb-5">
            <Crown size={12} /> UNLOCK YOUR FULL AURA
          </div>
          <h1 className="text-5xl font-black mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Simple <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-white/40 text-lg">Buy credits once. Use them anytime. No subscriptions.</p>
        </motion.div>

        {/* Myanmar Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-6 flex flex-col ${
                plan.highlight
                  ? "bg-gradient-to-b from-[#FF00FF]/15 to-[#1a0a1a] border border-[#FF00FF]/40 glow-pink"
                  : "card-glass border border-white/5"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-black text-xl mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>{plan.name}</h3>
                <p className="text-white/40 text-sm mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black" style={{ fontFamily: "Montserrat, sans-serif", color: plan.color }}>
                    {plan.price}
                  </span>
                  {plan.currency && (
                    <span className="text-white/40 mb-1 text-sm">{plan.currency}</span>
                  )}
                </div>
                {plan.period && <p className="text-white/30 text-xs mt-1">{plan.period}</p>}
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="flex-shrink-0" style={{ color: plan.color }} />
                    <span className="text-white/70">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.ctaLink ? (
                <Link
                  href={plan.ctaLink}
                  className="w-full py-3 rounded-xl text-center font-bold text-sm border border-white/10 hover:border-white/20 transition-colors text-white/70"
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => setSelectedPlan(plan as typeof PLANS[1])}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.highlight
                      ? "bg-gradient-to-r from-[#FF00FF] to-[#a000a0] text-white glow-pink hover:opacity-90"
                      : "border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/10"
                  }`}
                >
                  {plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* International / Ko-fi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="font-bold">International Users</h3>
              <p className="text-white/40 text-sm">Pay with Ko-fi — works everywhere</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {INTL_PLANS.map(p => (
              <div key={p.name} className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/5">
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-white/40 text-xs">{p.credits} outfit ratings</p>
                </div>
                <div className="text-right">
                  <p className="text-[#00E5FF] font-black text-xl">{p.price}</p>
                  <a
                    href="https://ko-fi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/40 hover:text-[#00E5FF] transition-colors flex items-center gap-1 justify-end mt-1"
                  >
                    Ko-fi <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-10 text-center space-y-3">
          {[
            { q: "Credits expire?", a: "Never. Buy once, use anytime." },
            { q: "How fast do I get credits?", a: "Within 1 hour of payment confirmation — usually faster." },
            { q: "Refunds?", a: "Unused credits can be refunded within 7 days." },
          ].map(item => (
            <div key={item.q} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm mr-3 mb-3">
              <Zap size={12} className="text-[#FF00FF]" />
              <span className="text-white/60">{item.q}</span>
              <span className="text-white/30">→</span>
              <span className="text-white/80">{item.a}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
