// Render-only profile for the authored 1600x640 canvas.
// HyperFrames 0.8.139 accepts fixed resolution presets but internally supports
// integer DPR. Replace one preset in this Node process only; no installed files
// or composition dimensions are modified.
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
const dpr=Number(process.argv[2]||2);
if(![1,2,3].includes(dpr))throw new Error('DPR must be 1, 2, or 3');
const cliRoot='C:/Users/wlsgh/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/hyperframes';
if(JSON.parse(readFileSync(cliRoot+'/package.json','utf8')).version!=='0.8.139')throw new Error('This render profile requires HyperFrames 0.8.139');
const parser=await import(pathToFileURL(cliRoot+'/dist/chunk-OZUQF4NB.js'));
parser.CANVAS_DIMENSIONS['landscape-4k']={width:1600*dpr,height:640*dpr};
const pass=process.argv.slice(3);
console.log(JSON.stringify({profile:'HUMAN return DPR',cssWidth:1600,cssHeight:640,deviceScaleFactor:dpr,pixelWidth:1600*dpr,pixelHeight:640*dpr}));
process.argv=[process.argv[0],cliRoot+'/bin/hyperframes.mjs','render','--resolution','landscape-4k',...pass];
await import(pathToFileURL(cliRoot+'/bin/hyperframes.mjs'));
