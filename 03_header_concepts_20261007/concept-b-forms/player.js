/* Playback controls are outside the deterministic render composition. */
(() => {
 const {timeline:tl,duration}=window.headerMotion;
 const pause=document.getElementById('pause'),replay=document.getElementById('replay'),status=document.getElementById('motion-status');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let manuallyPaused=false,offscreen=false;
 function reflect(){
  const ended=tl.time()>=duration-.01;
  pause.textContent=ended?'재생 완료':tl.paused()?'계속 재생':'일시정지';
  pause.setAttribute('aria-label',ended?'모션 재생 완료':tl.paused()?'모션 계속 재생':'모션 일시정지');
  pause.disabled=ended;
  status.textContent=reduced.matches?'모션 줄이기 · 정지 화면':ended?'마지막 장면 · 정지':tl.paused()?'일시정지':'14초 · 한 번 재생';
 }
 function applyPreference(){
  if(reduced.matches){tl.seek(duration).pause();replay.disabled=true;replay.hidden=true;pause.hidden=true;}
  else{replay.disabled=false;replay.hidden=false;pause.hidden=false;tl.restart();}
  reflect();
 }
 pause.addEventListener('click',()=>{manuallyPaused=!tl.paused();tl.paused(manuallyPaused);reflect();});
 replay.addEventListener('click',()=>{if(!reduced.matches){manuallyPaused=false;tl.restart();reflect();}});
 tl.eventCallback('onComplete',reflect);
 reduced.addEventListener('change',applyPreference);
 function syncVisibility(){
  if(document.hidden||offscreen){tl.pause();}
  else if(!manuallyPaused&&!reduced.matches&&tl.time()<duration-.01){tl.play();}
  reflect();
 }
 document.addEventListener('visibilitychange',syncVisibility);
 new IntersectionObserver(entries=>{offscreen=!entries[0].isIntersecting;syncVisibility();},{threshold:.12}).observe(document.getElementById('forms'));
 document.fonts.ready.then(applyPreference);
})();
