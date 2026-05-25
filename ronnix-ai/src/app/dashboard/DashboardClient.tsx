"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageSquare, FileText, Share2, Copy, Zap } from "lucide-react"
import Navbar from "@/components/Navbar"
import type { Profile } from "@/lib/supabase"
import { toast } from "sonner"

const TOOLS = [
  {
    href: "/tools/caption",
    icon: <Sparkles className="w-6 h-6" />,
    title: "Caption Generator",
    mm: "Caption ရေးပေးသည်",
    desc: "Facebook, TikTok, Instagram",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
  },
  {
    href: "/tools/reply",
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Reply Helper",
    mm: "Comment Reply",
    desc: "Customer comments ကို",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
  },
  {
    href: "/tools/description",
    icon: <FileText className="w-6 h-6" />,
    title: "Product Description",
    mm: "ကုန်ပစ္စည်းဖော်ပြချက်",
    desc: "Shop listing အတွက်",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
  },
]

export default function DashboardClient({ profile }: { profile: Profile | null }) {
  const dailyLeft = profile?.plan === "free" ? Math.max(0, 3 - (profile?.daily_count || 0)) : null
  const referralLink = profile
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/auth?ref=${profile.referral_code}`
    : ""

  function copyReferral() {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copy လုပ်ပြီ!")
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar profile={profile} />

      <main className="max-w-5xl mx-auto px-5 py-8">
        {/* Welcome */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>
            မင်္ဂလာပါ 👋
          </h1>
          <p className="text-sm font-mm mt-1" style={{ color: "var(--muted)" }}>
            {profile?.email}
          </p>
        </motion.div>

        {/* Status bar */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Zap className="w-4 h-4" style={{ color: "#8B5CF6" }} />
            <span className="font-mm text-xs" style={{ color: "var(--text)" }}>
              {profile?.plan === "free"
                ? `Free · ${dailyLeft} ကြိမ် ကျန်သည် (ယနေ့)`
                : `${profile?.credits || 0} Credits ကျန်သည်`}
            </span>
          </div>

          {profile?.plan === "free" && (
            <Link href="/pricing" className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "var(--purple)" }}>
              Credits ဝယ်ရန်
            </Link>
          )}
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <Link href={tool.href} className="block tool-card p-6 group">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: tool.bg, color: tool.color }}
                >
                  {tool.icon}
                </div>
                <h3 className="font-bold text-base mb-1" style={{ color: "var(--text)" }}>{tool.title}</h3>
                <p className="text-xs font-mm mb-1" style={{ color: tool.color }}>{tool.mm}</p>
                <p className="text-xs font-mm" style={{ color: "var(--muted)" }}>{tool.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Referral */}
        <motion.div
          className="p-5 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>Referral Program</h3>
              </div>
              <p className="text-xs font-mm" style={{ color: "var(--muted)" }}>
                Friend တစ်ယောက် invite လုပ်ရင် နှစ်ဦးစလုံး 10 credits ရသည်
              </p>
            </div>
            <button
              onClick={copyReferral}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium flex-shrink-0 transition-colors hover:opacity-80"
              style={{ background: "rgba(139,92,246,0.15)", color: "#A78BFA" }}
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
