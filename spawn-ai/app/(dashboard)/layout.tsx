import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import SessionWrapper from "./SessionWrapper"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/auth/signin")

  return (
    <SessionWrapper>
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Top nav */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
          style={{ background: "rgba(10,7,20,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(124,58,237,0.18)" }}>
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
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--muted)" }}>
                Sign out
              </button>
            </form>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 py-5"
          style={{ paddingBottom: "calc(88px + env(safe-area-inset-bottom))" }}>
          {children}
        </main>

        {/* Bottom nav — glass pill style */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
          background: "rgba(10,7,20,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(124,58,237,0.25)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "64px",
            maxWidth: "480px",
            margin: "0 auto",
            padding: "0 8px",
          }}>
            {[
              { href: "/dashboard", label: "Home",     icon: "🏠" },
              { href: "/shop",      label: "Shop",     icon: "🛍️" },
              { href: "/settings",  label: "Settings", icon: "⚙️" },
            ].map(({ href, label, icon }) => (
              <a key={href} href={href} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "3px", padding: "8px 24px", borderRadius: "16px",
                textDecoration: "none", transition: "all 0.2s",
                fontSize: "11px", fontWeight: 600,
              }}
              className="bottom-nav-item"
              data-href={href}>
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{icon}</span>
                <span style={{ color: "#8B85A0" }}>{label}</span>
              </a>
            ))}
          </div>
        </div>

        <style>{`
          .bottom-nav-item { color: #8B85A0; }
          .bottom-nav-item:hover { background: rgba(124,58,237,0.12); }
        `}</style>
      </div>
    </SessionWrapper>
  )
}
