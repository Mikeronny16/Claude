'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, ContactShadows, Environment, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// Materials
const chrome  = { metalness: 1, roughness: 0.06, color: '#B8C8C8', envMapIntensity: 1.4 } as const
const dark    = { metalness: 1, roughness: 0.18, color: '#445', envMapIntensity: 1.0 } as const
const teal    = { color: '#00FFCC', emissive: '#00FFCC', emissiveIntensity: 8, toneMapped: false } as const
const orange  = { color: '#FF6B00', emissive: '#FF6B00', emissiveIntensity: 8, toneMapped: false } as const

// Pulsing MR text
function ChestMR() {
  const glowRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!glowRef.current) return
    const m = glowRef.current.material as THREE.MeshStandardMaterial
    m.emissiveIntensity = 2.5 + Math.sin(clock.elapsedTime * 2.2) * 1.3
  })
  return (
    <group position={[0, -0.82, 0.32]}>
      <mesh ref={glowRef}>
        <planeGeometry args={[0.28, 0.13]} />
        <meshStandardMaterial color="#00FFCC" emissive="#00FFCC" emissiveIntensity={2.5}
          transparent opacity={0.2} toneMapped={false} />
      </mesh>
      <Text position={[0, 0, 0.01]} fontSize={0.11} color="#00FFEE"
        anchorX="center" anchorY="middle" letterSpacing={0.12}>
        MR
      </Text>
    </group>
  )
}

// Alien head — elongated, large visor, side fins
function AlienHead({ mx, my }: { mx: number; my: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mx * 0.65, 0.07)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -my * 0.32, 0.07)
  })

  return (
    <group ref={ref}>
      {/* Cranium — tall, narrow, alien proportions */}
      <RoundedBox args={[0.62, 1.0, 0.58]} radius={0.08} smoothness={8} position={[0, 0.08, 0]}>
        <meshPhysicalMaterial {...chrome} clearcoat={0.9} clearcoatRoughness={0.06} />
      </RoundedBox>

      {/* Lower jaw — slightly wider, angular */}
      <RoundedBox args={[0.56, 0.22, 0.52]} radius={0.04} smoothness={6} position={[0, -0.44, 0]}>
        <meshPhysicalMaterial {...dark} clearcoat={0.5} />
      </RoundedBox>

      {/* Large visor — horizontal sweep */}
      <mesh position={[0, 0.1, 0.30]}>
        <boxGeometry args={[0.52, 0.14, 0.02]} />
        <meshPhysicalMaterial color="#001A22" metalness={0.9} roughness={0.0} transmission={0.3} />
      </mesh>

      {/* Alien eyes — elongated, wide-set, teal */}
      <mesh position={[-0.17, 0.10, 0.32]}>
        <boxGeometry args={[0.09, 0.045, 0.01]} />
        <meshStandardMaterial {...teal} />
      </mesh>
      <mesh position={[0.17, 0.10, 0.32]}>
        <boxGeometry args={[0.09, 0.045, 0.01]} />
        <meshStandardMaterial {...teal} />
      </mesh>

      {/* Side cranium ridges */}
      {([-1, 1] as number[]).map((s, i) => (
        <group key={i} position={[s * 0.33, 0.18, 0]}>
          <RoundedBox args={[0.06, 0.60, 0.44]} radius={0.03} smoothness={4}>
            <meshPhysicalMaterial {...dark} clearcoat={0.3} />
          </RoundedBox>
          {/* Ridge glow line */}
          <mesh position={[s * -0.02, 0, 0.22]}>
            <boxGeometry args={[0.005, 0.40, 0.005]} />
            <meshStandardMaterial {...teal} />
          </mesh>
        </group>
      ))}

      {/* Back crest — swept fin */}
      <RoundedBox args={[0.08, 0.55, 0.20]} radius={0.03} smoothness={4} position={[0, 0.38, -0.22]}
        rotation={[0.28, 0, 0]}>
        <meshPhysicalMaterial {...dark} clearcoat={0.4} />
      </RoundedBox>
      {/* Crest glow edge */}
      <mesh position={[0, 0.52, -0.28]} rotation={[0.28, 0, 0]}>
        <boxGeometry args={[0.004, 0.38, 0.004]} />
        <meshStandardMaterial color="#00FFCC" emissive="#00FFCC" emissiveIntensity={6} toneMapped={false} />
      </mesh>

      {/* Top antenna */}
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.013, 0.018, 0.22, 8]} />
        <meshPhysicalMaterial metalness={1} roughness={0.2} color="#556" />
      </mesh>
      <mesh position={[0, 0.77, 0]}>
        <sphereGeometry args={[0.036, 14, 14]} />
        <meshStandardMaterial color="#00FFCC" emissive="#00FFCC" emissiveIntensity={10} toneMapped={false} />
      </mesh>
    </group>
  )
}

