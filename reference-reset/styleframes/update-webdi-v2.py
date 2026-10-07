from pathlib import Path
import re
p=Path('D:/DDP/reference-reset/styleframes/build-board.py')
s=p.read_text(encoding='utf-8')
s=s.replace("@font-face{font-family:NotoSerifKR;src:url('assets/NotoSerifKR-Month.woff2');font-weight:100 900}",'')
s=s.replace('퍼플로 단번에 전환. 숫자가 1 → 12로 커지고 月이 붙습니다. 날짜 자체가 화면의 중심입니다.','퍼플 화면에 DEC를 크게 드러내고, 아래 09—10과 2026으로 행사 날짜를 읽힙니다.')
s=s.replace('<div class="date-hero"><span class="num">12</span><span class="month">月</span></div><div class="date-detail">2026.12.09 — 10</div>','<div class="date-word">DEC</div><div class="date-days">09—10 <span>2026</span></div>')
s=s.replace('<div class="final-date"><span class="num">12</span><span class="month">月</span></div>','<div class="final-date"><div class="final-month">DEC</div><div class="final-days">09—10 <span>2026</span></div></div>')
s=s.replace('왼쪽의 큰 월 표기와 오른쪽 행사명을 중심으로 고정합니다.','왼쪽 DEC / 09—10과 오른쪽 행사명을 중심으로 고정합니다.')
s=s.replace("'06 · AI CONNECT.'","'06 · WORD SEQUENCE'")
s=s.replace('네온그린으로 전환하고 큰 AI CONNECT.가 화면을 가로지릅니다. 빨간 마침표로 강조합니다.','AI CONNECT. → DDP. → AI. → SOYLAB. → CREATORS. → ONE. 여섯 단어가 수평 마스크 안으로 빠르게 진입·퇴장합니다. 클릭하면 전체 색 조합을 볼 수 있습니다.')
s=s.replace('color:#df0221}.final-date','color:#7a00ee}.final-date')
s=s.replace("cards=[]",'''css += """
.date-word{position:absolute;top:7cqw;left:0;right:0;text-align:center;font:800 30cqw/.9 Outfit;letter-spacing:-.065em}
.date-days{position:absolute;top:33.5cqw;left:0;right:0;text-align:center;font:600 3.2cqw/1 Outfit;letter-spacing:.04em}.date-days span{font-size:1.15cqw;letter-spacing:.2em;margin-left:1.5cqw;vertical-align:middle}
.final-date{left:6.7cqw;top:11.3cqw;display:block}.final-month{font:800 18cqw/.85 Outfit;letter-spacing:-.07em}.final-days{font:600 5.6cqw/1 Outfit;letter-spacing:-.02em;margin-top:1.6cqw}.final-days span{font:400 1.1cqw Outfit;letter-spacing:.12em;vertical-align:middle;margin-left:1cqw}
.connect-dot{color:#7a00ee}.word-mask{position:absolute;left:4cqw;right:4cqw;top:12.5cqw;height:18cqw;overflow:hidden;display:flex;align-items:center}.word-large{font:800 var(--word-size,24cqw)/.95 Outfit;letter-spacing:-.065em;white-space:nowrap}.word-mask .connect-dot{letter-spacing:-.04em}
"""

cards=[]''')
s=s.replace("cards.append(f'<article>","destination='06-sequence.html' if n==6 else f'{n:02}-{slug}.html'\n    cards.append(f'<article>")
s=s.replace('href="{n:02}-{slug}.html" target="_blank" title="크게 보기"','href="{destination}" target="_blank" title="크게 보기"')
s=s.replace('Outfit · Pretendard · 月 serif','Outfit · Pretendard · DEC / 09—10')
s=s.replace('큰 월 표기 / 퍼플 배경','영문 월 DEC / 퍼플 배경').replace('굵은 단어 / 네온그린 배경','6단어 수평 마스크 / 보라 마침표').replace('큰 날짜 + 오른쪽 행사 정보','DEC · 09—10 + 오른쪽 행사 정보')
s=s.replace('→ AI CONNECT. → 행사 헤더','→ 6단어 시퀀스 → 행사 헤더')
s += '''
sequence=[('AI CONNECT','#ccff00','#080808','14.7'),('DDP','#080808','#f5f5ed','27'),('AI','#ccff00','#080808','30'),('SOYLAB','#080808','#ccff00','23'),('CREATORS','#ccff00','#080808','18.1'),('ONE','#080808','#f5f5ed','27')]
sequence_cards=[]
for idx,(word,bg,fg,size) in enumerate(sequence,1):
    frame=f'<section class="scene" style="background:{bg};color:{fg}">{meta(6)}<div class="word-mask" style="--word-size:{size}cqw"><div class="word-large">{word}<span class="connect-dot">.</span></div></div></section>'
    sequence_cards.append(f'<article>{frame}<div class="caption"><h2>06.{idx:02} · {word}.</h2><span>{bg.upper()} / {fg.upper()}</span></div></article>')
sequence_css='.sequence-grid article:last-child{grid-column:auto;max-width:none}.sequence-grid .scene{width:100%}.motion-rule{padding:18px 0;border-top:1px solid #ccc;margin-top:24px;font-size:13px;line-height:1.7}'
sequence_page=f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>06 — 여섯 단어 시퀀스</title><style>{css}{boardcss}{sequence_css}</style></head><body><header class="board-head"><div class="eyebrow">06 / WORD SEQUENCE / STATIC COLOR STUDY</div><h1>여섯 단어, 하나의 보라 마침표.</h1><p>AI CONNECT. → DDP. → AI. → SOYLAB. → CREATORS. → ONE.<br>블랙과 네온그린 바탕이 번갈아 전환됩니다. 모든 마침표는 SOYLAB 보라 #7A00EE로 고정합니다.</p><div class="motion-rule">모션 계획 · 약 0.3초씩, 총 1.8초. 고정된 수평 마스크 안에서 단어가 왼쪽 밖에서 진입하고 오른쪽 밖으로 빠져나갑니다. 글자 길이에 맞춰 이동 거리를 조정하고 마침표도 단어와 함께 움직입니다.<br>아래는 색·크기·순서를 검토하는 정지 시안입니다.</div><a href="storyboard.html">전체 시안으로 돌아가기 ↗</a></header><main class="grid sequence-grid">{"".join(sequence_cards)}</main></body></html>'
(ROOT/'06-sequence.html').write_text(sequence_page,encoding='utf-8')
'''
p.write_text(s,encoding='utf-8')
