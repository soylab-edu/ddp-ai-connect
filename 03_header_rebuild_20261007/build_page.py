from pathlib import Path
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parent
SOURCE = Path('D:/DDP/03_NEXT_KCORE_AI_CONNECT_v11.html')
s = SOURCE.read_text(encoding='utf-8')

def replace_block(text, start, end, replacement):
    a = text.index(start)
    b = text.index(end, a)
    return text[:a] + replacement + text[b:]

def section(text, name):
    pat = rf'<section class="chap" id="{name}">.*?</section>'
    result = re.search(pat, text, re.S)
    assert result, name
    return result.group(0)

def svg(inner, bg, label):
    return f'<svg viewBox="0 0 480 300" role="img" aria-label="{label}"><rect width="480" height="300" fill="{bg}"/>{inner}</svg>'

game = svg('''<ellipse cx="240" cy="232" rx="128" ry="18" fill="#35155e" opacity=".14"/>
<g transform="translate(0,-8)"><path d="M135 104Q115 104 107 131L84 206Q79 231 99 235Q116 239 132 215L153 187H325L347 216Q364 240 382 233Q399 225 393 205L370 132Q362 104 342 104Z" fill="#381c60"/>
<path d="M139 93Q119 93 112 119L90 193Q84 218 104 222Q121 226 137 202L157 176H329L350 203Q368 227 386 220Q402 212 397 192L374 121Q366 93 346 93Z" fill="#9266da"/>
<path d="M139 93H346Q360 93 367 103H118Q126 93 139 93" fill="#baa0ef"/>
<rect x="132" y="127" width="63" height="20" rx="4" fill="#20152d"/><rect x="154" y="106" width="20" height="63" rx="4" fill="#20152d"/>
<circle cx="322" cy="116" r="12" fill="#d4ee60"/><circle cx="348" cy="141" r="12" fill="#d4ee60"/><circle cx="296" cy="141" r="12" fill="#e6daf9"/><circle cx="322" cy="166" r="12" fill="#e6daf9"/>
<rect x="222" y="128" width="39" height="8" rx="4" fill="#593784"/><circle cx="212" cy="168" r="14" fill="#45275f"/><circle cx="270" cy="168" r="14" fill="#45275f"/></g>''', '#eee8f7', '게임 · 보라색 게임 컨트롤러 그래픽')
art = svg('''<ellipse cx="252" cy="253" rx="128" ry="15" fill="#272b16" opacity=".12"/>
<path d="M138 59L317 43L350 222L171 244Z" fill="#747c50"/>
<path d="M127 50L306 34L339 213L160 235Z" fill="#fffef2"/>
<path d="M151 70L287 58L312 194L176 210Z" fill="#b8cd70"/>
<path d="M153 81C231 155 159 190 264 207L312 194L287 58C262 115 226 88 211 132C190 170 176 117 153 81Z" fill="#7453b0"/>
<ellipse cx="239" cy="127" rx="43" ry="42" fill="#e6efa8" transform="rotate(-10 239 127)"/>
<path d="M217 160C235 158 252 143 259 125C269 176 240 195 217 160Z" fill="#29213c"/>
<circle cx="217" cy="112" r="6" fill="#29213c"/><circle cx="251" cy="105" r="6" fill="#29213c"/>
<path d="M340 88L359 82L385 197L366 201Z" fill="#493768"/><path d="M366 201L378 233L385 197Z" fill="#dbcbaf"/>''', '#edf0df', '예술 · 색과 표정이 담긴 기울어진 캔버스 그래픽')
story = svg('''<ellipse cx="246" cy="241" rx="140" ry="17" fill="#282336" opacity=".12"/>
<g transform="translate(239 149) rotate(-12)"><rect x="-148" y="-93" width="142" height="182" rx="6" fill="#aca1bc"/><rect x="-151" y="-99" width="142" height="182" rx="6" fill="#dcd3eb"/><rect x="-134" y="-80" width="108" height="99" rx="3" fill="#6e4a9b"/><path d="M-130 16L-101 -42L-69 -14L-43 -63L-28 16Z" fill="#ccdf81"/><circle cx="-106" cy="-57" r="11" fill="#efe8f8"/><path d="M-133 38H-39M-133 52H-60" stroke="#9d8eb2" stroke-width="5"/></g>
<g transform="translate(264 147) rotate(10)"><rect x="-9" y="-91" width="145" height="181" rx="6" fill="#9684ab"/><rect x="-12" y="-98" width="145" height="181" rx="6" fill="#fffdf6"/><rect x="5" y="-79" width="111" height="100" rx="3" fill="#30223f"/><circle cx="59" cy="-31" r="29" fill="#c9dc7e"/><path d="M51 -47L76 -31L51 -15Z" fill="#30223f"/><path d="M7 40H113M7 55H81" stroke="#b7a9c6" stroke-width="5"/></g>''', '#eeebf2', '이야기 · 이미지와 영상이 겹쳐진 스토리 프레임 그래픽')

