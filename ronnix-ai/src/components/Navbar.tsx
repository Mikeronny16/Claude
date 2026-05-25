"use client"

import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { Profile } from "@/lib/supabase"
import { LogOut, Zap } from "lucide-react"

export default function Navbar({ profile }: { profile: Profile | null }) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 border-b"
      style={{ background: "rgba(13,13,20,0.95)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
      <Link href="/dashboard" className="text-lg font-black gradient-text">RONNIX</Link>

      <div className="flex items-center gap-3">
        {profile && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#A78BFA" }}>
            <Zap className="w-3 h-3" />
            {profile.plan === "free"
              ? `${3 - (profile.daily_count || 0)}/day`
              : `${profile.credits} cr`}
          </div>
        )}

        <Link href="/pricing" className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors hover:text-[var(--text)]"
          style={{ color: "var(--muted)" }}>
          Credits
        </Link>

        <button onClick={handleLogout} className="p-1.5 rounded-lg transition-colors hover:text-[var(--text)]"
          style={{ color: "var(--muted)" }}>
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  )
}
