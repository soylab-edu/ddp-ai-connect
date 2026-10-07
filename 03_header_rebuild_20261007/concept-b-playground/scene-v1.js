/* Creative Playground. Original procedural models and deterministic 15-second score. */
(() => {
 'use strict';
 const root=document.getElementById('playground'), canvas=document.getElementById('world');
 let mobile=innerWidth<=620;
 const C={paper:0xECE5DA,cream:0xE6E0D7,ink:0x25222A,purple:0x57248F,lime:0xCCFF00,clay:0x8E8073,apricot:0xB5A896,rose:0xA49A90};
 const scene=new THREE.Scene();
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setClearColor(0x000000,0);
 renderer.setPixelRatio(1); renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const camera=new THREE.PerspectiveCamera(34,1,.1,100);
 const world=new THREE.Group();scene.add(world);
 // Softbox reflections are generated in code, not loaded imagery.
 const envCanvas=document.createElement('canvas');envCanvas.width=512;envCanvas.height=256;
 const ec=envCanvas.getContext('2d');const eg=ec.createLinearGradient(0,0,0,256);
 eg.addColorStop(0,'#eee9e0');eg.addColorStop(.52,'#bfb4a9');eg.addColorStop(1,'#71645c');ec.fillStyle=eg;ec.fillRect(0,0,512,256);
 ec.fillStyle='#ffffff';ec.fillRect(30,30,110,100);ec.fillRect(300,55,80,76);
 const et=new THREE.CanvasTexture(envCanvas);et.mapping=THREE.EquirectangularReflectionMapping;
 const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromEquirectangular(et).texture;
 const ambient=new THREE.HemisphereLight(0xfff8ed,0x8C8592,.48);scene.add(ambient);
 const key=new THREE.DirectionalLight(0xfff7eb,2.15);key.position.set(-5,10,8);key.castShadow=true;
 key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-13,right:13,top:13,bottom:-13,near:.1,far:35});key.shadow.bias=-.0003;key.shadow.normalBias=.035;key.shadow.radius=4;scene.add(key);
 const rim=new THREE.DirectionalLight(0xEEE9F4,.85);rim.position.set(8,5,-6);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xffffff,.32);fill.position.set(2,1,10);scene.add(fill);
 function mat(color,roughness=.55,metalness=.08){return new THREE.MeshPhysicalMaterial({color,roughness,metalness,envMapIntensity:.32,clearcoat:.06,clearcoatRoughness:.5});}
 const M={purple:mat(C.purple,.5,.16),lime:mat(C.lime,.52,.05),cream:mat(C.cream,.72),ink:mat(C.ink,.48,.45),clay:mat(C.clay,.8),skin:mat(C.apricot,.8),rose:mat(C.rose,.73),white:mat(0xffffff,.83),metal:mat(0x9E9A96,.36,.75)};
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.19}));floor.rotation.x=-Math.PI/2;floor.position.y=-3.1;floor.receiveShadow=true;scene.add(floor);
 function shape(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
 function extrude(s,d,b=.07){const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:b>0,bevelThickness:b,bevelSize:b,bevelSegments:4,curveSegments:24,steps:1});g.translate(0,0,-d/2);g.computeVertexNormals();return g;}
 function mesh(g,m,parent,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;if(parent)parent.add(o);return o;}
 function box(w,h,d,m,parent,x=0,y=0,z=0,r=.15){return mesh(extrude(shape(w,h,Math.min(r,w/2-.01,h/2-.01)),d,.025),m,parent,x,y,z);}
 function ball(r,m,parent,x=0,y=0,z=0){return mesh(new THREE.SphereGeometry(r,32,24),m,parent,x,y,z);}
 function capsule(r,len,m,parent,x=0,y=0,z=0){return mesh(new THREE.CapsuleGeometry(r,Math.max(.001,len),8,20),m,parent,x,y,z);}
 function cyl(r1,r2,h,m,parent,x=0,y=0,z=0){return mesh(new THREE.CylinderGeometry(r1,r2,h,40,1),m,parent,x,y,z);}
 function tube(points,r,m,parent){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const o=mesh(new THREE.TubeGeometry(curve,70,r,10,false),m,parent);o.userData.curve=curve;return o;}
 function frame(w,h,r,thick,d,m,parent){const s=shape(w,h,r);s.holes.push(shape(w-thick*2,h-thick*2,Math.max(.07,r-thick)));return mesh(extrude(s,d,.06),m,parent);}
 function label(text,color,bg,w=256,h=96){const el=document.createElement('canvas');el.width=w;el.height=h;const c=el.getContext('2d');if(bg){c.fillStyle=bg;c.fillRect(0,0,w,h);}c.fillStyle=color;c.font='500 38px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(text,w/2,h/2,w-22);const tx=new THREE.CanvasTexture(el);tx.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:tx,transparent:!bg,side:THREE.DoubleSide});}
 function tag(text,w,parent,x,y,z,color='#281D35',bg='#F7F1E5'){return mesh(new THREE.PlaneGeometry(w,w*.375),label(text,color,bg),parent,x,y,z);}
 function hand(skin,sleeve,index=false){const g=new THREE.Group();
  const palm=box(.82,1.08,.20,skin,g,0,0,0,.25);palm.rotation.z=-.035;
  const heel=ball(.28,skin,g,.18,-.29,-.015);heel.scale.set(.95,1.08,.42);
  const lengths=[.82,.94,.88,.66],fingers=[];
  for(let i=0;i<4;i++){const base=new THREE.Group();base.position.set(-.285+i*.185,.46-(i===3?.06:0),0);g.add(base);base.rotation.z=(i-1.5)*-.035;
   const L=lengths[i],seg1=capsule(.075,L*.4-.12,skin,base,0,L*.2,0);seg1.scale.z=.85;
   const joint=new THREE.Group();joint.position.y=L*.4;base.add(joint);
   const seg2=capsule(.069,L*.35-.12,skin,joint,0,L*.175,0);seg2.scale.z=.84;
   const end=new THREE.Group();end.position.y=L*.35;joint.add(end);
   const tip=capsule(.063,L*.25-.10,skin,end,0,L*.125,0);tip.scale.z=.8;
   const nail=ball(.043,M.rose,end,0,L*.21,.047);nail.scale.set(.76,1.23,.10);
   fingers.push({base,joint,end});
  }
  const thumbBase=new THREE.Group();thumbBase.position.set(-.39,-.1,.025);thumbBase.rotation.z=-.71;g.add(thumbBase);
  capsule(.105,.3,skin,thumbBase,0,.16,0);const thumbJoint=new THREE.Group();thumbJoint.position.y=.36;thumbBase.add(thumbJoint);capsule(.09,.22,skin,thumbJoint,0,.14,0);thumbJoint.rotation.x=.5;
  const wrist=capsule(.27,.48,skin,g,0,-.73,-.01);wrist.scale.z=.57;
  const cuff=box(.72,.38,.42,sleeve,g,0,-1.1,-.02,.10);
  const arm=capsule(.31,2.3,sleeve,g,0,-2.44,-.03);arm.scale.z=.72;
  // Subtle knuckle relief, restrained and proportional to an adult hand.
  for(let i=0;i<4;i++){const knuckle=ball(.087,skin,g,-.285+i*.185,.45,.045);knuckle.scale.set(.92,1,.4);}
  g.userData.fingers=fingers;g.userData.thumb=thumbJoint;
  g.userData.curl=(amount)=>fingers.forEach((f,i)=>{const a=amount*(i===1?.78:1);f.base.rotation.x=a*.32;f.joint.rotation.x=a*.9;f.end.rotation.x=a*.7;});
  g.userData.curl(index?.72:1.12);return g;
 }
 // The game object: a tactile instrument with an open architectural bezel.
 const game=new THREE.Group();world.add(game);
 const gameBase=box(4.8,3.5,.33,M.ink,game,0,0,0,.42);gameBase.rotation.x=-Math.PI/2;
 const gameDeck=box(4.38,3.08,.17,M.cream,game,0,.35,0,.45);gameDeck.rotation.x=-Math.PI/2;
 const gameLip=frame(4.68,3.36,.48,.055,.055,M.metal,game);gameLip.rotation.x=-Math.PI/2;gameLip.position.y=.49;
 const stick=new THREE.Group();stick.position.set(-.9,.53,.05);game.add(stick);
 cyl(.49,.56,.07,M.ink,stick,0,0,0);cyl(.24,.33,.15,M.metal,stick,0,.12,0);cyl(.061,.061,.64,M.metal,stick,0,.5,0);const stickBall=ball(.29,M.ink,stick,0,.88,0);ball(.065,M.lime,stick,0,1.16,.025);
 for(let i=0;i<3;i++){const button=cyl(.27,.29,.1,i===1?M.cream:M.ink,game,.75+i*.44,.59,.5-i*.48);button.name='game-button-'+i;}
 for(let i=0;i<5;i++){const groove=box(.52,.045,.016,M.ink,game,-1.48+i*.12,.46,-1.13,.02);groove.rotation.x=-Math.PI/2;}
 for(let i=0;i<8;i++){const dot=cyl(.025,.025,.01,M.purple,game,1.55+(i%2)*.14,.45,-1.2+Math.floor(i/2)*.15);}
 const gameLabel=tag('PLAY / 01',1.22,game,.3,.465,1.1);gameLabel.rotation.x=-Math.PI/2;
 // Cubic game pieces look manufactured, with layered faces and real sockets.
 function die(color){const g=new THREE.Group();box(.82,.82,.82,color,g,0,0,0,.19);for(let i=0;i<4;i++){const d=ball(.085,M.ink,g,i%2?-.2:.2,i>1?-.2:.2,.435);d.scale.z=.26;}return g;}
 const dice=[];for(let i=0;i<5;i++){const d=die(i%2?M.cream:M.lime);world.add(d);dice.push(d);}
 const handA=hand(M.skin,M.ink,true);world.add(handA);
 // The art object is a shadow-bearing relief on a woven cream canvas.
 const art=new THREE.Group();world.add(art);
 const artBack=box(3.75,4.2,.2,M.ink,art,0,0,0,.28);
 const artCanvas=box(3.45,3.9,.09,M.cream,art,0,0,.16,.16);
 const artRim=frame(3.88,4.33,.24,.055,.12,M.metal,art);artRim.position.z=.02;
 for(let i=0;i<29;i++){const line=box(3.28,.008,.005,M.white,art,0,-1.76+i*.128,.216,.002);line.material=M.white;}
 const artwork=new THREE.Group();artwork.position.z=.25;art.add(artwork);
 const paint1=tube([[-1.23,-1.25,.05],[-1.13,.1,.08],[-.55,1.18,.1],[.15,1.22,.1],[.26,.58,.09],[-.12,-.1,.12],[.63,-.32,.13],[1.17,.24,.05]],.18,M.purple,artwork);
 const paint2=tube([[-1.08,.85,.25],[-.37,.47,.2],[.45,.36,.21],[.87,1.26,.08]],.085,M.ink,artwork);
 const artBlob=ball(.72,M.rose,artwork,.55,-.86,.08);artBlob.scale.set(1,.87,.17);
 const artOrb=ball(.18,M.lime,artwork,.64,.58,.14);artOrb.scale.z=.4;
 const changedStroke=tube([[-1.35,-.4,.31],[-.62,-.63,.36],[.25,-.08,.3],[.99,1.37,.12]],.065,M.ink,artwork);
 for(let i=0;i<6;i++){const petal=ball(.13,M.ink,artwork,-.85+Math.cos(i*Math.PI/3)*.27,-.83+Math.sin(i*Math.PI/3)*.27,.27);petal.scale.z=.3;}
 for(let i=0;i<7;i++){box(.16,.16,.015,i%2?M.cream:M.purple,art,1.43,-1.63+i*.16,.222,.015);}
 const clips=[];for(const x of [-1.2,1.2]){const clip=box(.4,.43,.19,M.metal,art,x,2.02,.09,.06);clips.push(clip);}
 const artLabel=tag('MAKE / 02',1.17,art,.45,-1.65,.232,'#281D35','#F7F1E5');
 // A folding narrative ribbon, with three miniature scenes carried on its skin.
 const story=new THREE.Group();world.add(story);const storyPanels=[];
 for(let i=0;i<3;i++){
  const p=new THREE.Group();p.position.x=(i-1)*1.98;story.add(p);storyPanels.push(p);
  box(2.06,2.9,.025,M.cream,p,0,0,0,.035);box(1.78,2.57,.01,M.cream,p,0,0,.042,.01);
  for(let j=0;j<7;j++){box(.09,.08,.014,M.ink,p,-.74+j*.245,1.22,.116,.018);box(.09,.08,.014,M.ink,p,-.74+j*.245,-1.22,.116,.018);}
  const pic=new THREE.Group();pic.position.z=.13;p.add(pic);p.userData.pic=pic;
  const sun=ball(.31,i===1?M.clay:M.purple,pic,.35,.65,.08);sun.scale.z=.22;
  const ground=box(1.38,.33,.06,i===1?M.purple:M.lime,pic,0,-.68,.06,.09);
  if(i===0){ball(.2,M.ink,pic,-.26,.19,.12);const body=capsule(.2,.34,M.rose,pic,-.26,-.27,.11);body.scale.z=.33;const arm=tube([[-.35,-.18,.18],[-.66,.09,.18],[-.59,.45,.16]],.07,M.ink,pic);}
  if(i===1){for(let k=0;k<5;k++){const petal=ball(.3,k%2?M.purple:M.rose,pic,Math.cos(k*1.256)*.34,Math.sin(k*1.256)*.34,.2);petal.scale.set(.55,1,.28);petal.rotation.z=k*1.256;}ball(.15,M.lime,pic,0,0,.36);}
  if(i===2){box(.45,.5,.12,M.purple,pic,-.3,-.24,.08,.06);box(.45,.82,.12,M.rose,pic,.22,-.08,.08,.06);ball(.22,M.ink,pic,-.3,.32,.12);const arch=frame(.8,.62,.25,.13,.06,M.purple,pic);arch.position.set(.23,.5,.13);}
 }
 // Physical hinges, deliberately visible at the folds.
 for(const x of [-.99,.99]){const hinge=cyl(.045,.045,2.53,M.metal,story,x,0,0);}
 const handB=hand(M.clay,M.purple,false);world.add(handB);
 // Architecture appears only when the three disciplines become a common show.
 const gallery=new THREE.Group();world.add(gallery);
 const plinth=box(9.0,5.3,.26,M.cream,gallery,0,-2.36,.1,.68);plinth.rotation.x=-Math.PI/2;
 const bottom=box(9.08,5.38,.12,M.ink,gallery,0,-2.57,.1,.62);bottom.rotation.x=-Math.PI/2;
 const portal=frame(8.05,5.35,.65,.20,.27,M.ink,gallery);portal.position.set(0,.5,-1.67);
 const portalRim=frame(8.1,5.4,.66,.036,.03,M.purple,gallery);portalRim.position.set(0,.5,-1.42);
 for(let i=0;i<3;i++){const step=box(2.1,1.03,.18,M.cream,gallery,1.1,-2.38-i*.15,2.7+i*.52,.14);step.rotation.x=-Math.PI/2;}
 const stageLabel=tag('CREATIVE PLAYGROUND',2.0,gallery,0,-2.18,2.79,'#281D35','#E6E0D7');stageLabel.visible=false;
 const scaffold=new THREE.Group();gallery.add(scaffold);for(const x of [-3.12,3.12]){const rod=cyl(.035,.035,4.7,M.metal,scaffold,x,.18,-1.15);}
 // Small, individual participants. Their arms reach toward the shared exhibits.
 function person(style){const g=new THREE.Group();const shirt=style?M.lime:M.purple,skin=style?M.clay:M.skin,pants=style?M.ink:M.rose;
  const torso=capsule(.34,.52,shirt,g,0,.15,0);torso.scale.z=.72;
  const head=ball(.29,skin,g,0,.98,.035);head.scale.set(.87,1.08,.9);
  if(style){const hat=ball(.305,M.lime,g,0,1.1,.015);hat.scale.y=.57;const brim=box(.66,.13,.54,M.lime,g,0,1.05,.15,.08);}
  else{for(let i=0;i<7;i++){ball(.12,M.ink,g,Math.cos(i*.83)*.2,1.12+Math.sin(i*.83)*.075,Math.sin(i*.91)*.15-.07);}}
  for(const x of [-.11,.11]){const eye=ball(.027,M.ink,g,x,.98,.272);eye.scale.z=.4;}
  const nose=ball(.045,skin,g,0,.915,.292);nose.scale.y=1.2;
  for(const x of [-.18,.18]){const leg=capsule(.14,.62,pants,g,x,-.65,0);const shoe=box(.36,.23,.61,M.cream,g,x,-1.17,.14,.11);}
  const arms=[];for(const sign of [-1,1]){const ag=new THREE.Group();ag.position.set(sign*.26,.34,0);g.add(ag);const upper=capsule(.13,.44,shirt,ag,0,-.26,0);const fore=capsule(.1,.4,skin,ag,0,-.72,0);ball(.13,skin,ag,0,-1.0,.03);ag.rotation.z=sign*.2;arms.push(ag);}
  g.userData.arms=arms;return g;
 }
 const personA=person(0),personB=person(1);world.add(personA,personB);
 // AI is a hand-sized shared material token, not a hub or the centerpiece.
 const ai=new THREE.Group();world.add(ai);box(.54,.5,.18,M.purple,ai,0,0,0,.11);tag('AI',.41,ai,0,0,.106,'#CCFF00',null);
 for(let i=0;i<4;i++){box(.07,.08,.08,M.metal,ai,-.2+i*.135,.29,0,.012);box(.07,.08,.08,M.metal,ai,-.2+i*.135,-.29,0,.012);}
 const brush=new THREE.Group();world.add(brush);const handle=cyl(.047,.047,2.8,M.purple,brush,0,0,0);const ferrule=cyl(.082,.067,.33,M.metal,brush,0,1.53,0);const bristles=capsule(.082,.35,M.clay,brush,0,1.85,0);bristles.scale.z=.65;
 // Small fabricated tokens form a brief dense visual passage, never a particle field.
 const tiles=[];for(let i=0;i<14;i++){const g=new THREE.Group();box(.52,.65,.17,i%3===0?M.purple:i%3===1?M.lime:M.rose,g,0,0,0,.16);if(i%2===0){const hole=ball(.12,M.cream,g,0,0,.115);hole.scale.z=.23;}else{box(.32,.08,.025,M.ink,g,0,0,.11,.025);}world.add(g);tiles.push(g);}

 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
 const ease=(t,a,b)=>smooth((t-a)/(b-a));
 const mix=(a,b,t)=>a+(b-a)*t;
 function pose(o,p){o.position.set(p[0],p[1],p[2]);o.rotation.set(p[3]||0,p[4]||0,p[5]||0);const s=p[6]===undefined?1:p[6];o.scale.setScalar(Math.max(.0001,s));o.visible=s>.0005;}
 function poses(o,a,b,t){pose(o,a.map((v,i)=>mix(v,b[i],t)));}
 const drawState={time:0};
 function draw(t){
  mobile=root.clientWidth<=620;
  const spread=ease(t,1.8,3.3), artFocus=ease(t,3.25,4.25), second=ease(t,5.25,6.65), assemble=ease(t,7.3,9.75), final=ease(t,10.4,12.15);
  const held=Math.min(t,12.5), bob=Math.sin(held*1.9)*.07*(1-final);
  // Camera: close tactile hook -> elevated worktable -> artwork macro -> wider gallery.
  let cp=[6.7,6.4,10.1],target=[0,.1,0];
  cp=cp.map((v,i)=>mix(v,[5.2,5.2,12.8][i],spread));
  cp=cp.map((v,i)=>mix(v,[3.4,3.4,12.1][i],artFocus));
  cp=cp.map((v,i)=>mix(v,[6.8,5.0,13.8][i],assemble));
  target=[mix(0,-.1,artFocus),mix(.2,-.12,assemble),0];
  if(mobile){cp=[mix(3.7,5.5,assemble),mix(5.8,5.4,assemble),mix(12.2,17.7,assemble)];target=[0,mix(.15,.05,assemble),0];}
  camera.position.set(...cp);camera.lookAt(...target);
  world.position.set(mobile?0:mix(0,2.05,final),mobile?mix(0,-.76,final):mix(0,.05,final),0);
  world.rotation.y=mix(-.12,-.27,assemble)+Math.sin(held*.5)*.025*(1-final);
  // Macro interaction: fingertip contacts the joystick and the whole deck recoils.
  const press=Math.sin(clamp((t-.48)/.82)*Math.PI);
  pose(game,[mix(0,-2.55,spread),mix(-.48,-.65,spread),mix(.4,.25,spread),mix(.06,.2,spread),mix(-.16,-.52,spread),mix(-.03,-.13,spread),mix(1.22,.75,spread)]);
  game.position.y-=press*.13;game.scale.y*=1-press*.055;stick.rotation.z=-press*.19;
  poses(handA,[1.0,3.47,1.1,-.14,.24,2.33,1.32],[4.6,4.0,2,-.1,.3,2.4,.78],spread);
  handA.position.y-=press*.32;handA.visible=t<3.75;
  // Objects are suspended at different depths and arrive on distinct paths.
  const artStart=[-5.5,.55,-2.0,.12,.8,-.35,.2],artWide=[.25,.82,-.6,-.05,-.36,.10,.98];
  poses(art,artStart,artWide,spread);art.position.y+=bob;
  const artHero=[-1.7,.68,.35,-.03,-.12,-.12,1.27];
  poses(art,[...art.position.toArray(),...art.rotation.toArray().slice(0,3),art.scale.x],artHero,artFocus*(1-assemble));
  const artFinal=mobile?[-1.4,.36,-.81,-.06,.24,.05,.76]:[-1.85,.55,-.72,-.06,.24,.05,.76];
  poses(art,[...art.position.toArray(),...art.rotation.toArray().slice(0,3),art.scale.x],artFinal,assemble);
  changedStroke.scale.setScalar(.001+second*.999);artOrb.position.y=.58+Math.sin(held*2.2)*.06*(1-final);
  // Story frames fold, curl and spread rather than behaving like independent cards.
  poses(story,[6,-1.3,-2,.2,-.9,-.4,.1],[2.3,.28,1.1,.02,-.45,.18,.88],spread);
  const storyPull=[2.16,.46,.9,-.08,-.30,-.29,1.08];
  poses(story,[...story.position.toArray(),...story.rotation.toArray().slice(0,3),story.scale.x],storyPull,second*(1-assemble));
  const storyFinal=mobile?[1.15,.13,.1,.08,-.2,-.06,.56]:[2.26,.52,-.12,.08,-.25,-.12,.67];
  poses(story,[...story.position.toArray(),...story.rotation.toArray().slice(0,3),story.scale.x],storyFinal,assemble);
  storyPanels.forEach((p,i)=>{p.rotation.y=(i-1)*(mix(.62,.18,second)+Math.sin(held*1.3)*.04*(1-final));p.position.z=Math.abs(i-1)*mix(.38,.10,second);});
  // A different person's hand edits the story and leaves a new stroke on the art.
  const handIn=ease(t,4.8,5.65),handOut=ease(t,7.1,8.15);
  pose(handB,[mix(7.6,3.45,handIn),mix(4,1.7,handIn),1.9,-.05,-.5,1.77,1.02*(1-handOut)]);
  handB.position.x-=second*.45;handB.position.y+=Math.sin(held*2.0)*.07*(1-handOut);handB.visible=t>4.65&&t<8.2;
  poses(brush,[-3.4,2.4,2.1,.16,-.16,-.9,.2],[-1.52,.65,1.0,.1,-.22,-.73,.94],handIn);
  brush.scale.multiplyScalar(1-handOut);brush.visible=t>4.8&&t<8.2;
  // Arcade resolves as a low shared exhibit, not an isolated hero box.
  const gFinal=mobile?[-.15,-1.42,1.15,.02,-.06,0,.61]:[-.15,-1.39,1.03,.02,-.06,0,.62];
  poses(game,[...game.position.toArray(),...game.rotation.toArray().slice(0,3),game.scale.x],gFinal,assemble);
  pose(gallery,[0,mix(-5.0,0,assemble),0,0,0,0,assemble]);
  pose(personA,[-3.21,mix(-4.7,-.98,assemble),1.18,0,.38,0,.95*assemble]);
  pose(personB,[3.19,mix(-4.5,-.98,assemble),1.48,0,-.45,0,.95*assemble]);
  personA.userData.arms[1].rotation.z=-1.18*assemble;personA.userData.arms[1].rotation.x=-.32*assemble;
  personB.userData.arms[0].rotation.z=1.27*assemble;personB.userData.arms[0].rotation.x=-.36*assemble;
  pose(ai,[mix(-.1,.10,assemble),mix(.0,-.33,assemble)+bob,mix(1.55,1.82,assemble),.07,Math.sin(held)*.12*(1-final),-.13,.85*(.4+second*.6)]);
  dice.forEach((d,i)=>{const a=i*1.34+.2;const phase=ease(t,1.68+i*.065,2.85+i*.07);const settled=ease(t,7.15,9.2);
   const start=[Math.cos(a)*1.8,-.05,Math.sin(a)*1.2,0,i*.3,0,.45];
   const flying=[Math.cos(a)*5.4,1.0+Math.sin(a)*1.8,Math.sin(a)*2.6,.2+i*.3,.5+i*.7,-.2+i*.24,.82];
   poses(d,start,flying,phase);const finalDie=[-2.7+i*.65,-1.91,1.9,0,i*.5,0,.42];poses(d,[...d.position.toArray(),...d.rotation.toArray().slice(0,3),d.scale.x],finalDie,settled);d.visible=t>1.4;});
  tiles.forEach((o,i)=>{const a=i*.74+.25;const alive=ease(t,2.0+i*.025,2.8+i*.025)*(1-ease(t,4.5,5.5));pose(o,[Math.cos(a)*(4.3+i%3*.45),Math.sin(a)*2.2+.3,Math.sin(i*1.4)*2.0,i*.35,i*.32,held*.32+i*.4,alive*.58]);});
  // Lettering stays secondary to the sculptural world and disappears for the poster.
  const chapter=t<2.4?0:t<5.1?1:t<7.6?2:3;
  document.getElementById('chapter-number').textContent=['01','02','03','04'][chapter];
  document.getElementById('chapter-label').innerHTML=['손끝에서<br>시작되는 창작','서로 다른<br>상상이 펼쳐지고','다른 사람의 손이<br>새로운 이야기를 더하면','함께 만드는<br>하나의 창작 무대'][chapter];
  renderer.render(scene,camera);
 }
 function resize(){const w=root.clientWidth||1440,h=root.clientHeight||900;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();draw(drawState.time);}
 const tl=gsap.timeline({paused:true});
 tl.to(drawState,{time:15,duration:15,ease:'none',onUpdate:()=>draw(drawState.time)},0);
 tl.to(['.folio','.chapter-note'],{autoAlpha:0,duration:.4},10.35);
 tl.to('.poster-copy',{autoAlpha:1,y:0,duration:.75,ease:'power3.out'},11.1);
 tl.from('.poster-copy',{y:24,duration:.75,ease:'power3.out'},11.1);
 tl.to('.progress',{scaleX:1,duration:15,ease:'none'},0);
 window.playgroundTimeline=tl;window.playground={timeline:tl,duration:15,draw,resize};
 window.__timelines=window.__timelines||{};window.__timelines.playground=tl;
 resize();window.addEventListener('resize',resize);
})();
