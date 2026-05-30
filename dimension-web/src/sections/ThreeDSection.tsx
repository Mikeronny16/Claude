import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Edges } from "@react-three/drei"
import * as THREE from "three"
import { useLang } from "../lib/lang"

const COLOR = "#FF1F6E"

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta * 0.4
    meshRef.current.rotation.y += delta * 0.6
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color={COLOR} transparent opacity={0.07} />
      <Edges color={COLOR} lineWidth={2} />

      {/* Axis lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-3,0,0, 3,0,0, 0,-3,0, 0,3,0, 0,0,-3, 0,0,3]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </lineSegments>
    </mesh>
  )
}

function AxisLabels() {
  return (
    <>
      {/* X axis */}
      <mesh position={[3.3, 0, 0]}>
        <sphereGeometry args={[0.06]} />
        <meshBasicMaterial color="#00F5FF" />
      </mesh>
      {/* Y axis */}
      <mesh position={[0, 3.3, 0]}>
        <sphereGeometry args={[0.06]} />
        <meshBasicMaterial color="#A855F7" />
      </mesh>
      {/* Z axis */}
      <mesh position={[0, 0, 3.3]}>
        <sphereGeometry args={[0.06]} />
        <meshBasicMaterial color={COLOR} />
      </mesh>
    </>
  )
}

export default function ThreeDSection() {
  const { t } = useLang()

  return (
    <section id="d3" className="min-h-screen flex flex-col lg:flex-row-reverse items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#000008 0%,#1a000a 100%)" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(255,31,110,0.07)_0%,transparent_60%)] pointer-events-none" />

      {/* 3D Canvas */}
      <div className="w-full lg:w-1/2 h-[55vh] lg:h-screen">
        <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} color={COLOR} intensity={2} />
          <pointLight position={[-5, -5, -5]} color="#A855F7" intensity={1} />
          <RotatingCube />
          <AxisLabels />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </Canvas>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-white/25 text-center">
          {t("drag လုပ်ပြီး လှည့်ကြည့်ပါ", "drag to rotate")}
        </div>
      </div>

      <div className="w-full lg:w-1/2 px-8 py-12 lg:py-0 lg:pl-16">
        <div className="font-orbitron text-[clamp(5rem,12vw,8rem)] font-black leading-none mb-4" style={{ color: COLOR, textShadow: `0 0 40px ${COLOR}` }}>
          3D
        </div>
        <div className="font-mono text-xs tracking-[0.4em] text-white/30 mb-3 uppercase">
          {t("သုံး Dimension", "Three Dimensions")}
        </div>
        <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-white mb-4">
          {t("အာကာသ", "Space")}
        </h2>
        <div className="space-y-4 font-mm text-base text-white/60 leading-loose mb-8">
          <p>{t("3D ဆိုသည်မှာ Length + Width + Depth ရှိသည်။ ကျွန်တော်တို့ နေထိုင်ရာ ကမ္ဘာကြီးသည် 3D ကမ္ဘာ ဖြစ်သည်။", "3D adds Depth. The world we live in — buildings, trees, people — all exist in 3D space.")}</p>
          <p>{t("X, Y, Z ဝင်ရိုး သုံးခုဖြင့် မည်သည့် position ကိုမဆို ဖော်ပြနိုင်သည်။ Cube ကို drag ဆွဲ၍ ကြည့်ပါ။", "Three axes — X, Y, Z — locate any point in space. Drag the cube to explore.")}</p>
        </div>

        {/* Axis legend */}
        <div className="flex gap-4 mb-6">
          {[
            { axis: "X →", color: "#00F5FF" },
            { axis: "Y ↑", color: "#A855F7" },
            { axis: "Z ↗", color: COLOR },
          ].map(a => (
            <div key={a.axis} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: a.color, boxShadow: `0 0 8px ${a.color}` }} />
              <span className="font-mono text-xs" style={{ color: a.color }}>{a.axis}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Dimensions", val: "3" },
            { label: "Axes", val: "X, Y, Z" },
            { label: t("ဦးတည်ချက်", "Directions"), val: "6" },
            { label: t("ဥပမာ", "Example"), val: t("ကျွန်တော်တို့", "Our World") },
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
