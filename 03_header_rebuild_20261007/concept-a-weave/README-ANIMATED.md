# A — 2026-10-07 animated header

Current review version: `header-a.html` (also `header-a-animated.html`) and `preview-animated.mp4`.

- Desktop video: 1600×640, 30 fps, 17 seconds, silent.
- Desktop web: 40vw high within 500–720px; 1600px width produces 640px height. A separate 760px mobile layout applies below 701px width.
- Three illustrated scenes: walking into a small group, viewing a tablet together, and consultation with a gesture followed by a response.
- Complete Open Peeps silhouettes are preserved as textures on a deforming triangle mesh. Legs use separate hip/knee/ankle targets; hand and head changes blend into the original connected silhouette.
- Central single-line typography: DDP → 12월 → 사람과 AI → AI와 사람 → 사람과 사람 → Soylab.ai. IBM Plex Sans KR and Outfit replace the earlier Pretendard typography.
- One play, final hold, pause/resume, replay, reduced-motion final state, and offscreen/document-hidden pause are implemented in `live-animated.js`.
- Embedded CTA links target the parent page anchors. Standalone CTA links target `../03_NEXT_KCORE_AI_CONNECT_v12.html#program` and `#guide`.

## Review files

- `poster-animated.png`: final poster extracted from the current video.
- `snapshots/animated-final/consultation-video.png`: current consultation frame with a gap between shoe and table.
- `mobile-animated/snapshots/final/contact-sheet.jpg`: current mobile frame review.
- `check-animated-desktop.json`, `mobile-animated/check-animated-mobile.json`: successful HyperFrames checks. No lint, runtime, or layout errors; no lint warnings; contrast 58/58 in each profile.
- `motion-test/motion-test.mp4`: four-second walking/gesture test.
- `type-test/type-test.mp4`: 4.5-second single-line type test.

The earlier static version remains as `preview.mp4`, `poster.png`, and `header-a-static-before.html`. The current A does not include the C typography-wave module.

## Build

```text
node animated-build.mjs
npx --yes hyperframes@0.8.139 check
npx --yes hyperframes@0.8.139 render . --output preview-animated.mp4 --fps 30 --quality looks --skill general-video
```

Use `animated-build.mjs` for this version. `source.mjs` and the older art/motion files describe earlier experiments.

## Asset sources

Official Open Peeps whole-body SVGs by Pablo Stanley, CC0 1.0: https://www.openpeeps.com/ . Exact source URLs and license provenance are retained in `assets/open-peeps/provenance.json`; original SVGs are preserved.

IBM Plex Sans KR and Outfit font licenses are bundled in `assets/IBMPlexSansKR-OFL.txt` and `assets/Outfit-OFL.txt`.

Character animation uses WebGL. The exported MP4 and poster provide a renderer-independent review of the result.
