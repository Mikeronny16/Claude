'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, ContactShadows, Environment, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// Dark biomechanical materials
const bio     = { metalness: 0.85, roughness: 0.55, color: '#0C0E0E', envMapIntensity: 0.8 } as const
const bioMid  = { metalness: 0.8,  roughness: 0.45, color: '#161A1A', envMapIntensity: 0.9 } as const
const bioLight = { metalness: 0.9, roughness: 0.2,  color: '#2A3535', envMapIntensity: 1.0 } as const
const greenGlow = { color: '#00FF88', emissive: '#00FF88', emissiveIntensity: 8, toneMapped: false } as const
const greenDim  = { color: '#00DD66', emissive: '#00DD66', emissiveIntensity: 3, toneMapped: false } as const

// Organic cable helper
function Cable({ from, to, radius = 0.012 }: { from: [number,number,number]; to: [number,number,number]; radius?: number }) {
  const dir = new THREE.Vector3(...to).sub(new THREE.Vector3(...from))
  const len = dir.length()
  const mid: [number,number,number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ]
  const quat = new THREE.Quaternion()
  quat.setFromUnitVectors(new THREE.Vector3(0,1,0), dir.clone().normalize())
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, len, 5]} />
      <meshStandardMaterial metalness={0.7} roughness={0.6} color="#0A0A0A" />
    </mesh>
  )
}

// Pulsing MR on chest
function ChestMR() {
  const glowRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!glowRef.current) return
    const m = glowRef.current.material as THREE.MeshStandardMaterial
    m.emissiveIntensity = 3 + Math.sin(clock.elapsedTime * 2) * 1.5
  })
  return (
    <group position={[0, -0.80, 0.30]}>
      <mesh ref={glowRef}>
        <planeGeometry args={[0.22, 0.10]} />
        <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={3} transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <Text position={[0,0,0.008]} fontSize={0.09} color="#00FF88" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        MR
      </Text>
    </group>
  )
}

// Alien biomech head
function AlienHead({ mx, my }: { mx: number; my: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mx * 0.65, 0.07)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -my * 0.32, 0.07)
  })

  return (
    <group ref={ref}>
      {/* Skull — dark, elongated */}
      <RoundedBox args={[0.58, 0.95, 0.52]} radius={0.06} smoothness={8} position={[0, 0.06, 0]}>
        <meshPhysicalMaterial {...bio} clearcoat={0.3} clearcoatRoughness={0.6} />
      </RoundedBox>
      {/* Forehead plate — lighter accent */}
      <RoundedBox args={[0.42, 0.28, 0.06]} radius={0.03} smoothness={4} position={[0, 0.26, 0.25]}>
        <meshPhysicalMaterial {...bioLight} clearcoat={0.5} />
      </RoundedBox>
      {/* Visor */}
      <mesh position={[0, 0.08, 0.28]}>
        <boxGeometry args={[0.48, 0.11, 0.015]} />
        <meshPhysicalMaterial color="#001208" metalness={0.95} roughness={0.0} />
      </mesh>
      {/* Eyes — narrow green slits */}
      <mesh position={[-0.14, 0.08, 0.30]}>
        <boxGeometry args={[0.08, 0.028, 0.008]} />
        <meshStandardMaterial {...greenGlow} />
      </mesh>
      <mesh position={[0.14, 0.08, 0.30]}>
        <boxGeometry args={[0.08, 0.028, 0.008]} />
        <meshStandardMaterial {...greenGlow} />
      </mesh>
      {/* Jaw — angular, lower */}
      <RoundedBox args={[0.50, 0.20, 0.46]} radius={0.04} smoothness={5} position={[0, -0.45, 0]}>
        <meshPhysicalMaterial {...bioMid} />
      </RoundedBox>
      {/* Jaw vent slits */}
      {([-0.12, 0, 0.12] as number[]).map((x, i) => (
        <mesh key={i} position={[x, -0.44, 0.24]}>
          <boxGeometry args={[0.04, 0.045, 0.008]} />
          <meshStandardMaterial color="#00AA55" emissive="#00AA55" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ))}
      {/* Side armor plates */}
      {([-1, 1] as number[]).map((s, i) => (
        <group key={i}>
          <RoundedBox args={[0.07, 0.52, 0.38]} radius={0.025} smoothness={4} position={[s * 0.32, 0.10, 0]}>
            <meshPhysicalMaterial {...bioMid} />
          </RoundedBox>
          <mesh position={[s * 0.36, 0.12, 0.18]}>
            <boxGeometry args={[0.006, 0.28, 0.006]} />
            <meshStandardMaterial {...greenDim} />
          </mesh>
        </group>
      ))}
      {/* Back crest */}
      <RoundedBox args={[0.06, 0.60, 0.18]} radius={0.025} smoothness={4} position={[0, 0.28, -0.22]} rotation={[0.25,0,0]}>
        <meshPhysicalMaterial {...bioLight} />
      </RoundedBox>
      <mesh position={[0, 0.44, -0.30]} rotation={[0.25,0,0]}>
        <boxGeometry args={[0.003, 0.40, 0.003]} />
        <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      {/* Antenna nub */}
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.010, 0.014, 0.18, 6]} />
        <meshPhysicalMaterial {...bioMid} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <sphereGeometry args={[0.030, 12, 12]} />
        <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={10} toneMapped={false} />
      </mesh>
    </group>
  )
}

