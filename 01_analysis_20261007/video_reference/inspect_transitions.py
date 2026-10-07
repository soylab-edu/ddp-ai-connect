from pathlib import Path
import subprocess
from PIL import Image, ImageDraw, ImageFont

folder = Path(__file__).resolve().parent
source = Path('D:/DDP/헤더모션01파일샘플.mp4')
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 18)
for name, start, end in [('symbol', 0.0, 1.5), ('morph', 5.2, 6.8), ('pattern', 6.8, 8.3), ('cuts', 9.3, 11.2)]:
    target = folder / name
    target.mkdir(exist_ok=True)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', str(start), '-i', str(source), '-t', str(end-start), '-vf', 'fps=10,scale=840:-2', '-y', str(target / '%03d.png')], check=True)
    frames = sorted(target.glob('*.png'))
    sheet = Image.new('RGB', (2520, ((len(frames)+3)//4)*298), '#202020')
    draw = ImageDraw.Draw(sheet)
    for i, path in enumerate(frames):
        x, y = (i%4)*630, (i//4)*298
        with Image.open(path) as frame:
            sheet.paste(frame.convert('RGB').resize((630,270), Image.Resampling.LANCZOS), (x,y+28))
        draw.text((x+10,y+3), f'{start+i/10:.1f}s (approx.)', font=font, fill='white')
    sheet.save(folder/f'transition-{name}.jpg', quality=96)
    print(name, len(frames))
