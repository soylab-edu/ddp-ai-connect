"""Copy original images unchanged and bundle a portable single-file proposal."""
from pathlib import Path
import base64
import re
import shutil
import html as html_module

ROOT = Path(__file__).resolve().parent
WORKSPACE = ROOT.parent
ASSETS = ROOT / 'assets'
ASSETS.mkdir(exist_ok=True)
typo = WORKSPACE / 'SOYLAB_타이포_투명PNG_10종' / 'SOYLAB_typography_assets'
names = [('01_AI.png', 'ai'), ('02_X.png', 'x'), ('03_HUMAN.png', 'human'), ('04_사람.png', 'people'), ('05_間.png', 'between')]
for folder, prefix in [('01_black_basic', 'black'), ('02_mask_diagonal_white', 'mask')]:
    for filename, name in names:
        shutil.copy2(typo / folder / filename, ASSETS / f'{prefix}-{name}.png')
shutil.copy2(WORKSPACE / '인터랙션1.png', ASSETS / 'walking.png')
html = (ROOT / 'index.html').read_text(encoding='utf-8')
motion_root = ROOT / 'hero-motion'
motion = (motion_root / 'index.html').read_text(encoding='utf-8').replace('<html lang="ko">', '<html lang="ko" data-website-player>')
for name in ['assets/gsap.min.js', 'motion.js']:
    motion = motion.replace(f'<script src="{name}"></script>', '<script>\n' + (motion_root / name).read_text(encoding='utf-8') + '\n</script>')
font = base64.b64encode((motion_root / 'assets/BarlowCondensed-ExtraBold.ttf').read_bytes()).decode('ascii')
motion = motion.replace('assets/BarlowCondensed-ExtraBold.ttf', 'data:font/ttf;base64,' + font)
def embed_motion(match):
    return 'src="data:image/png;base64,' + base64.b64encode((motion_root / match.group(1)).read_bytes()).decode('ascii') + '"'
motion = re.sub(r'src="(assets/[^\"]+\.png)"', embed_motion, motion)
html = html.replace('src="hero-motion/index.html?play=1"', 'srcdoc="' + html_module.escape(motion, quote=True) + '"')
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + (ROOT / 'styles.css').read_text(encoding='utf-8') + '\n</style>')
for script in ['content.js', 'app.js']:
    html = html.replace(f'<script src="{script}"></script>', '<script>\n' + (ROOT / script).read_text(encoding='utf-8') + '\n</script>')
cache = {}
def embed(match):
    name = match.group(1)
    if name not in cache:
        cache[name] = 'data:image/png;base64,' + base64.b64encode((ROOT / name).read_bytes()).decode('ascii')
    return 'src="' + cache[name] + '"'
html = re.sub(r'src="(assets/[^\"]+\.png)"', embed, html)
output = WORKSPACE / '03_NEXT_KCORE_AI_CONNECT.html'
output.write_text(html, encoding='utf-8')
print(f'Built {output.name}: {output.stat().st_size:,} bytes; {len(cache)} embedded original assets.')
