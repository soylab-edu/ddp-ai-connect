from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import subprocess
import json
import re
import hashlib

root = Path(__file__).resolve().parent
class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=[]; self.links=[]; self.scripts=[]; self.in_script=False; self.buffer=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag == 'a' and a.get('href','').startswith('#'): self.links.append(a['href'])
        if tag == 'script' and not a.get('src'): self.in_script=True; self.buffer=[]
    def handle_data(self, data):
        if self.in_script:self.buffer.append(data)
    def handle_endtag(self, tag):
        if tag == 'script' and self.in_script:
            self.scripts.append(''.join(self.buffer));self.in_script=False

text=(root/'03_NEXT_KCORE_AI_CONNECT_v12.html').read_text(encoding='utf-8')
p=Audit();p.feed(text)
duplicates=[k for k,v in Counter(p.ids).items() if v>1]
missing=sorted({v for v in p.links if v!='#' and v[1:] not in p.ids})
assert not duplicates, duplicates
assert not missing, missing
checks=[]
for i,js in enumerate(p.scripts):
    target=root/'review'/f'page-script-{i+1}.js'
    target.parent.mkdir(exist_ok=True)
    target.write_text(js,encoding='utf-8')
    result=subprocess.run(['node','--check',str(target)],capture_output=True,text=True,encoding='utf-8')
    checks.append({'script':i+1,'ok':result.returncode==0,'error':result.stderr.strip()})
assert all(c['ok'] for c in checks), checks
source=Path('D:/DDP/03_NEXT_KCORE_AI_CONNECT_v11.html')
source_hash=hashlib.sha256(source.read_bytes()).hexdigest()
unchanged=source_hash=='7e6b316f0f22a628fb7849914ae549340d1eded3058ecc52102a87f0ef8e7e27'
assert unchanged, 'Original source changed'
report={'uniqueIds':len(p.ids),'duplicateIds':duplicates,'missingAnchorTargets':missing,'scriptSyntax':checks,'originalUnchanged':unchanged,'originalSha256':source_hash}
(root/'review'/'page-static-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=True))
