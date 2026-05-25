"use client"

import { motion } from "framer-motion"
import { Sparkles, MessageSquare, FileText, Clock, Copy, Check, ChevronDown, Loader2, Video, Flame, Layers, Star, Hash, TrendingUp, Play, Calendar } from "lucide-react"
import React from "react"
import BottomNav from "@/components/BottomNav"
import type { Generation } from "@/lib/supabase"
import { useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

const TOOL_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  caption:     { label: "Caption",      icon: <Sparkles     style={{ width:14,height:14 }} />, color: "var(--yellow)"  },
  reply:       { label: "Reply",        icon: <MessageSquare style={{ width:14,height:14 }} />, color: "var(--green-xl)"},
  description: { label: "Description",  icon: <FileText     style={{ width:14,height:14 }} />, color: "#6EE7B7"        },
  live:        { label: "Live Script",  icon: <Video        style={{ width:14,height:14 }} />, color: "#FF6B35"        },
  promo:       { label: "Promo",        icon: <Flame        style={{ width:14,height:14 }} />, color: "#FF3B6F"        },
  variants:    { label: "Variants",     icon: <Layers       style={{ width:14,height:14 }} />, color: "#A3FF47"        },
  testimonial: { label: "Testimonial",  icon: <Star         style={{ width:14,height:14 }} />, color: "#00D2B8"        },
  hashtags:    { label: "Hashtags",     icon: <Hash         style={{ width:14,height:14 }} />, color: "#47C8FF"        },
  comparison:  { label: "Comparison",   icon: <TrendingUp   style={{ width:14,height:14 }} />, color: "#FB923C"        },
  reel:        { label: "Reel",         icon: <Play         style={{ width:14,height:14 }} />, color: "#BF5FFF"        },
  seasonal:    { label: "Seasonal",     icon: <Calendar     style={{ width:14,height:14 }} />, color: "#FFD166"        },
}

function GenCard({ g }: { g: Generation }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const meta = TOOL_META[g.tool as keyof typeof TOOL_META] ?? TOOL_META.caption
  const isLong = g.output_text.length > 200

  function copy() {
    navigator.clipboard.writeText(g.output_text)
    setCopied(true)
    toast.success("Copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      padding: "18px 20px", borderRadius: 16,
      background: `${meta.color}08`, border: `1px solid ${meta.color}25`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ color: meta.color }}>{meta.icon}</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>{meta.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "var(--muted2)" }}>
            {new Date(g.created_at).toLocaleDateString("my-MM")}
          </span>
          <button onClick={copy} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 8, border: `1px solid ${meta.color}30`,
            background: `${meta.color}10`, color: meta.color,
            fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>
            {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <p className="font-mm" style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
        {expanded || !isLong ? g.output_text : `${g.output_text.slice(0, 200)}...`}
      </p>
      {isLong && (
        <button onClick={() => setExpanded(v => !v)} style={{
          display: "flex", alignItems: "center", gap: 4, marginTop: 8,
          fontSize: 11, fontWeight: 700, color: meta.color, background: "none", border: "none", cursor: "pointer",
        }}>
          <ChevronDown style={{ width: 12, height: 12, transform: expanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />
          {expanded ? "လျှော့ကြည့်မည်" : "ပိုကြည့်မည်"}
        </button>
      )}
    </div>
  )
}

export default function HistoryClient({ generations: initial, userId }: { generations: Generation[], userId: string }) {
  const [generations, setGenerations] = useState<Generation[]>(initial)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initial.length === 30)

  async function loadMore() {
    setLoadingMore(true)
    try {
      const { data } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(generations.length, generations.length + 29)

      if (data) {
        setGenerations(prev => [...prev, ...data])
        if (data.length < 30) setHasMore(false)
      }
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--header-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)", padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Clock style={{ width: 18, height: 18, color: "var(--yellow)" }} />
        <span style={{ fontWeight: 800, fontSize: 16 }}>History</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted2)" }}>
          {generations.length} generates
        </span>
      </div>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px 100px" }}>
        {generations.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <Clock style={{ width: 40, height: 40, color: "var(--muted2)", margin: "0 auto 16px" }} />
            <p className="font-mm" style={{ color: "var(--muted2)", fontSize: 14 }}>
              မည်သည့် generate မှ မရှိသေးပါ
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {generations.map((g, i) => (
                <motion.div key={g.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 10) * 0.04 }}>
                  <GenCard g={g} />
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "12px 28px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                    background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-g)",
                    color: "var(--muted)", cursor: "pointer",
                  }}
                >
                  {loadingMore
                    ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                    : <ChevronDown style={{ width: 14, height: 14 }} />}
                  {loadingMore ? "Loading..." : "ပိုကြည့်မည်"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <BottomNav />
    </div>
  )
}
