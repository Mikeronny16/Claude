import type { Category } from "@/lib/products"

// Hand-drawn clothes used for category bubbles, banners and empty states.
// <GarmentDefs /> must be rendered once on the page (AppShell does it).

type Kind = "top" | "dress" | "cardi" | "jeans" | "sweater" | "maxi"

const SHAPES: Record<Kind, { shape: string; fill: string; edge: string }> = {
  top: {
    shape: "M37 22 Q50 31 63 22 L79 27 Q91 31 93 46 Q86 52 79 50 L73 44 L73 110 Q50 116 27 110 L27 44 L21 50 Q14 52 7 46 Q9 31 21 27 Z",
    fill: "url(#g-floral)",
    edge: "#C99A92",
  },
  dress: {
    shape: "M39 21 Q50 31 61 21 L64 26 L65 50 Q72 72 86 122 Q50 130 14 122 Q28 72 35 50 L36 26 Z",
    fill: "url(#g-pleat)",
    edge: "#CF8CA1",
  },
  cardi: {
    shape: "M37 21 L50 42 L63 21 L80 26 Q90 31 92 46 L95 106 L83 108 L77 54 L77 116 L23 116 L23 54 L17 108 L5 106 L8 46 Q10 31 20 26 Z",
    fill: "url(#g-knit)",
    edge: "#A3865F",
  },
  jeans: {
    shape: "M28 20 L72 20 L79 124 L57 124 L50 60 L43 124 L21 124 Z",
    fill: "url(#g-denim)",
    edge: "#3B577A",
  },
  sweater: {
    shape: "M38 22 Q50 30 62 22 L80 27 Q89 32 91 47 L95 101 L83 103 L77 55 L77 112 L23 112 L23 55 L17 103 L5 101 L9 47 Q11 32 20 27 Z",
    fill: "url(#g-rib)",
    edge: "#C2B392",
  },
  maxi: {
    shape: "M40 20 Q50 29 60 20 L62 44 Q73 72 91 124 Q50 132 9 124 Q27 72 38 44 Z",
    fill: "url(#g-gingham)",
    edge: "#D4A93C",
  },
}

export const CATEGORY_GARMENT: Record<Category, Kind> = {
  Tops: "top",
  Dresses: "dress",
  Cardigans: "cardi",
  Jeans: "jeans",
  Sweaters: "sweater",
}

export function Garment({ kind, className, strokeWidth = 2 }: { kind: Kind; className?: string; strokeWidth?: number }) {
  const g = SHAPES[kind]
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true" style={{ overflow: "visible" }}>
      <path d={g.shape} fill={g.fill} stroke={g.edge} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d={g.shape} fill="url(#g-shade)" />
    </svg>
  )
}

export function GarmentDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="g-floral" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#FAF1E6" />
          <circle cx="6" cy="3.8" r="2" fill="#EB9DAE" />
          <circle cx="8.2" cy="6" r="2" fill="#EB9DAE" />
          <circle cx="6" cy="8.2" r="2" fill="#EB9DAE" />
          <circle cx="3.8" cy="6" r="2" fill="#EB9DAE" />
          <circle cx="6" cy="6" r="1.3" fill="#F5C766" />
          <path d="M15 18 Q18 14 21 18 Q18 22 15 18 Z" fill="#9CC19D" />
          <circle cx="18.5" cy="8.5" r="1.2" fill="#E77F96" />
        </pattern>
        <pattern id="g-knit" width="8" height="10" patternUnits="userSpaceOnUse">
          <rect width="8" height="10" fill="#D9C2A2" />
          <path d="M0 0 L4 5 L8 0 M0 5 L4 10 L8 5" fill="none" stroke="#C2A67F" strokeWidth="1.3" />
        </pattern>
        <pattern id="g-denim" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <rect width="5" height="5" fill="#5C7EA7" />
          <rect width="2" height="5" fill="#4D6E95" />
        </pattern>
        <pattern id="g-pleat" width="9" height="9" patternUnits="userSpaceOnUse">
          <rect width="9" height="9" fill="#F4C6D2" />
          <rect width="3" height="9" fill="#ECB2C2" />
        </pattern>
        <pattern id="g-rib" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#F2EBDD" />
          <rect width="2" height="6" fill="#E4D9C3" />
        </pattern>
        <pattern id="g-gingham" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#FFF7DA" />
          <rect width="6" height="12" fill="#FFD976" opacity="0.65" />
          <rect width="12" height="6" fill="#FFD976" opacity="0.65" />
        </pattern>
        <linearGradient id="g-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.14" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.68" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" />
    </svg>
  )
}
