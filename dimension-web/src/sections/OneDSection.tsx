import { useEffect, useRef } from "react"
import { useLang } from "../lib/lang"

const COLOR = "#00F5FF"

export default function OneDSection() {
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
      time += 0.015
      const cx = canvas!.width / 2
      const cy = canvas!.height / 2
      const len = (canvas!.width * 0.38) + Math.sin(time) * 20

      // Axis glow
      const grad = ctx.createLinearGradient(cx - len, cy, cx + len, cy)
      grad.addColorStop(0, "transparent")
      grad.addColorStop(0.1, COLOR + "60")
      grad.addColorStop(0.5, COLOR)
      grad.addColorStop(0.9, COLOR + "60")
      grad.addColorStop(1, "transparent")

      // Glow blur line
      ctx.shadowBlur = 30
      ctx.shadowColor = COLOR
      ctx.beginPath()
      ctx.moveTo(cx - len, cy)
      ctx.lineTo(cx + len, cy)
      ctx.strokeStyle = grad
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.shadowBlur = 0

      // Tick marks
      for (let i = -5; i <= 5; i++) {
        const x = cx + (i / 5) * len
        ctx.beginPath()
        ctx.moveTo(x, cy - 8)
        ctx.lineTo(x, cy + 8)
        ctx.strokeStyle = i === 0 ? "#ffffff" : COLOR + "80"
        ctx.lineWidth = i === 0 ? 2 : 1
        ctx.stroke()
        ctx.fillStyle = COLOR + "80"
        ctx.font = "10px Space Mono"
        ctx.textAlign = "center"
        ctx.fillText(String(i), x, cy + 22)
      }

      // Endpoint arrows
      ctx.beginPath()
      ctx.moveTo(cx + len + 15, cy)
      ctx.lineTo(cx + len, cy - 6)
      ctx.lineTo(cx + len, cy + 6)
      ctx.fillStyle = COLOR
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(cx - len - 15, cy)
      ctx.lineTo(cx - len, cy - 6)
      ctx.lineTo(cx - len, cy + 6)
      ctx.fillStyle = COLOR
      ctx.fill()

      // Moving point on line
      const px = cx + Math.sin(time * 0.8) * len * 0.7
      ctx.beginPath()
      ctx.arc(px, cy, 7, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.shadowBlur = 20
      ctx.shadowColor = COLOR
      ctx.fill()
      ctx.shadowBlur = 0

      // X label
      ctx.fillStyle = COLOR
      ctx.font = "bold 14px Orbitron"
      ctx.textAlign = "left"
      ctx.fillText("X →", cx + len - 30, cy - 20)

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <section id="d1" className="min-h-screen flex flex-col lg:flex-row-reverse items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#000008 0%,#001a1a 100%)" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(0,245,255,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="w-full lg:w-1/2 px-8 py-12 lg:py-0 lg:pl-16">
        <div className="font-orbitron text-[clamp(5rem,12vw,8rem)] font-black leading-none mb-4" style={{ color: COLOR, textShadow: `0 0 40px ${COLOR}` }}>
          1D
        </div>
        <div className="font-mono text-xs tracking-[0.4em] text-white/30 mb-3 uppercase">
          {t("တစ် Dimension", "One Dimension")}
        </div>
        <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-white mb-4">
          {t("မျဉ်းကြောင်း", "The Line")}
        </h2>
        <div className="space-y-4 font-mm text-base text-white/60 leading-loose mb-8">
          <p>{t("1D ဆိုသည်မှာ ရှည်လျားမှု (Length) တစ်ခုသာ ရှိသည်။ ဘယ်ဘက်သို့ ညာဘက်သို့ သာ သွားနိုင်သည် — အပေါ် အောက် မသွားနိုင်ပါ။", "1D has only length. You can go left or right — but not up, down, or forward.")}</p>
          <p>{t("ရထားလမ်းကြောင်း၊ ruler တစ်ချောင်း၊ number line — ဒါတွေ 1D၏ ဥပမာများ ဖြစ်သည်။", "A train track, a ruler, a number line — these are 1D examples.")}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Dimensions", val: "1" },
            { label: "Axis", val: "X" },
            { label: t("ဦးတည်ချက်", "Direction"), val: "←→" },
            { label: t("ဥပမာ", "Example"), val: t("ကြောင်း", "Line") },
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
