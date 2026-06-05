# Getting the frames

The whole effect lives or dies on the frame sequence: **one object, one continuous camera move, no cuts.** You have three ways to make it.

## Option A — AI video, then split into frames (fastest, what the tutorial uses)

This is the Veo 3 / Gemini "Nano Banana" route. You already have this workflow.

1. **Make a clean product image** (or use a photo). White/neutral background or your scene.
2. **Generate a short video** of ONE camera move with an image-to-video model (Veo 3, Kling, Runway, or via fal.ai). Prompt the *camera*, not cuts:
   - Car showroom: *"Slow 360° orbit around a parked car, studio lighting, fixed object, smooth continuous camera move, no cuts, 5 seconds"*
   - Zoom reveal: *"Camera slowly dollies out from a close-up of the grille to reveal the whole car, continuous, no cuts"*
   - Keep it **3–6 seconds**. Longer = more frames = heavier page.
3. **Mute it** — you don't need the AI audio at all here (frames only).
4. **Split into a numbered sequence** with ffmpeg:

```bash
# ~24 frames/sec from a 5s clip ≈ 120 frames. Adjust fps to control count.
ffmpeg -i clip.mp4 -vf "fps=24,scale=1600:-1" -q:v 3 public/sequence/frame-%04d.png
```

`%04d` gives `frame-0001.png … frame-0120.png` — matches the component's default pattern.

## Option B — Render from a real 3D model (sharpest, most control)

If you have a `.glb`/Blender model: animate a camera over N frames and render `frame-0001.png …`. A 3D designer can hand these to you. This gives perfect, repeatable, high-res frames. Same naming, same ffmpeg conversion to webp below.

## Option C — Photograph a real object on a turntable

Put the object on a lazy-Susan, lock the camera, shoot every few degrees (or shoot a video and split it like Option A). Great for real products you actually sell.

---

## Always: optimize the frames (do not ship PNGs)

280 PNGs can be 40+ MB. Convert to webp at display size and the whole sequence drops to a few MB.

```bash
# Convert the PNG sequence to webp, ~1600px wide, good quality
cd public/sequence
for f in frame-*.png; do
  cwebp -q 80 -resize 1600 0 "$f" -o "${f%.png}.webp"
done
rm frame-*.png
```

Or in one ffmpeg pass straight from the video to webp:

```bash
ffmpeg -i clip.mp4 -vf "fps=24,scale=1600:-1" -q:v 70 public/sequence/frame-%04d.webp
```

Targets:
- Whole sequence under **~6–10 MB** total.
- **60–150 frames** is plenty (don't chase 280 unless you need it).
- Width = the largest it'll display at, usually ≤1600px. For a half-width section, 1000px is fine.

## Naming = the contract

The component builds URLs as `${basePath}/frame-{n}.webp` with `{n}` zero-padded to 4 digits. So files must be:

```
public/sequence/frame-0001.webp
public/sequence/frame-0002.webp
...
public/sequence/frame-0120.webp
```

If your tool pads differently (e.g. 3 digits), pass `pad={3}`; if it uses a different name, pass `pattern="img_{n}.webp"`.

## Sanity checklist before wiring scroll

- [ ] Frames are sequential with no gaps (0001, 0002, 0003 …).
- [ ] First and last frame look good as a static poster (the fallback).
- [ ] Total folder size is small (check with `du -sh public/sequence`).
- [ ] The motion is ONE continuous move — scrubbing it forward/back looks natural.
