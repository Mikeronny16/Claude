"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Egg, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return }
    setLoading(true)
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { toast.error(json.error || "Registration failed"); return }
    toast.success("Account created! Your first egg is waiting 🥚")
    router.push("/auth/signin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div style={{ background: "rgba(26,19,48,0.9)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "1.5rem" }} className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div style={{ filter: "drop-shadow(0 0 20px #F59E0B88)" }}>
              <svg width="48" height="58" viewBox="0 0 100 120"><defs><radialGradient id="eg2" cx="40%" cy="30%" r="65%"><stop offset="0%" stopColor="#fde68a"/><stop offset="60%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#d97706"/></radialGradient></defs><ellipse cx="50" cy="65" rx="38" ry="50" fill="url(#eg2)"/></svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Your egg is waiting</h1>
          <p className="text-gray-400 text-sm mt-1">Create a free account to hatch it</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1.5">Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-purple-500"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.3)" }}
              placeholder="Your name" />
          </div>
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
              placeholder="Min 6 characters" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)" }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Egg className="w-4 h-4" />}
            Hatch my first egg — Free
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Have an account? <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
