"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Check, Loader2, ArrowLeft, Zap, Gift } from "lucide-react"
import Link from "next/link"
import { CREDIT_PACKS, LAUNCH_OFFER_ENDS } from "@/lib/credits"

const WAVE_NUMBER = "09969279092"
const WAVE_NAME = "Mg Min Ma Haw"
const KBZ_NUMBER = "09967965497"
const KBZ_NAME = "Daw San San Myint"

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, expired: false })
  useEffect(() => {
    function calc() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0, expired: true }); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ h, m, s, expired: false })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [target])
  return timeLeft
}

export default function PricingPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [payMethod, setPayMethod] = useState<"wave" | "kbz">("wave")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const countdown = useCountdown(LAUNCH_OFFER_ENDS)

  const pack = CREDIT_PACKS.find(p => p.id === selectedPack)
  const isLaunchActive = !countdown.expired

  async function handlePayment() {
    if (!selectedPack || !phoneNumber) {
      toast.error("Pack နှင့် phone number ထည့်ပါ")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack_id: selectedPack, wave_number: phoneNumber, pay_method: payMethod }),
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

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(2,7,4,0.90)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)", padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/dashboard" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 8,
          background: "rgba(255,255,255,0.05)", color: "var(--muted)",
        }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </Link>
        <span style={{ fontWeight: 800, fontSize: 16 }}>Credits ဝယ်ရန်</span>
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "24px 16px 60px" }}>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", paddingTop: 60 }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
              background: "rgba(109,201,58,0.15)", border: "1px solid rgba(109,201,58,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Check style={{ width: 28, height: 28, color: "var(--green-xl)" }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Request ပို့ပြီ!</h2>
            <p className="font-mm" style={{ fontSize: 13, color: "var(--muted2)", lineHeight: 1.7, marginBottom: 24 }}>
              24 နာရီအတွင်း admin confirm လုပ်ပြီး credits ထည့်ပေးမည်
            </p>
            <Link href="/dashboard" style={{
              display: "inline-block", padding: "12px 28px", borderRadius: 12,
              background: "var(--yellow)", color: "#020704", fontWeight: 700, fontSize: 14,
              textDecoration: "none",
            }}>
              Dashboard ပြန်သွားရန်
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Launch Offer Banner */}
            {isLaunchActive && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "14px 16px", borderRadius: 16, marginBottom: 20,
                  background: "linear-gradient(135deg, rgba(254,203,0,0.12), rgba(163,255,71,0.08))",
                  border: "1px solid rgba(254,203,0,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Gift style={{ width: 18, height: 18, color: "var(--yellow)", flexShrink: 0 }} />
                  <div>
                    <p className="font-mm" style={{ fontSize: 12, fontWeight: 800, color: "var(--yellow)", marginBottom: 2 }}>
                      Launch Offer — Pro ဝယ်ရင် +200 Bonus!
                    </p>
                    <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)" }}>
                      500 → 700 credits အခမဲ့ · ကုန်ဆုံးချိန် —
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 900, color: "var(--yellow)", fontVariantNumeric: "tabular-nums", letterSpacing: 1 }}>
                    {String(countdown.h).padStart(2, "0")}:{String(countdown.m).padStart(2, "0")}:{String(countdown.s).padStart(2, "0")}
                  </p>
                  <p style={{ fontSize: 9, color: "var(--muted2)", letterSpacing: 0.5 }}>နာရီ · မိနစ် · စက္ကန့်</p>
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>Credit Pack ရွေးပါ</h2>
              <p className="font-mm" style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 20 }}>
                Expire မဖြစ်ပါ · Wave Money / KBZPay နဲ့ ပေးချေနိုင်သည်
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {CREDIT_PACKS.map((p) => {
                  const showBonus = isLaunchActive && p.bonus > 0
                  const totalCredits = showBonus ? p.credits + p.bonus : p.credits
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPack(p.id)}
                      style={{
                        width: "100%", padding: "16px 18px", borderRadius: 16, textAlign: "left",
                        cursor: "pointer", position: "relative",
                        background: selectedPack === p.id ? "rgba(254,203,0,0.08)" : "rgba(255,255,255,0.03)",
                        border: selectedPack === p.id ? "2px solid var(--yellow)" : "1px solid var(--border-g)",
                      }}
                    >
                      {p.popular && !showBonus && (
                        <span style={{
                          position: "absolute", top: 12, right: 12,
                          fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100,
                          background: "var(--yellow)", color: "#020704",
                        }}>Popular</span>
                      )}
                      {showBonus && (
                        <span style={{
                          position: "absolute", top: 12, right: 12,
                          fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100,
                          background: "linear-gradient(90deg, var(--yellow), #a3ff47)",
                          color: "#020704",
                        }}>🎁 +{p.bonus} FREE</span>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                          background: "rgba(254,203,0,0.10)", border: "1px solid var(--border-y)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Zap style={{ width: 18, height: 18, color: "var(--yellow)" }} />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                            <p style={{ fontWeight: 700, fontSize: 14 }}>
                              {showBonus ? `Pro — ${totalCredits} Credits` : p.label}
                            </p>
                            {showBonus && (
                              <span style={{ fontSize: 11, color: "var(--muted2)", textDecoration: "line-through" }}>500</span>
                            )}
                          </div>
                          <p style={{ fontSize: 18, fontWeight: 900 }} className="grad-yg">
                            {p.price_mmk.toLocaleString()} MMK
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>

            {selectedPack && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

                {/* Payment method selector */}
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted2)", marginBottom: 10, letterSpacing: 0.5 }}>
                  PAYMENT METHOD
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {(["wave", "kbz"] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPayMethod(method)}
                      style={{
                        padding: "12px", borderRadius: 12, cursor: "pointer",
                        background: payMethod === method ? "rgba(254,203,0,0.08)" : "rgba(255,255,255,0.03)",
                        border: payMethod === method ? "2px solid var(--yellow)" : "1px solid var(--border-g)",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{method === "wave" ? "🌊" : "🏦"}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                        {method === "wave" ? "Wave Money" : "KBZPay"}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Payment instructions */}
                <div style={{
                  padding: "16px 18px", borderRadius: 14, marginBottom: 16,
                  background: "rgba(254,203,0,0.06)", border: "1px solid var(--border-y)",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--yellow)", marginBottom: 10, letterSpacing: 0.5 }}>
                    PAYMENT INSTRUCTIONS
                  </p>
                  <p className="font-mm" style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.8 }}>
                    1.{" "}
                    <strong style={{ color: "var(--yellow)" }}>
                      {payMethod === "wave" ? WAVE_NUMBER : KBZ_NUMBER}
                    </strong>{" "}
                    <span style={{ color: "var(--muted2)", fontSize: 12 }}>
                      ({payMethod === "wave" ? WAVE_NAME : KBZ_NAME})
                    </span>{" "}
                    သို့{" "}
                    {payMethod === "wave" ? "Wave Money" : "KBZPay"} မှ{" "}
                    <strong>{pack?.price_mmk.toLocaleString()} MMK</strong> ပို့ပါ
                  </p>
                  <p className="font-mm" style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.8 }}>
                    2. သင့် {payMethod === "wave" ? "Wave" : "KBZ"} number ကို အောက်တွင် ထည့်ပါ
                  </p>
                  <p className="font-mm" style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.8 }}>
                    3. Submit လုပ်ပါ — 24 နာရီအတွင်း credits ရပါမည်
                  </p>
                </div>

                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted2)", display: "block", marginBottom: 6 }}>
                  သင့် {payMethod === "wave" ? "Wave" : "KBZ"} Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="09XXXXXXXXX"
                  className="inp"
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12, outline: "none",
                    marginBottom: 14, boxSizing: "border-box", fontSize: 16,
                    background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-g)",
                    color: "var(--text)",
                  }}
                />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePayment}
                  disabled={loading || !phoneNumber}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 14,
                    fontSize: 14, fontWeight: 700, cursor: loading || !phoneNumber ? "not-allowed" : "pointer",
                    background: loading || !phoneNumber ? "rgba(254,203,0,0.3)" : "var(--yellow)",
                    color: "#020704",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    border: "none", opacity: loading || !phoneNumber ? 0.6 : 1,
                  }}
                >
                  {loading && <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />}
                  Payment Request ပို့မည်
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