// Dark alien leg
function Leg({ side }: { side: -1 | 1 }) {
  const x = side * 0.21
  return (
    <group position={[x, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshPhysicalMaterial {...bioLight} clearcoat={0.3} />
      </mesh>
      {/* Upper */}
      <RoundedBox args={[0.17, 0.78, 0.18]} radius={0.05} smoothness={5} position={[0, -0.52, 0]}>
        <meshPhysicalMaterial {...bio} />
      </RoundedBox>
      {/* Thigh armor */}
      <RoundedBox args={[0.13, 0.38, 0.22]} radius={0.03} smoothness={4} position={[side * -0.05, -0.46, 0.04]}>
        <meshPhysicalMaterial {...bioMid} />
      </RoundedBox>
      {/* Knee */}
      <mesh position={[0, -0.96, 0]}>
        <sphereGeometry args={[0.10, 12, 12]} />
        <meshPhysicalMaterial {...bioLight} clearcoat={0.3} />
      </mesh>
      {/* Shin */}
      <RoundedBox args={[0.14, 0.78, 0.16]} radius={0.045} smoothness={5} position={[0, -1.44, 0]}>
        <meshPhysicalMaterial {...bio} />
      </RoundedBox>
      {/* Shin green stripe */}
      <mesh position={[side * -0.06, -1.44, 0.07]}>
        <boxGeometry args={[0.004, 0.48, 0.004]} />
        <meshStandardMaterial {...greenDim} />
      </mesh>
      {/* Ankle */}
      <mesh position={[0, -1.88, 0]}>
        <sphereGeometry args={[0.078, 10, 10]} />
        <meshPhysicalMaterial {...bioMid} />
      </mesh>
      {/* Foot */}
      <RoundedBox args={[0.18, 0.07, 0.38]} radius={0.03} smoothness={4} position={[0, -1.99, 0.07]}>
        <meshPhysicalMaterial {...bio} />
      </RoundedBox>
      {/* Claws */}
      {([0.14, 0.02, -0.10] as number[]).map((tz, ci) => (
        <mesh key={ci} position={[0, -2.03, 0.22 + tz]} rotation={[0.28, 0, 0]}>
          <coneGeometry args={[0.018, 0.11, 5]} />
          <meshPhysicalMaterial {...bioLight} />
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
    if (leftArm.current) {
      leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, -my * 0.3 + Math.sin(t * 0.7) * 0.055, 0.06)
      leftArm.current.rotation.z = THREE.MathUtils.lerp(leftArm.current.rotation.z, mx * 0.18, 0.06)
    }
    if (rightArm.current) {
      rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, -my * 0.3 - Math.sin(t * 0.7) * 0.055, 0.06)
      rightArm.current.rotation.z = THREE.MathUtils.lerp(rightArm.current.rotation.z, mx * 0.18, 0.06)
    }
  })

  return (
    <group ref={bodyRef}>
      {/* Head */}
      <group position={[0, 0.26, 0]}>
        <AlienHead mx={mx} my={my} />
      </group>

      {/* Neck segments */}
      {([0, -0.07, -0.14] as number[]).map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.065 + i*0.008, 0.080 + i*0.008, 0.065, 8]} />
          <meshPhysicalMaterial {...bioMid} />
        </mesh>
      ))}

      {/* Cables on neck */}
      <Cable from={[-0.06, 0, 0.08]} to={[-0.10, -0.20, 0.06]} />
      <Cable from={[0.06, 0, 0.08]}  to={[0.10, -0.20, 0.06]} />

      {/* Torso — dark bio */}
      <RoundedBox args={[0.80, 1.52, 0.54]} radius={0.07} smoothness={6} position={[0, -0.94, 0]}>
        <meshPhysicalMaterial {...bio} clearcoat={0.2} clearcoatRoughness={0.7} />
      </RoundedBox>

      {/* Chest armor layer */}
      <RoundedBox args={[0.62, 0.82, 0.06]} radius={0.04} smoothness={5} position={[0, -0.86, 0.28]}>
        <meshPhysicalMaterial {...bioMid} />
      </RoundedBox>

      {/* Chest dark panel */}
      <RoundedBox args={[0.42, 0.56, 0.032]} radius={0.035} smoothness={4} position={[0, -0.80, 0.31]}>
        <meshPhysicalMaterial color="#020808" metalness={0.9} roughness={0.0} />
      </RoundedBox>

      {/* LED strips */}
      <mesh position={[0, -0.60, 0.315]}>
        <boxGeometry args={[0.24, 0.012, 0.004]} />
        <meshStandardMaterial color="#FF5500" emissive="#FF5500" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.00, 0.315]}>
        <boxGeometry args={[0.24, 0.012, 0.004]} />
        <meshStandardMaterial {...greenDim} />
      </mesh>

      <ChestMR />

      {/* Side rib plates */}
      {([-1, 1] as number[]).map((s, i) => (
        <group key={i}>
          <RoundedBox args={[0.08, 0.92, 0.50]} radius={0.03} smoothness={4} position={[s * 0.44, -0.90, 0]}>
            <meshPhysicalMaterial {...bioMid} />
          </RoundedBox>
          {/* Rib lines */}
          {([-0.28, -0.10, 0.08, 0.26] as number[]).map((y2, ri) => (
            <mesh key={ri} position={[s * 0.45, -0.90 + y2, 0.24]}>
              <boxGeometry args={[0.005, 0.008, 0.28]} />
              <meshStandardMaterial color="#003322" emissive="#003322" emissiveIntensity={1} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Spine cable back */}
      <mesh position={[0, -0.94, -0.28]}>
        <boxGeometry args={[0.006, 1.2, 0.006]} />
        <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={4} toneMapped={false} />
      </mesh>

      {/* Shoulder caps */}
      {([-1, 1] as number[]).map((s, i) => (
        <mesh key={i} position={[s * 0.50, -0.44, 0]}>
          <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          <meshPhysicalMaterial {...bioLight} side={THREE.BackSide} />
        </mesh>
      ))}

      {/* Waist */}
      <mesh position={[0, -1.42, 0]}>
        <torusGeometry args={[0.31, 0.022, 8, 28]} />
        <meshPhysicalMaterial {...bioLight} />
      </mesh>

      {/* LEFT ARM */}
      <group ref={leftArm} position={[-0.55, -0.80, 0]}>
        <RoundedBox args={[0.17, 0.50, 0.17]} radius={0.055} smoothness={5} position={[0, -0.04, 0]}>
          <meshPhysicalMaterial {...bio} />
        </RoundedBox>
        {/* Arm armor */}
        <RoundedBox args={[0.12, 0.28, 0.20]} radius={0.03} smoothness={4} position={[-0.05, -0.06, 0.02]}>
          <meshPhysicalMaterial {...bioMid} />
        </RoundedBox>
        <mesh position={[0, -0.36, 0]}>
          <sphereGeometry args={[0.105, 12, 12]} />
          <meshPhysicalMaterial {...bioLight} clearcoat={0.3} />
        </mesh>
        <RoundedBox args={[0.15, 0.44, 0.15]} radius={0.05} smoothness={5} position={[0, -0.66, 0]}>
          <meshPhysicalMaterial {...bioMid} />
        </RoundedBox>
        <mesh position={[-0.07, -0.66, 0.07]}>
          <boxGeometry args={[0.004, 0.28, 0.004]} />
          <meshStandardMaterial {...greenDim} />
        </mesh>
        <mesh position={[0, -0.94, 0]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshPhysicalMaterial {...bioMid} />
        </mesh>
        {/* Hand + claws */}
        <mesh position={[0, -1.06, 0]}>
          <sphereGeometry args={[0.075, 10, 10]} />
          <meshPhysicalMaterial {...bio} />
        </mesh>
        {([[-0.055, -1.17, 0.02], [0, -1.19, 0.04], [0.055, -1.17, 0.02]] as [number,number,number][]).map((p, ci) => (
          <mesh key={ci} position={p} rotation={[-0.2,0,0]}>
            <coneGeometry args={[0.014, 0.09, 5]} />
            <meshPhysicalMaterial {...bioLight} />
          </mesh>
        ))}
        <Cable from={[0, -0.2, 0.06]} to={[0.08, -0.55, 0.10]} radius={0.010} />
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArm} position={[0.55, -0.80, 0]}>
        <RoundedBox args={[0.17, 0.50, 0.17]} radius={0.055} smoothness={5} position={[0, -0.04, 0]}>
          <meshPhysicalMaterial {...bio} />
        </RoundedBox>
        <RoundedBox args={[0.12, 0.28, 0.20]} radius={0.03} smoothness={4} position={[0.05, -0.06, 0.02]}>
          <meshPhysicalMaterial {...bioMid} />
        </RoundedBox>
        <mesh position={[0, -0.36, 0]}>
          <sphereGeometry args={[0.105, 12, 12]} />
          <meshPhysicalMaterial {...bioLight} clearcoat={0.3} />
        </mesh>
        <RoundedBox args={[0.15, 0.44, 0.15]} radius={0.05} smoothness={5} position={[0, -0.66, 0]}>
          <meshPhysicalMaterial {...bioMid} />
        </RoundedBox>
        <mesh position={[0.07, -0.66, 0.07]}>
          <boxGeometry args={[0.004, 0.28, 0.004]} />
          <meshStandardMaterial {...greenDim} />
        </mesh>
        <mesh position={[0, -0.94, 0]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshPhysicalMaterial {...bioMid} />
        </mesh>
        <mesh position={[0, -1.06, 0]}>
          <sphereGeometry args={[0.075, 10, 10]} />
          <meshPhysicalMaterial {...bio} />
        </mesh>
        {([[-0.055, -1.17, 0.02], [0, -1.19, 0.04], [0.055, -1.17, 0.02]] as [number,number,number][]).map((p, ci) => (
          <mesh key={ci} position={p} rotation={[-0.2,0,0]}>
            <coneGeometry args={[0.014, 0.09, 5]} />
            <meshPhysicalMaterial {...bioLight} />
          </mesh>
        ))}
        <Cable from={[0, -0.2, 0.06]} to={[-0.08, -0.55, 0.10]} radius={0.010} />
      </group>

      {/* Hips */}
      <RoundedBox args={[0.58, 0.16, 0.42]} radius={0.05} smoothness={5} position={[0, -1.58, 0]}>
        <meshPhysicalMaterial {...bioMid} />
      </RoundedBox>

      {/* Legs */}
      <group position={[0, -1.72, 0]}>
        <Leg side={-1} />
        <Leg side={1} />
      </group>
    </group>
  )
}

function Scene({ mx, my }: { mx: number; my: number }) {
  return (
    <>
      <Environment preset="warehouse" background={false} />

      <ambientLight intensity={0.08} />
      <pointLight position={[3, 5, 4]}   intensity={4}   color="#ffffff" />
      <pointLight position={[-3, 1, 3]}  intensity={1.5} color="#00FF88" />
      <pointLight position={[0, -3, 3]}  intensity={0.8} color="#004422" />
      <spotLight  position={[0, 8, 2]}   angle={0.25} penumbra={0.9} intensity={5} color="#ffffff" />

      <Float speed={1.1} rotationIntensity={0.02} floatIntensity={0.20}>
        <group position={[0, 0.95, 0]}>
          <RobotBody mx={mx} my={my} />
        </group>
      </Float>

      {/* Dark shadow only — NO color, so no green rectangle */}
      <ContactShadows position={[0, -2.2, 0]} opacity={0.55} scale={3.5} blur={2} color="#000000" />

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.85} intensity={1.6} mipmapBlur />
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
      camera={{ position: [0, 0, 8.2], fov: 44 }}
      gl={{
        alpha: true, antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene mx={mouse.x} my={mouse.y} />
      </Suspense>
    </Canvas>
  )
}
