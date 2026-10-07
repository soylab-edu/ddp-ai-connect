from pathlib import Path
r=Path('D:/DDP/reference-reset/styleframes');p=r/'build-board.py';s=p.read_text(encoding='utf-8')
s=s.replace('<div class="date-word">DEC</div>', '<div class="date-word"><span class="date-numeral">12</span><span class="date-month-label">DEC</span></div>')
s=s.replace('<div class="final-month">DEC</div>', '<div class="final-month"><span class="final-numeral">12</span><span class="final-month-label">DEC</span></div>')
s=s.replace('퍼플 화면에 DEC를 크게 드러내고, 아래 09—10과 2026으로 행사 날짜를 읽힙니다.', '퍼플 화면에 숫자 12를 크게 드러내고 작은 DEC를 붙입니다. 아래 09—10과 2026으로 행사 날짜를 읽힙니다.')
s=s.replace('왼쪽 DEC / 09—10과 오른쪽 행사명', '왼쪽 큰 12 + 작은 DEC / 09—10과 오른쪽 행사명')
s=s.replace('영문 월 DEC / 퍼플 배경','큰 12 + 작은 DEC / 퍼플 배경').replace('DEC · 09—10 + 오른쪽 행사 정보','12 DEC · 09—10 + 오른쪽 행사 정보').replace('Outfit · Pretendard · DEC / 09—10','Outfit · Pretendard · 12 DEC / 09—10')
s=s.replace('시안 v5','시안 v6').replace('STYLEFRAMES v5','STYLEFRAMES v6')
s=s.replace('cards=[]','''css += """
.date-word{top:6.5cqw;display:flex;align-items:baseline;justify-content:center;gap:1.4cqw;font-size:0}.date-numeral{font:800 33cqw/.85 Outfit;letter-spacing:-.04em}.date-month-label{font:600 4.4cqw/1 Outfit;letter-spacing:.015em}.date-days{top:35cqw}
.final-month{display:flex;align-items:baseline;gap:1.1cqw;font-size:0}.final-numeral{font:800 24cqw/.85 Outfit;letter-spacing:-.04em}.final-month-label{font:600 3.1cqw/1 Outfit;letter-spacing:.015em}.final-date{top:8.4cqw}.final-days{font-size:2cqw;margin-top:1cqw}.final-days span{font-size:.95cqw}
"""
cards=[]''')
p.write_text(s,encoding='utf-8')
for fn in ['BRIEF.md','STORYBOARD.md']:
 p=r/fn;s=p.read_text(encoding='utf-8').replace('static styleframes v5','static styleframes v6').replace('static v5 only','static v6 only');s=s.replace('Date is English DEC with 09–10; no numeric-month/Hanja lockup.','Date hierarchy is a large numeral 12 with a small DEC label and secondary 09–10. No Hanja.').replace('Purple background, giant white DEC. A smaller 09—10 and 2026 sit underneath. English month word leads; no month numeral or Hanja.', 'Purple background, giant white 12 with small DEC aligned beside its baseline. Smaller 09—10 and 2026 underneath. No Hanja.').replace('Large DEC and 09—10 left','Large 12 with small DEC and secondary 09—10 left');s+='\nRevision 6 supersedes large DEC: scenes 02 and 07 use a large 12 with a small DEC label, paired as one date mark. Exact 2026.12.09–10 date remains below. Scene 06 vivid palette and white periods are unchanged.\n';p.write_text(s,encoding='utf-8')
