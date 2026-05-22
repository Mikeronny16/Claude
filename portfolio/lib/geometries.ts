export const PARTICLE_COUNT = 7000

export function generateSphere(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)

    // 80% on sphere shell, 20% scattered outward for "corona" feel
    const isCoreona = Math.random() < 0.2
    const r = isCoreona
      ? 2.4 + Math.random() * 1.6       // scattered corona  2.4–4.0
      : 2.0 + (Math.random() - 0.5) * 0.4  // main shell ±0.2

    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  return pos
}

export function generateFibers(count: number): Float32Array {
  const pos      = new Float32Array(count * 3)
  const FIBERS   = 28
  const perFiber = Math.floor(count / FIBERS)

  for (let f = 0; f < FIBERS; f++) {
    const angle = (f / FIBERS) * Math.PI * 2
    const baseR = 1.2 + Math.random() * 1.2
    const bx    = Math.cos(angle) * baseR
    const bz    = Math.sin(angle) * baseR
    const twist = (Math.random() - 0.5) * 4

    for (let p = 0; p < perFiber; p++) {
      const idx = (f * perFiber + p) * 3
      const t   = p / perFiber
      const scatter = Math.random() * 0.18
      pos[idx]     = bx + Math.sin(t * Math.PI * 4 + twist) * 0.14 + (Math.random() - 0.5) * scatter
      pos[idx + 1] = (t - 0.5) * 6.0  + (Math.random() - 0.5) * 0.1
      pos[idx + 2] = bz + Math.cos(t * Math.PI * 4 + twist) * 0.14 + (Math.random() - 0.5) * scatter
    }
  }

  const done = FIBERS * perFiber
  for (let i = done; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 4
    pos[i * 3 + 1] = (Math.random() - 0.5) * 6
    pos[i * 3 + 2] = (Math.random() - 0.5) * 4
  }
  return pos
}

export function generateTorus(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  const R   = 2.4
  const r   = 0.75

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.random() * Math.PI * 2

    // 15% corona particles scattered away from the tube
    const isCorona = Math.random() < 0.15
    const rVar = isCorona
      ? r + 0.6 + Math.random() * 0.8
      : r * (0.7 + Math.random() * 0.6)

    pos[i * 3]     = (R + rVar * Math.cos(phi)) * Math.cos(theta)
    pos[i * 3 + 1] = rVar * Math.sin(phi)
    pos[i * 3 + 2] = (R + rVar * Math.cos(phi)) * Math.sin(theta)
  }
  return pos
}
