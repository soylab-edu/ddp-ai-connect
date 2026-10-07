import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?:([A-Za-z]):)/,'$1:'));
const source=path.resolve(root,'../styleframes');
await mkdir(path.join(root,'assets'),{recursive:true});
await mkdir(path.join(root,'compositions'),{recursive:true});
for(const file of ['Outfit.ttf','Outfit-OFL.txt','Pretendard-ExtraBold.woff2','Pretendard-Regular.woff2','Pretendard-LICENSE.txt','soylab-logo.png']) await copyFile(path.join(source,'assets',file),path.join(root,'assets',file));
await copyFile('D:/DDP/03_header_rebuild_20261007/concept-human-return/assets/gsap.min.js',path.join(root,'assets/gsap.min.js'));
const sourceCss=await readFile(path.join(source,'style.css'),'utf8');
const extraCss=`
/* v6 geometry is unchanged. These wrappers only provide seekable masks. */
.motion-stage{position:relative;overflow:hidden;background:#080808;container-type:inline-size}
.motion-stage .scene{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto;container-type:inline-size}
.date-word{overflow:hidden;padding-bottom:1cqw}
.date-numeral,.date-month-label{display:block;flex:none}
.message-copy{overflow:visible}
.message-line-mask{display:block;overflow:hidden;line-height:1.21;padding-bottom:.035em;margin-bottom:-.035em}
.message-line{display:block;white-space:nowrap;will-change:transform}
.ribbon{will-change:transform}.ribbon span{will-change:transform}
.dots{overflow:visible}
.opening-label{position:absolute;top:43%;font-family:Outfit,Pretendard,sans-serif;font-size:6.5cqw;font-weight:800;line-height:1;letter-spacing:-.06em;color:#f5f5ed;z-index:2;will-change:transform,opacity}
.opening-label.left{left:6cqw}.opening-label.right{right:6cqw}
.opening-label small{font-size:.48em;letter-spacing:-.035em;margin-left:.16em}
.opening-ink{display:block;transform-origin:50% 55%}.ink-drop{position:absolute;left:50%;top:50%;width:.30cqw;height:.30cqw;background:#f5f5ed;border-radius:43% 57% 62% 38%;opacity:0;pointer-events:none}
.wave-field{left:-70cqw;top:-30cqw;width:240cqw;transform-origin:50% 50%}
.wave .ribbon{margin-left:0}
.wave .meta,.wave .footer{background:transparent}
.word-state{position:absolute;inset:0;background:var(--word-bg);color:var(--word-fg)}
.word-large{display:block;flex:none;will-change:transform}
.logo-art{will-change:transform,clip-path}
.final-wave{will-change:transform}.final-wave .wave-char{display:inline-block}
`;
await writeFile(path.join(root,'motion.css'),sourceCss+extraCss);
const configs=[['01','dots',0,1.4],['02','date',1.4,1.3],['03','message',2.7,2.5],['04','wave',5.2,2.1],['05','logo',7.3,1.5],['06','connect',8.8,2.4],['07','final',11.2,4.8]];
const sequence=[['AI CONNECT','#397EF3','#080808','14.7'],['DDP','#FF4C9D','#080808','27'],['AI','#080808','#F5F5ED','30'],['SOYLAB','#00AE9E','#080808','23'],['CREATORS','#F58438','#080808','18.1'],['ONE','#080808','#F5F5ED','27']];
const live=[];
for(const [number,type,start,duration] of configs){
  const sourceHtml=await readFile(path.join(source,`${number}-${type}.html`),'utf8');
  let section=sourceHtml.match(/<section\b[\s\S]*?<\/section>/)[0];
  section=section.replace(`id="frame-${number}"`,`id="motion-${number}-scene" data-motion-scene="${number}"`);
  section=section.replace('<svg class="dots"','<svg data-layout-ignore="true" class="dots"');
  if(type==='dots') {const drops=Array.from({length:16},(_,i)=>`<i class="ink-drop" data-ink="${i}"></i>`).join('');section=section.replace('</section>',`<div class="opening-label left"><span class="opening-ink">12<small>DEC</small></span>${drops}</div><div class="opening-label right"><span class="opening-ink">DDP</span>${drops}</div></section>`);}
  // Outfit's oversized inline numeral metrics extend beyond the painted glyph.
  // Actual 2.05s and 15.9s proof confirms the date/metadata ink has clear space.
  section=section.replace('class="date-numeral"','class="date-numeral" data-layout-allow-overlap="true" data-layout-allow-overflow="true"');
  section=section.replace('class="final-numeral"','class="final-numeral" data-layout-allow-overlap="true"');
  if(type==='message') section=section.replace('AI를 사이에 두고,<br>사람과 사람이 <em>만나다.</em>','<span class="message-line-mask"><span class="message-line">AI를 사이에 두고,</span></span><span class="message-line-mask"><span class="message-line">사람과 사람이 <em>만나다.</em></span></span>');
  if(type==='wave') {
    const rows=[...section.matchAll(/<div class="ribbon ([^"]+)">([\s\S]*?)<\/div>/g)];
    const field=Array.from({length:14},(_,i)=>{const row=rows[i%rows.length];return `<div class="ribbon ${row[1]}">${(row[2]+'<span>&nbsp;</span>').repeat(3)}</div>`;}).join('');
    section=section.replace(/<div class="wave-field">[\s\S]*<\/div><\/section>/,`<div class="wave-field" data-layout-ignore="true" aria-label="사람, AI, 게임, 예술, 이야기의 텍스트 웨이브">${field}</div></section>`);
  }
  if(type==='connect'){
    const metadata=section.match(/<div class="meta">[\s\S]*?<div class="connect-title">/)[0].replace('<div class="connect-title">','');
    section=`<section class="scene" id="motion-06-scene" data-motion-scene="06">${sequence.map(([word,bg,fg,size],i)=>`<div class="word-state" data-word-index="${i}" style="--word-bg:${bg};--word-fg:${fg}">${metadata}<div class="word-mask" data-layout-allow-overflow="true" style="--word-size:${size}cqw"><div class="word-large">${word}<span class="connect-dot">.</span></div></div></div>`).join('')}</section>`;
  }
  if(type==='final') section=section.replace('class="final-wave"','class="final-wave" data-layout-ignore="true"');
  live.push(section);
  const id=`scene-${number}`;
  const css=sourceCss+extraCss+`\n#${id}-root{width:100%;height:100%;position:relative;overflow:hidden;container-type:inline-size}#${id}-root .scene{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto}`;
  const html=`<!doctype html><html lang="ko"><head><meta charset="UTF-8"></head><body><template><style>${css}</style><div id="${id}-root" data-composition-id="${id}" data-width="1680" data-height="720" data-duration="${duration}">${section}</div><script>
  (function(){const element=document.getElementById('${id}-root');const scene=window.MotionScenes.create(element.querySelector('[data-motion-scene]'),'${type}');const clock={t:0};const tl=gsap.timeline({paused:true,onUpdate:()=>scene.seek(clock.t)});tl.to(clock,{t:${duration},duration:${duration},ease:'none'},0);scene.seek(0);window.__timelines['${id}']=tl;})();
  </script></template></body></html>`;
  await writeFile(path.join(root,'compositions',`${number}-${type}.html`),html);
}
await writeFile(path.join(root,'live-scenes.html'),live.join('\n'));
const slots=configs.map(([number,type,start,duration])=>`<div id="scene-${number}" class="clip" data-start="${start}" data-duration="${duration}" data-track-index="0" data-composition-id="scene-${number}" data-composition-src="compositions/${number}-${type}.html" data-width="1680" data-height="720"></div>`).join('\n');
await writeFile(path.join(root,'index.html'),`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI CONNECT — approved v6 motion</title><style>html,body{margin:0;width:100%;height:100%;background:#080808;overflow:hidden}#ai-connect-motion{position:relative;width:100%;height:100%;overflow:hidden}.clip{position:absolute;inset:0;width:100%;height:100%}</style><script src="assets/gsap.min.js"></script><script src="scene-runtime.js"></script></head><body><main id="ai-connect-motion" data-composition-id="ai-connect-motion" data-start="0" data-duration="16" data-width="1680" data-height="720" data-fps="30">${slots}<audio id="beat-sync" src="audio/AI-CONNECT-final-mix-16s.mp3" data-start="0" data-duration="16" data-track-index="1" data-volume="1"></audio></main><script>window.__timelines=window.__timelines||{};window.__timelines['ai-connect-motion']=gsap.timeline({paused:true});</script></body></html>`);
await writeFile(path.join(root,'SCENES.json'),JSON.stringify(configs.map(([number,type,start,duration])=>({number,type,start,duration})),null,2));
console.log('Generated seven formal subcompositions, index.html, motion.css, live-scenes.html and assets.');

