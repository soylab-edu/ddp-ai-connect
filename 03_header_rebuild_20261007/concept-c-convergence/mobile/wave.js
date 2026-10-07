/* Eight ribbons, one external clock. The C master timeline owns playback. */
(function (global) {
  'use strict';
  const START = 10.6, RESOLVE = 13.5, FINAL_SCALE = .61;
  const phrases = [
    ['사람', 'AI', '사람', '間', '사람과 AI', 'AI와 사람'],
    ['SOYLAB.AI', 'CONNECT', 'DDP', '12월'],
    ['GAME', 'ART', 'STORY', 'GAME', 'ART', 'STORY'],
    ['사람과 사람', '사람과 AI', 'AI와 사람'],
    ['NEXT K-CORE', 'AI CONNECT', 'SOYLAB.AI'],
    ['2026.12.09–10', 'DDP', 'SEOUL', '12월'],
    ['전시', '상영', '강의', '교류', 'GAME', 'ART', 'STORY'],
    ['SOYLAB.AI', '사람과 사람', 'CONNECT', 'DDP']
  ];
  const colors = ['#CCFF00','#F5F5F5','#A35CFF','#F5F5F5','#DF0221','#CCFF00','#F5F5F5','#A35CFF'];
  let root, rows = [], letters = [], width = 1600, height = 640, last = 0, font = 36, step = 53, startY = 104;
  const clamp = (v,a=0,b=1) => Math.min(b, Math.max(a,v));
  const smooth = v => { v=clamp(v); return v*v*(3-2*v); };
  const ease = v => 1-Math.pow(1-clamp(v),3);
  function mount(container) {
    if (!container || !container.appendChild) throw new TypeError('CWave.mount needs a container');
    dispose();
    root = document.createElement('div'); root.className='c-wave';
    root.setAttribute('aria-hidden','true'); root.setAttribute('data-layout-ignore','');
    container.appendChild(root);
    phrases.forEach((words,index) => {
      const row = document.createElement('div'); row.className='c-wave-row'; row.dataset.row=String(index);
      row.style.setProperty('--cw-color',colors[index]); root.appendChild(row);
      const record={el:row,index,words,cycles:[],cycleWidth:1600};
      addCycle(record);
      rows.push(record);
    });
    resize(width,height);
    if(document.fonts) document.fonts.ready.then(()=>{if(root){measure();seek(last);}});
    return root;
  }
  function addCycle(r){
    const cycle=document.createElement('span');cycle.className='c-wave-cycle';r.el.appendChild(cycle);r.cycles.push(cycle);
    let character=0;
    r.words.forEach((word,wi)=>{
      const box=document.createElement('span');box.className='c-wave-word '+((wi+r.index)%3===1?'cw-outline':'cw-solid');
      if(!/[가-힣]/.test(word))box.classList.add('cw-latin');cycle.appendChild(box);
      for(const ch of word){
        const glyph=document.createElement('span');glyph.className='c-wave-letter';glyph.textContent=ch===' '?'\u00a0':ch;box.appendChild(glyph);
        letters.push({el:glyph,row:r.index,index:character++,seed:Math.sin(character*1.97+r.index*2.31)});
      }
    });
  }
  function measure(){
    rows.forEach(r=>{
      // offsetWidth excludes the parent's final scale, so resize is seek-safe.
      r.cycleWidth=Math.max(1,r.cycles[0].offsetWidth);
      const minScale=r.index>=6?FINAL_SCALE:1;
      const needed=Math.ceil(width/(r.cycleWidth*minScale))+3;
      while(r.cycles.length<needed)addCycle(r);
      while(r.cycles.length>needed)r.cycles.pop().remove();
    });
    letters=letters.filter(g=>g.el.isConnected);
  }
  function resize(w,h){
    width=Math.max(1,Number(w)||1600);height=Math.max(1,Number(h)||640);
    font=clamp(width*.0225,24,38);step=clamp(height*.0828,38,64);
    startY=(height-(step*7+font*1.35))/2;
    if(root){root.style.setProperty('--cw-font',font+'px');root.style.setProperty('--cw-stroke',Math.max(.85,font*.025)+'px');measure();seek(last);}
    return api;
  }
  function seek(time){
    last=Math.max(0,Number(time)||0);if(!root)return api;
    const local=last-START,out=ease((last-RESOLVE)/.85);
    root.style.opacity=last>=START?'1':'0';if(last<START)return api;
    root.style.backgroundColor=`rgba(17,17,17,${1-out})`;
    rows.forEach(r=>{
      const dir=r.index%2 ? 1:-1, speed=(38+r.index*3)*width/1600;
      const phase=(Math.max(0,local)*speed+r.index*83)%r.cycleWidth;
      const x=dir<0 ? -phase : -r.cycleWidth+phase;
      const settle=ease((local-r.index*.036)/.42);
      let y=startY+r.index*step;
      if(r.index>=6) y=y*(1-out)+height*(r.index===6?.865:.93)*out;
      const scale=1-(r.index>=6?1-FINAL_SCALE:0)*out;
      r.el.style.opacity=String(settle*(r.index<6?1-out:1));
      r.el.style.transform=`translate3d(${x*scale+(1-settle)*dir*110}px,${y}px,0) scale(${scale})`;
    });
    letters.forEach(g=>{
      if(out===1&&g.row<6)return;
      const entrance=ease((local-g.row*.036)/.42);
      const p=g.index*.23+g.row*.74-local*3.8;
      const amplitude=(7.5+g.row%3)*width/1600*(1-out*.65);
      const y=Math.sin(p)*amplitude+(1-entrance)*g.seed*42;
      const angle=Math.cos(p)*2.8*(1-out);
      g.el.style.transform=`translate3d(0,${y}px,0) rotate(${angle}deg)`;
    });
    return api;
  }
  function dispose(){ if(root)root.remove();root=null;rows=[];letters=[];return api; }
  const api={mount,resize,seek,dispose}; global.CWave=api;
})(window);
