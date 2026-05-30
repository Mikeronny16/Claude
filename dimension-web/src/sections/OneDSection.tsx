import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLang } from "../lib/lang"

const C = "#00F0FF"
const BG = "#050508"

export default function OneDSection() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let raf = 0, time = 0
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.015
      const cx = canvas.width / 2
      const cy = canvas.height * 0.42
      const len = canvas.width * 0.36 + Math.sin(time) * 10

      const grad = ctx.createLinearGradient(cx - len, cy, cx + len, cy)
      grad.addColorStop(0, "transparent")
      grad.addColorStop(0.06, `${C}45`)
      grad.addColorStop(0.5, C)
      grad.addColorStop(0.94, `${C}45`)
      grad.addColorStop(1, "transparent")
      ctx.shadowBlur = 28; ctx.shadowColor = C
      ctx.beginPath(); ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy)
      ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.stroke()
      ctx.shadowBlur = 0

      for (let i = -5; i <= 5; i++) {
        const x = cx + (i / 5) * len
        const isCenter = i === 0
        ctx.beginPath(); ctx.moveTo(x, cy - (isCenter ? 10 : 7)); ctx.lineTo(x, cy + (isCenter ? 10 : 7))
        ctx.strokeStyle = isCenter ? "rgba(255,255,255,0.8)" : `${C}55`
        ctx.lineWidth = isCenter ? 2 : 1; ctx.stroke()
        ctx.fillStyle = `${C}60`
        ctx.font = "10px Space Mono"; ctx.textAlign = "center"
        ctx.fillText(String(i), x, cy + 22)
      }

      ;[1, -1].forEach(d => {
        const ax = cx + d * len
        ctx.beginPath()
        ctx.moveTo(ax + d * 14, cy)
        ctx.lineTo(ax, cy - 7); ctx.lineTo(ax, cy + 7)
        ctx.fillStyle = C; ctx.shadowBlur = 12; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      })

      const px = cx + Math.sin(time * 0.75) * len * 0.7
      ctx.beginPath(); ctx.arc(px, cy, 7, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"; ctx.shadowBlur = 22; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      ctx.fillStyle = `${C}85`; ctx.font = "10px Space Mono"; ctx.textAlign = "left"
      ctx.fillText(`x = ${((px - cx) / len * 5).toFixed(1)}`, px + 12, cy - 14)

      ctx.fillStyle = C; ctx.font = "bold 12px Orbitron"; ctx.textAlign = "right"
      ctx.fillText("X →", cx + len, cy - 20)

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <motion.div style={{ position: "absolute", inset: 0, background: BG }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}>

      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 28%, #050508 86%)"
      }} />

      {/* Card — RIGHT on desktop */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-10 xl:right-14 lg:left-auto"
        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>

        <div className="lg:hidden" style={{
          position: "absolute", bottom: "100%", left: 0, right: 0, height: 140,
          background: `linear-gradient(to bottom, transparent, ${BG})`,
          pointerEvents: "none"
        }} />

        <div className="w-full lg:w-[360px] xl:w-[400px] lg:rounded-2xl"
          style={{
            background: "rgba(5,5,8,0.84)",
            backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
            borderTop: "1px solid rgba(0,240,255,0.1)",
            borderLeft: `3px solid ${C}`,
            borderRight: "1px solid rgba(0,240,255,0.05)",
            padding: "22px 22px 34px 26px",
          }}>

          <p className="font-mono" style={{ fontSize: 9, letterSpacing: "0.45em", color: `${C}55`, marginBottom: 8, textTransform: "uppercase" }}>
            {t("ဒိမ်နရှင် တစ်", "Dimension One")}
          </p>

          <div className="font-orbitron" style={{
            fontSize: "clamp(4.5rem,13vw,7rem)", fontWeight: 900, lineHeight: 1,
            color: C, textShadow: `0 0 55px ${C}45`, marginBottom: 8
          }}>
            1D
          </div>

          <h2 className="font-orbitron" style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)", marginBottom: 14, letterSpacing: "0.03em" }}>
            {t("မျဉ်းကြောင်း — ဦးတည်ချက်", "The Line — Direction Born")}
          </h2>

          <p className="font-mm" style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, marginBottom: 20 }}>
            {t(
              "Point ကို ဦးတည်ချက် တစ်ဘက်သို့ ဆွဲလျှင် Line ဖြစ်သည်။ ဘယ်ဘက် ညာဘက်သာ ၊ အပေါ် အောက် မရ — ကမ္ဘာ နဲ့ ကွာလည်ရသည်မှာ dimension တစ်ခု ပဲ ။",
              "Stretch a point in one direction and you get infinity. Forward or back — but never sideways. A train track, a ruler, a number line."
            )}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[["Dim","1"],["Axis","X"],["Freedom","← →"],[t("ဥပမာ","Ex."),t("Ruler","Line")]].map(([l,v]) => (
              <div key={l} style={{
                padding: "7px 12px", borderRadius: 8,
                background: `${C}07`, border: `1px solid ${C}20`
              }}>
                <p className="font-mono" style={{ fontSize: 7, letterSpacing: "0.18em", color: `${C}50`, marginBottom: 2 }}>{l}</p>
                <p className="font-orbitron" style={{ fontSize: 11, fontWeight: 700, color: C }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-[53%] left-4 lg:bottom-6" style={{
        fontFamily: "Space Mono", fontSize: 8, letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.14)", pointerEvents: "none"
      }}>
        axis x ·
      </div>
    </motion.div>
  )
}
