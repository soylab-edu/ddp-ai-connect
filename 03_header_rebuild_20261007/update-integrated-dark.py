from pathlib import Path
import re
p=Path('D:/DDP/03_header_rebuild_20261007/page-review-v7.html');s=p.read_text(encoding='utf-8')
s=s.replace('data-theme="light"','data-theme="dark"',1)
s,n=re.subn(r'<aside class="class-background rv".*?</aside>','',s,flags=re.S);assert n==1,n
s,n=re.subn(r'\s*<div><b>120</b><span>THE CLASS 1·2기 창작자 — 1기 60 · 2기 60</span></div>','',s);assert n==1,n
s=s.replace('src="/reference-reset/motion/header.html"','src="/reference-reset/motion/header.html?embed=1"')
bridge='''<link rel="stylesheet" href="dark-body.css"><style id="v7-review-bridge">.rebuild-cover{padding:0;background:#080808;height:min(calc(100svh - 60px),calc(100vw * 3 / 7 + 54px));overflow:hidden}.rebuild-cover iframe{width:100%;height:100%;min-height:0;aspect-ratio:auto;border:0;border-radius:0;display:block}@media(max-width:719px){.rebuild-cover{height:calc(100svh - 60px)}}</style>'''
s,n=re.subn(r'<style id="v7-review-bridge">.*?</style>',lambda m:bridge,s,flags=re.S);assert n==1,n
p.write_text(s,encoding='utf-8')
print('Updated integrated page, removed education/person-count statistics, linked dark body theme and responsive header bridge.')