intro = f'''<section class="chap" id="intro"><div class="wrap">
<header class="chap-h rv"><div class="chap-no">01</div><div><p class="kick">THREE GENRES. ONE GATHERING.</p><h2>서로 다른 창작이,<br>하나의 만남으로.</h2><p class="desc">게임을 해 보고, 작품 앞에 머물고, 이야기를 함께 봅니다. NEXT K-CORE AI CONNECT는 AI 창작을 계기로 창작자·관람객·기업이 만나는 전시·상영·강의·교류의 자리입니다.</p></div></header>
<div class="purpose"><div class="rv"><p class="lead">우리가 모으려는 것은<br><em>작품 너머의 사람들</em>입니다.</p><p class="body muted">한 사람의 상상이 AI를 거쳐 작품이 되고, 그 작품이 다시 다른 사람과의 대화를 시작합니다. SOYLAB은 서로 다른 창작과 경험을 한자리에 모아, 함께 보고 배우고 이야기할 자리를 만듭니다.</p></div><div class="goals rv"><div class="goal"><b>01</b><strong>보고, 경험하고</strong><span>THE CLASS 1·2기 작품 전시와 상영, 게임 체험</span></div><div class="goal"><b>02</b><strong>함께 배우고</strong><span>누구나 신청할 수 있는 AI 창작 무료강의 4개 세션</span></div><div class="goal"><b>03</b><strong>다음 이야기를 나누고</strong><span>기업 부스·시연·상담과 창작자·관람객의 교류</span></div></div></div>
<div class="themes">
<article class="theme rv"><div class="art">{game}</div><span class="tn">01 / GAME</span><h4>직접 해 보는 세계</h4><p>AI로 만든 캐릭터와 세계관을 플레이하며, 창작자의 선택과 게임의 가능성을 만납니다.</p></article>
<article class="theme rv"><div class="art">{art}</div><span class="tn">02 / ART</span><h4>새롭게 바라보는 감각</h4><p>이미지·영상·미디어아트. 사람의 감각과 AI가 함께 만든 작품 앞에서 서로의 시선을 나눕니다.</p></article>
<article class="theme rv"><div class="art">{story}</div><span class="tn">03 / STORY</span><h4>함께 보는 이야기</h4><p>단편 영상·광고·스토리텔링. 한 사람에게서 시작한 이야기가 스크린을 넘어 다른 사람에게 닿습니다.</p></article>
</div>
<div class="gathering-note rv"><p><strong>세 장르를 잇는 것은 사람과 사람의 만남입니다.</strong><br>작품을 본 뒤 강의를 듣고, 시연을 경험한 뒤 대화를 이어갑니다. 이틀 동안 같은 공간에서 서로의 다음 창작을 발견합니다.</p><span class="credit">SOYLAB<br>CONNECTS PEOPLE</span></div>
<aside class="class-background rv" aria-label="창작의 배경 THE CLASS"><header><h3>이 만남이 시작된 곳, THE CLASS</h3><p>넥스트K코어 · AI 크리에이터 양성 과정</p></header><div class="class-stats"><div><strong>764<small>명</small></strong><span>1기 지원자 · 경쟁률 12.7 : 1</span></div><div><strong>60<small>명</small></strong><span>1기 창작자</span></div><div><strong>60<small>명</small></strong><span>2기 · 평일반 30 / 주말반 30</span></div><div><strong>12<small>주</small></strong><span>창작을 배우고 완성하는 과정</span></div></div><p class="footnote">문화체육관광부·한국콘텐츠진흥원 2026 AI특화 콘텐츠 창작자 양성 지원사업. 2기 과정 9.8–12.5, 행사 12.9–10.</p></aside>
</div></section>'''

