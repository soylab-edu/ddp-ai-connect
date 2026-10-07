# NEXT K-CORE 2026 · AI CONNECT

Approved v6 artwork connected into a silent, 16-second motion header.

Revision v7: the opening dots burst outward before the date cut; the diagonal text field extends beyond every edge without exposed row ends; the final 12, DEC, and AI CONNECT. reveal in that order at half-second intervals.

## Open

- Live header: `http://127.0.0.1:3044/header.html`
- HyperFrames Studio: `http://localhost:3043/#project/motion`

The live header plays the introduction once, holds the final event information, and keeps the footer wave moving. Pause and replay are available below the header. Reduced-motion preferences show the final information immediately.

## Timeline

| Time | Scene |
| --- | --- |
| 0–1.4 s | Colored dot cloud |
| 1.4–2.7 s | 12 DEC · 09–10 · 2026 |
| 2.7–5.2 s | Korean event message |
| 5.2–7.3 s | Diagonal animated text wave |
| 7.3–8.8 s | SOYLAB logo |
| 8.8–11.2 s | AI CONNECT. / DDP. / AI. / SOYLAB. / CREATORS. / ONE. |
| 11.2–16 s | Event header |

## Files

- `index.html` and `compositions/`: editable HyperFrames timeline.
- `motion.css`, `scene-runtime.js`, `live-scenes.html`: shared scene layout and deterministic motion.
- `header.html`, `player.js`: standalone browser playback.
- `assets/`: local fonts, GSAP, and original SOYLAB image.

## Run again

From this directory:

```powershell
python -m http.server 3044 --bind 127.0.0.1
npx --yes hyperframes@0.8.139 preview --background --port 3043
npm run check
```

The composition uses a 1680 × 720 canvas at 30 fps. `render-hires.mjs` preserves that layout and renders at integer DPR using the installed, pinned CLI.
