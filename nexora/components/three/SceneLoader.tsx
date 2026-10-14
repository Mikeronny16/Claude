"use client";

import dynamic from "next/dynamic";
import { Component, useSyncExternalStore, type ReactNode } from "react";
import type { CreationSpec, Quality } from "@/lib/types";
import type { WorldSceneProps } from "./WorldScene";

function SceneSkeleton({ label }: { label: string }) {
  return (
    <div className="scene-skeleton" role="status" aria-live="polite">
      <div className="scene-skeleton__orb" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}

const WorldSceneLazy = dynamic(() => import("./WorldScene"), {
  ssr: false,
  loading: () => <SceneSkeleton label="Loading your island…" />,
});

const CreationPreviewLazy = dynamic(() => import("./CreationPreview"), {
  ssr: false,
  loading: () => <SceneSkeleton label="Loading preview…" />,
});

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

let webglCache: boolean | null = null;
const subscribe = () => () => {};
function useWebGL(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => (webglCache ??= detectWebGL()),
    () => null,
  );
}

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function NoWebGL({ detail }: { detail?: ReactNode }) {
  return (
    <div className="scene-fallback" role="note">
      <p className="font-display text-base">3D view unavailable</p>
      <p className="text-sm text-dim">
        Your browser couldn&apos;t start 3D graphics (WebGL). Everything else still works{detail ? " — " : "."}
        {detail}
      </p>
    </div>
  );
}

/** World view with a client-only canvas, a loading state and a no-WebGL fallback. */
export function WorldView({ label, fallbackDetail, ...props }: WorldSceneProps & { label: string; fallbackDetail?: ReactNode }) {
  const webgl = useWebGL();
  return (
    <div className="scene-frame" role="region" aria-label={label}>
      {webgl === null ? (
        <SceneSkeleton label="Loading your island…" />
      ) : webgl ? (
        <SceneBoundary fallback={<NoWebGL detail={fallbackDetail} />}>
          <WorldSceneLazy {...props} />
        </SceneBoundary>
      ) : (
        <NoWebGL detail={fallbackDetail} />
      )}
    </div>
  );
}

export function CreationView({ spec, reducedMotion, quality, label }: { spec: CreationSpec; reducedMotion: boolean; quality: Quality; label: string }) {
  const webgl = useWebGL();
  return (
    <div className="scene-frame" role="img" aria-label={label}>
      {webgl === null ? (
        <SceneSkeleton label="Loading preview…" />
      ) : webgl ? (
        <SceneBoundary fallback={<NoWebGL />}>
          <CreationPreviewLazy spec={spec} reducedMotion={reducedMotion} quality={quality} />
        </SceneBoundary>
      ) : (
        <NoWebGL />
      )}
    </div>
  );
}
