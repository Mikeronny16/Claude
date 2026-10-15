"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { GROUNDS, MAX_TILES, type ThemeDef } from "@/lib/catalog";
import { addableCells, tileTop, waterfallEdges } from "@/lib/terrain";
import type { Tile } from "@/lib/types";

const TOP_H = 0.3;
const SOIL_H = 0.45;

/** Small deterministic hash in [0, 1) for per-tile variation. */
const h01 = (x: number, z: number, k = 0) => {
  const s = Math.sin(x * 127.1 + z * 311.7 + k * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

/** How deep a column hangs below the island: deepest in the middle, jagged at the rim. */
function columnBottom(t: Tile, rMax: number): number {
  const r = Math.hypot(t.x, t.z) / rMax;
  return -(1.4 + Math.max(0, 1 - r) * 4.6 + h01(t.x, t.z, 3) * 1.1);
}

export interface TileHandlers {
  onTileClick?: (tile: Tile, point: THREE.Vector3, e: ThreeEvent<MouseEvent>) => void;
  onTileHover?: (tile: Tile | null, point: THREE.Vector3 | null) => void;
  /** Clicks on open sky next to the island (used by the "Add land" tool). */
  onEmptyClick?: (x: number, z: number) => void;
  onEmptyHover?: (cell: [number, number] | null) => void;
}

const WATERFALL_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const WATERFALL_FRAG = `uniform float uTime; varying vec2 vUv;
void main(){
  float stripes = 0.55 + 0.45 * sin((vUv.y * 9.0 + uTime * 2.4) + sin(vUv.x * 12.0) * 0.6);
  float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
  float fade = smoothstep(0.0, 0.55, vUv.y);
  vec3 col = mix(vec3(0.36, 0.78, 0.95), vec3(0.92, 0.98, 1.0), stripes * 0.7);
  gl_FragColor = vec4(col, (0.55 + 0.35 * stripes) * edge * fade);
  #include <colorspace_fragment>
}`;

function Waterfalls({ tiles, animate }: { tiles: Tile[]; animate: boolean }) {
  const edges = useMemo(() => waterfallEdges(tiles), [tiles]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: WATERFALL_VERT,
        fragmentShader: WATERFALL_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!animate || !group.current) return;
    // All waterfalls share one material; advance its clock once per frame.
    const mesh = group.current.getObjectByProperty("type", "Mesh") as THREE.Mesh | undefined;
    const mat = mesh?.material as THREE.ShaderMaterial | undefined;
    if (mat?.uniforms?.uTime) mat.uniforms.uTime.value += dt;
  });
  const LEN = 5.5;
  return (
    <group ref={group}>
      {edges.map(({ tile, side }) => {
        const top = tileTop(tile);
        const off: [number, number] = side === "+x" ? [0.52, 0] : side === "-x" ? [-0.52, 0] : side === "+z" ? [0, 0.52] : [0, -0.52];
        const rotY = side === "+x" ? Math.PI / 2 : side === "-x" ? -Math.PI / 2 : side === "+z" ? 0 : Math.PI;
        return (
          <group key={`${tile.x},${tile.z},${side}`} position={[tile.x + off[0], top, tile.z + off[1]]} rotation={[0, rotY, 0]}>
            <mesh position={[0, -LEN / 2 + 0.02, 0]} material={material} raycast={() => null}>
              <planeGeometry args={[0.9, LEN]} />
            </mesh>
            <mesh position={[0, 0.02, 0.08]} raycast={() => null}>
              <sphereGeometry args={[0.2, 10, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.55} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

const TUFTS_MAX = 160;

/** Glowing outlines on every empty spot where new land can go. */
function AddGhosts({ tiles, onPick, onHover }: { tiles: Tile[]; onPick?: (x: number, z: number) => void; onHover?: (cell: [number, number] | null) => void }) {
  const cells = useMemo(() => addableCells(tiles), [tiles]);
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const mat = new THREE.Matrix4();
    cells.forEach((c, i) => m.setMatrixAt(i, mat.makeTranslation(c.x, c.h * 0.5 - 0.05, c.z)));
    m.count = cells.length;
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [cells]);
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, MAX_TILES]}
      onClick={(e) => {
        if (e.delta > 6 || e.instanceId === undefined) return;
        const c = cells[e.instanceId];
        if (!c) return;
        e.stopPropagation();
        onPick?.(c.x, c.z);
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        const c = e.instanceId === undefined ? undefined : cells[e.instanceId];
        onHover?.(c ? [c.x, c.z] : null);
      }}
      onPointerOut={() => onHover?.(null)}
    >
      <boxGeometry args={[0.9, 0.1, 0.9]} />
      <meshBasicMaterial color="#67e8f9" transparent opacity={0.45} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
}

/** Block-tile floating island in the style of cozy tile builders. */
export function TileIsland({
  tiles,
  theme,
  animate,
  shadows,
  handlers = {},
  addMode = false,
}: {
  tiles: Tile[];
  theme: ThemeDef;
  animate: boolean;
  shadows: boolean;
  handlers?: TileHandlers;
  addMode?: boolean;
}) {
  const land = useMemo(() => tiles.filter((t) => t.ground !== "water"), [tiles]);
  const water = useMemo(() => tiles.filter((t) => t.ground === "water"), [tiles]);
  const rMax = useMemo(() => Math.max(3, ...tiles.map((t) => Math.hypot(t.x, t.z))) + 0.6, [tiles]);

  const topGeo = useMemo(() => new RoundedBoxGeometry(1, TOP_H, 1, 2, 0.07), []);
  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const tops = useRef<THREE.InstancedMesh>(null);
  const earth = useRef<THREE.InstancedMesh>(null);
  const waters = useRef<THREE.InstancedMesh>(null);
  const tufts = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const sc = new THREE.Vector3();
    const c = new THREE.Color();
    const grass = new THREE.Color(theme.grass);

    const t = tops.current;
    if (t) {
      land.forEach((tile, i) => {
        const top = tileTop(tile);
        m.compose(p.set(tile.x, top - TOP_H / 2, tile.z), q.identity(), sc.set(1, 1, 1));
        t.setMatrixAt(i, m);
        const v = h01(tile.x, tile.z);
        if (tile.ground === "grass") c.copy(grass).offsetHSL((v - 0.5) * 0.02, 0, (v - 0.5) * 0.07);
        else c.set(GROUNDS[tile.ground].color).offsetHSL(0, 0, (v - 0.5) * 0.05);
        t.setColorAt(i, c);
      });
      t.count = land.length;
      t.instanceMatrix.needsUpdate = true;
      if (t.instanceColor) t.instanceColor.needsUpdate = true;
      t.computeBoundingSphere();
    }

    const w = waters.current;
    if (w) {
      water.forEach((tile, i) => {
        const top = tileTop(tile);
        m.compose(p.set(tile.x, top - 0.11, tile.z), q.identity(), sc.set(1, 0.22, 1));
        w.setMatrixAt(i, m);
      });
      w.count = water.length;
      w.instanceMatrix.needsUpdate = true;
      w.computeBoundingSphere();
    }

    const ea = earth.current;
    if (ea) {
      const soil = new THREE.Color(theme.soil);
      const rock = new THREE.Color(theme.rock);
      const deep = rock.clone().offsetHSL(0, -0.04, -0.06);
      const bed = new THREE.Color("#d8b57c");
      let k = 0;
      for (const tile of tiles) {
        const isWater = tile.ground === "water";
        const surface = tile.h * 0.5 - (isWater ? 0.36 : TOP_H);
        const bottom = columnBottom(tile, rMax);
        const v = h01(tile.x, tile.z, 1);
        // Soil band (or the pond bed).
        m.compose(p.set(tile.x, surface - SOIL_H / 2, tile.z), q.identity(), sc.set(1, SOIL_H, 1));
        ea.setMatrixAt(k, m);
        ea.setColorAt(k++, c.copy(isWater ? bed : soil).offsetHSL(0, 0, (v - 0.5) * 0.06));
        // Upper and lower cliff rock.
        const rockTop = surface - SOIL_H;
        const mid = rockTop + (bottom - rockTop) * 0.45;
        if (rockTop - mid > 0.01) {
          m.compose(p.set(tile.x, (rockTop + mid) / 2, tile.z), q.identity(), sc.set(0.999, rockTop - mid, 0.999));
          ea.setMatrixAt(k, m);
          ea.setColorAt(k++, c.copy(rock).offsetHSL(0, 0, (v - 0.5) * 0.08));
        }
        if (mid - bottom > 0.01) {
          const inset = 0.92 - h01(tile.x, tile.z, 2) * 0.12;
          m.compose(p.set(tile.x, (mid + bottom) / 2, tile.z), q.identity(), sc.set(inset, mid - bottom, inset));
          ea.setMatrixAt(k, m);
          ea.setColorAt(k++, c.copy(deep).offsetHSL(0, 0, (v - 0.5) * 0.06));
        }
      }
      ea.count = k;
      ea.instanceMatrix.needsUpdate = true;
      if (ea.instanceColor) ea.instanceColor.needsUpdate = true;
      ea.computeBoundingSphere();
    }

    const tf = tufts.current;
    if (tf) {
      let k = 0;
      for (const tile of land) {
        if (tile.ground !== "grass" || k >= TUFTS_MAX) continue;
        const n = h01(tile.x, tile.z, 5) < 0.55 ? 1 : 2;
        for (let i = 0; i < n && k < TUFTS_MAX; i++) {
          const ox = (h01(tile.x, tile.z, 6 + i) - 0.5) * 0.7;
          const oz = (h01(tile.x, tile.z, 9 + i) - 0.5) * 0.7;
          const s = 0.6 + h01(tile.x, tile.z, 12 + i) * 0.7;
          m.compose(p.set(tile.x + ox, tileTop(tile) + 0.09 * s, tile.z + oz), q.setFromEuler(e.set(0, h01(tile.x, tile.z, 15 + i) * 3, 0)), sc.set(s, s, s));
          tf.setMatrixAt(k, m);
          tf.setColorAt(k++, c.copy(grass).offsetHSL(0.02, 0.05, 0.08 + h01(tile.x, tile.z, 18 + i) * 0.08));
        }
      }
      tf.count = k;
      tf.instanceMatrix.needsUpdate = true;
      if (tf.instanceColor) tf.instanceColor.needsUpdate = true;
      tf.computeBoundingSphere();
    }
  }, [tiles, land, water, theme, rMax]);

  const bottomY = useMemo(() => Math.min(...tiles.map((t) => columnBottom(t, rMax))), [tiles, rMax]);

  const pick = (list: Tile[]) => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      if (!handlers.onTileClick || e.delta > 6 || e.instanceId === undefined) return;
      const tile = list[e.instanceId];
      if (!tile) return;
      e.stopPropagation();
      handlers.onTileClick(tile, e.point, e);
    },
    onPointerMove: (e: ThreeEvent<PointerEvent>) => {
      if (!handlers.onTileHover || e.instanceId === undefined) return;
      e.stopPropagation();
      handlers.onTileHover(list[e.instanceId] ?? null, e.point);
    },
    onPointerOut: () => handlers.onTileHover?.(null, null),
  });

  return (
    <group>
      <instancedMesh ref={tops} args={[topGeo, undefined, MAX_TILES]} receiveShadow castShadow={shadows} {...pick(land)}>
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={waters} args={[boxGeo, undefined, MAX_TILES]} {...pick(water)}>
        <meshStandardMaterial color="#4cc3ea" emissive="#1f8fb8" emissiveIntensity={0.25} roughness={0.15} transparent opacity={0.82} />
      </instancedMesh>
      <instancedMesh ref={earth} args={[boxGeo, undefined, MAX_TILES * 3]} raycast={() => null} receiveShadow>
        <meshStandardMaterial roughness={1} flatShading />
      </instancedMesh>
      <instancedMesh ref={tufts} args={[undefined, undefined, TUFTS_MAX]} raycast={() => null}>
        <coneGeometry args={[0.06, 0.2, 4]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
      <Waterfalls tiles={tiles} animate={animate} />

      {addMode && <AddGhosts tiles={tiles} onPick={handlers.onEmptyClick} onHover={handlers.onEmptyHover} />}

      {/* Glowing crystal hanging from the underside. */}
      <mesh position={[0, bottomY - 0.5, 0]} raycast={() => null}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <pointLight position={[0, bottomY + 0.5, 0]} color={theme.accent} intensity={25} distance={10} />
    </group>
  );
}

