from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parent
class OutlinePen(BasePen):
    def __init__(self,glyphSet,scale,offset):
        super().__init__(glyphSet);self.commands=[];self.scale=scale;self.offset=offset
    def point(self,p):return [round((p[0]+self.offset)*self.scale,6),round(p[1]*self.scale,6)]
    def _moveTo(self,p):self.commands.append(['M',*self.point(p)])
    def _lineTo(self,p):self.commands.append(['L',*self.point(p)])
    def _curveToOne(self,a,b,c):self.commands.append(['C',*self.point(a),*self.point(b),*self.point(c)])
    def _qCurveToOne(self,a,b):self.commands.append(['Q',*self.point(a),*self.point(b)])
    def _closePath(self):self.commands.append(['Z'])
    def _endPath(self):pass
result={}
for word,filename in [('사람','IBMPlexSansKR-SemiBold.ttf'),('AI','Outfit.ttf')]:
    f=TTFont(ROOT/'assets'/filename);gs=f.getGlyphSet();cm=f.getBestCmap();up=f['head'].unitsPerEm;offset=0;commands=[]
    for char in word:
        name=cm[ord(char)];pen=OutlinePen(gs,1/up,offset);gs[name].draw(pen);commands+=pen.commands;offset+=f['hmtx'].metrics[name][0]
    result[word]={'commands':commands,'width':offset/up}
(ROOT/'assets'/'glyphs.js').write_text('window.glyphData='+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';',encoding='utf-8')
