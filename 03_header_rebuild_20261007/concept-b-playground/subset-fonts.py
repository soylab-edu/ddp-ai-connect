from pathlib import Path
from fontTools import subset
root=Path(__file__).resolve().parent
text=''.join(p.read_text(encoding='utf-8-sig') for p in [root/'index.html',root/'scene.js',root/'player.js'])
for weight in ['Regular','SemiBold']:
    font=subset.load_font(str(root/'assets'/f'IBMPlexSansKR-{weight}.ttf'),subset.Options())
    engine=subset.Subsetter(options=subset.Options())
    engine.populate(text=text)
    engine.subset(font)
    font.flavor='woff2'
    font.save(root/'assets'/f'IBMKR-{weight}.woff2')
print('Korean subsets include all rendered copy and player labels.')
