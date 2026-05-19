import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { SITE } from "@/config"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function Auth() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">("login")

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true })
    })
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate("/admin", { replace: true })
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success("အကောင့်ဖန်တီးပြီးပါပြီ! Admin panel ဝင်ပါ")
        setMode("login")
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="font-serif text-4xl text-ink">{SITE.name}</a>
          <p className="text-muted text-sm mt-2 font-mm">Admin Panel ဝင်ရောက်ရန်</p>
        </div>

        <div className="bg-white rounded-2xl border border-hairline shadow-card p-8">
          <div className="flex gap-2 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m ? "bg-deep text-cream" : "text-muted hover:bg-cream"
                }`}
              >
                {m === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-hairline rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-deep transition-colors bg-cream"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted uppercase tracking-wide block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-hairline rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-deep transition-colors bg-cream"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-deep text-cream py-3 rounded-xl text-sm font-medium hover:bg-ink transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "ဝင်ရောက်မည်" : "အကောင့်ဖန်တီးမည်"}
            </button>
          </form>

          {mode === "signup" && (
            <p className="mt-4 text-xs text-muted font-mm text-center">
              ပထမဆုံး sign up လုပ်သူ → auto admin ဖြစ်သည်
            </p>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-muted text-sm hover:text-ink transition-colors font-mm">
            ← Website ပြန်သွားရန်
          </a>
        </div>
      </div>
    </div>
  )
}
