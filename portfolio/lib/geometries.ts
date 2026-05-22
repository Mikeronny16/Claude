export const PARTICLE_COUNT     = 800
export const SPIKE_COUNT        = 30
export const POINTS_PER_SPIKE   = 16
const SPHERE_R = 2.2

export function generateSizes(count: number): Float32Array {
  const s = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const r = Math.random()
    s[i] = r < 0.65 ? 0.5 + Math.random() * 0.6
         : r < 0.90 ? 1.1 + Math.random() * 0.7
         :             1.8 + Math.random() * 0.4
  }
  return s
}

export function generateSphere(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = SPHERE_R + (Math.random() - 0.5) * 0.05
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  return pos
}

// Spikes as point clouds — each spike = POINTS_PER_SPIKE dots from base to tip
// Points grow outward as scatter increases — visible on mobile (no linewidth issue)
export function generateSpikePoints(spikeCount: number, ptsPerSpike: number) {
  const total      = spikeCount * ptsPerSpike
  const positions  = new Float32Array(total * 3)
  const directions = new Float32Array(total * 3)
  const lengths    = new Float32Array(total)
  const speeds     = new Float32Array(total)
  const tValues    = new Float32Array(total)   // 0=base  1=tip

  for (let s = 0; s < spikeCount; s++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)

    const nx = Math.sin(phi) * Math.cos(theta)
    const ny = Math.sin(phi) * Math.sin(theta)
    const nz = Math.cos(phi)
    const bx = nx * SPHERE_R
    const by = ny * SPHERE_R
    const bz = nz * SPHERE_R

    const maxLen = 1.0 + Math.random() * 2.4
    const spd    = 0.5 + Math.random() * 1.2

    for (let p = 0; p < ptsPerSpike; p++) {
      const idx = s * ptsPerSpike + p
      const t   = p / (ptsPerSpike - 1)   // 0 → 1 along spike

      positions[idx * 3]     = bx
      positions[idx * 3 + 1] = by
      positions[idx * 3 + 2] = bz
      directions[idx * 3]     = nx
      directions[idx * 3 + 1] = ny
      directions[idx * 3 + 2] = nz
      lengths[idx]  = maxLen
      speeds[idx]   = spd
      tValues[idx]  = t
    }
  }

  return { positions, directions, lengths, speeds, tValues }
}

// kept for TS compat
export function generateFibers(_count: number): Float32Array { return new Float32Array(0) }
export function generateTorus(_count: number):  Float32Array { return new Float32Array(0) }
export function generateSpikes(_count: number) {
  return { positions: new Float32Array(0), directions: new Float32Array(0),
           lengths: new Float32Array(0), speeds: new Float32Array(0), tipFlags: new Float32Array(0) }
}
