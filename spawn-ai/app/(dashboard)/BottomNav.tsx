"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Home, ShoppingBag, Settings, Shield } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const links = [
    { href: "/dashboard", icon: Home,        label: "Home"     },
    { href: "/shop",      icon: ShoppingBag, label: "Shop"     },
    { href: "/settings",  icon: Settings,    label: "Settings" },
    ...(session?.user?.isAdmin ? [{ href: "/admin", icon: Shield, label: "Admin" }] : []),
  ]

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-around px-2"
      style={{
        background: "rgba(8,6,20,0.95)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(139,92,246,0.2)",
        paddingBottom: "env(safe-area-inset-bottom, 12px)",
        paddingTop: "10px",
      }}
    >
      {links.map(({ href, icon: Icon, label }) => {
        const active = isActive(href)
        return (
          <Link key={href} href={href}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
            style={{ minWidth: 64 }}>
            <div className="relative">
              {active && (
                <div className="absolute -inset-2 rounded-xl"
                  style={{ background: "rgba(139,92,246,0.15)" }} />
              )}
              <Icon className="w-5 h-5 relative z-10 transition-colors"
                style={{ color: active ? "#A78BFA" : "#6B7280" }} />
            </div>
            <span className="text-xs transition-colors"
              style={{ color: active ? "#A78BFA" : "#6B7280", fontWeight: active ? 600 : 400 }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
