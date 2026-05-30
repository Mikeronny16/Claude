import { useEffect, useRef } from "react"
import { useLang } from "../lib/lang"

export default function HeroSection() {
  const { t } = useLang()
  const dotsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = dotsRef.current
    if (!el) return
    const dots = Array.from({ length: 60 }, () => {
      const d = document.createElement("div")
      d.style.cssText = `
        position:absolute;
        width:${Math.random() * 3 + 1}px;
        height:${Math.random() * 3 + 1}px;
        background:white;
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        opacity:${Math.random() * 0.6 + 0.1};
        animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
        animation-delay:${Math.random() * 3}s;
      `
      el.appendChild(d)
      return d
    })
    return () => dots.forEach(d => d.remove())
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg">
      {/* Star field */}
      <div ref={dotsRef} className="absolute inset-0 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 text-center px-5">
        {/* Label */}
        <div className="font-mono text-[10px] tracking-[0.5em] text-[#A855F7] mb-6 uppercase">
          {t("မိတ်ဆက် • Interactive", "Interactive • Introduction")}
        </div>

        {/* Big title */}
        <h1 className="font-orbitron font-black leading-none mb-2">
          <div className="text-[clamp(3rem,15vw,9rem)] tracking-tight text-white glitch-text">
            DIM
          </div>
          <div className="text-[clamp(3rem,15vw,9rem)] tracking-tight bg-gradient-to-r from-[#00F5FF] via-[#A855F7] to-[#FF1F6E] bg-clip-text text-transparent">
            ENSIONS
          </div>
        </h1>

        {/* Myanmar subtitle */}
        <p className="font-mm text-lg sm:text-xl text-white/60 mt-4 mb-2">
          {t("0D မှ 4D ထိ — အကြောင်းအရာ", "From 0D to 4D — The Full Story")}
        </p>
        <p className="font-mono text-xs text-white/30 tracking-widest">
          {t("scroll လုပ်ပြီး စတင်ကြည့်ရှုပါ ↓", "scroll to explore ↓")}
        </p>

        {/* Dimension pills */}
        <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
          {[
            { label: "0D", color: "#C0C0FF" },
            { label: "1D", color: "#00F5FF" },
            { label: "2D", color: "#A855F7" },
            { label: "3D", color: "#FF1F6E" },
            { label: "4D", color: "#FFD700" },
          ].map((d, i) => (
            <div
              key={d.label}
              className="font-orbitron text-xs font-bold px-4 py-2 rounded-full border"
              style={{
                color: d.color,
                borderColor: d.color + "40",
                background: d.color + "10",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {d.label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#A855F7]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] pulse-glow" />
      </div>
    </section>
  )
}
