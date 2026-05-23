'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, ContactShadows, Environment, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// Chrome silver material props
const chrome = { metalness: 1, roughness: 0.08, color: '#C0C0C0', envMapIntensity: 1 }
const darkChrome = { metalness: 1, roughness: 0.12, color: '#888', envMapIntensity: 1 }
const glowOrange = { color: '#FF6B00', emissive: '#FF6B00', emissiveIntensity: 8, toneMapped: false }
const glowWhite = { color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 6, toneMapped: false }

function RobotHead({ mx, my }: { mx: number; my: number }) {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mx * 0.65, 0.07)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -my * 0.3, 0.07)
  })

  return (
    <group ref={ref}>
      {/* Head */}
      <RoundedBox args={[0.82, 0.78, 0.75]} radius={0.09} smoothness={6}>
        <meshPhysicalMaterial {...chrome} clearcoat={0.6} clearcoatRoughness={0.1} />
      </RoundedBox>

      {/* Visor / eye panel */}
      <mesh position={[0, 0.07, 0.39]}>
        <boxGeometry args={[0.56, 0.18, 0.02]} />
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.9} roughness={0.05} transmission={0.3} />
      </mesh>

      {/* Left eye glow */}
      <mesh position={[-0.15, 0.07, 0.42]}>
        <sphereGeometry args={[0.072, 16, 16]} />
        <meshStandardMaterial {...glowOrange} />
      </mesh>
      {/* Right eye glow */}
      <mesh position={[0.15, 0.07, 0.42]}>
        <sphereGeometry args={[0.072, 16, 16]} />
        <meshStandardMaterial {...glowOrange} />
      </mesh>

      {/* Chin plate */}
      <mesh position={[0, -0.25, 0.34]}>
        <boxGeometry args={[0.36, 0.08, 0.04]} />
        <meshPhysicalMaterial {...darkChrome} />
      </mesh>

      {/* Side panel lines (decorative) */}
      {([-1, 1] as number[]).map((side, i) => (
        <mesh key={i} position={[side * 0.44, 0, 0]}>
          <boxGeometry args={[0.05, 0.62, 0.58]} />
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.4} />
        </mesh>
      ))}

      {/* Top dome */}
      <mesh position={[0, 0.45, -0.04]}>
        <sphereGeometry args={[0.3, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...chrome} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>

      {/* Antenna base */}
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.14, 10]} />
        <meshPhysicalMaterial {...darkChrome} />
      </mesh>
      {/* Antenna stem */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.26, 8]} />
        <meshPhysicalMaterial metalness={1} roughness={0.2} color="#666" />
      </mesh>
      {/* Antenna tip glow */}
      <mesh position={[0, 0.87, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial {...glowWhite} />
      </mesh>
    </group>
  )
}

