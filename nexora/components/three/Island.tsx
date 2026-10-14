"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ISLAND_RADIUS, type ThemeDef } from "@/lib/catalog";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Jagged rocky underside: a downward cone with noisy vertices. */
function useRockGeometry() {
  return useMemo(() => {
    const g = new THREE.ConeGeometry(ISLAND_RADIUS - 0.2, 6.5, 16, 7, true);
    g.rotateX(Math.PI);
    g.translate(0, -3.25 - 0.5, 0);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const r = seeded(7);
    const v = new THREE.Vector3();
    // Displace by angle/height so shared seam vertices move together.
    const offsets = new Map<string, [number, number]>();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
      let off = offsets.get(key);
      if (!off) {
        off = [1 + (r() - 0.5) * 0.35, (r() - 0.5) * 0.4];
        offsets.set(key, off);
      }
      const isTop = v.y > -0.6;
      pos.setXYZ(i, v.x * (isTop ? 1 : off[0]), v.y + (isTop ? 0 : off[1]), v.z * (isTop ? 1 : off[0]));
    }
    g.computeVertexNormals();
    return g;
  }, []);
}

/** Smooth pseudo-noise for color patches and gentle bumps. */
const terrainNoise = (x: number, z: number) =>
  Math.sin(x * 0.9 + 1.3) * Math.cos(z * 0.8 - 0.7) + 0.5 * Math.sin(x * 2.1 - z * 1.7) + 0.25 * Math.cos(x * 3.7 + z * 3.1);

/** Low-poly grass disc with patchy vertex colors; y = 0 is the ground. */
function useTerrainGeometry(grass: string) {
  return useMemo(() => {
    const g = new THREE.RingGeometry(0.001, ISLAND_RADIUS, 56, 9);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const base = new THREE.Color(grass);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const r = Math.hypot(x, z) / ISLAND_RADIUS;
      const n = terrainNoise(x, z);
      // Tiny bumps that fade out toward the rim so the edge stays clean.
      pos.setY(i, r < 0.97 ? n * 0.035 * (1 - r) : 0);
      c.copy(base).offsetHSL(n * 0.012, n * 0.04, n * 0.045 - r * r * 0.06);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [grass]);
}

const TUFT_COUNT = 70;
const RIM_STONES = 18;

function GroundDetail({ grass, rock }: { grass: string; rock: string }) {
  const tufts = useRef<THREE.InstancedMesh>(null);
  const stones = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const r = seeded(11);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const v = new THREE.Vector3();
    const sc = new THREE.Vector3();
    const c = new THREE.Color();
    const t = tufts.current;
    if (t) {
      for (let i = 0; i < TUFT_COUNT; i++) {
        const a = r() * Math.PI * 2;
        const d = 1.4 + Math.sqrt(r()) * (ISLAND_RADIUS - 1.8);
        const s = 0.6 + r() * 0.8;
        m.compose(v.set(Math.cos(a) * d, 0.09 * s, Math.sin(a) * d), q.setFromEuler(e.set((r() - 0.5) * 0.4, r() * 3, (r() - 0.5) * 0.4)), sc.set(s, s, s));
        t.setMatrixAt(i, m);
        t.setColorAt(i, c.set(grass).offsetHSL(0.02, 0.05, 0.06 + r() * 0.1));
      }
      t.instanceMatrix.needsUpdate = true;
      if (t.instanceColor) t.instanceColor.needsUpdate = true;
    }
    const st = stones.current;
    if (st) {
      for (let i = 0; i < RIM_STONES; i++) {
        const a = (i / RIM_STONES) * Math.PI * 2 + r() * 0.2;
        const s = 0.14 + r() * 0.16;
        m.compose(v.set(Math.cos(a) * (ISLAND_RADIUS - 0.12), s * 0.25, Math.sin(a) * (ISLAND_RADIUS - 0.12)), q.setFromEuler(e.set(r(), r() * 3, r())), sc.set(s * 1.3, s * 0.8, s));
        st.setMatrixAt(i, m);
        st.setColorAt(i, c.set(rock).offsetHSL(0, -0.05, 0.12 + r() * 0.1));
      }
      st.instanceMatrix.needsUpdate = true;
      if (st.instanceColor) st.instanceColor.needsUpdate = true;
    }
  }, [grass, rock]);
  return (
    <>
      <instancedMesh ref={tufts} args={[undefined, undefined, TUFT_COUNT]} raycast={() => null}>
        <coneGeometry args={[0.07, 0.24, 4]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh ref={stones} args={[undefined, undefined, RIM_STONES]} raycast={() => null} receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
    </>
  );
}

