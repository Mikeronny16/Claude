"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Loader2, Copy, Check, ArrowLeft, Zap, Send, RefreshCw } from "lucide-react"
import Link from "next/link"
import type { Profile } from "@/lib/supabase"
import BottomNav from "./BottomNav"

type Props = {
  title: string
  mm: string
  color: string
  border: string
  profile: Profile | null
  tool: "caption" | "reply" | "description"
  requiredField: string
  children: (props: {
    input: Record<string, string>
    setInput: (k: string, v: string) => void
    lang: "mm" | "en"
    setLang: (l: "mm" | "en") => void
  }) => React.ReactNode
  buildPayload: (input: Record<string, string>, lang: "mm" | "en") => Record<string, unknown>
}

export default function ToolLayout({ title, mm, color, border, profile, tool, requiredField, children, buildPayload }: Props) {
  const [input, setInputState] = useState<Record<string, string>>({})
  const [lang, setLang] = useState<"mm" | "en">("mm")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  function setInput(k: string, v: string) {
    setInputState(p => ({ ...p, [k]: v }))
  }

  const canGenerate = (input[requiredField] || "").trim().length > 0

  async function handleGenerate() {
    if (!canGenerate) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, language: lang, ...buildPayload(input, lang) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutput(data.output)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error ဖြစ်သွားသည်"
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    toast.success("Copy လုပ်ပြီ!")
    setTimeout(() => setCopied(false), 2000)
  }

  const creditsLeft = profile?.plan === "free"
    ? Math.max(0, 3 - (profile?.daily_count || 0))
    : profile?.credits ?? 0

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(2,7,4,0.90)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)",
        padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/dashboard" style={{
          width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--glass)", border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none",
        }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{title}</p>
          <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)" }}>{mm}</p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100,
          background: "rgba(254,203,0,0.08)", border: "1px solid var(--border-y)", color: "var(--yellow)",
          fontSize: 11, fontWeight: 700,
        }}>
          <Zap style={{ width: 11, height: 11 }} />
          {profile?.plan === "free" ? `${creditsLeft}/day` : `${creditsLeft} cr`}
        </div>
      </div>

      {/* Split layout */}
      <div style={{ flex: 1, maxWidth: 1000, margin: "0 auto", width: "100%", padding: "20px 16px 100px" }}>
        <style>{`
          @media (min-width: 640px) {
            .tool-split { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          }
        `}</style>
        <div className="tool-split" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>

          {/* LEFT — Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--muted2)", textTransform: "uppercase" }}>Input</p>
              <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
                {(["mm", "en"] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{
                    padding: "5px 14px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer",
                    background: lang === l ? color : "transparent",
                    color: lang === l ? "#020704" : "var(--muted)",
                    transition: "all 0.15s",
                  }}>
                    {l === "mm" ? "မြန်မာ" : "English"}
                  </button>
                ))}
              </div>
            </div>

            {children({ input, setInput, lang, setLang })}

            {/* Char counter */}
            {(input[requiredField] || "").length > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
                <span style={{
                  fontSize: 11, color: (input[requiredField] || "").length > 450 ? "#EF4444" : "var(--muted2)",
                  fontWeight: 600,
                }}>
                  {(input[requiredField] || "").length} / 500
                </span>
              </div>
            )}

            <motion.button
              onClick={handleGenerate}
              disabled={loading || !canGenerate}
              whileTap={canGenerate && !loading ? { scale: 0.96 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{
                width: "100%", padding: "15px", borderRadius: 14, border: "none", cursor: canGenerate && !loading ? "pointer" : "not-allowed",
                background: loading ? "rgba(255,255,255,0.06)" : canGenerate ? color : "rgba(255,255,255,0.04)",
                color: loading ? "var(--muted)" : canGenerate ? "#020704" : "var(--muted2)",
                fontWeight: 800, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
                boxShadow: canGenerate && !loading ? `0 0 30px ${border}` : "none",
              }}>
              {loading
                ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                : <Send style={{ width: 15, height: 15 }} />}
              {loading ? "Generating..." : !canGenerate ? "အကြောင်းအရာ ထည့်ပါ" : output ? "ထပ်ရေးမည်" : "Generate လုပ်မည်"}
            </motion.button>
          </div>

          {/* RIGHT — Output */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--muted2)", textTransform: "uppercase", marginBottom: 14 }}>Output</p>

            <div style={{
              flex: 1, minHeight: 200, borderRadius: 16,
              background: error ? "rgba(239,68,68,0.05)" : output ? `${color}08` : "var(--glass)",
              border: `1px solid ${error ? "rgba(239,68,68,0.3)" : output ? border : "var(--border)"}`,
              padding: 20, position: "relative",
              transition: "all 0.3s",
            }}>
              {/* Empty state */}
              {!output && !loading && !error && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap style={{ width: 20, height: 20, color }} />
                  </div>
                  <p className="font-mm" style={{ fontSize: 12, color: "var(--muted2)", textAlign: "center" }}>
                    Generate နှိပ်ပါ<br />AI က ဒီမှာ ရေးပေးမည်
                  </p>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0,1,2].map(i=>(
                      <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:color,
                        animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Error state */}
              {error && !loading && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  minHeight: 160, gap: 12, textAlign: "center" }}>
                  <p className="font-mm" style={{ fontSize: 13, color: "#EF4444", lineHeight: 1.7 }}>{error}</p>
                  <button onClick={handleGenerate} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.08)", color: "#EF4444",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}>
                    <RefreshCw style={{ width: 13, height: 13 }} /> ထပ်ကြိုးစားမည်
                  </button>
                </div>
              )}

              {/* Output */}
              <AnimatePresence mode="wait">
              {output && !loading && (
                <motion.div
                  key={output.slice(0, 20)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <p className="font-mm" style={{ fontSize: 14, lineHeight: 1.9, color: "var(--text)", whiteSpace: "pre-wrap" }}>
                    {output}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                    <motion.button onClick={handleCopy} whileTap={{ scale: 0.94 }} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 10, border: `1px solid ${border}`,
                      background: `${color}12`, color, fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>
                      {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
                      {copied ? "Copied!" : "Copy"}
                    </motion.button>
                    <motion.button onClick={handleGenerate} disabled={loading} whileTap={{ scale: 0.94 }} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.04)", color: "var(--muted)",
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>
                      <RefreshCw style={{ width: 13, height: 13 }} /> Regenerate
                    </motion.button>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            {profile?.plan === "free" && creditsLeft === 0 && (
              <div style={{ marginTop: 12, padding: "14px 18px", borderRadius: 14,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <p className="font-mm" style={{ fontSize: 12, color: "#EF4444", marginBottom: 8 }}>ယနေ့ limit ပြည့်သွားပြီ</p>
                <Link href="/pricing" style={{ fontSize: 12, fontWeight: 700, color: "var(--yellow)",
                  background: "rgba(254,203,0,0.1)", padding: "6px 14px", borderRadius: 8,
                  textDecoration: "none", display: "inline-block" }}>Credits ဝယ်ရန်</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-10px); } }
      `}</style>

      <BottomNav />
    </div>
  )
}
