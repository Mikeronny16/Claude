"use client";

/**
 * HeroSequence — the car-showroom hero.
 * Composes <ScrollImageSequence> (from the cinematic-scroll skill) with pinned
 * text beats that fade in over the car as it animates with scroll.
 *
 * Requires: components/ScrollImageSequence.tsx (copy from cinematic-scroll skill)
 *           car frames in /public/sequence/hero/  (see frame-generation.md)
 *           a poster image for the fallback / first paint.
 *
 *   npm i gsap @gsap/react
 */

import ScrollImageSequence from "./ScrollImageSequence";
import { Beat } from "./ScrollTextReveal";

type Props = {
  /** e.g. "/sequence/hero" */
  framesPath?: string;
  frameCount?: number;
  /** Static fallback shown on mobile / reduced-motion / first paint */
  posterSrc?: string;
  brand?: string;
  tagline?: string;
};

export default function HeroSequence({
  framesPath = "/sequence/hero",
  frameCount = 120,
  posterSrc = "/posters/hero.webp",
  brand = "AURELIA",
  tagline = "Engineered to be remembered",
}: Props) {
  return (
    <ScrollImageSequence
      basePath={framesPath}
      frameCount={frameCount}
      pattern="frame-{n}.webp"
      heightVh={400}            /* taller track = slower, more cinematic */
      fallbackSrc={posterSrc}
      className="bg-bg"
    >
      {/* Fixed brand wordmark, top-left */}
      <div className="pointer-events-none absolute left-6 top-6 z-10">
        <span className="font-display text-sm tracking-[0.3em] text-text/80">
          {brand}
        </span>
      </div>

      {/* Beats stacked over the pinned canvas. Each takes a viewport's worth
          of scroll, so they reveal in sequence as the car animates.
          They live in normal flow inside the pinned wrapper, layered absolutely. */}
      <div className="absolute inset-0 z-10">
        <Beat className="font-display text-text" align="center">
          {tagline}
        </Beat>
      </div>

      {/* Vignette to seat the car in the dark */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 60%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-widest text-text-dim">
        Scroll
      </div>
    </ScrollImageSequence>
  );
}

/**
 * MULTI-BEAT VARIANT (Apple/Terminal style):
 * If you want several headlines revealing across the scroll (not just one),
 * give the track more height and place beats as separate full-height blocks
 * in a column that scrolls PAST the pinned canvas. Pattern:
 *
 *   <section className="relative">
 *     <div className="sticky top-0 h-svh"> <canvas .../> </div>   // pinned
 *     <div className="relative z-10">
 *       <Beat>It starts with a shape.</Beat>
 *       <Beat>Then it starts to move.</Beat>
 *       <Beat>Then it’s yours.</Beat>
 *     </div>
 *   </section>
 *
 * For most builds, the single-component approach above is enough — add more
 * <Beat> children and bump heightVh.
 */
