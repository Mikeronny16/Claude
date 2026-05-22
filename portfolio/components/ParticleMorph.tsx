'use client'

import { useRef, useMemo, useEffect, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  PARTICLE_COUNT,
  SPIKE_COUNT,
  generateSizes,
  generateSphere,
  generateSpikes,
} from '@/lib/geometries'

// ─── Particle shader — sphere that scatters outward ──────────────────────────

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

    // staggered departure: each particle waits its own threshold
    float threshold   = h * 0.5;
    float denom       = max(0.001, 1.0 - threshold);
    float localScatter = clamp((u_scatter - threshold) / denom, 0.0, 1.0);
    localScatter = localScatter * localScatter;   // ease-in

    // scatter outward along position normal + subtle drift
    vec3 dir = normalize(position);
    float travelDist = 1.2 + h * 3.5;
    vec3 pos = position + dir * localScatter * travelDist;

    // gentle alive drift
    float spd = 0.4 + h * 0.7;
    pos.y += sin(u_time * spd       + h * 6.28) * 0.018 * (1.0 - localScatter * 0.6);
    pos.x += cos(u_time * spd * 0.7 + h * 3.14) * 0.013 * (1.0 - localScatter * 0.6);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = a_size * u_size * (10.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;

    // color: cool blue-white at rest → warm orange tint as scatter
    float hc = hash3(position.yzx);
    vec3 restCol    = mix(vec3(0.80, 0.93, 1.00), vec3(1.00, 1.00, 1.00), hc);
    vec3 scatterCol = vec3(1.00, 0.65, 0.22);
    v_color = mix(restCol, scatterCol, localScatter * 0.65);

    // twinkle
    float twinkleSpd = 1.2 + h * 3.5;
    float twinkle    = 0.72 + 0.28 * sin(u_time * twinkleSpd + h * 6.28);
    v_alpha = twinkle * (0.38 + step(1.0, a_size) * 0.28)
            * (1.0 - localScatter * 0.45);
  }
`

const PARTICLE_FRAG = /* glsl */ `
  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    vec2  uv = gl_PointCoord * 2.0 - 1.0;
    float r  = dot(uv, uv);
    if (r > 1.0) discard;

    float core  = exp(-r * 14.0);
    float alpha = core * v_alpha;

    vec3 col = v_color + core * vec3(0.10, 0.12, 0.18);
    gl_FragColor = vec4(col, alpha);
  }
`

// ─── Spike shader — orange-gold fibers radiating outward ─────────────────────

const SPIKE_VERT = /* glsl */ `
  uniform float u_scatter;
  uniform float u_time;

  attribute vec3  a_dir;
  attribute float a_maxLen;
  attribute float a_speed;
  attribute float a_tip;     // 0=base, 1=tip

  varying float v_tip;
  varying float v_visible;

  void main() {
    // growth driven by scatter, sped per-spike
    float rawGrowth = clamp(u_scatter * a_speed * 1.8, 0.0, 1.0);
    float growth    = rawGrowth * rawGrowth;   // ease-in

    // base stays on sphere; tip extends along direction
    vec3 pos = position + a_dir * a_tip * a_maxLen * growth;

    // very subtle pulse on tip
    float pulse = 1.0 + 0.04 * sin(u_time * 3.0 + a_maxLen * 5.0);
    pos += a_dir * a_tip * pulse * 0.02;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    v_tip     = a_tip;
    v_visible = growth;
  }
`

const SPIKE_FRAG = /* glsl */ `
  varying float v_tip;
  varying float v_visible;

  void main() {
    if (v_visible < 0.01) discard;

    // orange core → bright gold-white tip
    vec3 baseCol = vec3(1.00, 0.30, 0.04);   // deep orange
    vec3 midCol  = vec3(1.00, 0.68, 0.12);   // amber
    vec3 tipCol  = vec3(1.00, 0.95, 0.60);   // bright gold-white

    vec3 col = v_tip < 0.5
      ? mix(baseCol, midCol, v_tip * 2.0)
      : mix(midCol,  tipCol, (v_tip - 0.5) * 2.0);

    // base is bright/opaque, tip fades
    float alpha = (0.92 - v_tip * 0.55) * min(1.0, v_visible * 4.0);

    gl_FragColor = vec4(col, alpha);
  }
`

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  progressRef: MutableRefObject<number>
}

export function ParticleMorph({ progressRef }: Props) {
  const groupRef      = useRef<THREE.Group>(null)
  const particleRef   = useRef<THREE.Points>(null)
  const particleMatRef= useRef<THREE.ShaderMaterial>(null)
  const particleGeoRef= useRef<THREE.BufferGeometry>(null)
  const spikeRef     = useRef<THREE.LineSegments>(null)
  const spikeMatRef  = useRef<THREE.ShaderMaterial>(null)
  const spikeGeoRef  = useRef<THREE.BufferGeometry>(null)

  const { sphere, sizes, spikes } = useMemo(() => ({
    sphere: generateSphere(PARTICLE_COUNT),
    sizes:  generateSizes(PARTICLE_COUNT),
    spikes: generateSpikes(SPIKE_COUNT),
  }), [])

  // Particle attributes
  useEffect(() => {
    const geo = particleGeoRef.current
    if (!geo) return
    geo.setAttribute('a_size', new THREE.BufferAttribute(sizes, 1))
    return () => { geo.dispose() }
  }, [sizes])

  // Spike attributes
  useEffect(() => {
    const geo = spikeGeoRef.current
    if (!geo) return
    geo.setAttribute('a_dir',    new THREE.BufferAttribute(spikes.directions, 3))
    geo.setAttribute('a_maxLen', new THREE.BufferAttribute(spikes.lengths,    1))
    geo.setAttribute('a_speed',  new THREE.BufferAttribute(spikes.speeds,     1))
    geo.setAttribute('a_tip',    new THREE.BufferAttribute(spikes.tipFlags,   1))
    return () => { geo.dispose() }
  }, [spikes])

  const particleUniforms = useMemo(() => ({
    u_scatter: { value: 0 },
    u_time:    { value: 0 },
    u_size:    { value: 1.0 },
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

    // slow majestic rotation
    groupRef.current.rotation.y = t * 0.025
    groupRef.current.rotation.x = Math.sin(t * 0.012) * 0.07
  })

  return (
    <group ref={groupRef}>
      {/* Particle sphere */}
      <points ref={particleRef}>
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
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Orange spike fibers — positions are consecutive base/tip pairs, no index needed */}
      <lineSegments ref={spikeRef}>
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
          linewidth={1}
        />
      </lineSegments>
    </group>
  )
}
