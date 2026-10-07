# DDP — NEXT K-CORE AI CONNECT

Private project archive and editable website / opening motion sources. Snapshot: 2026-10-07 (Asia/Seoul).

## Start here
- Final standalone website: `FINAL_AI_CONNECT/AI_CONNECT_FINAL_REVIEWED.html`
- Final 16-second opening video: `FINAL_AI_CONNECT/AI_CONNECT_FINAL_3360x1440.mp4`
- Editable website source: `03_header_rebuild_20261007/page-review-v7.html`
- Website styles: `03_header_rebuild_20261007/dark-body.css`
- Header animation source: `reference-reset/motion/`
- Handoff and accepted decisions: `HANDOFF.md`

## Preview
From repository root, run `python -m http.server 3045 --bind 0.0.0.0`, then open `/FINAL_AI_CONNECT/AI_CONNECT_FINAL_REVIEWED.html` through your environment's forwarded port.
The final HTML also opens directly as a local file. Header audio starts only with user interaction.

## Rebuild the standalone HTML
Python 3, standard library only:

```bash
python FINAL_AI_CONNECT/build_full_html.py
python -c "from pathlib import Path; import shutil; p=Path('FINAL_AI_CONNECT'); shutil.copy2(p/'AI_CONNECT_FINAL.html',p/'AI_CONNECT_FINAL_REVIEWED.html')"
```

## Cloud continuation
Connect this private repository to a Codex Cloud environment using your GitHub account. Select this repository when starting a cloud task and ask the agent to read `HANDOFF.md` first. This repository provides the project files and a curated handoff; the original desktop chat and local tools are not automatically transferred.

Historical designs and analyses are retained in their original directories. Installed dependencies, machine settings and caches are excluded. Media rights and attribution are recorded in the corresponding credits files; keeping the repository private does not replace those terms.
