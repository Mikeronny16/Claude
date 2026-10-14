"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { WorldView } from "@/components/three/SceneLoader";
import { useReducedMotion } from "@/lib/hooks";
import { SHOWCASE_MAP } from "@/lib/showcase";
import { useNexora } from "@/lib/store";

export function HeroScene() {
  const reduced = useReducedMotion();
  const quality = useNexora((s) => s.settings.quality);
  return (
    <WorldView
      label="A floating island with a lighthouse, cottages and glowing lanterns, slowly turning"
      world={SHOWCASE_MAP["lantern-harbor"].world}
      creations={[]}
      mode="view"
      autoRotate
      reducedMotion={reduced}
      quality={quality}
    />
  );
}

export function LandingCta() {
  const hydrated = useNexora((s) => s.hydrated);
  const profile = useNexora((s) => s.profile);
  const returning = hydrated && !!profile;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href={returning ? "/world" : "/onboarding"} className="btn btn-gold px-6 text-base">
        {returning ? `Continue as ${profile.name}` : "Start your world"}
        <ArrowRight size={18} aria-hidden />
      </Link>
      {!returning && <span className="text-sm text-faint">Free · No sign-up · Takes 1 minute</span>}
    </div>
  );
}
