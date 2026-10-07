const host = document.querySelector('#motion-host');
const stage = document.querySelector('#motion-stage');
const play = document.querySelector('#play-toggle');
const replay = document.querySelector('#replay');
const status = document.querySelector('#play-status');
const soundtrack = document.querySelector('#soundtrack');
const soundToggle = document.querySelector('#sound-toggle');
let soundEnabled = false;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let api, playing = !reduce.matches, elapsed = reduce.matches ? 16 : 0, previous, finalSettled = false;
function fit() {
  const portrait=innerWidth<=719, width=portrait?390:1680, height=portrait?700:720;
  stage.classList.toggle('portrait',portrait);
  const scale=Math.min(host.clientWidth/width,host.clientHeight/height);
  Object.assign(stage.style,{width:width+'px',height:height+'px',left:(host.clientWidth-width*scale)/2+'px',top:(host.clientHeight-height*scale)/2+'px',transform:`scale(${scale})`});
}
new ResizeObserver(fit).observe(host);
function syncControls() {
  play.textContent = playing ? '일시정지' : '재생';
  play.setAttribute('aria-pressed', String(playing));
  soundToggle.textContent = soundEnabled ? '음악 끄기' : '음악 켜고 재생';
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  status.textContent = elapsed >= 16 ? 'AI CONNECT · 2026.12.09–10' : 'NEXT K-CORE 2026';
}
function paint() {
  if (elapsed < 16) { api.seek(elapsed); finalSettled = false; }
  else {
    if (!finalSettled) { api.seek(16); finalSettled = true; }
    if (api.ambient) api.ambient(elapsed - 16);
  }
}
function tick(now) {
  if (playing && !document.hidden) {
    if (soundEnabled && elapsed < 16 && !soundtrack.ended) elapsed = soundtrack.currentTime;
    else if (previous !== undefined) elapsed += Math.min((now - previous) / 1000, .1);
  }
  previous = now;
  if (playing) paint();
  if (elapsed >= 16 && status.textContent !== 'AI CONNECT · 2026.12.09–10') syncControls();
  requestAnimationFrame(tick);
}
async function startAudio() {
  if (!soundEnabled || elapsed >= 16) return;
  soundtrack.currentTime = elapsed;
  try { await soundtrack.play(); } catch (error) { soundEnabled = false; syncControls(); console.warn('Audio playback unavailable',error); }
}
function restart() { elapsed=0;playing=true;previous=undefined;finalSettled=false;paint();syncControls();startAudio(); }
play.addEventListener('click', () => { playing = !playing; previous = undefined; if(playing)startAudio();else soundtrack.pause();syncControls(); });
replay.addEventListener('click', restart);
soundToggle.addEventListener('click',()=>{soundEnabled=!soundEnabled;if(soundEnabled)restart();else{soundtrack.pause();syncControls();}});
document.addEventListener('visibilitychange', () => { previous = undefined; if(document.hidden)soundtrack.pause();else if(playing)startAudio(); });
reduce.addEventListener('change', event => { if (event.matches) { elapsed = 16; playing = false; soundtrack.pause();paint(); syncControls(); } });
try {
  const response = await fetch('live-scenes.html?v=final2', {cache:'no-store'});
  if (!response.ok) throw new Error(`Scene load failed: ${response.status}`);
  stage.innerHTML = await response.text();
  const firstWord=stage.querySelector('.word-state[data-word-index="0"] .word-large');
  firstWord.childNodes[0].replaceWith(document.createTextNode('AI'),Object.assign(document.createElement('br'),{className:'mobile-only'}),document.createTextNode(' CONNECT'));
  stage.querySelectorAll('.final .actions span').forEach((span,index)=>{
    const target=index===0?'program':'guide',link=document.createElement('a');
    link.textContent=span.textContent;
    link.href=`http://127.0.0.1:3045/03_header_rebuild_20261007/page-review-v7.html#${target}`;
    if(document.documentElement.classList.contains('embedded'))link.addEventListener('click',event=>{event.preventDefault();parent.postMessage({type:'ai-connect:navigate',target},location.origin);});
    span.replaceWith(link);
  });
  await document.fonts.ready;
  await Promise.all([...stage.querySelectorAll('img')].map(img => img.decode().catch(() => {})));
  api = window.mountMotion(stage, {autoplay:false});
  const requestedFrame=new URLSearchParams(location.search).get('previewAt');
  if(requestedFrame!==null && Number.isFinite(Number(requestedFrame))){elapsed=Math.max(0,Math.min(16,Number(requestedFrame)));playing=false;}
  fit(); paint(); syncControls();
  host.setAttribute('aria-busy', 'false');
  window.headerMotion = {seek(t) {elapsed=Math.max(0,t);playing=false;soundtrack.pause();paint();syncControls();}, replay() {replay.click();}, get time() {return elapsed;}};
  requestAnimationFrame(tick);
} catch (error) {
  status.textContent = '화면을 불러오지 못했습니다. 새로고침해 주세요.';
  console.error(error);
}
