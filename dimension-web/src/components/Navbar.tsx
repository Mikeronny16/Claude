import { useState, useEffect } from "react"
import { useLang } from "../lib/lang"

const DIMS = [
  { id: "hero", label: "INTRO" },
  { id: "d0", label: "0D" },
  { id: "d1", label: "1D" },
  { id: "d2", label: "2D" },
  { id: "d3", label: "3D" },
  { id: "d4", label: "4D" },
]

export default function Navbar() {
  const { lang, toggle } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        <span className="font-orbitron text-sm font-bold tracking-[0.3em] text-white/80">
          DIM<span className="text-[#A855F7]">ENSIONS</span>
        </span>

        <div className="hidden md:flex items-center gap-1">
          {DIMS.map((d) => (
            <button
              key={d.id}
              onClick={() => scrollTo(d.id)}
              className="px-3 py-1.5 font-mono text-[10px] text-white/40 hover:text-white transition-colors tracking-widest"
            >
              {d.label}
            </button>
          ))}
        </div>

        <button
          onClick={toggle}
          className="font-mono text-[10px] border border-white/20 px-3 py-1.5 rounded-full text-white/50 hover:border-[#A855F7]/60 hover:text-[#A855F7] transition-all"
        >
          {lang === "mm" ? "EN" : "MM"}
        </button>
      </div>
    </nav>
  )
}
