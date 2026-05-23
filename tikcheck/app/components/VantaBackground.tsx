"use client";
import { useEffect, useRef } from "react";

interface Props {
  color: number;
  children: React.ReactNode;
}

export default function VantaBackground({ color, children }: Props) {
  const bgRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<any>(null);

  useEffect(() => {
    if (!bgRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const THREE = await import("three");
        // @ts-expect-error vanta has no types
        const VANTA = (await import("vanta/dist/vanta.fog.min.js")).default;
        if (cancelled || !bgRef.current) return;

        effectRef.current = VANTA({
          el: bgRef.current,
          THREE,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          highlightColor: color,
          midtoneColor: 0x0a0010,
          lowlightColor: 0x000000,
          baseColor: 0x000000,
          blurFactor: 0.72,
          speed: 0.7,
          zoom: 0.9,
        });
      } catch {
        // Fallback: keep black background
      }
    })();

    return () => {
      cancelled = true;
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, [color]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div
        ref={bgRef}
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
