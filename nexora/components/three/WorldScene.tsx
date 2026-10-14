"use client";

import { OrbitControls, Sparkles, Stars, TransformControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { THEMES } from "@/lib/catalog";
import type { ObjectPatch } from "@/lib/store";
import type { Creation, Quality, Vec3, World, WorldObject } from "@/lib/types";
import { Island, SkyDome } from "./Island";
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
}: WorldSceneProps) {
  const theme = THEMES[world.theme];
  const animate = !reducedMotion;
  const shadows = quality === "high";
  const editable = mode === "edit";
  const creationMap = useMemo(() => new Map(creations.map((c) => [c.id, c])), [creations]);
  const ghost = useRef<THREE.Mesh>(null);
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
      <fog attach="fog" args={[theme.fog, 26, 80]} />
      <Stars radius={70} depth={25} count={shadows ? 1800 : 700} factor={3.2} saturation={0.4} fade speed={animate ? 0.5 : 0} />
      <hemisphereLight args={["#c7d2fe", "#1e1b4b", 1.1]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={2.2}
        color="#fff1e0"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-9, 5, -7]} intensity={0.9} color={theme.accent} />

      <FloatGroup animate={animate && !editable}>
        <Island
          theme={theme}
          animate={animate}
          shadows={shadows}
          onGroundClick={
            editable
              ? (local) => {
                  if (placing) onPlace?.([local.x, 0, local.z]);
                  else onSelect?.(null);
                }
              : undefined
          }
          onGroundHover={
            editable && placing
              ? (local) => {
                  if (!ghost.current) return;
                  ghost.current.visible = !!local;
                  if (local) ghost.current.position.set(local.x, 0.05, local.z);
                }
              : undefined
          }
        />
        {world.objects.map((obj) => (
          <SceneObject
            key={obj.id}
            obj={obj}
            creation={obj.creationId ? creationMap.get(obj.creationId) : undefined}
            selected={obj.id === selectedId}
            editable={editable}
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
