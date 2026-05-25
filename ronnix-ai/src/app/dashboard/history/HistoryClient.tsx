"use client"

import { motion } from "framer-motion"
import { Sparkles, MessageSquare, FileText, Clock, Copy, Check } from "lucide-react"
import BottomNav from "@/components/BottomNav"
import type { Generation } from "@/lib/supabase"
import { useState } from "react"
import { toast } from "sonner"

const TOOL_META = {
  caption:     { label: "Caption", icon: <Sparkles className="w-4 h-4" />, color: "var(--yellow)" },
  reply:       { label: "Reply",   icon: <MessageSquare className="w-4 h-4" />, color: "var(--green-xl)" },
  description: { label: "Description", icon: <FileText className="w-4 h-4" />, color: "#6EE7B7" },
}

function GenCard({ g }: { g: Generation }) {
  const [copied, setCopied] = useState(false)
  const meta = TOOL_META[g.tool] ?? TOOL_META.caption

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
        {g.output_text.slice(0, 200)}{g.output_text.length > 200 ? "..." : ""}
      </p>
    </div>
  )
}

export default function HistoryClient({ generations }: { generations: Generation[] }) {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(2,7,4,0.90)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {generations.map((g, i) => (
              <motion.div key={g.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <GenCard g={g} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
