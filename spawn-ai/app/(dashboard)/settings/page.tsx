"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Loader2, User, Lock, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? "")
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  async function saveName(e: React.FormEvent) {
    e.preventDefault()
    setSavingName(true)
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    setSavingName(false)
    if (data.success) { toast.success("Name updated!"); await update({ name }) }
    else toast.error(data.error ?? "Failed")
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw.length < 6) { toast.error("Password must be at least 6 characters"); return }
    setSavingPw(true)
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    })
    const data = await res.json()
    setSavingPw(false)
    if (data.success) { toast.success("Password changed!"); setCurrentPw(""); setNewPw("") }
    else toast.error(data.error ?? "Failed")
  }

  const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.25)" }
  const cardStyle = { background: "rgba(26,19,48,0.8)", border: "1px solid rgba(139,92,246,0.2)" }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>

      {/* Account info */}
      <div className="p-4 rounded-2xl space-y-3" style={cardStyle}>
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-white">Account Info</span>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Email</p>
          <p className="text-sm text-gray-300">{session?.user?.email}</p>
        </div>
        <div className="pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-purple-400" />
            <p className="text-xs text-gray-500 capitalize">Plan: <span className="text-purple-300 font-medium">{(session?.user as { plan?: string })?.plan ?? "free"}</span></p>
          </div>
          <Link href="/pricing" className="inline-block mt-2 text-xs text-purple-400 hover:text-purple-300">
            Upgrade plan →
          </Link>
        </div>
      </div>

      {/* Change name */}
      <div className="p-4 rounded-2xl" style={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-white">Display Name</span>
        </div>
        <form onSubmit={saveName} className="space-y-3">
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Your name" maxLength={30}
            className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
            style={inputStyle}
          />
          <button type="submit" disabled={savingName}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)" }}>
            {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Name"}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="p-4 rounded-2xl" style={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-white">Change Password</span>
        </div>
        <form onSubmit={savePassword} className="space-y-3">
          <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
            placeholder="Current password"
            className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
            style={inputStyle}
          />
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
            placeholder="New password (min 6 chars)"
            className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
            style={inputStyle}
          />
          <button type="submit" disabled={savingPw || !currentPw || !newPw}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)" }}>
            {savingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change Password"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <p className="text-sm font-semibold text-red-400 mb-1">Sign out</p>
        <p className="text-xs text-gray-500 mb-3">You can sign back in anytime.</p>
        <Link href="/" className="text-xs text-red-400 hover:text-red-300">Sign out →</Link>
      </div>
    </div>
  )
}
