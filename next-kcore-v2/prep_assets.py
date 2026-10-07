"""Prepare web assets from the original proposal images (originals untouched)."""
from pathlib import Path
from PIL import Image, ImageOps
import numpy as np
ROOT = Path(__file__).resolve().parent
WS = ROOT.parent
OUT = ROOT / 'assets'; OUT.mkdir(exist_ok=True)
SRC = WS / 'next-kcore' / 'assets'
PHOTO = WS / '행사내부'

def webp(im, name, w, q=78):
    if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(OUT / name, 'WEBP', quality=q, method=6)

# venue photos
photos = {'01_':'p-lecture','02_':'p-lounge','03_':'p-booth-a','04_':'p-booth-b','05_':'p-hall'}
for f in PHOTO.glob('*.png'):
    for k, n in photos.items():
        if f.name.startswith(k): webp(Image.open(f).convert('RGB'), n + '.webp', 1600)

# typography PNGs (transparent) -> smaller webp with alpha
for f in SRC.glob('*.png'):
    if f.stem.startswith(('black-', 'mask-')):
        webp(Image.open(f).convert('RGBA'), f.stem + '.webp', 1100, 82)

# walking.png: purple bg + white strokes -> white-on-transparent, then crop figures
im = np.asarray(Image.open(SRC / 'walking.png').convert('RGB')).astype(float)
lum = im.mean(axis=2)
# purple bg has low min channel (G); strokes are near white
g = im[:, :, 1]
a = np.clip((g - 40) / (200 - 40), 0, 1)
rgba = np.zeros((*a.shape, 4), np.uint8); rgba[..., :3] = 255; rgba[..., 3] = (a * 255).astype(np.uint8)
strip = Image.fromarray(rgba)
# find figure columns between y 530..700 (above ground line ~690)
band = (a[525:682] > .5)
cols = band.any(axis=0)
runs = []; start = None
for x, v in enumerate(cols):
    if v and start is None: start = x
    if not v and start is not None:
        if x - start > 20: runs.append((start, x))
        start = None
print('figure runs', runs)
for i, (x0, x1) in enumerate(runs):
    fig = strip.crop((x0 - 6, 528, x1 + 6, 705))
    fig.save(OUT / f'walk-{i:02d}.png', optimize=True)

# SOYLAB mark from 인터랙션2 (left half only; the right logo carries a red annotation)
lg = Image.open(next(SRC.glob('*2.png'))).convert('RGB').crop((120, 270, 640, 800))
arr = np.asarray(lg).astype(float); al = np.clip(arr.max(axis=2) / 90, 0, 1)
rgba = np.dstack([arr.astype(np.uint8), (al * 255).astype(np.uint8)])
Image.fromarray(rgba).resize((260, 265), Image.LANCZOS).save(OUT / 'soylab-mark.webp', 'WEBP', quality=85)
