"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { AssetKind, CreationPart, CreationSpec, PartShape } from "@/lib/types";

/** Shared look: chunky low-poly with flat shading. */
function Mat({ color, glow = false, intensity = 1.4, opacity }: { color: string; glow?: boolean; intensity?: number; opacity?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      flatShading
      roughness={glow ? 0.35 : 0.8}
      metalness={0.05}
      emissive={glow ? color : "#000000"}
      emissiveIntensity={glow ? intensity : 0}
      transparent={opacity !== undefined}
      opacity={opacity ?? 1}
      toneMapped={!glow}
    />
  );
}

let glowTexture: THREE.Texture | null = null;
/** Soft radial gradient shared by every halo (created once, client-side). */
function getGlowTexture(): THREE.Texture {
  if (glowTexture) return glowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}

/** Cheap fake bloom: a soft additive sprite around light sources. */
export function Halo({ color, size = 0.6, opacity = 0.22, position }: { color: string; size?: number; opacity?: number; position?: [number, number, number] }) {
  const map = useMemo(() => getGlowTexture(), []);
  const s = size * 2.6;
  return (
    <sprite position={position} scale={[s, s, 1]} raycast={() => null}>
      <spriteMaterial map={map} color={color} transparent opacity={Math.min(1, opacity * 3)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

const WOOD = "#8b5a2b";
const DARK_WOOD = "#5b3a1e";
const STONE = "#b4b8d8";
const CREAM = "#fef3c7";
const WARM_LIGHT = "#fde68a";

interface ModelProps {
  color: string;
  animate: boolean;
  shadows: boolean;
  /** Animation time offset so identical objects don't move in lockstep. */
  phase?: number;
}

/** Stable 0–10 phase derived from an id. */
export function phaseFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(h) % 1000) / 100;
}

function Pine({ color, shadows }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.1, 0.14, 0.5, 6]} />
        <Mat color={WOOD} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.75 + i * 0.42, 0]} castShadow={shadows}>
          <coneGeometry args={[0.62 - i * 0.15, 0.75, 7]} />
          <Mat color={color} />
        </mesh>
      ))}
    </group>
  );
}

function RoundTree({ color, shadows }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.1, 0.16, 0.8, 6]} />
        <Mat color={WOOD} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow={shadows}>
        <icosahedronGeometry args={[0.6, 1]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0.4, 0.95, 0.15]} castShadow={shadows}>
        <icosahedronGeometry args={[0.35, 1]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[-0.35, 1.0, -0.2]} castShadow={shadows}>
        <icosahedronGeometry args={[0.38, 1]} />
        <Mat color={color} />
      </mesh>
    </group>
  );
}

function Mushroom({ color, shadows }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.16, 0.22, 0.7, 10]} />
        <Mat color={CREAM} />
      </mesh>
      <mesh position={[0, 0.66, 0]} castShadow={shadows}>
        <sphereGeometry args={[0.55, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Mat color={color} />
      </mesh>
      {[
        [0.25, 0.98, 0.2],
        [-0.28, 0.92, 0.12],
        [0.02, 1.08, -0.22],
        [0.35, 0.82, -0.25],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <Mat color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function Flowers({ color }: ModelProps) {
  const spots: [number, number][] = [
    [0, 0],
    [0.35, 0.2],
    [-0.3, 0.25],
    [0.15, -0.35],
    [-0.25, -0.25],
  ];
  return (
    <group>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.65, 0.06, 10]} />
        <Mat color="#3f8f5a" />
      </mesh>
      {spots.map(([x, z], i) => {
        const h = 0.25 + (i % 3) * 0.08;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, h / 2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, h, 4]} />
              <Mat color="#22c55e" />
            </mesh>
            <mesh position={[0, h, 0]}>
              <dodecahedronGeometry args={[0.1, 0]} />
              <Mat color={i % 2 ? color : "#ffffff"} />
            </mesh>
            <mesh position={[0, h + 0.05, 0]}>
              <sphereGeometry args={[0.04, 6, 4]} />
              <Mat color="#fde047" glow intensity={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Boulder({ color, shadows }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.38, 0]} scale={[1.1, 0.8, 0.95]} castShadow={shadows}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0.5, 0.15, 0.25]} scale={[1, 0.7, 1]} castShadow={shadows}>
        <dodecahedronGeometry args={[0.22, 0]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[-0.1, 0.72, 0.05]} scale={[1, 0.3, 1]}>
        <dodecahedronGeometry args={[0.32, 0]} />
        <Mat color="#4ade80" />
      </mesh>
    </group>
  );
}

function Cottage({ color, shadows }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow={shadows} receiveShadow>
        <boxGeometry args={[1.2, 0.9, 1]} />
        <Mat color={CREAM} />
      </mesh>
      <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow={shadows}>
        <coneGeometry args={[1.0, 0.75, 4]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0, 0.3, 0.51]}>
        <boxGeometry args={[0.3, 0.6, 0.04]} />
        <Mat color={DARK_WOOD} />
      </mesh>
      {[-0.38, 0.38].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.51]}>
          <boxGeometry args={[0.22, 0.22, 0.04]} />
          <Mat color={WARM_LIGHT} glow intensity={1.1} />
        </mesh>
      ))}
      <mesh position={[0.35, 1.4, -0.2]} castShadow={shadows}>
        <boxGeometry args={[0.18, 0.45, 0.18]} />
        <Mat color={STONE} />
      </mesh>
    </group>
  );
}

