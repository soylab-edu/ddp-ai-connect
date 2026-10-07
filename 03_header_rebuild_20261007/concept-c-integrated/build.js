(function(){
  'use strict';
  const stage=document.getElementById('integrated-root');
  const scene=window.IntegratedScene;
  if(!scene)throw new Error('IntegratedScene must load before the composition master.');
  scene.init();
  const clock={t:0};
  const tl=gsap.timeline({paused:true,onUpdate:function(){scene.seek(clock.t);}});
  [['dots',0],['center',6.8],['fracture',9.82],['human',10.8],['ai',12.6],['return',14],['wave',14.6],['poster',17.5]].forEach(function(label){tl.addLabel(label[0],label[1]);});
  tl.to(clock,{t:20,duration:20,ease:'none'},0);
  window.__timelines=window.__timelines||{};
  window.__timelines['integrated-poster']=tl;
  window.integratedTimeline=tl;
  function resize(){const box=stage.getBoundingClientRect();scene.resize(box.width,box.height);scene.seek(clock.t);}
  resize();
  new ResizeObserver(resize).observe(stage);
  tl.seek(0);
  scene.seek(0);
})();
