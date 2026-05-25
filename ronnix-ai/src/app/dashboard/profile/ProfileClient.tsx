"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Zap, Share2, Copy, LogOut, Crown, ChevronRight } from "lucide-react"
import BottomNav from "@/components/BottomNav"
import type { Profile } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const FADE = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export default function ProfileClient({ profile }: { profile: Profile | null }) {
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

  const dailyLeft = profile?.plan === "free" ? Math.max(0, 3 - (profile?.daily_count || 0)) : null

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(2,7,4,0.90)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)", padding: "16px 20px",
        display: "flex", alignItems: "center",
      }}>
        <span style={{ fontWeight: 800, fontSize: 16 }}>Profile</span>
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
                    {profile?.plan === "free" ? "Daily Remaining" : "Credits"}
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 900 }} className="grad-yg">
                    {profile?.plan === "free" ? `${dailyLeft} / 3` : profile?.credits ?? 0}
                  </p>
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
