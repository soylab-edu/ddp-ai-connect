/* HUMAN → AI → HUMAN. A fixed camera, real swept channel meshes, one marble.
   Geometry and all visible poses are pure functions of authored time.
   The host owns the nine-second GSAP timeline; this module owns no clock. */
(function(){
  'use strict';
  let renderer,scene,camera,mount,stage,human,ai,marble,marbleShadow;
  let lastTime=0,viewWidth=1600,viewHeight=640,disposed=false;
  let approach,aiRoute,returnRoute,humanRoute;
  let bridgeMaterial,returnMaterial,aiMaterial,ghosts=[];
  const trackedGeometry=new Set(),trackedMaterials=new Set();
  const V=(x,y,z=0)=>new THREE.Vector3(x,y,z);
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
  const lerp=(a,b,t)=>a+(b-a)*t;
  const START={x:-7.05,y:1.48,z:.105};
  const HUMAN_WIDTH=14.30;
  const DOT_COLOR=0xccff00;

  function material(options){const m=new THREE.MeshStandardMaterial(options);trackedMaterials.add(m);return m;}
  function roundedPath(points,radius=.18){
    const path=new THREE.CurvePath(),pts=points.map(p=>V(...p));
    let cursor=pts[0].clone();
    for(let i=1;i<pts.length-1;i++){
      const p=pts[i],before=pts[i-1],after=pts[i+1];
      const r=Math.min(radius,p.distanceTo(before)*.35,p.distanceTo(after)*.35);
      const a=p.clone().add(before.clone().sub(p).normalize().multiplyScalar(r));
      const b=p.clone().add(after.clone().sub(p).normalize().multiplyScalar(r));
      if(cursor.distanceTo(a)>.0001)path.add(new THREE.LineCurve3(cursor,a));
      path.add(new THREE.QuadraticBezierCurve3(a,p.clone(),b));cursor=b;
    }
    path.add(new THREE.LineCurve3(cursor,pts[pts.length-1]));
    path.arcLengthDivisions=300;return path;
  }
  function cubic(p0,p1,p2,p3){return new THREE.CubicBezierCurve3(V(...p0),V(...p1),V(...p2),V(...p3));}
  function joined(curves){const p=new THREE.CurvePath();curves.forEach(c=>p.add(c));p.arcLengthDivisions=400;return p;}

  // Closed cross-section: matte outside, rounded pale lips and a shaded concave
  // channel. This is actual depth in a BufferGeometry, not a line or SVG texture.
  function channelGeometry(curve,width=.17,depth=.15){
    const profile=[
      [-.50,.43],[-.57,.29],[-.57,-.27],[-.43,-.46],
      [.43,-.46],[.57,-.27],[.57,.29],[.50,.43],
      [.40,.41],[.34,.20],[.24,-.06],[0,-.18],
      [-.24,-.06],[-.34,.20],[-.40,.41]
    ];
    const shades=[.94,.78,.60,.57,.57,.60,.78,.98,.92,.70,.55,.49,.55,.70,.92];
    const n=Math.max(12,Math.ceil(curve.getLength()*22)),m=profile.length;
    const pos=[],color=[],indices=[];
    for(let i=0;i<=n;i++){
      const u=i/n,p=curve.getPointAt(u),t=curve.getTangentAt(clamp(u,.00001,.99999)).normalize();
      const side=V(-t.y,t.x,0).normalize();
      for(let j=0;j<m;j++){
        const q=p.clone().addScaledVector(side,profile[j][0]*width);q.z+=profile[j][1]*depth;
        pos.push(q.x,q.y,q.z);const c=shades[j];color.push(c,c*.997,c*.97);
      }
    }
    for(let i=0;i<n;i++)for(let j=0;j<m;j++){
      const k=(j+1)%m,a=i*m+j,b=(i+1)*m+j,c=(i+1)*m+k,d=i*m+k;
      indices.push(a,b,d,b,c,d);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('color',new THREE.Float32BufferAttribute(color,3));g.setIndex(indices);g.computeVertexNormals();g.computeBoundingSphere();trackedGeometry.add(g);return g;
  }
  function rail(curve,parent,mat,width=.17,caps=true){
    const mesh=new THREE.Mesh(channelGeometry(curve,width,.15),mat);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);
    if(caps){
      const capG=new THREE.SphereGeometry(width*.52,16,10);trackedGeometry.add(capG);
      // Sphere caps have no vertex-color attribute; use their own ceramic
      // material so their rounded tips do not inherit a black default color.
      if(!mat.userData.capMaterial){
        const capM=mat.clone();capM.vertexColors=false;capM.color.multiplyScalar(.94);
        mat.userData.capMaterial=capM;trackedMaterials.add(capM);
      }
      for(const u of [0,1]){
        const cap=new THREE.Mesh(capG,mat.userData.capMaterial);cap.position.copy(curve.getPointAt(u));cap.scale.z=.72;cap.castShadow=true;parent.add(cap);
      }
    }
    return mesh;
  }
  function addLetter(letter,x,parent,mat,scale=1){
    const group=new THREE.Group();group.position.x=x;group.scale.setScalar(scale);parent.add(group);
    const y=1.48;
    const line=pts=>rail(roundedPath(pts),group,mat);
    if(letter==='H'){
      line([[-1.10,y],[-1.10,-y]]);line([[1.10,y],[1.10,-y]]);line([[-1.10,0],[1.10,0]]);
    }else if(letter==='U'){
      const p=joined([
        new THREE.LineCurve3(V(-1.1,y),V(-1.1,-.57)),
        cubic([-1.1,-.57],[-1.1,-1.13],[-.71,-y],[0,-y]),
        cubic([0,-y],[.71,-y],[1.1,-1.13],[1.1,-.57]),
        new THREE.LineCurve3(V(1.1,-.57),V(1.1,y))
      ]);rail(p,group,mat);
    }else if(letter==='M'){
      line([[-1.17,-y],[-1.17,y],[0,-.02],[1.17,y],[1.17,-y]]);
    }else if(letter==='A'){
      line([[-1.12,-y],[0,y],[1.12,-y]]);line([[-.69,-.34],[.69,-.34]]);
    }else if(letter==='N'){
      line([[-1.1,-y],[-1.1,y],[1.1,-y],[1.1,y]]);
    }else if(letter==='I'){
      line([[0,-y],[0,y]]);line([[-.40,y],[.40,y]]);line([[-.40,-y],[.40,-y]]);
    }
    return group;
  }
  function buildScene(){
    stage=new THREE.Group();scene.add(stage);
    const ceramic=material({color:0xe0e2dc,roughness:.61,metalness:.03,vertexColors:true,side:THREE.DoubleSide});
    human=new THREE.Group();stage.add(human);
    [['H',-5.95],['U',-2.99],['M',0],['A',3.02],['N',5.99]].forEach(([letter,x])=>addLetter(letter,x,human,ceramic));

    aiMaterial=material({color:0xb7a7da,roughness:.64,metalness:.02,vertexColors:true,side:THREE.DoubleSide});
    ai=new THREE.Group();ai.position.set(5.26,-2.63,0);stage.add(ai);
    addLetter('A',-.37,ai,aiMaterial,.32);addLetter('I',.53,ai,aiMaterial,.32);
    const aLeft=V(5.26-.37-1.12*.32,-2.63-1.48*.32);
    const aPeak=V(5.26-.37,-2.63+1.48*.32);
    const aRight=V(5.26-.37+1.12*.32,-2.63-1.48*.32);
    const iBottom=V(5.26+.53,-2.63-1.48*.32),iTop=V(5.26+.53,-2.63+1.48*.32);

    humanRoute=roundedPath([[START.x,START.y],[START.x,0],[-4.85,0],[-4.85,-1.48]],.10);
    approach=cubic([-4.85,-1.48],[-4.85,-3.32],[2.5,-3.85],[aLeft.x,aLeft.y]);
    aiRoute=joined([
      roundedPath([[aLeft.x,aLeft.y],[aPeak.x,aPeak.y],[aRight.x,aRight.y]],.058),
      cubic([aRight.x,aRight.y],[aRight.x+.18,aRight.y-.23],[iBottom.x-.15,iBottom.y-.23],[iBottom.x,iBottom.y]),
      new THREE.LineCurve3(iBottom,iTop)
    ]);
    returnRoute=cubic([iTop.x,iTop.y],[9.15,3.75],[-7.05,4.03],[START.x,START.y]);
    bridgeMaterial=material({color:0x66686a,roughness:.72,metalness:0,transparent:true,opacity:.28,vertexColors:true,side:THREE.DoubleSide,depthWrite:false});
    returnMaterial=material({color:0x786893,roughness:.72,metalness:0,transparent:true,opacity:.17,vertexColors:true,side:THREE.DoubleSide,depthWrite:false});
    rail(approach,stage,bridgeMaterial,.065,false);rail(returnRoute,stage,returnMaterial,.052,false);
    const aiConnector=material({color:0x55515d,roughness:.8,metalness:0,transparent:true,opacity:.10,vertexColors:true,side:THREE.DoubleSide,depthWrite:false});
    rail(aiRoute.curves[1],stage,aiConnector,.048,false);

    // A single, continuously identifiable satin lime marble.
    const marbleG=new THREE.SphereGeometry(.112,32,20);trackedGeometry.add(marbleG);
    const marbleM=material({color:DOT_COLOR,roughness:.28,metalness:.04});
    marble=new THREE.Mesh(marbleG,marbleM);marble.castShadow=true;stage.add(marble);
    const shadowG=new THREE.CircleGeometry(.15,28);trackedGeometry.add(shadowG);
    const shadowM=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.42,depthWrite:false});trackedMaterials.add(shadowM);
    marbleShadow=new THREE.Mesh(shadowG,shadowM);marbleShadow.position.z=.083;stage.add(marbleShadow);

    // Return emphasis uses the same real rail geometry, compressed once.
    for(let i=0;i<3;i++){
      const g=human.clone(true),m=new THREE.MeshBasicMaterial({color:i===1?0x8e6ac4:0xd5d7d1,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});trackedMaterials.add(m);
      g.traverse(o=>{if(o.isMesh){o.material=m;o.castShadow=false;o.receiveShadow=false;}});
      g.position.z=-.08-i*.06;g.visible=false;stage.add(g);ghosts.push({group:g,material:m,index:i});
    }
    const ambient=new THREE.HemisphereLight(0xffffff,0x444249,1.10);scene.add(ambient);
    const key=new THREE.DirectionalLight(0xffffff,2.25);key.position.set(-6,8,14);key.castShadow=true;
    key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-12;key.shadow.camera.right=12;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;key.shadow.bias=-.0004;key.shadow.normalBias=.015;key.shadow.radius=3;scene.add(key);
    const fill=new THREE.DirectionalLight(0xdbe0f0,.48);fill.position.set(9,-2,8);scene.add(fill);
    const floorG=new THREE.PlaneGeometry(50,30);trackedGeometry.add(floorG);
    const floorM=new THREE.ShadowMaterial({opacity:.22});trackedMaterials.add(floorM);
    const floor=new THREE.Mesh(floorG,floorM);floor.position.z=-.18;floor.receiveShadow=true;stage.add(floor);
  }
  function pointOn(curve,u){const p=curve.getPointAt(clamp(u));p.z+=.105;return p;}
  function ballAt(t){
    if(t<1.5)return V(START.x,START.y,START.z);
    if(t<2.55)return pointOn(humanRoute,smooth((t-1.5)/1.05));
    if(t<3.6)return pointOn(approach,smooth((t-2.55)/1.05));
    if(t<4.5)return pointOn(aiRoute,smooth((t-3.6)/.9));
    if(t<6)return pointOn(returnRoute,smooth((t-4.5)/1.5));
    if(t<6.4){const q=(t-6)/.4;return V(START.x,START.y,START.z+Math.sin(q*Math.PI*2)*Math.exp(-q*4)*.16);}
    if(t<7)return V(START.x,START.y,START.z);
    const q=(t-7)%2;return V(START.x,START.y-.14*(1-Math.cos(q*Math.PI)),START.z);
  }
  function seek(time){
    lastTime=Math.max(0,Number(time)||0);if(!renderer||disposed)return;
    const p=ballAt(lastTime);marble.position.copy(p);marble.rotation.set(lastTime*1.8,lastTime*.75,0);
    marbleShadow.position.set(p.x+.018,p.y-.019,.081);
    const transit=smooth((lastTime-2.45)/.25)*(1-smooth((lastTime-6.05)/.3));
    bridgeMaterial.opacity=.24+.15*transit;returnMaterial.opacity=.12+.15*transit;
    const aiPass=smooth((lastTime-3.55)/.16)*(1-smooth((lastTime-4.5)/.22));
    aiMaterial.color.setRGB(lerp(.69,.87,aiPass),lerp(.59,.80,aiPass),lerp(.83,.98,aiPass));
    for(const ghost of ghosts){
      const q=clamp((lastTime-6-ghost.index*.035)/.34),active=lastTime>=6&&lastTime<6.4;
      ghost.group.visible=active;const s=lerp(1.065+ghost.index*.032,1,smooth(q));ghost.group.scale.setScalar(s);
      ghost.material.opacity=active?Math.sin(q*Math.PI)*(.17-ghost.index*.027):0;
    }
    renderer.render(scene,camera);
  }
  function resize(width,height){
    if(!renderer||disposed)return;
    viewWidth=Math.max(1,Number(width)||mount.clientWidth||1600);viewHeight=Math.max(1,Number(height)||mount.clientHeight||640);
    const mobile=viewWidth<=620,wordPixels=mobile?viewWidth*.86:viewWidth*.447;
    const ppu=wordPixels/HUMAN_WIDTH,halfW=viewWidth/ppu/2,halfH=viewHeight/ppu/2;
    camera.left=-halfW;camera.right=halfW;camera.top=halfH;camera.bottom=-halfH;camera.updateProjectionMatrix();
    const centerY=mobile?viewHeight*.514:viewHeight*.484375;
    stage.position.y=(viewHeight/2-centerY)/ppu;
    // Keep mobile AI below HUMAN with the same letter geometry.
    const mobileSpread=mobile?1.24:1;stage.scale.y=mobileSpread;
    const minDpr=document.body.classList.contains('render')?2:1;
    renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio||1,minDpr),3));renderer.setSize(viewWidth,viewHeight,false);seek(lastTime);
  }
  function init(container){
    if(renderer)dispose();disposed=false;mount=container;
    if(!mount)throw new Error('HumanScene.init requires a container');
    const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');canvas.setAttribute('data-layout-allow-overflow','true');canvas.style.cssText='display:block;width:100%;height:100%';mount.appendChild(canvas);
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setClearColor(0x090909,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-16,16,6.4,-6.4,.1,100);camera.position.set(0,4.0,40);camera.lookAt(0,0,0);
    buildScene();resize(mount.clientWidth||1600,mount.clientHeight||640);return window.HumanScene;
  }
  function dispose(){
    if(renderer){renderer.dispose();renderer.domElement.remove();}
    trackedGeometry.forEach(g=>g.dispose());trackedMaterials.forEach(m=>m.dispose());trackedGeometry.clear();trackedMaterials.clear();
    renderer=null;scene=null;camera=null;stage=null;ghosts=[];disposed=true;
  }
  window.HumanScene={init,resize,seek,dispose};
})();
