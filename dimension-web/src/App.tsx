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

function DimNav({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const d = DIMS[active]
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-2 rounded-full"
      style={{
        background: "rgba(0,0,8,0.7)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: `0 0 40px ${d.color}18`,
      }}>
      {DIMS.map(dim => {
        const on = active === dim.id
        return (
          <button key={dim.id} onClick={() => setActive(dim.id)}
            className="px-4 py-1.5 font-orbitron text-xs font-bold rounded-full transition-all duration-400"
            style={{
              color: on ? "#000008" : dim.color + "60",
              background: on ? dim.color : "transparent",
              boxShadow: on ? `0 0 18px ${dim.color}55` : "none",
            }}>
            {dim.label}
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
      className="fixed top-5 right-5 z-50 font-mono text-[10px] border border-white/10 px-3 py-1.5 rounded-full text-white/40 hover:border-white/30 hover:text-white/70 transition-all"
      style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.35)" }}>
      {lang === "mm" ? "EN" : "MM"}
    </button>
  )
}

function Inner() {
  const [active, setActive] = useState(0)
  const Panel = PANELS[active]

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#000008" }}>
      <AnimatePresence mode="wait">
        <Panel key={active} />
      </AnimatePresence>
      <DimNav active={active} setActive={setActive} />
      <LangToggle />
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Inner />
    </LangProvider>
  )
}
