(() => {
  'use strict';
  const tl=gsap.timeline({paused:true});
  tl.from('.intro p',{y:70,opacity:0,duration:.7,ease:'power4.out'},0)
    .from('.intro .title-line span',{y:400,rotation:15,scaleY:1.6,duration:.95,stagger:.06,ease:'expo.out'},.12)
    .from('.star',{scale:0,rotation:-240,duration:1.2,ease:'back.out(1.6)'},.4)
    .to('.star',{rotation:190,duration:2.7,ease:'none'},1.6)
    .from('.aside',{x:180,opacity:0,duration:.7,ease:'power4.out'},1)
    .to('.intro .connect',{x:-20,scaleX:1.03,duration:2.3,ease:'sine.inOut'},1.6)
    .set('.s2',{opacity:1},4)
    .from('.s2',{clipPath:'inset(100% 0% 0% 0%)',duration:.65,ease:'expo.inOut'},4)
    .from('.black-ai',{scale:3.5,rotation:-15,y:-330,duration:.8,ease:'expo.out'},4.25)
    .from('.black-x',{rotation:-270,scale:0,duration:.85,ease:'back.out(1.8)'},4.55)
    .from('.black-human',{y:500,scaleX:.45,rotation:8,duration:.9,ease:'power4.out'},4.7)
    .to('.black-ai',{x:65,rotation:7,duration:2,ease:'sine.inOut'},5.8)
    .to('.black-x',{rotation:180,scale:1.15,duration:2,ease:'power2.inOut'},6)
    .to('.black-human',{scaleX:1.12,x:-45,rotation:-4,duration:1,ease:'sine.inOut'},6.5)
    .to('.black-human',{opacity:0,scaleY:.1,duration:.25,ease:'power4.in'},7.5)
    .from('.black-people',{y:450,rotation:-12,scale:.5,opacity:0,duration:.7,ease:'expo.out'},7.6)
    .from('.black-between',{scale:0,rotation:160,opacity:0,duration:.7,ease:'back.out(1.5)'},7.75)
    .set('.s3',{opacity:1},9)
    .from('.s3',{clipPath:'circle(0% at 77% 35%)',duration:.8,ease:'power4.inOut'},9)
    .from('.mask-human',{x:-1450,rotation:-12,duration:.9,ease:'expo.out'},9.3)
    .from('.mask-ai',{y:500,rotation:20,duration:.85,ease:'back.out(1.2)'},9.6)
    .from('.mask-x',{scale:3,rotation:180,opacity:0,duration:.8,ease:'expo.out'},9.8)
    .to('.mask-human',{x:35,scale:1.05,duration:2.6,ease:'sine.inOut'},10.6)
    .to('.mask-ai',{rotation:-9,x:50,duration:2.5,ease:'sine.inOut'},10.8)
    .to('.mask-x',{rotation:100,duration:2.4,ease:'power2.inOut'},11)
    .set('.s4',{opacity:1},14)
    .from('.s4',{x:1440,duration:.8,ease:'expo.inOut'},14)
    .from('.orbit-label',{x:-700,duration:.9,ease:'power4.out'},14.3)
    .from('.mask-people',{x:-900,rotation:-20,duration:1,ease:'back.out(1.1)'},14.6)
    .from('.mask-between',{scale:0,rotation:-150,duration:1,ease:'back.out(1.3)'},14.7)
    .from('.circle-ai',{scale:0,duration:.8,ease:'expo.out'},15.4)
    .to('.mask-people',{rotation:7,y:60,duration:3,ease:'sine.inOut'},16)
    .to('.mask-between',{rotation:360,scale:.35,opacity:0,duration:1.2,ease:'power4.in'},16)
    .to('.circle-ai',{rotation:8,scale:1.12,duration:2.5,ease:'sine.inOut'},16.6)
    .set('.s5',{opacity:1},20)
    .from('.s5',{clipPath:'circle(0% at 20% 45%)',duration:.85,ease:'expo.inOut'},20)
    .from('.outro p',{y:-150,opacity:0,duration:.8,ease:'power4.out'},20.3)
    .from('.final-ai',{x:-1100,rotation:-15,duration:.8,ease:'expo.out'},20.5)
    .from('.final-connect',{y:450,scaleY:2,duration:.9,ease:'expo.out'},20.6)
    .from('.date',{scale:0,rotation:30,duration:1,ease:'back.out(1.5)'},20.7)
    .to('.final-connect',{scaleX:1.025,duration:1.5,ease:'sine.inOut'},21.8)
    .to('.s5',{opacity:0,duration:.5,ease:'power2.inOut'},23.5)
    .set('.s1',{opacity:0},4.7).set('.s2',{opacity:0},9.8).set('.s3',{opacity:0},14.8).set('.s4',{opacity:0},20.85)
    .set('.s1',{opacity:1},23.5);
  // Precomputed SVG keyframes keep morphs and planted feet deterministic when seeking.
  const NS='http://www.w3.org/2000/svg',group=document.querySelector('#walkers'),count=11,period=.75,velocity=1/24;
  const smooth=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x);};
  function point(u,t){const wave=smooth((t-2)/3)*(1-smooth((t-13)/2)),circle=smooth((t-13.5)/2.5)*(1-smooth((t-19)/2)),a=Math.PI+u*Math.PI*2;return {x:(-250+1940*u)*(1-circle)+(970+245*Math.cos(a))*circle,y:(625+Math.sin(u*Math.PI*3.4)*70*wave)*(1-circle)+(390+245*Math.sin(a))*circle};}
  const fmt=p=>`${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  function figure(i,t){
    const raw=i/count+t*velocity,u=((raw%1)+1)%1,p=point(u,t),next=point(u+.0001,t),len=Math.hypot(next.x-p.x,next.y-p.y),tangent={x:(next.x-p.x)/len,y:(next.y-p.y)/len},normal={x:tangent.y,y:-tangent.x},phase=(t/period+i*.31)%1,bounce=2*Math.cos(phase*Math.PI*4);
    const local=(x,y)=>({x:p.x+x*tangent.x+y*normal.x,y:p.y+x*tangent.y+y*normal.y}),hip=local(0,49+bounce),shoulder=local(5,68+bounce);let d='';
    const line=ps=>{d+='M'+ps.map(fmt).join('L');};
    for(let leg=0;leg<2;leg++){
      const ph=(phase+leg*.5)%1,anchor=raw-ph*period*velocity+period*velocity*.25,swing=ph<.5?0:smooth((ph-.5)*2),footU=u+(anchor-raw)+swing*period*velocity,ground=point(footU,t),lift=ph<.5?0:Math.sin((ph-.5)*Math.PI*2)*18,foot={x:ground.x+normal.x*lift,y:ground.y+normal.y*lift};
      const dx=foot.x-hip.x,dy=foot.y-hip.y,dist=Math.hypot(dx,dy),bend=Math.sqrt(Math.max(0,30*30-dist*dist/4)),knee={x:(hip.x+foot.x)/2-dy/Math.max(1,dist)*bend,y:(hip.y+foot.y)/2+dx/Math.max(1,dist)*bend};
      line([hip,knee,foot,{x:foot.x+tangent.x*8,y:foot.y+tangent.y*8}]);
      const armSwing=Math.sin((phase+leg*.5)*Math.PI*2)*19;line([shoulder,local(armSwing,51+bounce),local(armSwing+13,49+bounce)]);
    }
    if(i%4===2){line([local(-14,42+bounce),local(-2,80+bounce),local(11,42+bounce)]);line([local(-9,56+bounce),local(7,56+bounce)]);line([local(21,44+bounce),local(21,78+bounce)]);line([local(15,78+bounce),local(27,78+bounce)]);}
    else{line([hip,shoulder,local(8,76+bounce)]);const head=local(8,86+bounce);d+=`M${fmt({x:head.x+9,y:head.y})}a9 10 0 1 0 -18 0a9 10 0 1 0 18 0`;line([local(16,87+bounce),local(20,84+bounce)]);}
    return d;
  }
  const walkers=Array.from({length:count},(_,i)=>{const outline=document.createElementNS(NS,'path');outline.id='walker-outline-'+i;outline.setAttribute('d',figure(i,0));outline.setAttribute('class','walker-outline');outline.setAttribute('fill','none');outline.setAttribute('stroke','#8000ef');outline.setAttribute('stroke-width','10');outline.setAttribute('stroke-linecap','round');outline.setAttribute('stroke-linejoin','round');group.appendChild(outline);const el=document.createElementNS(NS,'path');el.id='walker-'+i;el.setAttribute('class','walker');el.setAttribute('d',figure(i,0));group.appendChild(el);return [outline,el];});
  const track=t=>Array.from({length:121},(_,i)=>(i?'L':'M')+fmt(point(i/120,t))).join('');
  document.querySelector('#walk-line').setAttribute('d',track(0));
  const fps=24;
  for(let frame=1;frame<=24*fps;frame++){const t=frame/fps,start=(frame-1)/fps;tl.to('#walk-line',{attr:{d:track(t)},duration:1/fps,ease:'none'},start);walkers.forEach((el,i)=>{const wraps=Math.floor(i/count+t*velocity)!==Math.floor(i/count+start*velocity);tl.to(el,{attr:{d:figure(i,t)},duration:wraps?0:1/fps,ease:'none'},start);});}
  tl.to('.walker-outline',{stroke:'#ccff00',duration:.2},4.4).to('.walker-outline',{stroke:'#101010',duration:.2},9.45).to('.walker-outline',{stroke:'#8000ef',duration:.2},14.5);
  tl.to(['.walker','.walk-path'],{stroke:'#101010',duration:.2},4.4).to(['.edge','.walk-label'],{color:'#101010',duration:.2},4.4).to(['.walker','.walk-path'],{stroke:'#ffffff',duration:.2},9.45).to(['.edge','.walk-label'],{color:'#ffffff',duration:.2},9.45);
  window.__timelines=window.__timelines||{};window.__timelines['ai-connect']=tl;
  // Only the website player repeats; the Hyperframes composition remains finite.
  if(new URLSearchParams(location.search).has('play')||document.documentElement.hasAttribute('data-website-player')){
    const root=document.querySelector('#motion-root');function resize(){root.style.width='1440px';root.style.height='760px';root.style.transformOrigin='0 0';root.style.transform=`scale(${innerWidth/1440})`;}resize();addEventListener('resize',resize);
    let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;tl.eventCallback('onComplete',()=>{if(!paused)tl.restart();});if(paused)tl.seek(2);else tl.play();
    addEventListener('message',event=>{if(event.source!==parent)return;const m=event.data;if(m?.type==='motion-pause'){paused=m.paused;paused?tl.pause():tl.play();}if(m?.type==='motion-seek')tl.seek(Math.max(0,Math.min(23.99,m.time)));});
  }
})();
