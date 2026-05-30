import { useEffect, useRef } from "react"
import { useLang } from "../lib/lang"

const COLOR = "#A855F7"

export default function TwoDSection() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let raf = 0, time = 0

    function resize() { canvas!.width = canvas!.offsetWidth; canvas!.height = canvas!.offsetHeight }
    resize()
    window.addEventListener("resize", resize)

    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)
      time += 0.012
      const cx = canvas!.width / 2
      const cy = canvas!.height / 2
      const size = Math.min(canvas!.width, canvas!.height) * 0.28

      // Grid background
      ctx.strokeStyle = COLOR + "18"
      ctx.lineWidth = 1
      const step = size / 3
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath()
        ctx.moveTo(cx + i * step, cy - size * 1.6)
        ctx.lineTo(cx + i * step, cy + size * 1.6)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cx - size * 1.6, cy + i * step)
        ctx.lineTo(cx + size * 1.6, cy + i * step)
        ctx.stroke()
      }

      // Animated square (pulsing)
      const s = size + Math.sin(time) * 8
      ctx.shadowBlur = 30
      ctx.shadowColor = COLOR
      ctx.strokeStyle = COLOR
      ctx.lineWidth = 2.5
      ctx.strokeRect(cx - s, cy - s, s * 2, s * 2)

      // Fill
      ctx.fillStyle = COLOR + "08"
      ctx.fillRect(cx - s, cy - s, s * 2, s * 2)
      ctx.shadowBlur = 0

      // Corner dots
      const corners: [number,number][] = [[cx-s,cy-s],[cx+s,cy-s],[cx-s,cy+s],[cx+s,cy+s]]
      corners.forEach(([x,y]) => {
        ctx.beginPath()
        ctx.arc(x,y,5,0,Math.PI*2)
        ctx.fillStyle = "#ffffff"
        ctx.shadowBlur = 15
        ctx.shadowColor = COLOR
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // X axis
      ctx.shadowBlur = 15; ctx.shadowColor = COLOR
      ctx.beginPath(); ctx.moveTo(cx - size*1.5, cy); ctx.lineTo(cx + size*1.5, cy)
      ctx.strokeStyle = COLOR + "60"; ctx.lineWidth = 1.5; ctx.stroke()
      // Y axis
      ctx.beginPath(); ctx.moveTo(cx, cy - size*1.5); ctx.lineTo(cx, cy + size*1.5)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Arrow heads
      const drawArrow = (x:number, y:number, dx:number, dy:number) => {
        ctx.beginPath()
        ctx.moveTo(x + dx*10, y + dy*10)
        ctx.lineTo(x + dx*10 - dy*5, y + dy*10 + dx*5)
        ctx.lineTo(x + dx*10 + dy*5, y + dy*10 - dx*5)
        ctx.fillStyle = COLOR + "80"; ctx.fill()
      }
      drawArrow(cx + size*1.5, cy, 1, 0)
      drawArrow(cx, cy - size*1.5, 0, -1)

      // Axis labels
      ctx.fillStyle = COLOR
      ctx.font = "bold 13px Orbitron"
      ctx.textAlign = "left"
      ctx.fillText("X →", cx + size*1.5 - 30, cy - 12)
      ctx.textAlign = "center"
      ctx.fillText("↑ Y", cx + 8, cy - size*1.5 + 24)

      // Moving dot inside
      const px = cx + Math.cos(time*0.7) * s * 0.5
      const py = cy + Math.sin(time*0.9) * s * 0.5
      ctx.beginPath(); ctx.arc(px,py,6,0,Math.PI*2)
      ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 20; ctx.shadowColor = COLOR; ctx.fill()
      ctx.shadowBlur = 0

      // Coordinate label
      ctx.fillStyle = COLOR + "90"
      ctx.font = "10px Space Mono"
      ctx.textAlign = "left"
      ctx.fillText(`(${((px-cx)/s*3).toFixed(1)}, ${(-(py-cy)/s*3).toFixed(1)})`, px+10, py-8)

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <section id="d2" className="min-h-screen flex flex-col lg:flex-row items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#000008 0%,#0d0020 100%)" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(168,85,247,0.07)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="w-full lg:w-1/2 px-8 py-12 lg:py-0 lg:pr-16">
        <div className="font-orbitron text-[clamp(5rem,12vw,8rem)] font-black leading-none mb-4" style={{ color: COLOR, textShadow: `0 0 40px ${COLOR}` }}>
          2D
        </div>
        <div className="font-mono text-xs tracking-[0.4em] text-white/30 mb-3 uppercase">
          {t("နှစ် Dimension", "Two Dimensions")}
        </div>
        <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-white mb-4">
          {t("မျက်နှာပြင်", "The Plane")}
        </h2>
        <div className="space-y-4 font-mm text-base text-white/60 leading-loose mb-8">
          <p>{t("2D ဆိုသည်မှာ Length + Width ရှိသည်။ X ဝင်ရိုးနှင့် Y ဝင်ရိုး နှစ်ခုဖြင့် coordinate ဖော်ပြနိုင်သည်။", "2D has Length + Width. Two axes — X and Y — describe any point on the plane.")}</p>
          <p>{t("မြေပုံ၊ ဓာတ်ပုံ၊ screen၊ drawing — ဒါတွေ 2D ကမ္ဘာ ဖြစ်သည်။ Depth မရှိ — shadow မကျ", "Maps, photos, screens, drawings — flat worlds with no depth.")}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Dimensions", val: "2" },
            { label: "Axes", val: "X, Y" },
            { label: t("ဦးတည်ချက်", "Directions"), val: "4" },
            { label: t("ဥပမာ", "Example"), val: t("မြေပုံ", "Map") },
          ].map(f => (
            <div key={f.label} className="border border-white/5 rounded-xl p-3 bg-white/2">
              <p className="font-mono text-[9px] tracking-widest text-white/30 mb-1">{f.label}</p>
              <p className="font-orbitron text-lg font-bold" style={{ color: COLOR }}>{f.val}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
