export const PARTICLE_COUNT = 6000

// Uniform sphere surface — tight shell
export function generateSphere(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = 2.1 + (Math.random() - 0.5) * 0.15   // thin shell ±0.075
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  return pos
}

// Vertical fiber strands arranged in a ring
export function generateFibers(count: number): Float32Array {
  const pos      = new Float32Array(count * 3)
  const FIBERS   = 24
  const perFiber = Math.floor(count / FIBERS)

  for (let f = 0; f < FIBERS; f++) {
    const angle = (f / FIBERS) * Math.PI * 2
    const baseR = 1.3 + Math.random() * 0.9
    const bx    = Math.cos(angle) * baseR
    const bz    = Math.sin(angle) * baseR
    const twist = (Math.random() - 0.5) * 3.5

    for (let p = 0; p < perFiber; p++) {
      const idx = (f * perFiber + p) * 3
      const t   = p / perFiber
      pos[idx]     = bx + Math.sin(t * Math.PI * 4 + twist) * 0.1
      pos[idx + 1] = (t - 0.5) * 5.5
      pos[idx + 2] = bz + Math.cos(t * Math.PI * 4 + twist) * 0.1
    }
  }

  const done = FIBERS * perFiber
  for (let i = done; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const r     = 1.0 + Math.random() * 1.5
    pos[i * 3]     = Math.cos(angle) * r
    pos[i * 3 + 1] = (Math.random() - 0.5) * 5.5
    pos[i * 3 + 2] = Math.sin(angle) * r
  }
  return pos
}

// Clean torus surface
export function generateTorus(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  const R   = 2.2
  const r   = 0.65

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.random() * Math.PI * 2
    const rVar  = r * (0.75 + Math.random() * 0.5)   // tube thickness variation

    pos[i * 3]     = (R + rVar * Math.cos(phi)) * Math.cos(theta)
    pos[i * 3 + 1] = rVar * Math.sin(phi)
    pos[i * 3 + 2] = (R + rVar * Math.cos(phi)) * Math.sin(theta)
  }
  return pos
}
