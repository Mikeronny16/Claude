export const PARTICLE_COUNT = 4500
export const SPIKE_COUNT   = 55
const SPHERE_R = 2.2

export function generateSizes(count: number): Float32Array {
  const s = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const r = Math.random()
    s[i] = r < 0.65 ? 0.4 + Math.random() * 0.5
         : r < 0.90 ? 1.0 + Math.random() * 0.8
         :             1.9 + Math.random() * 0.4
  }
  return s
}

export function generateSphere(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = SPHERE_R + (Math.random() - 0.5) * 0.06
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  return pos
}

// Each spike = 2 vertices (base + tip) — drawn as LineSegments
export function generateSpikes(count: number) {
  const positions  = new Float32Array(count * 2 * 3)
  const directions = new Float32Array(count * 2 * 3)
  const lengths    = new Float32Array(count * 2)
  const speeds     = new Float32Array(count * 2)
  const tipFlags   = new Float32Array(count * 2)   // 0=base  1=tip

  for (let s = 0; s < count; s++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)

    const nx = Math.sin(phi) * Math.cos(theta)
    const ny = Math.sin(phi) * Math.sin(theta)
    const nz = Math.cos(phi)
    const bx = nx * SPHERE_R, by = ny * SPHERE_R, bz = nz * SPHERE_R

    const maxLen = 1.0 + Math.random() * 2.5
    const spd    = 0.5 + Math.random() * 1.1

    const v0 = s * 2, v1 = s * 2 + 1

    for (const v of [v0, v1]) {
      positions[v * 3]     = bx
      positions[v * 3 + 1] = by
      positions[v * 3 + 2] = bz
      directions[v * 3]     = nx
      directions[v * 3 + 1] = ny
      directions[v * 3 + 2] = nz
      lengths[v] = maxLen
      speeds[v]  = spd
    }
    tipFlags[v0] = 0   // base vertex stays on sphere
    tipFlags[v1] = 1   // tip vertex moves outward in shader
  }

  return { positions, directions, lengths, speeds, tipFlags }
}

// kept for TS compat — fibers/torus no longer used in new version
export function generateFibers(_count: number): Float32Array { return new Float32Array(0) }
export function generateTorus(_count: number):  Float32Array { return new Float32Array(0) }
