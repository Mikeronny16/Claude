import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { motion } from "framer-motion"
import * as THREE from "three"
import { useLang } from "../lib/lang"

const C = "#F59E0B"
const BG = "#050508"

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
    angleRef.current += delta * 0.32
    const a = angleRef.current, b = angleRef.current * 0.6
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
      // Gold → dim amber gradient by W position
      const t = (verts4d[ai][3]+verts4d[bi][3]+2) / 4
      colors[base]=1; colors[base+1]=t*0.62+0.28; colors[base+2]=t*0.05
      colors[base+3]=t*0.55; colors[base+4]=0.08; colors[base+5]=1-t*0.9
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
    <motion.div style={{ position: "absolute", inset: 0, background: BG }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}>

      <div style={{ position: "absolute", inset: 0 }}>
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5,5,5]} color={C} intensity={2.5} />
          <Tesseract />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 30%, #050508 86%)"
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
            borderTop: "1px solid rgba(245,158,11,0.12)",
            borderLeft: `3px solid ${C}`,
            borderRight: "1px solid rgba(245,158,11,0.05)",
            padding: "22px 22px 34px 26px",
          }}>

          <p className="font-mono" style={{ fontSize: 9, letterSpacing: "0.45em", color: `${C}88`, marginBottom: 8, textTransform: "uppercase" }}>
            {t("ဒိမ်နရှင် လေး", "Dimension Four")}
          </p>

          <div className="font-orbitron" style={{
            fontSize: "clamp(4.5rem,13vw,7rem)", fontWeight: 900, lineHeight: 1,
            color: C, textShadow: `0 0 55px ${C}50`, marginBottom: 8
          }}>
            4D
          </div>

          <h2 className="font-orbitron" style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)", marginBottom: 14, letterSpacing: "0.03em" }}>
            {t("အချိန် · Tesseract", "Time · The Unseen Axis")}
          </h2>

          <p className="font-mm" style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, marginBottom: 20 }}>
            {t(
              "မင်းသည် ယခုပင် 4D ထဲ ရွေ့လျားနေသည် — Time ဆိုသော axis ဖြင့် — နောက်ပြန်မဆုတ်နိုင်ဘဲ ။ Tesseract သည် 4D object ၏ 3D shadow ဖြစ်သည်။",
              "You're already moving through 4D right now — called Time — and you can't turn back. The Tesseract you see is a 3D shadow of a 4D object."
            )}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[["Dim","4"],["Axes","X,Y,Z,W"],["Verts","16"],[t("ဥပမာ","Ex."),"Spacetime"]].map(([l,v]) => (
              <div key={l} style={{
                padding: "7px 12px", borderRadius: 8,
                background: `${C}08`, border: `1px solid ${C}22`
              }}>
                <p className="font-mono" style={{ fontSize: 7, letterSpacing: "0.18em", color: `${C}88`, marginBottom: 2 }}>{l}</p>
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
        drag ↺
      </div>
    </motion.div>
  )
}
