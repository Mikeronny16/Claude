import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLang } from "../lib/lang"

const C = "#00F5FF"

export default function OneDSection() {
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
      time += 0.015
      const cx = canvas.width / 2, cy = canvas.height * 0.42
      const len = canvas.width * 0.4 + Math.sin(time) * 15

      // Gradient line
      const grad = ctx.createLinearGradient(cx - len, cy, cx + len, cy)
      grad.addColorStop(0, "transparent")
      grad.addColorStop(0.08, C + "50")
      grad.addColorStop(0.5, C)
      grad.addColorStop(0.92, C + "50")
      grad.addColorStop(1, "transparent")
      ctx.shadowBlur = 30; ctx.shadowColor = C
      ctx.beginPath(); ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy)
      ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.stroke(); ctx.shadowBlur = 0

      // Tick marks
      for (let i = -5; i <= 5; i++) {
        const x = cx + (i / 5) * len
        ctx.beginPath(); ctx.moveTo(x, cy - 8); ctx.lineTo(x, cy + 8)
        ctx.strokeStyle = i === 0 ? "#fff" : C + "70"
        ctx.lineWidth = i === 0 ? 2 : 1; ctx.stroke()
        ctx.fillStyle = C + "70"; ctx.font = "10px Space Mono"
        ctx.textAlign = "center"; ctx.fillText(String(i), x, cy + 22)
      }

      // Arrows
      ;[1, -1].forEach(dir => {
        const ax = cx + dir * len
        ctx.beginPath()
        ctx.moveTo(ax + dir * 14, cy)
        ctx.lineTo(ax, cy - 6)
        ctx.lineTo(ax, cy + 6)
        ctx.fillStyle = C; ctx.fill()
      })

      // Moving point
      const px = cx + Math.sin(time * 0.8) * len * 0.7
      ctx.beginPath(); ctx.arc(px, cy, 7, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"; ctx.shadowBlur = 25; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0

      // Point coordinate
      const val = ((px - cx) / len * 5).toFixed(1)
      ctx.fillStyle = C + "90"; ctx.font = "10px Space Mono"; ctx.textAlign = "left"
      ctx.fillText(`x = ${val}`, px + 12, cy - 12)

      // X label
      ctx.fillStyle = C; ctx.font = "bold 13px Orbitron"; ctx.textAlign = "right"
      ctx.fillText("X →", cx + len, cy - 18)

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <motion.div className="fixed inset-0" style={{ background: "linear-gradient(160deg,#000008 60%,#001a1a 100%)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000008_88%)] pointer-events-none" />

      <motion.div
        className="absolute bottom-[88px] left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-10 xl:left-16 lg:right-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="mx-4 lg:mx-0 px-6 py-6 lg:p-8 rounded-2xl lg:w-[360px] xl:w-[400px]"
          style={{
            background: "linear-gradient(135deg,rgba(0,245,255,0.06),rgba(0,245,255,0.02))",
            backdropFilter: "blur(24px)",
            border: `1px solid ${C}18`,
            boxShadow: `0 0 60px ${C}08`,
          }}>
          <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: C + "55" }}>
            {t("ဒိမ်နရှင် တစ်", "Dimension One")}
          </p>
          <div className="font-orbitron font-black leading-none mb-2"
            style={{ fontSize: "clamp(3.5rem,10vw,5.5rem)", color: C, textShadow: `0 0 50px ${C}60` }}>
            1D
          </div>
          <h2 className="font-orbitron text-base lg:text-lg font-bold text-white mb-3">
            {t("မျဉ်းကြောင်း — ဦးတည်ချက်", "The Line — Direction Born")}
          </h2>
          <p className="font-mm text-sm text-white/50 leading-relaxed mb-5">
            {t(
              "Point တစ်ခုကို ဦးတည်ချက် တစ်ဘက်သို့ ဆွဲလျှင် Line ဖြစ်သည်။ ဘယ်ဘက် ညာဘက်သာ သွားနိုင်သည် — အပေါ် အောက် မသွားနိုင်ပါ။ ကျွန်တော်တို့ ကမ္ဘာ၏ ruler လေး တစ်ချောင်းသည် ဤသဘောတရား ဖြစ်သည်။",
              "Stretch a point in one direction and you get infinity — a line with no width, no depth. You can travel forward or back, but never step aside. A ruler, a train track, a number line."
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[["Dimensions","1"],["Axis","X only"],["Freedom","←→"],[t("ဥပမာ","Ex."),t("Ruler","Line")]].map(([l,val]) => (
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
