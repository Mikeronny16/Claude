import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLang } from "../lib/lang"

const C = "#C0C0FF"

export default function ZeroDSection() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let raf = 0, time = 0
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener("resize", resize)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.018
      const cx = canvas.width / 2, cy = canvas.height * 0.42
      const r = 16 + Math.sin(time * 2) * 6
      for (let i = 8; i >= 1; i--) {
        ctx.beginPath(); ctx.arc(cx, cy, r * i * 2.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192,192,255,${0.02 / i})`; ctx.fill()
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3.5)
      g.addColorStop(0, "#ffffff"); g.addColorStop(0.25, C); g.addColorStop(0.6, C + "40"); g.addColorStop(1, "transparent")
      ctx.beginPath(); ctx.arc(cx, cy, r * 3.5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = "#ffffff"
      ctx.shadowBlur = 20; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <motion.div className="fixed inset-0" style={{ background: "#000008" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000008_90%)] pointer-events-none" />

      {/* Glass panel */}
      <motion.div
        className="absolute bottom-[88px] left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-10 xl:left-16 lg:right-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="mx-4 lg:mx-0 px-6 py-6 lg:p-8 rounded-2xl lg:w-[360px] xl:w-[400px]"
          style={{
            background: "linear-gradient(135deg,rgba(192,192,255,0.06),rgba(192,192,255,0.02))",
            backdropFilter: "blur(24px)",
            border: `1px solid ${C}18`,
            boxShadow: `0 0 60px ${C}08`,
          }}>
          <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: C + "55" }}>
            {t("ဒိမ်နရှင် သုည", "Dimension Zero")}
          </p>
          <div className="font-orbitron font-black leading-none mb-2"
            style={{ fontSize: "clamp(3.5rem,10vw,5.5rem)", color: C, textShadow: `0 0 50px ${C}60` }}>
            0D
          </div>
          <h2 className="font-orbitron text-base lg:text-lg font-bold text-white mb-3">
            {t("အမှတ် — မြစ်ဖျားခံ", "The Point — Origin of All")}
          </h2>
          <p className="font-mm text-sm text-white/50 leading-relaxed mb-5">
            {t(
              "တည်နေရာ ရှိသော်လည်း အတိုင်းအတာ မရှိ — ဖြတ်မရ၊ ကိုင်မရ — သို့သော် Line, Plane, Space အားလုံး ၎င်းမှ ဆင်းသက်သည်။",
              "A location with no size. Cannot be crossed or held — yet every line, plane, and universe in existence is built from infinite points like this one."
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[["Dimensions","0"],["Axes","None"],["Size","∅"],[t("ဥပမာ","Ex."),t("Pin","Point")]].map(([l,val]) => (
              <div key={l} className="px-2.5 py-1.5 rounded-lg" style={{ background: C+"09", border:`1px solid ${C}20` }}>
                <p className="font-mono text-[7px] tracking-widest" style={{ color: C+"45" }}>{l}</p>
                <p className="font-orbitron text-xs font-bold" style={{ color: C }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
