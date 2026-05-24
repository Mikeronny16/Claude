import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { SITE } from "@/config"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const links = [
    { href: "#shop", mm: "ရောင်းပစ္စည်း", en: "Shop" },
    { href: "#about", mm: "ကျွန်မတို့", en: "About" },
    { href: "#contact", mm: "ဆက်သွယ်ရန်", en: "Contact" },
  ]

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-glass border-b border-hairline" : "bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-serif text-2xl font-black tracking-[0.2em] text-cream hover:text-pink transition-colors duration-300">
          SINAR
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group flex flex-col items-center gap-0.5">
              <span className="font-mm text-sm text-muted group-hover:text-cream transition-colors duration-200">{l.mm}</span>
              <span className="text-[9px] text-muted/40 group-hover:text-pink transition-colors duration-200 tracking-widest uppercase">{l.en}</span>
            </a>
          ))}
          <a
            href={SITE.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-xs font-medium px-5 py-2 rounded-full border border-pink text-pink hover:bg-pink hover:text-white transition-all duration-300 overflow-hidden group"
          >
            <span className="relative z-10">Facebook</span>
            <span className="absolute inset-0 bg-pink scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-cream hover:text-pink transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-glass border-t border-hairline px-5 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 border-b border-hairline last:border-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                <span className="font-mm text-cream text-base">{l.mm}</span>
                <span className="text-xs text-muted tracking-widest uppercase">{l.en}</span>
              </motion.a>
            ))}
            <motion.a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full flex items-center justify-center bg-pink text-white text-sm font-medium py-3 rounded-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Facebook Page
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
