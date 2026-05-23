"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "../contexts/LanguageContext";

export default function BottomNav() {
  const path = usePathname();
  const { t } = useLang();

  const TOOLS = [
    { href: "/",        icon: "🏠", label: t.nav.home },
    { href: "/hook",    icon: "🎬", label: t.nav.hook },
    { href: "/caption", icon: "✍️", label: t.nav.caption },
    { href: "/hashtags",icon: "#️⃣", label: t.nav.tags },
    { href: "/image",   icon: "🖼️", label: t.nav.image },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(0,0,0,0.94)",
      backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-around",
      padding: "10px 0 18px",
    }}>
      {TOOLS.map((tool) => {
        const active = path === tool.href;
        return (
          <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 52, position: "relative" }}>
              <span style={{ fontSize: 22 }}>{tool.icon}</span>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: active ? "#FF0050" : "#333",
                letterSpacing: "0.3px",
                transition: "color 0.2s",
              }}>{tool.label}</span>
              {active && (
                <div style={{ position: "absolute", bottom: -10, width: 20, height: 2, borderRadius: 2, background: "#FF0050" }} />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
