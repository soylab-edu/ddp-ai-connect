from pathlib import Path
from math import sin, cos, pi, sqrt
import html

ROOT=Path(__file__).parent
css='''
@font-face{font-family:Outfit;src:url('assets/Outfit.ttf')}@font-face{font-family:Pretendard;src:url('assets/Pretendard-ExtraBold.woff2');font-weight:800}@font-face{font-family:Pretendard;src:url('assets/Pretendard-Regular.woff2');font-weight:400}
*{box-sizing:border-box}html,body{margin:0}body{font-family:Pretendard,Arial,sans-serif;color:#f5f5ed}.scene{position:relative;aspect-ratio:7/3;container-type:inline-size;overflow:hidden;background:#080808;color:#f5f5ed}.scene.purple{background:#7a00ee}.scene.lime{background:#ccff00;color:#090909}.meta{position:absolute;z-index:3;inset:3.6cqw 3.7cqw auto;display:flex;justify-content:space-between;font:400 .67cqw/1.5 Outfit,sans-serif;letter-spacing:.11em}.meta .right{text-align:right}.footer{position:absolute;z-index:3;bottom:2.9cqw;left:3.7cqw;right:3.7cqw;display:flex;justify-content:space-between;font:400 .64cqw Outfit,sans-serif;letter-spacing:.14em}.dots{position:absolute;left:28%;top:14%;width:44%;height:73%}.opening-line{position:absolute;bottom:6.5cqw;left:0;right:0;text-align:center;font:400 .83cqw Outfit;letter-spacing:.32em}.message-copy{position:absolute;left:8.5cqw;top:10.5cqw;font:800 7.1cqw/1.21 Pretendard;letter-spacing:-.07em;margin:0}.message-copy em{font-style:normal;color:#ccff00}.message-sub{position:absolute;right:8cqw;bottom:9.8cqw;text-align:right;font:400 .85cqw/1.9 Outfit;letter-spacing:.12em}.red{color:#df0221}.wave-field{position:absolute;left:-12cqw;top:1.8cqw;width:128cqw;transform:rotate(-13deg)}.ribbon{white-space:nowrap;font:800 6.3cqw/1.12 Outfit,Pretendard;letter-spacing:-.035em}.ribbon:nth-child(2){margin-left:-12cqw}.ribbon:nth-child(3){margin-left:4cqw}.ribbon:nth-child(4){margin-left:-4cqw}.ribbon:nth-child(5){margin-left:7cqw}.ribbon:nth-child(6){margin-left:-14cqw}.ribbon span{display:inline-block}.outline{-webkit-text-stroke:.085cqw #f5f5ed;color:transparent}.wave-white{color:#f5f5ed}.wave-lime{color:#ccff00}.wave-red{color:#ff4767}.wave .meta,.wave .footer{background:#7a00ee;inset-inline:0;padding-inline:3.7cqw}.wave .meta{top:0;padding-top:1.7cqw;padding-bottom:1.1cqw}.wave .footer{bottom:0;padding-top:1cqw;padding-bottom:1.7cqw}.logo-art{position:absolute;width:31cqw;height:33.3cqw;object-fit:contain;left:34.5cqw;top:4.6cqw}.logo-side{position:absolute;top:20cqw;left:7cqw;font:400 1cqw/1.7 Outfit;letter-spacing:.18em}.logo-side.right{left:auto;right:7cqw;text-align:right}.connect-title{position:absolute;left:4.1cqw;top:13.5cqw;font:800 14.7cqw/.95 Outfit;letter-spacing:-.072em;white-space:nowrap}.connect-sub{position:absolute;left:4.8cqw;bottom:9.2cqw;font:800 1.05cqw Pretendard;letter-spacing:.08em}.connect-dot{color:#ffffff}.final-date{position:absolute;left:6cqw;top:9.5cqw;display:flex;align-items:baseline;gap:.6cqw}.final-main{position:absolute;left:46.4cqw;top:10cqw}.final-kicker{font:400 .83cqw Outfit;letter-spacing:.25em;color:#ccff00;margin-bottom:1.2cqw}.final-title{font:800 5.3cqw/.98 Outfit;letter-spacing:-.045em;margin:0 0 1.15cqw}.final-slogan{font:800 2.1cqw/1.4 Pretendard;letter-spacing:-.055em}.final-info{position:absolute;left:7cqw;right:7cqw;bottom:7.6cqw;border-top:1px solid #444;padding-top:1.6cqw;display:grid;grid-template-columns:1.1fr 1fr 1.1fr;gap:3cqw;align-items:end}.detail-label{font:400 .61cqw Outfit;letter-spacing:.2em;color:#b9b9b2;margin-bottom:.55cqw}.detail-value{font:800 1.4cqw Outfit,Pretendard}.actions{display:flex;gap:.6cqw;justify-content:flex-end}.actions span{padding:1cqw 1.2cqw;font:800 .75cqw Pretendard;border:1px solid #aaa;white-space:nowrap}.actions span:first-child{background:#ccff00;color:#080808;border-color:#ccff00}.final-wave{position:absolute;bottom:2.6cqw;left:-.6cqw;white-space:nowrap;font:800 1.23cqw Outfit,Pretendard;letter-spacing:-.02em;color:#b677ff}.final-wave b{color:#f5f5ed;margin:0 1cqw}.final-stamp{position:absolute;right:4cqw;top:2.3cqw;width:6.3cqw;height:6.7cqw;object-fit:contain}.final .meta{right:13cqw}.final .footer{display:none}
'''

