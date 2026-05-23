'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function RobotHead({ mx, my }: { mx: number; my: number }) {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mx * 0.7, 0.07)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -my * 0.35, 0.07)
  })

  return (
    <group ref={ref}>
      {/* Head box */}
      <RoundedBox args={[0.88, 0.88, 0.88]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      {/* Left eye */}
      <mesh position={[-0.2, 0.1, 0.45]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={4} />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.2, 0.1, 0.45]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={4} />
      </mesh>
      {/* Mouth bar */}
      <mesh position={[0, -0.17, 0.45]}>
        <boxGeometry args={[0.3, 0.035, 0.01]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={2} />
      </mesh>
      {/* Ear panels */}
      <mesh position={[-0.46, 0, 0]}>
        <boxGeometry args={[0.04, 0.38, 0.48]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.46, 0, 0]}>
        <boxGeometry args={[0.04, 0.38, 0.48]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Antenna stem */}
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.38, 8]} />
        <meshStandardMaterial color="#333" metalness={0.9} />
      </mesh>
      {/* Antenna tip - glowing */}
      <mesh position={[0, 0.86, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={6} />
      </mesh>
    </group>
  )
}

function Robot({ mx, my }: { mx: number; my: number }) {
  const bodyRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!bodyRef.current) return
    // Subtle body sway
    bodyRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.015
  })

  return (
    <Float speed={1.6} rotationIntensity={0.06} floatIntensity={0.45}>
      <group ref={bodyRef}>
        {/* Neck */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.13, 0.19, 0.24, 12]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Body */}
        <RoundedBox args={[1.18, 1.28, 0.72]} radius={0.12} smoothness={4} position={[0, -0.78, 0]}>
          <meshStandardMaterial color="#131313" metalness={0.88} roughness={0.12} />
        </RoundedBox>

        {/* Chest panel */}
        <RoundedBox args={[0.62, 0.52, 0.04]} radius={0.05} position={[0, -0.75, 0.38]}>
          <meshStandardMaterial color="#1E1E1E" metalness={0.6} roughness={0.4} />
        </RoundedBox>
        {/* Chest LED strip */}
        <mesh position={[0, -0.65, 0.41]}>
          <boxGeometry args={[0.38, 0.022, 0.01]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={3} />
        </mesh>
        {/* Chest dots */}
        {([-0.13, 0, 0.13] as number[]).map((x, i) => (
          <mesh key={i} position={[x, -0.86, 0.41]}>
            <sphereGeometry args={[0.034, 8, 8]} />
            <meshStandardMaterial
              color="#FF6B00" emissive="#FF6B00"
              emissiveIntensity={i === 1 ? 5 : 2.5}
            />
          </mesh>
        ))}

        {/* Head (mouse-tracking) */}
        <group position={[0, 0.16, 0]}>
          <RobotHead mx={mx} my={my} />
        </group>

        {/* Left arm */}
        <group position={[-0.83, -0.68, 0]}>
          <RoundedBox args={[0.29, 0.92, 0.29]} radius={0.1} smoothness={4}>
            <meshStandardMaterial color="#131313" metalness={0.88} roughness={0.12} />
          </RoundedBox>
          <mesh position={[0, -0.62, 0]}>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#1C1C1C" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Right arm */}
        <group position={[0.83, -0.68, 0]}>
          <RoundedBox args={[0.29, 0.92, 0.29]} radius={0.1} smoothness={4}>
            <meshStandardMaterial color="#131313" metalness={0.88} roughness={0.12} />
          </RoundedBox>
          <mesh position={[0, -0.62, 0]}>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#1C1C1C" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </Float>
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
      camera={{ position: [0, 0.1, 5.2], fov: 44 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 6, 5]} intensity={2.5} />
      <pointLight position={[-4, -2, 3]} color="#FF6B00" intensity={1.4} />
      <spotLight position={[0, 8, 3]} angle={0.35} penumbra={0.9} intensity={2} />

      <Robot mx={mouse.x} my={mouse.y} />

      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.45}
        scale={5}
        blur={2.5}
        color="#FF6B00"
      />
    </Canvas>
  )
}
