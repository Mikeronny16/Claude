# OpenCut Studio — handoff

State of the work for whoever picks it up next (a person or a new Claude
session). Branch `claude/opencut-studio` of `github.com/Mikeronny16/Claude`,
folder `opencut-studio/`. Last updated 2026-10-15.

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
bun test                              # from opencut-studio/: 214/218 pass
cd apps/web && bunx tsc --noEmit -p tsconfig.json
cd apps/studio && bunx tsc --noEmit -p tsconfig.json
cd apps/studio && bun run build && bun run test:e2e      # Linux headless: xvfb-run -a bun run test:e2e
cd apps/studio && bun run screenshots -- <dir>           # DESIGNS=ocean,graphite THEMES=dark ...
```

- The 4 failing unit tests predate this work: 2 mask-snapping assertions
  (`src/masks/__tests__/snap.test.ts`), 1 needs a canvas for text measuring,
  1 feeds fractional ticks to `mediaTime` (`src/timeline/placement/__tests__/resolve.test.ts`).
- e2e (`apps/studio/e2e/editor-flow.e2e.ts`) drives the built app: create
  project, import, add to timeline, preview pixels, Effects panel doesn't hijack
  the preview, play, undo/redo, MP4 export checked with ffprobe, design picker
  choice, relaunch with project/thumbnail/timeline/design intact. Passes on
  Linux under Xvfb. Needs `ffmpeg`/`ffprobe` on PATH; so does `screenshots`.
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

## Known limitations

- MP4 audio is Opus: Electron's WebCodecs on Linux has no AAC encoder (not yet
  checked on Windows/macOS).
- HEVC import doesn't decode in Electron on Linux.
- Projects and media live in browser storage (IndexedDB/OPFS), not files.
- No installers yet. Only tested on Linux.
- Logo is a placeholder.

## Next steps, in order

1. **Design choice.** Mike picks palette + font + corners in the picker. Set
   `DEFAULT_DESIGN` in `src/design/designs.ts`; ask Mike whether to keep the
   picker as a Themes feature or remove the unused palettes. Make timeline clip
   colours (`src/timeline/components/theme.ts`) and the bookmark colour match
   the chosen palette. Re-run screenshots and e2e; show Mike before/after.
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
