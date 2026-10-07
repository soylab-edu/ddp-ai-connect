from html.parser import HTMLParser
from pathlib import Path
class Visible(HTMLParser):
 def __init__(self):super().__init__();self.skip=False;self.items=[];self.ids=[]
 def handle_starttag(self,t,a):
  if t in ('script','style'):self.skip=True
  x=dict(a)
  if x.get('id'):self.ids.append(x['id'])
 def handle_endtag(self,t):
  if t in ('script','style'):self.skip=False
 def handle_data(self,d):
  if not self.skip:self.items.append(d)
x=Visible();x.feed(Path('D:/DDP/03_header_rebuild_20261007/page-review-v7.html').read_text(encoding='utf-8'));txt=' '.join(x.items)
print({term:term in txt for term in ['경쟁률','764','120','1기 60','2기 60']});print('Duplicate IDs:',sorted({i for i in x.ids if x.ids.count(i)>1}));print('Preserved date:', '12.09' in txt, '12.10' in txt)
