"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, CheckCircle, XCircle, Users, ShoppingBag } from "lucide-react"

type PaymentRequest = {
  id: string; status: string; plan: string; amount: number; adminNote: string | null
  createdAt: string; approvedAt: string | null
  user: { email: string; name: string | null; plan: string }
}
type User = { id: string; email: string; name: string | null; plan: string; isAdmin: boolean; createdAt: string; messagesUsedToday: number }

export default function AdminPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<PaymentRequest[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"requests" | "users">("requests")
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/requests")
      .then(r => r.json())
      .then(d => {
        if (d.error) { toast.error("Admin access required"); router.push("/dashboard"); return }
        setRequests(d.requests)
        setUsers(d.users)
        setLoading(false)
      })
      .catch(() => { toast.error("Failed to load"); router.push("/dashboard") })
  }, [router])

  async function act(id: string, action: "approve" | "reject", note?: string) {
    setActing(id)
    const res = await fetch(`/api/admin/requests/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, note }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success(action === "approve" ? "✅ Approved!" : "❌ Rejected")
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action === "approve" ? "approved" : "rejected" } : r))
    } else {
      toast.error("Failed")
    }
    setActing(null)
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
  }

  const pending = requests.filter(r => r.status === "pending")
  const planColor: Record<string, string> = { free: "#9CA3AF", pro: "#8B5CF6", ultra: "#F59E0B" }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-sm text-gray-400 mt-1">{pending.length} pending · {users.length} users total</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: "requests", label: "Payment Requests", icon: ShoppingBag },
          { key: "users", label: "Users", icon: Users },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as never)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={tab === t.key
              ? { background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.5)", color: "#a78bfa" }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }
            }>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "requests" && (
        <div className="space-y-3">
          {requests.length === 0 && (
            <div className="text-center py-10 text-gray-500">No payment requests yet</div>
          )}
          {requests.map(r => (
            <div key={r.id} className="p-4 rounded-2xl space-y-3"
              style={{ background: "rgba(26,19,48,0.8)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{r.user.name ?? r.user.email}</p>
                  <p className="text-xs text-gray-400">{r.user.email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold capitalize"
                    style={{ background: `${planColor[r.plan] ?? "#9CA3AF"}22`, color: planColor[r.plan] ?? "#9CA3AF" }}>
                    {r.plan} plan
                  </span>
                  <p className="text-xs text-gray-400 mt-1">${r.amount}</p>
                </div>
              </div>

              {r.adminNote && (
                <p className="text-xs text-gray-400 italic">Note: {r.adminNote}</p>
              )}

              <div className="flex gap-2">
                {r.status === "pending" ? (
                  <>
                    <button onClick={() => act(r.id, "approve")} disabled={acting === r.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10B981" }}>
                      {acting === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Approve
                    </button>
                    <button onClick={() => act(r.id, "reject")} disabled={acting === r.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}>
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </>
                ) : (
                  <span className={`text-sm font-medium ${r.status === "approved" ? "text-green-400" : "text-red-400"}`}>
                    {r.status === "approved" ? "✅ Approved" : "❌ Rejected"}
                    {r.approvedAt && ` · ${new Date(r.approvedAt).toLocaleDateString()}`}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: "rgba(26,19,48,0.8)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <div>
                <p className="text-sm font-medium text-white">{u.name ?? u.email}</p>
                <p className="text-xs text-gray-500">{u.email} · {u.messagesUsedToday} msgs today</p>
              </div>
              <div className="flex items-center gap-2">
                {u.isAdmin && <span className="text-xs text-amber-400">admin</span>}
                <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                  style={{ color: planColor[u.plan] ?? "#9CA3AF", background: `${planColor[u.plan] ?? "#9CA3AF"}18` }}>
                  {u.plan}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
