import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { useLang } from "../lib/lang"

const COLOR = "#FFD700"

// 4D hypercube (tesseract) vertices projected to 3D
function project4Dto3D(v: number[], w: number, fov4d = 2): [number, number, number] {
  const d = fov4d / (fov4d - v[3] / w)
  return [v[0] * d, v[1] * d, v[2] * d]
}

function Tesseract() {
  const linesRef = useRef<THREE.LineSegments>(null!)
  const angleRef = useRef(0)

  // Generate tesseract edges
  const { positions, colors } = useMemo(() => {
    // 16 vertices of a tesseract: all (±1,±1,±1,±1)
    const verts4d: number[][] = []
    for (let i = 0; i < 16; i++) {
      verts4d.push([
        (i & 1) ? 1 : -1,
        (i & 2) ? 1 : -1,
        (i & 4) ? 1 : -1,
        (i & 8) ? 1 : -1,
      ])
    }
    // Edges: two vertices connected if they differ in exactly one bit
    const edges: [number, number][] = []
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0
        for (let k = 0; k < 4; k++) if (verts4d[i][k] !== verts4d[j][k]) diff++
        if (diff === 1) edges.push([i, j])
      }
    }
    return { edges, verts4d, positions: new Float32Array(edges.length * 6), colors: new Float32Array(edges.length * 6) }
  }, [])

  const posAttr = useRef<THREE.BufferAttribute>(null!)
  const colAttr = useRef<THREE.BufferAttribute>(null!)

  useFrame((_, delta) => {
    angleRef.current += delta * 0.4
    const a = angleRef.current
    const b = angleRef.current * 0.7

    // Rotate in 4D (XW and YZ planes)
    const cos1 = Math.cos(a), sin1 = Math.sin(a)
    const cos2 = Math.cos(b), sin2 = Math.sin(b)

    const verts4d: number[][] = []
    for (let i = 0; i < 16; i++) {
      const x = (i & 1) ? 1 : -1
      const y = (i & 2) ? 1 : -1
      const z = (i & 4) ? 1 : -1
      const w = (i & 8) ? 1 : -1
      // Rotate XW plane
      const nx = x * cos1 - w * sin1
      const nw = x * sin1 + w * cos1
      // Rotate YZ plane
      const ny = y * cos2 - z * sin2
      const nz = y * sin2 + z * cos2
      verts4d.push([nx, ny, nz, nw])
    }

    // Edges
    const edges: [number, number][] = []
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0
        const orig = [(i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1]
        const origJ = [(j & 1) ? 1 : -1, (j & 2) ? 1 : -1, (j & 4) ? 1 : -1, (j & 8) ? 1 : -1]
        for (let k = 0; k < 4; k++) if (orig[k] !== origJ[k]) diff++
        if (diff === 1) edges.push([i, j])
      }
    }

    const pos = positions
    const col = colors
    edges.forEach(([ai, bi], idx) => {
      const p1 = project4Dto3D(verts4d[ai], 1)
      const p2 = project4Dto3D(verts4d[bi], 1)
      const base = idx * 6
      pos[base] = p1[0]; pos[base+1] = p1[1]; pos[base+2] = p1[2]
      pos[base+3] = p2[0]; pos[base+4] = p2[1]; pos[base+5] = p2[2]

      // Color based on W coordinate
      const wAvg = (verts4d[ai][3] + verts4d[bi][3]) / 2
      const t = (wAvg + 1.5) / 3
      col[base]   = 1; col[base+1] = t * 0.8 + 0.1; col[base+2] = 0
      col[base+3] = t * 0.5; col[base+4] = 0.2; col[base+5] = 1
    })

    if (posAttr.current) { posAttr.current.needsUpdate = true }
    if (colAttr.current) { colAttr.current.needsUpdate = true }
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute ref={posAttr} attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute ref={colAttr} attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors linewidth={2} />
    </lineSegments>
  )
}

export default function FourDSection() {
  const { t } = useLang()

  return (
    <section id="d4" className="min-h-screen flex flex-col lg:flex-row items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#000008 0%,#1a1000 100%)" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,215,0,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* Tesseract Canvas */}
      <div className="w-full lg:w-1/2 h-[55vh] lg:h-screen relative">
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} color={COLOR} intensity={3} />
          <Tesseract />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-white/25 text-center">
          {t("4D hypercube (tesseract) — 3D ထဲ ပြပြင်", "4D hypercube projected into 3D")}
        </div>
      </div>

      <div className="w-full lg:w-1/2 px-8 py-12 lg:py-0 lg:pr-16">
        <div className="font-orbitron text-[clamp(5rem,12vw,8rem)] font-black leading-none mb-4" style={{ color: COLOR, textShadow: `0 0 40px ${COLOR}, 0 0 80px ${COLOR}60` }}>
          4D
        </div>
        <div className="font-mono text-xs tracking-[0.4em] text-white/30 mb-3 uppercase">
          {t("လေး Dimension", "Four Dimensions")}
        </div>
        <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-white mb-4">
          {t("အချိန် • Tesseract", "Time • Tesseract")}
        </h2>
        <div className="space-y-4 font-mm text-base text-white/60 leading-loose mb-8">
          <p>{t("4D ဆိုသည်မှာ 3D ထဲမှာ အချိန် (Time) ကို ထပ်ထည့်သည်ဟု Einstein က ဆိုသည် — Spacetime ဖြစ်သည်။", "Einstein said 4D is 3D plus Time — called Spacetime. Every event has an (x, y, z, t) location.")}</p>
          <p>{t("သို့မဟုတ် Tesseract (Hypercube) ကဲ့သို့ geometry အားဖြင့် မြင်နိုင်သည် — 3D ထဲမှ cube ကို 4D ဘက်သို့ extend ထားသည်။", "Geometrically: a Tesseract is to a Cube as a Cube is to a Square. You're watching one rotate in 4D right now.")}</p>
          <p className="font-mono text-xs text-white/30">{t("ဦးနှောက်ကျဲကြမလား? — ဒါပဲ 4D 😵", "Brain hurt yet? That's normal for 4D. 😵")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Dimensions", val: "4" },
            { label: "Axes", val: "X,Y,Z,W" },
            { label: "Vertices", val: "16" },
            { label: t("ဥပမာ", "Example"), val: "Spacetime" },
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
