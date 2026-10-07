from pathlib import Path
p=Path('D:/DDP/reference-reset/styleframes/build-board.py');s=p.read_text(encoding='utf-8')
s=s.replace("'lime','<div class=\"connect-title\">AI CONNECT", "'sequence-lavender','<div class=\"connect-title\">AI CONNECT")
s=s.replace('.connect-dot{color:#7a00ee}.word-mask', '.scene.sequence-lavender{background:#D8C8F0;color:#080808}.connect-dot{color:#7a00ee}.word-mask')
s=s.replace("sequence=[('AI CONNECT','#ccff00','#080808','14.7'),('DDP','#080808','#f5f5ed','27'),('AI','#ccff00','#080808','30'),('SOYLAB','#080808','#ccff00','23'),('CREATORS','#ccff00','#080808','18.1'),('ONE','#080808','#f5f5ed','27')]", "sequence=[('AI CONNECT','#d8c8f0','#080808','14.7'),('DDP','#c2e8d8','#080808','27'),('AI','#080808','#f5f5ed','30'),('SOYLAB','#f3edab','#080808','23'),('CREATORS','#f3bc91','#080808','18.1'),('ONE','#080808','#f5f5ed','27')]")
s=s.replace('블랙과 네온그린 바탕이 번갈아 전환됩니다.', '연보라 → 민트 → 블랙 → 레몬 → 오렌지 → 블랙 순서로 전환됩니다. 밝은 배경은 블랙 글자, 블랙 배경은 흰 글자를 사용합니다.')
s=s.replace('시안 v2','시안 v3').replace('STYLEFRAMES v2','STYLEFRAMES v3')
p.write_text(s,encoding='utf-8')
r=p.parent
for fn in ['BRIEF.md','STORYBOARD.md']:
 p=r/fn;s=p.read_text(encoding='utf-8');s=s.replace('Alternate black/lime background, white/black/lime text.', 'Background order: lavender #D8C8F0, mint #C2E8D8, black #080808, lemon #F3EDAB, orange #F3BC91, black #080808. Black type on light backgrounds; off-white #F5F5ED on black.');s=s.replace('Background alternates lime/black; words use black/white/lime.', 'Background sequence: lavender #D8C8F0 / mint #C2E8D8 / black #080808 / lemon #F3EDAB / orange #F3BC91 / black #080808. Black type on light colors, off-white on black.');s+='\nRevision 3: only scene 06 uses the user-specified soft six-color sequence. Other scenes retain their existing background colors. All six periods remain #7A00EE.\n';p.write_text(s,encoding='utf-8')