function Tower({ color, shadows }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow={shadows} receiveShadow>
        <cylinderGeometry args={[0.42, 0.55, 1.8, 8]} />
        <Mat color={STONE} />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.6, 0.5, 0.15, 8]} />
        <Mat color="#6b6fa8" />
      </mesh>
      <mesh position={[0, 2.45, 0]} castShadow={shadows}>
        <coneGeometry args={[0.62, 1.1, 8]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
        <Mat color="#fbbf24" glow />
      </mesh>
      {[0.6, 1.3].map((y) => (
        <mesh key={y} position={[0, y, 0.47]}>
          <boxGeometry args={[0.16, 0.26, 0.05]} />
          <Mat color={WARM_LIGHT} glow intensity={1.1} />
        </mesh>
      ))}
    </group>
  );
}

function Lighthouse({ color, animate, shadows }: ModelProps) {
  const beam = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (animate && beam.current) beam.current.rotation.y += dt * 0.8;
  });
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.3 + i * 0.55, 0]} castShadow={shadows}>
          <cylinderGeometry args={[0.42 - (i + 1) * 0.04, 0.42 - i * 0.04, 0.55, 12]} />
          <Mat color={i % 2 ? "#f8fafc" : color} />
        </mesh>
      ))}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 10]} />
        <Mat color={WARM_LIGHT} glow intensity={2} />
      </mesh>
      <Halo color={WARM_LIGHT} size={0.55} position={[0, 2.5, 0]} />
      <mesh position={[0, 2.9, 0]} castShadow={shadows}>
        <coneGeometry args={[0.38, 0.45, 10]} />
        <Mat color={color} />
      </mesh>
      <group ref={beam} position={[0, 2.5, 0]}>
        <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} raycast={() => null}>
          <coneGeometry args={[0.45, 2.6, 16, 1, true]} />
          <meshBasicMaterial color={WARM_LIGHT} transparent opacity={0.13} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function Windmill({ color, animate, shadows }: ModelProps) {
  const sails = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (animate && sails.current) sails.current.rotation.z += dt * 1.2;
  });
  return (
    <group>
      <mesh position={[0, 0.85, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.32, 0.5, 1.7, 8]} />
        <Mat color={CREAM} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow={shadows}>
        <coneGeometry args={[0.45, 0.55, 8]} />
        <Mat color="#b45309" />
      </mesh>
      <group ref={sails} position={[0, 1.55, 0.42]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0, 0]}>
            <boxGeometry args={[0.16, 1.5, 0.03]} />
            <Mat color={color} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
          <Mat color={DARK_WOOD} />
        </mesh>
      </group>
      <mesh position={[0, 0.3, 0.47]}>
        <boxGeometry args={[0.24, 0.45, 0.04]} />
        <Mat color={DARK_WOOD} />
      </mesh>
    </group>
  );
}

function Fence({ color, shadows }: ModelProps) {
  return (
    <group>
      {[-0.6, 0, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]} castShadow={shadows}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <Mat color={color} />
        </mesh>
      ))}
      {[0.22, 0.45].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow={shadows}>
          <boxGeometry args={[1.35, 0.07, 0.05]} />
          <Mat color={color} />
        </mesh>
      ))}
    </group>
  );
}

