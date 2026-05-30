import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SITE } from "@/config"
import { Loader2, Lock } from "lucide-react"
import { toast } from "sonner"

const AUTH_KEY = "sinar_admin_auth"
const ADMIN_PWD = import.meta.env.VITE_ADMIN_PASSWORD || "sinar2025"

export default function Auth() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === "true") navigate("/admin", { replace: true })
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    if (password === ADMIN_PWD) {
      localStorage.setItem(AUTH_KEY, "true")
      navigate("/admin", { replace: true })
    } else {
      toast.error("Password မှားနေသည်")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="font-serif text-4xl text-ink">{SITE.name}</a>
          <p className="text-muted text-sm mt-2 font-mm">Admin Panel ဝင်ရောက်ရန်</p>
        </div>

        <div className="bg-white rounded-2xl border border-hairline shadow-card p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-blush border border-hairline flex items-center justify-center">
              <Lock className="w-5 h-5 text-deep" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-medium text-muted uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-hairline rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-deep transition-colors bg-cream"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-deep text-cream py-3 rounded-xl text-sm font-semibold hover:bg-ink transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span className="font-mm">ဝင်ရောက်မည်</span>
            </button>
          </form>
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
