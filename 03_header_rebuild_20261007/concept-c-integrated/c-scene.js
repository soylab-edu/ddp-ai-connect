/* Original C choreography exposed as a deterministic module. The integrated host owns its clock. */
(function(){
 let instance=null;
 function init(){
 if(instance)return instance;
 'use strict';
 const root=document.getElementById('convergence'),canvas=document.getElementById('world');
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x111111);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,3));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 const camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(0,.1,18);camera.lookAt(0,0,0);
 const envScene=new THREE.Scene();envScene.background=new THREE.Color(0x080808);
 function panel(w,h,x,y,z,color,intensity=1){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,toneMapped:false}));m.position.set(x,y,z);m.lookAt(0,0,0);m.material.color.multiplyScalar(intensity);envScene.add(m);}
 panel(12,4,-5,6,7,0xffffff,3);panel(5,10,8,1,4,0xffffff,2);panel(8,3,0,-5,6,0xffffff,1.4);panel(3,8,-8,1,-3,0x7A00EE,2.5);panel(2,8,9,0,-2,0xCCFF00,2.3);panel(12,.72,-1,-2.25,10,0xffffff,1.8);
 const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(envScene,.025).texture;
 scene.add(new THREE.HemisphereLight(0xffffff,0x191020,1.0));
 const key=new THREE.DirectionalLight(0xffffff,3.5);key.position.set(-6,8,10);scene.add(key);
 const fill=new THREE.DirectionalLight(0xffffff,1.7);fill.position.set(8,-2,6);scene.add(fill);
 function geometry(){const p=new THREE.ShapePath();for(const c of window.logoGlyph.commands){if(c[0]==='M')p.moveTo(c[1],c[2]);else if(c[0]==='L')p.lineTo(c[1],c[2]);else if(c[0]==='Q')p.quadraticCurveTo(c[1],c[2],c[3],c[4]);else if(c[0]==='C')p.bezierCurveTo(c[1],c[2],c[3],c[4],c[5],c[6]);else if(c[0]==='Z')p.currentPath.closePath();}const g=new THREE.ExtrudeGeometry(p.toShapes(false),{depth:.29,bevelEnabled:true,bevelThickness:.03,bevelSize:.019,bevelSegments:4,curveSegments:18,steps:1});g.computeBoundingBox();const c=g.boundingBox.getCenter(new THREE.Vector3());g.translate(-c.x,-c.y,-c.z);g.computeVertexNormals();return g;}
 const logoMaterial=new THREE.MeshPhysicalMaterial({color:0xDF0221,metalness:.66,roughness:.22,clearcoat:1,clearcoatRoughness:.16,envMapIntensity:1.1});
 const logo=new THREE.Mesh(geometry(),logoMaterial);const logoGroup=new THREE.Group();logoGroup.add(logo);scene.add(logoGroup);
 const PASTELS=['#FFC4CD','#C9B9FF','#B4EDD7','#BFD7FF','#F1EDB3'];
 const N=540,points=new Float32Array(N*3),colors=new Float32Array(N*3),sizes=new Float32Array(N);const initial=[];
 const phi=Math.PI*(3-Math.sqrt(5));
 for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),a=i*phi;const p=new THREE.Vector3(Math.cos(a)*r*1.95,y*1.95,Math.sin(a)*r*1.95);initial.push(p);p.toArray(points,i*3);const c=new THREE.Color(PASTELS[i%PASTELS.length]);c.toArray(colors,i*3);sizes[i]=2.2+(i%7)*.24;}
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(points,3));pg.setAttribute('color',new THREE.BufferAttribute(colors,3));pg.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
 const pointMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexColors:true,uniforms:{opacity:{value:1},uPixelRatio:{value:renderer.getPixelRatio()}},vertexShader:'attribute float aSize;uniform float uPixelRatio;varying vec3 vColor;void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=aSize*uPixelRatio*clamp(18.0/-mv.z,.7,1.6);gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform float opacity;varying vec3 vColor;void main(){float d=length(gl_PointCoord-vec2(.5));float a=1.0-smoothstep(.35,.49,d);if(a<.01)discard;gl_FragColor=vec4(vColor,a*opacity);#include <tonemapping_fragment>\n#include <colorspace_fragment>}',toneMapped:false});
 // Shader preprocessor directives must begin on their own line.
 pointMaterial.fragmentShader=pointMaterial.fragmentShader.replace(';#include',';\n#include');
 const globe=new THREE.Points(pg,pointMaterial);scene.add(globe);
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)},mix=(a,b,q)=>a+(b-a)*q;
 const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
 const front=[];const positions=logo.geometry.getAttribute('position'),normals=logo.geometry.getAttribute('normal');
 for(let i=0;i<positions.count;i+=3){if(normals.getZ(i)>.95&&positions.getZ(i)>.14){const v=new THREE.Vector3();for(let j=0;j<3;j++)v.add(new THREE.Vector3().fromBufferAttribute(positions,i+j));v.multiplyScalar(1/3);front.push(v);}}
 const sources=initial.map((p,i)=>({p,i})).filter(x=>x.p.x>.25&&x.p.z>-.8&&Math.abs(x.p.y)<1).map(x=>x.i);
 const IMPACTS=36,shots=[];const earlyTargets=[[-1.75,.12],[-1.0,.24],[-.33,.05],[.93,.04],[1.6,.12]];
 for(let i=0;i<IMPACTS;i++){
  const launch=i<5?1.4+i*.72:4.76+1.5*Math.sqrt((i-4)/31);const duration=i<5?1.03:mix(.70,.26,(i-5)/30);let target;
  if(i<5){const aim=earlyTargets[i];target=front.reduce((best,p)=>p.distanceToSquared(new THREE.Vector3(aim[0],aim[1],.145))<best.distanceToSquared(new THREE.Vector3(aim[0],aim[1],.145))?p:best,front[0]).clone();}
  else target=front[Math.floor(hash(i*9+3)*front.length)].clone();
  target.z=.177;shots.push({launch,duration,hit:launch+duration,target,color:new THREE.Color(PASTELS[i%5]),source:sources[(i*13)%sources.length],arc:.8+hash(i+2)*.7});
 }
 const paintUniforms={uTime:{value:0},uBlack:{value:0},uHits:{value:shots.map(s=>new THREE.Vector4(s.target.x,s.target.y,s.target.z,s.hit))},uPaint:{value:shots.map(s=>s.color)}};
 logoMaterial.onBeforeCompile=shader=>{
  Object.assign(shader.uniforms,paintUniforms);
  shader.vertexShader='varying vec3 vLocal;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvLocal=position;');
  shader.fragmentShader=`varying vec3 vLocal;uniform float uTime;uniform float uBlack;uniform vec4 uHits[${IMPACTS}];uniform vec3 uPaint[${IMPACTS}];
float paintNoise(vec2 p){return sin(p.x*14.1+sin(p.y*11.7)*1.6)*sin(p.y*17.3+p.x*3.1);}
`+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
for(int i=0;i<${IMPACTS};i++){
 float age=uTime-uHits[i].w;
 if(age>0.0){
  vec3 d=vLocal-uHits[i].xyz;
  float spread=.035+.37*(1.0-exp(-age*2.2));
  float irregular=paintNoise(vLocal.xy+float(i)*.91)*.034+sin(atan(d.y,d.x)*7.0+float(i))*.022;
  float distanceOnSurface=length(d.xy*vec2(1.0,1.10))+abs(d.z)*.18+irregular;
  float wet=1.0-smoothstep(spread-.038,spread+.012,distanceOnSurface);
  wet*=smoothstep(0.0,.09,age);
  diffuseColor.rgb=mix(diffuseColor.rgb,uPaint[i],wet*.98);
 }
}
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.007),uBlack);
`);
 };
 const flightPositions=new Float32Array(IMPACTS*3),flightColors=new Float32Array(IMPACTS*3),flightSizes=new Float32Array(IMPACTS);
 shots.forEach((s,i)=>s.color.toArray(flightColors,i*3));
 const flightGeo=new THREE.BufferGeometry();flightGeo.setAttribute('position',new THREE.BufferAttribute(flightPositions,3));flightGeo.setAttribute('color',new THREE.BufferAttribute(flightColors,3));flightGeo.setAttribute('aSize',new THREE.BufferAttribute(flightSizes,1));
 const flights=new THREE.Points(flightGeo,pointMaterial.clone());flights.frustumCulled=false;scene.add(flights);
 const fractureGeometry=logo.geometry.clone(),basePositions=fractureGeometry.attributes.position.array.slice(),baseNormals=fractureGeometry.attributes.normal.array.slice(),chunkMap=new Map();
 for(let i=0;i<basePositions.length;i+=9){const cx=(basePositions[i]+basePositions[i+3]+basePositions[i+6])/3,cy=(basePositions[i+1]+basePositions[i+4]+basePositions[i+7])/3,cz=(basePositions[i+2]+basePositions[i+5]+basePositions[i+8])/3;const id=[Math.floor(cx/.25),Math.floor(cy/.23),Math.floor(cz/.15)].join(':');if(!chunkMap.has(id))chunkMap.set(id,{indices:[],center:new THREE.Vector3(),count:0});const chunk=chunkMap.get(id);chunk.indices.push(i,i+3,i+6);chunk.center.add(new THREE.Vector3(cx,cy,cz));chunk.count++;}
 const chunks=[...chunkMap.values()].map((c,i)=>{c.center.multiplyScalar(1/c.count);c.direction=new THREE.Vector3(c.center.x*.45+(hash(i*2)-.5)*.6,c.center.y*2.5+(hash(i*3)-.5)*.9,.3+hash(i*5)*1.6).normalize();c.speed=2.2+hash(i*7)*3.3;c.spin=new THREE.Vector3(hash(i*11)-.5,hash(i*13)-.5,hash(i*17)-.5).normalize();c.turn=2.3+hash(i*19)*4;return c;});
 const fractureMaterial=new THREE.MeshPhysicalMaterial({color:0x09090C,metalness:.55,roughness:.22,clearcoat:1,clearcoatRoughness:.16,envMapIntensity:2.5,transparent:true,side:THREE.DoubleSide});
 const fracture=new THREE.Mesh(fractureGeometry,fractureMaterial);fracture.frustumCulled=false;const fractureGroup=new THREE.Group();fractureGroup.add(fracture);scene.add(fractureGroup);
 const v3=new THREE.Vector3(),rot=new THREE.Euler(),quat=new THREE.Quaternion(),matrix=new THREE.Matrix4();
 const depthKeys=[[8.5,1],[8.67,3.25],[8.88,.18],[9.07,2.40],[9.28,.65],[9.49,1],[9.64,1],[9.82,.45]];
 function depth(t){for(let i=1;i<depthKeys.length;i++){if(t<=depthKeys[i][0]){const a=depthKeys[i-1],b=depthKeys[i];return mix(a[1],b[1],smooth((t-a[0])/(b[0]-a[0])));}}return .45}
 function pose(t,mobile){const center=smooth((t-6.8)/1.7),squeeze=1-.27*smooth((t-9.64)/.18);return{center,position:new THREE.Vector3(mix(mobile?.65:4.0,0,center),mix(mobile?-1.3:-.53,mobile?0:-.45,center),t>=8.5?depth(t):mix(0,1,center)),rotation:new THREE.Euler(.10+Math.sin(t*.75)*.025,mix(-Math.PI/4+.035*Math.sin(t*.65),-.08,center),mix(-.13,0,center)),scale:mix(mobile?1.30:2.4,mobile?1.32:3.5,center)*squeeze}};
 function logoMatrix(t,mobile){const p=pose(t,mobile);return new THREE.Matrix4().compose(p.position,new THREE.Quaternion().setFromEuler(p.rotation),new THREE.Vector3().setScalar(p.scale))}
 function sourcePosition(s,mobile){return initial[s.source].clone().applyEuler(new THREE.Euler(.08,s.launch*.09,.05)).add(new THREE.Vector3(mobile?-1.0:-6.2,mobile?2.4:-.65,0))}
 let lastTime=0;
 if(window.CWave)window.CWave.mount(document.getElementById('typewave'));
 function draw(t,options={}){
  lastTime=t;
  const mobile=root.clientWidth<=620;
  globe.visible=t<7.0;logoGroup.visible=t<9.82;globe.position.set(mobile?-1.0:-6.2,mobile?2.4:-.65,0);globe.rotation.set(.08,t*.09,.05);pointMaterial.uniforms.opacity.value=1-smooth((t-6.2)/.8);
  const p=pose(t,mobile);logoGroup.position.copy(p.position);logoGroup.rotation.copy(p.rotation);logoGroup.scale.setScalar(p.scale);
  paintUniforms.uTime.value=t;paintUniforms.uBlack.value=p.center;logoMaterial.envMapIntensity=mix(1.1,2.5,p.center);logoMaterial.metalness=mix(.66,.55,p.center);
  for(let i=0;i<N;i++)sizes[i]=2.2+(i%7)*.24;
  shots.forEach((s,i)=>{const u=(t-s.launch)/s.duration;const active=u>=0&&u<1;flightSizes[i]=active?7.5:0;if(t>=s.launch)sizes[s.source]=0;
   if(active){const a=sourcePosition(s,mobile),b=s.target.clone().applyMatrix4(logoMatrix(s.hit,mobile));v3.copy(a).lerp(b,u);v3.y+=s.arc*4*u*(1-u);v3.z+=Math.sin(u*Math.PI)*.6;v3.toArray(flightPositions,i*3);}else{flightPositions[i*3]=0;flightPositions[i*3+1]=-1000;flightPositions[i*3+2]=0;}
  });pg.attributes.aSize.needsUpdate=true;flightGeo.attributes.position.needsUpdate=true;flightGeo.attributes.aSize.needsUpdate=true;flights.visible=t<6.9;
  fractureGroup.visible=t>=9.82&&t<10.65;
  if(fractureGroup.visible){
   const b=pose(9.82,mobile),dt=t-9.82;fractureGroup.position.copy(b.position);fractureGroup.rotation.copy(b.rotation);fractureGroup.scale.setScalar(b.scale);fractureMaterial.opacity=1-smooth((dt-.43)/.4);
   const pa=fractureGeometry.attributes.position.array,na=fractureGeometry.attributes.normal.array;
   for(const c of chunks){quat.setFromAxisAngle(c.spin,c.turn*dt);const travel=c.direction.clone().multiplyScalar(c.speed*dt*(1+dt*.7));
    for(const index of c.indices){v3.fromArray(basePositions,index).sub(c.center).applyQuaternion(quat).add(c.center).add(travel);v3.toArray(pa,index);v3.fromArray(baseNormals,index).applyQuaternion(quat).toArray(na,index);}
   }fractureGeometry.attributes.position.needsUpdate=true;fractureGeometry.attributes.normal.needsUpdate=true;
  }
  const mark=document.querySelector('.brand-mark'),markIn=smooth((t-9.92)/.08),markOut=1-smooth((t-10.42)/.18);mark.style.opacity=String(markIn*markOut);mark.style.transform=`scale(${mix(.72,1.04,markIn)-.04*smooth((t-10.05)/.35)})`;
  document.getElementById('poster').style.opacity=String(smooth((t-13.5)/.6));document.getElementById('poster').style.visibility=t>=13.5?'visible':'hidden';
  const metaOut=1-smooth((t-10.1)/.35);document.querySelector('.intro-meta').style.opacity=String(metaOut);
  document.querySelectorAll('.intro-line').forEach((el,i)=>{const q=smooth((t-.10-i*.15)/.62);el.style.opacity=String(q);el.style.transform=q===1?'none':`translateY(${(1-q)*16}px)`;el.style.willChange=q===1?'auto':'transform, opacity';});
  if(window.CWave)window.CWave.seek(t);
  camera.position.set(0,.1,mobile?20.2:14.5);camera.lookAt(0,0,0);if(options.render!==false)renderer.render(scene,camera);
 }
 function resize(){const w=root.clientWidth||1600,h=root.clientHeight||640;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,3));renderer.setSize(w,h,false);pointMaterial.uniforms.uPixelRatio.value=renderer.getPixelRatio();flights.material.uniforms.uPixelRatio.value=renderer.getPixelRatio();camera.aspect=w/h;camera.updateProjectionMatrix();if(window.CWave)window.CWave.resize(w,h);draw(lastTime);}
 function dispose(){
  for(const s of [scene,envScene])s.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const a=Array.isArray(o.material)?o.material:[o.material];a.forEach(m=>m.dispose());}});
  if(scene.environment)scene.environment.dispose();pmrem.dispose();renderer.dispose();instance=null;
 }
 instance={draw,resize,dispose};resize();return instance;
 }
 window.CScene={init,draw:(t,options)=>init().draw(t,options),resize:()=>init().resize(),dispose:()=>{if(instance)instance.dispose();}};
})();
