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
    angleRef.current += delta * 0.36
    const a = angleRef.current, b = angleRef.current * 0.62
    const c1 = Math.cos(a), s1 = Math.sin(a), c2 = Math.cos(b), s2 = Math.sin(b)
    const verts4d: number[][] = []
    for (let i = 0; i < 16; i++) {
      const x = (i & 1) ? 1 : -1, y = (i & 2) ? 1 : -1
      const z = (i & 4) ? 1 : -1, w = (i & 8) ? 1 : -1
      verts4d.push([x*c1-w*s1, y*c2-z*s2, y*s2+z*c2, x*s1+w*c1])
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
      positions[base]=p1[0]; positions[base+1]=p1[1]; positions[base+2]=p1[2]
      positions[base+3]=p2[0]; positions[base+4]=p2[1]; positions[base+5]=p2[2]
      const t = (verts4d[ai][3]+verts4d[bi][3]+2) / 4
      colors[base]=1; colors[base+1]=t*0.85+0.1; colors[base+2]=0
      colors[base+3]=t*0.5; colors[base+4]=0.12; colors[base+5]=1
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
    <motion.div className="absolute inset-0" style={{ background: "#080500" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>

      <div className="absolute inset-0">
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5,5,5]} color={C} intensity={3} />
          <Tesseract />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_32%,#080500_88%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-[#080500] via-[#080500]/65 to-transparent pointer-events-none lg:hidden" />

      <motion.div
        className="absolute bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-10 xl:right-14 lg:left-auto"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <div className="w-full lg:w-[340px] xl:w-[380px] px-5 pt-5 pb-8 lg:p-7 lg:rounded-2xl rounded-t-2xl"
          style={{
            background: `linear-gradient(145deg,${C}07,${C}02)`,
            backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
            borderTop: `1px solid ${C}20`, borderLeft: `1px solid ${C}12`, borderRight: `1px solid ${C}0C`,
          }}>
          <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: C + "55" }}>
            {t("ဒိမ်နရှင် လေး", "Dimension Four")}
          </p>
          <div className="font-orbitron font-black leading-none mb-2"
            style={{ fontSize: "clamp(3rem,10vw,5rem)", color: C, textShadow: `0 0 50px ${C}70` }}>
            4D
          </div>
          <h2 className="font-orbitron text-sm lg:text-base font-bold text-white mb-3">
            {t("အချိန် · Tesseract", "Time · The Unseen Axis")}
          </h2>
          <p className="font-mm text-sm text-white/50 leading-relaxed mb-3">
            {t(
              "မင်းသည် ယခုပင် 4D ထဲ ရွေ့လျားနေသည် — Time ဆိုသော axis ဖြင့် — နောက်ပြန်မဆုတ်နိုင်ဘဲ ။ Geometry အရ — Cube ကဲ့သို့ Tesseract သည် 4D ဘက်သို့ extend ထားသည်။",
              "You're already moving through 4D right now — called Time — and you can't turn back. The Tesseract you see is a 3D shadow of a 4D object."
            )}
          </p>
          <p className="font-mono text-[9px] text-white/22 mb-4">
            {t("ဦးနှောက်ကျဲသွားရင် မှန်ပါ 😵", "Brain hurt? That's normal. 😵")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[["Dim","4"],["Axes","X,Y,Z,W"],["Verts","16"],[t("ဥပမာ","Ex."),"Spacetime"]].map(([l,v]) => (
              <div key={l} className="px-2.5 py-1.5 rounded-lg" style={{ background: C+"09", border:`1px solid ${C}1E` }}>
                <p className="font-mono text-[7px] tracking-widest" style={{ color: C+"45" }}>{l}</p>
                <p className="font-orbitron text-xs font-bold" style={{ color: C }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-[52%] right-4 lg:bottom-6 font-mono text-[8px] tracking-widest text-white/18 pointer-events-none">
        {t("drag ↺", "drag ↺")}
      </div>
    </motion.div>
  )
}
