from pathlib import Path
import re
p=Path('D:/DDP/03_header_rebuild_20261007/page-review-v7.html');s=p.read_text(encoding='utf-8')
# Remove repeated introduction coda; retain the introduction and three genre cards.
s,n=re.subn(r'<div class="gathering-note rv">.*?</div>','',s,flags=re.S);assert n==1,n
# Replace duplicate route cards with the existing single tab selector.
s,n=re.subn(r'<div class="entry entry-inline" id="entry".*?</div></div>\s*(?=<div class="seg" role="tablist" aria-label="대상 선택")','<div id="entry" class="guide-entry"><p>참여 유형을 선택하면 신청 방법과 추천 동선을 함께 안내합니다.</p></div>\n  ',s,flags=re.S);assert n==1,n
s=s.replace('function setRoute(k){','function setRoute(k, shouldScroll){')
s=s.replace("    $(r.s[0][0]).scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});", "    if(shouldScroll !== false) $(r.s[0][0]).scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});")
s=s.replace("  tabs($$('#gtabs button'), function(i){", "  var guideInitialized = false;\n  tabs($$('#gtabs button'), function(i){")
s=s.replace("    var k = ['visit','lecture','partner'][i], g = G[k];", "    var k = ['visit','lecture','partner'][i], g = G[k];\n    if(guideInitialized) setRoute(['visitor','lecture','partner'][i],false);\n    guideInitialized=true;")
# Keep the published data render path, but show only three genre previews while all works are pending.
s=s.replace("  $('#wgrid').innerHTML = C.works.map(function(w, i){", """  var pendingWorks = C.works.length > 0 && C.works.every(function(w){return (!w.title || w.title === '추후 공개') && !w.image && !w.video;});
  if(pendingWorks){
    $('#works .filters').hidden=true;
    $('#wgrid').classList.add('pending-work-grid');
    $('#works .desc').textContent='게임·예술·이야기, 세 장르의 창작을 만납니다. 작품과 창작자 정보는 순차적으로 공개합니다.';
  }
  $('#wgrid').innerHTML = pendingWorks ? [['game','GAME','게임','직접 플레이하며 만나는 AI 창작'],['art','ART','예술','이미지와 미디어아트로 만나는 감각'],['story','STORY','이야기','영상과 스토리텔링으로 이어지는 이야기']].map(function(g){return '<article class="work-preview '+g[0]+'"><span class="preview-genre">'+g[1]+'</span><h4>'+g[2]+'</h4><p>'+g[3]+'</p><span class="preview-status">작품 공개 예정</span></article>';}).join('') : C.works.map(function(w, i){""")
s=s.replace("  function filt(){\n    var n = 0;", "  function filt(){\n    if(pendingWorks){$('#wcnt').textContent='작품 순차 공개';return;}\n    var n = 0;")
# Preserve four-session data/rendering when information is published.
s=s.replace("  $('#lgrid').innerHTML = C.lectures.map(function(L, i){", """  var pendingLectures = C.lectures.every(function(L){return !L.title || L.title === '추후 공개';});
  if(pendingLectures)$('#lgrid').classList.add('pending-lecture-grid');
  $('#lgrid').innerHTML = pendingLectures ? ['오전','오후'].map(function(period){var count=C.lectures.filter(function(L){return L.period===period;}).length;return '<article class="lecture-preview"><div><span class="preview-genre">12.09 · '+period+'</span><h3>'+period+' <strong>'+count+'개 세션</strong></h3></div><p>강사·주제·세부 시간은 순차 공개</p></article>';}).join('') : C.lectures.map(function(L, i){""")
s=s.replace('강의 4개 보기','강의 일정 보기')
p.write_text(s,encoding='utf-8')
print('Condensed pending works/lectures, consolidated participation selector, removed duplicate introduction coda.')
