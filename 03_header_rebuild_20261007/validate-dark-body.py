from pathlib import Path
from html.parser import HTMLParser
import subprocess
p=Path('D:/DDP/03_header_rebuild_20261007/page-review-v7.html')
class Scripts(HTMLParser):
 def __init__(self):super().__init__();self.inside=False;self.arr=[];self.parts=[]
 def handle_starttag(self,t,a):
  if t=='script' and not dict(a).get('src'):self.inside=True;self.parts=[]
 def handle_endtag(self,t):
  if t=='script' and self.inside:self.arr.append(''.join(self.parts));self.inside=False
 def handle_data(self,d):
  if self.inside:self.parts.append(d)
x=Scripts();x.feed(p.read_text(encoding='utf-8'))
out=p.parent/'review'/'dark-body-validation';out.mkdir(exist_ok=True)
for i,script in enumerate(x.arr):
 f=out/f'inline-{i}.js';f.write_text(script,encoding='utf-8');r=subprocess.run(['node','--check',str(f)],capture_output=True,text=True);assert r.returncode==0,r.stderr
print('All',len(x.arr),'inline scripts parsed successfully.')
s=p.read_text(encoding='utf-8');print('Education aside:', '<aside class="class-background' in s, 'Person-count block:', '<b>120</b>' in s, 'Duplicate doors:', '<button class="door' in s, 'One guide tablist:', s.count('id="gtabs"'))
