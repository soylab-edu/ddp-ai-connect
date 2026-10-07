import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('./player.js',import.meta.url),'utf8');
async function setup({reduced=false,embedded=false}={}){
 const elements=new Map();
 function element(){return {disabled:false,textContent:'',attrs:{},events:{},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},addEventListener(k,v){this.events[k]=v}};}
 for(const id of ['playground','pause','replay','motion-status'])elements.set(id,element());
 const links=['#program','#guide'].map(href=>{const x=element();x.attrs.href=href;return x});
 const tl={t:0,p:true,callback:null,time(){return this.t},paused(){return this.p},play(){this.p=false;return this},pause(t){if(t!==undefined)this.t=t;this.p=true;return this},eventCallback(_,fn){this.callback=fn}};
 const mq={matches:reduced,addEventListener(_,fn){this.change=fn}};
 const doc={hidden:false,fonts:{ready:Promise.resolve()},events:{},getElementById:id=>elements.get(id),querySelectorAll:()=>links,addEventListener(k,fn){this.events[k]=fn}};
 let observer;
 class IO{constructor(fn){observer=fn}observe(){}}
 const win={playgroundTimeline:tl,matchMedia:()=>mq,IntersectionObserver:IO};win.top=embedded?{}:win;
 vm.runInNewContext(source,{window:win,document:doc,IntersectionObserver:IO,Promise});
 await Promise.resolve();
 return {tl,mq,doc,links,el:id=>elements.get(id),visibility:value=>observer([{isIntersecting:value}])};
}
const p=await setup();
assert.equal(p.tl.p,false,'starts once when ready');
assert.equal(p.links[0].attrs.href,'../03_NEXT_KCORE_AI_CONNECT_v12.html#program');
p.el('pause').events.click();assert.equal(p.tl.p,true);assert.equal(p.el('pause').textContent,'계속 재생');
p.visibility(false);p.visibility(true);assert.equal(p.tl.p,true,'visibility must preserve manual pause');
p.el('pause').events.click();assert.equal(p.tl.p,false);
p.doc.hidden=true;p.doc.events.visibilitychange();assert.equal(p.tl.p,true);
p.doc.hidden=false;p.doc.events.visibilitychange();assert.equal(p.tl.p,false);
p.tl.t=15;p.tl.callback();assert.equal(p.el('pause').disabled,true);assert.match(p.el('motion-status').textContent,/재생 완료/);
p.visibility(false);p.visibility(true);assert.equal(p.tl.t,15,'completion remains on final frame');
p.el('replay').events.click();assert.equal(p.tl.t,0);assert.equal(p.tl.p,false);
p.mq.matches=true;p.mq.change();assert.equal(p.tl.t,15);assert.equal(p.tl.p,true);assert.equal(p.el('replay').disabled,true);
const r=await setup({reduced:true,embedded:true});assert.equal(r.tl.t,15);assert.equal(r.tl.p,true);assert.equal(r.links[0].attrs.href,'#program');
console.log('PASS: autoplay, manual pause/resume, visibility pause, final hold, replay, reduced motion, standalone and iframe links.');