const DRIFT_ROCKS: { pos: [number, number, number]; size: number; speed: number }[] = [
  { pos: [8.5, -1.5, -2], size: 0.55, speed: 0.6 },
  { pos: [-8, -2.5, 3], size: 0.75, speed: 0.45 },
  { pos: [3, -4, 8.2], size: 0.45, speed: 0.8 },
  { pos: [-4, -0.8, -8.5], size: 0.5, speed: 0.7 },
  { pos: [7, 1.2, 5.5], size: 0.35, speed: 0.9 },
];

export function Island({
  theme,
  animate,
  onGroundClick,
  onGroundHover,
  shadows,
}: {
  theme: ThemeDef;
  animate: boolean;
  onGroundClick?: (local: THREE.Vector3, e: ThreeEvent<MouseEvent>) => void;
  onGroundHover?: (local: THREE.Vector3 | null) => void;
  shadows: boolean;
}) {
  const rock = useRockGeometry();
  const terrain = useTerrainGeometry(theme.grass);
  const rocks = useRef<THREE.Group>(null);
  const runes = useRef<THREE.Mesh>(null);
  const top = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!animate) return;
    const t = clock.elapsedTime;
    rocks.current?.children.forEach((c, i) => {
      const d = DRIFT_ROCKS[i];
      c.position.y = d.pos[1] + Math.sin(t * d.speed + i) * 0.35;
      c.rotation.y = t * d.speed * 0.4;
    });
    if (runes.current) runes.current.rotation.z = t * 0.15;
  });

  const toLocal = (p: THREE.Vector3) => (top.current?.parent ? top.current.parent.worldToLocal(p.clone()) : p.clone());

  return (
    <group>
      {/* Grass top: y = 0 is the ground everything stands on. */}
      <mesh
        ref={top}
        name="island-top"
        geometry={terrain}
        receiveShadow
        onClick={(e) => {
          if (!onGroundClick || e.delta > 6) return;
          e.stopPropagation();
          onGroundClick(toLocal(e.point), e);
        }}
        onPointerMove={(e) => onGroundHover?.(toLocal(e.point))}
        onPointerOut={() => onGroundHover?.(null)}
      >
        <meshStandardMaterial vertexColors roughness={0.95} flatShading />
      </mesh>
      <GroundDetail grass={theme.grass} rock={theme.rock} />
      {/* Grass edge */}
      <mesh position={[0, -0.15, 0]} raycast={() => null}>
        <cylinderGeometry args={[ISLAND_RADIUS, ISLAND_RADIUS - 0.15, 0.3, 56, 1, true]} />
        <meshStandardMaterial color={theme.grass} roughness={0.95} flatShading />
      </mesh>
      {/* Soil band */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[ISLAND_RADIUS - 0.15, ISLAND_RADIUS - 0.25, 0.5, 32]} />
        <meshStandardMaterial color="#5b3f2e" roughness={1} flatShading />
      </mesh>
      <mesh geometry={rock}>
        <meshStandardMaterial color={theme.rock} roughness={1} flatShading side={THREE.DoubleSide} />
      </mesh>
      {/* Glowing rune ring under the island */}
      <mesh ref={runes} position={[0, -1.9, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[6.7, 0.035, 6, 96]} />
        <meshBasicMaterial color={theme.accent} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, -7.4, 0]} raycast={() => null}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight position={[0, -6, 0]} color={theme.accent} intensity={30} distance={14} />
      <group ref={rocks}>
        {DRIFT_ROCKS.map((d, i) => (
          <mesh key={i} position={d.pos} castShadow={shadows} raycast={() => null}>
            <dodecahedronGeometry args={[d.size, 0]} />
            <meshStandardMaterial color={theme.rock} flatShading roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Large gradient sky dome; cheaper and softer than an HDR environment. */
export function SkyDome({ top, bottom, glow = "#8b5cf6" }: { top: string; bottom: string; glow?: string }) {
  const uniforms = useMemo(
    () => ({ uTop: { value: new THREE.Color(top) }, uBottom: { value: new THREE.Color(bottom) }, uGlow: { value: new THREE.Color(glow) } }),
    [top, bottom, glow],
  );
  return (
    <mesh raycast={() => null} scale={80}>
      <sphereGeometry args={[1, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`uniform vec3 uTop; uniform vec3 uBottom; uniform vec3 uGlow; varying vec3 vPos;
void main(){
  float y = normalize(vPos).y;
  vec3 col = mix(uBottom, uTop, smoothstep(-0.35, 0.7, y));
  col += uGlow * 0.26 * exp(-abs(y - 0.04) * 4.5);
  col += uGlow * 0.10 * smoothstep(-0.15, -0.9, y);
  gl_FragColor = vec4(col, 1.0);
}`}
      />
    </mesh>
  );
}