def dots():
    colors=['#397EF3','#FF4C9D','#00AE9E','#F58438']
    pts=[]
    for i in range(620):
        z=1-2*(i+.5)/620
        theta=i*pi*(3-sqrt(5))
        r=sqrt(1-z*z)
        x=r*cos(theta); y=r*sin(theta)
        # Small points with gentle depth; no radial strokes or starburst.
        xx=370+235*x+23*sin(y*2.8)
        yy=260+173*y+14*sin(x*3.1)
        depth=(z+1)/2
        radius=1.55+depth*2.15
        pts.append(f'<circle cx="{xx:.2f}" cy="{yy:.2f}" r="{radius:.2f}" fill="{colors[i%len(colors)]}" opacity="{.27+.73*depth:.2f}"/>')
    return '<svg class="dots" viewBox="0 0 740 520" aria-label="작은 컬러 닷들이 모인 입체적인 구름">'+''.join(pts)+'</svg>'

def meta(n):
    return f'<div class="meta"><div>NEXT K-CORE<br>AI CONNECT / 2026</div><div class="right">09—10 DEC<br>DDP · SEOUL</div></div><div class="footer"><span>SOYLAB.AI / PEOPLE MEET PEOPLE</span><span>0{n} — 07</span></div>'

wavewords=[('HUMAN AI HUMAN AI HUMAN AI','wave-white'),('GAME ART STORY GAME ART STORY','outline'),('사람과 사람 · AI CONNECT · 사람과 사람','wave-lime'),('CONNECT CREATE CONNECT CREATE','wave-white'),('AI CONNECT AI CONNECT AI CONNECT','outline'),('STORY GAME ART STORY GAME ART','wave-lime')]
wave=''.join('<div class="ribbon '+color+'">'+''.join(f'<span style="transform:translateY({sin(j*.57+k*.8)*.55:.2f}cqw)">{html.escape(ch) if ch!=" " else "&nbsp;"}</span>' for j,ch in enumerate(word))+'</div>' for k,(word,color) in enumerate(wavewords))

