'use client'

import { Canvas } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { ParticleMorph } from './ParticleMorph'

interface Props {
  progressRef: MutableRefObject<number>
}

export function ParticleCanvas({ progressRef }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 55 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => gl.setClearColor('#04060e', 1)}
      dpr={[1, 1.5]}
    >
      <ParticleMorph progressRef={progressRef} />
    </Canvas>
  )
}
