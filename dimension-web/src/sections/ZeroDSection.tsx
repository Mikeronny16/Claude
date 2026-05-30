import { useEffect, useRef } from "react"
import { useLang } from "../lib/lang"

const COLOR = "#C0C0FF"

export default function ZeroDSection() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let raf = 0
    let t2 = 0

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)
      t2 += 0.02
      const cx = canvas!.width / 2
      const cy = canvas!.height / 2
      const r = 12 + Math.sin(t2 * 2) * 4

      // Outer glow rings
      for (let i = 4; i >= 1; i--) {
        ctx.beginPath()
        ctx.arc(cx, cy, r * i * 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192,192,255,${0.04 / i})`
        ctx.fill()
      }

      // Core point
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2)
      grad.addColorStop(0, "#ffffff")
      grad.addColorStop(0.4, "#C0C0FF")
      grad.addColorStop(1, "transparent")
      ctx.beginPath()
      ctx.arc(cx, cy, r * 2, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Hard center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <section id="d0" className="min-h-screen flex flex-col lg:flex-row items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#000008 0%,#0a0010 100%)" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(192,192,255,0.05)_0%,transparent_60%)] pointer-events-none" />

      {/* Canvas */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative">
        <canvas ref={canvasRef} className="w-full h-full" />
        {/* Axis label: none (0D has no axes) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-white/20">
          {t("ဝင်ရိုးမရှိ • no axes", "no axes • no direction")}
        </div>
      </div>

      {/* Text */}
      <div className="w-full lg:w-1/2 px-8 py-12 lg:py-0 lg:pr-16">
        {/* Dim label */}
        <div className="font-orbitron text-[clamp(5rem,12vw,8rem)] font-black leading-none mb-4" style={{ color: COLOR, textShadow: `0 0 40px ${COLOR}` }}>
          0D
        </div>

        <div className="font-mono text-xs tracking-[0.4em] text-white/30 mb-3 uppercase">
          {t("သုည Dimension", "Zero Dimension")}
        </div>

        <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-white mb-4">
          {t("အမှတ်", "The Point")}
        </h2>

        <div className="space-y-4 font-mm text-base text-white/60 leading-loose mb-8">
          <p>{t("0D ဆိုသည်မှာ တည်နေရာသာ ရှိသည်။ Length မရှိ၊ Width မရှိ၊ Depth မရှိ — အကျယ် သုညသာ ဖြစ်သည်။", "0D is just a location. No length, no width, no depth — zero size in every direction.")}</p>
          <p>{t("မြေပုံပေါ်မှာ pin ထိုးသောနေရာ၊ space ထဲမှ star တစ်ခုကို ညွှန်ကြားသောနေရာ — အဲ့ဒါပဲ 0D ဖြစ်သည်။", "A pin on a map, a star's location in space — that's 0D.")}</p>
        </div>

        {/* Facts */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { en: "Dimensions", val: "0" },
            { en: "Axes", val: "None" },
            { en: "Size", val: "0" },
            { en: t("ဥပမာ", "Example"), val: t("အမှတ်", "Point") },
          ].map(f => (
            <div key={f.en} className="border border-white/5 rounded-xl p-3 bg-white/2">
              <p className="font-mono text-[9px] tracking-widest text-white/30 mb-1">{f.en}</p>
              <p className="font-orbitron text-lg font-bold" style={{ color: COLOR }}>{f.val}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
