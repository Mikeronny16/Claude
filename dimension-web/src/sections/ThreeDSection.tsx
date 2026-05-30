import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Edges } from "@react-three/drei"
import { motion } from "framer-motion"
import * as THREE from "three"
import { useLang } from "../lib/lang"

const C = "#10B981"
const BG = "#050508"

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta * 0.28
    meshRef.current.rotation.y += delta * 0.46
  })
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color={C} transparent opacity={0.04} />
      <Edges color={C} lineWidth={2} />
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([-5,0,0, 5,0,0, 0,-5,0, 0,5,0, 0,0,-5, 0,0,5]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </lineSegments>
    </mesh>
  )
}

function AxisDots() {
  return (
    <>
      {([[[4.4,0,0],"#00F0FF"],[[0,4.4,0],"#7C3AED"],[[0,0,4.4],C]] as [[number,number,number],string][]).map(([pos,color],i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.07]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </>
  )
}

export default function ThreeDSection() {
  const { t } = useLang()

  return (
    <motion.div style={{ position: "absolute", inset: 0, background: BG }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}>

      <div style={{ position: "absolute", inset: 0 }}>
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.15} />
          <pointLight position={[6,6,6]} color={C} intensity={2.5} />
          <pointLight position={[-5,-5,-5]} color="#7C3AED" intensity={0.6} />
          <RotatingCube />
          <AxisDots />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 30%, #050508 86%)"
      }} />

      {/* Card — RIGHT on desktop */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-10 xl:right-14 lg:left-auto"
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
            borderTop: "1px solid rgba(16,185,129,0.12)",
            borderLeft: `3px solid ${C}`,
            borderRight: "1px solid rgba(16,185,129,0.05)",
            padding: "22px 22px 34px 26px",
          }}>

          <p className="font-mono" style={{ fontSize: 9, letterSpacing: "0.45em", color: `${C}88`, marginBottom: 8, textTransform: "uppercase" }}>
            {t("ဒိမ်နရှင် သုံး", "Dimension Three")}
          </p>

          <div className="font-orbitron" style={{
            fontSize: "clamp(4.5rem,13vw,7rem)", fontWeight: 900, lineHeight: 1,
            color: C, textShadow: `0 0 55px ${C}50`, marginBottom: 8
          }}>
            3D
          </div>

          <h2 className="font-orbitron" style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)", marginBottom: 14, letterSpacing: "0.03em" }}>
            {t("အာကာသ — ကမ္ဘာတည်ရာ", "Space — The World You Live In")}
          </h2>

          <p className="font-mm" style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, marginBottom: 16 }}>
            {t(
              "Depth ထပ်ထည့်သောအခါ Volume ဖြစ်သည်။ Shadow ကျသည်၊ Weight ရှိသည်၊ ကိုင်လို့ ရသည် — ဒါ ကျွန်တော်တို့ ကမ္ဘာ ဖြစ်သည်။",
              "Add depth and you get volume — shadow, weight, touch. Everything you've ever held exists in this dimension. Drag the cube."
            )}
          </p>

          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {[["X →","#00F0FF"],["Y ↑","#7C3AED"],["Z ↗",C]].map(([ax,col]) => (
              <div key={ax} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: col, boxShadow: `0 0 8px ${col}` }} />
                <span className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: col }}>{ax}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[["Dim","3"],["Axes","X,Y,Z"],["Vol","3D"],[t("ဥပမာ","Ex."),t("ကမ္ဘာ","World")]].map(([l,v]) => (
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

      <div className="absolute bottom-[53%] left-4 lg:bottom-6" style={{
        fontFamily: "Space Mono", fontSize: 8, letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.14)", pointerEvents: "none"
      }}>
        drag ↺
      </div>
    </motion.div>
  )
}
