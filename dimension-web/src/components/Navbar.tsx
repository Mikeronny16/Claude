import { useState, useEffect } from "react"
import { useLang } from "../lib/lang"

const DIMS = [
  { id: "d0", label: "0D", color: "#C0C0FF" },
  { id: "d1", label: "1D", color: "#00F5FF" },
  { id: "d2", label: "2D", color: "#A855F7" },
  { id: "d3", label: "3D", color: "#FF1F6E" },
  { id: "d4", label: "4D", color: "#FFD700" },
]

export default function Navbar() {
  const { lang, toggle } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("")

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  useEffect(() => {
    const obs = DIMS.map(d => {
      const el = document.getElementById(d.id)
      if (!el) return null
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(d.id) },
        { threshold: 0.35 }
      )
      o.observe(el)
      return o
    })
    return () => obs.forEach(o => o?.disconnect())
  }, [])

  const activeDim = DIMS.find(d => d.id === active)

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/85 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        <button
          onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
          className="font-orbitron text-sm font-bold tracking-[0.3em] text-white/70 hover:text-white transition-colors"
        >
          DIM<span style={{ color: activeDim?.color ?? "#A855F7", transition: "color 0.5s" }}>ENSIONS</span>
        </button>

        <div className="hidden md:flex items-center">
          {DIMS.map(d => {
            const on = active === d.id
            return (
              <button
                key={d.id}
                onClick={() => document.getElementById(d.id)?.scrollIntoView({ behavior: "smooth" })}
                className="relative px-3 py-2 font-mono text-[10px] tracking-widest transition-all duration-300"
                style={{ color: on ? d.color : "rgba(255,255,255,0.28)" }}
              >
                {on && (
                  <span
                    className="absolute bottom-0 inset-x-2 h-px rounded-full"
                    style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }}
                  />
                )}
                {d.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={toggle}
          className="font-mono text-[10px] border border-white/15 px-3 py-1.5 rounded-full text-white/45 hover:border-white/35 hover:text-white/80 transition-all"
        >
          {lang === "mm" ? "EN" : "MM"}
        </button>
      </div>
    </nav>
  )
}
