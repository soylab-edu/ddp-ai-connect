"""Generate mask-style typography (white letters filled with tiny 'soylab.ai' text, white rim, slant)
matching the original mask-*.png set, plus copy/clean SOYLAB logo assets into 03_assets."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import shutil

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '03_assets'
F = 'C:/Windows/Fonts/'
LATIN = F + 'ariblk.ttf'
KOR = F + 'malgunbd.ttf'
SMALL = ImageFont.truetype(F + 'arialbd.ttf', 13)

def pattern(w, h):
    pat = Image.new('L', (w, h), 255)
    d = ImageDraw.Draw(pat)
    word = 'soylab.ai'
    tw = d.textlength(word + '  ', font=SMALL)
    y, row = 0, 0
    while y < h:
        x = -(row % 2) * tw / 2
        while x < w:
            d.text((x, y), word, font=SMALL, fill=0)
            x += tw
        y += 16; row += 1
    return pat

def make(name, parts, size=620, shear=0.24, rot=6, rim=6, gap=40, thin=0):
    # parts: list of (text, fontpath, scale)
    fonts = [(t, ImageFont.truetype(fp, int(size * s))) for t, fp, s in parts]
    tmp = ImageDraw.Draw(Image.new('L', (10, 10)))
    boxes = [tmp.textbbox((0, 0), t, font=f) for t, f in fonts]
    W = int(sum(b[2] - b[0] for b in boxes) + 60 * len(fonts) + 200)
    H = int(max(b[3] - b[1] for b in boxes) + 260)
    mask = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(mask)
    x = 100
    base = H - 130
    for (t, f), b in zip(fonts, boxes):
        d.text((x - b[0], base - b[3]), t, font=f, fill=255)
        x += b[2] - b[0] + gap
    # slant + tilt
    mask = mask.transform((W + int(shear * H), H), Image.AFFINE, (1, shear, -shear * H, 0, 1, 0), Image.BICUBIC)
    mask = mask.rotate(rot, expand=True, resample=Image.BICUBIC)
    mask = mask.point(lambda v: 255 if v > 110 else 0)
    if thin: mask = mask.filter(ImageFilter.MinFilter(thin * 2 + 1))   # thinner strokes -> wider counters
    outer = mask                                                         # rim drawn inside, so gaps never close
    inner = mask.filter(ImageFilter.MinFilter(rim * 2 + 1))
    pat = pattern(*mask.size).rotate(rot, resample=Image.BICUBIC, fillcolor=255)
    # inside letters: pattern; rim band & inner hairline: white
    rgb = Image.composite(pat, Image.new('L', mask.size, 255), inner)
    hair = ImageChops.subtract(inner, inner.filter(ImageFilter.MinFilter(5)))            # thin dark keyline just inside rim
    rgb = Image.composite(Image.new('L', mask.size, 25), rgb, hair)
    out = Image.merge('RGBA', (rgb, rgb, rgb, outer.filter(ImageFilter.GaussianBlur(.6))))
    out = out.crop(out.getbbox())
    out.thumbnail((1200, 1200), Image.LANCZOS)
    out.save(OUT / f'{name}.webp', 'WEBP', quality=86)
    print(name, out.size)

make('mask-soylab', [('SOYLAB', LATIN, 1)])
make('mask-theclass', [('THE CLASS', LATIN, .82)])
make('mask-ddp', [('DDP', LATIN, 1.2)], rot=-5)
make('mask-dec', [('12', LATIN, 1.25), ('월', 'C:/Users/wlsgh/AppData/Local/Microsoft/Windows/Fonts/GmarketSansTTFBold.ttf', 1.3)], size=620, rot=4, gap=40, rim=6, thin=4)

# logo assets: original interaction image + clean transparent SOYLAB logo
src = ROOT / 'next-kcore' / 'assets'
shutil.copy2(next(src.glob('*2.png')), OUT / '인터랙션2.png')
lg = Image.open(next(src.glob('*2.png'))).convert('RGB').crop((110, 260, 650, 810))
r, g, b = lg.split()
a = ImageChops.lighter(ImageChops.lighter(r, g), b).point(lambda v: min(255, v * 3))
logo = lg.copy(); logo.putalpha(a)
logo.save(OUT / 'soylab-logo.png', optimize=True)
print('logo', logo.size)
