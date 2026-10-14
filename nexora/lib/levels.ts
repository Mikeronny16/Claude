const TITLES = ["Spark", "Dreamer", "Shaper", "Builder", "Architect", "Worldsmith", "Legend", "Mythmaker"];

/** Total XP needed to reach a level: L2 = 100, L3 = 300, L4 = 600, L5 = 1000 … */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

export function levelTitle(level: number): string {
  return TITLES[Math.min(level, TITLES.length) - 1];
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  return {
    level,
    title: levelTitle(level),
    current: xp - floor,
    needed: ceil - floor,
    ratio: (xp - floor) / (ceil - floor),
  };
}
