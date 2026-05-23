'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, ContactShadows, Environment, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const chrome     = { metalness: 1, roughness: 0.07, color: '#C8C8C8', envMapIntensity: 1.2 } as const
const darkChrome = { metalness: 1, roughness: 0.14, color: '#888',    envMapIntensity: 1.0 } as const

function ChestMR() {
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!glowRef.current) return
    const mat = glowRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 2.5 + Math.sin(clock.elapsedTime * 2.2) * 1.3
  })

  return (
    <group position={[0, -0.78, 0.31]}>
      <mesh ref={glowRef}>
        <planeGeometry args={[0.28, 0.13]} />
        <meshStandardMaterial
          color="#FF6B00" emissive="#FF6B00" emissiveIntensity={2.5}
          transparent opacity={0.22} toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.12}
        color="#FF9944"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        MR
      </Text>
    </group>
  )
}

function RobotHead({ mx, my }: { mx: number; my: number }) {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mx * 0.65, 0.07)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -my * 0.3, 0.07)
  })

  return (
    <group ref={ref}>
      <RoundedBox args={[0.70, 0.68, 0.64]} radius={0.08} smoothness={6}>
        <meshPhysicalMaterial {...chrome} clearcoat={0.7} clearcoatRoughness={0.08} />
      </RoundedBox>

      {/* Visor */}
      <mesh position={[0, 0.05, 0.34]}>
        <boxGeometry args={[0.46, 0.15, 0.016]} />
        <meshPhysicalMaterial color="#060606" metalness={0.9} roughness={0.0} />
      </mesh>

      {/* Eyes */}
      {([-0.13, 0.13] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0.36]}>
          <sphereGeometry args={[0.058, 16, 16]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={10} toneMapped={false} />
        </mesh>
      ))}

      {/* Side panels */}
      {([-1, 1] as number[]).map((s, i) => (
        <mesh key={i} position={[s * 0.37, 0, 0]}>
          <boxGeometry args={[0.04, 0.52, 0.48]} />
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.4} />
        </mesh>
      ))}

      {/* Top dome */}
      <mesh position={[0, 0.38, -0.02]}>
        <sphereGeometry args={[0.25, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...chrome} clearcoat={1} clearcoatRoughness={0.04} />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.50, 0]}>
        <cylinderGeometry args={[0.032, 0.040, 0.11, 10]} />
        <meshPhysicalMaterial {...darkChrome} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.013, 0.013, 0.20, 8]} />
        <meshPhysicalMaterial metalness={1} roughness={0.2} color="#555" />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <sphereGeometry args={[0.043, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={8} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Leg({ side }: { side: -1 | 1 }) {
  const x = side * 0.21

  return (
    <group position={[x, 0, 0]}>
      {/* Hip joint */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.13, 14, 14]} />
        <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
      </mesh>
      {/* Upper leg */}
      <RoundedBox args={[0.19, 0.54, 0.20]} radius={0.06} smoothness={5} position={[0, -0.37, 0]}>
        <meshPhysicalMaterial {...darkChrome} clearcoat={0.5} />
      </RoundedBox>
      {/* Knee */}
      <mesh position={[0, -0.70, 0]}>
        <sphereGeometry args={[0.115, 14, 14]} />
        <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
      </mesh>
      {/* Lower leg / shin */}
      <RoundedBox args={[0.17, 0.50, 0.19]} radius={0.055} smoothness={5} position={[0, -1.04, 0]}>
        <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
      </RoundedBox>
      {/* Shin glow stripe */}
      <mesh position={[side * -0.08, -1.04, 0.09]}>
        <boxGeometry args={[0.007, 0.28, 0.007]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      {/* Ankle */}
      <mesh position={[0, -1.34, 0]}>
        <sphereGeometry args={[0.095, 12, 12]} />
        <meshPhysicalMaterial {...darkChrome} clearcoat={0.6} />
      </mesh>
      {/* Foot */}
      <RoundedBox args={[0.23, 0.09, 0.34]} radius={0.04} smoothness={4} position={[0, -1.48, 0.05]}>
        <meshPhysicalMaterial {...darkChrome} clearcoat={0.4} />
      </RoundedBox>
    </group>
  )
}

function RobotBody({ mx, my }: { mx: number; my: number }) {
  const bodyRef  = useRef<THREE.Group>(null)
  const leftArm  = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (bodyRef.current)  bodyRef.current.rotation.z  =  Math.sin(t * 0.5) * 0.01
    if (leftArm.current)  leftArm.current.rotation.x  =  Math.sin(t * 0.7) * 0.055
    if (rightArm.current) rightArm.current.rotation.x = -Math.sin(t * 0.7) * 0.055
  })

  return (
    <group ref={bodyRef}>
      {/* Head */}
      <group position={[0, 0.22, 0]}>
        <RobotHead mx={mx} my={my} />
      </group>

      {/* Neck */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.09, 0.14, 0.20, 14]} />
        <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, -0.10, 0]}>
        <torusGeometry args={[0.16, 0.020, 10, 32]} />
        <meshPhysicalMaterial metalness={1} roughness={0.04} color="#aaa" />
      </mesh>

      {/* Torso — slim & tall */}
      <RoundedBox args={[0.82, 1.50, 0.58]} radius={0.09} smoothness={6} position={[0, -0.88, 0]}>
        <meshPhysicalMaterial {...chrome} clearcoat={0.8} clearcoatRoughness={0.07} />
      </RoundedBox>

      {/* Chest panel */}
      <RoundedBox args={[0.48, 0.54, 0.034]} radius={0.05} position={[0, -0.78, 0.30]}>
        <meshPhysicalMaterial color="#060606" metalness={0.8} roughness={0.0} />
      </RoundedBox>

      {/* LED top */}
      <mesh position={[0, -0.56, 0.32]}>
        <boxGeometry args={[0.28, 0.015, 0.004]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      {/* LED bottom */}
      <mesh position={[0, -1.00, 0.32]}>
        <boxGeometry args={[0.28, 0.015, 0.004]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      <ChestMR />

      {/* Waist ring */}
      <mesh position={[0, -1.30, 0]}>
        <torusGeometry args={[0.35, 0.026, 10, 32]} />
        <meshPhysicalMaterial metalness={1} roughness={0.05} color="#999" />
      </mesh>

      {/* Shoulder caps */}
      {([-1, 1] as number[]).map((s, i) => (
        <mesh key={i} position={[s * 0.54, -0.42, 0]}>
          <sphereGeometry args={[0.20, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          <meshPhysicalMaterial {...chrome} clearcoat={1} clearcoatRoughness={0.04} side={THREE.BackSide} />
        </mesh>
      ))}

      {/* Left arm */}
      <group ref={leftArm} position={[-0.58, -0.76, 0]}>
        <RoundedBox args={[0.20, 0.48, 0.20]} radius={0.065} smoothness={5} position={[0, -0.04, 0]}>
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.6} />
        </RoundedBox>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
        </mesh>
        <RoundedBox args={[0.17, 0.42, 0.17]} radius={0.055} smoothness={5} position={[0, -0.64, 0]}>
          <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
        </RoundedBox>
        <mesh position={[0, -0.94, 0]}>
          <sphereGeometry args={[0.10, 14, 14]} />
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.5} />
        </mesh>
        <mesh position={[0.09, -0.64, 0]}>
          <boxGeometry args={[0.007, 0.24, 0.007]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={4} toneMapped={false} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArm} position={[0.58, -0.76, 0]}>
        <RoundedBox args={[0.20, 0.48, 0.20]} radius={0.065} smoothness={5} position={[0, -0.04, 0]}>
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.6} />
        </RoundedBox>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
        </mesh>
        <RoundedBox args={[0.17, 0.42, 0.17]} radius={0.055} smoothness={5} position={[0, -0.64, 0]}>
          <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
        </RoundedBox>
        <mesh position={[0, -0.94, 0]}>
          <sphereGeometry args={[0.10, 14, 14]} />
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.5} />
        </mesh>
        <mesh position={[-0.09, -0.64, 0]}>
          <boxGeometry args={[0.007, 0.24, 0.007]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={4} toneMapped={false} />
        </mesh>
      </group>

      {/* Hips block */}
      <RoundedBox args={[0.64, 0.18, 0.46]} radius={0.07} smoothness={5} position={[0, -1.48, 0]}>
        <meshPhysicalMaterial {...darkChrome} clearcoat={0.5} />
      </RoundedBox>

      {/* Legs */}
      <group position={[0, -1.63, 0]}>
        <Leg side={-1} />
        <Leg side={1} />
      </group>
    </group>
  )
}

function Scene({ mx, my }: { mx: number; my: number }) {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.12} />
      <pointLight position={[3, 5, 4]}   intensity={3.5} color="#ffffff" />
      <pointLight position={[-3, 2, 3]}  intensity={2.2} color="#FF6B00" />
      <pointLight position={[0, -4, 2]}  intensity={0.9} color="#4466ff" />
      <spotLight  position={[0, 8, 2]}   angle={0.28} penumbra={0.85} intensity={4.5} color="#ffffff" />

      <Float speed={1.2} rotationIntensity={0.02} floatIntensity={0.25}>
        {/* Raise whole robot so it's centered in frame */}
        <group position={[0, 0.9, 0]}>
          <RobotBody mx={mx} my={my} />
        </group>
      </Float>

      <ContactShadows position={[0, -2.1, 0]} opacity={0.5} scale={4} blur={2.5} color="#FF6B00" />

      <EffectComposer>
        <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.85} intensity={1.6} mipmapBlur />
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
      camera={{ position: [0, 0, 7.2], fov: 44 }}
      gl={{
        alpha: true, antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene mx={mouse.x} my={mouse.y} />
      </Suspense>
    </Canvas>
  )
}
