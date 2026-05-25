"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Check, X, Loader2, LogOut } from "lucide-react"
import type { PaymentRequest } from "@/lib/supabase"

const ADMIN_KEY = "ronnix_admin_auth"

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pwd, setPwd] = useState("")
  const [storedPwd, setStoredPwd] = useState("")
  const [payments, setPayments] = useState<(PaymentRequest & { email?: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_KEY)
    if (saved) { setStoredPwd(saved); setAuthed(true) }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // Verify against server — never expose secret client-side
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_id: "__ping__", secret: pwd }),
    })
    // 404 = secret correct but payment not found; 401 = wrong secret
    if (res.status !== 401) {
      localStorage.setItem(ADMIN_KEY, pwd)
      setStoredPwd(pwd)
      setAuthed(true)
    } else {
      toast.error("Password မှားသည်")
    }
  }

  async function loadPayments() {
    setLoading(true)
    const { data } = await supabase
      .from("payment_requests")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false })
      .limit(50)
    if (data) {
      setPayments(data.map((p: PaymentRequest & { profiles?: { email: string } }) => ({
        ...p,
        email: p.profiles?.email,
      })))
    }
    setLoading(false)
  }

  useEffect(() => {
    if (authed) loadPayments()
  }, [authed])

  async function handleApprove(id: string) {
    setProcessing(id)
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: id, secret: storedPwd }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Approved! Credits ထည့်ပြီ")
      loadPayments()
    } catch {
      toast.error("Error ဖြစ်သွားသည်")
    } finally {
      setProcessing(null)
    }
  }

  async function handleReject(id: string) {
    setProcessing(id)
    try {
      const res = await fetch("/api/admin/approve", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: id, secret: storedPwd }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Rejected")
      loadPayments()
    } catch {
      toast.error("Error ဖြစ်သွားသည်")
    } finally {
      setProcessing(null)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-sm p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h1 className="text-xl font-black mb-6 gradient-text">RONNIX Admin</h1>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--purple)" }}>
              Log in
            </button>
          </form>
        </div>
      </div>
    )
  }

  const pending = payments.filter(p => p.status === "pending")
  const done = payments.filter(p => p.status !== "pending")

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--border)" }}>
        <h1 className="font-black gradient-text">RONNIX Admin</h1>
        <button onClick={() => { localStorage.removeItem(ADMIN_KEY); setStoredPwd(""); setAuthed(false) }}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
          style={{ color: "var(--muted)" }}>
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--purple)" }} />
          </div>
        ) : (
          <>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
              Pending ({pending.length})
            </h2>

            {pending.length === 0 && (
              <p className="text-sm font-mm py-8 text-center" style={{ color: "var(--muted)" }}>
                Pending payment မရှိပါ
              </p>
            )}

            <div className="space-y-3 mb-8">
              {pending.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{p.email}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                        Wave: {p.wave_number} · {p.amount_mmk.toLocaleString()} MMK → +{p.credits_to_add} credits
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                        {new Date(p.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={processing === p.id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-80"
                        style={{ background: "#10B981" }}
                      >
                        {processing === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        disabled={processing === p.id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                        style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                      >
                        <X className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {done.length > 0 && (
              <>
                <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--muted)" }}>
                  Recent History
                </h2>
                <div className="space-y-2">
                  {done.slice(0, 10).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "var(--text)" }}>{p.email}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {p.amount_mmk.toLocaleString()} MMK · {p.credits_to_add} credits
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          background: p.status === "approved" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                          color: p.status === "approved" ? "#10B981" : "#EF4444",
                        }}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