// Long alien leg
function Leg({ side }: { side: -1 | 1 }) {
  const x = side * 0.22
  return (
    <group position={[x, 0, 0]}>
      {/* Hip ball */}
      <mesh>
        <sphereGeometry args={[0.13, 14, 14]} />
        <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
      </mesh>
      {/* Upper leg — long */}
      <RoundedBox args={[0.18, 0.72, 0.19]} radius={0.055} smoothness={5} position={[0, -0.48, 0]}>
        <meshPhysicalMaterial {...dark} clearcoat={0.5} />
      </RoundedBox>
      {/* Knee */}
      <mesh position={[0, -0.92, 0]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
      </mesh>
      {/* Shin — long */}
      <RoundedBox args={[0.15, 0.72, 0.17]} radius={0.05} smoothness={5} position={[0, -1.38, 0]}>
        <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
      </RoundedBox>
      {/* Shin glow stripe */}
      <mesh position={[side * -0.07, -1.38, 0.08]}>
        <boxGeometry args={[0.006, 0.44, 0.006]} />
        <meshStandardMaterial {...teal} />
      </mesh>
      {/* Ankle */}
      <mesh position={[0, -1.8, 0]}>
        <sphereGeometry args={[0.085, 12, 12]} />
        <meshPhysicalMaterial {...dark} clearcoat={0.6} />
      </mesh>
      {/* Foot — angled, alien claw-like */}
      <RoundedBox args={[0.20, 0.08, 0.36]} radius={0.035} smoothness={4} position={[0, -1.92, 0.06]}>
        <meshPhysicalMaterial {...dark} clearcoat={0.4} />
      </RoundedBox>
      {/* Toe claws */}
      {([0.12, 0, -0.12] as number[]).map((tz, ci) => (
        <mesh key={ci} position={[0, -1.96, 0.22 + tz]} rotation={[0.25, 0, 0]}>
          <coneGeometry args={[0.025, 0.12, 6]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
      ))}
    </group>
  )
}

function RobotBody({ mx, my }: { mx: number; my: number }) {
  const bodyRef  = useRef<THREE.Group>(null)
  const leftArm  = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 0.5) * 0.01

    // Arms follow mouse + idle swing
    if (leftArm.current) {
      leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, -my * 0.3 + Math.sin(t * 0.7) * 0.06, 0.06)
      leftArm.current.rotation.z = THREE.MathUtils.lerp(leftArm.current.rotation.z, mx * 0.18, 0.06)
    }
    if (rightArm.current) {
      rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, -my * 0.3 - Math.sin(t * 0.7) * 0.06, 0.06)
      rightArm.current.rotation.z = THREE.MathUtils.lerp(rightArm.current.rotation.z, mx * 0.18, 0.06)
    }
  })

  return (
    <group ref={bodyRef}>
      {/* Head */}
      <group position={[0, 0.28, 0]}>
        <AlienHead mx={mx} my={my} />
      </group>

      {/* Neck — segmented */}
      {([0, -0.08, -0.16] as number[]).map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.07 + i * 0.01, 0.09 + i * 0.01, 0.07, 10]} />
          <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
        </mesh>
      ))}

      {/* Torso — slim alien */}
      <RoundedBox args={[0.78, 1.52, 0.56]} radius={0.08} smoothness={6} position={[0, -0.96, 0]}>
        <meshPhysicalMaterial {...chrome} clearcoat={0.75} clearcoatRoughness={0.07} />
      </RoundedBox>

      {/* Chest dark panel */}
      <RoundedBox args={[0.46, 0.60, 0.032]} radius={0.04} position={[0, -0.82, 0.29]}>
        <meshPhysicalMaterial color="#020A0A" metalness={0.9} roughness={0.0} />
      </RoundedBox>

      {/* LED strips */}
      <mesh position={[0, -0.60, 0.31]}>
        <boxGeometry args={[0.26, 0.013, 0.004]} />
        <meshStandardMaterial {...orange} />
      </mesh>
      <mesh position={[0, -1.06, 0.31]}>
        <boxGeometry args={[0.26, 0.013, 0.004]} />
        <meshStandardMaterial color="#00FFCC" emissive="#00FFCC" emissiveIntensity={4} toneMapped={false} />
      </mesh>

      <ChestMR />

      {/* Spine glow line on back */}
      <mesh position={[0, -0.96, -0.29]}>
        <boxGeometry args={[0.007, 1.2, 0.007]} />
        <meshStandardMaterial color="#00FFCC" emissive="#00FFCC" emissiveIntensity={5} toneMapped={false} />
      </mesh>

      {/* Waist ring */}
      <mesh position={[0, -1.44, 0]}>
        <torusGeometry args={[0.32, 0.024, 10, 32]} />
        <meshPhysicalMaterial metalness={1} roughness={0.04} color="#9ab" />
      </mesh>

      {/* Shoulder caps */}
      {([-1, 1] as number[]).map((s, i) => (
        <mesh key={i} position={[s * 0.52, -0.46, 0]}>
          <sphereGeometry args={[0.19, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          <meshPhysicalMaterial {...chrome} clearcoat={1} clearcoatRoughness={0.04} side={THREE.BackSide} />
        </mesh>
      ))}

      {/* Left arm — mouse-tracked */}
      <group ref={leftArm} position={[-0.56, -0.82, 0]}>
        {/* Upper arm */}
        <RoundedBox args={[0.18, 0.48, 0.18]} radius={0.06} smoothness={5} position={[0, -0.04, 0]}>
          <meshPhysicalMaterial {...dark} clearcoat={0.5} />
        </RoundedBox>
        {/* Elbow */}
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
        </mesh>
        {/* Forearm */}
        <RoundedBox args={[0.16, 0.44, 0.16]} radius={0.055} smoothness={5} position={[0, -0.64, 0]}>
          <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
        </RoundedBox>
        {/* Wrist */}
        <mesh position={[0, -0.90, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshPhysicalMaterial {...dark} clearcoat={0.5} />
        </mesh>
        {/* Hand + alien fingers */}
        <mesh position={[0, -1.02, 0]}>
          <sphereGeometry args={[0.085, 12, 12]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {([[-0.06, -1.14, 0.02], [0, -1.16, 0.04], [0.06, -1.14, 0.02]] as [number,number,number][]).map((pos, ci) => (
          <mesh key={ci} position={pos} rotation={[-0.2, 0, 0]}>
            <coneGeometry args={[0.018, 0.1, 5]} />
            <meshPhysicalMaterial {...dark} />
          </mesh>
        ))}
        {/* Arm glow */}
        <mesh position={[0.08, -0.64, 0]}>
          <boxGeometry args={[0.006, 0.24, 0.006]} />
          <meshStandardMaterial {...teal} />
        </mesh>
      </group>

      {/* Right arm — mouse-tracked */}
      <group ref={rightArm} position={[0.56, -0.82, 0]}>
        <RoundedBox args={[0.18, 0.48, 0.18]} radius={0.06} smoothness={5} position={[0, -0.04, 0]}>
          <meshPhysicalMaterial {...dark} clearcoat={0.5} />
        </RoundedBox>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
        </mesh>
        <RoundedBox args={[0.16, 0.44, 0.16]} radius={0.055} smoothness={5} position={[0, -0.64, 0]}>
          <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
        </RoundedBox>
        <mesh position={[0, -0.90, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshPhysicalMaterial {...dark} clearcoat={0.5} />
        </mesh>
        <mesh position={[0, -1.02, 0]}>
          <sphereGeometry args={[0.085, 12, 12]} />
          <meshPhysicalMaterial {...dark} />
        </mesh>
        {([[-0.06, -1.14, 0.02], [0, -1.16, 0.04], [0.06, -1.14, 0.02]] as [number,number,number][]).map((pos, ci) => (
          <mesh key={ci} position={pos} rotation={[-0.2, 0, 0]}>
            <coneGeometry args={[0.018, 0.1, 5]} />
            <meshPhysicalMaterial {...dark} />
          </mesh>
        ))}
        <mesh position={[-0.08, -0.64, 0]}>
          <boxGeometry args={[0.006, 0.24, 0.006]} />
          <meshStandardMaterial {...teal} />
        </mesh>
      </group>

      {/* Hips */}
      <RoundedBox args={[0.60, 0.18, 0.44]} radius={0.06} smoothness={5} position={[0, -1.60, 0]}>
        <meshPhysicalMaterial {...dark} clearcoat={0.4} />
      </RoundedBox>

      {/* Legs */}
      <group position={[0, -1.74, 0]}>
        <Leg side={-1} />
        <Leg side={1} />
      </group>
    </group>
  )
}

function Scene({ mx, my }: { mx: number; my: number }) {
  return (
    <>
      {/* background={false} fixes the brown rectangle */}
      <Environment preset="city" background={false} />

      <ambientLight intensity={0.10} />
      <pointLight position={[3, 5, 4]}   intensity={3.5} color="#ffffff" />
      <pointLight position={[-3, 2, 3]}  intensity={2.0} color="#FF6B00" />
      <pointLight position={[0, -4, 2]}  intensity={1.2} color="#00FFCC" />
      <spotLight  position={[0, 8, 2]}   angle={0.28} penumbra={0.85} intensity={4} color="#ffffff" />

      <Float speed={1.1} rotationIntensity={0.02} floatIntensity={0.22}>
        <group position={[0, 0.9, 0]}>
          <RobotBody mx={mx} my={my} />
        </group>
      </Float>

      <ContactShadows position={[0, -2.2, 0]} opacity={0.4} scale={4} blur={2.5} color="#00FFCC" />

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.85} intensity={1.8} mipmapBlur />
      </EffectComposer>
    </>
  )
}

export default function RobotScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMouse = (e: MouseEvent) => setMouse({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    })
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      setMouse({
        x: (t.clientX / window.innerWidth) * 2 - 1,
        y: (t.clientY / window.innerHeight) * 2 - 1,
      })
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 8.0], fov: 44 }}
      gl={{
        alpha: true, antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene mx={mouse.x} my={mouse.y} />
      </Suspense>
    </Canvas>
  )
}

