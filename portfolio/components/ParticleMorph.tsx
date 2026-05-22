'use client'

import { useRef, useMemo, useEffect, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  PARTICLE_COUNT,
  SPIKE_COUNT,
  POINTS_PER_SPIKE,
  generateSizes,
  generateSphere,
  generateSpikePoints,
} from '@/lib/geometries'

// ─── Particle shader (sphere → scatter) ──────────────────────────────────────

const PARTICLE_VERT = /* glsl */ `
  uniform float u_scatter;
  uniform float u_time;
  uniform float u_size;
  attribute float a_size;
  varying vec3  v_color;
  varying float v_alpha;

  float hash3(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  void main() {
    float h = hash3(position);

    float threshold    = h * 0.45;
    float localScatter = clamp((u_scatter - threshold) / max(0.001, 1.0 - threshold), 0.0, 1.0);
    localScatter = localScatter * localScatter;

    vec3 dir  = normalize(position);
    float dist = 1.5 + h * 4.0;
    vec3 pos  = position + dir * localScatter * dist;

    float spd = 0.4 + h * 0.7;
    pos.y += sin(u_time * spd       + h * 6.28) * 0.016;
    pos.x += cos(u_time * spd * 0.7 + h * 3.14) * 0.011;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = a_size * u_size * (12.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;

    float hc = hash3(position.yzx);
    vec3 restCol    = mix(vec3(0.85,0.95,1.00), vec3(1.00,1.00,1.00), hc);
    vec3 scatterCol = vec3(1.00, 0.70, 0.25);
    v_color = mix(restCol, scatterCol, localScatter * 0.7);

    float twinkle = 0.70 + 0.30 * sin(u_time * (1.2 + h * 3.5) + h * 6.28);
    v_alpha = twinkle * (0.80 + step(1.0, a_size) * 0.18) * (1.0 - localScatter * 0.35);
  }
`

const PARTICLE_FRAG = /* glsl */ `
  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    vec2  uv = gl_PointCoord * 2.0 - 1.0;
    float r  = dot(uv, uv);
    if (r > 1.0) discard;

    float core = exp(-r * 12.0);
    if (core < 0.012) discard;

    gl_FragColor = vec4(v_color, core * v_alpha);
  }
`

// ─── Spike point shader (points along spike path) ────────────────────────────
// Uses points instead of LineSegments → visible on mobile (no linewidth limit)

const SPIKE_VERT = /* glsl */ `
  uniform float u_scatter;
  uniform float u_time;
  attribute vec3  a_dir;
  attribute float a_maxLen;
  attribute float a_speed;
  attribute float a_t;       // 0=base  1=tip

  varying float v_t;
  varying float v_alpha;

  void main() {
    float raw    = clamp(u_scatter * a_speed * 1.6, 0.0, 1.0);
    float growth = raw * raw;

    // this point only shows once the growth front has passed it
    float visible = smoothstep(a_t - 0.06, a_t + 0.06, growth);

    vec3 pos = position + a_dir * a_t * a_maxLen;

    // subtle tip pulse
    pos += a_dir * a_t * 0.03 * sin(u_time * 3.5 + a_maxLen * 4.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    // base=big, tip=small; invisible until growth reaches
    float sz = mix(5.0, 2.0, a_t) * visible;
    gl_PointSize = sz * (50.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;

    v_t     = a_t;
    v_alpha = visible;
  }
`

const SPIKE_FRAG = /* glsl */ `
  varying float v_t;
  varying float v_alpha;

  void main() {
    if (v_alpha < 0.01) discard;

    vec2  uv = gl_PointCoord * 2.0 - 1.0;
    float r  = dot(uv, uv);
    if (r > 1.0) discard;

    float core = exp(-r * 8.0);
    if (core < 0.02) discard;

    // deep orange base → bright gold tip
    vec3 col = mix(
      vec3(1.00, 0.32, 0.04),   // orange
      vec3(1.00, 0.92, 0.50),   // gold-white
      v_t * v_t
    );

    float alpha = core * (0.95 - v_t * 0.4) * v_alpha;
    gl_FragColor = vec4(col, alpha);
  }
`

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  progressRef: MutableRefObject<number>
}

export function ParticleMorph({ progressRef }: Props) {
  const groupRef       = useRef<THREE.Group>(null)
  const particleMatRef = useRef<THREE.ShaderMaterial>(null)
  const particleGeoRef = useRef<THREE.BufferGeometry>(null)
  const spikeMatRef    = useRef<THREE.ShaderMaterial>(null)
  const spikeGeoRef    = useRef<THREE.BufferGeometry>(null)

  const { sphere, sizes, spikes } = useMemo(() => ({
    sphere: generateSphere(PARTICLE_COUNT),
    sizes:  generateSizes(PARTICLE_COUNT),
    spikes: generateSpikePoints(SPIKE_COUNT, POINTS_PER_SPIKE),
  }), [])

  useEffect(() => {
    const geo = particleGeoRef.current
    if (!geo) return
    geo.setAttribute('a_size', new THREE.BufferAttribute(sizes, 1))
    return () => { geo.dispose() }
  }, [sizes])

  useEffect(() => {
    const geo = spikeGeoRef.current
    if (!geo) return
    geo.setAttribute('a_dir',    new THREE.BufferAttribute(spikes.directions, 3))
    geo.setAttribute('a_maxLen', new THREE.BufferAttribute(spikes.lengths,    1))
    geo.setAttribute('a_speed',  new THREE.BufferAttribute(spikes.speeds,     1))
    geo.setAttribute('a_t',      new THREE.BufferAttribute(spikes.tValues,    1))
    return () => { geo.dispose() }
  }, [spikes])

  const particleUniforms = useMemo(() => ({
    u_scatter: { value: 0 },
    u_time:    { value: 0 },
    u_size:    { value: 1.2 },
  }), [])

  const spikeUniforms = useMemo(() => ({
    u_scatter: { value: 0 },
    u_time:    { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    if (!particleMatRef.current || !spikeMatRef.current || !groupRef.current) return
    const scatter = Math.max(0, Math.min(1, progressRef.current))
    const t       = clock.elapsedTime

    particleMatRef.current.uniforms.u_scatter.value = scatter
    particleMatRef.current.uniforms.u_time.value    = t
    spikeMatRef.current.uniforms.u_scatter.value    = scatter
    spikeMatRef.current.uniforms.u_time.value       = t

    groupRef.current.rotation.y = t * 0.025
    groupRef.current.rotation.x = Math.sin(t * 0.012) * 0.07
  })

  return (
    <group ref={groupRef}>

      {/* White star particles — NormalBlending = no cyan blob */}
      <points>
        <bufferGeometry ref={particleGeoRef}>
          <bufferAttribute attach="attributes-position" args={[sphere, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={particleMatRef}
          vertexShader={PARTICLE_VERT}
          fragmentShader={PARTICLE_FRAG}
          uniforms={particleUniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>

      {/* Orange spike points — AdditiveBlending for glow, works on mobile */}
      <points>
        <bufferGeometry ref={spikeGeoRef}>
          <bufferAttribute attach="attributes-position" args={[spikes.positions, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={spikeMatRef}
          vertexShader={SPIKE_VERT}
          fragmentShader={SPIKE_FRAG}
          uniforms={spikeUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

    </group>
  )
}