scenes=[
('dots','01 · COLOR DOTS','0.0–1.4s','작은 컬러 닷들이 중앙으로 모이며 깊이가 생깁니다. 블랙 화면의 여백과 작은 주변 정보를 유지합니다.','',dots()+'<div class="opening-line">PEOPLE · IDEAS · POSSIBILITIES</div>'),
('date','02 · DECEMBER','1.4–2.7s','퍼플 화면에 숫자 12를 크게 드러내고 작은 DEC를 붙입니다. 아래 09—10과 2026으로 행사 날짜를 읽힙니다.','purple','<div class="date-word"><span class="date-numeral">12</span><span class="date-month-label">DEC</span></div><div class="date-days">09—10 <span>2026</span></div>'),
('message','03 · PEOPLE MEET PEOPLE','2.7–5.2s','짧게 멈추며 문장을 읽히게 합니다. 작은 행사 키워드와 큰 한글의 비례를 대비시킵니다.','','<h2 class="message-copy">AI를 사이에 두고,<br>사람과 사람이 <em>만나다.</em></h2><div class="message-sub"><span class="red">GAME · ART · STORY</span><br>EXHIBITION / SCREENING<br>TALK / CONNECT</div>'),
('wave','04 · TYPOGRAPHIC WAVE','5.2–7.3s','큰 단어 여섯 줄이 사선으로 화면을 채웁니다. 행마다 속도와 굴곡을 달리하고, 화면 가장자리 밖까지 이어집니다.','purple wave','<div class="wave-field">'+wave+'</div>'),
('logo','05 · SOYLAB','7.3–8.8s','제공한 로고 원본을 크게 사용합니다. 컬러 선부터 중앙 글자까지 드러내는 마스크와 짧은 확대를 계획합니다.','','<div class="logo-side">MANY IDEAS.<br>ONE CONNECTION.</div><img class="logo-art" src="assets/soylab-logo.png" alt="SOY.LAB 원본 로고"><div class="logo-side right">GAME<br>ART<br>STORY</div>'),
('connect','06 · WORD SEQUENCE','8.8–11.2s','AI CONNECT. → DDP. → AI. → SOYLAB. → CREATORS. → ONE. 여섯 단어가 수평 마스크 안으로 빠르게 진입·퇴장합니다. 클릭하면 전체 색 조합을 볼 수 있습니다.','sequence-cobalt','<div class="connect-title">AI CONNECT<span class="connect-dot">.</span></div><div class="connect-sub">게임 · 예술 · 이야기로 연결되는 사람들</div>'),
('final','07 · EVENT HEADER','11.2s → HOLD','왼쪽 큰 12 + 작은 DEC / 09—10과 오른쪽 행사명을 중심으로 고정합니다. 하단 한 줄의 텍스트 웨이브만 작게 이어집니다.','final','<div class="final-date"><div class="final-month"><span class="final-numeral">12</span><span class="final-month-label">DEC</span></div><div class="final-days">09—10 <span>2026</span></div></div><div class="final-main"><div class="final-kicker">NEXT K-CORE 2026</div><h2 class="final-title">AI CONNECT.</h2><div class="final-slogan">AI를 사이에 두고,<br>사람과 사람이 만나다.</div></div><img class="final-stamp" src="assets/soylab-logo.png" alt="SOY.LAB"><div class="final-info"><div><div class="detail-label">WHEN</div><div class="detail-value">2026.12.09–10</div></div><div><div class="detail-label">WHERE</div><div class="detail-value">DDP 디자인랩 3층 디자인홀</div></div><div class="actions"><span>프로그램 보기 ↗</span><span>관람 안내 ↘</span></div></div><div class="final-wave">GAME <b>ART</b> STORY <b>전시</b> 상영 <b>강의</b> 교류 <b>AI CONNECT</b> GAME <b>ART</b> STORY <b>전시</b> 상영 <b>강의</b> 교류 <b>AI CONNECT</b> GAME <b>ART</b> STORY <b>전시</b> 상영 <b>강의</b> 교류 <b>AI CONNECT</b> GAME</div>'),
]

