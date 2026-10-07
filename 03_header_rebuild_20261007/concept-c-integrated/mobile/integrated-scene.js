/* The 20-second story: original C → the same lime marble → HUMAN/AI → word wave.
   Both scene modules are deterministic. The page owns the only GSAP clock. */
(function(){
  'use strict';
  const clamp=v=>Math.max(0,Math.min(1,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
  let initialized=false,lastTime=0,lastC=-1;
  let root,canvas,humanMount,meta,mark,wave;

  function humanTime(t){
    if(t<10.8)return 0;
    if(t<11.2)return (t-10.8)/.4*1.5;
    if(t<14.0)return 1.5+(t-11.2)/2.8*4.5;
    if(t<14.4)return 6+(t-14.0);
    return 6.4;
  }
  function seek(time){
    lastTime=Math.max(0,Number(time)||0);
    if(!initialized)return;
    const t=lastTime;
    const cTime=t<10.6?t:t<14.6?10.6:t-4;
    const canvasOpacity=1-smooth((t-10.5)/.3);
    if(cTime!==lastC){
      CScene.draw(cTime,{render:canvasOpacity>.001});
      lastC=cTime;
    }
    canvas.style.opacity=String(canvasOpacity);
    canvas.style.visibility=canvasOpacity>.001?'visible':'hidden';

    // Keep the actual user-provided logo in the fracture reveal. Its center is
    // the origin of the single HumanScene marble's bridge curve.
    mark.style.opacity=String(smooth((t-9.92)/.08)*(1-smooth((t-10.65)/.15)));
    meta.style.opacity=String(1-smooth((t-17.5)/.3));
    wave.style.opacity=t<14.6?'0':'1';
    wave.style.visibility=t<14.6?'hidden':'visible';

    const sculptureOpacity=smooth((t-10.45)/.45)*(1-smooth((t-14.35)/.55));
    const marbleOpacity=smooth((t-10.2)/.075)*(1-smooth((t-14.35)/.55));
    const humanVisible=t>=10.2&&t<14.9;
    humanMount.style.visibility=humanVisible?'visible':'hidden';
    humanMount.style.zIndex=t<10.8?'8':'3';
    const presentation={
      sculptureOpacity,
      marbleOpacity,
      marbleVisible:humanVisible,
      render:humanVisible
    };
    if(t>=10.2&&t<10.8)presentation.bridgeProgress=(t-10.2)/.6;
    HumanScene.seek(humanTime(t),presentation);
  }
  function resize(width,height){
    if(!initialized)return;
    CScene.resize();
    HumanScene.resize(width||root.clientWidth,height||root.clientHeight);
    lastC=-1;seek(lastTime);
  }
  function init(){
    if(initialized)return window.IntegratedScene;
    root=document.getElementById('convergence');
    canvas=document.getElementById('world');
    humanMount=document.getElementById('human-scene');
    meta=document.querySelector('.intro-meta');
    mark=document.querySelector('.brand-mark');
    wave=document.getElementById('typewave');
    if(!root||!canvas||!humanMount||!meta||!mark||!wave)throw new Error('Integrated scene markup is incomplete');
    CScene.init();HumanScene.init(humanMount);initialized=true;
    resize();seek(0);return window.IntegratedScene;
  }
  function dispose(){
    if(!initialized)return;
    CScene.dispose();HumanScene.dispose();initialized=false;lastC=-1;
  }
  window.IntegratedScene={init,seek,resize,dispose,duration:20};
})();
