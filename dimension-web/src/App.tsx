import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { LangProvider, useLang } from "./lib/lang"
import ZeroDSection from "./sections/ZeroDSection"
import OneDSection from "./sections/OneDSection"
import TwoDSection from "./sections/TwoDSection"
import ThreeDSection from "./sections/ThreeDSection"
import FourDSection from "./sections/FourDSection"
import "./index.css"

export const DIMS = [
  { id: 0, label: "0D", color: "#C0C0FF" },
  { id: 1, label: "1D", color: "#00F5FF" },
  { id: 2, label: "2D", color: "#A855F7" },
  { id: 3, label: "3D", color: "#FF1F6E" },
  { id: 4, label: "4D", color: "#FFD700" },
]

const PANELS = [ZeroDSection, OneDSection, TwoDSection, ThreeDSection, FourDSection]

function SideDots({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-5 items-end">
      {DIMS.map(dim => {
        const on = active === dim.id
        return (
          <button key={dim.id} onClick={() => setActive(dim.id)}
            className="relative flex items-center gap-2.5 group">
            <span className="absolute right-5 font-orbitron text-[9px] font-bold whitespace-nowrap
              opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
              transition-all duration-200 pointer-events-none"
              style={{ color: dim.color }}>
              {dim.label}
            </span>
            <div className="rounded-full flex-shrink-0 transition-all duration-300"
              style={{
                width: on ? 10 : 6, height: on ? 10 : 6,
                background: on ? dim.color : "rgba(255,255,255,0.22)",
                boxShadow: on ? `0 0 12px ${dim.color}, 0 0 28px ${dim.color}45` : "none",
              }} />
          </button>
        )
      })}
    </div>
  )
}

function LangToggle() {
  const { lang, toggle } = useLang()
  return (
    <button onClick={toggle}
      className="fixed top-5 left-5 z-50 font-mono text-[10px] border border-white/10 px-3 py-1.5 rounded-full text-white/40 hover:border-white/30 hover:text-white/70 transition-all"
      style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.4)" }}>
      {lang === "mm" ? "EN" : "MM"}
    </button>
  )
}

function Inner() {
  const [active, setActive] = useState(0)
  const Panel = PANELS[active]

  return (
    <>
      {/* Scene — no overflow:hidden so iOS fixed children work */}
      <div style={{ position: "fixed", inset: 0, background: "#000008" }}>
        <AnimatePresence mode="wait">
          <Panel key={active} />
        </AnimatePresence>
      </div>
      {/* UI outside the scene container so fixed positioning is relative to viewport */}
      <SideDots active={active} setActive={setActive} />
      <LangToggle />
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Inner />
    </LangProvider>
  )
}
