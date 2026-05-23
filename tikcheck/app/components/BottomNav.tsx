"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "../contexts/LanguageContext";

function IconHome({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF6B00" : "#444"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}

function IconHook({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF6B00" : "#444"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="15" height="13" rx="2"/>
      <path d="M17 8l4 4-4 4"/>
      <path d="M7 8h6M7 12h4"/>
    </svg>
  );
}

function IconCaption({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF6B00" : "#444"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}

function IconTags({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF6B00" : "#444"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <circle cx="7" cy="7" r="1.2" fill={active ? "#FF6B00" : "#444"} stroke="none"/>
    </svg>
  );
}

function IconImage({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF6B00" : "#444"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
  );
}

export default function BottomNav() {
  const path = usePathname();
  const { t } = useLang();

  const TOOLS = [
    { href: "/",         Icon: IconHome,    label: t.nav.home },
    { href: "/hook",     Icon: IconHook,    label: t.nav.hook },
    { href: "/caption",  Icon: IconCaption, label: t.nav.caption },
    { href: "/hashtags", Icon: IconTags,    label: t.nav.tags },
    { href: "/image",    Icon: IconImage,   label: t.nav.image },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(0,0,0,0.18)",
      backdropFilter: "blur(28px) saturate(180%)",
      WebkitBackdropFilter: "blur(28px) saturate(180%)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", justifyContent: "space-around",
      padding: "10px 0 20px",
    }}>
      {TOOLS.map(({ href, Icon, label }) => {
        const active = path === href;
        return (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 52, position: "relative" }}>
              <Icon active={active} />
              <span style={{
                fontSize: 9, fontWeight: 600, letterSpacing: "0.3px",
                color: active ? "#FF6B00" : "#444",
                transition: "color 0.2s",
              }}>{label}</span>
              {active && (
                <div style={{ position: "absolute", bottom: -12, width: 18, height: 2, borderRadius: 2, background: "#FF6B00" }} />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
