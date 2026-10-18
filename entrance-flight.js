/* Imomazin: fire, flag, leap, impact and the complete original signature. */
(()=>{'use strict';
window.imoEntranceFlight=({intro,complete})=>{
const duration=4000,body=document.body,clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)},out=x=>1-Math.pow(1-clamp(x),3);
let done=false,frame=0,start=0,W=0,H=0,dpr=1,layers=null,depthLayers=null,points=[],gl=null,program=null,buffer=null;
const canvas=document.createElement('canvas'),fireCanvas=document.createElement('canvas');
for(const c of [fireCanvas,canvas]){c.className='xp-flight-canvas';c.setAttribute('aria-hidden','true');intro.prepend(c)}
canvas.dataset.layer='signature';fireCanvas.dataset.layer='fire';
const ctx=canvas.getContext('2d',{alpha:true});
const skip=document.createElement('button');skip.type='button';skip.className='xp-flight-skip';skip.textContent='SKIP INTRO ↗';intro.append(skip);
const original=document.querySelector('.xp-entry-logo');
const logo=original?.complete&&original.naturalWidth?original:new Image();
if(logo!==original)logo.src=original?.src||'/assets/imomazin-dark.png';
const style=document.createElement('style');style.textContent='.xp-flight-running::before{animation:none!important;background:transparent!important}.xp-flight-running .xp-cinema-inner,.xp-flight-running .xp-entry-orbit{opacity:0!important;animation:none!important}.xp-flight-running canvas[data-layer="fire"]{z-index:5}.xp-flight-running canvas[data-layer="signature"]{z-index:4}.xp-flight-running .xp-flight-skip{z-index:6}';document.head.append(style);
let seed=3701;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const embers=Array.from({length:innerWidth<600?450:850},()=>({x:random(),y:random(),z:random(),a:random()*Math.PI*2,s:.7+random()*2.1,speed:.5+random()}));
function makeSprite(){const s=document.createElement('canvas');s.width=s.height=64;const c=s.getContext('2d');if(!c)return null;const g=c.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,218,1)');g.addColorStop(.14,'rgba(255,219,104,.98)');g.addColorStop(.36,'rgba(255,139,26,.72)');g.addColorStop(.65,'rgba(224,52,7,.28)');g.addColorStop(1,'rgba(146,17,0,0)');c.fillStyle=g;c.fillRect(0,0,64,64);return s}
const sprite=makeSprite();
const volume=document.createElement('canvas');volume.width=160;volume.height=180;const volumeCtx=volume.getContext('2d');
const volumePixels=volumeCtx?.createImageData(160,180),noiseGrid=Float32Array.from({length:4096},()=>random());
function noise(x,y){const ix=Math.floor(x),iy=Math.floor(y);let fx=x-ix,fy=y-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);const a=((iy&63)*64),b=(((iy+1)&63)*64),c=ix&63,d=(ix+1)&63;return (noiseGrid[a+c]*(1-fx)+noiseGrid[a+d]*fx)*(1-fy)+(noiseGrid[b+c]*(1-fx)+noiseGrid[b+d]*fx)*fy}
function fireVolume(t){if(!volumeCtx||!volumePixels)return;const p=volumePixels.data;
for(let y=0;y<180;y++)for(let x=0;x<160;x++){
const u=x/159*2-1,v=1-y/179,time=t*14,n=noise(u*4+9,v*6-time)*.58+noise(u*9+31,v*13-time*1.7)*.28+noise(u*22+21,v*29-time*2.1)*.14;
const curl=Math.sin(v*10-time*.8)*.12+n*.20-.1;
const envelope=Math.max(0,1-Math.abs(u+curl)/(Math.max(.045,(1-v)*.85)));
const heat=Math.max(0,envelope*(1-v*.45)+(n-.48)*.8-v*.15),alpha=smooth((heat-.12)/.32)*smooth((1-Math.abs(u))/.13);
const i=(y*160+x)*4,core=smooth((heat-.47)/.48);p[i]=255;p[i+1]=Math.round(45+core*195);p[i+2]=Math.round(core*core*155);p[i+3]=Math.round(alpha*245);
}volumeCtx.putImageData(volumePixels,0,0)}
function pose(t,lw,lh){const flight=smooth((t-.33)/.35),land=out((t-.68)/.10),solo=1-smooth((t-.22)/.12);let dx=-lw*.42*(1-flight),dy=lh*.55*(1-flight)-Math.sin(flight*Math.PI)*Math.min(lh*.62,H*.25),rotation=-.3*(1-flight)+Math.sin(flight*Math.PI)*.32;if(t>.68){dx=0;dy=Math.sin(land*Math.PI)*lh*.025;rotation=0}return {dx,dy,rotation,solo}}
function prepareLogo(){if(layers||!logo.complete||!logo.naturalWidth)return;try{
const width=logo.naturalWidth,height=logo.naturalHeight,base=document.createElement('canvas');base.width=width;base.height=height;const c=base.getContext('2d',{willReadFrequently:true});c.drawImage(logo,0,0);const pixels=c.getImageData(0,0,width,height);
const names=['flag','figure','pole','left','right'];layers={};const data={};
for(const name of names){const layer=document.createElement('canvas');layer.width=width;layer.height=height;const lc=layer.getContext('2d');layers[name]=layer;data[name]={ctx:lc,pixels:lc.createImageData(width,height)}}
for(let y=0;y<height;y++)for(let x=0;x<width;x++){
const i=(y*width+x)*4,a=pixels.data[i+3];if(!a)continue;
const nx=x/width*1672,ny=y/height*941,r=pixels.data[i],g=pixels.data[i+1],b=pixels.data[i+2];
const gold=r>90&&g>65&&b<r*.84;
let name;
if(ny<250&&gold)name='flag';
else if(ny>=250&&ny<625&&gold)name='figure';
else if(ny<642||(ny<860&&Math.abs(nx-(994-ny*.467))<23))name='pole';
else name=nx<650?'left':'right';
data[name].pixels.data.set(pixels.data.subarray(i,i+4),i);
if((name==='flag'||name==='figure')&&a>160&&x%7===0&&y%7===0)points.push({x:x/width,y:y/height,part:name,a:random()*Math.PI*2,r:random(),s:.7+random()*1.5});
}
depthLayers={};for(const name of names){data[name].ctx.putImageData(data[name].pixels,0,0);const side=document.createElement('canvas');side.width=width;side.height=height;const sc=side.getContext('2d');sc.drawImage(layers[name],0,0);sc.globalCompositeOperation='source-in';sc.fillStyle='#8d6329';sc.fillRect(0,0,width,height);depthLayers[name]=side;}
}catch(_){layers=null;points=[]}}
function initFire(){try{
gl=fireCanvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'low-power'});if(!gl)return;
const vertex='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const fragment=`precision mediump float;
uniform vec2 resolution;uniform float clock;uniform float phase;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.55;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(3.7,8.2);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/resolution, q=(uv-.5)*vec2(resolution.x/resolution.y,1.);float t=clock;
float gather=1.-smoothstep(.14,.37,phase),impact=exp(-pow((phase-.69)/.042,2.));
float n=fbm(q*6.-vec2(0.,t*2.8));float heat=0.;
for(int j=0;j<3;j++){float k=float(j),x=q.x+(k-1.)*.32;float sway=sin(q.y*8.-t*4.+k*2.)*.08;
float width=.10+.07*n;float plume=exp(-pow((x+sway)/width,2.))*smoothstep(-.62,-.28,q.y)*(1.-smoothstep(-.18,.40+n*.13,q.y));heat+=plume*(.35+.8*fbm(q*15.-vec2(t,t*5.)))*gather;}
float radius=length(q),ring=exp(-pow((radius-phase*.0-.08-impact*.55)/(.018+impact*.025),2.))*impact;
heat+=ring*1.4;float a=clamp(heat*1.45,0.,.95);vec3 color=mix(vec3(.9,.055,.003),vec3(1.,.56,.07),clamp(heat,0.,1.));color=mix(color,vec3(1.,.94,.66),smoothstep(.8,1.8,heat));gl_FragColor=vec4(color,a);}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('fire shader')}return s}
const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('fire program');gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
program.resolution=gl.getUniformLocation(program,'resolution');program.clock=gl.getUniformLocation(program,'clock');program.phase=gl.getUniformLocation(program,'phase');
}catch(_){if(gl&&program)gl.deleteProgram(program);gl=null;program=null}}
initFire();prepareLogo();
function resize(){dpr=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);fireCanvas.width=Math.round(W*Math.min(dpr,1));fireCanvas.height=Math.round(H*Math.min(dpr,1));if(gl)gl.viewport(0,0,fireCanvas.width,fireCanvas.height)}
function finish(){if(done)return;done=true;cancelAnimationFrame(frame);removeEventListener('resize',resize);document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);if(gl){if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program)}style.remove();canvas.remove();fireCanvas.remove();skip.remove();body.classList.remove('xp-flight-active');['--flight-scale','--flight-lift','--flight-reveal','--flight-header-height'].forEach(p=>body.style.removeProperty(p));layers=null;depthLayers=null;points=[];complete()}
function key(e){if(e.key==='Escape'){e.preventDefault();finish()}}function visibility(){if(document.hidden)finish()}
skip.addEventListener('click',finish);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);addEventListener('resize',resize,{passive:true});resize();
body.style.setProperty('--flight-header-height',(document.querySelector('.xp-header')?.getBoundingClientRect().height||104)+'px');body.classList.add('xp-flight-active');intro.classList.add('xp-flight-running');intro.dataset.flightDuration=String(duration);intro.dataset.flightStyle='fire-flag-leap';intro.dataset.fireRenderer=gl?'webgl':'canvas';intro.setAttribute('aria-busy','true');
if(!ctx){finish();return finish}
function flame(x,y,size,alpha){if(!sprite||alpha<=0)return;ctx.globalAlpha=clamp(alpha);ctx.drawImage(sprite,x-size*.5,y-size*.5,size,size)}
function drawFire(t,lw,lh,cx,cy){
ctx.save();ctx.globalCompositeOperation='lighter';const gather=smooth((t-.025)/.27),early=1-smooth((t-.23)/.19),impact=Math.exp(-Math.pow((t-.695)/.035,2));
const available=t<.23?points.filter(p=>p.part==='flag'):points;
const moving=pose(t,lw,lh);
if(t<.34){fireVolume(t);const convergence=smooth(t/.3),fw=W*(.95-convergence*.78),fh=H*(.95-convergence*.68),fx=cx+(1-moving.solo)*moving.dx*.4,fy=H*.55+(cy-lh*.4-H*.55)*convergence;ctx.globalAlpha=early*.95;ctx.drawImage(volume,fx-fw*.5,fy-fh*.5,fw,fh);}
for(let i=0;i<embers.length;i++){const p=embers[i],pt=available.length?available[(i*17)%available.length]:null;
let targetX=cx,targetY=cy;
if(pt){const flag=pt.part==='flag',s=flag?1+moving.solo*.75:1,rotation=flag?moving.rotation*(1-moving.solo):moving.rotation,px=(pt.x-.5)*lw*s,py=(pt.y-.5)*lh*s;targetX=cx+px*Math.cos(rotation)-py*Math.sin(rotation)+(flag?moving.dx*(1-moving.solo)-lw*.13*moving.solo:moving.dx);targetY=cy+px*Math.sin(rotation)+py*Math.cos(rotation)+(flag?moving.dy*(1-moving.solo)+lh*.08*moving.solo:moving.dy);}
const spin=p.a+t*6*(1-gather),rad=(.3+p.z*.8)*Math.max(W,H)*(1-gather);
let x=targetX+Math.cos(spin)*rad,y=targetY+Math.sin(spin)*rad+(1-gather)*H*.25;
const flutter=Math.sin(t*95+p.a)*10*(1-gather);x+=flutter;y-=Math.cos(t*70+p.a)*12*(1-gather);
const size=(9+p.z*28)*(1-gather*.5),alpha=early*(.35+p.z*.5);
flame(x,y,size,alpha);
if(t<.3&&i%3===0){flame(x,y+size*.35,size*1.8,alpha*.4);}
if(t>.55){const age=clamp((t-.66)/.27),r=age*(.25+p.z)*Math.max(W,H),sx=cx+Math.cos(p.a)*r,sy=cy+lh*.36+Math.sin(p.a)*r*.65+age*age*H*.35;
const opacity=(1-smooth((t-.76)/.18))*smooth((t-.66)/.035);ctx.globalAlpha=opacity;ctx.strokeStyle=i%3?'#ffb52e':'#fff2b6';ctx.lineWidth=p.s;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-Math.cos(p.a)*(5+age*35),sy-Math.sin(p.a)*(5+age*22));ctx.stroke();if(i%5===0)flame(sx,sy,12+p.z*16,opacity*.8)}
}
if(impact>.01){const radius=lw*(.05+smooth((t-.665)/.1)*.85);ctx.globalAlpha=impact*.9;ctx.strokeStyle='#ffca65';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(cx,cy+lh*.36,radius,radius*.18,0,0,Math.PI*2);ctx.stroke();flame(cx,cy+lh*.36,lw*.65,impact*.8)}
ctx.restore();ctx.globalAlpha=1;
}
function draw(t){
prepareLogo();const fade=smooth((t-.91)/.09),zoom=out((t-.89)/.11),lw=Math.min(W*.88,940),lh=lw*941/1672,cx=W*.5,cy=H*.46;
ctx.clearRect(0,0,W,H);ctx.globalAlpha=1-fade;ctx.fillStyle='#020705';ctx.fillRect(0,0,W,H);
const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.65);bg.addColorStop(0,'rgba(20,58,39,.75)');bg.addColorStop(.6,'rgba(5,20,13,.5)');bg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;
if(gl){gl.uniform2f(program.resolution,fireCanvas.width,fireCanvas.height);gl.uniform1f(program.clock,t*3);gl.uniform1f(program.phase,t);gl.drawArrays(gl.TRIANGLES,0,6);fireCanvas.style.opacity=String(1-fade)}
ctx.save();ctx.globalAlpha=1-fade;
const impact=Math.exp(-Math.pow((t-.70)/.026,2)),shake=Math.sin(t*270)*impact*Math.min(W*.007,7);
ctx.translate(cx+shake+Math.sin(t*15)*zoom*W*.06,cy+Math.cos(t*18)*zoom*H*.045);const yaw=Math.sin(t*Math.PI*2)*.07*(1-zoom);ctx.transform(Math.cos(yaw),Math.sin(yaw)*.10,-Math.sin(yaw)*.32,1,0,0);ctx.scale(1+zoom*14,1+zoom*14);ctx.translate(-cx,-cy);
drawFire(t,lw,lh,cx,cy);
function layer(name,alpha,dx=0,dy=0,rotation=0,scale=1){if(alpha<=0||!layers)return;ctx.save();ctx.globalAlpha=clamp(alpha)*(1-fade);ctx.translate(cx+dx,cy+dy);ctx.rotate(rotation);ctx.scale(scale,scale);const thickness=Math.min(W*.009,8)*(1-smooth((t-.82)/.06));ctx.shadowColor='#000';ctx.shadowBlur=12;for(let d=thickness;d>0;d-=2)ctx.drawImage(depthLayers[name],-lw/2+d*.65,-lh/2+d,lw,lh);ctx.shadowColor='#ffb733';ctx.shadowBlur=(1-smooth((t-.71)/.15))*7;ctx.drawImage(layers[name],-lw/2,-lh/2,lw,lh);ctx.restore()}
if(layers){
const flagForm=smooth((t-.105)/.16),figureForm=smooth((t-.24)/.12),flight=smooth((t-.33)/.35),land=out((t-.68)/.10);
let dx=-lw*.42*(1-flight),dy=lh*.55*(1-flight)-Math.sin(flight*Math.PI)*Math.min(lh*.62,H*.25),rotation=-.3*(1-flight)+Math.sin(flight*Math.PI)*.32;
if(t>.68){dx=0;dy=Math.sin(land*Math.PI)*lh*.025;rotation=0}
const flagSolo=1-smooth((t-.22)/.12);
layer('flag',flagForm,dx*(1-flagSolo)+(cx-lw*.13-cx)*flagSolo,dy*(1-flagSolo)+lh*.08*flagSolo,rotation*(1-flagSolo),1+flagSolo*.75);
layer('pole',smooth((t-.23)/.12),dx,dy,rotation);
layer('figure',figureForm,dx,dy,rotation);
const letters=smooth((t-.34)/.18),separate=smooth((t-.665)/.045),settle=out((t-.735)/.105),split=separate*(1-settle)*lw*.13;
const close=(1-separate)*lw*.055;
layer('left',letters,close-split,0,-impact*.018);layer('right',letters,-close+split,0,impact*.018);
if(t>.83){const seal=smooth((t-.83)/.04);ctx.save();ctx.globalAlpha=seal*(1-fade);ctx.drawImage(logo,cx-lw/2,cy-lh/2,lw,lh);ctx.restore()}
}else if(logo.complete&&logo.naturalWidth){ctx.globalAlpha=smooth((t-.2)/.3)*(1-fade);ctx.drawImage(logo,cx-lw/2,cy-lh/2,lw,lh)}
const title=smooth((t-.78)/.08)*(1-fade);ctx.globalAlpha=title;ctx.fillStyle='#f4f2ec';ctx.font='500 '+Math.min(W*.033,22)+'px Arial';ctx.textAlign='center';ctx.fillText('D R   I M O   E N A N G',cx,cy+lh*.64);
if(t>.64&&t<.90){ctx.save();ctx.globalCompositeOperation='lighter';const depth=smooth((t-.64)/.06)*(1-smooth((t-.82)/.08));for(let i=0;i<18;i++){const p=embers[i],age=(t-.64)*p.speed,x=cx+Math.cos(p.a)*age*W*3.5,y=cy+Math.sin(p.a)*age*H*2.7;flame(x,y,20+p.z*58,depth*(.12+p.z*.3));}ctx.restore();}
ctx.restore();ctx.globalAlpha=1;
}
function tick(now){if(done)return;if(!start)start=now;const t=clamp((now-start)/duration);try{draw(t)}catch(_){finish();return}const arrival=out((t-.90)/.10),scale=.94+.06*arrival;body.style.setProperty('--flight-scale',String(scale));body.style.setProperty('--flight-lift',((1-scale)*50)+'vh');body.style.setProperty('--flight-reveal',String(arrival));if(t>=1){finish();return}frame=requestAnimationFrame(tick)}
frame=requestAnimationFrame(tick);return finish;
};
})();
