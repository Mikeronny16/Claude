"use client";
import { useEffect, useRef } from "react";

interface Props {
  color: number;
  children: React.ReactNode;
}

export default function VantaBackground({ color: _color, children }: Props) {
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0d0800" }}>
      {/* Velocity-style ambient glow from bottom */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "45vh",
        background: "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(255,107,0,0.16) 0%, rgba(255,107,0,0.06) 40%, transparent 100%)",
        zIndex: 0, pointerEvents: "none",
      }} />
      {/* Subtle top vignette */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "30vh",
        background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(255,107,0,0.04) 0%, transparent 100%)",
        zIndex: 0, pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