function Crystal({ color, animate, shadows }: ModelProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (animate && ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.3;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.75, 0]} scale={[0.6, 1.5, 0.6]} castShadow={shadows}>
        <octahedronGeometry args={[0.5, 0]} />
        <Mat color={color} glow intensity={1.2} />
      </mesh>
      <mesh position={[0.35, 0.35, 0.1]} scale={[0.35, 0.8, 0.35]} rotation={[0, 0, -0.35]}>
        <octahedronGeometry args={[0.5, 0]} />
        <Mat color={color} glow intensity={0.9} />
      </mesh>
      <mesh position={[-0.3, 0.3, -0.1]} scale={[0.3, 0.65, 0.3]} rotation={[0, 0, 0.3]}>
        <octahedronGeometry args={[0.5, 0]} />
        <Mat color={color} glow intensity={0.9} />
      </mesh>
      <Halo color={color} size={0.75} opacity={0.14} position={[0, 0.7, 0]} />
    </group>
  );
}

function Portal({ color, animate, shadows }: ModelProps) {
  const swirl = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (animate && swirl.current) swirl.current.rotation.z -= dt * 1.5;
  });
  return (
    <group>
      <mesh position={[0, 1.15, 0]} castShadow={shadows}>
        <torusGeometry args={[0.85, 0.14, 10, 32]} />
        <Mat color={color} glow intensity={1.3} />
      </mesh>
      <mesh ref={swirl} position={[0, 1.15, 0]}>
        <circleGeometry args={[0.72, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <Halo color={color} size={1.1} opacity={0.1} position={[0, 1.15, 0]} />
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.15, 0]} castShadow={shadows}>
          <dodecahedronGeometry args={[0.28, 0]} />
          <Mat color={STONE} />
        </mesh>
      ))}
    </group>
  );
}

function Wisp({ color, animate, phase = 0 }: ModelProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime + phase;
    ref.current.position.y = 1.2 + (animate ? Math.sin(t * 1.6) * 0.15 : 0);
    if (animate) ref.current.rotation.y = t * 0.8;
  });
  return (
    <group>
      <group ref={ref} position={[0, 1.2, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.22, 1]} />
          <Mat color={color} glow intensity={2} />
        </mesh>
        <Halo color={color} size={0.5} opacity={0.25} />
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos((i * Math.PI * 2) / 3) * 0.42, 0, Math.sin((i * Math.PI * 2) / 3) * 0.42]}>
            <sphereGeometry args={[0.04, 6, 4]} />
            <Mat color="#ffffff" glow />
          </mesh>
        ))}
      </group>
      {/* Invisible stem so the floating orb is easy to tap. */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 1.2, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function RuneStone({ color, shadows }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0.05]} castShadow={shadows}>
        <boxGeometry args={[0.6, 1.6, 0.32]} />
        <Mat color="#64748b" />
      </mesh>
      {[0.45, 0.8, 1.15].map((y, i) => (
        <mesh key={y} position={[i === 1 ? 0.08 : -0.05, y, 0.17]}>
          <boxGeometry args={[i === 1 ? 0.2 : 0.32, 0.06, 0.02]} />
          <Mat color={color} glow intensity={2} />
        </mesh>
      ))}
      <Halo color={color} size={0.6} opacity={0.1} position={[0, 0.8, 0.2]} />
    </group>
  );
}

function Lantern({ color, shadows }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.65, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.04, 0.06, 1.3, 6]} />
        <Mat color="#334155" />
      </mesh>
      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[0.26, 0.3, 0.26]} />
        <Mat color={color} glow intensity={2.2} />
      </mesh>
      <mesh position={[0, 1.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.24, 0.2, 4]} />
        <Mat color="#334155" />
      </mesh>
      <Halo color={color} size={0.45} opacity={0.25} position={[0, 1.42, 0]} />
    </group>
  );
}

function Campfire({ color, animate }: ModelProps) {
  const flames = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!animate || !flames.current) return;
    const t = clock.elapsedTime;
    flames.current.children.forEach((c, i) => {
      c.scale.y = 1 + Math.sin(t * 9 + i * 2) * 0.18;
    });
  });
  return (
    <group>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.45, 0.07, Math.sin(a) * 0.45]}>
            <dodecahedronGeometry args={[0.1, 0]} />
            <Mat color="#94a3b8" />
          </mesh>
        );
      })}
      {[0, Math.PI / 2].map((r) => (
        <mesh key={r} position={[0, 0.08, 0]} rotation={[0, r, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.6, 6]} />
          <Mat color={WOOD} />
        </mesh>
      ))}
      <group ref={flames}>
        <mesh position={[0, 0.32, 0]}>
          <coneGeometry args={[0.2, 0.5, 6]} />
          <Mat color={color} glow intensity={2.4} />
        </mesh>
        <mesh position={[0.08, 0.26, 0.05]}>
          <coneGeometry args={[0.1, 0.32, 5]} />
          <Mat color="#fde047" glow intensity={2.4} />
        </mesh>
      </group>
      <Halo color={color} size={0.6} opacity={0.22} position={[0, 0.3, 0]} />
    </group>
  );
}

