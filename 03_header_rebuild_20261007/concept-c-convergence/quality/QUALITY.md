# C render-quality verification — 2026-10-07

## Existing output
- Authored CSS viewport: 1600 x 640.
- Existing preview.mp4: 1600 x 640, 30 fps, H.264 yuv420p, `looks` default CRF 16.
- Capture log: Chrome screenshot mode, NVIDIA GTX 1650 hardware WebGL.
- 1x source pixels show visible stair steps when small type is enlarged.

## Supported rendering path
Installed `hyperframes@0.8.139 render --help` and the official CLI reference confirm `--resolution` supersamples using Chrome deviceScaleFactor without changing the composition, requiring matching aspect ratio and an integer scale. The stock preset list lacks the composition's 2.5:1 aspect ratio. The project-local `render-hires.mjs` replaces the output dimensions of one preset only within the running Node process and then invokes the unchanged official CLI, compiler, screenshot capture and encoder. No browser automation is reimplemented, and installed CLI files are not modified.

Reference: https://github.com/heygen-com/hyperframes/blob/main/docs/packages/cli.mdx
Local version authority: `npx --yes hyperframes@0.8.139 render --help`.

## One-second trial outputs
- `dpr2-test-1s.mp4`: authored time 1.2–2.2s, 3200 x 1280, 30 frames, CRF 10; 2,399,794 bytes.
- `dpr3-test-1s.mp4`: same authored time, 4800 x 1920, 30 frames, CRF 10; 3,526,277 bytes.
- `schedule-comparison.png`: same crop at the same authored time from the actual MP4 files. Every row is resized to the same 1080 x 285 display dimensions using the same Lanczos resampling rule. The source crops contain respectively 360 x 95, 720 x 190 and 1080 x 285 pixels.

DPR 2 materially sharpens date digits and Korean strokes. DPR 3 adds little at normal header display size and needs more output pixels, so the final 3200 x 1280 DPR 2 version uses CRF 10 and the high/slow encoder preset. This also stays below 4096 pixels wide for practical playback compatibility. No CSS viewport size, composition layout or font-size changes are part of this rendering fix.

## Web source changes coordinated by ROOT
WebGL pixel ratio now follows window.devicePixelRatio, capped at 3, both at initialization and resize. Intro text resets transform:none and will-change:auto after its entrance. ROOT verified actual browser DPR 1.47000003, CSS 1280 x 512, canvas 1881 x 752, loaded Korean fonts and settled text transforms.


## Final output verification
- preview-hq.mp4: 3200 x 1280, H.264 yuv420p, 30/1 fps, 480 frames, duration 16.000000 seconds, 50,062,060 bytes.
- FFprobe verified dimensions/frame count/duration. Source CSS viewport stayed 1600 x 640.
- quality/final-hq-2fps-contact.jpg contains 32 samples extracted from the delivered MP4; quality/final-hq-schedule.png is a native-pixel crop from its 1.2-second frame. poster-hq.png is its final frame.


The custom point shader now multiplies gl_PointSize by uPixelRatio; both globe and flight materials are synchronized on resize. This preserves their CSS-size appearance at DPR 2. Fresh desktop/mobile runtime and sample checks passed with zero errors and 28/28 text contrast checks.


Final frame extraction after the DPR point correction confirms the globe retains its original apparent size while its small circles render smoothly. See globe-size-verification.png. The final output was regenerated after this correction, and the 32-sample MP4 contact sheet was refreshed.

