from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

folder = Path(__file__).resolve().parent
frames = sorted(folder.glob('frame-*.png'))
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 20)
for start in range(0, len(frames), 20):
    selected = frames[start:start + 20]
    sheet = Image.new('RGB', (2520, ((len(selected) + 3) // 4) * 298), '#202020')
    draw = ImageDraw.Draw(sheet)
    for offset, path in enumerate(selected):
        index = start + offset
        x, y = (offset % 4) * 630, (offset // 4) * 298
        with Image.open(path) as frame:
            frame = frame.convert('RGB').resize((630, 270), Image.Resampling.LANCZOS)
            sheet.paste(frame, (x, y + 28))
        draw.text((x + 10, y + 3), f'{index * 0.5:04.1f}s | frame {index + 1:03d}', font=font, fill='white')
    sheet.save(folder / f'contact-{start // 20 + 1:02d}.jpg', quality=96)
print(f'{len(frames)} frames, {(len(frames) + 19) // 20} contact sheets')
