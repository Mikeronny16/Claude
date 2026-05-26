"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Zap, Share2, Copy, LogOut, Crown, ChevronRight, Clock, CheckCircle, XCircle, Receipt } from "lucide-react"
import BottomNav from "@/components/BottomNav"
import type { Profile, PaymentRequest } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const FADE = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const STATUS_META = {
  pending:  { icon: Clock,        color: "var(--yellow)",       bg: "rgba(254,203,0,0.08)",   border: "rgba(254,203,0,0.25)",   label: "စောင့်ဆိုင်းဆဲ" },
  approved: { icon: CheckCircle,  color: "var(--green-xl)",     bg: "rgba(109,201,58,0.08)",  border: "rgba(109,201,58,0.25)",  label: "Approve ဖြစ်ပြီ" },
  rejected: { icon: XCircle,      color: "#EF4444",             bg: "rgba(239,68,68,0.07)",   border: "rgba(239,68,68,0.25)",   label: "ငြင်းပယ်ခံရ" },
}

export default function ProfileClient({ profile, payments }: { profile: Profile | null; payments: PaymentRequest[] }) {
  const router = useRouter()
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const referralLink = profile ? `${origin}/auth?ref=${profile.referral_code}` : ""

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  function copyReferral() {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copied!")
  }

  const dailyLeft = (!profile?.plan || profile?.plan === "free") ? Math.max(0, 3 - (profile?.daily_count || 0)) : null
  const hasPending = payments.some(p => p.status === "pending")

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--header-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)", padding: "16px 20px",
        display: "flex", alignItems: "center",
      }}>
        <span style={{ fontWeight: 800, fontSize: 16 }}>Profile</span>
        {hasPending && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              marginLeft: 10, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
              background: "rgba(254,203,0,0.12)", border: "1px solid rgba(254,203,0,0.3)", color: "var(--yellow)",
            }}>
            Payment စောင့်ဆိုင်းဆဲ
          </motion.div>
        )}
      </div>

      <main style={{ maxWidth: 500, margin: "0 auto", padding: "24px 16px 100px" }}>

        {/* Avatar + info */}
        <motion.div variants={FADE} initial="hidden" animate="show"
          style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 14px",
            background: "linear-gradient(135deg, var(--green), var(--yellow))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, color: "#020704",
          }}>
            {profile?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <p style={{ fontWeight: 800, fontSize: 17 }}>{profile?.email}</p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8,
            padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
            background: "rgba(254,203,0,0.10)", border: "1px solid var(--border-y)", color: "var(--yellow)",
          }}>
            <Crown style={{ width: 12, height: 12 }} />
            {profile?.plan?.toUpperCase() ?? "FREE"} PLAN
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div variants={FADE} initial="hidden" animate="show" transition={{ delay: 0.08 }}
          style={{ marginBottom: 14 }}>
          <div className="glass" style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Zap style={{ width: 20, height: 20, color: "var(--yellow)" }} />
                <div>
                  <p style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 600 }}>
                    {(!profile?.plan || profile?.plan === "free") ? "Daily Remaining" : "Credits"}
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 900 }} className="grad-yg">
                    {(!profile?.plan || profile?.plan === "free") ? `${dailyLeft} / 3` : profile?.credits ?? 0}
                  </p>
                  {(profile?.plan && profile?.plan !== "free") && (
                    <p className="font-mm" style={{ fontSize: 11, color: "var(--green-xl)", marginTop: 2 }}>
                      ✓ Credits plan — unlimited generate
                    </p>
                  )}
                </div>
              </div>
              <Link href="/pricing" style={{
                padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                background: "var(--yellow)", color: "#020704", textDecoration: "none",
              }}>
                Buy Credits
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Payment history */}
        {payments.length > 0 && (
          <motion.div variants={FADE} initial="hidden" animate="show" transition={{ delay: 0.11 }}
            style={{ marginBottom: 14 }}>
            <div className="glass" style={{ overflow: "hidden" }}>
              <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", gap: 8,
                borderBottom: "1px solid var(--border)" }}>
                <Receipt style={{ width: 14, height: 14, color: "var(--muted2)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1 }}>PAYMENT HISTORY</span>
              </div>
              {payments.map((p, i) => {
                const meta = STATUS_META[p.status as keyof typeof STATUS_META] ?? STATUS_META.pending
                const Icon = meta.icon
                return (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 20px",
                    borderBottom: i < payments.length - 1 ? "1px solid var(--border)" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center",
                        justifyContent: "center", background: meta.bg, border: `1px solid ${meta.border}` }}>
                        <Icon style={{ width: 14, height: 14, color: meta.color }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700 }}>{p.amount_mmk?.toLocaleString()} MMK</p>
                        <p style={{ fontSize: 11, color: "var(--muted2)" }}>
                          +{p.credits_to_add} credits · {new Date(p.created_at).toLocaleDateString("my-MM")}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                      background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color,
                    }}>
                      {meta.label}
                    </div>
                  </div>
                )
              })}
              {hasPending && (
                <div style={{ padding: "10px 20px 14px" }}>
                  <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)", lineHeight: 1.6 }}>
                    Admin က စစ်ဆေးပြီး 24 နာရီအတွင်း credits ထည့်ပေးပါမည်
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Referral */}
        <motion.div variants={FADE} initial="hidden" animate="show" transition={{ delay: 0.12 }}
          style={{ marginBottom: 14 }}>
          <div className="glass" style={{ padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Share2 style={{ width: 18, height: 18, color: "var(--yellow)" }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>Referral</p>
                  <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)" }}>
                    Friend invite → နှစ်ဦး +10 credits
                  </p>
                  {profile?.referral_code && (
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--yellow)", marginTop: 4, letterSpacing: 1 }}>
                      {profile.referral_code}
                    </p>
                  )}
                </div>
              </div>
              <button onClick={copyReferral} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: "rgba(254,203,0,0.1)", color: "var(--yellow)",
                border: "1px solid var(--border-y)",
              }}>
                <Copy style={{ width: 13, height: 13 }} /> Copy
              </button>
            </div>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div variants={FADE} initial="hidden" animate="show" transition={{ delay: 0.16 }}
          style={{ marginBottom: 14 }}>
          <div className="glass" style={{ overflow: "hidden" }}>
            {[
              { label: "Credits ဝယ်ရန်", href: "/pricing", color: "var(--yellow)" },
              { label: "Home သို့", href: "/", color: "var(--muted)" },
            ].map((item, i) => (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 22px", textDecoration: "none",
                borderBottom: i === 0 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.label}</span>
                <ChevronRight style={{ width: 16, height: 16, color: "var(--muted2)" }} />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div variants={FADE} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "1px solid rgba(239,68,68,0.25)",
            background: "rgba(239,68,68,0.07)", color: "#EF4444",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <LogOut style={{ width: 16, height: 16 }} /> Logout
          </button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}
