"use client";

/**
 * ScrollImageSequence
 * -------------------
 * Apple-style scroll-driven image sequence rendered to a <canvas>.
 * A numbered set of frames (frame-0001.webp ... frame-0280.webp) is preloaded,
 * then the current frame is tied to scroll progress with GSAP ScrollTrigger.
 *
 * Drop this in, point `basePath` at a folder of zero-padded frames in /public,
 * set `frameCount`, and put it inside a tall section.
 *
 *   npm i gsap @gsap/react
 *
 * Layout it expects (the component renders this for you):
 *   <section style={{ height: `${heightVh}vh` }}>     // tall scroll track
 *     <div sticky h-screen>                            // pinned viewport
 *       <canvas />                                      // the frames
 *       {children}                                      // your pinned text overlays
 *     </div>
 *   </section>
 */

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  /** Folder under /public, e.g. "/sequence". Frames must be there. */
  basePath: string;
  /** How many frames total. */
  frameCount: number;
  /** File pattern. {n} is replaced by the zero-padded index. Default: "frame-{n}.webp" */
  pattern?: string;
  /** Zero-padding width. Default 4 -> 0001. */
  pad?: number;
  /** Height of the scroll track in vh. Bigger = slower, more cinematic. Default 300. */
  heightVh?: number;
  /** Static image shown on mobile / reduced-motion instead of the sequence. */
  fallbackSrc?: string;
  /** Pinned overlay content (headlines, etc). */
  children?: React.ReactNode;
  className?: string;
};

const frameUrl = (base: string, pattern: string, pad: number, i: number) =>
  `${base}/${pattern.replace("{n}", String(i).padStart(pad, "0"))}`;

export default function ScrollImageSequence({
  basePath,
  frameCount,
  pattern = "frame-{n}.webp",
  pad = 4,
  heightVh = 300,
  fallbackSrc,
  children,
  className = "",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawn = useRef<number>(-1);
  const [progress, setProgress] = useState(0); // 0..1 load progress
  const [ready, setReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  /** Draw a frame with a "cover" fit, DPR-aware for retina sharpness. */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // cover fit
    const ir = img.width / img.height;
    const cr = cw / ch;
    let dw = cw, dh = ch, dx = 0, dy = 0;
    if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; }
    else { dw = cw; dh = cw / ir; dy = (ch - dh) / 2; }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawn.current = index;
  }, []);

  useGSAP(() => {
    // ---- Fallback decision: small screen, no JS-heavy motion wanted, or slow ----
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    if (reduced || small) { setUseFallback(true); return; }

    // ---- Preload all frames, reporting progress ----
    let loaded = 0;
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = frameUrl(basePath, pattern, pad, i);
      img.onload = img.onerror = () => {
        if (cancelled) return;
        loaded++;
        setProgress(loaded / frameCount);
        if (loaded === frameCount) {
          setReady(true);
          drawFrame(0);
          ScrollTrigger.refresh();
        }
      };
      imgs[i - 1] = img;
    }
    imagesRef.current = imgs;

    // ---- Tie a single number to scroll, draw on change only ----
    const state = { frame: 0 };
    const tween = gsap.to(state, {
      frame: frameCount - 1,
      ease: "none",
      snap: "frame",
      scrollTrigger: {
        trigger: trackRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: stickyRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        const i = Math.round(state.frame);
        if (i !== lastDrawn.current) drawFrame(i);
      },
    });

    const onResize = () => drawFrame(lastDrawn.current < 0 ? 0 : lastDrawn.current);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, { dependencies: [basePath, frameCount, pattern, pad], scope: trackRef });

  // ---- Static fallback ----
  if (useFallback) {
    return (
      <section className={`relative ${className}`} style={{ minHeight: "100svh" }}>
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          {fallbackSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fallbackSrc} alt="" className="h-full w-full object-cover" />
          )}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section ref={trackRef} className={`relative ${className}`} style={{ height: `${heightVh}vh` }}>
      <div ref={stickyRef} className="sticky top-0 h-svh w-full overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full block" />

        {/* Loader — gate the reveal until frames are in */}
        {!ready && (
          <div className="absolute inset-0 grid place-items-center bg-black text-white">
            <div className="w-48 text-center">
              <div className="mb-3 text-xs tracking-widest uppercase opacity-70">Loading</div>
              <div className="h-px w-full bg-white/20">
                <div className="h-full bg-white transition-[width] duration-150"
                     style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            </div>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
