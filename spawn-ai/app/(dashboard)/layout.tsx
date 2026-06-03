import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import SessionWrapper from "./SessionWrapper"
import BottomNav from "./BottomNav"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/auth/signin")

  return (
    <SessionWrapper>
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Top nav */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
          style={{
            background: "rgba(10,7,20,0.92)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(124,58,237,0.18)",
          }}>
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-white text-lg">
            <svg width="24" height="29" viewBox="0 0 100 120">
              <defs>
                <radialGradient id="nl" cx="40%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#f5d0fe"/>
                  <stop offset="60%" stopColor="#a855f7"/>
                  <stop offset="100%" stopColor="#7c3aed"/>
                </radialGradient>
              </defs>
              <ellipse cx="50" cy="65" rx="38" ry="50" fill="url(#nl)"/>
            </svg>
            <span className="text-gradient">Spawn AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block" style={{ color: "var(--muted)" }}>
              {session.user?.name ?? session.user?.email}
            </span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
              <button type="submit"
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--muted)",
                }}>
                Sign out
              </button>
            </form>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 py-5"
          style={{ paddingBottom: "calc(88px + env(safe-area-inset-bottom))" }}>
          {children}
        </main>

        <BottomNav />
      </div>
    </SessionWrapper>
  )
}
