# OpenCut Studio — handoff

State of the work for whoever picks it up next (a person or a new Claude
session). Branch `claude/opencut-studio` of `github.com/Mikeronny16/Claude`,
folder `opencut-studio/`. Last updated 2026-10-15 (on Windows 11).

## What this is

An AI-first desktop video editor for Mike Ronny, built on
[OpenCut-app/opencut-classic](https://github.com/OpenCut-app/opencut-classic)
at `cf5e79e9` (MIT, archived upstream). Not affiliated with OpenCut.

- `apps/web/` — the editor (Next.js 16, React 19, Tailwind 4, zustand). Core
  logic is framework-free TypeScript: `src/core/managers/*` (EditorCore),
  `src/commands/*` (53 undoable commands, `BatchCommand`), renderer in
  `src/services/renderer/*` (WASM compositor from `opencut-wasm`).
- `apps/studio/` — the desktop app (Electron 44). `src/main.ts` window,
  security, export save dialog; `src/server.ts` runs the editor's Next
  standalone server in a utility process on a free loopback port;
  `src/protocol.ts` serves it as `app://studio` (stable origin, so
  IndexedDB/OPFS projects survive relaunches; `/` redirects to `/projects`).
- `rust/` — compositor, effects, masks, time math (compiled to `opencut-wasm`;
  the app uses the npm package 0.2.10, not a local build).

The repo-root `CLAUDE.md` / `MIKE_CONTEXT.md` describe Mike's other projects
(Spawn AI etc.). For OpenCut Studio, follow this file and `AGENTS.md` here.

## Run it

```bash
cd opencut-studio
bun install                       # also downloads Electron (apps/studio postinstall)
bun run dev:web                   # editor in the browser: http://localhost:3000/projects
# desktop app:
cd apps/studio && bun run build && bun run start
```

No env vars, accounts, database or cloud services are needed.

## Checks

```bash
bun test                              # from opencut-studio/: 221/225 pass
cd apps/web && bunx tsc --noEmit -p tsconfig.json
cd apps/studio && bunx tsc --noEmit -p tsconfig.json
cd apps/studio && bun run build && bun run test:e2e      # Linux headless: xvfb-run -a bun run test:e2e
cd apps/studio && bun run screenshots -- <dir>           # THEMES=dark (default: light,dark)
BASE_URL=http://localhost:3000 bun run screenshots -- <dir>   # same tour on dev:web, no build
```

- Windows: Bun from winget (`Oven-sh.Bun`) has no `bunx` on PATH; use `bun x`.
  The first e2e run after a fresh build timed out waiting for the window once
  (likely antivirus scanning the new files); the rerun passed.
- If `dev:web` in the browser runs old code, check DevTools → Application →
  Service workers: another project served on localhost:3000 had registered a
  `sw.js` that cached OpenCut's chunks. Unregister it (the editor has none).

- The 4 failing unit tests predate this work: 2 mask-snapping assertions
  (`src/masks/__tests__/snap.test.ts`), 1 needs a canvas for text measuring,
  1 feeds fractional ticks to `mediaTime` (`src/timeline/placement/__tests__/resolve.test.ts`).
- e2e (`apps/studio/e2e/editor-flow.e2e.ts`) drives the built app: create
  project, import, add to timeline, preview pixels, Effects panel doesn't hijack
  the preview, Titanium Dial keys + undo, play, undo/redo, MP4 export
  checked with ffprobe, Manrope UI
  font loaded, relaunch with project/thumbnail/timeline intact. Passes on
  Linux under Xvfb and on Windows 11. Needs `ffmpeg`/`ffprobe` on PATH; so
  does `screenshots`.
- Run Playwright via `bun run test:e2e`, not `npx playwright` (npx picked up a
  second copy). Playwright emulates a light colour scheme unless `colorScheme`
  is set. E2E files are `*.e2e.ts` so `bun test` skips them.
- ESLint errors that remain in touched files are pre-existing
  (`auth/server.ts` RateLimit cast, `project-manager.ts` sort cast,
  `wasm-compositor.ts` frame-profile cast).

## Done (commits on the branch, oldest first)

1. Import of opencut-classic, unmodified.
2. Made it build: restored `isShortcutKey`/`isActionWithOptionalArgs`; fixed
   storage migrations and sticker registration that called object-arg APIs
   positionally (migrations opened a DB named "undefined"); test preload for
   the bundler-target WASM (`script/bun-test-wasm-preload.ts`).
3. Cloud services optional (`src/env/web.ts`: only NODE_ENV required; auth,
   feedback, sound search return 503 when unconfigured).
4. Analytics opt-in (`NEXT_PUBLIC_DATABUDDY_CLIENT_ID`); accessible "Add to
   timeline" button; media card label truncation fix.
5. Electron app + e2e.
6. Effect thumbnails no longer replace the preview (shared WebGL canvas;
   `wasmCompositor.markSharedCanvasUsed` + size restore).
7. Branding: OpenCut Studio name/logo (`public/logos/opencut-studio/logo.svg`,
   placeholder), onboarding copy, feedback button hidden unless
   `NEXT_PUBLIC_FEEDBACK_ENABLED=true`, "imported" wording, project thumbnails
   refreshed on autosave (480px JPEG, none for empty timelines).
8. Design system: `data-palette` (classic/ocean/graphite/aurora),
   `data-font` (inter/jakarta/manrope/bricolage), `data-corners`
   (sharp/medium/round/extra-round) on `<html>`; tokens at the end of
   `apps/web/src/app/globals.css`; registry, presets and storage in
   `apps/web/src/design/designs.ts`; picker (🎨 in editor and projects headers)
   in `apps/web/src/design/components/design-picker.tsx`. Default is Classic.
9. Fixes found on Windows: the preview went black whenever an effect clip was
   on the timeline (opencut-wasm wants `effect_pass_groups` in snake_case for
   scene effects; mapped in `wasm-compositor.ts`); the desktop build failed
   with EPERM copying the standalone server's junctions (`prepare-server.ts`
   recreates them inside `build/server`).
