import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLang } from "../lib/lang"

const C = "#00F5FF"
const BG = "#000a0a"

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-10 xl:left-14 lg:right-auto"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      <div className="w-full lg:w-[340px] xl:w-[380px] px-5 pt-5 pb-8 lg:p-7 lg:rounded-2xl rounded-t-2xl"
        style={{
          background: `linear-gradient(145deg,${C}07,${C}02)`,
          backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
          borderTop: `1px solid ${C}20`,
          borderLeft: `1px solid ${C}12`,
          borderRight: `1px solid ${C}0C`,
        }}>
        {children}
      </div>
    </motion.div>
  )
}

export default function OneDSection() {
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
      time += 0.015
      const cx = canvas.width / 2
      const cy = canvas.height * 0.38
      const len = canvas.width * 0.38 + Math.sin(time) * 12

      const grad = ctx.createLinearGradient(cx - len, cy, cx + len, cy)
      grad.addColorStop(0, "transparent"); grad.addColorStop(0.07, C + "50")
      grad.addColorStop(0.5, C); grad.addColorStop(0.93, C + "50"); grad.addColorStop(1, "transparent")
      ctx.shadowBlur = 32; ctx.shadowColor = C
      ctx.beginPath(); ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy)
      ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.stroke(); ctx.shadowBlur = 0

      for (let i = -5; i <= 5; i++) {
        const x = cx + (i / 5) * len
        ctx.beginPath(); ctx.moveTo(x, cy - 8); ctx.lineTo(x, cy + 8)
        ctx.strokeStyle = i === 0 ? "#fff" : C + "65"
        ctx.lineWidth = i === 0 ? 2 : 1; ctx.stroke()
        ctx.fillStyle = C + "65"; ctx.font = "10px Space Mono"; ctx.textAlign = "center"
        ctx.fillText(String(i), x, cy + 22)
      }

      ;[1, -1].forEach(d => {
        const ax = cx + d * len
        ctx.beginPath(); ctx.moveTo(ax + d * 14, cy)
        ctx.lineTo(ax, cy - 7); ctx.lineTo(ax, cy + 7)
        ctx.fillStyle = C; ctx.shadowBlur = 15; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      })

      const px = cx + Math.sin(time * 0.8) * len * 0.72
      ctx.beginPath(); ctx.arc(px, cy, 7, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"; ctx.shadowBlur = 24; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      ctx.fillStyle = C + "90"; ctx.font = "10px Space Mono"; ctx.textAlign = "left"
      ctx.fillText(`x = ${((px - cx) / len * 5).toFixed(1)}`, px + 12, cy - 12)
      ctx.fillStyle = C; ctx.font = "bold 12px Orbitron"; ctx.textAlign = "right"
      ctx.fillText("X →", cx + len, cy - 18)

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <motion.div className="absolute inset-0" style={{ background: BG }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>

      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000a0a_85%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-[#000a0a] via-[#000a0a]/65 to-transparent pointer-events-none lg:hidden" />

      <GlassCard>
        <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: C + "55" }}>
          {t("ဒိမ်နရှင် တစ်", "Dimension One")}
        </p>
        <div className="font-orbitron font-black leading-none mb-2"
          style={{ fontSize: "clamp(3rem,10vw,5rem)", color: C, textShadow: `0 0 50px ${C}70` }}>
          1D
        </div>
        <h2 className="font-orbitron text-sm lg:text-base font-bold text-white mb-3">
          {t("မျဉ်းကြောင်း — ဦးတည်ချက်", "The Line — Direction Born")}
        </h2>
        <p className="font-mm text-sm text-white/50 leading-relaxed mb-4">
          {t(
            "Point ကို ဦးတည်ချက် တစ်ဘက်သို့ ဆွဲလျှင် Line ဖြစ်သည်။ ဘယ်ဘက် ညာဘက်သာ ၊ အပေါ် အောက် မရ — ကမ္ဘာ နဲ့ ကွာလည်ရသည်မှာ dimension တစ်ခု ပဲ ။",
            "Stretch a point in one direction and you get infinity. Forward or back — but never sideways. A train track, a ruler, a number line."
          )}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[["Dim","1"],["Axis","X"],["Freedom","←→"],[t("ဥပမာ","Ex."),t("Ruler","Line")]].map(([l,v]) => (
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
