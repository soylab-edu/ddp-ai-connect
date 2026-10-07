(function(){
  'use strict';
  const tl=window.humanTimeline;
  const pause=document.getElementById('human-pause');
  const replay=document.getElementById('human-replay');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused=false,autoPaused=false,inView=true,ready=false;
  function updateButton(playing,label){pause.classList.toggle('is-playing',playing);pause.setAttribute('aria-label',label);pause.setAttribute('title',label);pause.setAttribute('aria-pressed',String(!playing));}
  function finish(){tl.pause(9);updateButton(false,'모션 다시 재생');}
  function sync(){
    if(!ready||tl.progress()>=1)return;
    if(document.hidden||!inView){if(!tl.paused()){tl.pause();autoPaused=true;}}
    else if(autoPaused&&!manuallyPaused){autoPaused=false;tl.resume();updateButton(true,'모션 일시정지');}
  }
  function restart(){manuallyPaused=false;autoPaused=false;tl.restart();updateButton(true,'모션 일시정지');sync();}
  pause.addEventListener('click',function(){
    if(tl.progress()>=1){restart();return;}
    if(tl.paused()){manuallyPaused=false;autoPaused=false;tl.resume();updateButton(true,'모션 일시정지');sync();}
    else{manuallyPaused=true;autoPaused=false;tl.pause();updateButton(false,'모션 계속 재생');}
  });
  replay.addEventListener('click',restart);
  tl.eventCallback('onComplete',finish);
  reduce.addEventListener('change',function(){if(reduce.matches)finish();});
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(function(entries){inView=entries[0].isIntersecting;sync();},{threshold:0.05}).observe(document.getElementById('stage'));
  document.fonts.ready.then(function(){ready=true;reduce.matches?finish():restart();});
  if(window.top===window){document.querySelectorAll('.actions a').forEach(function(link){link.href='../03_NEXT_KCORE_AI_CONNECT_v12.html'+link.getAttribute('href');});}
})();
