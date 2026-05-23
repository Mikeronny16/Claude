'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, ContactShadows, Environment, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const bio  = { metalness: 0.9, roughness: 0.6, color: '#080A0A', envMapIntensity: 0.7 } as const
const bioM = { metalness: 0.85, roughness: 0.45, color: '#141818', envMapIntensity: 0.8 } as const
const bioL = { metalness: 0.88, roughness: 0.28, color: '#222E2E', envMapIntensity: 1.0 } as const
const G    = { color: '#00FF88', emissive: '#00FF88', emissiveIntensity: 9, toneMapped: false } as const
const Gd   = { color: '#00CC66', emissive: '#00CC66', emissiveIntensity: 4, toneMapped: false } as const

function MRChest() {
  const r = useRef<THREE.Mesh>(null)
  useFrame(({ clock: c }) => {
    if (!r.current) return
    ;(r.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 3.5 + Math.sin(c.elapsedTime * 2.2) * 1.5
  })
  return (
    <group position={[0, -0.76, 0.295]}>
      <mesh ref={r}>
        <planeGeometry args={[0.20, 0.09]} />
        <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={3.5} transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <Text position={[0,0,0.007]} fontSize={0.08} color="#00FF88" anchorX="center" anchorY="middle" letterSpacing={0.14}>MR</Text>
    </group>
  )
}

function Head({ mx, my }: { mx: number; my: number }) {
  const r = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!r.current) return
    r.current.rotation.y = THREE.MathUtils.lerp(r.current.rotation.y, mx * 0.6, 0.07)
    r.current.rotation.x = THREE.MathUtils.lerp(r.current.rotation.x, -my * 0.3, 0.07)
  })
  return (
    <group ref={r}>
      {/* Smooth alien skull */}
      <RoundedBox args={[0.52, 0.88, 0.48]} radius={0.10} smoothness={10} position={[0, 0.04, 0]}>
        <meshPhysicalMaterial {...bio} clearcoat={0.4} clearcoatRoughness={0.5} />
      </RoundedBox>
      {/* Forehead narrow top */}
      <RoundedBox args={[0.36, 0.24, 0.42]} radius={0.08} smoothness={8} position={[0, 0.30, -0.02]}>
        <meshPhysicalMaterial {...bio} clearcoat={0.5} />
      </RoundedBox>
      {/* Visor */}
      <mesh position={[0, 0.06, 0.26]}>
        <boxGeometry args={[0.42, 0.09, 0.012]} />
        <meshPhysicalMaterial color="#000D06" metalness={0.95} roughness={0.0} />
      </mesh>
      {/* Eye slit glow */}
      <mesh position={[-0.12, 0.06, 0.275]}>
        <boxGeometry args={[0.07, 0.022, 0.006]} />
        <meshStandardMaterial {...G} />
      </mesh>
      <mesh position={[0.12, 0.06, 0.275]}>
        <boxGeometry args={[0.07, 0.022, 0.006]} />
        <meshStandardMaterial {...G} />
      </mesh>
      {/* Jaw */}
      <RoundedBox args={[0.44, 0.18, 0.42]} radius={0.05} smoothness={6} position={[0, -0.40, 0]}>
        <meshPhysicalMaterial {...bioM} />
      </RoundedBox>
      {/* Jaw vents */}
      {([-0.10, 0.10] as number[]).map((x,i) => (
        <mesh key={i} position={[x, -0.40, 0.22]}>
          <boxGeometry args={[0.032, 0.038, 0.006]} />
          <meshStandardMaterial color="#009944" emissive="#009944" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ))}
      {/* Side panels */}
      {([-1,1] as number[]).map((s,i) => (
        <group key={i} position={[s*0.28, 0.08, 0]}>
          <RoundedBox args={[0.06, 0.48, 0.34]} radius={0.02} smoothness={4}>
            <meshPhysicalMaterial {...bioM} />
          </RoundedBox>
          <mesh position={[s*0.02, 0, 0.17]}>
            <boxGeometry args={[0.004, 0.26, 0.004]} />
            <meshStandardMaterial {...Gd} />
          </mesh>
        </group>
      ))}
      {/* Shark fin crest */}
      <RoundedBox args={[0.055, 0.52, 0.15]} radius={0.02} smoothness={4} position={[0, 0.36, -0.16]} rotation={[0.22,0,0]}>
        <meshPhysicalMaterial {...bioL} />
      </RoundedBox>
      <mesh position={[0, 0.50, -0.22]} rotation={[0.22,0,0]}>
        <boxGeometry args={[0.003, 0.34, 0.003]} />
        <meshStandardMaterial {...G} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.54, 0]}><cylinderGeometry args={[0.009,0.013,0.16,6]} /><meshPhysicalMaterial {...bioM} /></mesh>
      <mesh position={[0, 0.63, 0]}><sphereGeometry args={[0.026,12,12]} /><meshStandardMaterial {...G} /></mesh>
    </group>
  )
}

