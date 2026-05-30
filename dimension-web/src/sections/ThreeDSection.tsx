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
    meshRef.current.rotation.x += delta * 0.32
    meshRef.current.rotation.y += delta * 0.52
  })
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color={C} transparent opacity={0.05} />
      <Edges color={C} lineWidth={2.5} />
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([-4,0,0, 4,0,0, 0,-4,0, 0,4,0, 0,0,-4, 0,0,4]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </lineSegments>
    </mesh>
  )
}

function AxisDots() {
  return (
    <>
      {([[[4.2,0,0],"#00F5FF"],[[0,4.2,0],"#A855F7"],[[0,0,4.2],C]] as [[number,number,number],string][]).map(([pos,color],i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </>
  )
}

export default function ThreeDSection() {
  const { t } = useLang()

  return (
    <motion.div className="absolute inset-0" style={{ background: "#0a0005" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>

      <div className="absolute inset-0">
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[6, 6, 6]} color={C} intensity={2.5} />
          <pointLight position={[-5,-5,-5]} color="#A855F7" intensity={0.8} />
          <RotatingCube />
          <AxisDots />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_32%,#0a0005_88%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-[#0a0005] via-[#0a0005]/65 to-transparent pointer-events-none lg:hidden" />

      <motion.div
        className="absolute bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-10 xl:left-14 lg:right-auto"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <div className="w-full lg:w-[340px] xl:w-[380px] px-5 pt-5 pb-8 lg:p-7 lg:rounded-2xl rounded-t-2xl"
          style={{
            background: `linear-gradient(145deg,${C}08,${C}02)`,
            backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
            borderTop: `1px solid ${C}20`, borderLeft: `1px solid ${C}12`, borderRight: `1px solid ${C}0C`,
          }}>
          <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: C + "55" }}>
            {t("ဒိမ်နရှင် သုံး", "Dimension Three")}
          </p>
          <div className="font-orbitron font-black leading-none mb-2"
            style={{ fontSize: "clamp(3rem,10vw,5rem)", color: C, textShadow: `0 0 50px ${C}70` }}>
            3D
          </div>
          <h2 className="font-orbitron text-sm lg:text-base font-bold text-white mb-3">
            {t("အာကာသ — ကမ္ဘာတည်ရာ", "Space — The World You Live In")}
          </h2>
          <p className="font-mm text-sm text-white/50 leading-relaxed mb-3">
            {t(
              "Depth ထပ်ထည့်သောအခါ Volume ဖြစ်သည်။ Shadow ကျသည်၊ Weight ရှိသည်၊ ကိုင်လို့ ရသည် — ဒါ ကျွန်တော်တို့ ကမ္ဘာ ဖြစ်သည်။",
              "Add depth and you get volume — shadow, weight, touch. Everything you've ever held exists in this dimension. Drag the cube."
            )}
          </p>
          <div className="flex gap-3 mb-3">
            {[["X →","#00F5FF"],["Y ↑","#A855F7"],["Z ↗",C]].map(([ax,col]) => (
              <div key={ax} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: col, boxShadow:`0 0 8px ${col}` }} />
                <span className="font-mono text-[10px] font-bold" style={{ color: col }}>{ax}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[["Dim","3"],["Axes","X,Y,Z"],["Vol","3D"],[t("ဥပမာ","Ex."),t("ကမ္ဘာ","World")]].map(([l,v]) => (
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
