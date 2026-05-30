import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLang } from "../lib/lang"

const C = "#C0C0FF"

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-10 xl:left-14 lg:right-auto"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      <div className="w-full lg:w-[340px] xl:w-[380px] px-5 pt-5 pb-8 lg:p-7 lg:rounded-2xl rounded-t-2xl"
        style={{
          background: `linear-gradient(145deg,${C}09,${C}03)`,
          backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
          borderTop: `1px solid ${C}22`,
          borderLeft: `1px solid ${C}14`,
          borderRight: `1px solid ${C}10`,
        }}>
        {children}
      </div>
    </motion.div>
  )
}

export default function ZeroDSection() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let raf = 0, time = 0
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.018
      const cx = canvas.width / 2
      const cy = canvas.height * 0.38
      const r = 16 + Math.sin(time * 2) * 6

      for (let i = 8; i >= 1; i--) {
        ctx.beginPath(); ctx.arc(cx, cy, r * i * 2.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192,192,255,${0.018 / i})`; ctx.fill()
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3.5)
      g.addColorStop(0, "#fff"); g.addColorStop(0.28, C)
      g.addColorStop(0.6, C + "40"); g.addColorStop(1, "transparent")
      ctx.beginPath(); ctx.arc(cx, cy, r * 3.5, 0, Math.PI * 2)
      ctx.fillStyle = g; ctx.fill()
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"; ctx.shadowBlur = 20; ctx.shadowColor = C
      ctx.fill(); ctx.shadowBlur = 0
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <motion.div className="absolute inset-0" style={{ background: "#000008" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>

      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Vignette + bottom fade for card readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,#000008_85%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-[#000008] via-[#000008]/70 to-transparent pointer-events-none lg:hidden" />

      <GlassCard>
        <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: C + "55" }}>
          {t("ဒိမ်နရှင် သုည", "Dimension Zero")}
        </p>
        <div className="font-orbitron font-black leading-none mb-2"
          style={{ fontSize: "clamp(3rem,10vw,5rem)", color: C, textShadow: `0 0 50px ${C}70` }}>
          0D
        </div>
        <h2 className="font-orbitron text-sm lg:text-base font-bold text-white mb-3">
          {t("အမှတ် — မြစ်ဖျားခံ", "The Point — Origin of All")}
        </h2>
        <p className="font-mm text-sm text-white/50 leading-relaxed mb-4">
          {t(
            "တည်နေရာ ရှိသော်လည်း အတိုင်းအတာ မရှိ။ Line, Plane, Space အားလုံး ၎င်း Point မှ ဆင်းသက်သည်။",
            "A location with no size — yet every line, plane, and universe is built from infinite points like this one."
          )}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[["Dim","0"],["Axes","None"],["Size","∅"],[t("ဥပမာ","Ex."),t("Pin","Point")]].map(([l,v]) => (
            <div key={l} className="px-2.5 py-1.5 rounded-lg" style={{ background: C+"09", border:`1px solid ${C}1E` }}>
              <p className="font-mono text-[7px] tracking-widest" style={{ color: C+"45" }}>{l}</p>
              <p className="font-orbitron text-xs font-bold" style={{ color: C }}>{v}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}
