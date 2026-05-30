"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Share2, RefreshCw, ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"
import type { PersonalityResult } from "@/lib/claude"

const ELEMENTS: Record<string, { color: string; glow: string; icon: string }> = {
  "မီး": { color: "#FF6B35", glow: "rgba(255,107,53,0.3)", icon: "🔥" },
  "Fire": { color: "#FF6B35", glow: "rgba(255,107,53,0.3)", icon: "🔥" },
  "ရေ": { color: "#47C8FF", glow: "rgba(71,200,255,0.3)", icon: "💧" },
  "Water": { color: "#47C8FF", glow: "rgba(71,200,255,0.3)", icon: "💧" },
  "ကြေး": { color: "#FECB00", glow: "rgba(254,203,0,0.3)", icon: "⚡" },
  "လေ": { color: "#A3FF47", glow: "rgba(163,255,71,0.3)", icon: "🌬️" },
  "Air": { color: "#A3FF47", glow: "rgba(163,255,71,0.3)", icon: "🌬️" },
  "မြေ": { color: "#8B7355", glow: "rgba(139,115,85,0.3)", icon: "🌿" },
  "Earth": { color: "#6DC93A", glow: "rgba(109,201,58,0.3)", icon: "🌿" },
  "Ether": { color: "#BF5FFF", glow: "rgba(191,95,255,0.3)", icon: "✨" },
}

function getElementStyle(element: string) {
  for (const key of Object.keys(ELEMENTS)) {
    if (element.includes(key)) return ELEMENTS[key]
  }
  return { color: "#FECB00", glow: "rgba(254,203,0,0.3)", icon: "✨" }
}

