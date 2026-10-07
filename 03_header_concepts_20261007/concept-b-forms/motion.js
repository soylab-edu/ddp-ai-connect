/* Original deterministic HyperFrames composition: B / 열린 자리. */
(() => {
  const root = document.getElementById('forms');
  const mobile = innerWidth <= 620;
  const W = mobile ? 390 : 1440, H = mobile ? 844 : 900;
  const svg = document.getElementById('form-art');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  // A thick open curve described by compatible cubic segments at every pose.
  function band(cx, cy, rx, ry, thickness, opening, mirror = false) {
    const direction = mirror ? -1 : 1;
    const rxi = rx - thickness, ryi = ry - thickness;
    const start = opening * Math.PI / 180;
    const end = Math.PI * 2 - start;
    const point = (r1,r2,a) => [cx + direction * Math.cos(a)*r1,cy + Math.sin(a)*r2];
    const n = 6, steps = (end-start)/n;
    const outer = [], inner = [];
    let p = point(rx,ry,start); outer.push(`M ${p[0]} ${p[1]}`);
    function segment(r1,r2,a,b) {
      const k=4/3*Math.tan((b-a)/4), pa=point(r1,r2,a),pb=point(r1,r2,b);
      return `C ${pa[0]-direction*k*Math.sin(a)*r1} ${pa[1]+k*Math.cos(a)*r2} ${pb[0]+direction*k*Math.sin(b)*r1} ${pb[1]-k*Math.cos(b)*r2} ${pb[0]} ${pb[1]}`;
    }
    for(let i=0;i<n;i++) outer.push(segment(rx,ry,start+steps*i,start+steps*(i+1)));
    p=point(rxi,ryi,end);inner.push(`L ${p[0]} ${p[1]}`);
    for(let i=0;i<n;i++) inner.push(segment(rxi,ryi,end-steps*i,end-steps*(i+1)));
    return [...outer,...inner,'Z'].join(' ');
  }
  const purple = '#7A00EE',paper='#F3F0E9',lime='#CCFF00',ink='#21162D';
  const A = document.getElementById('band-a'), B=document.getElementById('band-b');
  const t = gsap.timeline({paused:true});
  window.__timelines = window.__timelines || {};
  window.__timelines['forms'] = t;
  const setBand=(element,values)=>gsap.set(element,{attr:{d:band(...values)}});
  const firstA=mobile?[85,335,240,150,65,16,false]:[400,425,590,235,100,13,false];
  const firstB=mobile?[305,438,240,150,65,16,true]:[1040,425,590,235,100,13,true];
  const openA=mobile?[-118,345,175,160,58,45,false]:[-150,425,380,242,110,45,false];
  const openB=mobile?[508,439,175,160,58,45,true]:[1590,425,380,242,110,45,true];
  const finalA=mobile?[-76,310,175,130,48,48,false]:[5,437,230,244,76,48,false];
  const finalB=mobile?[466,464,175,130,48,48,true]:[1435,437,230,244,76,48,true];
  setBand(A,firstA);setBand(B,firstB);
  gsap.set(['.genres','.together','.final-copy'],{autoAlpha:0});
  gsap.set(['#genre-a','#genre-b','#genre-c'],{opacity:0});
  gsap.set('.person-a',{x:mobile?-55:-230,opacity:0});
  gsap.set('.person-b',{x:mobile?55:230,opacity:0});
  gsap.set('.ai',{scale:0});gsap.set('.opening-caption',{opacity:0});
  gsap.set('.play-progress',{scaleX:0});
  // The opening is one shared space, with two equally sized people.
  t.to(A,{attr:{d:band(...openA)},duration:1.35,ease:'power3.inOut'},.1)
   .to(B,{attr:{d:band(...openB)},duration:1.35,ease:'power3.inOut'},.1)
   .to('.person-a',{x:0,opacity:1,duration:.72,ease:'power3.out'},.53)
   .to('.person-b',{x:0,opacity:1,duration:.72,ease:'power3.out'},.68)
   .to('.ai',{scale:1,duration:.4,ease:'back.out(1.5)'},1.1)
   .to('.opening-caption',{opacity:1,duration:.4},1.3);
  // A purple full-stage wipe, grown from the existing left curve.
  t.to('.people',{autoAlpha:0,duration:.22,ease:'power2.in'},2.8)
   .to(A,{scale:4,duration:.52,ease:'power3.in'},2.8)
   .to(B,{opacity:0,duration:.25},2.9)
   .set('.backdrop',{backgroundColor:purple},3.31)
   .set(A,{opacity:0},3.31)
   .set('.fixed',{color:paper},3.31)
   .set('.action.primary',{backgroundColor:paper,color:ink,borderColor:paper},3.31)
   .set('.genres',{autoAlpha:1},3.32);
  const positions=mobile?[[307,261],[307,396],[307,531]]:[[304,442],[720,442],[1136,442]];
  ['#genre-a','#genre-b','#genre-c'].forEach((selector,i)=>{
    const [cx,cy]=positions[i];
    const p=mobile?band(cx,cy,64,57,17,48,false):band(cx,cy,187,187,64,48,false);
    gsap.set(selector,{attr:{d:p},fill:paper,rotation:mobile?0:-35,scale:.3,transformOrigin:'50% 50%'});
    t.to(selector,{opacity:1,rotation:mobile?0:0,scale:1,duration:.65,ease:'back.out(1.2)'},3.32+i*.17);
  });
  t.from('.genre',{y:mobile?20:50,opacity:0,duration:.48,stagger:.17,ease:'power3.out'},3.57)
   .from('.genre-label',{y:20,opacity:0,duration:.45,ease:'power2.out'},3.6);
  // Shared motif gathers into a place. Lime makes this the decisive short beat.
  t.to('.genres',{autoAlpha:0,duration:.2},6.02)
   .to(['#genre-a','#genre-b','#genre-c'],{scale:.08,rotation:90,opacity:0,duration:.44,stagger:.06,ease:'power3.in'},6.0)
   .set('.backdrop',{backgroundColor:lime},6.5)
   .set('.fixed',{color:ink},6.5)
   .set('.action.primary',{backgroundColor:ink,color:paper,borderColor:ink},6.5)
   .set(A,{scale:1,opacity:1,attr:{d:band(...openA)}},6.5)
   .set(B,{opacity:1,attr:{d:band(...openB)}},6.5)
   .set('.together',{autoAlpha:1},6.5)
   .from('.together strong',{scale:.6,rotation:-6,opacity:0,duration:.7,ease:'back.out(1.15)'},6.5)
   .from('.together span',{y:24,opacity:0,duration:.4,ease:'power2.out'},6.95);
  const placeA=mobile?[-92,355,150,164,49,45,false]:[-60,432,265,241,82,45,false];
  const placeB=mobile?[482,432,150,164,49,45,true]:[1500,432,265,241,82,45,true];
  t.to(A,{attr:{d:band(...placeA)},duration:1.15,ease:'power3.out'},6.55)
   .to(B,{attr:{d:band(...placeB)},duration:1.15,ease:'power3.out'},6.55);
  // A slow final settle reserves the center for the human message.
  t.to('.together',{autoAlpha:0,y:-25,duration:.35,ease:'power2.in'},9.15)
   .to('.backdrop',{backgroundColor:paper,duration:.48,ease:'power2.inOut'},9.4)
   .to(A,{attr:{d:band(...finalA)},duration:1.1,ease:'power3.inOut'},9.4)
   .to(B,{attr:{d:band(...finalB)},duration:1.1,ease:'power3.inOut'},9.4)
   .set('.final-copy',{autoAlpha:1},9.66)
   .from('.final-copy .reveal',{yPercent:112,duration:.82,stagger:.16,ease:'power3.out'},9.66)
   .to('.play-progress',{scaleX:1,duration:14,ease:'none'},0);
  t.addLabel('final',12);
  window.headerMotion={timeline:t,duration:14,finalTime:14};
})();
