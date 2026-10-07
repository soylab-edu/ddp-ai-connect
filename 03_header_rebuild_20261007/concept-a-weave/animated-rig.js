/* Deterministic mesh skinning of complete, unmodified Open Peeps silhouettes. */
(function(global){
'use strict';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
const rotate=(p,c,a)=>{const co=Math.cos(a),si=Math.sin(a),x=p.x-c.x,y=p.y-c.y;return{x:c.x+x*co-y*si,y:c.y+x*si+y*co};};
const mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
function boneMap(p,a,b,c,d){const angle=Math.atan2(d.y-c.y,d.x-c.x)-Math.atan2(b.y-a.y,b.x-a.x),q=rotate(p,a,angle);return{x:q.x-a.x+c.x,y:q.y-a.y+c.y};}
function ik(hip,knee,ankle,target,bob){const h={x:hip.x,y:hip.y+bob},l1=Math.hypot(knee.x-hip.x,knee.y-hip.y),l2=Math.hypot(ankle.x-knee.x,ankle.y-knee.y);let dx=target.x-h.x,dy=target.y-h.y,d=Math.hypot(dx,dy);if(d>l1+l2-.1)return{hip:h,knee:{x:(h.x+target.x)/2,y:(h.y+target.y)/2},ankle:target};d=Math.max(.1,d);const a=(l1*l1-l2*l2+d*d)/(2*d),hh=Math.sqrt(Math.max(0,l1*l1-a*a)),ux=dx/d,uy=dy/d;return{hip:h,knee:{x:h.x+ux*a+uy*hh,y:h.y+uy*a-ux*hh},ankle:target};}
function walkFoot(t,shift,stride){const p=((t/.9+shift)%1+1)%1;if(p<.5)return{offset:-p*stride,lift:0,roll:0};const q=(p-.5)*2,e=q*q*(3-2*q);return{offset:-p*stride+stride*e,lift:54*Math.sin(q*Math.PI),roll:-.20*Math.sin(q*Math.PI)};}
function pulse(t,a,b,amplitude,cycles=1){const q=clamp((t-a)/(b-a));return t<a||t>b?0:Math.sin(q*Math.PI*2*cycles)*Math.sin(q*Math.PI)*amplitude;}
function mapFigure(a,t){const W=a.w,H=a.h,kind=a.kind;
  if(kind==='walker'){
    const walk=Math.min(t,1.8),adv=walk/.9*112,phase=walk/.9*Math.PI*2,bob=t<1.8?-7*Math.abs(Math.sin(phase)):-7*(1-smooth(1.8,2.02,t));
    const hL={x:W*.37,y:H*.555},kL={x:W*.28,y:H*.742},aL={x:W*.235,y:H*.925},hR={x:W*.565,y:H*.555},kR={x:W*.63,y:H*.749},aR={x:W*.755,y:H*.934};
    const fl=walkFoot(walk,0,112),fr=walkFoot(walk,.5,112),stop=smooth(1.8,2.1,t);fr.offset*=1-stop;fr.lift+=16*Math.sin(stop*Math.PI);
    const L=ik(hL,kL,aL,{x:aL.x+fl.offset,y:aL.y+(H-1-a.soles.left)-fl.lift},bob),R=ik(hR,kR,aR,{x:aR.x+fr.offset,y:aR.y+(H-1-a.soles.right)-fr.lift},bob);
    const gesture=smooth(2.03,2.3,t)*(1-smooth(3.25,3.65,t)),ga=(-.26+.07*Math.sin((t-2.1)*10))*gesture,head=t>2.1&&t<3.3?-.07*Math.sin((t-2.1)/1.2*Math.PI):0;
    return p=>{let q={x:p.x,y:p.y+bob};if(p.y>H*.51){function limb(hip,knee,ankle,bones,roll){const u=boneMap(p,hip,knee,bones.hip,bones.knee),l=boneMap(p,knee,ankle,bones.knee,bones.ankle);let v=mix(u,l,smooth(knee.y-35,knee.y+28,p.y));const foot=rotate({x:p.x-ankle.x+bones.ankle.x,y:p.y-ankle.y+bones.ankle.y},bones.ankle,roll);return mix(v,foot,smooth(ankle.y-17,ankle.y+13,p.y));}const left=limb(hL,kL,aL,L,fl.roll),right=limb(hR,kR,aR,R,fr.roll),side=smooth(W*.465,W*.565,p.x);q=mix(q,mix(left,right,side),smooth(H*.51,H*.59,p.y));}
      q=mix(q,rotate(q,{x:W*.46,y:H*.225+bob},head),1-smooth(H*.17,H*.245,p.y));
      const armWeight=smooth(W*.59,W*.76,p.x)*(1-smooth(H*.46,H*.53,p.y))*smooth(H*.24,H*.30,p.y);q=mix(q,rotate(q,{x:W*.665,y:H*.374+bob},ga),armWeight);q.x+=adv;return q;};
  }
  const seated=kind.startsWith('experience')||kind.startsWith('consult');
  let head=0,body=0,arm=0;
  if(kind==='listener')head=pulse(t,2.7,3.95,.12);
  if(kind==='talker'){head=pulse(t,2.8,3.9,.06);arm=pulse(t,3.1,3.98,.12,.5);}
  if(kind==='experience-left'){body=.048*smooth(.2,1.15,t)*(1-smooth(2.7,3.5,t));head=.12*smooth(.45,1.2,t)*(1-smooth(2.7,3.5,t));}
  if(kind==='experience-right'){body=.025*smooth(.8,1.6,t)*(1-smooth(2.85,3.5,t));head=pulse(t,1.6,3.3,.15);}
  if(kind==='consult-left'){head=pulse(t,.25,1.4,.075);arm=pulse(t,.2,1.55,-.22,.65);}
  if(kind==='consult-right')head=pulse(t,1.5,2.85,.14);
  return p=>{let q={...p};if(body)q=mix(q,rotate(q,{x:W*.42,y:H*.64},body),1-smooth(H*.53,H*.79,p.y));
    const headPivot={x:W*(kind==='consult-left'?.35:kind==='experience-left'?.35:.36),y:H*(seated?.29:.235)};
    if(!seated)headPivot.x=W*.47;
    q=mix(q,rotate(q,headPivot,head),1-smooth(H*(seated?.23:.17),H*(seated?.35:.28),p.y));
    if(arm){const pivot=kind==='consult-left'?{x:W*.58,y:H*.44}:{x:W*.63,y:H*.31};const aw=smooth(W*.51,W*.68,p.x)*(1-smooth(H*.44,H*.57,p.y))*smooth(H*.12,H*.20,p.y);q=mix(q,rotate(q,pivot,arm),aw);}return q;};
}
let canvas,gl,program,posLoc,uvLoc,inkLoc,paperLoc,resLoc,actors=[],time=0,width=1600,height=640;
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
function mount(target,figures){canvas=target;gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
  if(!gl)throw new Error('WebGL is required for the illustrated character motion.');
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
  const vs='attribute vec2 aPos;attribute vec2 aUV;varying vec2 uv;uniform vec2 resolution;void main(){uv=aUV;gl_Position=vec4(aPos.x/resolution.x*2.-1.,1.-aPos.y/resolution.y*2.,0.,1.);}';
  const fs='precision mediump float;varying vec2 uv;uniform sampler2D image;uniform vec3 ink;uniform vec3 paper;void main(){vec4 c=texture2D(image,uv);float v=(c.r+c.g+c.b)/3.;gl_FragColor=vec4(mix(ink,paper,v),c.a);}';
  program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);gl.useProgram(program);posLoc=gl.getAttribLocation(program,'aPos');uvLoc=gl.getAttribLocation(program,'aUV');inkLoc=gl.getUniformLocation(program,'ink');paperLoc=gl.getUniformLocation(program,'paper');resLoc=gl.getUniformLocation(program,'resolution');gl.enableVertexAttribArray(posLoc);gl.enableVertexAttribArray(uvLoc);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  actors=[];figures.forEach(def=>{const img=new Image();img.onload=()=>addFigure(img,def);img.src=def.src;});resize(target.clientWidth||1600,target.clientHeight||640);
}
function addFigure(img,def){const {w,h}=def,nx=32,ny=76,base=[],uv=[],indices=[];for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){base.push({x:i/nx*w,y:j/ny*h});uv.push(i/nx,j/ny);}for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const k=j*(nx+1)+i;indices.push(k,k+1,k+nx+1,k+1,k+nx+2,k+nx+1);}const uvbuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,uvbuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(uv),gl.STATIC_DRAW);const posbuf=gl.createBuffer(),idx=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idx);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
  const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,w,h);const data=ctx.getImageData(0,0,w,h).data;let left=0,right=0;for(let y=Math.floor(h*.82);y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>100){if(x<w*.5)left=Math.max(left,y);else right=Math.max(right,y);}
  actors.push({...def,base,uvbuf,posbuf,idx,tex,count:indices.length,soles:{left,right}});actors.sort((a,b)=>a.order-b.order);seek(time);
}
function resize(w,h){width=Math.max(1,Math.round(w));height=Math.max(1,Math.round(h));if(canvas){canvas.width=width;canvas.height=height;seek(time);}}
function seek(t){time=t;if(!gl)return;gl.useProgram(program);gl.viewport(0,0,width,height);gl.uniform2f(resLoc,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  let scene,local,paper,ink;if(t<4){scene='network';local=t;paper='#CCFF00';ink='#111111';}else if(t>=6.25&&t<9.85){scene='experience';local=t-6.25;paper='#7A00EE';ink='#FFFFFF';}else if(t>=12.1&&t<15){scene='consult';local=t-12.1;paper='#DF0221';ink='#FFFFFF';}else return;
  gl.uniform3fv(inkLoc,rgb(ink));gl.uniform3fv(paperLoc,rgb(paper));const mobile=width<=700,bw=mobile?390:1600,bh=mobile?760:640,s=Math.min(width/bw,height/bh),dx=(width-bw*s)/2,dy=(height-bh*s)/2;
  for(const a of actors){if(a.scene!==scene)continue;const cfg=mobile?a.mobile:a.desktop,map=mapFigure(a,local),pts=new Float32Array(a.base.length*2);a.base.forEach((p,i)=>{const q=map(p);pts[i*2]=dx+(cfg.x+(cfg.mirror?a.w-q.x:q.x)*cfg.scale)*s;pts[i*2+1]=dy+(cfg.y+q.y*cfg.scale)*s;});gl.bindBuffer(gl.ARRAY_BUFFER,a.posbuf);gl.bufferData(gl.ARRAY_BUFFER,pts,gl.DYNAMIC_DRAW);gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,a.uvbuf);gl.vertexAttribPointer(uvLoc,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,a.idx);gl.bindTexture(gl.TEXTURE_2D,a.tex);gl.drawElements(gl.TRIANGLES,a.count,gl.UNSIGNED_SHORT,0);}
}
global.AMotion={mount,seek,resize};
})(window);