function Leg({ s }: { s: -1|1 }) {
  return (
    <group position={[s*0.18, 0, 0]}>
      {/* Hip */}
      <mesh><sphereGeometry args={[0.10,12,12]} /><meshPhysicalMaterial {...bioL} clearcoat={0.3} /></mesh>
      {/* Thigh */}
      <RoundedBox args={[0.15, 0.76, 0.16]} radius={0.045} smoothness={5} position={[0,-0.50,0]}>
        <meshPhysicalMaterial {...bio} />
      </RoundedBox>
      {/* Thigh armor */}
      <RoundedBox args={[0.11,0.34,0.20]} radius={0.03} smoothness={4} position={[s*-0.04,-0.44,0.03]}>
        <meshPhysicalMaterial {...bioM} />
      </RoundedBox>
      {/* Knee */}
      <mesh position={[0,-0.93,0]}><sphereGeometry args={[0.09,12,12]} /><meshPhysicalMaterial {...bioL} clearcoat={0.3} /></mesh>
      {/* Shin */}
      <RoundedBox args={[0.13, 0.80, 0.15]} radius={0.042} smoothness={5} position={[0,-1.42,0]}>
        <meshPhysicalMaterial {...bio} />
      </RoundedBox>
      {/* Shin GREEN stripes — bright, like the image */}
      <mesh position={[0,-1.42,0.075]}>
        <boxGeometry args={[0.006, 0.56, 0.006]} />
        <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={12} toneMapped={false} />
      </mesh>
      <mesh position={[s*-0.055,-1.42,0.06]}>
        <boxGeometry args={[0.004, 0.38, 0.004]} />
        <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={7} toneMapped={false} />
      </mesh>
      {/* Ankle */}
      <mesh position={[0,-1.87,0]}><sphereGeometry args={[0.07,10,10]} /><meshPhysicalMaterial {...bioM} /></mesh>
      {/* Foot */}
      <RoundedBox args={[0.17,0.07,0.34]} radius={0.028} smoothness={4} position={[0,-1.97,0.06]}>
        <meshPhysicalMaterial {...bio} />
      </RoundedBox>
      {([0.13,0.01,-0.09] as number[]).map((tz,ci) => (
        <mesh key={ci} position={[0,-2.01,0.20+tz]} rotation={[0.26,0,0]}>
          <coneGeometry args={[0.016,0.10,5]} />
          <meshPhysicalMaterial {...bioL} />
        </mesh>
      ))}
    </group>
  )
}

