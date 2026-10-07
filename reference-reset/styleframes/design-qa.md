# Webdi — static styleframe design QA

final result: passed

Scope: desktop static styleframes for the reference-reset header. This does not approve animation, responsive production behavior, or live navigation. Buttons are intentional static storyboard representations.

## Evidence
- Source visual truth: D:/DDP/헤더모션01파일샘플.mp4; extracted reference/ref-01-intro.png, ref-02-month.png, ref-04-pattern.png, ref-06-bold-type.png, ref-08-final-poster.png (2220 × 912 source captures).
- Initial comparison: compare-v1.png; initial board: board-v1.png.
- Revised combined comparison: compare-webdi-v1.png (1265 × 1938). Source and implementation displayed together in equal-width 7:3 slots; source uses contain, preserving its slightly wider source aspect. No findings attributed to letterboxing.
- Revised full board: board-webdi-v1.png (1265 × 2040), browser full-page capture.
- Focused final header: final-header-webdi-v1.png (1280 × 720 viewport, actual header 1280 × 548.6 from 7:3; remaining black below is page background). No screenshot density manipulation used. Browser DPR not separately measured.
- State: static desktop frames, fonts loaded, no animation. Captures supplied by root's actual browser session and visually inspected by Webdi.

## Comparison history
1. [P1] Month glyph was markedly thinner than source, separating its weight from 12. Replaced fallback regular serif with actual Noto Serif KR weight 800. Both month screens now retain a substantial serif stroke and sit clear of adjacent information.
2. [P2] Message occupied roughly 35–40% of width and lost headline status. Increased message from 4.85cqw to 7.1cqw. Revised board shows clear large two-line headline without collisions.
3. [P2] Final title and slogan were undersized against date. Title increased 4.4 → 5.3cqw, slogan 1.65 → 2.1cqw, event information 1.25 → 1.4cqw. Revised focused capture confirms two primary regions and readable secondary details.
4. [P2] Final repeated text ended before right edge. Added one full repeat cycle; focused final capture confirms full-width overflow, intentionally clipped at boundaries.

## Required surfaces
- Typography: Outfit/Pretendard remain suitable heavy display and compact metadata. Noto Serif KR repairs month weight. Fixed breaks are intact; no unwanted wraps. Month subset retains U+6708 and variable weights 200–900.
- Layout: large focal content, corner metadata, strong date/title split preserved. No headline/date/information overlaps. Full-frame diagonal wave remains intentionally cropped.
- Colors: black/purple/neon green are user-approved replacements, not fidelity errors. Red punctuation remains restrained. Pastel opening colors are intentional.
- Assets: actual supplied SOYLAB logo remains unchanged, sharp at current view size; no replacement logo. User-requested text wave and procedural pastel dots are original motion graphic content, not approximations of a supplied missing asset.
- Copy: event date, venue and slogan are consistent across screens. Larger English title is an intentional content substitution for reference words.

## Remaining limits
Static direction review passed; motion speed, transition continuity, actual web navigation and mobile production layout are outside this pass. The reference's detailed data-card content is intentionally replaced by event date/location/actions. No further visual expansion recommended before user views this board.

## Revision 2 — user-directed English date and six-word sequence
- User direction supersedes the v1 Hanja-month design: 02 now presents oversized DEC with 09—10 / 2026 below. 07 uses DEC and dates as a two-level block. Calendar date remains 2026.12.09–10.
- 06 is now AI CONNECT. / DDP. / AI. / SOYLAB. / CREATORS. / ONE., with #7A00EE periods throughout. Black/lime backgrounds alternate. Static detail sheet: 06-sequence.html. Planned motion: fixed horizontal mask, left-to-right passage, about 0.4 seconds each / 2.4 seconds total. Final hold begins at approximately 11.2 seconds.
- New actual browser evidence: board-webdi-v2.png, sequence-webdi-v2.png, final-header-webdi-v2.png. Full final capture remains 1280 × 720, with 7:3 header occupying the upper 548.6 pixels. Both focused final and six-state sheet personally inspected after repair.
- First v2 capture found P2 clipped periods in short-word states. Mask height increased 18 → 28cqw, retaining horizontal entry/exit mask. Revised screenshot confirms six complete purple circles.
- First v2 capture found P2 date row crossing the information rule. Final DEC reduced to 16cqw, block top set to 10cqw, dates 4.3cqw with .8cqw margin. Revised screenshot confirms clear separation above the information rule.
- Required surfaces rechecked: bold Outfit dates and words, intact line breaks, stable two-column layout, prescribed background/text/punctuation colors, unchanged exact SOYLAB asset, correct word order and unchanged event date/venue. No new blocking static visual issue remains.
- Revision 2 static result: passed. Animation and production interaction remain outside this static pass.

## Revision 4 — vivid colors and black
User steering superseded the unreviewed v3 pastel proposal. Updated 06 backgrounds in word order to cobalt #397EF3 / hot pink #FF4C9D / black #080808 / teal #00AE9E / orange #F58438 / black #080808. Opening dots use the same four vivid colors. Periods remain #7A00EE; no glow or fluorescent shader. Other scene backgrounds remain unchanged. Cobalt is deliberately brighter than dark royal blue to distinguish the purple punctuation while retaining a vivid field.

## Revision 5 — white periods
Latest explicit user instruction changes every scene-06 period to pure white #FFFFFF. Both primary 06 styleframe and six-state detail sheet use the same CSS rule. On-page heading, explanatory copy, BRIEF and STORYBOARD updated to white punctuation. V4 vivid background and opening dot palette unchanged. Regenerated all pages. Browser review pending root's v5 capture; prior typography/layout checks still apply, but this palette revision is not yet claimed visually verified.

## Revision 6 — numeric month with small English label
Latest user instruction restores a large 12, with a small DEC label aligned alongside its baseline, in 02 and 07. No Hanja. Secondary 09–10 / 2026 and exact date information retained. Scene 06 vivid colors and white periods unchanged.
Actual browser captures personally inspected: date-webdi-v6.png and final-header-webdi-v6.png, both 1280 × 720. Header occupies 1280 × 548.6; lower black region is page background. The large numeral and small DEC form a readable single date mark, 09–10 is separated below, and the final date block clears the information rule. No cropping, collision or unintended line wrapping. Static revision 6 result: passed. Motion remains outside this review.