export default function PersonalityPage() {
  const [name, setName] = useState("")
  const [lang, setLang] = useState<"mm" | "en">("mm")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PersonalityResult | null>(null)
  const [submittedName, setSubmittedName] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  async function handleGenerate() {
    if (!name.trim() || loading) return
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.result)
      setSubmittedName(name.trim())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error ဖြစ်သွားသည်")
    } finally {
      setLoading(false)
    }
  }

  function handleShare() {
    const text = result
      ? `✨ ငါ့နာမည် "${submittedName}" ရဲ့ Personality Reading:\n\n${result.title}\n${result.element} ${getElementStyle(result.element).icon}\n\n"${result.strength}"\n\nMing's 2026: ${result.fortune_2026}\n\n👉 မင်းနာမည်လည်း ကြည့်: ronnix.ai/personality`
      : ""
    if (navigator.share) {
      navigator.share({ title: "Ronnix AI — Personality Reading", text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const elStyle = result ? getElementStyle(result.element) : null

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--header-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)",
        padding: "14px 20px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{
          width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--glass)", border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none",
        }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
        </Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>Name Personality AI</p>
          <p className="font-mm" style={{ fontSize: 11, color: "var(--muted2)" }}>နာမည်မှ ကိုယ်ရည်ကိုယ်သွေး ဖတ်မည်</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100,
          background: "rgba(109,201,58,0.1)", border: "1px solid rgba(109,201,58,0.2)", color: "#6DC93A",
          fontSize: 11, fontWeight: 700 }}>
          <Sparkles style={{ width: 11, height: 11 }} /> Free
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 480, margin: "0 auto", width: "100%", padding: "24px 16px 80px" }}>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "var(--glass)", border: "1px solid var(--border-g)",
            borderRadius: 20, padding: 24, marginBottom: 20,
          }}
        >
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔮</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", marginBottom: 4 }}>
              {lang === "mm" ? "နာမည် Personality Reading" : "Name Personality Reading"}
            </h1>
            <p className="font-mm" style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              {lang === "mm"
                ? "မင်းနာမည် ထည့်လိုက် — AI က magic ဆင်ပေးမည်"
                : "Enter your name — AI reveals your hidden soul"}
            </p>
          </div>

          {/* Language Toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg)" }}>
              {(["mm", "en"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: "8px 20px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
                  background: lang === l ? "#FECB00" : "transparent",
                  color: lang === l ? "#020704" : "var(--muted)",
                  transition: "all 0.2s",
                }}>
                  {l === "mm" ? "မြန်မာ" : "English"}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
            placeholder={lang === "mm" ? "မင်းနာမည် ရိုက်ထည့်ပါ..." : "Enter your name..."}
            maxLength={60}
            className="font-mm inp"
            style={{
              width: "100%", padding: "16px 18px", borderRadius: 14,
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 16, fontWeight: 600,
              outline: "none", boxSizing: "border-box",
              textAlign: "center",
            }}
          />

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            disabled={loading || !name.trim()}
            whileTap={!loading && name.trim() ? { scale: 0.96 } : {}}
            style={{
              width: "100%", marginTop: 14, padding: "16px",
              borderRadius: 14, border: "none",
              background: name.trim() && !loading
                ? "linear-gradient(135deg, #FECB00 0%, #FF9500 100%)"
                : "rgba(255,255,255,0.05)",
              color: name.trim() && !loading ? "#020704" : "var(--muted2)",
              fontWeight: 900, fontSize: 15, cursor: name.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: name.trim() && !loading ? "0 0 40px rgba(254,203,0,0.35)" : "none",
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%", background: "#020704",
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            ) : (
              <>
                <Sparkles style={{ width: 16, height: 16 }} />
                {lang === "mm" ? "Personality ဖတ်မည်" : "Read My Personality"}
              </>
            )}
          </motion.button>

          {error && (
            <p className="font-mm" style={{ textAlign: "center", color: "#EF4444", fontSize: 12, marginTop: 10 }}>
              {error}
            </p>
          )}
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {result && elStyle && (
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Glow bg */}
              <div style={{
                background: `radial-gradient(ellipse at 50% 0%, ${elStyle.glow} 0%, transparent 70%)`,
                borderRadius: 24, padding: 2,
              }}>
                <div style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, var(--bg2) 100%)",
                  border: `1px solid ${elStyle.color}30`,
                  borderRadius: 22, overflow: "hidden",
                }}>
                  {/* Card Header */}
                  <div style={{
                    background: `linear-gradient(135deg, ${elStyle.color}18 0%, transparent 60%)`,
                    padding: "28px 24px 20px", textAlign: "center",
                    borderBottom: `1px solid ${elStyle.color}20`,
                  }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>
                      {result.spirit_animal.split(" ").slice(-1)[0] || "✨"}
                    </div>
                    <div style={{
                      display: "inline-block", padding: "4px 14px", borderRadius: 100,
                      background: `${elStyle.color}20`, border: `1px solid ${elStyle.color}40`,
                      fontSize: 11, fontWeight: 700, color: elStyle.color, marginBottom: 10,
                      letterSpacing: 1,
                    }}>
                      {result.element}
                    </div>
                    <h2 className="font-mm" style={{
                      fontSize: 22, fontWeight: 900, color: "var(--text)",
                      lineHeight: 1.4, margin: "0 0 6px",
                    }}>
                      {submittedName}
                    </h2>
                    <p className="font-mm" style={{
                      fontSize: 14, color: elStyle.color, fontWeight: 700,
                    }}>
                      {result.title}
                    </p>
                  </div>

                  {/* Traits */}
                  <div style={{ padding: "20px 24px", borderBottom: `1px solid ${elStyle.color}15` }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                      {result.traits.map((t, i) => (
                        <span key={i} className="font-mm" style={{
                          padding: "6px 14px", borderRadius: 100,
                          background: `${elStyle.color}12`, border: `1px solid ${elStyle.color}30`,
                          fontSize: 12, fontWeight: 600, color: "var(--text)",
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sections */}
                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

                    <CardSection icon="⚡" label={lang === "mm" ? "အင်အား" : "Strength"} text={result.strength} color={elStyle.color} />
                    <CardSection icon="🌒" label={lang === "mm" ? "Shadow Side" : "Shadow"} text={result.shadow} color="#8B7ECC" />
                    <CardSection icon="💫" label="2026" text={result.fortune_2026} color="#FECB00" />
                    <CardSection icon="💞" label={lang === "mm" ? "အချစ်" : "Love"} text={result.love} color="#FF6B9E" />

                    {/* Lucky */}
                    <div style={{
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4,
                    }}>
                      <div style={{
                        padding: "14px", borderRadius: 14,
                        background: `${elStyle.color}10`, border: `1px solid ${elStyle.color}25`,
                        textAlign: "center",
                      }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1, marginBottom: 4 }}>
                          {lang === "mm" ? "LUCKY COLOR" : "LUCKY COLOR"}
                        </p>
                        <p className="font-mm" style={{ fontSize: 14, fontWeight: 800, color: elStyle.color }}>
                          {result.lucky_color}
                        </p>
                      </div>
                      <div style={{
                        padding: "14px", borderRadius: 14,
                        background: "rgba(254,203,0,0.08)", border: "1px solid rgba(254,203,0,0.2)",
                        textAlign: "center",
                      }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1, marginBottom: 4 }}>
                          LUCKY NUMBER
                        </p>
                        <p style={{ fontSize: 22, fontWeight: 900, color: "#FECB00" }}>
                          {result.lucky_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    padding: "14px 24px", borderTop: `1px solid ${elStyle.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "rgba(0,0,0,0.2)",
                  }}>
                    <span style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 600 }}>
                      ✨ ronnix.ai/personality
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <motion.button
                        onClick={() => { setResult(null); setName("") }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          padding: "7px 12px", borderRadius: 10, border: "1px solid var(--border)",
                          background: "rgba(255,255,255,0.04)", color: "var(--muted)",
                          fontSize: 11, fontWeight: 700, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 5,
                        }}
                      >
                        <RefreshCw style={{ width: 12, height: 12 }} />
                        {lang === "mm" ? "ထပ်ကြည့်" : "Retry"}
                      </motion.button>
                      <motion.button
                        onClick={handleShare}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          padding: "7px 14px", borderRadius: 10, border: `1px solid ${elStyle.color}50`,
                          background: `${elStyle.color}15`, color: elStyle.color,
                          fontSize: 11, fontWeight: 800, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 5,
                        }}
                      >
                        {copied
                          ? <><Check style={{ width: 12, height: 12 }} /> Copied!</>
                          : <><Share2 style={{ width: 12, height: 12 }} /> {lang === "mm" ? "Share" : "Share"}</>
                        }
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Try another prompt */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-mm"
                style={{ textAlign: "center", fontSize: 12, color: "var(--muted2)", marginTop: 16 }}
              >
                {lang === "mm"
                  ? "သူငယ်ချင်း နာမည်လည်း ကြည့်ကြည့် 👆"
                  : "Try your friend's name too 👆"}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        .inp:focus {
          border-color: rgba(254,203,0,0.4) !important;
          background: rgba(255,255,255,0.06) !important;
        }
      `}</style>
    </div>
  )
}

function CardSection({ icon, label, text, color }: { icon: string; label: string; text: string; color: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--muted2)", letterSpacing: 1, marginBottom: 3 }}>
          {label.toUpperCase()}
        </p>
        <p className="font-mm" style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, fontWeight: 500 }}>
          {text}
        </p>
      </div>
    </div>
  )
}
