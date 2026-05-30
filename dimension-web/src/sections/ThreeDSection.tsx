import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Edges } from "@react-three/drei"
import { motion } from "framer-motion"
import * as THREE from "three"
import { useLang } from "../lib/lang"

const C = "#FF1F6E"

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta * 0.35
    meshRef.current.rotation.y += delta * 0.55
  })
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color={C} transparent opacity={0.06} />
      <Edges color={C} lineWidth={2.5} />
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([-3.5,0,0, 3.5,0,0, 0,-3.5,0, 0,3.5,0, 0,0,-3.5, 0,0,3.5]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </lineSegments>
    </mesh>
  )
}

function AxisDots() {
  return (
    <>
      {[{ pos: [3.8, 0, 0] as [number,number,number], color: "#00F5FF" },
        { pos: [0, 3.8, 0] as [number,number,number], color: "#A855F7" },
        { pos: [0, 0, 3.8] as [number,number,number], color: C }].map((a, i) => (
        <mesh key={i} position={a.pos}>
          <sphereGeometry args={[0.07]} />
          <meshBasicMaterial color={a.color} />
        </mesh>
      ))}
    </>
  )
}

export default function ThreeDSection() {
  const { t } = useLang()

  return (
    <motion.div className="fixed inset-0" style={{ background: "linear-gradient(160deg,#000008 55%,#1a000a 100%)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}>

      <div className="absolute inset-0">
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.25} />
          <pointLight position={[6, 6, 6]} color={C} intensity={2.5} />
          <pointLight position={[-5, -5, -5]} color="#A855F7" intensity={1} />
          <RotatingCube />
          <AxisDots />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#000008_88%)] pointer-events-none" />

      <motion.div
        className="absolute bottom-[88px] left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-10 xl:left-16 lg:right-auto pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="pointer-events-auto mx-4 lg:mx-0 px-6 py-6 lg:p-8 rounded-2xl lg:w-[360px] xl:w-[400px]"
          style={{
            background: "linear-gradient(135deg,rgba(255,31,110,0.07),rgba(255,31,110,0.02))",
            backdropFilter: "blur(24px)",
            border: `1px solid ${C}18`,
            boxShadow: `0 0 60px ${C}08`,
          }}>
          <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: C + "55" }}>
            {t("ဒိမ်နရှင် သုံး", "Dimension Three")}
          </p>
          <div className="font-orbitron font-black leading-none mb-2"
            style={{ fontSize: "clamp(3.5rem,10vw,5.5rem)", color: C, textShadow: `0 0 50px ${C}60` }}>
            3D
          </div>
          <h2 className="font-orbitron text-base lg:text-lg font-bold text-white mb-3">
            {t("အာကာသ — ကမ္ဘာနေ့", "Space — The World You Live In")}
          </h2>
          <p className="font-mm text-sm text-white/50 leading-relaxed mb-4">
            {t(
              "Depth ထပ်ထည့်သောအခါ Volume ဖြစ်သည်။ ကျွန်တော်တို့ နေထိုင်ရာ ကမ္ဘာ၊ သစ်ပင်များ၊ ဆောက်လုပ်ရေးများ — ဒါတိုင်း 3D ဖြစ်ကြသည်။ Cube ကို drag ဆွဲ၍ ကြည့်ပါ။",
              "Add depth and you get volume — shadow, weight, touch. The world you inhabit. Everything you've ever held exists in this dimension. Drag the cube."
            )}
          </p>
          <div className="flex gap-3 mb-4">
            {[["X →","#00F5FF"],["Y ↑","#A855F7"],["Z ↗", C]].map(([ax, col]) => (
              <div key={ax} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: col, boxShadow: `0 0 8px ${col}` }} />
                <span className="font-mono text-xs font-bold" style={{ color: col }}>{ax}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[["Dimensions","3"],["Axes","X,Y,Z"],["Vertices","8"],[t("ဥပမာ","Ex."),t("ကမ္ဘာ","World")]].map(([l,val]) => (
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
