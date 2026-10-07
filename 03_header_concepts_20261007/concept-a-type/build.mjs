import fs from 'node:fs';
const body=fs.readFileSync(new URL('./poster-body.template',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('./poster.css',import.meta.url),'utf8');
const motion=fs.readFileSync(new URL('./motion.js',import.meta.url),'utf8');
function doc(content,{live=false,mobile=false}={}){return `<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SOYLAB — A / 사람과 사람 사이</title><style>${css}</style><script src="assets/gsap.min.js"></script></head><body class="${live?'live':'render'}">${mobile?content.replace('data-width="1440" data-height="900"','data-width="390" data-height="844"'):content}${live?`<main class="below"><section id="program"><h2>게임 · 예술 · 이야기를 한자리에</h2><p>전시·상영·강의·교류를 통해 AI 창작을 함께 보고, 이야기하고, 만나기 위한 행사입니다.</p><p class="note">상세 프로그램과 강의 신청 링크는 추후 공개됩니다.</p></section><section id="guide"><h2>참여 안내</h2><p>2026년 12월 9–10일, DDP 디자인랩 3층 디자인홀에서 만납니다.</p><p>일반 관람: 12월 9일 10:30–19:40 / 12월 10일 15:00–19:40</p><p class="note">기업 참여는 확정되지 않았습니다. 참여 방법은 추후 안내합니다.</p><a href="#root">헤더로 돌아가기 ↑</a></section></main>`:''}<script>${motion}</script>${live?'<script src="live.js"></script>':''}</body></html>`;}
fs.writeFileSync(new URL('./index.html',import.meta.url),doc(body));
fs.writeFileSync(new URL('./header-a.html',import.meta.url),doc(body.replace(' data-composition-id="type-poster"',''),{live:true}));
fs.mkdirSync(new URL('./mobile/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('./mobile/index.html',import.meta.url),doc(body,{mobile:true}));
fs.cpSync(new URL('./assets/',import.meta.url),new URL('./mobile/assets/',import.meta.url),{recursive:true});
fs.copyFileSync(new URL('./hyperframes.json',import.meta.url),new URL('./mobile/hyperframes.json',import.meta.url));
for(const width of [768,1024]){
 const dir=new URL('./tablet-'+width+'/',import.meta.url);
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(new URL('index.html',dir),doc(body.replace('data-width="1440" data-height="900"',`data-width="${width}" data-height="900"`)));
 fs.cpSync(new URL('./assets/',import.meta.url),new URL('assets/',dir),{recursive:true});
 fs.copyFileSync(new URL('./hyperframes.json',import.meta.url),new URL('hyperframes.json',dir));
}
console.log('Built desktop 1440×900, mobile 390×844 and live responsive header.');
