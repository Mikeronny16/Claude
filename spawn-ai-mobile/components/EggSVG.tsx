import { View } from "react-native"
import Svg, { Ellipse, Defs, RadialGradient, Stop, Text as SvgText, Line } from "react-native-svg"

type Props = { tier?: string; size?: number }

const COLORS: Record<string, { top: string; mid: string; bot: string; glow: string }> = {
  common:  { top: "#fde68a", mid: "#f59e0b", bot: "#d97706", glow: "#f59e0b" },
  rare:    { top: "#c7d2fe", mid: "#818cf8", bot: "#4f46e5", glow: "#818cf8" },
  epic:    { top: "#f5d0fe", mid: "#a855f7", bot: "#7c3aed", glow: "#a855f7" },
  mythic:  { top: "#fbcfe8", mid: "#ec4899", bot: "#6d28d9", glow: "#ec4899" },
}

export function EggSVG({ tier = "common", size = 80 }: Props) {
  const c = COLORS[tier] ?? COLORS.common
  const id = `eg-${tier}`
  const h = size * 1.2

  return (
    <View style={{ shadowColor: c.glow, shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 0 } }}>
      <Svg width={size} height={h} viewBox="0 0 100 120">
        <Defs>
          <RadialGradient id={id} cx="40%" cy="30%" r="65%">
            <Stop offset="0%" stopColor={c.top} />
            <Stop offset="60%" stopColor={c.mid} />
            <Stop offset="100%" stopColor={c.bot} />
          </RadialGradient>
          <RadialGradient id={`${id}-s`} cx="35%" cy="25%" r="25%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#${id})`} />
        <Ellipse cx="50" cy="65" rx="38" ry="50" fill={`url(#${id}-s)`} />
        {tier === "rare" && (
          <>
            <Line x1="34" y1="55" x2="66" y2="55" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            <Line x1="30" y1="68" x2="70" y2="68" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          </>
        )}
        {tier === "mythic" && (
          <>
            <SvgText x="28" y="52" fontSize="12" fill="rgba(255,255,255,0.6)">✦</SvgText>
            <SvgText x="60" y="72" fontSize="8" fill="rgba(255,255,255,0.5)">✦</SvgText>
          </>
        )}
        <Ellipse cx="38" cy="42" rx="8" ry="5" fill="rgba(255,255,255,0.35)" rotation="-20" originX="38" originY="42" />
      </Svg>
    </View>
  )
}
