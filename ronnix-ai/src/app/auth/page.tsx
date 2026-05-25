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
        toast.success("Email စစ်ဆေးပါ! Verification link ပို့ထားပြီ")
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
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
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
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
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
