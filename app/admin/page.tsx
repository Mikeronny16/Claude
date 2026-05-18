"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, X, Users, Clock, DollarSign, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { Toaster } from "sonner"

interface PaymentRequest {
  id: string; userId: string; plan: string; amount: number; status: string;
  adminNote: string | null; createdAt: string; approvedAt: string | null;
  user: { email: string; name: string | null; plan: string; credits: number }
}

interface User {
  id: string; email: string; name: string | null; plan: string;
  credits: number; planExpiresAt: string | null; createdAt: string;
}

export default function AdminPage() {
  const [requests, setRequests] = useState<PaymentRequest[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<"requests" | "users">("requests")

  useEffect(() => {
    fetchRequests()
    fetchUsers()
  }, [])

  async function fetchRequests() {
    const res = await fetch("/api/admin/requests")
    if (res.ok) setRequests(await res.json())
  }

  async function fetchUsers() {
    const res = await fetch("/api/admin/users")
    if (res.ok) setUsers(await res.json())
  }

  async function handleAction(requestId: string, action: "approve" | "reject") {
    setLoading(true)
    const res = await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action, adminNote: notes[requestId] }),
    })
    setLoading(false)
    if (res.ok) {
      toast.success(action === "approve" ? "Plan activate လုပ်ပြီး!" : "Rejected")
      fetchRequests()
      fetchUsers()
    } else {
      toast.error("Error occurred")
    }
  }

  const pending = requests.filter(r => r.status === "pending")
  const totalUsers = users.length
  const payingUsers = users.filter(u => u.plan !== "free").length
  const mrr = users.reduce((acc, u) => acc + (u.plan === "pro" ? 9 : u.plan === "business" ? 29 : 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <Toaster richColors position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: totalUsers, icon: Users, color: "bg-blue-100 text-blue-600" },
            { label: "Paying Users", value: payingUsers, icon: Users, color: "bg-green-100 text-green-600" },
            { label: "MRR (est.)", value: `$${mrr}`, icon: DollarSign, color: "bg-purple-100 text-purple-600" },
            { label: "Pending", value: pending.length, icon: Clock, color: "bg-yellow-100 text-yellow-600" },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}><Icon className="h-4 w-4" /></div>
                  <div><p className="text-xl font-bold">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p></div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button variant={activeTab === "requests" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("requests")}>
            Payment Requests {pending.length > 0 && <Badge className="ml-2 bg-red-500">{pending.length}</Badge>}
          </Button>
          <Button variant={activeTab === "users" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("users")}>
            All Users
          </Button>
        </div>

        {/* Payment Requests */}
        {activeTab === "requests" && (
          <div className="space-y-3">
            {requests.length === 0 && <Card><CardContent className="p-8 text-center text-gray-400">Payment request မရှိပါ</CardContent></Card>}
            {requests.map(req => (
              <Card key={req.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{req.user.email}</p>
                        <Badge variant={req.status === "approved" ? "success" as never : req.status === "rejected" ? "destructive" : "warning" as never}>
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{req.user.name} · Wants: <span className="font-medium capitalize">{req.plan}</span> (${req.amount}/mo)</p>
                      <p className="text-xs text-gray-400">Current plan: {req.user.plan} · Requested: {formatDate(req.createdAt)}</p>
                    </div>
                    {req.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Note (optional)"
                          className="w-40 h-8 text-sm"
                          value={notes[req.id] ?? ""}
                          onChange={e => setNotes(n => ({ ...n, [req.id]: e.target.value }))}
                        />
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAction(req.id, "approve")} disabled={loading}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleAction(req.id, "reject")} disabled={loading}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {req.adminNote && <p className="text-xs text-gray-500 mt-2">Note: {req.adminNote}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="space-y-2">
            {users.map(user => (
              <Card key={user.id}>
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.name} · Joined {formatDate(user.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{user.plan}</Badge>
                    <span className="text-sm text-gray-500">{user.credits} credits</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
