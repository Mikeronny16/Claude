"use client";

import { OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { CreationSpec, Quality } from "@/lib/types";
import { SkyDome } from "./Island";
import { CreationModel } from "./models";

export default function CreationPreview({ spec, reducedMotion, quality }: { spec: CreationSpec; reducedMotion: boolean; quality: Quality }) {
  const animate = !reducedMotion;
  return (
    <Canvas
      shadows={quality === "high"}
      dpr={quality === "high" ? [1, 2] : [1, 1.25]}
      camera={{ position: [3.6, 2.8, 4.4], fov: 42 }}
      frameloop={animate ? "always" : "demand"}
    >
      <SkyDome top="#0b0a2b" bottom="#1e1b4b" />
      <hemisphereLight args={["#c7d2fe", "#1e1b4b", 1.2]} />
      <directionalLight position={[4, 8, 5]} intensity={2.2} castShadow={quality === "high"} />
      <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#22d3ee" />
      <group position={[0, -0.9, 0]}>
        <CreationModel spec={spec} animate={animate} shadows={quality === "high"} />
        <mesh position={[0, -0.12, 0]} receiveShadow>
          <cylinderGeometry args={[1.9, 2.1, 0.24, 40]} />
          <meshStandardMaterial color="#312e81" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.75, 1.85, 48]} />
          <meshBasicMaterial color="#fbbf24" toneMapped={false} />
        </mesh>
      </group>
      {animate && <Sparkles count={30} scale={[5, 4, 5]} size={2.5} speed={0.3} color="#a78bfa" />}
      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={10} autoRotate={animate} autoRotateSpeed={1.2} target={[0, 0.4, 0]} />
    </Canvas>
  );
}
