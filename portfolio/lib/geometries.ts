export const PARTICLE_COUNT = 6000

export function generateSphere(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = 2.2 + (Math.random() - 0.5) * 0.2
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  return pos
}

export function generateFibers(count: number): Float32Array {
  const pos     = new Float32Array(count * 3)
  const FIBERS  = 26
  const perFiber = Math.floor(count / FIBERS)

  for (let f = 0; f < FIBERS; f++) {
    const angle = (f / FIBERS) * Math.PI * 2
    const baseR = 1.4 + Math.random() * 0.9
    const bx    = Math.cos(angle) * baseR
    const bz    = Math.sin(angle) * baseR
    const twist = (Math.random() - 0.5) * 3.5

    for (let p = 0; p < perFiber; p++) {
      const idx = (f * perFiber + p) * 3
      const t   = p / perFiber
      pos[idx]     = bx + Math.sin(t * Math.PI * 4 + twist) * 0.12
      pos[idx + 1] = (t - 0.5) * 5.5
      pos[idx + 2] = bz + Math.cos(t * Math.PI * 4 + twist) * 0.12
    }
  }

  // fill remainder
  const done = FIBERS * perFiber
  for (let i = done; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 3.5
    pos[i * 3 + 1] = (Math.random() - 0.5) * 5.5
    pos[i * 3 + 2] = (Math.random() - 0.5) * 3.5
  }
  return pos
}

export function generateTorus(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  const R   = 2.3   // major radius
  const r   = 0.7   // tube radius

  for (let i = 0; i < count; i++) {
    const theta  = Math.random() * Math.PI * 2
    const phi    = Math.random() * Math.PI * 2
    const rVar   = r * (0.8 + Math.random() * 0.4)
    pos[i * 3]     = (R + rVar * Math.cos(phi)) * Math.cos(theta)
    pos[i * 3 + 1] = rVar * Math.sin(phi)
    pos[i * 3 + 2] = (R + rVar * Math.cos(phi)) * Math.sin(theta)
  }
  return pos
}
