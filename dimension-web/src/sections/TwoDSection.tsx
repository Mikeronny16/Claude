import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLang } from "../lib/lang"

const C = "#A855F7"

export default function TwoDSection() {
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
      time += 0.012
      const cx = canvas.width / 2, cy = canvas.height * 0.42
      const size = Math.min(canvas.width, canvas.height) * 0.24

      // Grid
      ctx.strokeStyle = C + "18"; ctx.lineWidth = 1
      const step = size / 3
      for (let i = -5; i <= 5; i++) {
        ctx.beginPath(); ctx.moveTo(cx + i * step, cy - size * 1.8); ctx.lineTo(cx + i * step, cy + size * 1.8); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx - size * 1.8, cy + i * step); ctx.lineTo(cx + size * 1.8, cy + i * step); ctx.stroke()
      }

      // Animated square
      const s = size + Math.sin(time) * 10
      ctx.shadowBlur = 35; ctx.shadowColor = C
      ctx.strokeStyle = C; ctx.lineWidth = 2
      ctx.strokeRect(cx - s, cy - s, s * 2, s * 2)
      ctx.fillStyle = C + "07"; ctx.fillRect(cx - s, cy - s, s * 2, s * 2)
      ctx.shadowBlur = 0

      // Corner dots
      const corners: [number, number][] = [[cx - s, cy - s], [cx + s, cy - s], [cx - s, cy + s], [cx + s, cy + s]]
      corners.forEach(([x, y]) => {
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"; ctx.shadowBlur = 15; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      })

      // Axes
      ctx.shadowBlur = 12; ctx.shadowColor = C; ctx.strokeStyle = C + "55"; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(cx - size * 1.6, cy); ctx.lineTo(cx + size * 1.6, cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy - size * 1.6); ctx.lineTo(cx, cy + size * 1.6); ctx.stroke()
      ctx.shadowBlur = 0

      // Labels
      ctx.fillStyle = C; ctx.font = "bold 12px Orbitron"; ctx.textAlign = "right"
      ctx.fillText("X →", cx + size * 1.55, cy - 12)
      ctx.textAlign = "center"; ctx.fillText("↑ Y", cx + 8, cy - size * 1.5 + 20)

      // Moving dot
      const px = cx + Math.cos(time * 0.7) * s * 0.5
      const py = cy + Math.sin(time * 0.9) * s * 0.5
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"; ctx.shadowBlur = 22; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      ctx.fillStyle = C + "90"; ctx.font = "10px Space Mono"; ctx.textAlign = "left"
      ctx.fillText(`(${((px - cx) / s * 3).toFixed(1)}, ${(-(py - cy) / s * 3).toFixed(1)})`, px + 10, py - 8)

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <motion.div className="fixed inset-0" style={{ background: "linear-gradient(160deg,#000008 55%,#0d0020 100%)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000008_88%)] pointer-events-none" />

      <motion.div
        className="absolute bottom-[88px] left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-10 xl:right-16 lg:left-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="mx-4 lg:mx-0 px-6 py-6 lg:p-8 rounded-2xl lg:w-[360px] xl:w-[400px]"
          style={{
            background: "linear-gradient(135deg,rgba(168,85,247,0.07),rgba(168,85,247,0.02))",
            backdropFilter: "blur(24px)",
            border: `1px solid ${C}18`,
            boxShadow: `0 0 60px ${C}08`,
          }}>
          <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: C + "55" }}>
            {t("ဒိမ်နရှင် နှစ်", "Dimension Two")}
          </p>
          <div className="font-orbitron font-black leading-none mb-2"
            style={{ fontSize: "clamp(3.5rem,10vw,5.5rem)", color: C, textShadow: `0 0 50px ${C}60` }}>
            2D
          </div>
          <h2 className="font-orbitron text-base lg:text-lg font-bold text-white mb-3">
            {t("မျက်နှာပြင် — ညာဘက်ညာ", "The Plane — Width Awakens")}
          </h2>
          <p className="font-mm text-sm text-white/50 leading-relaxed mb-5">
            {t(
              "Line ထဲသို့ ဦးတည်ချက် နောက်တစ်ခု ထပ်ထည့်လျှင် Plane ဖြစ်သည်။ မြေပုံ၊ ဓာတ်ပုံ၊ မင်းရဲ့ screen — ဒါတွေ 2D ကမ္ဘာ ဖြစ်ကြသည်။ Depth မရှိ၊ shadow မကျ — flat ဖြတ်နေသည်။",
              "Add a second direction to a line and you get a plane. Maps, photos, your screen — all flat worlds with length and width but no depth to step into. Your shadow is 2D."
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[["Dimensions","2"],["Axes","X, Y"],["Freedom","↑↓←→"],[t("ဥပမာ","Ex."),t("မြေပုံ","Screen")]].map(([l,val]) => (
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
