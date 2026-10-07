import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
async function run(reduced){
 const buttons=Object.fromEntries(['pause','replay'].map(id=>[id,{textContent:'',events:{},addEventListener(n,f){this.events[n]=f},setAttribute(){}}]));
 const state={paused:true,progress:0,restarts:0,resumes:0};
 const tl={pause(t){state.paused=true;if(t===14)state.progress=1;return this},restart(){state.paused=false;state.progress=0;state.restarts++},resume(){state.paused=false;state.resumes++},paused(){return state.paused},progress(){return state.progress},eventCallback(n,f){state[n]=f}};
 const media={matches:reduced,addEventListener(n,f){this.changed=f}};
 let observe;
 const doc={hidden:false,events:{},getElementById(id){return buttons[id]||{}},addEventListener(n,f){this.events[n]=f},fonts:{ready:Promise.resolve()}};
 const ctx={window:{posterTimeline:tl,matchMedia:()=>media},document:doc,IntersectionObserver:class{constructor(fn){observe=fn}observe(){}}};
 vm.runInNewContext(fs.readFileSync(new URL('./live.js',import.meta.url),'utf8'),ctx);await Promise.resolve();
 if(reduced){assert.equal(state.progress,1);assert.equal(state.paused,true);assert.equal(state.restarts,0);return;}
 assert.equal(state.restarts,1);
 buttons.pause.events.click();assert.equal(state.paused,true);
 doc.hidden=true;doc.events.visibilitychange();doc.hidden=false;doc.events.visibilitychange();assert.equal(state.paused,true,'manual pause must survive visibility restore');
 buttons.pause.events.click();assert.equal(state.paused,false);
 doc.hidden=true;doc.events.visibilitychange();assert.equal(state.paused,true);doc.hidden=false;doc.events.visibilitychange();assert.equal(state.paused,false);
 observe([{isIntersecting:false}]);assert.equal(state.paused,true);observe([{isIntersecting:true}]);assert.equal(state.paused,false);
 state.progress=1;state.onComplete();assert.equal(state.paused,true);assert.equal(buttons.pause.textContent,'재생');
 buttons.replay.events.click();assert.equal(state.restarts,2);assert.equal(state.progress,0);
 media.matches=true;media.changed();assert.equal(state.progress,1);assert.equal(state.paused,true);
}
await run(false);await run(true);
const html=fs.readFileSync(new URL('./header-a.html',import.meta.url),'utf8');
for(const id of ['program','guide']){assert.ok(html.includes(`href="#${id}"`));assert.ok(html.includes(`id="${id}"`));}
console.log('PASS: one-shot completion, pause/resume, replay, hidden-tab/offscreen auto-pause, preservation of manual pause, reduced motion, CTA targets. Node state tests; browser input not simulated.');