css += """
.date-word{position:absolute;top:7cqw;left:0;right:0;text-align:center;font:800 30cqw/.9 Outfit;letter-spacing:-.065em}
.date-days{position:absolute;top:33.5cqw;left:0;right:0;text-align:center;font:600 3.2cqw/1 Outfit;letter-spacing:.04em}.date-days span{font-size:1.15cqw;letter-spacing:.2em;margin-left:1.5cqw;vertical-align:middle}
.final-date{left:6.7cqw;top:10cqw;display:block}.final-month{font:800 16cqw/.85 Outfit;letter-spacing:-.07em}.final-days{font:600 4.3cqw/1 Outfit;letter-spacing:-.02em;margin-top:.8cqw}.final-days span{font:400 1.1cqw Outfit;letter-spacing:.12em;vertical-align:middle;margin-left:1cqw}
.scene.sequence-cobalt{background:#397EF3;color:#080808}.connect-dot{color:#ffffff}.word-mask{position:absolute;left:4cqw;right:4cqw;top:8cqw;height:28cqw;overflow:hidden;display:flex;align-items:center}.word-large{font:800 var(--word-size,24cqw)/.95 Outfit;letter-spacing:-.065em;white-space:nowrap}.word-mask .connect-dot{letter-spacing:-.04em}
"""

css += """
.date-word{top:6.5cqw;display:flex;align-items:baseline;justify-content:center;gap:1.4cqw;font-size:0}.date-numeral{font:800 33cqw/.85 Outfit;letter-spacing:-.04em}.date-month-label{font:600 4.4cqw/1 Outfit;letter-spacing:.015em}.date-days{top:35cqw}
.final-month{display:flex;align-items:baseline;gap:1.1cqw;font-size:0}.final-numeral{font:800 22cqw/.85 Outfit;letter-spacing:-.04em}.final-month-label{font:600 3.1cqw/1 Outfit;letter-spacing:.015em}.final-date{top:7.8cqw}.final-days{font-size:2cqw;margin-top:.5cqw}.final-days span{font-size:.95cqw}
"""
cards=[]
for n,(slug,title,time,note,klass,content) in enumerate(scenes,1):
    section=f'<section class="scene {klass}" id="frame-{n:02}">{meta(n)}{content}</section>'
    (ROOT/f'{n:02}-{slug}.html').write_text(f'<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>{title}</title><style>{css}body{{background:#080808}}.scene{{width:100vw}}</style>{section}</html>',encoding='utf-8')
    destination='06-sequence.html' if n==6 else f'{n:02}-{slug}.html'
    cards.append(f'<article><a class="frame-link" href="{destination}" target="_blank" title="크게 보기">{section}</a><div class="caption"><h2>{title}</h2><span>{time}</span></div><p class="note">{note}</p></article>')

