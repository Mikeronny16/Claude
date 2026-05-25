"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/api/auth/callback?next=/dashboard${ref ? `&ref=${ref}` : ""}`,
          },
        })
        if (error) throw error
        setEmailSent(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = "/dashboard"
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error ဖြစ်သွားသည်")
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div style={{
        background: "var(--bg)", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px",
      }}>
        <div style={{ maxWidth: 360, width: "100%", textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px",
            background: "rgba(254,203,0,0.1)", border: "1px solid var(--border-y)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
          }}>📧</div>
          <p style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>Email စစ်ဆေးပါ</p>
          <p className="font-mm" style={{ color: "var(--muted2)", fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
            <span style={{ color: "var(--yellow)", fontWeight: 700 }}>{email}</span><br />
            သို့ verification link ပို့ပြီးပြီ
          </p>
          <p className="font-mm" style={{ color: "var(--muted2)", fontSize: 12, lineHeight: 1.7, marginBottom: 28 }}>
            Link ကို နှိပ်ပြီး account confirm လုပ်ပါ<br />
            Spam folder ပါ စစ်ကြည့်ပါ
          </p>
          <button onClick={() => setEmailSent(false)} style={{
            padding: "11px 24px", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer",
            background: "var(--glass)", color: "var(--muted)", border: "1px solid var(--border)",
          }}>
            ← ပြန်သွားရန်
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black gradient-text">RONNIX</Link>
          <p className="text-xs font-mm mt-2" style={{ color: "var(--muted)" }}>
            Myanmar Sellers AI Platform
          </p>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex rounded-xl p-1 mb-6" style={{ background: "var(--bg)" }}>
            {(["signup", "login"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                style={{
                  background: mode === m ? "var(--purple)" : "transparent",
                  color: mode === m ? "white" : "var(--muted)",
                }}
              >
                {m === "signup" ? "Register" : "Log in"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-xs font-mm"
              style={{ background: "rgba(139,92,246,0.1)", color: "#A78BFA" }}>
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              Sign up လုပ်ရင် 10 credits အခမဲ့ ရသည်!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                className="w-full px-4 py-3 rounded-xl outline-none transition-colors"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: 16,
                }}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full px-4 py-3 rounded-xl outline-none transition-colors"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: 16,
                }}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "var(--purple)" }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signup" ? "Register လုပ်မည်" : "Log in မည်"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--muted)" }}>
          <Link href="/" className="hover:text-[var(--text)] transition-colors">← Home ပြန်သွားရန်</Link>
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--bg)" }} />}>
      <AuthForm />
    </Suspense>
  )
}
