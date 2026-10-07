(function(){
const canvas=document.getElementById('rig'),gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
const vs='attribute vec2 aPos;attribute vec2 aUV;varying vec2 uv;uniform vec2 resolution;void main(){uv=aUV;gl_Position=vec4(aPos.x/resolution.x*2.-1.,1.-aPos.y/resolution.y*2.,0.,1.);}';
const fs='precision mediump float;varying vec2 uv;uniform sampler2D image;void main(){gl_FragColor=texture2D(image,uv);}';
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);gl.useProgram(program);gl.uniform2f(gl.getUniformLocation(program,'resolution'),canvas.width,canvas.height);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
const posLoc=gl.getAttribLocation(program,'aPos'),uvLoc=gl.getAttribLocation(program,'aUV');gl.enableVertexAttribArray(posLoc);gl.enableVertexAttribArray(uvLoc);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
function rotate(p,c,a){const co=Math.cos(a),si=Math.sin(a),x=p.x-c.x,y=p.y-c.y;return{x:c.x+x*co-y*si,y:c.y+x*si+y*co};}
function mix(a,b,t){return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
function boneMap(p,a,b,c,d){const angle=Math.atan2(d.y-c.y,d.x-c.x)-Math.atan2(b.y-a.y,b.x-a.x);const q=rotate(p,a,angle);return{x:q.x-a.x+c.x,y:q.y-a.y+c.y};}
function ik(hip,knee,ankle,target,bob){const h={x:hip.x,y:hip.y+bob},l1=Math.hypot(knee.x-hip.x,knee.y-hip.y),l2=Math.hypot(ankle.x-knee.x,ankle.y-knee.y);let dx=target.x-h.x,dy=target.y-h.y,d=Math.hypot(dx,dy);const max=l1+l2-.1;if(d>max){const stretch=(d-max)*.48;/* restrained stretch distributes over both segments */return{hip:h,knee:{x:(h.x+target.x)/2+stretch*.2,y:(h.y+target.y)/2},ankle:target};}d=Math.max(.1,d);const a=(l1*l1-l2*l2+d*d)/(2*d),hh=Math.sqrt(Math.max(0,l1*l1-a*a)),ux=dx/d,uy=dy/d;return{hip:h,knee:{x:h.x+ux*a+uy*hh,y:h.y+uy*a-ux*hh},ankle:target};}
const actors=[];let current=0;
function soles(img,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(img,0,0,w,h);const p=x.getImageData(0,0,w,h).data;let left=0,right=0;for(let yy=Math.floor(h*.82);yy<h;yy++)for(let xx=0;xx<w;xx++)if(p[(yy*w+xx)*4+3]>100){if(xx<w*.5)left=Math.max(left,yy);else right=Math.max(right,yy);}return{left,right};}
function actor(img,w,h,x,y,scale,kind){const nx=32,ny=76,base=[],uv=[],indices=[];for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){base.push({x:i/nx*w,y:j/ny*h});uv.push(i/nx,j/ny);}for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const k=j*(nx+1)+i;indices.push(k,k+1,k+nx+1,k+1,k+nx+2,k+nx+1);}const uvbuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,uvbuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(uv),gl.STATIC_DRAW);const posbuf=gl.createBuffer(),idx=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idx);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);actors.push({w,h,x,y,scale,kind,base,uvbuf,posbuf,idx,tex,count:indices.length,soles:soles(img,w,h)});render(current);}
function walkFoot(t,shift,stride){const p=((t/.9+shift)%1+1)%1;if(p<.5)return{offset:-p*stride,lift:0,roll:0};const q=(p-.5)*2,e=q*q*(3-2*q);return{offset:-p*stride+stride*e,lift:54*Math.sin(q*Math.PI),roll:-.20*Math.sin(q*Math.PI)};}
function mapper(a,t){const W=a.w,H=a.h;if(a.kind==='listener'){const nod= t>2.7&&t<3.95?Math.sin((t-2.7)/1.25*Math.PI*2)*.12*Math.sin((t-2.7)/1.25*Math.PI):0;return p=>{const q=rotate(p,{x:W*.47,y:H*.235},nod);return mix(p,q,1-smooth(H*.17,H*.28,p.y));};}
 const walk=Math.min(t,1.8),adv=walk/.9*112,phase=walk/.9*Math.PI*2,bob=t<1.8?-7*Math.abs(Math.sin(phase)):-7*(1-smooth(1.8,2.02,t));
 const hL={x:W*.37,y:H*.555},kL={x:W*.28,y:H*.742},aL={x:W*.235,y:H*.925};
 const hR={x:W*.565,y:H*.555},kR={x:W*.63,y:H*.749},aR={x:W*.755,y:H*.934};
 const fl=walkFoot(walk,0,112),fr=walkFoot(walk,.5,112);const stop=smooth(1.8,2.1,t);fr.offset*=1-stop;fr.lift+=16*Math.sin(stop*Math.PI);const L=ik(hL,kL,aL,{x:aL.x+fl.offset,y:aL.y+(H-1-a.soles.left)-fl.lift},bob),R=ik(hR,kR,aR,{x:aR.x+fr.offset,y:aR.y+(H-1-a.soles.right)-fr.lift},bob);
 const gesture=smooth(2.03,2.3,t)*(1-smooth(3.25,3.65,t)),ga=(-.26+.07*Math.sin((t-2.1)*10))*gesture;
 const head=(t>2.1&&t<3.3?-.07*Math.sin((t-2.1)/1.2*Math.PI):0);
 return p=>{let q={x:p.x,y:p.y+bob};
   if(p.y>H*.51){function limb(hip,knee,ankle,bones,roll){const u=boneMap(p,hip,knee,bones.hip,bones.knee),l=boneMap(p,knee,ankle,bones.knee,bones.ankle);let v=mix(u,l,smooth(knee.y-35,knee.y+28,p.y));const foot=rotate({x:p.x-ankle.x+bones.ankle.x,y:p.y-ankle.y+bones.ankle.y},bones.ankle,roll);return mix(v,foot,smooth(ankle.y-17,ankle.y+13,p.y));}const left=limb(hL,kL,aL,L,fl.roll),right=limb(hR,kR,aR,R,fr.roll),side=smooth(W*.465,W*.565,p.x),leg=mix(left,right,side);q=mix(q,leg,smooth(H*.51,H*.59,p.y));}
   const headWeight=1-smooth(H*.17,H*.245,p.y);q=mix(q,rotate(q,{x:W*.46,y:H*.225+bob},head),headWeight);
   const armWeight=smooth(W*.59,W*.76,p.x)*(1-smooth(H*.46,H*.53,p.y))*smooth(H*.24,H*.30,p.y);q=mix(q,rotate(q,{x:W*.665,y:H*.374+bob},ga),armWeight);
   q.x+=adv;return q;};
}
function render(t){current=t;gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);for(const a of actors){const map=mapper(a,t),pts=new Float32Array(a.base.length*2);a.base.forEach((p,i)=>{const q=map(p);pts[i*2]=a.x+(a.kind==="listener"?a.w-q.x:q.x)*a.scale;pts[i*2+1]=a.y+q.y*a.scale;});gl.bindBuffer(gl.ARRAY_BUFFER,a.posbuf);gl.bufferData(gl.ARRAY_BUFFER,pts,gl.DYNAMIC_DRAW);gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,a.uvbuf);gl.vertexAttribPointer(uvLoc,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,a.idx);gl.bindTexture(gl.TEXTURE_2D,a.tex);gl.drawElements(gl.TRIANGLES,a.count,gl.UNSIGNED_SHORT,0);}document.getElementById('phase').textContent=t<1.8?'WALK':t<2.1?'STOP':t<2.7?'GESTURE':'RESPONSE';}
window.ARig={load(src,w,h,x,y,scale,kind){const image=new Image();image.onload=()=>actor(image,w,h,x,y,scale,kind);image.src=src;return image;},seek:render};
})();


