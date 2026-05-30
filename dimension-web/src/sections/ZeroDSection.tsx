import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLang } from "../lib/lang"

const C = "#E8E8FF"
const BG = "#050508"

export default function ZeroDSection() {
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
      time += 0.016
      const cx = canvas.width / 2
      const cy = canvas.height * 0.42

      for (let i = 6; i >= 1; i--) {
        const r = (22 + Math.sin(time * 1.2) * 5) * i * 2.2
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(232,232,255,${0.025 / i})`
        ctx.lineWidth = 1; ctx.stroke()
      }

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110)
      g.addColorStop(0, "rgba(232,232,255,0.12)")
      g.addColorStop(0.5, "rgba(232,232,255,0.04)")
      g.addColorStop(1, "transparent")
      ctx.beginPath(); ctx.arc(cx, cy, 110, 0, Math.PI * 2)
      ctx.fillStyle = g; ctx.fill()

      const pulse = 14 + Math.sin(time * 2.4) * 4
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulse * 2.5)
      core.addColorStop(0, "#ffffff")
      core.addColorStop(0.3, C)
      core.addColorStop(0.7, "rgba(232,232,255,0.25)")
      core.addColorStop(1, "transparent")
      ctx.beginPath(); ctx.arc(cx, cy, pulse * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = core; ctx.fill()

      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.shadowBlur = 18; ctx.shadowColor = C
      ctx.fill(); ctx.shadowBlur = 0

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
        background: "radial-gradient(ellipse at center, transparent 25%, #050508 82%)"
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
            borderTop: "1px solid rgba(232,232,255,0.1)",
            borderLeft: `3px solid ${C}`,
            borderRight: "1px solid rgba(232,232,255,0.05)",
            padding: "22px 22px 34px 26px",
          }}>

          <p className="font-mono" style={{ fontSize: 9, letterSpacing: "0.45em", color: `${C}55`, marginBottom: 8, textTransform: "uppercase" }}>
            {t("ဒိမ်နရှင် သုည", "Dimension Zero")}
          </p>

          <div className="font-orbitron" style={{
            fontSize: "clamp(4.5rem,13vw,7rem)", fontWeight: 900, lineHeight: 1,
            color: C, textShadow: `0 0 55px ${C}45`, marginBottom: 8
          }}>
            0D
          </div>

          <h2 className="font-orbitron" style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)", marginBottom: 14, letterSpacing: "0.03em" }}>
            {t("အမှတ် — မြစ်ဖျားခံ", "The Point — Origin of All")}
          </h2>

          <p className="font-mm" style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, marginBottom: 20 }}>
            {t(
              "တည်နေရာ ရှိသော်လည်း အတိုင်းအတာ မရှိ။ Line, Plane, Space အားလုံး ၎င်း Point မှ ဆင်းသက်သည်။",
              "A location with no size — yet every line, plane, and universe is built from infinite points like this one."
            )}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[["Dim","0"],["Axes","None"],["Size","∅"],[t("ဥပမာ","Ex."),t("Pin","Point")]].map(([l,v]) => (
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

      <div className="absolute bottom-[53%] right-4 lg:bottom-6" style={{
        fontFamily: "Space Mono", fontSize: 8, letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.14)", pointerEvents: "none"
      }}>
        origin ·
      </div>
    </motion.div>
  )
}
