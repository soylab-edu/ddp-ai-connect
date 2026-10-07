from pathlib import Path
p=Path('D:/DDP/reference-reset/styleframes/build-board.py');s=p.read_text(encoding='utf-8')
s=s.replace("colors=['#c4b9f4','#a9e5cb','#f2bdce','#dceca3','#a3cfef','#f1d2aa']", "colors=['#397EF3','#FF4C9D','#00AE9E','#F58438']").replace('colors[i%6]','colors[i%len(colors)]')
s=s.replace('sequence-lavender','sequence-cobalt').replace('background:#D8C8F0','background:#397EF3')
s=s.replace("sequence=[('AI CONNECT','#d8c8f0','#080808','14.7'),('DDP','#c2e8d8','#080808','27'),('AI','#080808','#f5f5ed','30'),('SOYLAB','#f3edab','#080808','23'),('CREATORS','#f3bc91','#080808','18.1'),('ONE','#080808','#f5f5ed','27')]", "sequence=[('AI CONNECT','#397ef3','#080808','14.7'),('DDP','#ff4c9d','#080808','27'),('AI','#080808','#f5f5ed','30'),('SOYLAB','#00ae9e','#080808','23'),('CREATORS','#f58438','#080808','18.1'),('ONE','#080808','#f5f5ed','27')]")
s=s.replace('연보라 → 민트 → 블랙 → 레몬 → 오렌지 → 블랙','코발트블루 → 핫핑크 → 블랙 → 청록 → 오렌지 → 블랙')
s=s.replace('PASTEL DOTS','COLOR DOTS').replace('작은 파스텔 닷','작은 컬러 닷').replace('시안 v3','시안 v4').replace('STYLEFRAMES v3','STYLEFRAMES v4')
p.write_text(s,encoding='utf-8')
for fn in ['BRIEF.md','STORYBOARD.md']:
 p=p.parent/fn if fn=='BRIEF.md' else Path('D:/DDP/reference-reset/styleframes')/fn
 s=p.read_text(encoding='utf-8');s=s.replace('pastel','vivid').replace('Pastel','Vivid').replace('static styleframes v3','static styleframes v4').replace('static v3 only','static v4 only')
 s+='\nRevision 4 supersedes the v3 pastel palette: scene 06 uses cobalt #397EF3 / hot pink #FF4C9D / black #080808 / teal #00AE9E / orange #F58438 / black #080808. Dot palette is cobalt, hot pink, teal and orange. Flat vivid colors without fluorescent glow. Periods stay #7A00EE. Other scene backgrounds unchanged.\n';p.write_text(s,encoding='utf-8')
