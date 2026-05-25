"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Check, X, Loader2, LogOut, Shield } from "lucide-react"
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
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_id: "__ping__", secret: pwd }),
    })
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
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)", padding: "20px",
      }}>
        <div className="glass" style={{ width: "100%", maxWidth: 360, padding: "32px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(254,203,0,0.12)", border: "1px solid var(--border-y)",
            }}>
              <Shield style={{ width: 16, height: 16, color: "var(--yellow)" }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 16 }} className="grad-yg">RONNIX Admin</span>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Admin password"
              className="inp"
              style={{
                padding: "12px 16px", borderRadius: 12, outline: "none", fontSize: 14,
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-g)", color: "var(--text)",
              }}
            />
            <button type="submit" style={{
              padding: "13px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer",
              background: "var(--yellow)", color: "#020704", border: "none",
            }}>
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
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(2,7,4,0.90)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-g)", padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontWeight: 900, fontSize: 16 }} className="grad-yg">RONNIX Admin</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {pending.length > 0 && (
            <div style={{
              padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700,
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444",
            }}>
              {pending.length} pending
            </div>
          )}
          <button onClick={() => { localStorage.removeItem(ADMIN_KEY); setStoredPwd(""); setAuthed(false) }}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
              color: "var(--muted2)", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
            <LogOut style={{ width: 14, height: 14 }} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 60px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
            <Loader2 style={{ width: 24, height: 24, color: "var(--yellow)", animation: "spin 1s linear infinite" }} />
          </div>
        ) : (
          <>
            {/* Pending section */}
            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--muted2)" }}>
                PENDING ({pending.length})
              </p>
              <button onClick={loadPayments} style={{
                fontSize: 11, fontWeight: 600, color: "var(--muted2)", background: "none", border: "none",
                cursor: "pointer", padding: "4px 8px",
              }}>Refresh</button>
            </div>

            {pending.length === 0 && (
              <div className="glass" style={{ padding: "32px", textAlign: "center", marginBottom: 24 }}>
                <p className="font-mm" style={{ color: "var(--muted2)", fontSize: 13 }}>
                  Pending payment မရှိပါ ✓
                </p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {pending.map((p) => (
                <div key={p.id} className="glass" style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.email}</p>
                      <p style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 2 }}>
                        Wave: <strong style={{ color: "var(--text)" }}>{p.wave_number}</strong>
                      </p>
                      <p style={{ fontSize: 12, color: "var(--yellow)", fontWeight: 700 }}>
                        {p.amount_mmk.toLocaleString()} MMK → +{p.credits_to_add} credits
                      </p>
                      <p style={{ fontSize: 11, color: "var(--muted2)", marginTop: 4 }}>
                        {new Date(p.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={processing === p.id}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                          background: "rgba(109,201,58,0.15)", border: "1px solid rgba(109,201,58,0.3)",
                          color: "var(--green-xl)", cursor: "pointer",
                        }}
                      >
                        {processing === p.id
                          ? <Loader2 style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} />
                          : <Check style={{ width: 13, height: 13 }} />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        disabled={processing === p.id}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                          background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)",
                          color: "#EF4444", cursor: "pointer",
                        }}
                      >
                        <X style={{ width: 13, height: 13 }} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* History */}
            {done.length > 0 && (
              <>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--muted2)", marginBottom: 10 }}>
                  RECENT HISTORY
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {done.slice(0, 15).map((p) => (
                    <div key={p.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 18px", borderRadius: 12,
                      background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                    }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{p.email}</p>
                        <p style={{ fontSize: 11, color: "var(--muted2)" }}>
                          {p.amount_mmk.toLocaleString()} MMK · {p.credits_to_add} credits
                        </p>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100,
                        background: p.status === "approved" ? "rgba(109,201,58,0.12)" : "rgba(239,68,68,0.12)",
                        border: `1px solid ${p.status === "approved" ? "rgba(109,201,58,0.3)" : "rgba(239,68,68,0.25)"}`,
                        color: p.status === "approved" ? "var(--green-xl)" : "#EF4444",
                      }}>
                        {p.status === "approved" ? "Approved" : "Rejected"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
