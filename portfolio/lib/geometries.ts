export const PARTICLE_COUNT = 8000

// Random per-particle sizes for star variation (0.4 → 2.2)
export function generateSizes(count: number): Float32Array {
  const s = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    // most stars small, few bright/large — realistic starfield distribution
    const r = Math.random()
    s[i] = r < 0.7 ? 0.4 + Math.random() * 0.5       // dim stars  (70%)
         : r < 0.93 ? 1.0 + Math.random() * 0.7        // mid stars  (23%)
         :             1.8 + Math.random() * 0.4         // bright stars (7%)
  }
  return s
}

export function generateSphere(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = 2.0 + (Math.random() - 0.5) * 0.12
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  return pos
}

export function generateFibers(count: number): Float32Array {
  const pos      = new Float32Array(count * 3)
  const FIBERS   = 22
  const perFiber = Math.floor(count / FIBERS)

  for (let f = 0; f < FIBERS; f++) {
    const angle = (f / FIBERS) * Math.PI * 2
    const baseR = 1.2 + Math.random() * 0.95
    const bx    = Math.cos(angle) * baseR
    const bz    = Math.sin(angle) * baseR
    const twist = (Math.random() - 0.5) * 3

    for (let p = 0; p < perFiber; p++) {
      const idx = (f * perFiber + p) * 3
      const t   = p / perFiber
      pos[idx]     = bx + Math.sin(t * Math.PI * 4 + twist) * 0.09
      pos[idx + 1] = (t - 0.5) * 5.8
      pos[idx + 2] = bz + Math.cos(t * Math.PI * 4 + twist) * 0.09
    }
  }
  const done = FIBERS * perFiber
  for (let i = done; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const r     = 0.8 + Math.random() * 1.6
    pos[i * 3]     = Math.cos(angle) * r
    pos[i * 3 + 1] = (Math.random() - 0.5) * 5.8
    pos[i * 3 + 2] = Math.sin(angle) * r
  }
  return pos
}

export function generateTorus(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  const R   = 2.15
  const r   = 0.6

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.random() * Math.PI * 2
    const rVar  = r * (0.7 + Math.random() * 0.6)
    pos[i * 3]     = (R + rVar * Math.cos(phi)) * Math.cos(theta)
    pos[i * 3 + 1] = rVar * Math.sin(phi)
    pos[i * 3 + 2] = (R + rVar * Math.cos(phi)) * Math.sin(theta)
  }
  return pos
}