entry = '''<div class="entry entry-inline" id="entry" aria-labelledby="entry-h"><div class="entry-h"><div><p class="kick">FIND YOUR WAY</p><h2 id="entry-h">당신의 방식으로 함께하세요.</h2></div><p>관심 있는 참여 방법을 고르면 추천 동선을 안내합니다.</p></div><div class="doors">
<button class="door rv" type="button" data-route="visitor" aria-pressed="false"><span class="n">01</span><span class="who">FOR VISITORS</span><h3>전시·상영 관람</h3><p>세 장르의 작품과 기업 부스를 둘러보고 새로운 창작을 만납니다.</p><span class="go">↗</span></button>
<button class="door rv" type="button" data-route="lecture" aria-pressed="false"><span class="n">02</span><span class="who">FOR LEARNERS</span><h3>무료강의</h3><p>12.9 오전 1회 · 오후 3회. 관심 있는 AI 창작 강의를 고릅니다.</p><span class="go">↗</span></button>
<button class="door rv" type="button" data-route="partner" aria-pressed="false"><span class="n">03</span><span class="who">FOR COMPANIES</span><h3>기업 참여</h3><p>서비스 시연·상담·창작 협업으로 사람과 다음 가능성을 만납니다.</p><span class="go">↗</span></button>
</div></div>'''

cover = '''<header class="rebuild-cover" id="top"><h1 class="sr">NEXT K-CORE AI CONNECT — AI를 사이에 두고, 사람과 사람이 만나다</h1><iframe id="headerFrame" src="concept-a-weave/header-a.html" title="AI CONNECT — 사람과 창작이 만나는 오프닝" allow="autoplay" loading="eager"></iframe><noscript><div class="cover-fallback"><h2>AI를 사이에 두고, 사람과 사람이 만나다</h2><p>2026.12.09–10 · DDP 디자인랩 3층 디자인홀</p><p>전시·상영·무료강의·교류</p><a class="btn pri" href="#program">프로그램 보기</a></div></noscript></header>\n'''

parts = {name: section(s, name) for name in ['program','works','lectures','partners','space','guide']}
parts['program'] = parts['program'].replace('<div class="prog-top">', '''<div class="public-hours rv" aria-label="일반 공개 시간"><div><b>12.09<small>수요일</small></b><strong>10:30–19:40</strong><p>전시·상영 · 무료강의 4회 · 기업 부스 · 교류</p></div><div><b>12.10<small>목요일</small></b><strong>15:00–19:40</strong><p>오전 수료식과 오후 통합 상영회는 교육생·관계자 대상</p></div></div><div class="prog-top">''')
parts['works'] = parts['works'].replace('<div class="chap-no">04</div>', '<div class="chap-no">03</div>')
parts['lectures'] = parts['lectures'].replace('<div class="chap-no">05</div>', '<div class="chap-no">04</div>').replace('<h2>무료강의</h2>', '<h2>함께 배우는 AI 창작</h2>')
parts['lectures'] = parts['lectures'].replace('신청 링크가 열리면 각 강의의 [신청하기] 버튼과 상단 [무료강의 신청하기] 버튼이 신청 폼으로 연결됩니다. 정원은 강의별로 공개됩니다.', '신청 일정과 링크는 강의 정보와 함께 순차적으로 공개합니다. 접수가 시작되면 각 강의 카드에서 신청할 수 있습니다.')
parts['partners'] = parts['partners'].replace('<div class="chap-no">03</div>', '<div class="chap-no">05</div>')
parts['guide'] = parts['guide'].replace('  <div class="seg" role="tablist" aria-label="대상 선택"', entry + '\n  <div class="seg" role="tablist" aria-label="대상 선택"')
parts['guide'] = parts['guide'].replace('‘03 기업 참여 제안’', '‘05 기업 참여 제안’')
parts['guide'] = parts['guide'].replace('AI를 사이에 두고, 사람이 만나다', 'AI를 사이에 두고,<br>사람과 사람이 만나다')
parts['guide'] = parts['guide'].replace('<p data-subtitle>AI로 이어진 사람들</p>', '<p>서로의 창작을 보고, 함께 배우고, 다음 이야기를 시작하는 이틀.<br>2026.12.09–10 · DDP 디자인랩 3층 디자인홀</p>')
new_main = '<main>\n' + intro + '\n' + '\n'.join(parts.values()) + '\n</main>\n'

s = replace_block(s, '<header class="cover" id="top">', '<footer class="ft">', cover + new_main)
s = s.replace('<html lang="ko">', '<html lang="ko" data-theme="light">')
s = replace_block(s, '/* ───────── COVER ───────── */', '/* ───────── ENTRY ───────── */', '')
s = s.replace('</style>', '\n' + (ROOT/'page-refinement.css').read_text(encoding='utf-8') + '\n</style>', 1)
s = re.sub(r"var C = window.CONFIG, A = C.assetPath, WALKS = \[.*?\];", "var C = window.CONFIG, A = C.assetPath;", s, count=1, flags=re.S)
s = replace_block(s, '  /* subtitle */', '  /* nav: progress, active, drawer */', "  document.title = 'NEXT K-CORE AI CONNECT · 사람과 사람이 만나다';\n\n")
s = replace_block(s, '  /* THE CLASS viz */', '  /* count-up */', '')

