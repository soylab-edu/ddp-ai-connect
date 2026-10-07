from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
base=Path('quality')
out=Image.new('RGB',(1140,1065),'#222222')
draw=ImageDraw.Draw(out)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',23)
for i,(name,scale,label) in enumerate([('baseline-frame.png',1,'Before: DPR 1 / 1600 x 640 / CRF 16 (equal-size / Lanczos)'),('dpr2-frame.png',2,'DPR 2 / 3200 x 1280 / CRF 10 (equal-size / Lanczos)'),('dpr3-frame.png',3,'DPR 3 / 4800 x 1920 / CRF 10 (equal-size / Lanczos)')]):
    img=Image.open(base/name)
    crop=img.crop((1180*scale,20*scale,1540*scale,115*scale))
    crop.save(base/f'{name[:-4]}-schedule.png')
    crop=crop.resize((1080,285),Image.Resampling.LANCZOS)
    draw.text((30,i*350+15),label,font=font,fill='white')
    out.paste(crop,(30,i*350+55))
out.save(base/'schedule-comparison.png')

