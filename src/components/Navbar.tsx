import { useState, useEffect } from "react"
import { Menu, X, Sparkles } from "lucide-react"
import { SITE } from "@/config"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const links = [
    { href: "#shop", label: "ရောင်းပစ္စည်း", en: "Shop" },
    { href: "#about", label: "ကျွန်မတို့", en: "About" },
    { href: "#contact", label: "ဆက်သွယ်ရန်", en: "Contact" },
  ]

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur shadow-card border-b border-hairline" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="font-serif text-2xl font-semibold text-ink tracking-wide">
          {SITE.name}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group flex flex-col items-center">
              <span className="font-mm text-sm text-muted group-hover:text-ink transition-colors">{l.label}</span>
              <span className="text-[10px] text-muted/60 group-hover:text-muted transition-colors">{l.en}</span>
            </a>
          ))}
          <a
            href="/style"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-pink-400/60 text-pink-500 hover:border-pink-500 hover:bg-pink-50 transition-all duration-200"
          >
            <Sparkles className="w-3 h-3" />
            Style Quiz
          </a>
          <a
            href={SITE.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-deep text-cream text-xs font-medium px-5 py-2 rounded-full hover:bg-ink transition-colors"
          >
            Facebook
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-hairline px-4 pb-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-3 border-b border-hairline last:border-0"
            >
              <span className="font-mm text-sm text-ink">{l.label}</span>
              <span className="text-xs text-muted">{l.en}</span>
            </a>
          ))}
          <a
            href="/style"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 py-3 border-b border-hairline text-pink-500 font-mm text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Style Quiz — မင်းရဲ့ Fashion Style ဘာလဲ?
          </a>
          <a
            href={SITE.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full flex items-center justify-center bg-deep text-cream text-sm font-medium py-2.5 rounded-full"
          >
            Facebook Page
          </a>
        </div>
      )}
    </header>
  )
}
