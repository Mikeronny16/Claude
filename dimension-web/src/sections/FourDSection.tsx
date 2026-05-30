import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { motion } from "framer-motion"
import * as THREE from "three"
import { useLang } from "../lib/lang"

const C = "#FFD700"

function project4Dto3D(v: number[], w: number, fov4d = 2): [number, number, number] {
  const d = fov4d / (fov4d - v[3] / w)
  return [v[0] * d, v[1] * d, v[2] * d]
}

function Tesseract() {
  const linesRef = useRef<THREE.LineSegments>(null!)
  const angleRef = useRef(0)

  const { positions, colors } = useMemo(() => {
    const edges: [number, number][] = []
    for (let i = 0; i < 16; i++)
      for (let j = i + 1; j < 16; j++) {
        let diff = 0
        for (let k = 0; k < 4; k++) if (((i >> k) & 1) !== ((j >> k) & 1)) diff++
        if (diff === 1) edges.push([i, j])
      }
    return { edges, positions: new Float32Array(edges.length * 6), colors: new Float32Array(edges.length * 6) }
  }, [])

  const posAttr = useRef<THREE.BufferAttribute>(null!)
  const colAttr = useRef<THREE.BufferAttribute>(null!)

  useFrame((_, delta) => {
    angleRef.current += delta * 0.38
    const a = angleRef.current, b = angleRef.current * 0.65
    const cos1 = Math.cos(a), sin1 = Math.sin(a)
    const cos2 = Math.cos(b), sin2 = Math.sin(b)

    const verts4d: number[][] = []
    for (let i = 0; i < 16; i++) {
      const x = (i & 1) ? 1 : -1, y = (i & 2) ? 1 : -1
      const z = (i & 4) ? 1 : -1, w = (i & 8) ? 1 : -1
      verts4d.push([x * cos1 - w * sin1, y * cos2 - z * sin2, y * sin2 + z * cos2, x * sin1 + w * cos1])
    }

    const edges: [number, number][] = []
    for (let i = 0; i < 16; i++)
      for (let j = i + 1; j < 16; j++) {
        let diff = 0
        for (let k = 0; k < 4; k++) if (((i >> k) & 1) !== ((j >> k) & 1)) diff++
        if (diff === 1) edges.push([i, j])
      }

    edges.forEach(([ai, bi], idx) => {
      const p1 = project4Dto3D(verts4d[ai], 1)
      const p2 = project4Dto3D(verts4d[bi], 1)
      const base = idx * 6
      positions[base] = p1[0]; positions[base + 1] = p1[1]; positions[base + 2] = p1[2]
      positions[base + 3] = p2[0]; positions[base + 4] = p2[1]; positions[base + 5] = p2[2]
      const wAvg = (verts4d[ai][3] + verts4d[bi][3]) / 2
      const t = (wAvg + 1.5) / 3
      colors[base] = 1; colors[base + 1] = t * 0.85 + 0.1; colors[base + 2] = 0
      colors[base + 3] = t * 0.5; colors[base + 4] = 0.15; colors[base + 5] = 1
    })

    if (posAttr.current) posAttr.current.needsUpdate = true
    if (colAttr.current) colAttr.current.needsUpdate = true
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute ref={posAttr} attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute ref={colAttr} attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors />
    </lineSegments>
  )
}

export default function FourDSection() {
  const { t } = useLang()

  return (
    <motion.div className="fixed inset-0" style={{ background: "linear-gradient(160deg,#000008 55%,#1a1000 100%)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}>

      <div className="absolute inset-0">
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} color={C} intensity={3} />
          <Tesseract />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#000008_88%)] pointer-events-none" />

      <motion.div
        className="absolute bottom-[88px] left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-10 xl:right-16 lg:left-auto pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="pointer-events-auto mx-4 lg:mx-0 px-6 py-6 lg:p-8 rounded-2xl lg:w-[360px] xl:w-[400px]"
          style={{
            background: "linear-gradient(135deg,rgba(255,215,0,0.06),rgba(255,215,0,0.02))",
            backdropFilter: "blur(24px)",
            border: `1px solid ${C}18`,
            boxShadow: `0 0 60px ${C}08`,
          }}>
          <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: C + "55" }}>
            {t("ဒိမ်နရှင် လေး", "Dimension Four")}
          </p>
          <div className="font-orbitron font-black leading-none mb-2"
            style={{ fontSize: "clamp(3.5rem,10vw,5.5rem)", color: C, textShadow: `0 0 50px ${C}60` }}>
            4D
          </div>
          <h2 className="font-orbitron text-base lg:text-lg font-bold text-white mb-3">
            {t("အချိန် • Tesseract", "Time · The Unseen Axis")}
          </h2>
          <p className="font-mm text-sm text-white/50 leading-relaxed mb-4">
            {t(
              "4D ၏ ဂျီသြမေတြီ ဖြစ်ပုံကို Tesseract ဖြင့် မြင်နိုင်သည် — Cube ကို 3D ဘက်သို့ extend ထားသကဲ့သို့ Tesseract သည် 4D ဘက်သို့ extend ထားသည်။ မင်းသည် ယခုပင် 4D အချိန် ၌ ရွေ့လျားနေသည် — နောက်ပြန်မဆုတ်နိုင်ဘဲ ။",
              "You're already moving through the 4th dimension right now — time — and you can't turn back. Geometrically: a Tesseract is to a Cube as a Cube is to a Square. You're watching one rotate."
            )}
          </p>
          <p className="font-mono text-[9px] text-white/25 mb-4">
            {t("ဦးနှောက်ကျဲသွားရင် မှန်သည် 😵", "Brain hurts? That's normal. 😵")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[["Dimensions","4"],["Axes","X,Y,Z,W"],["Vertices","16"],[t("ဥပမာ","Ex."),"Spacetime"]].map(([l,val]) => (
              <div key={l} className="px-2.5 py-1.5 rounded-lg" style={{ background: C+"09", border:`1px solid ${C}20` }}>
                <p className="font-mono text-[7px] tracking-widest" style={{ color: C+"45" }}>{l}</p>
                <p className="font-orbitron text-xs font-bold" style={{ color: C }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-[160px] lg:bottom-6 right-6 font-mono text-[9px] tracking-widest text-white/20">
        {t("drag ဆွဲ၍ လှည့်ကြည့်", "drag to rotate")}
      </div>
    </motion.div>
  )
}
