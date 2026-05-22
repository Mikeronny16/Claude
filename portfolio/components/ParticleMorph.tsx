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

    // lively float — spread outward feel
    float dist  = length(position);
    float wave  = sin(u_time * 0.7  + position.x * 1.8 + position.z * 1.3) * 0.07;
    float wave2 = cos(u_time * 0.5  + position.y * 2.1 + position.x * 0.9) * 0.05;
    float drift = cos(u_time * 0.38 + position.z * 2.4) * 0.04;
    pos.y += wave  + wave2 * 0.5;
    pos.x += drift + sin(u_time * 0.3 + position.y * 1.6) * 0.03;
    pos.z += cos(u_time * 0.4 + position.x * 1.4) * 0.03;
    // corona particles drift further
    pos += normalize(position) * sin(u_time * 0.25 + dist * 2.0) * 0.04 * smoothstep(2.0, 4.0, dist);

    vec4 mvPos   = modelViewMatrix * vec4(pos, 1.0);
    // corona particles appear slightly larger
    float sizeMult = 1.0 + smoothstep(2.5, 4.0, dist) * 0.6;
    gl_PointSize = u_size * sizeMult * (300.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;

    // color: electric-cyan → white → soft-violet
    // corona particles are brighter/whiter (sparkle effect)
    float coreFac = smoothstep(2.8, 4.5, dist);
    vec3 cyan     = vec3(0.0,  0.85, 1.0);
    vec3 white    = vec3(1.0,  1.0,  1.0);
    vec3 violet   = vec3(0.7,  0.55, 1.0);
    vec3 spark    = vec3(0.9,  0.97, 1.0);  // bright sparkle white

    vec3 col = mix(cyan, white, u_p1);
    col      = mix(col, violet, u_p2);
    col      = mix(col, spark,  coreFac);   // corona → sparkle white
    v_color  = col;
    v_alpha  = mix(0.9, 0.7, coreFac);      // corona slightly more transparent
  }
`

const FRAG = /* glsl */ `
  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    vec2  uv = gl_PointCoord * 2.0 - 1.0;
    float r  = dot(uv, uv);
    if (r > 1.0) discard;

    float glow  = exp(-r * 1.8);          // wider, softer glow
    float core  = exp(-r * 6.0);          // bright hot center
    float alpha = (glow * 0.7 + core * 0.5) * clamp(v_alpha, 0.0, 1.0);
    gl_FragColor = vec4(v_color * (0.7 + core * 0.8), alpha);
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
