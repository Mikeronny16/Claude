"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Check, Loader2, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { CREDIT_PACKS } from "@/lib/credits"

const WAVE_NUMBER = "09798XXXXXX" // Replace with actual Wave number

export default function PricingPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [waveNumber, setWaveNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handlePayment() {
    if (!selectedPack || !waveNumber) {
      toast.error("Pack နှင့် Wave number ထည့်ပါ")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack_id: selectedPack, wave_number: waveNumber }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmitted(true)
      toast.success("Request ပို့ပြီ! 24 နာရီအတွင်း confirm လုပ်မည်")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error ဖြစ်သွားသည်")
    } finally {
      setLoading(false)
    }
  }

  const pack = CREDIT_PACKS.find(p => p.id === selectedPack)

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="sticky top-0 z-50 flex items-center gap-3 px-5 py-3 border-b"
        style={{ background: "rgba(13,13,20,0.95)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <Link href="/dashboard" className="p-1.5 rounded-lg" style={{ color: "var(--muted)" }}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-bold text-sm" style={{ color: "var(--text)" }}>Credits ဝယ်ရန်</h1>
      </div>

      <div className="max-w-lg mx-auto px-5 py-10">
        {submitted ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.2)" }}>
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-black mb-2" style={{ color: "var(--text)" }}>Request ပို့ပြီ!</h2>
            <p className="text-sm font-mm mb-6" style={{ color: "var(--muted)" }}>
              24 နာရီအတွင်း admin confirm လုပ်ပြီး credits ထည့်ပေးမည်
            </p>
            <Link href="/dashboard" className="text-sm font-semibold px-6 py-3 rounded-xl text-white inline-block"
              style={{ background: "var(--purple)" }}>
              Dashboard ပြန်သွားရန်
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-black mb-1" style={{ color: "var(--text)" }}>Credit Pack ရွေးပါ</h2>
              <p className="text-sm font-mm mb-6" style={{ color: "var(--muted)" }}>
                Expire မဖြစ်ပါ · Wave Money နဲ့ ပေးချေနိုင်သည်
              </p>

              <div className="space-y-3 mb-8">
                {CREDIT_PACKS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPack(p.id)}
                    className="w-full p-4 rounded-2xl text-left transition-all relative"
                    style={{
                      background: selectedPack === p.id
                        ? "rgba(139,92,246,0.15)"
                        : "var(--surface)",
                      border: selectedPack === p.id
                        ? "2px solid #8B5CF6"
                        : "1px solid var(--border)",
                    }}
                  >
                    {p.popular && (
                      <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "var(--amber)", color: "#000" }}>Popular</span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(139,92,246,0.15)" }}>
                        <Zap className="w-5 h-5" style={{ color: "#8B5CF6" }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                          {p.label}
                        </p>
                        <p className="text-lg font-black" style={{ color: "var(--purple)" }}>
                          {p.price_mmk.toLocaleString()} MMK
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {selectedPack && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="p-4 rounded-2xl mb-4"
                  style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#F59E0B" }}>Payment Instructions</p>
                  <p className="text-sm font-mm" style={{ color: "var(--text)" }}>
                    1. Wave Money မှ <strong>{WAVE_NUMBER}</strong> သို့ {pack?.price_mmk.toLocaleString()} MMK ပို့ပါ
                  </p>
                  <p className="text-sm font-mm mt-1" style={{ color: "var(--text)" }}>
                    2. သင့် Wave number ကို အောက်တွင် ထည့်ပါ
                  </p>
                  <p className="text-sm font-mm mt-1" style={{ color: "var(--text)" }}>
                    3. Submit လုပ်ပါ — 24 နာရီအတွင်း credits ရပါမည်
                  </p>
                </div>

                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                  သင့် Wave Phone Number
                </label>
                <input
                  type="tel"
                  value={waveNumber}
                  onChange={(e) => setWaveNumber(e.target.value)}
                  placeholder="09XXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                />

                <button
                  onClick={handlePayment}
                  disabled={loading || !waveNumber}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--purple)" }}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Payment Request ပို့မည်
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
