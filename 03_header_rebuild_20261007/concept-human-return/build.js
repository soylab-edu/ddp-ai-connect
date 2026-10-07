(function(){
  'use strict';
  const stage=document.getElementById('human-poster-root');
  const mount=document.getElementById('human-scene');
  const scene=window.HumanScene;
  if(!scene)throw new Error('HumanScene must load before the composition master.');
  scene.init(mount);
  const clock={t:0};
  const tl=gsap.timeline({paused:true,onUpdate:function(){scene.seek(clock.t);}});
  tl.addLabel('human',0);
  tl.addLabel('depart',1.5);
  tl.addLabel('ai',3.9);
  tl.addLabel('return',6);
  tl.addLabel('resolve',6.4);
  tl.to(clock,{t:9,duration:9,ease:'none'},0);
  window.__timelines=window.__timelines||{};
  window.__timelines['human-poster']=tl;
  window.humanTimeline=tl;
  function resize(){const rect=stage.getBoundingClientRect();scene.resize(rect.width,rect.height);scene.seek(clock.t);}
  resize();
  new ResizeObserver(resize).observe(stage);
  tl.seek(0);
  scene.seek(0);
})();
