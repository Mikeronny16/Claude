"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { tileAt, tileMap, tileTop } from "@/lib/terrain";
import type { Tile } from "@/lib/types";

const SKIN = "#fff1e2";
const INK = "#241b3a";

/** A small hooded explorer: the player's character, dressed in their sigil colors. */
function ExplorerBody({ from, to }: { from: string; to: string }) {
  return (
    <group>
      {[-0.065, 0.065].map((x) => (
        <mesh key={x} position={[x, 0.045, 0.01]} castShadow>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshStandardMaterial color="#3b2f5c" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.155, 0.26, 14]} />
        <meshStandardMaterial color={to} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.2, -0.05]} rotation={[0.22, 0, 0]}>
        <coneGeometry args={[0.17, 0.34, 12, 1, true, Math.PI * 0.55, Math.PI * 0.9]} />
        <meshStandardMaterial color={from} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.335, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.085, 0.032, 8, 18]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.49, 0.01]} castShadow>
        <sphereGeometry args={[0.16, 20, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      {/* Hood with little ears */}
      <mesh position={[0, 0.51, -0.02]} rotation={[-0.55, 0, 0]}>
        <sphereGeometry args={[0.185, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
        <meshStandardMaterial color={from} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.68, -0.04]} rotation={[-0.2, 0, x > 0 ? -0.35 : 0.35]}>
          <coneGeometry args={[0.05, 0.12, 6]} />
          <meshStandardMaterial color={from} roughness={0.7} />
        </mesh>
      ))}
      {[-0.055, 0.055].map((x) => (
        <mesh key={x} position={[x, 0.48, 0.145]} scale={[1, 1.4, 0.6]}>
          <sphereGeometry args={[0.024, 10, 8]} />
          <meshStandardMaterial color={INK} roughness={0.3} />
        </mesh>
      ))}
      {[-0.095, 0.095].map((x) => (
        <mesh key={x} position={[x, 0.44, 0.125]} scale={[1, 0.6, 0.4]}>
          <sphereGeometry args={[0.025, 8, 6]} />
          <meshStandardMaterial color="#fda4af" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Straight path from a to b stays on dry land the whole way. */
function walkable(map: Map<string, Tile>, ax: number, az: number, bx: number, bz: number): boolean {
  const steps = Math.ceil(Math.hypot(bx - ax, bz - az) / 0.3);
  for (let i = 1; i <= steps; i++) {
    const t = tileAt(map, ax + ((bx - ax) * i) / steps, az + ((bz - az) * i) / steps);
    if (!t || t.ground === "water") return false;
  }
  return true;
}

/**
 * The player's explorer wanders the island: short walks between dry tiles,
 * pausing to look around. It's decoration, so it never blocks taps.
 */
export function Explorer({ tiles, from, to, animate }: { tiles: Tile[]; from: string; to: string; animate: boolean }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Mesh>(null);
  const map = useMemo(() => tileMap(tiles), [tiles]);
  const dry = useMemo(() => tiles.filter((t) => t.ground !== "water"), [tiles]);
  const st = useRef({ ready: false, x: 0, y: 0, z: 0, tx: 0, tz: 0, wait: 1.5, heading: 0.6 });

  useFrame(({ clock }, dt) => {
    const g = root.current;
    const s = st.current;
    if (!g || dry.length === 0) return;
    if (!s.ready) {
      const start = dry.reduce((a, b) => (Math.hypot(b.x - 0.6, b.z - 1.4) < Math.hypot(a.x - 0.6, a.z - 1.4) ? b : a));
      s.x = s.tx = start.x + 0.2;
      s.z = s.tz = start.z + 0.2;
      s.y = tileTop(start);
      s.ready = true;
    }
    const d = Math.hypot(s.tx - s.x, s.tz - s.z);
    let walking = false;
    if (animate) {
      if (s.wait > 0) s.wait -= dt;
      else if (d < 0.04) {
        // Pick somewhere nearby that can be reached in a straight line.
        for (let i = 0; i < 10; i++) {
          const t = dry[Math.floor(Math.random() * dry.length)];
          const nx = t.x + (Math.random() - 0.5) * 0.5;
          const nz = t.z + (Math.random() - 0.5) * 0.5;
          if (Math.hypot(nx - s.x, nz - s.z) < 3.5 && walkable(map, s.x, s.z, nx, nz)) {
            s.tx = nx;
            s.tz = nz;
            break;
          }
        }
        s.wait = 0.8 + Math.random() * 2.2;
      } else {
        const step = Math.min(d, dt * 0.85);
        s.x += ((s.tx - s.x) / d) * step;
        s.z += ((s.tz - s.z) / d) * step;
        s.heading = Math.atan2(s.tx - s.x, s.tz - s.z);
        walking = true;
      }
    }
    const here = tileAt(map, s.x, s.z);
    if (!here) {
      // The ground was removed: hop to the nearest dry tile.
      const t = dry[0];
      s.x = s.tx = t.x;
      s.z = s.tz = t.z;
    }
    const groundY = here && here.ground !== "water" ? tileTop(here) : s.y;
    s.y += (groundY - s.y) * Math.min(1, dt * 12);
    g.position.set(s.x, s.y, s.z);
    let dr = s.heading - g.rotation.y;
    dr = Math.atan2(Math.sin(dr), Math.cos(dr));
    g.rotation.y += dr * Math.min(1, dt * 8);
    const t = clock.elapsedTime;
    if (body.current) {
      body.current.position.y = walking ? Math.abs(Math.sin(t * 11)) * 0.05 : Math.sin(t * 2) * 0.012;
      body.current.rotation.z = walking ? Math.sin(t * 11) * 0.06 : 0;
    }
    if (marker.current) {
      marker.current.position.y = 1.02 + Math.sin(t * 2.5) * 0.04;
      marker.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group ref={root} scale={1.6}>
      <group ref={body}>
        <ExplorerBody from={from} to={to} />
      </group>
      <mesh ref={marker} position={[0, 1.02, 0]} raycast={() => null}>
        <octahedronGeometry args={[0.055, 0]} />
        <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  );
}
