import fs from 'node:fs';
const base=new URL('./',import.meta.url),asset=new URL('assets/open-peeps/',base);
const html=fs.readFileSync(new URL('official-page.html',asset),'utf8');
const links=[...new Set(html.match(/https:\/\/[^"<> ]+\.svg/g))].filter(u=>/peep-(standing|sitting)-/.test(u));
const jobs=links.map(url=>({url,name:url.match(/peep-(?:standing|sitting)-\d+\.svg/)[0]}));
let n=0;await Promise.all(Array.from({length:6},async()=>{while(n<jobs.length){const job=jobs[n++];const r=await fetch(job.url);if(!r.ok)throw new Error(r.status+' '+job.url);fs.writeFileSync(new URL(job.name,asset),await r.text());}}));
fs.writeFileSync(new URL('provenance.json',asset),JSON.stringify({source:'https://www.openpeeps.com/',creator:'Pablo Stanley',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',retrieved:'2026-10-07',files:jobs},null,2));
for(const type of ['standing','sitting']){
 const selected=jobs.filter(j=>j.name.includes(type)).sort((a,b)=>Number(a.name.match(/(\d+)\.svg/)[1])-Number(b.name.match(/(\d+)\.svg/)[1]));
 const dir=new URL('catalog-'+type+'/',base);fs.mkdirSync(new URL('assets/',dir),{recursive:true});
 selected.forEach(j=>fs.copyFileSync(new URL(j.name,asset),new URL('assets/'+j.name,dir)));
 const height=Math.ceil(selected.length/5)*330;
 const doc=`<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:1440px;height:${height}px;background:#f8f6f2;font:17px Arial;color:#211914}#root{width:1440px;height:${height}px;display:grid;grid-template-columns:repeat(5,1fr);grid-auto-rows:330px}.figure{border:1px solid #ddd;display:flex;flex-direction:column;align-items:center;padding:12px}.figure img{width:250px;height:275px;object-fit:contain}.figure p{margin:6px}</style></head><body><div id="root" data-composition-id="catalog" data-start="0" data-duration="1" data-width="1440" data-height="${height}">${selected.map(j=>`<div class="figure"><img src="assets/${j.name}"><p>${j.name.replace('.svg','')}</p></div>`).join('')}</div></body></html>`;
 fs.writeFileSync(new URL('index.html',dir),doc);fs.copyFileSync(new URL('hyperframes.json',base),new URL('hyperframes.json',dir));
}
console.log(`Downloaded ${jobs.length} official complete SVGs; wrote license ledger and pose catalogs.`);
