"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Check, Zap, Crown, Star } from "lucide-react"
import Link from "next/link"

const ADMIN_EMAIL = "mikeronny18@gmail.com"

const PLANS = [
  {
    key: "pro",
    name: "Pro",
    price: 9,
    currency: "USD",
    icon: Zap,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.4)",
    features: [
      "Up to 5 pets at once",
      "150 messages per day",
      "Better AI responses",
      "Rare & Epic eggs unlocked",
      "Priority support",
    ],
  },
  {
    key: "ultra",
    name: "Ultra",
    price: 19,
    currency: "USD",
    icon: Crown,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.5)",
    highlight: true,
    features: [
      "Unlimited pets",
      "Unlimited messages",
      "Best AI model (smartest)",
      "All egg tiers unlocked",
      "Mythic eggs access",
      "Priority support",
    ],
  },
  {
    key: "legendary",
    name: "Legendary",
    price: 39,
    currency: "USD",
    icon: Star,
    color: "#EC4899",
    bg: "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.35)",
    features: [
      "Everything in Ultra",
      "Exclusive Legendary eggs",
      "Early access to new features",
      "Direct founder support",
      "Name in credits",
    ],
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(plan: typeof PLANS[0]) {
    if (!session?.user) { toast.error("Sign in first"); return }
    setLoading(plan.key)

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.key, amount: plan.price }),
      })
      const data = await res.json()
      if (data.error && data.error !== "Already requested") {
        toast.error(data.error)
        setLoading(null)
        return
      }

      // Open Gmail compose with pre-filled message
      const userEmail = session.user.email ?? ""
      const subject = encodeURIComponent(`Spawn AI — ${plan.name} Plan Upgrade Request`)
      const body = encodeURIComponent(
        `Hi Mike,\n\nI want to upgrade to the ${plan.name} plan ($${plan.price}/month).\n\nMy account email: ${userEmail}\n\nPlease let me know how to send the payment.\n\nThank you!`
      )
      const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${ADMIN_EMAIL}&su=${subject}&body=${body}`
      window.open(gmailUrl, "_blank")

      toast.success(`Request sent! Check your Gmail to complete the upgrade.`, { duration: 5000 })
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Upgrade your plan</h1>
          <p className="text-sm text-gray-400 mt-0.5">More pets. More messages. More magic.</p>
        </div>
      </div>

      {/* Free plan reminder */}
      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "rgba(156,163,175,0.15)" }}>🥚</div>
        <div>
          <p className="text-sm font-medium text-white">Free plan — current</p>
          <p className="text-xs text-gray-500">1 pet · 30 messages/day · Common eggs only</p>
        </div>
      </div>

      {/* Paid plans */}
      <div className="space-y-4">
        {PLANS.map(plan => {
          const Icon = plan.icon
          return (
            <div key={plan.key} className="p-5 rounded-2xl relative overflow-hidden"
              style={{ background: plan.bg, border: `1px solid ${plan.border}` }}>
              {plan.highlight && (
                <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl"
                  style={{ background: plan.color, color: "#000" }}>
                  POPULAR
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}22` }}>
                    <Icon className="w-5 h-5" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{plan.name}</p>
                    <p className="text-xs text-gray-400">30 days · auto-renew manually</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">${plan.price}</p>
                  <p className="text-xs text-gray-400">/month</p>
                </div>
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan)}
                disabled={loading === plan.key}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: plan.color, color: plan.key === "ultra" ? "#000" : "#fff" }}
              >
                {loading === plan.key
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : `Upgrade to ${plan.name} →`
                }
              </button>
            </div>
          )
        })}
      </div>

      {/* How it works */}
      <div className="p-4 rounded-2xl" style={{ background: "rgba(26,19,48,0.6)", border: "1px solid rgba(139,92,246,0.15)" }}>
        <p className="text-sm font-semibold text-white mb-3">How payment works</p>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex gap-2"><span className="text-purple-400 font-bold">1.</span> Tap upgrade → Gmail opens with pre-filled message</div>
          <div className="flex gap-2"><span className="text-purple-400 font-bold">2.</span> Send the email to admin (Mike Ronny)</div>
          <div className="flex gap-2"><span className="text-purple-400 font-bold">3.</span> Admin confirms payment method (bank transfer / other)</div>
          <div className="flex gap-2"><span className="text-purple-400 font-bold">4.</span> After payment — account upgraded within 24 hours</div>
        </div>
        <p className="text-xs text-gray-500 mt-3">Contact: <span className="text-purple-400">{ADMIN_EMAIL}</span></p>
      </div>
    </div>
  )
}
