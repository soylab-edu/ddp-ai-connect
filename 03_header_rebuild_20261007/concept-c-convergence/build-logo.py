from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.basePen import BasePen
from pathlib import Path
import json
root=Path(__file__).resolve().parent
font=TTFont(root/'assets/Outfit.ttf')
if 'fvar' in font:font=instantiateVariableFont(font,{'wght':800},inplace=False)
class Pen(BasePen):
 def __init__(self,gs,scale,offset):super().__init__(gs);self.commands=[];self.scale=scale;self.offset=offset
 def p(self,p):return [round((p[0]+self.offset)*self.scale,6),round(p[1]*self.scale,6)]
 def _moveTo(self,p):self.commands.append(['M',*self.p(p)])
 def _lineTo(self,p):self.commands.append(['L',*self.p(p)])
 def _curveToOne(self,a,b,c):self.commands.append(['C',*self.p(a),*self.p(b),*self.p(c)])
 def _qCurveToOne(self,a,b):self.commands.append(['Q',*self.p(a),*self.p(b)])
 def _closePath(self):self.commands.append(['Z'])
 def _endPath(self):pass
gs=font.getGlyphSet();cm=font.getBestCmap();em=font['head'].unitsPerEm;offset=0;commands=[]
for char in 'SOYLAB':
 name=cm[ord(char)];pen=Pen(gs,1/em,offset);gs[name].draw(pen);commands+=pen.commands;offset+=font['hmtx'].metrics[name][0]+em*.014
(root/'assets/logo-glyphs.js').write_text('window.logoGlyph='+json.dumps({'commands':commands,'width':offset/em},separators=(',',':'))+';',encoding='utf-8')
print('SOYLAB outline ready',round(offset/em,3))
