'use client'

import { useRef, useMemo, useEffect, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PARTICLE_COUNT, generateSphere, generateFibers, generateTorus } from '@/lib/geometries'

// ─── GLSL ────────────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
  uniform float u_p1;
  uniform float u_p2;
  uniform float u_time;
  uniform float u_size;

  attribute vec3 a_posFibers;
  attribute vec3 a_posTorus;

  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    vec3 pos = position;
    pos = mix(pos, a_posFibers, u_p1);
    pos = mix(pos, a_posTorus,  u_p2);

    // subtle breathing float — small displacement only
    float wave = sin(u_time * 0.6 + position.x * 1.8 + position.z * 1.3) * 0.025;
    float sway = cos(u_time * 0.4 + position.z * 2.2) * 0.018;
    pos.y += wave;
    pos.x += sway;

    vec4 mvPos   = modelViewMatrix * vec4(pos, 1.0);
    // small, crisp points — NOT big blobs
    gl_PointSize = u_size * (180.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;

    // color transition: cyan → white → violet
    vec3 cyan   = vec3(0.0,  0.82, 1.0);
    vec3 white  = vec3(0.88, 0.96, 1.0);
    vec3 violet = vec3(0.65, 0.50, 1.0);

    vec3 col = mix(cyan, white, u_p1);
    col      = mix(col, violet, u_p2);
    v_color  = col;
    v_alpha  = 0.85;
  }
`

const FRAG = /* glsl */ `
  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    vec2  uv = gl_PointCoord * 2.0 - 1.0;
    float r  = dot(uv, uv);
    if (r > 1.0) discard;

    // tight hot core + very subtle halo — looks like a small star, NOT a blob
    float core = exp(-r * 7.0);
    float halo = exp(-r * 2.5) * 0.25;
    float alpha = (core + halo) * v_alpha;

    gl_FragColor = vec4(v_color * (0.6 + core * 0.7), alpha);
  }
`

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  progressRef: MutableRefObject<number>
}

export function ParticleMorph({ progressRef }: Props) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef    = useRef<THREE.ShaderMaterial>(null)
  const geoRef    = useRef<THREE.BufferGeometry>(null)

  const { sphere, fibers, torus } = useMemo(() => ({
    sphere: generateSphere(PARTICLE_COUNT),
    fibers: generateFibers(PARTICLE_COUNT),
    torus:  generateTorus(PARTICLE_COUNT),
  }), [])

  useEffect(() => {
    const geo = geoRef.current
    if (!geo) return
    geo.setAttribute('a_posFibers', new THREE.BufferAttribute(fibers, 3))
    geo.setAttribute('a_posTorus',  new THREE.BufferAttribute(torus, 3))
    return () => { geo.dispose() }
  }, [fibers, torus])

  const uniforms = useMemo(() => ({
    u_p1:   { value: 0 },
    u_p2:   { value: 0 },
    u_time: { value: 0 },
    u_size: { value: 1.8 },   // smaller base size
  }), [])

  useFrame(({ clock }) => {
    if (!matRef.current || !pointsRef.current) return

    const p  = Math.max(0, Math.min(1, progressRef.current))
    const p1 = Math.min(1, p * 2)
    const p2 = Math.max(0, p * 2 - 1)

    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    matRef.current.uniforms.u_p1.value   = ease(p1)
    matRef.current.uniforms.u_p2.value   = ease(p2)
    matRef.current.uniforms.u_time.value = clock.elapsedTime

    pointsRef.current.rotation.y = clock.elapsedTime * 0.04
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[sphere, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
