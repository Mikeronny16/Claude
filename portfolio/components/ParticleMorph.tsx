'use client'

import { useRef, useMemo, useEffect, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PARTICLE_COUNT, generateSphere, generateFibers, generateTorus } from '@/lib/geometries'

// ─── GLSL ────────────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
  uniform float u_p1;    // 0 = sphere  →  1 = fibers
  uniform float u_p2;    // 0 = fibers  →  1 = torus
  uniform float u_time;
  uniform float u_size;

  attribute vec3 a_posFibers;
  attribute vec3 a_posTorus;

  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    // three-way morph: sphere → fibers → torus
    vec3 pos = position;
    pos = mix(pos, a_posFibers, u_p1);
    pos = mix(pos, a_posTorus,  u_p2);

    // gentle float / breathe
    float wave  = sin(u_time * 0.65 + position.x * 2.2 + position.z * 1.5) * 0.04;
    float drift = cos(u_time * 0.45 + position.z * 2.8) * 0.025;
    pos.y += wave;
    pos.x += drift;

    vec4 mvPos   = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = u_size * (280.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;

    // color: electric-cyan → white → soft-violet
    vec3 cyan   = vec3(0.0,  0.76, 1.0);
    vec3 white  = vec3(0.85, 0.97, 1.0);
    vec3 violet = vec3(0.62, 0.52, 1.0);

    vec3 col = mix(cyan, white, u_p1);
    col      = mix(col, violet, u_p2);
    v_color  = col;
    v_alpha  = 0.92 - length(pos) * 0.035;
  }
`

const FRAG = /* glsl */ `
  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    vec2  uv = gl_PointCoord * 2.0 - 1.0;
    float r  = dot(uv, uv);
    if (r > 1.0) discard;

    float glow  = exp(-r * 2.2);
    float alpha = glow * clamp(v_alpha, 0.0, 1.0);
    gl_FragColor = vec4(v_color * (0.75 + glow * 0.5), alpha);
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

  // set custom attributes imperatively (more reliable than JSX attach for custom names)
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
    u_size: { value: 2.2 },
  }), [])

  useFrame(({ clock }) => {
    if (!matRef.current || !pointsRef.current) return

    const p  = Math.max(0, Math.min(1, progressRef.current))
    const p1 = Math.min(1, p * 2)           // 0→1 in first half
    const p2 = Math.max(0, p * 2 - 1)       // 0→1 in second half

    // smooth easing
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    matRef.current.uniforms.u_p1.value   = ease(p1)
    matRef.current.uniforms.u_p2.value   = ease(p2)
    matRef.current.uniforms.u_time.value = clock.elapsedTime

    // slow rotation
    pointsRef.current.rotation.y = clock.elapsedTime * 0.045
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
