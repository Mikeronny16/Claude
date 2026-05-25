"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Copy, Check, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import type { Profile } from "@/lib/supabase"

type Props = {
  title: string
  mm: string
  color: string
  profile: Profile | null
  tool: "caption" | "reply" | "description"
  children: (props: {
    input: Record<string, string>
    setInput: (key: string, val: string) => void
    lang: "mm" | "en"
    setLang: (l: "mm" | "en") => void
  }) => React.ReactNode
  buildPayload: (input: Record<string, string>, lang: "mm" | "en") => Record<string, unknown>
}

export default function ToolLayout({ title, mm, color, profile, tool, children, buildPayload }: Props) {
  const [input, setInputState] = useState<Record<string, string>>({})
  const [lang, setLang] = useState<"mm" | "en">("mm")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  function setInput(key: string, val: string) {
    setInputState((prev) => ({ ...prev, [key]: val }))
  }

  async function handleGenerate() {
    setLoading(true)
    setOutput("")
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
      toast.error(err instanceof Error ? err.message : "Error ဖြစ်သွားသည်")
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
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center gap-4 px-5 py-3 border-b"
        style={{ background: "rgba(13,13,20,0.95)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <Link href="/dashboard" className="p-1.5 rounded-lg transition-colors hover:text-[var(--text)]"
          style={{ color: "var(--muted)" }}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-sm" style={{ color: "var(--text)" }}>{title}</h1>
          <p className="text-xs font-mm" style={{ color: "var(--muted)" }}>{mm}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{ background: "rgba(139,92,246,0.1)", color: "#A78BFA" }}>
          <Zap className="w-3 h-3" />
          {profile?.plan === "free" ? `${creditsLeft}/day` : `${creditsLeft} cr`}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        {/* Language toggle */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs" style={{ color: "var(--muted)" }}>Output:</span>
          <div className="flex rounded-lg p-0.5" style={{ background: "var(--surface)" }}>
            {(["mm", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-3 py-1.5 text-xs rounded-md font-medium transition-all"
                style={{
                  background: lang === l ? color : "transparent",
                  color: lang === l ? "white" : "var(--muted)",
                }}
              >
                {l === "mm" ? "မြန်မာ" : "English"}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          {children({ input, setInput, lang, setLang })}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate လုပ်မည် →"
          )}
        </button>

        {/* Output */}
        {output && (
          <div className="p-4 rounded-2xl relative"
            style={{ background: "var(--surface)", border: `1px solid ${color}40` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{ color }}>Result</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: `${color}20`, color }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-sm font-mm whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text)" }}>
              {output}
            </p>
          </div>
        )}

        {/* Upgrade notice for free users at limit */}
        {profile?.plan === "free" && creditsLeft === 0 && (
          <div className="mt-4 p-4 rounded-xl text-center"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <p className="text-sm font-mm mb-2" style={{ color: "#F59E0B" }}>
              ယနေ့ limit ပြည့်သွားပြီ
            </p>
            <Link href="/pricing" className="text-xs font-semibold text-white px-4 py-2 rounded-lg inline-block"
              style={{ background: "#F59E0B" }}>
              Credits ဝယ်ရန်
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