10. Design chosen by Mike: Ocean palette + Manrope + Round corners, now the
   only design. Picker, `src/design/` and the other palettes/fonts removed.
   (Superseded by 11.)
11. Orbit / Titanium design from Mike's brief (locked choices: Orbit
   Workspace, Orbit Navigation, Titanium Dial, Spatial Orbit Timeline,
   Spatial Lift, Floating Cinema, Orbital Architecture, Minimal Premium
   Titanium, Orbital Signature; lighting Soft Cinematic Titanium):
   - Tokens: `--ti-*` on `:root` and the closing Titanium section of
     `globals.css`; silver is the one accent; muted text #8a929c (the brief's
     #777f89 is under 4.5:1 on panels). Dark is the default theme.
   - Orbital Architecture: edge rings on `.dark body`; `.orbit-rings` helper.
   - Orbital Signature: `public/logos/opencut-studio/logo.svg` (emblem) and
     `icon.svg` (app icon; favicon, `public/icons/*`, and
     `apps/studio/assets/icon.png` are rendered from it). Header wordmark and
     format chip; projects header; branded loading screens.
   - Orbit Navigation: `components/editor/panels/assets/tabbar.tsx`, now a
     full-height column in the editor page; Projects (`useExitProject`) and
     Export (`useExportPopoverStore`) at the ends.
   - Floating Cinema: bezel + stage in `preview/components/index.tsx`;
     fit-to-view margin in `preview-viewport.tsx`.
   - Spatial Lift: `.spatial-lift` on selected clips (`timeline-element.tsx`).
   - Titanium Dial: `src/titanium-dial/` (math + tests, targets, control,
     panel beside the timeline). Focused sliders keep arrow/Page/Home/End
     keys (`actions/use-keybindings.ts`).

## Known limitations

- MP4 audio is Opus: Electron's WebCodecs on Linux has no AAC encoder (not yet
  checked on Windows/macOS).
- HEVC import doesn't decode in Electron on Linux.
- Projects and media live in browser storage (IndexedDB/OPFS), not files.
- No installers yet. Tested on Linux and Windows 11; not on macOS.
- `build/server` on Windows uses junctions with absolute paths, so it can't be
  moved as is; the installer step must copy it with that in mind.
- The Rust source in `rust/crates/compositor/src/frame.rs` still has the
  snake_case `SceneEffect` field; a local WASM rebuild must keep it (or change
  `wasm-compositor.ts` with it).
- Titanium Dial: shown at xl widths (1280px+); below that use the Inspector.
  No Speed on the dial (retime isn't a param yet).
- Light mode keeps the classic surfaces with a graphite accent; the Titanium
  design is dark-first.
- Transitions and Adjustment sections are placeholders (marked "coming soon").
- Spatial Orbit Timeline is styled through tokens, lift and colours; track
  rows are unchanged (no perspective, by design of the brief's accuracy rule).
- Design backlog from the mockups (not built): size presets on new project,
  drag-and-drop to start a project, Myanmar fonts, AI Copilot panel UI.

## Next steps, in order

1. ~~Design choice~~ — done (Ocean + Manrope + Round, see Done 10).
2. **Project files on disk**: save/open/backup through a new storage adapter
   (`StorageAdapter` in `src/services/storage/types.ts`) and Electron IPC
   (preload with a narrow API), reusing the migration runner.
3. **Windows installer**: electron-builder; ship `build/server` as
   extraResources (keep its relative symlinks), code signing later.
4. **FFmpeg sidecar** for AAC export and HEVC/ProRes import (LGPL notices).
5. **AI Copilot / Autopilot**: AI proposes commands, the UI previews them,
   they run only on approval as one `BatchCommand` so one Ctrl+Z undoes them.

## Working agreement

- Inspect → plan → implement → test → fix. Reuse existing code; minimal diffs.
- Never say a feature works without a test or a screenshot that shows it.
- Commit after each meaningful step (`feat: …` / `fix: …` / `chore: …`) and push
  `claude/opencut-studio`. No PR unless Mike asks.
- Talk to Mike in simple Burmese; code, comments and UI copy in English.
  Show design changes as screenshots (before/after). When asking, give 2–3
  options.
