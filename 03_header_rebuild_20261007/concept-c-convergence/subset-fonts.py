from pathlib import Path
from fontTools import subset
root=Path(__file__).resolve().parent
files=['index.html','scene.js','player.js','wave.js','wave.css']
text=''.join((root/file).read_text(encoding='utf-8-sig') for file in files)
for weight in ['Regular','SemiBold']:
    font=subset.load_font(str(root/'assets'/f'IBMPlexSansKR-{weight}.ttf'),subset.Options())
    engine=subset.Subsetter(options=subset.Options());engine.populate(text=text);engine.subset(font)
    font.flavor='woff2';font.save(root/'assets'/f'IBMKR-{weight}.woff2')
print('Local Korean font subsets include intro, poster, controls and all eight wave rows.')
