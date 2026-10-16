/* Cinematic brand reveal: gold monogram impact, fractured glass and instant homepage reveal. */
(()=>{'use strict';
window.imoEntranceFlight=({intro,complete})=>{
let done=false,frame=0,start=performance.now();
const canvas=document.createElement('canvas');canvas.className='xp-flight-canvas';canvas.setAttribute('aria-hidden','true');intro.prepend(canvas);
const ctx=canvas.getContext('2d',{alpha:true});const body=document.body;
const skip=document.createElement('button');skip.type='button';skip.className='xp-flight-skip';skip.textContent='SKIP INTRO ↗';intro.append(skip);
const logo=new Image();logo.src='/assets/imomazin-dark.png';
const style=document.createElement('style');style.textContent='.xp-flight-running::before{animation:none!important;background:#020503!important}.xp-flight-running .xp-cinema-inner,.xp-flight-running .xp-entry-orbit{opacity:0!important;animation:none!important}.xp-flight-running .xp-flight-canvas{z-index:3}';document.head.append(style);
let W,H,dpr;
function resize(){dpr=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0)}
resize();addEventListener('resize',resize,{passive:true});
function finish(){if(done)return;done=true;cancelAnimationFrame(frame);removeEventListener('resize',resize);document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);style.remove();body.classList.remove('xp-flight-active');['--flight-scale','--flight-lift','--flight-reveal','--flight-header-height'].forEach(p=>body.style.removeProperty(p));complete()}
function key(e){if(e.key==='Escape'){e.preventDefault();finish()}}function visibility(){if(document.hidden)finish()}
skip.addEventListener('click',finish);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);
body.style.setProperty('--flight-header-height',(document.querySelector('.xp-header')?.getBoundingClientRect().height||104)+'px');body.classList.add('xp-flight-active');intro.classList.add('xp-flight-running');intro.dataset.flightDuration='1450';intro.setAttribute('aria-busy','true');
const panels=Array.from({length:16},(_,i)=>({x:(i%4),y:Math.floor(i/4),angle:(i%2?1:-1)*(.16+(i%4)*.13),dx:(i%4-1.5)*1.2,dy:(Math.floor(i/4)-1.5)*1.1}));
function draw(t){if(!ctx)return;ctx.clearRect(0,0,W,H);const impact=Math.min(1,t/.43),explode=Math.max(0,Math.min(1,(t-.44)/.44)),e=1-Math.pow(1-explode,3),reveal=Math.max(0,(t-.76)/.24);
ctx.fillStyle='#020503';ctx.fillRect(0,0,W,H);
const g=ctx.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,Math.max(W,H)*.7);g.addColorStop(0,'rgba(29,91,55,.4)');g.addColorStop(.5,'rgba(4,20,13,.5)');g.addColorStop(1,'#010302');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
const scale=.25+impact*1.1;ctx.save();ctx.translate(W/2,H/2);ctx.scale(scale,scale);ctx.shadowColor='#d4ad55';ctx.shadowBlur=18+impact*32;
const lw=Math.min(W*.6,580),lh=lw*.56;if(logo.complete&&logo.naturalWidth)ctx.drawImage(logo,-lw/2,-lh/2,lw,lh);else{ctx.fillStyle='#e7c781';ctx.font='900 '+Math.min(72,W*.11)+'px Georgia';ctx.textAlign='center';ctx.fillText('IMOMAZIN',0,20)}ctx.restore();
if(t>.4){const flare=Math.exp(-Math.pow((t-.47)/.075,2));ctx.fillStyle='rgba(244,216,144,'+(flare*.72)+')';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(73,230,145,'+(flare*.23)+')';ctx.fillRect(0,0,W,H)}
if(explode>0){ctx.save();ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,'+Math.min(1,e*1.3)+')';ctx.fillRect(0,0,W,H);ctx.restore();
for(const p of panels){const pw=W/4+2,ph=H/4+2,x=p.x*W/4,y=p.y*H/4,tx=p.dx*W*.9*e,ty=p.dy*H*.9*e;ctx.save();ctx.translate(x+pw/2+tx,y+ph/2+ty);ctx.rotate(p.angle*e);ctx.scale(1+e*.6,1+e*.6);ctx.fillStyle='rgba(2,10,7,'+(1-e)+')';ctx.fillRect(-pw/2,-ph/2,pw,ph);ctx.strokeStyle='rgba(211,173,86,'+(1-e)*.8+')';ctx.lineWidth=2;ctx.strokeRect(-pw/2,-ph/2,pw,ph);ctx.restore()}}
if(reveal>0){ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(245,211,132,'+Math.max(0,(1-reveal)*.14)+')';ctx.fillRect(0,0,W,H)}
}
function tick(now){if(done)return;const t=Math.min(1,(now-start)/1450);draw(t);const arrival=Math.min(1,Math.max(0,(t-.46)/.42));const scale=.16+.84*(1-Math.pow(1-arrival,3));body.style.setProperty('--flight-scale',String(scale));body.style.setProperty('--flight-lift',((1-scale)*50)+'vh');body.style.setProperty('--flight-reveal',String(Math.max(0,(t-.78)/.22)));if(t>=1){finish();return}frame=requestAnimationFrame(tick)}
frame=requestAnimationFrame(tick);return finish;
};
})();