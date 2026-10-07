(function(){
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const out3=v=>1-Math.pow(1-clamp(v),3);
  const out4=v=>1-Math.pow(1-clamp(v),4);
  const in3=v=>Math.pow(clamp(v),3);
  const schedule=[['01','dots',0,1.4],['02','date',1.4,1.3],['03','message',2.7,2.5],['04','wave',5.2,2.1],['05','logo',7.3,1.5],['06','connect',8.8,2.4],['07','final',11.2,4.8]];
  function makeFinalWave(root){
    const line=root.querySelector('.final-wave');
    if(!line) return ()=>{};
    if(!line.querySelector('.wave-char')){
      const walker=document.createTreeWalker(line,NodeFilter.SHOW_TEXT);
      const nodes=[];while(walker.nextNode()) nodes.push(walker.currentNode);
      for(const node of nodes){const frag=document.createDocumentFragment();for(const ch of node.textContent){const span=document.createElement('span');span.className='wave-char';span.textContent=ch===' '?'\u00a0':ch;frag.appendChild(span);}node.replaceWith(frag);}
    }
    const chars=[...line.querySelectorAll('.wave-char')];
    return t=>{line.style.transform=`translateX(${-2.5*Math.sin(t*.22)}cqw)`;chars.forEach((el,j)=>{el.style.transform=`translateY(${Math.sin(j*.31-t*1.45)*.11}cqw)`;});};
  }
  function create(root,type){
    let seek;
    if(type==='dots'){
      const labels=[...root.querySelectorAll('.opening-label')];
      const highlights=[...root.querySelectorAll('.dots circle')].map((el,i)=>{const hex=el.getAttribute('fill')||'#397ef3';return {el,i,x:+el.getAttribute('cx'),y:+el.getAttribute('cy'),r:+el.getAttribute('r'),rgb:[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16))};});
      const dots=[...root.querySelectorAll('.dots circle')].map((el,i)=>({el,i,x:+el.getAttribute('cx'),y:+el.getAttribute('cy'),z:1-2*(i+.5)/620}));
      seek=t=>{const entry=1-out3(t/.8),turn=t*.2,breathe=1+.012*Math.sin(t*3.1),burst=Math.pow(clamp((t-.82)/.58),2);dots.forEach(({el,i,x,y,z})=>{const sx=(x-370),sy=(y-260);const depth=z*52;const angle=Math.atan2(sy,sx);const travel=burst*(950+(i%17)*29);const xx=(sx*Math.cos(turn)+depth*Math.sin(turn))*(1+entry*.16)*breathe+Math.cos(angle)*travel;const yy=sy*(1+entry*.12)*breathe+Math.sin(angle)*travel;el.setAttribute('transform',`translate(${(370+xx-x).toFixed(3)} ${(260+yy-y).toFixed(3)})`);});};
      const dotSeek=seek;
      seek=t=>{dotSeek(t);highlights.forEach(({el,i,x,y,r,rgb})=>{const light=t*4.1-.9,angle=Math.atan2(y-260,x-370),band=Math.pow(Math.max(0,Math.cos(angle-light)),18),twinkle=.5+.5*Math.sin(i*2.399+t*7),shine=band*twinkle*.85*(1-clamp((t-.9)/.45));el.setAttribute('fill',`rgb(${rgb.map(c=>Math.round(c+(255-c)*shine)).join(',')})`);el.setAttribute('r',String(r*(1+shine*.3)));});labels.forEach((el,i)=>{const p=clamp((t-.1-i*.08)/.5),q=p-1,bounce=1+2.5*q*q*q+1.5*q*q,pop=clamp((t-.85)/.48),spread=out3(pop);el.style.opacity=String(clamp(p*6));el.style.transform=`translateY(${(1-bounce)*85}%) scale(${.9+.1*bounce})`;const ink=el.querySelector('.opening-ink');ink.style.opacity=String(1-out3(pop/.43));ink.style.transform=`scale(${1+.2*Math.sin(clamp(pop/.5)*Math.PI/2)})`;el.querySelectorAll('.ink-drop').forEach((drop,j)=>{const angle=(j/16*Math.PI*2)+i*.35,dist=(2.3+(j%3)*.8)*spread;drop.style.opacity=String(Math.sin(Math.PI*clamp(pop/.22))*(1-pop));if(pop>.22)drop.style.opacity=String(Math.pow(1-clamp((pop-.22)/.78),2));drop.style.transform=`translate(${Math.cos(angle)*dist}cqw,${Math.sin(angle)*dist*.75+pop*pop*.8}cqw) rotate(${j*41}deg) scale(${(.55+(j%3)*.3)*(1-pop*.65)})`;});});};
    }else if(type==='date'){
      const numeral=root.querySelector('.date-numeral'),label=root.querySelector('.date-month-label'),days=root.querySelector('.date-days');
      seek=t=>{numeral.style.transform=`translateY(${(1-out4(t/.28))*112}%)`;label.style.transform=`translateY(${(1-out4((t-.055)/.22))*150}%)`;days.style.clipPath=`inset(${(1-out3((t-.12)/.23))*100}% 0 0 0)`;};
    }else if(type==='message'){
      const lines=[...root.querySelectorAll('.message-line')];
      seek=t=>lines.forEach((el,i)=>{el.style.transform=`translateY(${(1-out4((t-i*.09)/.28))*112}%)`;});
    }else if(type==='wave'){
      const rows=[...root.querySelectorAll('.ribbon')].map((el,k)=>({el,k,chars:[...el.querySelectorAll('span')]}));
      seek=t=>rows.forEach(({el,k,chars})=>{el.style.transform=`translateX(${t*(k%2?3.9:-4.6)}cqw)`;chars.forEach((char,j)=>{char.style.transform=`translateY(${Math.sin(j*.57+k*.8-t*(2.65+k*.16))*.55}cqw)`;});});
    }else if(type==='logo'){
      const logo=root.querySelector('.logo-art');
      seek=t=>{logo.style.clipPath=`inset(0 ${(1-out3(t/.42))*100}% 0 0)`;logo.style.transform=`scale(${1+.04*(1-out3((t-.4)/.28))})`;};
    }else if(type==='connect'){
      const states=[...root.querySelectorAll('.word-state')].map(el=>({el,word:el.querySelector('.word-large')}));
      seek=t=>{const selected=Math.min(5,Math.floor((t+1e-8)/.4));const local=clamp(t-selected*.4,0,.4);states.forEach(({el,word},i)=>{el.style.opacity=i===selected?'1':'0';el.style.pointerEvents='none';let x=0;if(local<.1)x=-105*(1-out4(local/.1));else if(local>.3)x=110*in3((local-.3)/.1);word.style.transform=`translateX(${x}%)`;});};
    }else if(type==='final'){
      const wave=makeFinalWave(root);
      const entries=[['.final-numeral',0],['.final-month-label',.5],['.final-title',1.0]].map(([selector,start])=>({el:root.querySelector(selector),start}));
      seek=t=>{wave(t);entries.forEach(({el,start})=>{const p=out4((t-start)/.38);el.style.opacity=String(p);el.style.transform=`translateY(${(1-p)*28}px)`;el.style.clipPath=`inset(${(1-p)*100}% 0 0 0)`;});};
    }else seek=()=>{};
    seek(0);return {seek};
  }
  window.MotionScenes={create,schedule};
  window.mountMotion=function(root,options={}){
    const scenes=schedule.map(([number,type,start,duration])=>{const el=root.querySelector(`[data-motion-scene="${number}"]`);if(!el)throw new Error(`Missing motion scene ${number}`);return {el,start,duration,...create(el,type)};});
    function seek(time){const t=clamp(Number(time)||0,0,16);for(const scene of scenes){const active=t>=scene.start&&(t<scene.start+scene.duration||scene===scenes[6]&&t===16);if(scene.active!==active){scene.active=active;scene.el.style.opacity=active?'1':'0';scene.el.style.pointerEvents=active?'auto':'none';scene.el.setAttribute('aria-hidden',active?'false':'true');}if(active)scene.seek(clamp(t-scene.start,0,scene.duration));}}
    function ambient(elapsedAfter16){scenes[6].seek(4.8+Math.max(0,Number(elapsedAfter16)||0));}
    seek(0);return {seek,ambient,duration:16};
  };
})();
