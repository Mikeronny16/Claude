import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLang } from "../lib/lang"

const C = "#A855F7"
const BG = "#070010"

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-10 xl:right-14 lg:left-auto"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      <div className="w-full lg:w-[340px] xl:w-[380px] px-5 pt-5 pb-8 lg:p-7 lg:rounded-2xl rounded-t-2xl"
        style={{
          background: `linear-gradient(145deg,${C}08,${C}02)`,
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

export default function TwoDSection() {
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
      time += 0.012
      const cx = canvas.width / 2
      const cy = canvas.height * 0.38
      const size = Math.min(canvas.width, canvas.height) * 0.22

      ctx.strokeStyle = C + "18"; ctx.lineWidth = 1
      const step = size / 3
      for (let i = -6; i <= 6; i++) {
        ctx.beginPath(); ctx.moveTo(cx + i * step, cy - size * 2); ctx.lineTo(cx + i * step, cy + size * 2); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx - size * 2, cy + i * step); ctx.lineTo(cx + size * 2, cy + i * step); ctx.stroke()
      }

      const s = size + Math.sin(time) * 10
      ctx.shadowBlur = 32; ctx.shadowColor = C
      ctx.strokeStyle = C; ctx.lineWidth = 2
      ctx.strokeRect(cx - s, cy - s, s * 2, s * 2)
      ctx.fillStyle = C + "07"; ctx.fillRect(cx - s, cy - s, s * 2, s * 2)
      ctx.shadowBlur = 0

      const corners: [number, number][] = [[cx-s,cy-s],[cx+s,cy-s],[cx-s,cy+s],[cx+s,cy+s]]
      corners.forEach(([x,y]) => {
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"; ctx.shadowBlur = 14; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      })

      ctx.shadowBlur = 14; ctx.shadowColor = C; ctx.strokeStyle = C + "55"; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(cx-size*1.7,cy); ctx.lineTo(cx+size*1.7,cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx,cy-size*1.7); ctx.lineTo(cx,cy+size*1.7); ctx.stroke()
      ctx.shadowBlur = 0

      ctx.fillStyle = C; ctx.font = "bold 12px Orbitron"
      ctx.textAlign = "right"; ctx.fillText("X →", cx+size*1.65, cy-12)
      ctx.textAlign = "center"; ctx.fillText("↑ Y", cx+8, cy-size*1.6+18)

      const px = cx + Math.cos(time * 0.7) * s * 0.52
      const py = cy + Math.sin(time * 0.9) * s * 0.52
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"; ctx.shadowBlur = 22; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      ctx.fillStyle = C + "90"; ctx.font = "10px Space Mono"; ctx.textAlign = "left"
      ctx.fillText(`(${((px-cx)/s*3).toFixed(1)}, ${(-(py-cy)/s*3).toFixed(1)})`, px+10, py-8)

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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,#070010_85%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-[#070010] via-[#070010]/65 to-transparent pointer-events-none lg:hidden" />

      <GlassCard>
        <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: C + "55" }}>
          {t("ဒိမ်နရှင် နှစ်", "Dimension Two")}
        </p>
        <div className="font-orbitron font-black leading-none mb-2"
          style={{ fontSize: "clamp(3rem,10vw,5rem)", color: C, textShadow: `0 0 50px ${C}70` }}>
          2D
        </div>
        <h2 className="font-orbitron text-sm lg:text-base font-bold text-white mb-3">
          {t("မျက်နှာပြင် — ညဘက်ပေါ်", "The Plane — Width Awakens")}
        </h2>
        <p className="font-mm text-sm text-white/50 leading-relaxed mb-4">
          {t(
            "Line ထဲသို့ ဦးတည်ချက် နောက်တစ်ခု ပေါင်းလျှင် Plane ဖြစ်သည်။ မြေပုံ၊ ဓာတ်ပုံ၊ Screen — Depth မပါ flat ကမ္ဘာများ ဖြစ်ကြသည်။ မင်း shadow သည် 2D ဖြစ်သည်။",
            "Add a second direction and you get a plane. Maps, photos, your screen — flat worlds with no depth. Your shadow is 2D."
          )}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[["Dim","2"],["Axes","X, Y"],["Freedom","↑↓←→"],[t("ဥပမာ","Ex."),t("Screen","Screen")]].map(([l,v]) => (
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
