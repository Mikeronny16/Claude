"use client";

/**
 * ScrollTextReveal
 * ----------------
 * The headline beats that fade/blur in over the cinematic sequence
 * (like "We have reinvented the future of logistics" on the Terminal site).
 *
 * Put these as `children` of <ScrollImageSequence> so they sit pinned on top
 * of the canvas, OR use standalone anywhere on the page.
 *
 * Each <Beat> fades from blurred + transparent to sharp as it enters view,
 * with a staggered word reveal. No scroll-jacking — pure ScrollTrigger.
 *
 *   npm i gsap @gsap/react
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Beat({
  children,
  className = "",
  align = "center",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");

    gsap.fromTo(
      words,
      { opacity: 0, filter: "blur(12px)", y: 24 },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "top 35%",
          scrub: true,
        },
      }
    );
  }, { scope: ref });

  const justify =
    align === "left" ? "justify-start text-left"
    : align === "right" ? "justify-end text-right"
    : "justify-center text-center";

  // Split children string into animatable words. For rich content, pass an
  // array of words or wrap your own [data-word] spans.
  const content =
    typeof children === "string"
      ? children.split(" ").map((w, i) => (
          <span key={i} data-word className="inline-block">
            {w}&nbsp;
          </span>
        ))
      : children;

  return (
    <div className={`pointer-events-none flex min-h-svh items-center px-6 ${justify} ${className}`}>
      <div ref={ref} className="max-w-3xl text-balance">
        {content}
      </div>
    </div>
  );
}

/**
 * Example usage on top of the canvas:
 *
 * <ScrollImageSequence basePath="/sequence" frameCount={120} heightVh={400}>
 *   <div className="absolute inset-0">
 *     <Beat className="text-5xl md:text-7xl font-semibold text-white">
 *       The future of how you arrive
 *     </Beat>
 *   </div>
 * </ScrollImageSequence>
 *
 * Note: when used INSIDE ScrollImageSequence the canvas is pinned, so stack
 * multiple <Beat>s in a normal-flow column elsewhere on the page if you want
 * them to scroll past a pinned canvas.
 */
