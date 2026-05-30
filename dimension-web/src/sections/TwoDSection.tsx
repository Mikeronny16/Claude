import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLang } from "../lib/lang"

const C = "#7C3AED"
const BG = "#050508"

export default function TwoDSection() {
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
      time += 0.012
      const cx = canvas.width / 2
      const cy = canvas.height * 0.42
      const size = Math.min(canvas.width, canvas.height) * 0.2

      ctx.strokeStyle = `${C}18`; ctx.lineWidth = 1
      const step = size / 3
      for (let i = -7; i <= 7; i++) {
        ctx.beginPath(); ctx.moveTo(cx + i * step, cy - size * 2.2); ctx.lineTo(cx + i * step, cy + size * 2.2); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx - size * 2.2, cy + i * step); ctx.lineTo(cx + size * 2.2, cy + i * step); ctx.stroke()
      }

      const s = size + Math.sin(time) * 8
      ctx.shadowBlur = 30; ctx.shadowColor = C
      ctx.strokeStyle = C; ctx.lineWidth = 1.8
      ctx.strokeRect(cx - s, cy - s, s * 2, s * 2)
      ctx.fillStyle = `${C}06`; ctx.fillRect(cx - s, cy - s, s * 2, s * 2)
      ctx.shadowBlur = 0

      const corners: [number, number][] = [[cx-s,cy-s],[cx+s,cy-s],[cx-s,cy+s],[cx+s,cy+s]]
      corners.forEach(([x, y]) => {
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"; ctx.shadowBlur = 12; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      })

      ctx.shadowBlur = 12; ctx.shadowColor = `${C}80`; ctx.strokeStyle = `${C}50`; ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.moveTo(cx - size * 1.8, cy); ctx.lineTo(cx + size * 1.8, cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy - size * 1.8); ctx.lineTo(cx, cy + size * 1.8); ctx.stroke()
      ctx.shadowBlur = 0

      ctx.fillStyle = C; ctx.font = "bold 11px Orbitron"
      ctx.textAlign = "right"; ctx.fillText("X →", cx + size * 1.75, cy - 10)
      ctx.textAlign = "center"; ctx.fillText("↑ Y", cx + 8, cy - size * 1.65 + 16)

      const px = cx + Math.cos(time * 0.7) * s * 0.5
      const py = cy + Math.sin(time * 0.9) * s * 0.5
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"; ctx.shadowBlur = 20; ctx.shadowColor = C; ctx.fill(); ctx.shadowBlur = 0
      ctx.fillStyle = `${C}90`; ctx.font = "9px Space Mono"; ctx.textAlign = "left"
      ctx.fillText(`(${((px-cx)/s*3).toFixed(1)}, ${(-(py-cy)/s*3).toFixed(1)})`, px + 10, py - 8)

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
        background: "radial-gradient(ellipse at center, transparent 26%, #050508 84%)"
      }} />

      {/* Card — LEFT on desktop */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-10 xl:left-14 lg:right-auto"
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
            borderTop: "1px solid rgba(124,58,237,0.12)",
            borderLeft: `3px solid ${C}`,
            borderRight: "1px solid rgba(124,58,237,0.05)",
            padding: "22px 22px 34px 26px",
          }}>

          <p className="font-mono" style={{ fontSize: 9, letterSpacing: "0.45em", color: `${C}aa`, marginBottom: 8, textTransform: "uppercase" }}>
            {t("ဒိမ်နရှင် နှစ်", "Dimension Two")}
          </p>

          <div className="font-orbitron" style={{
            fontSize: "clamp(4.5rem,13vw,7rem)", fontWeight: 900, lineHeight: 1,
            color: C, textShadow: `0 0 55px ${C}55`, marginBottom: 8
          }}>
            2D
          </div>

          <h2 className="font-orbitron" style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)", marginBottom: 14, letterSpacing: "0.03em" }}>
            {t("မျက်နှာပြင် — Width ကွန်းထ", "The Plane — Width Awakens")}
          </h2>

          <p className="font-mm" style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, marginBottom: 20 }}>
            {t(
              "Line ထဲသို့ ဦးတည်ချက် နောက်တစ်ခု ပေါင်းလျှင် Plane ဖြစ်သည်။ မြေပုံ၊ ဓာတ်ပုံ၊ Screen — Depth မပါ flat ကမ္ဘာများ ဖြစ်ကြသည်။",
              "Add a second direction and you get a plane. Maps, photos, your screen — flat worlds with no depth. Your shadow is 2D."
            )}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[["Dim","2"],["Axes","X, Y"],["Freedom","↑↓←→"],[t("ဥပမာ","Ex."),t("Screen","Screen")]].map(([l,v]) => (
              <div key={l} style={{
                padding: "7px 12px", borderRadius: 8,
                background: `${C}08`, border: `1px solid ${C}22`
              }}>
                <p className="font-mono" style={{ fontSize: 7, letterSpacing: "0.18em", color: `${C}aa`, marginBottom: 2 }}>{l}</p>
                <p className="font-orbitron" style={{ fontSize: 11, fontWeight: 700, color: C }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-[53%] right-4 lg:bottom-6" style={{
        fontFamily: "Space Mono", fontSize: 8, letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.14)", pointerEvents: "none"
      }}>
        x · y ·
      </div>
    </motion.div>
  )
}
