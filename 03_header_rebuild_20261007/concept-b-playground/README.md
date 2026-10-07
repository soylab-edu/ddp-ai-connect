# B — INTERVAL / wide header review build

The current B version is a 1600 × 640, 15-second web header. Its existing abstract concept is preserved for comparison with A and C. The opposing eight-row text wave belongs to C.

## Open and review

- `header-b.html`: standalone, responsive web header. Plays once for 15 seconds and holds the last screen. Pause/resume and replay controls are visible. Reduced motion opens directly on the final poster. Offscreen and hidden-document playback pauses.
- `preview-wide.mp4`: current silent H.264 review video, verified 1600 × 640, 30 fps, 450 frames, 15.000 seconds. Rendered with hardware GPU screenshot capture.
- `poster-wide.png`: current desktop final poster.
- `preview.mp4` and `poster.png`: preserved earlier 1440 × 900 version.
- `poster-mobile.png`: 390 × 844 final poster.
- `snapshots/contact-sheet.jpg`: six current desktop frames.
- `snapshots/final-mobile/contact-sheet.jpg`: six current mobile frames.
- `snapshots/v6/contact-sheet-1.jpg`: intermediate detail sheet showing all three genre cuts; the later current version improves macro lighting and mobile framing.

Standalone buttons point to `../03_NEXT_KCORE_AI_CONNECT_v12.html#program` and `#guide`. Inside an iframe, they target the parent's `#program` and `#guide` anchors. The parent page must supply those sections. Desktop uses a 5:2 frame with a 440px minimum height at narrower widths. Mobile retains a portrait layout between 680px and 860px high.

## Included design

One large smooth plate divides into many slabs. A dense macro field, two sparse separated groups, extruded 사람 / AI, flat GAME / ART / STORY cuts and an architectural final form vary density and scale. The four brand colors are #7A00EE, #CCFF00, #111111 and #DF0221, with white for readable text and selected surfaces. The piece is silent. No generated imagery or pictorial people are used.

## Validation and limits

- Wide update: desktop 1600 × 640 and mobile 390 × 844 full checks passed with zero lint/runtime errors and 55/55 sampled text contrast checks in each. The known Three.js deprecation and intentional canvas edge warnings remain. Browser review confirmed a 1280 × 512 header, zero internal scrolling and final hold with the pause control disabled. Evidence: `../review/b-wide-browser.png`.

- `check-desktop.json` and `check-mobile.json`: full HyperFrames checks passed, with zero lint or runtime errors and all 56 sampled contrast checks passing on each viewport. The legacy pinned Three.js build emits its deprecation warning. Canvas art reaches the frame in the intentional macro/expanded-slab cuts, recorded by the layout audit. The motion audit is disabled for this canvas-driven composition; the result does not claim an automatic canvas-motion proof.
- `verify-player.mjs`: source controller checks passed for autoplay, manual pause/resume, document and intersection visibility, final hold, replay, reduced motion and standalone/iframe anchor behavior. These checks use a timeline and DOM test harness, not a browser UI.
- Parent review in its existing permitted browser confirmed actual autoplay, pause and the 15-second final hold. After the `overflow: clip` fix, replay → pause kept root scrollTop at 0 and the masthead at 36.01px. A direct file-URL browser check in this worker was blocked by browser URL policy and was not bypassed.
- Reviewer inspected 30 frames sampled at 2 fps from the actual MP4, with no missing or blank cuts. Evidence: `../review/evidence/b-preview-2fps-check.jpg`. This is sampled video inspection, not real-time playback inspection.
- Decoded video frames at 12.8 and 14.8 seconds had SSIM 0.999979; the tiny difference is consistent with H.264 compression of the fixed final screen.
- The current web-only overflow and standalone link fixes do not alter the authored MP4 visual sequence. The existing MP4 was retained after the user's request to stop and review.

## Source

`index.html` is the paused, seekable HyperFrames render composition. `scene.js` draws deterministic Three.js geometry from timeline time. `stage.css` owns shared responsive layout. `player.js` is web-only playback behavior. `mobile/index.html` is the 390 × 844 render proof and mirrors the scene/assets.

Fonts: Outfit and IBM Plex Sans KR, supplied locally with OFL license files in `assets/`. `build-glyphs.py` converts the font outlines for the real 3D words; `subset-fonts.py` packages Korean display and player copy. Three.js 0.158.0 is bundled with its license. GSAP is the existing HyperFrames bundled runtime.

Existing `scene-v1.js`, `scene-v2-rejected.js`, older CSS and earlier snapshot folders are retained as intermediate evidence, not the current deliverable.

```powershell
npx --yes hyperframes@0.8.139 preview --background
npx --yes hyperframes@0.8.139 check
node verify-player.mjs
npx --yes hyperframes@0.8.139 render --quality looks --fps 30 --output preview.mp4 --workers 2 --skill general-video
```

The official Studio preview was opened at `http://localhost:3002/#project/concept-b-playground` and left running for review. No publication or deployment was performed.
