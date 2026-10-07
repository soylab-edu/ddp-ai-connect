(function(){const tl=window.aTimeline,pause=document.getElementById('pause'),replay=document.getElementById('replay'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let manual=false,auto=false,visible=true,ready=false;
function label(text,aria){pause.textContent=text;pause.setAttribute('aria-label',aria);}
function end(){tl.pause(17);label('재생','모션 다시 재생');}
function play(){manual=false;auto=false;tl.restart();label('일시정지','모션 일시정지');sync();}
function sync(){if(!ready||tl.progress()>=1)return;if(document.hidden||!visible){if(!tl.paused()){tl.pause();auto=true;}}else if(auto&&!manual){auto=false;tl.resume();}}
pause.addEventListener('click',()=>{if(tl.progress()>=1){play();return;}if(tl.paused()){manual=false;auto=false;tl.resume();label('일시정지','모션 일시정지');}else{manual=true;auto=false;tl.pause();label('계속 재생','모션 계속 재생');}});replay.addEventListener('click',play);tl.eventCallback('onComplete',end);reduce.addEventListener('change',()=>{if(reduce.matches)end();});document.addEventListener('visibilitychange',sync);new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();}).observe(document.getElementById('root'));document.fonts.ready.then(()=>{ready=true;reduce.matches?end():play();});
if(window.top===window)document.querySelectorAll('.actions a').forEach(a=>a.href='../03_NEXT_KCORE_AI_CONNECT_v12.html'+a.getAttribute('href'));
})();
