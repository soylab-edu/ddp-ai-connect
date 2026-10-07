import fs from 'node:fs';
// Complete official Open Peeps figures, recolored without editing anatomy.
const W='var(--line-paper)',I='var(--line-ink)';
const names=['standing-24','standing-16','standing-18','sitting-1','sitting-15','sitting-17'];
const sizes={};
const defs='<defs>'+names.map(name=>{
  const raw=fs.readFileSync(new URL(`assets/open-peeps/peep-${name}.svg`,import.meta.url),'utf8');
  const vb=raw.match(/viewBox="([^"]+)"/)[1];sizes[name]=vb.split(' ').slice(2).map(Number);
  let body=raw.slice(raw.indexOf('>',raw.indexOf('<svg'))+1,raw.lastIndexOf('</svg>'));
  body=body.replace(/\s+id="[^"]*"/g,'').replace(/<title>[\s\S]*?<\/title>|<desc>[\s\S]*?<\/desc>|<!--[\s\S]*?-->/g,'').replace(/#000000/gi,I).replace(/#FFFFFF/gi,W);
  return `<symbol id="peep-${name}" viewBox="${vb}">${body}</symbol>`;
}).join('')+'</defs>';
function person(name,x,y,h,cl='',mirror=false){const [sw,sh]=sizes[name],w=h*sw/sh;return `<g transform="translate(${x} ${y})"><g class="${cl}"><g transform="${mirror?`translate(${w} 0) scale(-1 1)`:'translate(0 0)'}"><use href="#peep-${name}" width="${w}" height="${h}"/></g></g></g>`;}
const svg=(inner,m=false)=>`<svg class="art ${m?'mobile-art':'desktop-art'}" viewBox="0 0 ${m?'390 430':'1440 570'}" aria-hidden="true" data-layout-ignore>${inner}</svg>`;
const line=(d,extra='')=>`<path d="${d}" fill="none" stroke="${I}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const shape=(d,extra='')=>`<path d="${d}" fill="${W}" stroke="${I}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
function beanbag(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})">${shape('M-90 0C-117-27-124-86-94-111C-60-139-8-130 14-84C26-59 56-24 45-6C16 20-57 25-90 0Z')}${line('M-96-89C-103-58-84-29-52-14')}</g>`;}
function chair(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})">${shape('M-57-9Q1-20 54-5L49 12H-53Z')}${line('M-46 12L-59 151M42 11L63 151')}</g>`;}
function tablet(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><g class="tablet-stand">${shape('M-80 94Q0 75 80 94Q87 108 0 113Q-89 109-80 94Z')}${line('M-58 110L-64 210M57 110L62 210')}${shape('M-43-6L57 1L43 91L-55 84Z')}${line('M-35 4L46 10L35 80L-44 74')}${line('M-5 88L-3 96')}
<g class="ai-display" fill="${I}"><text x="-18" y="45" font-family="Pretendard" font-weight="800" font-size="30">AI</text><rect class="screen-line" x="-26" y="55" width="48" height="2.5"/><rect class="screen-line" x="-28" y="63" width="30" height="2.5"/></g></g></g>`;}
const network=`${person('standing-18',683,39,465,'network-back',true)}${person('standing-24',333,14,533,'network-left')}${person('standing-16',886,9,543,'network-right',true)}`;
const networkMobile=`${person('standing-18',141,91,263,'network-back',true)}${person('standing-24',7,57,306,'network-left')}${person('standing-16',254,59,307,'network-right',true)}`;
const experience=`${beanbag(461,469,1.22)}${chair(1005,354,1.06)}${person('sitting-1',373,67,458,'experience-left')}${person('sitting-17',914,49,483,'experience-right',true)}${tablet(765,237,1.12)}`;
const experienceMobile=`${beanbag(77,327,.69)}${chair(318,261,.66)}${person('sitting-1',22,91,288,'experience-left')}${person('sitting-17',249,80,305,'experience-right',true)}${tablet(209,214,.60)}`;
function table(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})" class="counsel-table">${shape('M-120 0L109-9L141 18L-137 29Z')}${shape('M-137 29L141 18L141 28L-137 39Z')}${line('M-113 38L-122 240M117 30L129 230')}${shape('M-72 0L-9-4L4 14L-56 20Z')}${line('M-61 3L-25 1M-56 10L-14 7M29 7L56 4')}</g>`;}
const consultation=`${chair(1091,348,1.09)}${table(790,274,1.05)}${person('sitting-15',277,29,514,'consult-left')}${person('sitting-17',937,29,514,'consult-right',true)}`;
const consultationMobile=`${chair(330,246,.62)}${table(214,225,.57)}${person('sitting-15',8,72,306,'consult-left')}${person('sitting-17',259,72,306,'consult-right',true)}`;
const scenes=[
 {id:'networking',bg:'#7A00EE',light:true,caption:'사람과 사람이 만나는 자리.',n:'01',art:'<span class="scene-tag">MEET<br>TOGETHER.</span>'+svg(network)+svg(`<g transform="translate(4 12) scale(.94)">${networkMobile}</g>`,true)},
 {id:'word1',bg:'#111111',light:true,caption:'기술보다 먼저,',n:'02',art:'<div class="type-line type-one">사람과</div><div class="type-line type-two">사람.</div>'},
 {id:'experience',bg:'#CCFF00',caption:'AI를 사이에 두고, 함께 경험하다.',n:'03',art:'<span class="scene-tag">TRY<br>TOGETHER.</span>'+svg(experience)+svg(`<g transform="translate(5 27) scale(.85)">${experienceMobile}</g>`,true)},
 {id:'word2',bg:'#DF0221',light:true,caption:'서로 다른 창작을 잇는',n:'04',art:'<div class="type-flash flash-one">AI를</div><div class="type-flash flash-two">사이에</div><div class="type-flash flash-three">두고.</div>'},
 {id:'consultation',bg:'#111111',light:true,caption:'질문을 나누고, 다음을 함께 만들다.',n:'05',art:'<span class="scene-tag">TALK<br>TOGETHER.</span>'+svg(consultation)+svg(`<g transform="translate(5 28) scale(.84)">${consultationMobile}</g>`,true)},
 {id:'finale',bg:'#7A00EE',light:true,caption:'AI를 사이에 두고,',n:'06',art:'<div class="final-title">사람과 사람이<br>만나다.</div><p class="final-note">전시·상영·무료강의·교류.<br>함께 만드는 다음 장면.</p>'+svg(`<g transform="translate(564 130) scale(.69)">${network}</g>`)+svg(`<g transform="translate(55 144) scale(.72)">${networkMobile}</g>`,true)}
];
export{defs,scenes};