function Body({ mx, my }: { mx: number; my: number }) {
  const body = useRef<THREE.Group>(null)
  const lArm = useRef<THREE.Group>(null)
  const rArm = useRef<THREE.Group>(null)

  useFrame(({ clock: c }) => {
    const t = c.elapsedTime
    if (body.current) body.current.rotation.z = Math.sin(t*0.5)*0.009
    if (lArm.current) {
      lArm.current.rotation.x = THREE.MathUtils.lerp(lArm.current.rotation.x, -my*0.28 + Math.sin(t*0.65)*0.05, 0.06)
      lArm.current.rotation.z = THREE.MathUtils.lerp(lArm.current.rotation.z, mx*0.16, 0.06)
    }
    if (rArm.current) {
      rArm.current.rotation.x = THREE.MathUtils.lerp(rArm.current.rotation.x, -my*0.28 - Math.sin(t*0.65)*0.05, 0.06)
      rArm.current.rotation.z = THREE.MathUtils.lerp(rArm.current.rotation.z, mx*0.16, 0.06)
    }
  })

  return (
    <group ref={body}>
      {/* Head */}
      <group position={[0,0.24,0]}><Head mx={mx} my={my} /></group>

      {/* Neck */}
      {([0,-0.07,-0.13] as number[]).map((y,i) => (
        <mesh key={i} position={[0,y,0]}>
          <cylinderGeometry args={[0.058+i*0.007,0.072+i*0.007,0.062,8]} />
          <meshPhysicalMaterial {...bioM} />
        </mesh>
      ))}

      {/* Torso — slim like image */}
      <RoundedBox args={[0.70,1.48,0.50]} radius={0.07} smoothness={8} position={[0,-0.90,0]}>
        <meshPhysicalMaterial {...bio} clearcoat={0.2} clearcoatRoughness={0.7} />
      </RoundedBox>
      {/* Chest rib armor */}
      <RoundedBox args={[0.54,0.78,0.055]} radius={0.035} smoothness={5} position={[0,-0.82,0.256]}>
        <meshPhysicalMaterial {...bioM} />
      </RoundedBox>
      {/* Chest panel dark */}
      <RoundedBox args={[0.36,0.52,0.030]} radius={0.028} smoothness={4} position={[0,-0.76,0.284]}>
        <meshPhysicalMaterial color="#010808" metalness={0.95} roughness={0.0} />
      </RoundedBox>
      {/* Orange LED */}
      <mesh position={[0,-0.90,0.298]}>
        <boxGeometry args={[0.20,0.010,0.003]} />
        <meshStandardMaterial color="#FF5500" emissive="#FF5500" emissiveIntensity={6} toneMapped={false} />
      </mesh>
      <MRChest />
      {/* Side rib lines */}
      {([-1,1] as number[]).map((s,i) => (
        <group key={i} position={[s*0.38,-0.90,0]}>
          <RoundedBox args={[0.07,0.88,0.46]} radius={0.025} smoothness={4}>
            <meshPhysicalMaterial {...bioM} />
          </RoundedBox>
          {([-0.24,-0.06,0.12,0.28] as number[]).map((y2,ri) => (
            <mesh key={ri} position={[0,-0.90+y2+0.90,0.22]}>
              <boxGeometry args={[0.004,0.007,0.22]} />
              <meshStandardMaterial color="#003322" emissive="#003322" emissiveIntensity={1} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Spine glow */}
      <mesh position={[0,-0.90,-0.26]}>
        <boxGeometry args={[0.005,1.15,0.005]} />
        <meshStandardMaterial {...G} />
      </mesh>
      {/* Waist */}
      <mesh position={[0,-1.40,0]}>
        <torusGeometry args={[0.28,0.020,8,28]} />
        <meshPhysicalMaterial {...bioL} />
      </mesh>
      {/* Shoulder balls */}
      {([-1,1] as number[]).map((s,i) => (
        <mesh key={i} position={[s*0.46,-0.44,0]}>
          <sphereGeometry args={[0.16,16,16,0,Math.PI*2,0,Math.PI*0.65]} />
          <meshPhysicalMaterial {...bioL} side={THREE.BackSide} />
        </mesh>
      ))}

      {/* LEFT ARM */}
      <group ref={lArm} position={[-0.50,-0.76,0]}>
        <RoundedBox args={[0.15,0.46,0.15]} radius={0.05} smoothness={5} position={[0,-0.04,0]}>
          <meshPhysicalMaterial {...bio} />
        </RoundedBox>
        <RoundedBox args={[0.11,0.26,0.18]} radius={0.03} smoothness={4} position={[-0.04,-0.05,0.02]}>
          <meshPhysicalMaterial {...bioM} />
        </RoundedBox>
        <mesh position={[0,-0.32,0]}><sphereGeometry args={[0.095,12,12]} /><meshPhysicalMaterial {...bioL} clearcoat={0.3} /></mesh>
        <RoundedBox args={[0.13,0.44,0.13]} radius={0.045} smoothness={5} position={[0,-0.62,0]}>
          <meshPhysicalMaterial {...bioM} />
        </RoundedBox>
        {/* Forearm green stripe */}
        <mesh position={[-0.058,-0.62,0.062]}>
          <boxGeometry args={[0.004,0.28,0.004]} />
          <meshStandardMaterial {...G} />
        </mesh>
        <mesh position={[0,-0.90,0]}><sphereGeometry args={[0.072,10,10]} /><meshPhysicalMaterial {...bioM} /></mesh>
        <mesh position={[0,-1.01,0]}><sphereGeometry args={[0.066,10,10]} /><meshPhysicalMaterial {...bio} /></mesh>
        {([[-0.05,-1.11,0.02],[0,-1.13,0.04],[0.05,-1.11,0.02]] as [number,number,number][]).map((p,ci) => (
          <mesh key={ci} position={p} rotation={[-0.18,0,0]}>
            <coneGeometry args={[0.013,0.085,5]} />
            <meshPhysicalMaterial {...bioL} />
          </mesh>
        ))}
      </group>

      {/* RIGHT ARM */}
      <group ref={rArm} position={[0.50,-0.76,0]}>
        <RoundedBox args={[0.15,0.46,0.15]} radius={0.05} smoothness={5} position={[0,-0.04,0]}>
          <meshPhysicalMaterial {...bio} />
        </RoundedBox>
        <RoundedBox args={[0.11,0.26,0.18]} radius={0.03} smoothness={4} position={[0.04,-0.05,0.02]}>
          <meshPhysicalMaterial {...bioM} />
        </RoundedBox>
        <mesh position={[0,-0.32,0]}><sphereGeometry args={[0.095,12,12]} /><meshPhysicalMaterial {...bioL} clearcoat={0.3} /></mesh>
        <RoundedBox args={[0.13,0.44,0.13]} radius={0.045} smoothness={5} position={[0,-0.62,0]}>
          <meshPhysicalMaterial {...bioM} />
        </RoundedBox>
        <mesh position={[0.058,-0.62,0.062]}>
          <boxGeometry args={[0.004,0.28,0.004]} />
          <meshStandardMaterial {...G} />
        </mesh>
        <mesh position={[0,-0.90,0]}><sphereGeometry args={[0.072,10,10]} /><meshPhysicalMaterial {...bioM} /></mesh>
        <mesh position={[0,-1.01,0]}><sphereGeometry args={[0.066,10,10]} /><meshPhysicalMaterial {...bio} /></mesh>
        {([[-0.05,-1.11,0.02],[0,-1.13,0.04],[0.05,-1.11,0.02]] as [number,number,number][]).map((p,ci) => (
          <mesh key={ci} position={p} rotation={[-0.18,0,0]}>
            <coneGeometry args={[0.013,0.085,5]} />
            <meshPhysicalMaterial {...bioL} />
          </mesh>
        ))}
      </group>

      {/* Hips */}
      <RoundedBox args={[0.52,0.15,0.38]} radius={0.048} smoothness={5} position={[0,-1.56,0]}>
        <meshPhysicalMaterial {...bioM} />
      </RoundedBox>
      {/* Legs */}
      <group position={[0,-1.68,0]}>
        <Leg s={-1} /><Leg s={1} />
      </group>
    </group>
  )
}

function Scene({ mx, my }: { mx: number; my: number }) {
  return (
    <>
      <Environment preset="warehouse" background={false} />
      <ambientLight intensity={0.06} />
      <pointLight position={[0, 6, 3]}   intensity={5}   color="#ffffff" />
      <pointLight position={[-2, 1, 3]}  intensity={1.8} color="#00FF88" />
      <pointLight position={[0, -3, 2]}  intensity={0.6} color="#005533" />
      <Float speed={1.0} rotationIntensity={0.02} floatIntensity={0.18}>
        <group position={[0, 0.95, 0]}>
          <Body mx={mx} my={my} />
        </group>
      </Float>
      <ContactShadows position={[0,-2.2,0]} opacity={0.5} scale={3} blur={2} color="#000000" />
      <EffectComposer>
        <Bloom luminanceThreshold={0.45} luminanceSmoothing={0.8} intensity={1.8} mipmapBlur />
      </EffectComposer>
    </>
  )
}

export default function RobotScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const m = (e: MouseEvent) => setMouse({ x: (e.clientX/window.innerWidth)*2-1, y: (e.clientY/window.innerHeight)*2-1 })
    const t = (e: TouchEvent) => { const t0=e.touches[0]; setMouse({ x: (t0.clientX/window.innerWidth)*2-1, y: (t0.clientY/window.innerHeight)*2-1 }) }
    window.addEventListener('mousemove', m)
    window.addEventListener('touchmove', t, { passive: true })
    return () => { window.removeEventListener('mousemove', m); window.removeEventListener('touchmove', t) }
  }, [])
  return (
    <Canvas camera={{ position: [0,0,8.0], fov: 44 }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ width:'100%', height:'100%', background:'transparent' }}>
      <Suspense fallback={null}><Scene mx={mouse.x} my={mouse.y} /></Suspense>
    </Canvas>
  )
}
