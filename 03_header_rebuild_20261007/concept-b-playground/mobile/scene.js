/* B / INTERVAL. Slabs, separation, alignment, joining. No figurative models. */
(() => {
 'use strict';
 const root=document.getElementById('playground'),canvas=document.getElementById('world');
 const P={paper:0xF5F5F5,ink:0x111111,purple:0x7A00EE,lime:0xCCFF00,red:0xDF0221};
 const scene=new THREE.Scene(),world=new THREE.Group();scene.add(world);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
 renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const camera=new THREE.PerspectiveCamera(34,1,.1,100);
 const hemi=new THREE.HemisphereLight(0xffffff,0x4A4058,1.0);scene.add(hemi);
 const key=new THREE.DirectionalLight(0xffffff,2.65);key.position.set(-7,8,10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.1,far:35});key.shadow.bias=-.0003;key.shadow.normalBias=.02;scene.add(key);
 const rim=new THREE.DirectionalLight(0xDBD5FF,.65);rim.position.set(7,-2,-6);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xffffff,.35);fill.position.set(6,4,8);scene.add(fill);
 function mat(color,metalness=.18){return new THREE.MeshStandardMaterial({color,roughness:.48,metalness});}
 const M={paper:mat(P.paper,.08),ink:mat(P.ink,.33),purple:mat(P.purple,.23),lime:mat(P.lime,.06)};
 function slab(w,h,d,m){const g=new THREE.BoxGeometry(w,h,d);const o=new THREE.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;return o;}
 const hero=new THREE.Group();world.add(hero);
 const solid=slab(7.3,5.0,.36,M.paper);hero.add(solid);
 // Thin seams are authored as the first physical separation, not a tile texture.
 const primary=[],secondary=[];
 const N=29;
 for(let i=0;i<N;i++){const a=slab(.235,5.0,.34,M.paper);hero.add(a);primary.push(a);const b=slab(.235,5.0,.34,M.lime);world.add(b);secondary.push(b);}
 const field=new THREE.Group();world.add(field);const fins=[];
 for(let i=0;i<37;i++){const a=slab(.105,9.5,2.4,M.ink);field.add(a);fins.push(a);}
 function wordGeometry(word){const sp=new THREE.ShapePath();for(const c of window.glyphData[word].commands){if(c[0]==='M')sp.moveTo(c[1],c[2]);else if(c[0]==='L')sp.lineTo(c[1],c[2]);else if(c[0]==='Q')sp.quadraticCurveTo(c[1],c[2],c[3],c[4]);else if(c[0]==='C')sp.bezierCurveTo(c[1],c[2],c[3],c[4],c[5],c[6]);else if(c[0]==='Z')sp.currentPath.closePath();}
  const g=new THREE.ExtrudeGeometry(sp.toShapes(false),{depth:.12,bevelEnabled:true,bevelThickness:.009,bevelSize:.007,bevelSegments:2,curveSegments:15,steps:1});g.computeBoundingBox();const center=g.boundingBox.getCenter(new THREE.Vector3());g.translate(-center.x,-center.y,-center.z);g.computeVertexNormals();return g;}
 const words={};for(const text of ['사람','AI']){const g=new THREE.Group();world.add(g);const geo=wordGeometry(text);const layers=[];for(let i=0;i<14;i++){const o=new THREE.Mesh(geo,i===13?M.ink:M.purple);o.castShadow=true;o.receiveShadow=true;g.add(o);layers.push(o);}words[text]={group:g,layers};}
 const construction=new THREE.Group();world.add(construction);const structure=[];
 for(let i=0;i<31;i++){const g=new THREE.Group();construction.add(g);const tall=slab(.13,5.3,1.50,i%9===0?M.purple:M.ink);g.add(tall);structure.push(g);}
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),lerp=(a,b,t)=>a+(b-a)*t;
 const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};const e=(t,a,b)=>smooth((t-a)/(b-a));
 const bgColor=new THREE.Color();let previousTheme='';
 function theme(bg,dark){bgColor.setHex(bg);scene.background=bgColor;root.style.backgroundColor='#'+bgColor.getHexString();root.style.setProperty('--frame-bg','#'+bgColor.getHexString());const k=bg+'-'+dark;if(k!==previousTheme){root.classList.toggle('light-type',dark);previousTheme=k;}}
 function hide(){hero.visible=false;field.visible=false;construction.visible=false;secondary.forEach(o=>o.visible=false);Object.values(words).forEach(o=>o.group.visible=false);}
 const state={time:0};
 function draw(t){
  const mobile=root.clientWidth<=620;hide();world.position.set(0,0,0);world.rotation.set(0,0,0);world.scale.setScalar(1);
  let cp=[5.6,3.1,12.4],target=[0,0,0],chapter=0;key.intensity=2.65;fill.intensity=.35;
  const type=document.getElementById('kinetic-type');type.style.opacity='0';root.classList.toggle('bleed-cue',t>=8.55&&t<10.55);
  if(t<2.30){
   theme(P.purple,true);hero.visible=true;const q=e(t,1.05,2.18);solid.visible=q<.008;
   hero.rotation.set(lerp(.10,-.17,q),lerp(-.36,.37,q),lerp(-.20,.17,q));hero.position.set(0,-.10,0);
   primary.forEach((o,i)=>{o.visible=!solid.visible;o.material=M.paper;const u=(i-(N-1)/2)/(N-1);o.position.set(u*lerp(7.3,10.2,q),Math.sin(u*Math.PI*2)*q*.65,Math.cos(u*Math.PI)*q*1.1);o.rotation.set(0,Math.sin(u*Math.PI)*q*.37,0);o.scale.set(lerp(7.3/N/.235,1,q),1,1);});
   cp=[4.6,3.2,12.7];
  }else if(t<4.60){
   chapter=1;theme(P.lime,false);field.visible=true;const q=e(t,2.30,4.60);field.rotation.set(.18,lerp(-.60,.15,q),-.25);field.position.set(0,.2,0);key.intensity=5.0;fill.intensity=2.2;
   fins.forEach((o,i)=>{const u=(i-18)/18;o.material=i===18?M.lime:M.ink;o.position.set(u*9.4,Math.sin(u*2.2+q*3)*.45,Math.sin(u*Math.PI*1.2+q*2)*2.0);o.rotation.y=.42+Math.sin(u*2+q*3)*.47;});
   cp=[4.3,2.3,11.1];
  }else if(t<6.65){
   chapter=2;theme(P.ink,true);hero.visible=true;solid.visible=false;const q=e(t,4.60,6.28);hero.rotation.set(.18,-.25,-.40);hero.position.set(0,0,0);
   primary.forEach((o,i)=>{const u=(i-14)/12;o.visible=i>=2&&i<=26&&(i-2)%3===0;o.material=M.lime;o.position.set(-3.3+u*2.6,Math.sin(u*Math.PI)*.25,0);o.rotation.set(0,.35*u,0);o.scale.set(1,.84,1);});
   secondary.forEach((o,i)=>{const u=(i-14)/12;o.visible=i>=2&&i<=26&&(i-2)%3===0;o.material=M.lime;o.position.set(lerp(6.5,3.8,q)+Math.sin(u*Math.PI)*.18,u*2.5,lerp(2.2,.4,q));o.rotation.set(0,-.3*u,Math.PI/2);o.scale.set(1,.67,1);});
   cp=[4.6,3.4,14.1];
  }else if(t<8.55){
   chapter=3;const useAI=t>=7.70;theme(useAI?P.lime:P.purple,!useAI);const w=useAI?words.AI:words['사람'];w.group.visible=true;w.group.position.set(0,mobile?.55:.1,0);w.group.scale.setScalar(mobile?(useAI?3.3:2.05):(useAI?6.1:5.0));w.group.rotation.set(.04,lerp(-.25,.10,e(t,6.65,8.55)),-.09);
   w.layers.forEach((o,i)=>{o.position.set(i*.012,i*.006,(i-6.5)*.068);o.material=useAI?M.ink:M.paper;});
   cp=[3.1,2.4,14.0];
  }else if(t<10.55){
   chapter=4;const k=Math.min(2,Math.floor((t-8.55)/.64));const names=['GAME','ART','STORY'];const colors=[P.purple,P.red,P.lime];theme(colors[k],k<2);type.style.color=k===2?"#111111":"#F5F5F5";type.textContent=names[k];type.style.opacity='1';
   const local=(t-8.55-k*.64)/.64;type.style.transform=`translate(-50%,-50%) translateX(${lerp(36,0,e(local,0,.33))}px)`;
   cp=[3.2,1.6,12.7];
  }else{
   chapter=5;theme(P.ink,true);construction.visible=true;const q=e(t,10.55,12.35);construction.position.set(lerp(0,2.30,q),.25,0);construction.rotation.set(.12,lerp(-.55,-.30,q),-.19);construction.scale.setScalar(lerp(1.28,.77,q));
   structure.forEach((g,i)=>{const u=(i-15)/15;g.position.set(u*5.1,Math.sin(u*Math.PI)*.72,Math.cos(u*Math.PI)*1.20);g.rotation.set(0,.80*u,0);g.children[0].scale.y=1-.20*Math.cos(u*Math.PI);g.children[0].material=i%10===0?M.ink:M.lime;});
   cp=[4.9,3.2,15.7];
   if(mobile){construction.position.set(-.15,-.85,0);construction.scale.setScalar(.47);cp=[4.6,3.1,19.7];}
  }
  if(mobile&&t<10.55){cp=cp.map((v,i)=>i===2?v*1.22:v);world.scale.setScalar(t<2.3?.48:t>=4.6&&t<6.65?.36:1);}
  camera.position.set(...cp);camera.lookAt(...target);
  const labels=['분절','정렬','맞물림','사람과 AI','GAME · ART · STORY','함께 만드는 가능성'];document.getElementById('chapter-number').textContent='0'+(chapter+1);document.getElementById('chapter-label').textContent=labels[chapter];
  renderer.render(scene,camera);
 }
 function resize(){const w=root.clientWidth||1600,h=root.clientHeight||640;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();draw(state.time);}
 const tl=gsap.timeline({paused:true});tl.to(state,{time:15,duration:15,ease:'none',onUpdate:()=>draw(state.time)},0);
 tl.to(['.folio','.chapter-note'],{autoAlpha:0,duration:.28},10.6);tl.to('.poster-copy',{autoAlpha:1,duration:.6,ease:'power2.out'},11.4);tl.from('.poster-copy',{y:22,duration:.6,ease:'power2.out'},11.4);tl.to('.progress',{scaleX:1,duration:15,ease:'none'},0);
 window.playgroundTimeline=tl;window.playground={timeline:tl,duration:15,draw,resize};window.__timelines=window.__timelines||{};window.__timelines.playground=tl;
 resize();window.addEventListener('resize',resize);
})();
