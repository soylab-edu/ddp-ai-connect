(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
  const subtitle = $('[data-subtitle]');
  subtitle.textContent = EVENT.subtitle;
  document.title = `NEXT K-CORE AI CONNECT · ${EVENT.subtitle}`;
  const dialog = $('#detailDialog');
  const dialogBody = $('#dialogBody');
  let returnFocus = null;
  function openDialog(html, trigger) {
    if (!dialog.open) returnFocus = trigger || document.activeElement;
    dialogBody.innerHTML = html;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
    $('.dialog-close').focus();
  }
  function closeDialog() { dialog.close(); }
  $('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect=dialog.getBoundingClientRect(); if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) closeDialog(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); returnFocus?.focus({preventScroll:true}); });
  // Native dialog supplies Escape handling, focus containment and an inert background.
  function register(sessionId, trigger) {
    const session = EVENT.sessions.find(item => item.id === Number(sessionId));
    const url = safeUrl(session?.formUrl || EVENT.registrationUrl);
    if (url) { window.location.assign(url); return; }
    openDialog(`<div class="notice-mark" aria-hidden="true">↗</div><span class="eyebrow">FREE SESSIONS · COMING SOON</span><h2 id="dialogTitle">무료강의 신청은<br>곧 열립니다.</h2><p>${session ? `${escape(session.speaker)} · ${escape(session.title)}<br>` : ''}네 번의 강의로 만나는 현장의 경험.<br>강사, 강의 주제, 정원과 신청 일정은 추후 공개됩니다.</p><div class="status-box">12월 9일 수요일 · 오전 1회 / 오후 3회</div><p class="dialog-note">현재는 신청 접수 전입니다. 접수가 시작되면 이 버튼에서 신청 페이지로 연결됩니다.</p><button class="btn btn-black" data-dialog-close>확인</button>`, trigger);
  }
  $('#sessionGrid').innerHTML = EVENT.sessions.map(s => `<article class="session-card"><div class="session-portrait" aria-label="${escape(s.speaker)} 사진 추후 공개"><span>SESSION 0${s.id} / ${escape(s.period)}</span><i class="speaker-shape" aria-hidden="true"></i><b class="speaker-number" aria-hidden="true">0${s.id}</b></div><div class="session-copy"><span class="mini-label">SPEAKER TO BE ANNOUNCED</span><h3>${escape(s.speaker)}</h3><p>${escape(s.title)}</p><small>강의 소개 · 시간 · 정원 추후 공개</small><button data-session="${s.id}" aria-label="${escape(s.speaker)} 세션 소개 보기">세션 소개 보기 <span>↗</span></button></div></article>`).join('');
  $('#partnerGrid').innerHTML = EVENT.partners.map(p => `<article class="partner-card"><div class="partner-visual ${escape(p.id)}"><span class="mini-label">${escape(p.domain)}</span><span class="partner-symbol" aria-hidden="true">${escape(p.symbol)}</span><div class="partner-name">${escape(p.display)}<small>${escape(p.name)}</small></div></div><div class="partner-copy"><h3>${escape(p.headline)}</h3><p>${escape(p.description)}</p><div class="chip-row">${p.tags.map(t => `<span class="chip">${escape(t)}</span>`).join('')}</div><div class="partner-scenario"><span class="mini-label">참여한다면 · 현장 구성 예시</span><p>${escape(p.scenario)}</p></div><div class="partner-links"><button data-partner="${escape(p.id)}" aria-label="${escape(p.name)} 참여 예시 자세히">참여 예시 자세히 ↗</button><a href="${escape(safeUrl(p.source))}" target="_blank" rel="noopener noreferrer">${escape(p.sourceLabel)} ↗</a></div></div></article>`).join('');
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-register')) register(button.dataset.register, button);
    if (button.hasAttribute('data-dialog-close')) closeDialog();
    if (button.dataset.session) {
      const s = EVENT.sessions.find(item => item.id === Number(button.dataset.session));
      openDialog(`<span class="eyebrow">SESSION 0${s.id} / ${escape(s.period)}</span><h2 id="dialogTitle">${escape(s.speaker)}<br>${escape(s.title)}</h2><p>${escape(s.description)}</p><dl><div><dt>강사 소개</dt><dd>${escape(s.bio)}</dd></div><div><dt>세션에서 배울 것</dt><dd>${escape(s.takeaways)}</dd></div><div><dt>일정</dt><dd>12월 9일 ${escape(s.period)}<br>세부 시간 ${escape(s.time)}</dd></div><div><dt>정원</dt><dd>${escape(s.capacity)}</dd></div><div><dt>참가비</dt><dd>무료</dd></div></dl><button class="btn btn-black" data-register="${s.id}">무료강의 신청하기 ↗</button>`, button);
    }
    if (button.dataset.partner) {
      const p = EVENT.partners.find(item => item.id === button.dataset.partner);
      openDialog(`<span class="eyebrow">PARTICIPATION PROPOSAL / ${escape(p.name)}</span><h2 id="dialogTitle">${escape(p.headline)}</h2><p>${escape(p.scenario)}</p><ul>${p.details.map(d => `<li>${escape(d)}</li>`).join('')}</ul><div class="status-box">${escape(p.benefit)}</div><p class="dialog-note">참여 시 구성 예시입니다. 기업 참가와 세부 프로그램은 확정되지 않았습니다.</p><p class="dialog-note">${escape(p.sourceNote)}</p><a class="btn btn-line" href="${escape(safeUrl(p.source))}" target="_blank" rel="noopener noreferrer">${escape(p.sourceLabel)} ↗</a>`, button);
    }
  });
  function selectDay(id, moveFocus = false) {
    $$('[data-day]').forEach(tab => { const active=tab.dataset.day===id;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&moveFocus)tab.focus(); });
    $$('.schedule-panel').forEach(panel => { panel.hidden=panel.id!==id; });
  }
  const dayTabs = $$('[data-day]');
  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => selectDay(tab.dataset.day));
    tab.addEventListener('keydown', event => { if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) {event.preventDefault();const i=dayTabs.indexOf(tab);const next=event.key==='Home'?0:event.key==='End'?dayTabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+dayTabs.length)%dayTabs.length;selectDay(dayTabs[next].dataset.day,true);} });
  });
  $$('[data-type]').forEach(button => button.addEventListener('click', () => { $('#typeStage').classList.toggle('mask', button.dataset.type==='mask');$$('[data-type]').forEach(other=>other.setAttribute('aria-pressed',String(other===button))); }));
  function selectZone(id) {
    const z=EVENT.zones[id];
    $$('[data-zone]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.zone===id)));
    $('#zoneDetail').innerHTML=`<span class="eyebrow">ZONE ${escape(z.number)} / ${escape(z.label)}</span><h3>${z.title}</h3><p>${escape(z.description)}</p><ul>${z.points.map(p=>`<li>${escape(p)}</li>`).join('')}</ul>`;
  }
  $$('[data-zone]').forEach(button=>button.addEventListener('click',()=>selectZone(button.dataset.zone)));
  selectZone('meet');
  const motionButton=$('#motionToggle');
  motionButton.addEventListener('click',()=>{const paused=document.body.classList.toggle('motion-paused');$('#heroMotion').contentWindow.postMessage({type:'motion-pause',paused},'*');motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'애니메이션 재생':'애니메이션 멈추기');motionButton.innerHTML=paused?'▶ <span>모션 재생</span>':'Ⅱ <span>모션 멈춤</span>';});
  $$('[data-motion-time]').forEach(button=>button.addEventListener('click',()=>$('#heroMotion').contentWindow.postMessage({type:'motion-seek',time:Number(button.dataset.motionTime)},'*')));
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('motion-paused');motionButton.setAttribute('aria-pressed','true');motionButton.setAttribute('aria-label','애니메이션 재생');motionButton.innerHTML='▶ <span>모션 재생</span>';}
  const navLinks=$$('.toplinks a');
  let ticking=false;
  function onScroll(){const max=document.documentElement.scrollHeight-window.innerHeight;$('.progress i').style.transform=`scaleX(${max>0?window.scrollY/max:0})`;let active=null;navLinks.forEach(link=>{const target=$(link.getAttribute('href'));if(target.getBoundingClientRect().top<160)active=link;});navLinks.forEach(link=>link.classList.toggle('active',link===active));ticking=false;}
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true;}},{passive:true});
  window.addEventListener('resize',onScroll);
  onScroll();
  document.fonts?.ready.then(onScroll);
})();
