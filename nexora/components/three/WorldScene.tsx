"use client";

import { OrbitControls, Sparkles, Stars, TransformControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { THEMES } from "@/lib/catalog";
import type { ObjectPatch } from "@/lib/store";
import { tileTop } from "@/lib/terrain";
import type { Creation, GroundTool, Quality, Vec3, World, WorldObject } from "@/lib/types";
import { Explorer } from "./Explorer";
import { Clouds, Islets, SkyDome, TileIsland } from "./Island";
import { AssetModel, CreationModel, MissingModel, phaseFromId } from "./models";

export type TransformMode = "translate" | "rotate" | "scale";

export interface WorldSceneProps {
  world: World;
  creations: Creation[];
  mode: "view" | "edit";
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  transformMode?: TransformMode;
  onTransformCommit?: (id: string, patch: ObjectPatch) => void;
  /** When true, tapping the ground calls onPlace instead of deselecting. */
  placing?: boolean;
  onPlace?: (position: Vec3) => void;
  autoRotate?: boolean;
  reducedMotion: boolean;
  quality: Quality;
  snap?: boolean;
  /** Ground editing: taps paint/raise/lower/add/remove tiles instead of selecting objects. */
  groundTool?: GroundTool | null;
  onGroundTool?: (x: number, z: number) => void;
  /** The player's explorer character (sigil colors). Omitted on showcase islands. */
  explorer?: { from: string; to: string } | null;
}

function SelectionRing({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    m.opacity = animate ? 0.55 + Math.sin(clock.elapsedTime * 4) * 0.25 : 0.75;
  });
  return (
    <mesh ref={ref} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
      <ringGeometry args={[0.85, 1.0, 40]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.75} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

interface SceneObjectProps {
  obj: WorldObject;
  creation?: Creation;
  selected: boolean;
  editable: boolean;
  animate: boolean;
  shadows: boolean;
  transformMode: TransformMode;
  snap: boolean;
  onSelect?: (id: string) => void;
  onCommit?: (id: string, patch: ObjectPatch) => void;
  onGizmoUse: () => void;
}

function SceneObject({ obj, creation, selected, editable, animate, shadows, transformMode, snap, onSelect, onCommit, onGizmoUse }: SceneObjectProps) {
  const ref = useRef<THREE.Group>(null);
  const latest = useRef(obj);
  useLayoutEffect(() => {
    latest.current = obj;
  }, [obj]);

  /** Put the 3D object back in line with the stored (possibly clamped) values. */
  const syncFromStore = () => {
    const g = ref.current;
    const o = latest.current;
    if (!g) return;
    g.position.set(...o.position);
    g.rotation.set(...o.rotation);
    g.scale.setScalar(o.scale);
  };

  return (
    <>
      <group
        ref={ref}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
        onClick={
          editable
            ? (e) => {
                if (e.delta > 6) return;
                e.stopPropagation();
                onSelect?.(obj.id);
              }
            : undefined
        }
        onPointerOver={
          editable
            ? (e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }
            : undefined
        }
        onPointerOut={editable ? () => (document.body.style.cursor = "") : undefined}
      >
        {obj.kind === "custom" ? (
          creation ? (
            <CreationModel spec={creation.spec} animate={animate} shadows={shadows} phase={phaseFromId(obj.id)} />
          ) : (
            <MissingModel />
          )
        ) : (
          <AssetModel kind={obj.kind} color={obj.color} animate={animate} shadows={shadows} phase={phaseFromId(obj.id)} />
        )}
        {selected && <SelectionRing animate={animate} />}
      </group>
      {selected && editable && (
        <TransformControls
          object={ref as React.RefObject<THREE.Object3D>}
          mode={transformMode}
          size={0.9}
          translationSnap={snap ? 0.5 : null}
          rotationSnap={snap ? Math.PI / 12 : null}
          onObjectChange={() => {
            onGizmoUse();
            const g = ref.current;
            if (!g || transformMode !== "scale") return;
            // Keep scaling uniform: follow whichever axis the player dragged.
            const base = latest.current.scale;
            const comps = [g.scale.x, g.scale.y, g.scale.z];
            const pick = comps.reduce((a, b) => (Math.abs(b - base) > Math.abs(a - base) ? b : a));
            g.scale.setScalar(THREE.MathUtils.clamp(pick, 0.3, 3));
          }}
          onMouseUp={() => {
            onGizmoUse();
            const g = ref.current;
            if (!g) return;
            onCommit?.(obj.id, {
              position: [g.position.x, g.position.y, g.position.z],
              rotation: [g.rotation.x, g.rotation.y, g.rotation.z],
              scale: g.scale.x,
            });
            requestAnimationFrame(syncFromStore);
          }}
        />
      )}
    </>
  );
}

function FloatGroup({ animate, children }: { animate: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = animate ? Math.sin(clock.elapsedTime * 0.6) * 0.12 : 0;
  });
  return <group ref={ref}>{children}</group>;
}

/** Pull the camera back on narrow (portrait) screens so the whole island fits. */
function ResponsiveCamera() {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const controls = useThree((s) => s.controls) as unknown as { target?: THREE.Vector3; update?: () => void } | null;
  useEffect(() => {
    const distance = aspect < 1.1 ? 18 / Math.pow(Math.max(aspect, 0.45), 0.85) : 18;
    const target = controls?.target ?? new THREE.Vector3(0, 0.5, 0);
    const dir = camera.position.clone().sub(target).normalize();
    camera.position.copy(target.clone().add(dir.multiplyScalar(distance)));
    controls?.update?.();
  }, [aspect, camera, controls]);
  return null;
}

export default function WorldScene({
  world,
  creations,
  mode,
  selectedId = null,
  onSelect,
  transformMode = "translate",
  onTransformCommit,
  placing = false,
  onPlace,
  autoRotate = false,
  reducedMotion,
  quality,
  snap = false,
  groundTool = null,
  onGroundTool,
  explorer = null,
}: WorldSceneProps) {
  const theme = THEMES[world.theme];
  const animate = !reducedMotion;
  const shadows = quality === "high";
  const editable = mode === "edit";
  const creationMap = useMemo(() => new Map(creations.map((c) => [c.id, c])), [creations]);
  const ghost = useRef<THREE.Mesh>(null);
  const cursor = useRef<THREE.Group>(null);
  const grounding = editable && !!groundTool;
  const showCursor = (x: number, y: number, z: number, color: string) => {
    const c = cursor.current;
    if (!c) return;
    c.visible = true;
    c.position.set(x, y + 0.03, z);
    c.children.forEach((m) => ((m as THREE.Mesh).material as THREE.MeshBasicMaterial).color.set(color));
  };
  const hideCursor = () => {
    if (cursor.current) cursor.current.visible = false;
  };
  const lastGizmoUse = useRef(0);
  const markGizmo = () => {
    lastGizmoUse.current = performance.now();
  };

  return (
    <Canvas
      shadows={shadows}
      dpr={shadows ? [1, 2] : [1, 1.25]}
      camera={{ position: [10, 8, 12], fov: 45, near: 0.1, far: 220 }}
      gl={{ antialias: shadows, powerPreference: "high-performance" }}
      frameloop={animate || editable ? "always" : "demand"}
      onPointerMissed={(e) => {
        if (e.type !== "click" || !editable) return;
        // Tapping a gizmo handle isn't a "miss" — keep the selection.
        if (performance.now() - lastGizmoUse.current < 400) return;
        onSelect?.(null);
      }}
    >
      <SkyDome top={theme.sky} bottom={theme.fog} glow={theme.accent} />
      <fog attach="fog" args={[theme.fog, 32, 100]} />
      {world.theme === "twilight" && <Stars radius={70} depth={25} count={shadows ? 700 : 300} factor={2.4} saturation={0.2} fade speed={animate ? 0.4 : 0} />}
      <hemisphereLight args={["#fff4fb", theme.rock, 1.35]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={2.6}
        color="#fff4e0"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-9, 5, -7]} intensity={0.8} color={theme.accent} />
      <Clouds color={theme.cloud} animate={animate} />
      <Islets theme={theme} animate={animate} />

      <FloatGroup animate={animate && !editable}>
        <TileIsland
          tiles={world.tiles}
          theme={theme}
          animate={animate}
          shadows={shadows}
          addMode={grounding && groundTool === "add"}
          handlers={
            editable
              ? {
                  onTileClick: (tile, point) => {
                    if (grounding) onGroundTool?.(tile.x, tile.z);
                    else if (placing) onPlace?.([point.x, tileTop(tile), point.z]);
                    else onSelect?.(null);
                  },
                  onTileHover: (tile, point) => {
                    if (grounding) {
                      if (tile && groundTool !== "add") showCursor(tile.x, tileTop(tile), tile.z, groundTool === "remove" ? "#fb7185" : "#fde68a");
                      else hideCursor();
                    }
                    if (placing && ghost.current) {
                      ghost.current.visible = !!tile;
                      if (tile && point) ghost.current.position.set(point.x, tileTop(tile) + 0.05, point.z);
                    }
                  },
                  onEmptyClick: (x, z) => onGroundTool?.(x, z),
                  onEmptyHover: (cell) => {
                    const ghost = cell && world.tiles.find((t) => Math.abs(t.x - cell[0]) + Math.abs(t.z - cell[1]) === 1);
                    if (cell) showCursor(cell[0], ghost ? ghost.h * 0.5 : 0, cell[1], "#67e8f9");
                    else hideCursor();
                  },
                }
              : undefined
          }
        />
        {explorer && <Explorer tiles={world.tiles} from={explorer.from} to={explorer.to} animate={animate} />}
        {world.objects.map((obj) => (
          <SceneObject
            key={obj.id}
            obj={obj}
            creation={obj.creationId ? creationMap.get(obj.creationId) : undefined}
            selected={obj.id === selectedId}
            editable={editable && !grounding}
            animate={animate}
            shadows={shadows}
            transformMode={transformMode}
            snap={snap}
            onSelect={onSelect}
            onCommit={onTransformCommit}
            onGizmoUse={markGizmo}
          />
        ))}
        {editable && placing && (
          <mesh ref={ghost} visible={false} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
            <ringGeometry args={[0.55, 0.8, 32]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} toneMapped={false} depthWrite={false} />
          </mesh>
        )}
        {grounding && (
          <group ref={cursor} visible={false}>
            {/* Square tile outline */}
            {[
              [0, 0.47, 1, 0.06],
              [0, -0.47, 1, 0.06],
              [0.47, 0, 0.06, 1],
              [-0.47, 0, 0.06, 1],
            ].map(([x, z, w, d], i) => (
              <mesh key={i} position={[x, 0, z]} raycast={() => null}>
                <boxGeometry args={[w, 0.05, d]} />
                <meshBasicMaterial color="#fde68a" toneMapped={false} />
              </mesh>
            ))}
          </group>
        )}
      </FloatGroup>

      {animate && <Sparkles count={shadows ? 60 : 25} scale={[16, 7, 16]} position={[0, 3, 0]} size={2.5} speed={0.25} color={theme.accent} />}

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        minDistance={6}
        maxDistance={34}
        maxPolarAngle={Math.PI * 0.62}
        target={[0, 0.5, 0]}
        autoRotate={autoRotate && animate}
        autoRotateSpeed={0.45}
      />
      <ResponsiveCamera />
    </Canvas>
  );
}
