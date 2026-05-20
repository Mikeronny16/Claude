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
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
          style={{ background: "rgba(15,10,30,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(139,92,246,0.2)" }}
        >
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-white text-lg">
            <svg width="24" height="29" viewBox="0 0 100 120">
              <defs><radialGradient id="nl" cx="40%" cy="30%" r="65%"><stop offset="0%" stopColor="#f5d0fe"/><stop offset="60%" stopColor="#a855f7"/><stop offset="100%" stopColor="#7c3aed"/></radialGradient></defs>
              <ellipse cx="50" cy="65" rx="38" ry="50" fill="url(#nl)"/>
            </svg>
            <span className="text-gradient">Spawn AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">{session.user?.name ?? session.user?.email}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
              <button
                type="submit"
                className="text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 py-6 pb-24">{children}</main>
        <BottomNav />
      </div>
    </SessionWrapper>
  )
}