nav = ''.join(f'<a href="#{name}"><b>{i:02d}</b>{label}</a>' for i,(name,label) in enumerate([('intro','행사 소개'),('program','프로그램'),('works','전시·상영'),('lectures','무료강의'),('partners','기업 참여'),('space','공간'),('guide','참여 안내')], 1))
s = re.sub(r'(<div class="navlinks" id="navlinks">).*?(</div>)', lambda m:m.group(1)+nav+m.group(2), s, count=1, flags=re.S)
s = s.replace('<a class="btn pri" href="#lectures" data-apply="all">무료강의 신청하기</a>', '<a class="btn pri" href="#guide">참여 안내</a>', 1)
s = s.replace("['#partners','03'", "['#partners','05'").replace("['#works','04'", "['#works','03'").replace("['#lectures','05'", "['#lectures','04'")
s = s.replace("links.forEach(function(a,i){ a.classList.toggle('on', i === cur); });", "links.forEach(function(a,i){ a.classList.toggle('on', i === cur); if(i === cur) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });")
s = s.replace("$('#routeNext').dataset.to = idx < r.s.length - 1 ? r.s[idx+1][0] : '#entry';", "$('#routeNext').dataset.to = idx < r.s.length - 1 ? r.s[idx+1][0] : '#entry';")
s = s.replace("var r = ROUTES[route], idx = 0;", "var r = ROUTES[route], idx = -1, nearest = Infinity;")
s = s.replace("r.s.forEach(function(s,i){ var el = $(s[0]); if (el && el.getBoundingClientRect().top < 160) idx = i; });", "r.s.forEach(function(s,i){ var el = $(s[0]); if(!el) return; var rect = el.getBoundingClientRect(); var d = Math.abs(rect.top - 128); if(rect.top <= 160 && rect.bottom > 160){ idx = i; nearest = -1; } else if(nearest >= 0 && d < nearest){ nearest = d; idx = i; } }); if(idx < 0) idx = 0;")
s = s.replace('var img = w.image ?', 'var img = w.image ?')
s = s.replace("'<img src=\"'+A+TYPO[w.genre]+'\" alt=\"\">'", "'<span class=\"work-placeholder\" aria-hidden=\"true\">'+w.genre.toUpperCase()+'</span>'")
s = re.sub(r"  var TYPO = \{game:.*?\};\n", '', s, count=1)

close_button = '<button class="m-x" type="button" id="mX" aria-label="닫기 (ESC)">✕</button>'
assert s.count(close_button) == 1
s = s.replace(close_button, '')
s = s.replace('<div class="m-in" id="mIn">', '<div class="m-in" id="mIn">' + close_button)
s = s.replace("if (lastFocus) lastFocus.focus();", "if (lastFocus && lastFocus.isConnected) lastFocus.focus();")
s = s.replace("if (modal.hidden) openModal();", "if (modal.hidden) openModal();")
s = s.replace("if (t.querySelector('#waffle')){ $('#waffle').classList.add('go'); }", '')
s = s.replace("'<a class=\"btn pri\" href=\"#\" data-apply=\"'+i+'\">세션 '+L.no+' 신청하기</a></article>'", "'<a class=\"btn pri\" href=\"#\" data-apply=\"'+i+'\">'+((L.formUrl || C.lectureFormUrl)?'세션 '+L.no+' 신청하기':'신청 일정 추후 공개')+'</a></article>'")

# Footer logo is now static and independent of the removed cover SVG filter.
s = re.sub(r'<img class="drop"[^>]+>', '', s)
s = s.replace('AI를 사이에 두고, 사람이 만나다 · 2026', 'AI를 사이에 두고, 사람과 사람이 만나다 · 2026')
selector_script = '''<script>(()=>{const q=new URLSearchParams(location.search);const frame=document.getElementById('headerFrame');if(q.get('header')==='b') frame.src='concept-b-playground/header-b.html';if(q.has('bodyOnly')) document.querySelector('.rebuild-cover').hidden=true;})();</script>'''
s = s.replace('</body>', selector_script + '\n</body>')
out = ROOT/'03_NEXT_KCORE_AI_CONNECT_v12.html'
out.write_text(s, encoding='utf-8')
print(f'Wrote {out.name}: {out.stat().st_size:,} bytes')
print('Sections:', ', '.join(re.findall(r'<section class="chap" id="([^"]+)"', s)))
for forbidden in ['id="walk"','id="reel"','id="subs"','id="waffle"','var WALKS',"var cv = $('#cv')",'kinFill()']:
    assert forbidden not in s, forbidden
print('Old cover and background animation dependencies removed.')
