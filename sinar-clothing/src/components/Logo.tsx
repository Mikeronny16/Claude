interface LogoProps {
  variant?: "dark" | "light" | "color"
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function Logo({ variant = "color", size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 38, textX: 54, sinarSize: 20, clothingSize: 7, iconScale: 0.7 },
    md: { width: 160, height: 50, textX: 72, sinarSize: 26, clothingSize: 9, iconScale: 0.95 },
    lg: { width: 220, height: 70, textX: 100, sinarSize: 36, clothingSize: 12, iconScale: 1.3 },
  }

  const s = sizes[size]

  // Colors by variant
  const leafColor = variant === "dark" ? "#A7D9B5" : variant === "light" ? "#2D5A3D" : "#2D5A3D"
  const leafAccent = variant === "dark" ? "#6EC48A" : variant === "light" ? "#1A3D2B" : "#1A3D2B"
  const vineColor = variant === "dark" ? "#8BC4A0" : variant === "light" ? "#3D7A52" : "#3D7A52"
  const starColor = variant === "dark" ? "#FFD700" : variant === "light" ? "#2D5A3D" : "#2D5A3D"
  const textColor = variant === "dark" ? "#F5F0E8" : variant === "light" ? "#2D5A3D" : "#2D5A3D"
  const subtextColor = variant === "dark" ? "#A7D9B5" : variant === "light" ? "#3D7A52" : "#3D7A52"

  const iconX = 6
  const iconY = s.height / 2
  const sc = s.iconScale

  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox={`0 0 ${s.width} ${s.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sinar Clothing"
    >
      {/* ── Wing / leaf icon group ── */}
      <g transform={`translate(${iconX}, ${iconY}) scale(${sc})`}>
        {/* Large left leaf */}
        <path
          d="M-16,-14 C-20,-8 -22,0 -18,8 C-14,14 -6,16 0,12 C-4,6 -8,-2 -16,-14 Z"
          fill={leafColor}
          opacity="0.95"
        />
        {/* Large right leaf */}
        <path
          d="M16,-14 C20,-8 22,0 18,8 C14,14 6,16 0,12 C4,6 8,-2 16,-14 Z"
          fill={leafColor}
          opacity="0.9"
        />
        {/* Small center leaf (top) */}
        <path
          d="M0,-18 C-4,-12 -5,-6 0,-2 C5,-6 4,-12 0,-18 Z"
          fill={leafAccent}
          opacity="0.85"
        />
        {/* Inner leaf vein left */}
        <path
          d="M-14,-12 C-10,-5 -6,2 -2,10"
          stroke={leafAccent}
          strokeWidth="0.7"
          fill="none"
          opacity="0.6"
        />
        {/* Inner leaf vein right */}
        <path
          d="M14,-12 C10,-5 6,2 2,10"
          stroke={leafAccent}
          strokeWidth="0.7"
          fill="none"
          opacity="0.6"
        />
        {/* Curly vine stem */}
        <path
          d="M0,12 C2,16 4,18 2,22 C0,24 -3,22 -1,20"
          stroke={vineColor}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Small curl */}
        <path
          d="M2,22 C6,24 8,20 5,18"
          stroke={vineColor}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        {/* Star top-right */}
        <g transform="translate(18, -18)">
          <path
            d="M0,-4 L1,-1.5 L3.8,-1.5 L1.9,0.1 L2.4,3 L0,1.5 L-2.4,3 L-1.9,0.1 L-3.8,-1.5 L-1,-1.5 Z"
            fill={starColor}
            opacity="0.9"
          />
        </g>
        {/* Small leaf dot accent */}
        <circle cx="-8" cy="14" r="1.5" fill={leafAccent} opacity="0.5" />
        <circle cx="8" cy="14" r="1" fill={leafAccent} opacity="0.4" />
      </g>

      {/* ── Text: SINAR ── */}
      <text
        x={s.textX}
        y={s.height * 0.52}
        fontFamily="'Playfair Display', 'DM Serif Display', Georgia, serif"
        fontSize={s.sinarSize}
        fontWeight="900"
        letterSpacing="0.18em"
        fill={textColor}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        SINAR
      </text>

      {/* ── Text: CLOTHING ── */}
      <text
        x={s.textX}
        y={s.height * 0.84}
        fontFamily="'Inter', system-ui, sans-serif"
        fontSize={s.clothingSize}
        fontWeight="300"
        letterSpacing="0.45em"
        fill={subtextColor}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        CLOTHING
      </text>
    </svg>
  )
}
