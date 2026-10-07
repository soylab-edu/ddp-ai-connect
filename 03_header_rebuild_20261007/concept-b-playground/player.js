/* Web-only playback controls. Render timelines remain paused and seekable. */
(() => {
 'use strict';
 const root=document.getElementById('playground');
 const tl=window.playgroundTimeline;
 const pause=document.getElementById('pause');
 const replay=document.getElementById('replay');
 const status=document.getElementById('motion-status');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(window.top===window){
  document.querySelectorAll('.actions a').forEach(link=>{
   const anchor=link.getAttribute('href');
   link.setAttribute('href','../03_NEXT_KCORE_AI_CONNECT_v12.html'+anchor);
  });
 }
 let manualPause=false,visible=true,ready=false;
 const ended=()=>tl.time()>=14.99;
 function update(){
  const done=ended();
  pause.disabled=done||reduced.matches;
  pause.textContent=tl.paused()&&!done?'계속 재생':'일시정지';
  pause.setAttribute('aria-label',tl.paused()&&!done?'모션 계속 재생':'모션 일시정지');
  status.textContent=reduced.matches?'모션 줄이기 적용':done?'재생 완료 · 마지막 화면':manualPause?'일시정지':'15초 · 한 번 재생';
 }
 function sync(){
  if(!ready)return;
  if(reduced.matches){tl.pause(15);replay.disabled=true;}
  else{replay.disabled=false;if(!manualPause&&visible&&!document.hidden&&!ended())tl.play();else tl.pause();}
  update();
 }
 pause.addEventListener('click',()=>{if(!ended()&&!reduced.matches){manualPause=!manualPause;sync();}});
 replay.addEventListener('click',()=>{if(reduced.matches)return;manualPause=false;tl.pause(0);sync();});
 reduced.addEventListener('change',sync);
 document.addEventListener('visibilitychange',sync);
 tl.eventCallback('onComplete',update);
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.08}).observe(root);}
 (document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{ready=true;sync();});
})();
