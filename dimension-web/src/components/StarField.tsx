import { useEffect, useRef } from "react"

interface Star {
  x: number; y: number; r: number
  phase: number; speed: number; baseOpacity: number
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let raf = 0, time = 0

    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.6 + 0.15,
      baseOpacity: Math.random() * 0.45 + 0.1,
    }))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.008

      stars.forEach(s => {
        const opacity = s.baseOpacity + Math.sin(time * s.speed + s.phase) * 0.22
        const x = s.x * canvas.width
        const y = s.y * canvas.height

        // Soft glow for brighter stars
        if (s.baseOpacity > 0.42) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, s.r * 4)
          glow.addColorStop(0, `rgba(255,255,255,${opacity * 0.35})`)
          glow.addColorStop(1, "transparent")
          ctx.beginPath(); ctx.arc(x, y, s.r * 4, 0, Math.PI * 2)
          ctx.fillStyle = glow; ctx.fill()
        }

        ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${opacity})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  )
}
