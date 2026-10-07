import fs from 'node:fs';
const file=new URL('art.mjs',import.meta.url);
let s=fs.readFileSync(file,'utf8');
s=s.replace('const defs=`<defs>','const baseDefs=`<defs>');
const marker='const use=(id,x,y,w,h,cl=\'\',rot=0)=>';
const extra=`const defs=baseDefs.replace('</defs>', \`<symbol id="hand-hold" viewBox="0 0 400 260"><path d="M0 116L118 129L166 119Q192 98 226 108L265 123Q286 132 281 149Q281 161 268 164Q287 175 279 190Q283 207 267 216Q255 232 231 225L165 216Q141 212 120 197L0 184Z" fill="url(#skin)"/><path d="M139 133Q156 109 174 86L197 61Q215 44 227 58Q238 71 220 89L195 122L224 137" fill="url(#skin)"/><path d="M225 146L270 163M221 169L277 188M214 194L267 215" stroke="#AA8D7B" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M0 104L121 120L109 207L0 197Z" fill="url(#ink-cloth)"/><path d="M100 119L121 122L109 204L87 201Z" fill="url(#slab)"/></symbol>
<symbol id="builder-a" viewBox="0 0 360 610"><path d="M127 187Q166 210 211 188L265 219Q292 246 300 338L320 610H57L76 339Q74 256 104 214Z" fill="url(#ink-cloth)"/><path d="M128 193L172 237L213 191M180 258L175 570" stroke="#65556F" stroke-width="2" fill="none"/><path d="M104 217Q64 242 49 293L25 406Q24 439 52 450L151 478L167 438L79 407L113 306Z" fill="url(#ink-cloth)"/><path d="M134 435L169 448L178 480L155 484L130 474Z" fill="url(#skin)"/><path d="M253 232Q290 240 310 280L355 308L335 371L269 330L235 289Z" fill="url(#purple-cloth)"/><use href="#face-a" x="100" y="14" width="158" height="210"/></symbol>
<symbol id="builder-c" viewBox="0 0 360 610"><path d="M127 187Q166 210 211 188L265 219Q292 246 300 338L320 610H57L76 339Q74 256 104 214Z" fill="url(#purple-cloth)"/><path d="M128 193L172 237L213 191M180 258L175 570" stroke="#9973BA" stroke-width="2" fill="none"/><path d="M260 224Q312 247 322 302L338 390Q346 427 315 448L247 480L223 445L283 401L252 307Z" fill="url(#ink-cloth)"/><path d="M238 435L258 461L233 486L207 492L203 477L226 453Z" fill="url(#skin)"/><path d="M108 229Q72 236 47 275L3 301L28 363L87 330L124 275Z" fill="url(#purple-cloth)"/><use href="#face-c" x="100" y="14" width="158" height="210"/></symbol></defs>\`);
`;
s=s.replace(marker,extra+marker);
// Shared creative result: two profiles meet across a folded path, with game-like stepping blocks and a page fold.
s=s.replace('const frame=`','const artwork=`<path d="M618 108L931 85L978 393L662 418Z" fill="url(#screen)"/><path d="M627 117L754 108Q802 141 778 180L804 207L783 219L791 245Q770 283 733 274L704 320L655 325Z" fill="url(#silk-cream)"/><path d="M914 102L854 109Q813 145 842 181L817 207L839 221L833 248Q852 280 884 267L926 312L965 318Z" fill="#48334F"/><path d="M653 354C742 252 818 405 950 293" fill="none" stroke="url(#silk-purple)" stroke-width="33"/><path d="M690 378L735 371L739 394L693 400ZM747 369L792 363L796 386L750 392ZM805 360L850 354L854 378L808 384Z" fill="#EEE5F1"/><path d="M913 85L931 85L938 132L902 110Z" fill="#FAF5ED"/><path d="M861 368L927 360M865 379L930 371" stroke="#EEE5F1" stroke-width="3"/>`;
const frame=`${artwork}');
s=s.replace("use('adult-a',39,-163,499,845", "use('adult-a',39,-13,438,742");
s=s.replace("use('adult-a',-93,-59,290,492", "use('adult-a',-74,-5,253,429");
s=s.replace("use('adult-c',1054,61,302,512", "use('builder-c',1054,61,302,512");
s=s.replace("use('adult-a',184,1,330,558", "use('builder-a',184,1,330,558");
s=s.replace("use('adult-a',-43,89,182,309", "use('builder-a',-43,89,182,309");
s=s.replace("use('adult-c',284,82,157,267", "use('builder-c',284,82,157,267");
s=s.replaceAll("use('hand-grip'", "use('hand-hold'");
s=s.replace("use('hand-hold',373,232,285,185,'support-left',-10)","use('hand-hold',374,229,330,215,'support-left',-10)");
s=s.replace("translate(1159 221) scale(-1 1)","translate(1179 221) scale(-1 1)");
s=s.replace("use('hand-hold',0,0,226,147,'support-right',-11)","use('hand-hold',0,0,274,178,'support-right',-11)");
s=s.replace("use('hand-hold',28,204,612,397,'hand-left',-11)","use('hand-hold',-65,27,935,608,'hand-left',0)");
s=s.replace("translate(1438 28) scale(-1 1)","translate(1495 -39) scale(-1 1)");
s=s.replace("use('hand-hold',0,0,610,397,'hand-right',-8)","use('hand-hold',0,0,910,592,'hand-right',0)");
s=s.replace("use('art-frame',592,118,240,278,'handoff-object',-8)","use('art-frame',578,124,286,331,'handoff-object',-5)");
s=s.replace("use('hand-hold',-48,197,275,179,'hand-left',-16)","use('hand-hold',-108,92,361,235,'hand-left',0)");
s=s.replace("translate(450 60) scale(-1 1)","translate(521 8) scale(-1 1)");
s=s.replace("use('hand-hold',0,0,299,195,'hand-right',-11)","use('hand-hold',0,0,350,228,'hand-right',0)");
s=s.replace("use('hand-hold',38,154,386,251,'gather one',-10)","use('hand-hold',-76,82,670,436,'gather one',-7)");
s=s.replaceAll("translate(1266 -84) rotate(55) scale(-1 1)","translate(896 -160) rotate(90)");
s=s.replaceAll("use('hand-hold',0,0,403,262,'gather two',0)","use('hand-hold',0,0,470,306,'gather two',0)");
s=s.replaceAll("translate(1434 441) rotate(14) scale(-1 -1)","translate(1475 540) rotate(180)");
s=s.replaceAll("use('hand-hold',0,0,342,222,'gather three',0)","use('hand-hold',0,0,470,306,'gather three',0)");
s=s.replace("use('hand-hold',83,174,386,251,'gather one',-10)","use('hand-hold',-15,102,620,403,'gather one',-7)");
s=s.replace("${use('controller',827,278,242,181,'final-game',-13)}${use('art-frame',1024,140,187,216,'final-art',8)}${use('book',1075,336,211,194,'final-book',-14)}",'');
fs.writeFileSync(file,s);
