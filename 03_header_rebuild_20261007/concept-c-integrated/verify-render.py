"""Inspect the actual encoded delivery, not only browser seek screenshots."""
from pathlib import Path
import json
import subprocess
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
VIDEO = ROOT / 'preview-integrated-hq.mp4'
OUT = ROOT / 'review-encoded'
OUT.mkdir(exist_ok=True)

def run(args):
    return subprocess.run(args, check=True, capture_output=True, text=True)

probe = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames,duration',
    '-show_entries', 'format=duration,size', '-of', 'json', str(VIDEO)]).stdout)
(OUT / 'ffprobe.json').write_text(json.dumps(probe, indent=2), encoding='utf-8')
stream = probe['streams'][0]
assert (stream['width'], stream['height']) == (3200, 1280), stream
assert stream['r_frame_rate'] == '30/1', stream
assert int(stream['nb_frames']) == 600, stream
assert abs(float(probe['format']['duration']) - 20) < .001, probe

def frames(name, indices):
    folder = OUT / name
    folder.mkdir(exist_ok=True)
    expression = '+'.join(f'eq(n,{n})' for n in indices)
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(VIDEO),
         '-vf', f"select='{expression}'", '-fps_mode', 'vfr', str(folder / '%02d.png')])
    return [(folder / f'{i+1:02d}.png', n/30) for i,n in enumerate(indices)]

def sheet(items, path, columns=4, tile_width=640):
    tile_height = round(tile_width * 640 / 1600)
    label = 28
    rows = (len(items) + columns - 1) // columns
    result = Image.new('RGB', (columns*tile_width, rows*(tile_height+label)), '#191919')
    draw = ImageDraw.Draw(result)
    for i,(image_path, seconds) in enumerate(items):
        x = i % columns * tile_width
        y = i // columns * (tile_height+label)
        draw.text((x+9,y+7), f'{seconds:.3f}s | encoded frame {round(seconds*30)}', fill='white')
        with Image.open(image_path) as im:
            result.paste(im.convert('RGB').resize((tile_width,tile_height),Image.Resampling.LANCZOS),(x,y+label))
    result.save(path, quality=94)

whole = frames('whole-2fps', list(range(0,600,15)))
sheet(whole[:20], OUT/'whole-2fps-1.jpg')
sheet(whole[20:], OUT/'whole-2fps-2.jpg')
bridge_indices = sorted(set([round((10.2+i*.25)*30) for i in range(19)]+[447]))
bridge = frames('bridge-4fps', bridge_indices)
sheet(bridge, OUT/'bridge-4fps.jpg')
special = frames('key-frames', [320, 534, 599])
for (source,_), name in zip(special,['bridge-10.667s-hq.png','poster-transition-17.8s-hq.png','poster-hq.png']):
    (OUT/name).write_bytes(source.read_bytes())
(ROOT/'poster-hq.png').write_bytes(special[-1][0].read_bytes())
print(json.dumps({'validated':probe, 'whole_frames':len(whole), 'bridge_frames':len(bridge), 'output':str(OUT)},indent=2))
