/* Web-only player: one 16-second master pass, then ambient typography. */
(() => {
 'use strict';
 const root=document.getElementById('convergence');
 const tl=window.convergenceTimeline;
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
 let ambientTime=16,ambientFrame=null,lastAmbientTimestamp=null;
 const ended=()=>tl.time()>=15.99;
 const canMove=()=>ready&&!manualPause&&visible&&!document.hidden&&!reduced.matches;
 function stopAmbient(){
  if(ambientFrame!==null)window.cancelAnimationFrame(ambientFrame);
  ambientFrame=null;lastAmbientTimestamp=null;
 }
 function ambientTick(timestamp){
  ambientFrame=null;
  if(!canMove()||!ended()){lastAmbientTimestamp=null;return;}
  if(lastAmbientTimestamp!==null)ambientTime+=Math.max(0,timestamp-lastAmbientTimestamp)/1000;
  lastAmbientTimestamp=timestamp;
  if(window.CWave)window.CWave.seek(ambientTime);
  ambientFrame=window.requestAnimationFrame(ambientTick);
 }
 function startAmbient(){
  if(ambientFrame===null){lastAmbientTimestamp=null;ambientFrame=window.requestAnimationFrame(ambientTick);}
 }
 function update(){
  const paused=!canMove();
  pause.disabled=reduced.matches;
  pause.textContent=paused?'계속 재생':'일시정지';
  pause.setAttribute('aria-label',paused?'모션 계속 재생':'모션 일시정지');
  status.textContent=reduced.matches?'모션 줄이기 적용':manualPause?'일시정지':ended()?'마지막 화면 · 웨이브 재생':'16초 · 한 번 재생';
 }
 function sync(){
  if(!ready)return;
  if(reduced.matches){
   stopAmbient();ambientTime=16;tl.pause(16);
   if(window.CWave)window.CWave.seek(16);
   replay.disabled=true;
  }else{
   replay.disabled=false;
   if(ended()){
    tl.pause();
    if(canMove())startAmbient();else stopAmbient();
   }else{
    stopAmbient();
    if(canMove())tl.play();else tl.pause();
   }
  }
  update();
 }
 pause.addEventListener('click',()=>{if(!reduced.matches){manualPause=!manualPause;sync();}});
 replay.addEventListener('click',()=>{
  if(reduced.matches)return;
  stopAmbient();ambientTime=16;manualPause=false;tl.pause(0);sync();
 });
 reduced.addEventListener('change',sync);
 document.addEventListener('visibilitychange',sync);
 tl.eventCallback('onComplete',sync);
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.08}).observe(root);}
 (document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{ready=true;sync();});
})();
