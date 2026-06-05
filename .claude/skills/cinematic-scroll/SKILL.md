---
name: cinematic-scroll
description: Build Apple-style cinematic scroll experiences for Next.js where a numbered image sequence (rendered to a <canvas>) and pinned text reveals are driven by scroll position using GSAP ScrollTrigger. Use this skill whenever the user wants a scroll-driven product reveal, a 3D object that rotates/zooms/drives as you scroll, a "frame-by-frame" hero, or a landing page that looks like apple.com / the Terminal / Adaline sites. Covers generating the frames with AI (Veo / Gemini "Nano Banana" / fal.ai), the canvas + GSAP implementation, pinned scrolly-telling text, and performance fallbacks.
---

# Cinematic Scroll (image-sequence on scroll)

This skill recreates the "Apple website" effect: a 3D-looking object (a car, a truck, a bottle, a phone) that **rotates, zooms, or moves as the user scrolls**, with text that pins and reveals over it. The trick is NOT real-time 3D — it is a **pre-rendered numbered image sequence** (e.g. `frame-0001.webp` … `frame-0280.webp`) painted onto a `<canvas>`, with the current frame tied to scroll progress via **GSAP + ScrollTrigger**.

There are two halves to a project like this:
1. **Get the frames** — render or AI-generate a sequence of images of one object across one continuous camera move. See `references/frame-generation.md`.
2. **Wire the scroll** — paint the right frame on a canvas based on scroll. See `references/ScrollImageSequence.tsx`.
3. (Optional) **Scrolly text** — headlines that pin and fade in over the animation. See `references/ScrollTextReveal.tsx`.

## When to use this skill

Use it for: hero product reveals, car showrooms (car drives in / does a 360), real-estate fly-throughs, drink/food "ingredient" cinematics, phone/gadget launches, logistics/industrial sites. Do NOT use it for normal content pages, dashboards, or anything that needs real user interaction with the 3D object (in that case use `react-three-fiber` instead — an image sequence only plays forward/backward with scroll).

## Stack assumptions

Next.js 15 (App Router) + TypeScript + Tailwind. Animation via GSAP. Install:

```bash
npm i gsap @gsap/react
```

GSAP's ScrollTrigger is included in the `gsap` package. `@gsap/react` gives `useGSAP()`, which is a drop-in for `useEffect` that handles cleanup automatically (important — un-cleaned ScrollTriggers cause bugs on route change and in React strict mode).

## The core idea (read this before coding)

```
scroll progress 0 ───────────────────────────► 1
frame index      0001 ──────────────────────► 0280
```

A `frame` object holds a single number. GSAP tweens that number from `0` to `lastFrame` and `scrub`s it to the scroll position. On every update, round the number and `drawImage()` that frame onto the canvas. That's the whole effect.

```ts
const state = { frame: 0 };
gsap.to(state, {
  frame: images.length - 1,
  ease: "none",
  snap: "frame",
  scrollTrigger: {
    trigger: containerRef.current,
    start: "top top",
    end: "bottom bottom",
    scrub: 1,            // smooths the link between scroll and frame
    pin: canvasWrapRef.current,
    invalidateOnRefresh: true,
  },
  onUpdate: () => render(Math.round(state.frame)),
});
```

To implement, copy `references/ScrollImageSequence.tsx` into the project and adapt the props. It already handles the hard parts: preloading, device-pixel-ratio sharpness, `cover` fit, mobile/`prefers-reduced-motion` fallback, and progress UI.

## Best practices (these are not optional — they are what separates a pro result from a janky one)

- **Preload before reveal.** Never start a sequence in the very first viewport — the user arrives before frames load and sees a blank canvas (a "Flash-era loading" feel). Either place the sequence lower on the page, or show a loader/poster until frames are ready. The reference component reports load progress so you can gate the reveal.
- **Do NOT scroll-jack.** Let native scroll drive `scrub`. Never hijack the wheel or set `scroll` programmatically. The page must still scroll normally if JS fails.
- **Mobile + reduced-motion fallback.** On small screens / slow devices / `prefers-reduced-motion`, show a single static hero image instead of loading hundreds of frames. Apple does exactly this. The reference component does this automatically.
- **Pin the canvas, scroll a tall container.** The canvas wrapper is `position: sticky`/`pin`ned and sized to the viewport; the *container* around it is tall (e.g. `300vh`). Scroll distance = animation length. More container height = slower, more cinematic playback.
- **Use `webp` or `avif`, sized to display, not source.** 280 PNGs will be tens of MB. Convert to webp at the real on-screen resolution (~1600px wide max for full-bleed, often less). Target the whole sequence under ~6–10 MB. See `references/frame-generation.md` for the ffmpeg commands.
- **Frame count: 60–150 is usually plenty.** The Terminal/Apple sites use ~280, but 90–120 frames `scrub`bed at `1` already looks smooth. Fewer frames = faster load.
- **Sharp canvas:** scale the canvas backing store by `devicePixelRatio` and draw with a `cover` fit, or the image looks blurry on retina. The reference handles this.

## Build order (follow this)

1. Confirm the subject and the camera move (e.g. "car does a slow 360 then headlights turn on"). One continuous move, no cuts.
2. Get the frames into `public/sequence/` named `frame-0001.webp` … (zero-padded, see frame-generation.md).
3. Drop in `ScrollImageSequence.tsx`, point it at the folder, set `frameCount`.
4. Add the tall container + sticky canvas in the page.
5. Layer `ScrollTextReveal` sections on top for the storytelling beats.
6. Test on mobile, throttle the network, and check `prefers-reduced-motion`.

## Common mistakes to avoid

- Forgetting to clean up ScrollTriggers → use `useGSAP` (the reference does).
- Drawing on every `requestAnimationFrame` instead of only on `onUpdate` → wastes battery; only draw when the frame index actually changes.
- Loading frames one-by-one as you scroll → causes flicker. Preload (or at least pre-load a buffer) first.
- Hardcoding canvas size → must resize on `resize` and re-fit.
- Putting the sequence in the first 100vh with no loader → blank-screen-on-arrival.

See the three files in `references/` for working, commented, copy-pasteable code.
