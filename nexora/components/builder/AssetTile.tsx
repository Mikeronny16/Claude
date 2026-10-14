import {
  Castle, Fence, Flag, Flame, Flower2, Gem, Ghost, House, LampFloor, Lightbulb, Milestone, Mountain, Orbit, Shapes,
  Sprout, TreeDeciduous, TreePine, Wind,
} from "lucide-react";
import type { ObjectKind } from "@/lib/types";

const ICONS: Record<ObjectKind, typeof TreePine> = {
  pine: TreePine,
  roundTree: TreeDeciduous,
  mushroom: Sprout,
  flowers: Flower2,
  boulder: Mountain,
  cottage: House,
  tower: Castle,
  lighthouse: Lightbulb,
  windmill: Wind,
  fence: Fence,
  crystal: Gem,
  portal: Orbit,
  wisp: Ghost,
  runestone: Milestone,
  lantern: LampFloor,
  campfire: Flame,
  flag: Flag,
  custom: Shapes,
};

export function AssetGlyph({ kind, color, size = 44 }: { kind: ObjectKind; color: string; size?: number }) {
  const Icon = ICONS[kind];
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 25%, ${color}66, ${color}22 60%, rgba(10,8,40,0.6))`,
        boxShadow: `inset 0 0 0 1px ${color}55`,
      }}
      aria-hidden
    >
      <Icon size={size * 0.5} color={color} strokeWidth={2.2} />
    </span>
  );
}
