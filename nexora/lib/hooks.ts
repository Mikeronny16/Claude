"use client";

import { useSyncExternalStore } from "react";
import { levelProgress } from "./levels";
import { useNexora } from "./store";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True if the system asks for less motion OR the player turned it on in Profile. */
export function useReducedMotion(): boolean {
  const system = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  const setting = useNexora((s) => s.settings.reducedMotion);
  return system || setting;
}

export function useLevel() {
  const xp = useNexora((s) => s.progress.xp);
  return levelProgress(xp);
}
