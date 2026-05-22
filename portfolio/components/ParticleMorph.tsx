'use client'

import { useRef, useMemo, useEffect, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  PARTICLE_COUNT,
  generateSizes,
  generateSphere,
  generateFibers,
  generateTorus,
} from '@/lib/geometries'

// ─── GLSL — galaxy/starfield style ───────────────────────────────────────────

const VERT = /* glsl */ `
  uniform float u_p1;
  uniform float u_p2;
  uniform float u_time;
  uniform float u_size;

  attribute vec3  a_posFibers;
  attribute vec3  a_posTorus;
  attribute float a_size;     // per-star size variation

  varying vec3  v_color;
  varying float v_alpha;

  // pseudo-random hash for per-particle twinkle rate
  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  void main() {
    vec3 pos = position;
    pos = mix(pos, a_posFibers, u_p1);
    pos = mix(pos, a_posTorus,  u_p2);

    // very gentle drift — enough to feel alive, not enough to distort shape
    float h   = hash(position);
    float spd = 0.5 + h * 0.8;
    pos.y += sin(u_time * spd       + h * 6.28) * 0.018;
    pos.x += cos(u_time * spd * 0.7 + h * 3.14) * 0.013;
    pos.z += sin(u_time * spd * 0.6 + h * 4.71) * 0.013;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

    // size attenuation — stays small even close to camera
    gl_PointSize = a_size * u_size * (14.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;

    // --- color ----------------------------------------------------------
    // mostly cool blue-white, bright stars slightly warmer
    float hc       = hash(position.yzx);
    vec3 coolWhite = vec3(0.80, 0.93, 1.00);   // cool blue-white
    vec3 pureWhite = vec3(1.00, 1.00, 1.00);
    vec3 cyanTint  = vec3(0.55, 0.90, 1.00);   // subtle cyan for cyan phase

    vec3 starCol = mix(coolWhite, pureWhite, hc);

    // morph color tint: sphere=blue-white → fibers=white → torus=violet-white
    vec3 phaseCol = mix(starCol,           vec3(0.90,0.98,1.00), u_p1);
    phaseCol      = mix(phaseCol,          vec3(0.82,0.75,1.00), u_p2);
    // add subtle cyan sparkle for large stars
    phaseCol      = mix(phaseCol, cyanTint, step(1.6, a_size) * 0.35);

    v_color = phaseCol;

    // twinkle: per-particle sinusoidal brightness
    float twinkleSpd = 1.2 + h * 3.5;
    float twinkle    = 0.72 + 0.28 * sin(u_time * twinkleSpd + h * 6.28);
    // bright stars twinkle more visibly
    v_alpha = twinkle * (0.55 + step(1.0, a_size) * 0.35);
  }
`

const FRAG = /* glsl */ `
  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    vec2  uv = gl_PointCoord * 2.0 - 1.0;
    float r  = dot(uv, uv);
    if (r > 1.0) discard;

    // hot bright core + tiny diffraction halo = real star look
    float core = exp(-r * 9.5);
    float halo = exp(-r * 2.2) * 0.14;
    float alpha = (core + halo) * v_alpha;

    // core is brightest, outer halo matches color
    vec3 col = v_color + core * vec3(0.15, 0.18, 0.22);
    gl_FragColor = vec4(col, alpha);
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

  const { sphere, fibers, torus, sizes } = useMemo(() => ({
    sphere: generateSphere(PARTICLE_COUNT),
    fibers: generateFibers(PARTICLE_COUNT),
    torus:  generateTorus(PARTICLE_COUNT),
    sizes:  generateSizes(PARTICLE_COUNT),
  }), [])

  useEffect(() => {
    const geo = geoRef.current
    if (!geo) return
    geo.setAttribute('a_posFibers', new THREE.BufferAttribute(fibers, 3))
    geo.setAttribute('a_posTorus',  new THREE.BufferAttribute(torus, 3))
    geo.setAttribute('a_size',      new THREE.BufferAttribute(sizes, 1))
    return () => { geo.dispose() }
  }, [fibers, torus, sizes])

  const uniforms = useMemo(() => ({
    u_p1:   { value: 0 },
    u_p2:   { value: 0 },
    u_time: { value: 0 },
    u_size: { value: 1.4 },   // base size — small stars
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

    // slow majestic rotation — feels like deep space
    pointsRef.current.rotation.y = clock.elapsedTime * 0.03
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.015) * 0.08
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
