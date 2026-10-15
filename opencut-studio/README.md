# OpenCut Studio

An AI-first desktop video editor, built on the open-source OpenCut editor.

## Origin and license

OpenCut Studio started from [OpenCut-app/opencut-classic](https://github.com/OpenCut-app/opencut-classic)
at commit `cf5e79e9` (MIT, Copyright 2025-2026 OpenCut; see [LICENSE](LICENSE)).
That repository is archived; OpenCut's own rewrite lives at
[OpenCut-app/OpenCut](https://github.com/OpenCut-app/OpenCut). OpenCut Studio is
an independent project and is not affiliated with or endorsed by OpenCut.

## Layout

- `apps/web/` — the editor (Next.js): timeline, preview, effects, masks, keyframes, captions, export
- `apps/studio/` — the desktop app (Electron) that runs the editor offline
- `rust/` — GPU compositor, effects, masks and time math, compiled to WebAssembly for the editor

## Run the desktop app

Prerequisites: [Bun](https://bun.sh) 1.2+.

```bash
bun install                  # also downloads Electron (apps/studio postinstall)
cd apps/studio
bun run build                # builds the editor, bundles its server, builds the main process
bun run start
```

No accounts, database or cloud services are needed. Projects and imported media
are stored locally in the app's data folder; exports are saved where you choose.

## Tests

```bash
bun test                     # unit tests (from the repo root)
cd apps/studio && bun run test:e2e   # end-to-end, after `bun run build`
```

The end-to-end test drives the built desktop app through a real project: create,
import a generated H.264/AAC clip, add it to the timeline, check the preview
renders it, play, undo/redo, export MP4 (verified with ffprobe: H.264, 90 frames,
3.0 s, audio at source loudness), quit, relaunch and reopen the project with its
timeline and media intact. It needs `ffmpeg`/`ffprobe` on PATH; on Linux without
a display run it as `xvfb-run -a bun run test:e2e`.

## Status

Verified in the desktop app (Linux, Electron 44, by the end-to-end test):

- [x] Desktop app starts offline with the bundled editor server
- [x] Project create, autosave, and reopen after relaunch
- [x] Media import (H.264/AAC MP4) with thumbnail
- [x] Timeline add, undo/redo
- [x] Preview rendering and playback
- [x] MP4 export to disk (H.264 video; audio is Opus, see below)

Known limitations:

- MP4 audio is exported as Opus: this Electron build has no AAC encoder for
  WebCodecs. Some players (e.g. QuickTime) don't play Opus in MP4.
- HEVC/H.265 import isn't decodable in Electron on Linux.
- Projects and media live in the app's browser storage (IndexedDB/OPFS), not
  as project files on disk yet.
- The desktop app is not packaged into installers yet.
- 4 unit tests fail (mask snapping maths, text measurement needs a canvas in
  tests, one test uses fractional ticks); they predate OpenCut Studio and were
  hidden because their files didn't load.

## Roadmap

1. Project files on disk (save/open/backup) instead of browser storage
2. Installers for Windows and macOS
3. AAC audio and HEVC/ProRes import through FFmpeg
4. AI Copilot and Autopilot: proposed edits shown as a preview, applied only on
   approval, and undoable in one step