const ISLETS: { pos: [number, number, number]; speed: number; size: number }[] = [
  { pos: [9.5, -1.2, -3], speed: 0.5, size: 1 },
  { pos: [-9, -2.6, 3.5], speed: 0.4, size: 1.3 },
  { pos: [3, -4.2, 9.5], speed: 0.7, size: 0.8 },
  { pos: [-4.5, 0.4, -9.5], speed: 0.6, size: 0.9 },
];

/** Tiny one-tile islands drifting nearby. */
export function Islets({ theme, animate }: { theme: ThemeDef; animate: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!animate || !ref.current) return;
    ref.current.children.forEach((c, i) => {
      const d = ISLETS[i];
      c.position.y = d.pos[1] + Math.sin(clock.elapsedTime * d.speed + i) * 0.3;
    });
  });
  return (
    <group ref={ref}>
      {ISLETS.map((d, i) => (
        <group key={i} position={d.pos} scale={d.size} rotation={[0, i * 0.7, 0]}>
          <mesh position={[0, -0.12, 0]} raycast={() => null}>
            <boxGeometry args={[0.9, 0.24, 0.9]} />
            <meshStandardMaterial color={theme.grass} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.55, 0]} raycast={() => null}>
            <boxGeometry args={[0.86, 0.62, 0.86]} />
            <meshStandardMaterial color={theme.soil} roughness={1} flatShading />
          </mesh>
          <mesh position={[0, -1.15, 0]} raycast={() => null}>
            <coneGeometry args={[0.5, 0.7, 4]} />
            <meshStandardMaterial color={theme.rock} roughness={1} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const CLOUDS: { pos: [number, number, number]; s: number }[] = [
  { pos: [-13, -1, -8], s: 1.4 },
  { pos: [14, -3, -6], s: 1.1 },
  { pos: [-10, -5, 10], s: 1.6 },
  { pos: [12, -6.5, 9], s: 1.3 },
  { pos: [2, -9, -14], s: 1.8 },
  { pos: [-16, 2.5, 2], s: 0.9 },
  { pos: [6, 3.5, -16], s: 1 },
];
const PUFFS: [number, number, number, number][] = [
  [0, 0, 0, 1],
  [0.9, -0.15, 0.2, 0.75],
  [-0.9, -0.2, -0.1, 0.7],
  [0.3, 0.45, -0.1, 0.65],
  [-0.4, 0.3, 0.3, 0.55],
];

/** Soft puffy clouds circling below and around the island. */
export function Clouds({ color, animate }: { color: string; animate: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (animate && ref.current) ref.current.rotation.y += dt * 0.012;
  });
  return (
    <group ref={ref}>
      {CLOUDS.map((c, i) => (
        <group key={i} position={c.pos} scale={c.s}>
          {PUFFS.map(([x, y, z, r], j) => (
            <mesh key={j} position={[x, y, z]} raycast={() => null}>
              <sphereGeometry args={[r, 14, 10]} />
              <meshStandardMaterial color={color} roughness={1} emissive={color} emissiveIntensity={0.25} />
            </mesh>
          ))}
        </group>
      ))}
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
  // Spread the gradient over what the camera actually sees (mostly below the horizon).
  vec3 col = mix(uBottom * 1.06, uTop, smoothstep(-0.75, 0.55, y));
  col = mix(col, uBottom * 0.82, smoothstep(-0.2, -0.95, y));
  col += uGlow * 0.14 * exp(-abs(y - 0.02) * 4.0);
  gl_FragColor = vec4(col, 1.0);
  // Uniform colors are in linear space; convert back for display.
  #include <colorspace_fragment>
}`}
      />
    </mesh>
  );
}