function RobotBody({ mx, my }: { mx: number; my: number }) {
  const bodyRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!bodyRef.current) return
    const t = clock.elapsedTime
    bodyRef.current.rotation.z = Math.sin(t * 0.5) * 0.012

    // Arms swing slightly
    if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 0.7) * 0.06
    if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 0.7) * 0.06
  })

  return (
    <group ref={bodyRef}>
      {/* Neck */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.11, 0.17, 0.22, 14]} />
        <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
      </mesh>

      {/* Neck collar ring */}
      <mesh position={[0, -0.1, 0]}>
        <torusGeometry args={[0.2, 0.025, 10, 32]} />
        <meshPhysicalMaterial metalness={1} roughness={0.05} color="#aaa" />
      </mesh>

      {/* Torso */}
      <RoundedBox args={[1.12, 1.22, 0.66]} radius={0.1} smoothness={6} position={[0, -0.75, 0]}>
        <meshPhysicalMaterial {...chrome} clearcoat={0.8} clearcoatRoughness={0.08} />
      </RoundedBox>

      {/* Chest center panel (dark glass) */}
      <RoundedBox args={[0.58, 0.48, 0.04]} radius={0.06} position={[0, -0.72, 0.35]}>
        <meshPhysicalMaterial color="#0D0D0D" metalness={0.8} roughness={0.0} transmission={0.15} />
      </RoundedBox>

      {/* Chest glow strip top */}
      <mesh position={[0, -0.58, 0.375]}>
        <boxGeometry args={[0.34, 0.018, 0.005]} />
        <meshStandardMaterial {...glowOrange} />
      </mesh>
      {/* Chest glow strip bottom */}
      <mesh position={[0, -0.88, 0.375]}>
        <boxGeometry args={[0.34, 0.018, 0.005]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={4} toneMapped={false} />
      </mesh>

      {/* Chest dots */}
      {([-0.12, 0, 0.12] as number[]).map((x, i) => (
        <mesh key={i} position={[x, -0.73, 0.378]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={i === 1 ? 10 : 5} toneMapped={false} />
        </mesh>
      ))}

      {/* Shoulder plates */}
      {([-1, 1] as number[]).map((side, i) => (
        <mesh key={i} position={[side * 0.68, -0.38, 0]}>
          <sphereGeometry args={[0.26, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          <meshPhysicalMaterial {...chrome} clearcoat={1} clearcoatRoughness={0.05} side={THREE.BackSide} />
        </mesh>
      ))}

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.78, -0.72, 0]}>
        {/* Upper arm */}
        <RoundedBox args={[0.27, 0.56, 0.27]} radius={0.09} smoothness={5} position={[0, -0.05, 0]}>
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.6} />
        </RoundedBox>
        {/* Elbow joint */}
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.155, 16, 16]} />
          <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
        </mesh>
        {/* Forearm */}
        <RoundedBox args={[0.23, 0.5, 0.23]} radius={0.08} smoothness={5} position={[0, -0.76, 0]}>
          <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
        </RoundedBox>
        {/* Hand */}
        <mesh position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.14, 14, 14]} />
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.5} />
        </mesh>
        {/* Arm glow stripe */}
        <mesh position={[0.12, -0.76, 0]}>
          <boxGeometry args={[0.01, 0.3, 0.01]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={4} toneMapped={false} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.78, -0.72, 0]}>
        <RoundedBox args={[0.27, 0.56, 0.27]} radius={0.09} smoothness={5} position={[0, -0.05, 0]}>
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.6} />
        </RoundedBox>
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.155, 16, 16]} />
          <meshPhysicalMaterial {...chrome} clearcoat={0.8} />
        </mesh>
        <RoundedBox args={[0.23, 0.5, 0.23]} radius={0.08} smoothness={5} position={[0, -0.76, 0]}>
          <meshPhysicalMaterial {...chrome} clearcoat={0.5} />
        </RoundedBox>
        <mesh position={[0, -1.1, 0]}>
          <sphereGeometry args={[0.14, 14, 14]} />
          <meshPhysicalMaterial {...darkChrome} clearcoat={0.5} />
        </mesh>
        <mesh position={[-0.12, -0.76, 0]}>
          <boxGeometry args={[0.01, 0.3, 0.01]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={4} toneMapped={false} />
        </mesh>
      </group>

      {/* Head (mouse tracking) */}
      <group position={[0, 0.18, 0]}>
        <RobotHead mx={mx} my={my} />
      </group>
    </group>
  )
}

function Scene({ mx, my }: { mx: number; my: number }) {
  return (
    <>
      <Environment preset="city" />

      <ambientLight intensity={0.15} />
      <pointLight position={[4, 5, 4]} intensity={3} color="#ffffff" />
      <pointLight position={[-3, 2, 3]} intensity={2} color="#FF6B00" />
      <pointLight position={[0, -3, 2]} intensity={0.8} color="#4488ff" />
      <spotLight position={[0, 8, 2]} angle={0.3} penumbra={0.8} intensity={4} color="#ffffff" />

      <Float speed={1.4} rotationIntensity={0.04} floatIntensity={0.35}>
        <RobotBody mx={mx} my={my} />
      </Float>

      <ContactShadows
        position={[0, -2.6, 0]}
        opacity={0.5}
        scale={5}
        blur={3}
        color="#FF6B00"
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={1.4}
          mipmapBlur
        />
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
      camera={{ position: [0, 0, 5.2], fov: 44 }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene mx={mouse.x} my={mouse.y} />
      </Suspense>
    </Canvas>
  )
}
