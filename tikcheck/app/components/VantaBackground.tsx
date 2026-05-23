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
        const VANTA = (await import("vanta/dist/vanta.net.min.js")).default;
        if (cancelled || !bgRef.current) return;

        effectRef.current = VANTA({
          el: bgRef.current,
          THREE,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          color: color,
          backgroundColor: 0x0d0800,
          points: 9,
          maxDistance: 22,
          spacing: 20,
          showDots: true,
        });
      } catch {
        // Fallback: keep warm dark background
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
      {/* Ambient bottom glow — Velocity style */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "38vh",
        background: "radial-gradient(ellipse 85% 65% at 50% 100%, rgba(255,107,0,0.13) 0%, transparent 100%)",
        zIndex: 0, pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
