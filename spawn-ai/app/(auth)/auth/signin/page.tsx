"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Egg, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn("credentials", { ...form, redirect: false })
    setLoading(false)
    if (res?.error) { toast.error("Email or password incorrect"); return }
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div style={{ background: "rgba(26,19,48,0.9)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "1.5rem" }} className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div style={{ filter: "drop-shadow(0 0 20px #8B5CF688)" }}>
              <svg width="48" height="58" viewBox="0 0 100 120"><defs><radialGradient id="eg" cx="40%" cy="30%" r="65%"><stop offset="0%" stopColor="#f5d0fe"/><stop offset="60%" stopColor="#a855f7"/><stop offset="100%" stopColor="#7c3aed"/></radialGradient></defs><ellipse cx="50" cy="65" rx="38" ry="50" fill="url(#eg)"/></svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Your pet is waiting for you</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1.5">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.3)" }}
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1.5">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.3)" }}
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Egg className="w-4 h-4" />}
            Sign in
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          No account? <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300">Create one free</Link>
        </p>
      </div>
    </div>
  )
}
