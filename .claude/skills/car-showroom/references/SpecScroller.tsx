"use client";

/**
 * SpecScroller — big spec numbers that count up as they enter the viewport.
 * GSAP drives the count tied to scroll. Tabular figures so digits don't jitter.
 *
 *   npm i gsap @gsap/react
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Spec = { label: string; value: number; suffix?: string; decimals?: number };

const DEFAULT_SPECS: Spec[] = [
  { label: "Horsepower", value: 503, suffix: " hp" },
  { label: "0–100 km/h", value: 3.4, suffix: " s", decimals: 1 },
  { label: "Range", value: 612, suffix: " km" },
  { label: "Top speed", value: 250, suffix: " km/h" },
];

export default function SpecScroller({ specs = DEFAULT_SPECS }: { specs?: Spec[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const nums = root.current?.querySelectorAll<HTMLElement>("[data-num]") ?? [];
    nums.forEach((el) => {
      const target = parseFloat(el.dataset.num || "0");
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        ease: "power1.out",
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 45%", scrub: true },
        onUpdate: () => {
          el.textContent = obj.v.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
        },
      });
    });
  }, { scope: root });

  return (
    <section ref={root} className="bg-bg px-6 py-28 md:py-40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-16 md:grid-cols-4">
        {specs.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display tabular-nums text-text"
                 style={{ fontSize: "clamp(3rem, 9vw, 7rem)", lineHeight: 1 }}>
              <span data-num={s.value} data-decimals={s.decimals ?? 0}>0</span>
              <span className="text-accent">{s.suffix}</span>
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.25em] text-text-dim">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
