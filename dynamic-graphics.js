/* Living geometry: one visibility-aware renderer, with native motion controls. */
(()=>{'use strict';
const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)'),scenes=[],stages=[...document.querySelectorAll('.xp-brand-cosmos')],regions={uk:[54,-2,'UNITED KINGDOM'],gulf:[25,45,'GULF REGION'],africa:[5,15,'AFRICA']};
let paused=false,frame=0,last=0,time=0,selected=0,targetRegion='uk';
const lowMotion=()=>reduce.matches||root.dataset.motion==='reduce';
const colours=()=>root.dataset.theme==='light'?{gold:'124,88,31',emerald:'0,115,88',text:'#18281f'}:{gold:'195,163,106',emerald:'34,197,147',text:'#f4f2ec'};
const colour=(rgb,alpha=1)=>'rgba('+rgb+','+alpha+')';
function rotate(p,yaw,tilt){const x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),z=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw);return[x,p[1]*Math.cos(tilt)-z*Math.sin(tilt),p[1]*Math.sin(tilt)+z*Math.cos(tilt)]}
const sphere=(lat,lon)=>{const a=lat*Math.PI/180,b=lon*Math.PI/180;return[Math.cos(a)*Math.sin(b),-Math.sin(a),Math.cos(a)*Math.cos(b)]};
function dot(ctx,x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function line(ctx,points,c,width=1){ctx.strokeStyle=c;ctx.lineWidth=width;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}
// Schematic continental silhouettes, without boundaries or territorial claims.
const land=[ [[-168,65],[-128,72],[-78,55],[-58,45],[-82,10],[-105,22],[-120,45]], [[-82,12],[-48,0],[-35,-10],[-55,-55],[-74,-25]], [[-18,35],[8,38],[33,31],[51,12],[33,-34],[15,-35],[-8,5]], [[-12,37],[-8,58],[25,72],[80,75],[175,60],[155,20],[105,-8],[78,7],[47,32]], [[112,-10],[154,-12],[150,-39],[116,-34]], [[-54,60],[-20,63],[-40,83],[-66,78]] ];
function inside(x,y,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))yes=!yes}return yes}
const landDots=[];for(let lat=-65;lat<82;lat+=4)for(let lon=-180;lon<180;lon+=4)if(land.some(p=>inside(lon,lat,p)))landDots.push(sphere(lat,lon));
function renderWorld(s,t,c){const {ctx,w,h}=s,cx=w/2,cy=h/2,R=Math.min(w,h)*.37,lon=regions[targetRegion][1],yaw=-lon*Math.PI/180+Math.sin(t*.12)*.42,tilt=.11,project=p=>{const v=rotate(p,yaw,tilt);return[cx+v[0]*R,cy+v[1]*R,v[2]]};
 const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.4);glow.addColorStop(0,colour(c.emerald,.12));glow.addColorStop(1,colour(c.emerald,0));ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 for(let lat=-60;lat<=60;lat+=20){const pts=[];for(let lon=-180;lon<=180;lon+=5)pts.push(project(sphere(lat,lon)));line(ctx,pts,colour(c.gold,.14),.65)}
 for(let lon=-180;lon<180;lon+=20){const pts=[];for(let lat=-90;lat<=90;lat+=4)pts.push(project(sphere(lat,lon)));line(ctx,pts,colour(c.emerald,.2),.65)}
 for(const p of landDots){const v=project(p);dot(ctx,v[0],v[1],v[2]>0?1.65:1,colour(v[2]>.15?c.gold:c.emerald,v[2]>0?.42+v[2]*.48:.13))}
 ctx.strokeStyle=colour(c.gold,.65);ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();ctx.save();ctx.translate(cx,cy);ctx.rotate(-.35);ctx.setLineDash([5,10]);ctx.lineDashOffset=-t*7;ctx.strokeStyle=colour(c.gold,.36);ctx.beginPath();ctx.ellipse(0,0,R*1.24,R*.36,0,0,Math.PI*2);ctx.stroke();ctx.restore();ctx.setLineDash([]);
 const values=Object.values(regions);for(let i=1;i<values.length;i++){const a=values[0],b=values[i],pts=[];for(let k=0;k<=40;k++){const u=k/40,p=sphere(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u).map(v=>v*(1+Math.sin(u*Math.PI)*.2));pts.push(project(p))}line(ctx,pts,colour(c.gold,.75),1.4);const u=(t*.09+i*.3)%1,p=pts[Math.floor(u*40)];dot(ctx,p[0],p[1],3,colour(c.gold,1))}
 Object.entries(regions).forEach(([id,v])=>{const p=project(sphere(v[0],v[1]));if(p[2]<0)return;const isActive=id===targetRegion;dot(ctx,p[0],p[1],isActive?5:3,colour(c.gold,1));ctx.strokeStyle=colour(c.gold,isActive?.8:.4);ctx.beginPath();ctx.arc(p[0],p[1],isActive?12:8,0,Math.PI*2);ctx.stroke()});
 ctx.font='600 '+Math.max(10,Math.min(13,w*.025))+'px Arial';ctx.textAlign='center';ctx.fillStyle=c.text;ctx.fillText(regions[targetRegion][2],cx,cy+R+35);
}
function renderIdeas(s,t,c){const {ctx,w,h}=s,cx=w/2,cy=h/2,R=Math.min(w,h)*.39,network=s.kind==='network',phase=t*.2,project=p=>{const v=rotate(p,phase,.55+Math.sin(t*.17)*.18);const perspective=1/(1.8-v[2]*.26);return[cx+v[0]*R*perspective*1.8,cy+v[1]*R*perspective*1.8,v[2]]};
 const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.3);glow.addColorStop(0,colour(c.emerald,.14));glow.addColorStop(1,colour(c.emerald,0));ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 for(let j=0;j<12;j++){let prev=null;for(let i=0;i<=90;i++){const u=i/90*Math.PI*2,v=j/12*Math.PI*2,r=.72+.22*Math.cos(v+u*(network?3:1));const p=project([r*Math.cos(u),r*Math.sin(u),.26*Math.sin(v+u*(network?3:1))]);const alpha=.25+(p[2]+.3)*.4;if(prev)line(ctx,[prev,p],colour(j%3?c.emerald:c.gold,alpha),.6);dot(ctx,p[0],p[1],i%9===0?1.7:1,colour(j%3?c.emerald:c.gold,.65));prev=p}}
 const N=network?10:6;for(let i=0;i<N;i++){const a=i/N*Math.PI*2-.5+t*.025,endpoint=[cx+Math.cos(a)*R*1.1,cy+Math.sin(a)*R*1.1],active=network?i===selected:i===Math.floor(t*.16)%N;line(ctx,[[cx,cy],endpoint],colour(c.gold,active?.7:.12),active?1.5:.7);const u=(t*.15+i*.13)%1;dot(ctx,cx+(endpoint[0]-cx)*u,cy+(endpoint[1]-cy)*u,active?3:1.3,colour(c.gold,active?1:.4));dot(ctx,endpoint[0],endpoint[1],active?6:3,colour(active?c.gold:c.emerald,.9));if(network){ctx.textAlign='center';ctx.font='10px Arial';ctx.fillStyle=c.text;ctx.fillText(String(i+1).padStart(2,'0'),endpoint[0],endpoint[1]+22)}}
 dot(ctx,cx,cy,5,colour(c.gold,1));ctx.strokeStyle=colour(c.gold,.7);ctx.beginPath();ctx.arc(cx,cy,20+Math.sin(t)*2,0,Math.PI*2);ctx.stroke();
}
function paint(s){if(!s.ctx||!s.w||!s.h)return;s.ctx.clearRect(0,0,s.w,s.h);const c=colours();if(s.kind==='world')renderWorld(s,time,c);else renderIdeas(s,time,c);s.el.dataset.graphicFrame=String(++s.count)}
function resize(s){const r=s.el.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);s.w=r.width;s.h=r.height;s.canvas.width=Math.round(r.width*dpr);s.canvas.height=Math.round(r.height*dpr);s.ctx?.setTransform(dpr,0,0,dpr,0,0);paint(s)}
function loop(now){frame=0;if(document.hidden||paused||lowMotion()||!scenes.some(s=>s.active))return;if(now-last>=34){time+=Math.min((now-last)/1000,.05);last=now;scenes.filter(s=>s.active).forEach(paint)}frame=requestAnimationFrame(loop)}
function run(){if(!frame&&!document.hidden&&!paused&&!lowMotion()&&scenes.some(s=>s.active)){last=performance.now();frame=requestAnimationFrame(loop)}}
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{const s=scenes.find(s=>s.el===e.target);if(s)s.active=e.isIntersecting;e.target.classList.toggle('xp-dynamic-active',e.isIntersecting)});run()},{rootMargin:'60px',threshold:0});
for(const el of document.querySelectorAll('[data-graphic]')){const canvas=el.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)continue;const s={el,canvas,ctx,kind:el.dataset.graphic,w:0,h:0,active:false,count:0};scenes.push(s);resize(s);new ResizeObserver(()=>resize(s)).observe(el);observer.observe(el)}
stages.forEach(el=>observer.observe(el));
document.querySelectorAll('.xp-motion-control').forEach(button=>button.addEventListener('click',e=>{paused=!paused;document.body.classList.toggle('xp-dynamic-paused',paused);document.querySelectorAll('.xp-motion-control').forEach(b=>{b.setAttribute('aria-pressed',String(paused));b.textContent=paused?'RESUME MOTION':'PAUSE MOTION'});if(paused){cancelAnimationFrame(frame);frame=0}else run()}));
document.querySelectorAll('[data-globe-region]').forEach(button=>button.addEventListener('click',()=>{targetRegion=button.dataset.globeRegion;document.querySelectorAll('[data-globe-region]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const s=scenes.find(s=>s.kind==='world');if(s){s.el.dataset.region=targetRegion;paint(s)}run()}));
document.querySelectorAll('.xp-topic').forEach((b,i)=>b.addEventListener('click',()=>{selected=i;const s=scenes.find(s=>s.kind==='network');if(s){s.el.dataset.selected=String(i);s.el.querySelector('[data-network-label]').textContent=b.textContent.replace('↗','').trim();paint(s)}run()}));
document.querySelector('#xp-theme')?.addEventListener('click',()=>scenes.forEach(paint));
reduce.addEventListener('change',()=>{if(lowMotion()){cancelAnimationFrame(frame);frame=0;scenes.forEach(paint)}else run()});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else run()});
})();
