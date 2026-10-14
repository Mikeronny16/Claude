import { useId } from "react";

export function LogoMark({ size = 32 }: { size?: number }) {
  // Unique ids: the logo renders in several places and a hidden copy would
  // otherwise "own" the gradient and leave the visible ones blank.
  const id = useId().replace(/:/g, "");
  const top = `nx-top-${id}`;
  const rock = `nx-rock-${id}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable="false">
      <defs>
        <linearGradient id={top} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id={rock} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4338ca" />
          <stop offset="1" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="24" rx="24" ry="9" fill={`url(#${top})`} />
      <path d="M8 24 C 14 38, 24 52, 32 60 C 40 52, 50 38, 56 24 C 48 30, 16 30, 8 24 Z" fill={`url(#${rock})`} />
      <path d="M32 6 L36 16 L32 22 L28 16 Z" fill="#fde68a" />
      <circle cx="32" cy="58" r="2.5" fill="#22d3ee" />
    </svg>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span className="font-display text-lg font-bold tracking-[0.18em] text-gradient">NEXORA</span>
    </span>
  );
}
