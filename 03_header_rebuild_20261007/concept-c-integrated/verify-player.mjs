import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('./player.js',import.meta.url),'utf8');
async function setup({reduced=false,embedded=false}={}){
 const elements=new Map();
 function element(){return {disabled:false,textContent:'',attrs:{},events:{},set href(value){this.attrs.href=value},get href(){return this.attrs.href},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},addEventListener(k,v){this.events[k]=v}};}
 for(const id of ['convergence','pause','replay','motion-status'])elements.set(id,element());
 const links=['#program','#guide'].map(href=>{const x=element();x.attrs.href=href;return x});
 const tl={t:0,p:true,callback:null,time(){return this.t},paused(){return this.p},play(){this.p=false;return this},pause(t){if(t!==undefined)this.t=t;this.p=true;return this},eventCallback(_,fn){this.callback=fn}};
 const mq={matches:reduced,addEventListener(_,fn){this.change=fn}};
 const doc={hidden:false,fonts:{ready:Promise.resolve()},events:{},getElementById:id=>elements.get(id),querySelectorAll:()=>links,addEventListener(k,fn){this.events[k]=fn}};
 let observer;
 class IO{constructor(fn){observer=fn}observe(){}}
 const frames=new Map(),waveTimes=[];let frameId=0;
 const win={integratedTimeline:tl,matchMedia:()=>mq,IntersectionObserver:IO,CWave:{seek:t=>waveTimes.push(t)},requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId},cancelAnimationFrame:id=>frames.delete(id)};win.top=embedded?{}:win;
 vm.runInNewContext(source,{window:win,document:doc,IntersectionObserver:IO,Promise});
 await Promise.resolve();
 return {tl,mq,doc,links,waveTimes,frames,frame:time=>{const active=[...frames.values()];frames.clear();active.forEach(fn=>fn(time))},el:id=>elements.get(id),visibility:value=>observer([{isIntersecting:value}])};
}
const p=await setup();
assert.equal(p.tl.p,false,'starts once when ready');
assert.equal(p.links[0].attrs.href,'../03_NEXT_KCORE_AI_CONNECT_v12.html#program');
p.el('pause').events.click();assert.equal(p.tl.p,true);assert.equal(p.el('pause').textContent,'계속 재생');
p.visibility(false);p.visibility(true);assert.equal(p.tl.p,true,'visibility must preserve manual pause');
p.el('pause').events.click();assert.equal(p.tl.p,false);
p.doc.hidden=true;p.doc.events.visibilitychange();assert.equal(p.tl.p,true);
p.doc.hidden=false;p.doc.events.visibilitychange();assert.equal(p.tl.p,false);
p.tl.t=20;p.tl.callback();assert.equal(p.el('pause').disabled,false);assert.match(p.el('motion-status').textContent,/마지막 화면/);
assert.equal(p.tl.p,true,'master stops at final frame');
p.frame(1000);assert.equal(p.waveTimes.at(-1),16,'20-second master hands off at wave-local 16 with no jump');p.frame(2000);assert.equal(p.waveTimes.at(-1),17,'ambient wave continues from the same phase');assert.equal(p.tl.t,20);
p.el('pause').events.click();assert.equal(p.frames.size,0,'manual pause stops ambient frames');assert.equal(p.el('pause').textContent,'계속 재생');
p.el('pause').events.click();p.frame(9000);p.frame(10000);assert.equal(p.waveTimes.at(-1),18,'resume does not skip paused time');
p.visibility(false);assert.equal(p.frames.size,0);p.visibility(true);p.frame(20000);p.frame(21000);assert.equal(p.waveTimes.at(-1),19,'offscreen time is excluded');
p.doc.hidden=true;p.doc.events.visibilitychange();assert.equal(p.frames.size,0);p.doc.hidden=false;p.doc.events.visibilitychange();p.frame(30000);p.frame(31000);assert.equal(p.waveTimes.at(-1),20,'hidden document time is excluded');
assert.equal(p.tl.t,20,'completion remains on final frame');
p.el('replay').events.click();assert.equal(p.frames.size,0);assert.equal(p.tl.t,0);assert.equal(p.tl.p,false);
p.tl.t=20;p.tl.callback();p.frame(32000);assert.equal(p.waveTimes.at(-1),16,'replay resets ambient wave phase');
p.mq.matches=true;p.mq.change();assert.equal(p.tl.t,20);assert.equal(p.tl.p,true);assert.equal(p.el('replay').disabled,true);
assert.equal(p.frames.size,0,'reduced motion stops ambient wave');assert.equal(p.waveTimes.at(-1),16);assert.equal(p.el('pause').disabled,true);
p.mq.matches=false;p.mq.change();assert.equal(p.frames.size,1,'normal motion resumes ambient wave');
const r=await setup({reduced:true,embedded:true});assert.equal(r.tl.t,20);assert.equal(r.tl.p,true);assert.equal(r.links[0].attrs.href,'#program');
assert.equal(r.frames.size,0);assert.equal(r.waveTimes.at(-1),16);
console.log('PASS: autoplay, manual pause/resume, visibility pause, 20s master → 16s wave phase without a jump, final hold, ambient pause/resume excluding hidden time, replay reset, reduced motion, standalone and iframe links.');
