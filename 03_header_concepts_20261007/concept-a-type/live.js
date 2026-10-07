(function(){
 'use strict';
 const tl=window.posterTimeline;
 const pause=document.getElementById('pause');
 const replay=document.getElementById('replay');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 let userPaused=false, autoPaused=false, inView=true, ready=false;
 function finalState(){tl.pause(14);autoPaused=false;pause.textContent='재생';pause.setAttribute('aria-label','모션 다시 재생');}
 function play(){userPaused=false;autoPaused=false;tl.restart();pause.textContent='일시정지';pause.setAttribute('aria-label','모션 일시정지');syncVisibility();}
 function syncVisibility(){if(!ready||tl.progress()>=1)return;if(document.hidden||!inView){if(!tl.paused()){tl.pause();autoPaused=true;}}else if(autoPaused&&!userPaused){autoPaused=false;tl.resume();}}
 pause.addEventListener('click',function(){if(tl.progress()>=1){play();return;}if(userPaused||tl.paused()){userPaused=false;autoPaused=false;tl.resume();pause.textContent='일시정지';pause.setAttribute('aria-label','모션 일시정지');}else{userPaused=true;autoPaused=false;tl.pause();pause.textContent='계속 재생';pause.setAttribute('aria-label','모션 계속 재생');}});
 replay.addEventListener('click',play);
 tl.eventCallback('onComplete',finalState);
 reduce.addEventListener('change',function(){if(reduce.matches)finalState();});
 document.addEventListener('visibilitychange',syncVisibility);
 new IntersectionObserver(function(entries){inView=entries[0].isIntersecting;syncVisibility();},{threshold:0}).observe(document.getElementById('root'));
 document.fonts.ready.then(function(){ready=true;if(reduce.matches){finalState();}else{play();}});
})();

