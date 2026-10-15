import { Box, Castle, Cloud, Compass, Flame, House, Lightbulb, Mountain, Palette, PawPrint, Save, Shovel, Sparkles, Trees, WandSparkles } from "lucide-react";
import type { QuestIcon as QuestIconName } from "@/lib/quests";

const MAP = {
  sparkles: Sparkles,
  trees: Trees,
  home: House,
  lighthouse: Lightbulb,
  palette: Palette,
  flame: Flame,
  wand: WandSparkles,
  box: Box,
  save: Save,
  compass: Compass,
  castle: Castle,
  cloud: Cloud,
  shovel: Shovel,
  mountain: Mountain,
  paw: PawPrint,
} as const;

export function QuestIcon({ name, size = 20 }: { name: QuestIconName; size?: number }) {
  const Icon = MAP[name];
  return <Icon size={size} aria-hidden />;
}