boardcss='''body{background:#eeeee9;color:#161616;padding:48px 4vw 64px}.board-head{max-width:1600px;margin:0 auto 38px;border-bottom:1px solid #c5c5be;padding-bottom:28px}.eyebrow{font:600 12px Outfit;letter-spacing:.18em;margin-bottom:16px}.board-head h1{font:800 clamp(24px,3vw,44px) Pretendard;letter-spacing:-.055em;margin:0 0 13px}.board-head p{font-size:14px;line-height:1.7;margin:0;max-width:850px}.tag{display:inline-block;background:#ccff00;color:#111;padding:6px 9px;margin-top:17px;font:600 11px Outfit;letter-spacing:.07em}.grid{max-width:1600px;margin:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 24px}.grid article:last-child{grid-column:1/-1;max-width:1120px;width:100%;margin:0 auto}.frame-link{display:block;text-decoration:none;color:inherit}.caption{display:flex;justify-content:space-between;align-items:center;margin-top:12px;gap:12px}.caption h2{font:600 12px Outfit;letter-spacing:.05em;margin:0}.caption>span{font:400 11px Outfit;color:#555}.note{font-size:12px;line-height:1.7;margin:7px 0 0;color:#4c4c49}.board-end{max-width:1600px;margin:38px auto 0;border-top:1px solid #c5c5be;padding-top:20px;display:flex;justify-content:space-between;gap:30px;font-size:12px;line-height:1.8}.swatches{display:flex;gap:8px;align-items:center}.swatches i{width:24px;height:24px;border-radius:50%;display:block}.board-end b{font-weight:800}a:focus-visible{outline:3px solid #7a00ee;outline-offset:4px}@media(max-width:720px){body{padding:24px 14px}.grid{grid-template-columns:1fr}.grid article:last-child{grid-column:auto}.board-end{display:block}.swatches{margin-top:16px}.caption h2{font-size:11px}}
'''
board=f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI CONNECT — 레퍼런스 기반 정지 시안 v6</title><style>{css}{boardcss}</style></head><body><header class="board-head"><div class="eyebrow">SOYLAB / NEXT K-CORE 2026</div><h1>레퍼런스의 리듬, 우리의 그래픽.</h1><p>큰 타이포와 단색 화면 전환을 중심으로 다시 구성했습니다. 작은 컬러 닷, 사선 텍스트 웨이브, 실제 SOYLAB 로고를 사용합니다.<br>아래는 모션 제작 전 정지 시안입니다. 각 화면을 누르면 크게 볼 수 있습니다.</p><span class="tag">STYLEFRAMES v6 · 7:3 · 7 SCENES · INTRO ≈ 11s + HOLD</span></header><main class="grid">{''.join(cards)}</main><footer class="board-end"><div><b>화면을 이어가는 규칙</b><br>작은 모서리 정보는 고정 / 중앙 요소는 크게 / 색 전환은 짧고 분명하게<br>닷 → 날짜 → 메시지 → 텍스트 웨이브 → 로고 → 6단어 시퀀스 → 행사 헤더</div><div><b>색과 타이포</b><div class="swatches"><i style="background:#080808"></i><i style="background:#7a00ee"></i><i style="background:#ccff00"></i><i style="background:#df0221"></i><span>BLACK / PURPLE / LIME / RED TYPE</span></div><div>Outfit · Pretendard · 12 DEC / 09—10</div></div></footer></body></html>'''
(ROOT/'storyboard.html').write_text(board,encoding='utf-8')
(ROOT/'style.css').write_text(css,encoding='utf-8')
comparisons=[(0,'ref-01-intro.png','방사형 심볼 → 작은 컬러 닷'),(1,'ref-02-month.png','큰 12 + 작은 DEC / 퍼플 배경'),(3,'ref-04-pattern.png','화면 가득 패턴 → 사선 텍스트 웨이브'),(5,'ref-06-bold-type.png','6단어 수평 마스크 / 흰 마침표'),(6,'ref-08-final-poster.png','12 DEC · 09—10 + 오른쪽 행사 정보')]
compare_rows=[]
for i,ref,label in comparisons:
    n=i+1
    slug,title,time,note,klass,content=scenes[i]
    compare_rows.append(f'<h2 class="compare-label">{label}</h2><div class="compare-row"><figure><img src="reference/{ref}" alt="사용자 제공 레퍼런스 실제 프레임"><figcaption>REFERENCE · 사용자 제공 영상</figcaption></figure><figure><section class="scene {klass}">{meta(n)}{content}</section><figcaption>OUR STYLEFRAME · {title}</figcaption></figure></div>')
comparecss='''.compare-row{display:grid;grid-template-columns:1fr 1fr;gap:20px}.compare-row figure{margin:0}.compare-row img{display:block;width:100%;aspect-ratio:7/3;object-fit:contain;background:#000}.compare-row .logo-art,.compare-row .final-stamp{width:inherit;aspect-ratio:auto;background:transparent}.compare-row .final-stamp{width:6.3cqw}.compare-row figcaption{font:400 10px Outfit;margin-top:7px;letter-spacing:.08em}.compare-label{font:800 15px Pretendard;margin:32px 0 13px}main{max-width:1600px;margin:auto}.top-link{display:inline-block;margin-top:16px;color:#4b00a5;font-size:13px}@media(max-width:650px){.compare-row{grid-template-columns:1fr}}'''
compare=f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>레퍼런스와 정지 시안 비교</title><style>{css}{boardcss}{comparecss}</style></head><body><header class="board-head"><div class="eyebrow">REFERENCE / STYLEFRAMES v6</div><h1>원본과 나란히 보기.</h1><p>왼쪽은 제공하신 영상의 실제 프레임, 오른쪽은 새 정지 시안입니다. 화면 구성은 이어받고 색과 그래픽 소재를 바꿨습니다.</p><a class="top-link" href="storyboard.html">전체 7장 시안 보기 ↗</a></header><main>{"".join(compare_rows)}</main></body></html>'
(ROOT/'compare.html').write_text(compare,encoding='utf-8')
board=board.replace('<span class="tag">','<a href="compare.html" style="display:block;color:#4b00a5;margin-top:14px;font-size:13px">레퍼런스와 나란히 비교하기 ↗</a><span class="tag">',1)
(ROOT/'storyboard.html').write_text(board,encoding='utf-8')
print('Wrote storyboard and 7 full-frame previews')

sequence=[('AI CONNECT','#397ef3','#080808','14.7'),('DDP','#ff4c9d','#080808','27'),('AI','#080808','#f5f5ed','30'),('SOYLAB','#00ae9e','#080808','23'),('CREATORS','#f58438','#080808','18.1'),('ONE','#080808','#f5f5ed','27')]
sequence_cards=[]
for idx,(word,bg,fg,size) in enumerate(sequence,1):
    frame=f'<section class="scene" style="background:{bg};color:{fg}">{meta(6)}<div class="word-mask" style="--word-size:{size}cqw"><div class="word-large">{word}<span class="connect-dot">.</span></div></div></section>'
    sequence_cards.append(f'<article>{frame}<div class="caption"><h2>06.{idx:02} · {word}.</h2><span>{bg.upper()} / {fg.upper()}</span></div></article>')
sequence_css='.sequence-grid article:last-child{grid-column:auto;max-width:none}.sequence-grid .scene{width:100%}.motion-rule{padding:18px 0;border-top:1px solid #ccc;margin-top:24px;font-size:13px;line-height:1.7}'
sequence_page=f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>06 — 여섯 단어 시퀀스</title><style>{css}{boardcss}{sequence_css}</style></head><body><header class="board-head"><div class="eyebrow">06 / WORD SEQUENCE / STATIC COLOR STUDY</div><h1>여섯 단어, 하나의 흰 마침표.</h1><p>AI CONNECT. → DDP. → AI. → SOYLAB. → CREATORS. → ONE.<br>코발트블루 → 핫핑크 → 블랙 → 청록 → 오렌지 → 블랙 순서로 전환됩니다. 밝은 배경은 블랙 글자, 블랙 배경은 흰 글자를 사용합니다. 모든 마침표는 흰색 #FFFFFF로 고정합니다.</p><div class="motion-rule">모션 계획 · 약 0.4초씩, 총 2.4초. 고정된 수평 마스크 안에서 단어가 왼쪽 밖에서 진입하고 오른쪽 밖으로 빠져나갑니다. 글자 길이에 맞춰 이동 거리를 조정하고 마침표도 단어와 함께 움직입니다.<br>아래는 색·크기·순서를 검토하는 정지 시안입니다.</div><a href="storyboard.html">전체 시안으로 돌아가기 ↗</a></header><main class="grid sequence-grid">{"".join(sequence_cards)}</main></body></html>'
(ROOT/'06-sequence.html').write_text(sequence_page,encoding='utf-8')