function Flag({ color, animate, shadows }: ModelProps) {
  const cloth = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (animate && cloth.current) cloth.current.rotation.y = Math.sin(clock.elapsedTime * 2.2) * 0.25;
  });
  return (
    <group>
      <mesh position={[0, 1, 0]} castShadow={shadows}>
        <cylinderGeometry args={[0.03, 0.04, 2, 6]} />
        <Mat color="#cbd5e1" />
      </mesh>
      <mesh ref={cloth} position={[0.32, 1.7, 0]}>
        <boxGeometry args={[0.62, 0.4, 0.02]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0, 2.03, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <Mat color="#fbbf24" glow />
      </mesh>
    </group>
  );
}

const MODELS: Record<AssetKind, (p: ModelProps) => React.JSX.Element> = {
  pine: Pine,
  roundTree: RoundTree,
  mushroom: Mushroom,
  flowers: Flowers,
  boulder: Boulder,
  cottage: Cottage,
  tower: Tower,
  lighthouse: Lighthouse,
  windmill: Windmill,
  fence: Fence,
  crystal: Crystal,
  portal: Portal,
  wisp: Wisp,
  runestone: RuneStone,
  lantern: Lantern,
  campfire: Campfire,
  flag: Flag,
};

export function AssetModel({ kind, ...props }: ModelProps & { kind: AssetKind }) {
  const Model = MODELS[kind];
  return <Model {...props} />;
}

function PartGeometry({ shape }: { shape: PartShape }) {
  switch (shape) {
    case "box":
      return <boxGeometry args={[1, 1, 1]} />;
    case "sphere":
      return <sphereGeometry args={[0.5, 20, 14]} />;
    case "cylinder":
      return <cylinderGeometry args={[0.5, 0.5, 1, 16]} />;
    case "cone":
      return <coneGeometry args={[0.5, 1, 16]} />;
    case "torus":
      return <torusGeometry args={[0.38, 0.12, 10, 28]} />;
    case "icosahedron":
      return <icosahedronGeometry args={[0.5, 0]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.5, 0]} />;
    case "capsule":
      return <capsuleGeometry args={[0.25, 0.5, 4, 12]} />;
  }
}

const DEG = Math.PI / 180;

function Part({ part, shadows }: { part: CreationPart; shadows: boolean }) {
  return (
    <mesh
      position={part.position}
      rotation={[part.rotation[0] * DEG, part.rotation[1] * DEG, part.rotation[2] * DEG]}
      scale={part.scale}
      castShadow={shadows && !part.glow}
    >
      <PartGeometry shape={part.shape} />
      <Mat color={part.color} glow={part.glow} intensity={1.3} />
    </mesh>
  );
}

/** Renders an AI (or demo) creation from its spec. */
export function CreationModel({ spec, animate, shadows, phase = 0 }: { spec: CreationSpec; animate: boolean; shadows: boolean; phase?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime + phase;
    if (!animate) {
      g.position.y = 0;
      g.rotation.y = 0;
      g.scale.setScalar(1);
      return;
    }
    if (spec.animation === "spin") g.rotation.y = t * 0.8;
    if (spec.animation === "bob") g.position.y = 0.15 + Math.sin(t * 1.8) * 0.15;
    if (spec.animation === "pulse") g.scale.setScalar(1 + Math.sin(t * 2.4) * 0.04);
  });
  return (
    <group ref={ref}>
      {spec.parts.map((part, i) => (
        <Part key={i} part={part} shadows={shadows} />
      ))}
    </group>
  );
}

/** Shown if a placed creation's spec is missing (e.g. deleted elsewhere). */
export function MissingModel() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <octahedronGeometry args={[0.45, 0]} />
      <meshStandardMaterial color="#64748b" wireframe />
    </mesh>
  );
}
