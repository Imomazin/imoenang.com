/* 1.5-second cinematic 3D burst into the homepage. */
(()=>{'use strict';
window.imoEntranceFlight=({intro,complete})=>{
let ended=false,raf=0,start=performance.now();
const canvas=document.createElement('canvas');canvas.className='xp-flight-canvas';canvas.setAttribute('aria-hidden','true');intro.prepend(canvas);
const skip=document.createElement('button');skip.type='button';skip.className='xp-flight-skip';skip.textContent='SKIP INTRO ↗';intro.append(skip);
const body=document.body;let w=0,h=0,ctx=canvas.getContext('2d',{alpha:false});
function resize(){const d=Math.min(devicePixelRatio||1,1.5);w=canvas.width=Math.round(innerWidth*d);h=canvas.height=Math.round(innerHeight*d)}
resize();addEventListener('resize',resize,{passive:true});
function finish(){if(ended)return;ended=true;cancelAnimationFrame(raf);removeEventListener('resize',resize);document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);body.classList.remove('xp-flight-active');['--flight-scale','--flight-lift','--flight-reveal','--flight-header-height'].forEach(p=>body.style.removeProperty(p));complete()}
function key(e){if(e.key==='Escape'){e.preventDefault();finish()}}
function visibility(){if(document.hidden)finish()}
skip.addEventListener('click',finish);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);
body.style.setProperty('--flight-header-height',(document.querySelector('.xp-header')?.getBoundingClientRect().height||104)+'px');body.classList.add('xp-flight-active');intro.classList.add('xp-flight-running');intro.dataset.flightDuration='1500';intro.setAttribute('aria-busy','true');
const rings=Array.from({length:22},(_,i)=>({z:1+i*.29,phase:i*1.81}));
function draw(t){
 if(!ctx)return;const W=w,H=h,cx=W/2,cy=H/2;ctx.fillStyle='#010503';ctx.fillRect(0,0,W,H);
 const ease=1-Math.pow(1-t,3),zoom=.12+ease*6.8,driftX=Math.sin(t*11)*W*.014*(1-t),driftY=Math.sin(t*15)*H*.012*(1-t);
 ctx.save();ctx.translate(cx+driftX,cy+driftY);ctx.rotate(.07*Math.sin(t*8)*(1-t));
 for(let i=rings.length-1;i>=0;i--){const ring=rings[i],depth=ring.z-ease*6.9;if(depth<=.12)continue;const radius=Math.min(Math.max(W,H)*2,Math.min(W,H)*.25/depth);const glow=(1-t)*(.35+.65*Math.sin(t*30+ring.phase)**2);const gold=i%3===0;ctx.beginPath();ctx.ellipse(0,0,radius*1.65,radius,0,0,Math.PI*2);ctx.strokeStyle=gold?'rgba(232,178,74,'+Math.min(.95,glow)+')':'rgba(48,240,145,'+Math.min(.95,glow)+')';ctx.lineWidth=Math.max(1,Math.min(15,4/depth));ctx.shadowColor=gold?'#e4ae45':'#1ffb8b';ctx.shadowBlur=18+24*glow;ctx.stroke()}
 ctx.restore();
 const burst=Math.max(0,(t-.64)/.36),flash=Math.sin(Math.PI*Math.min(1,burst))**2;ctx.fillStyle='rgba(245,212,137,'+(flash*.43)+')';ctx.fillRect(0,0,W,H);
}
function tick(now){if(ended)return;const t=Math.min(1,(now-start)/1500);draw(t);const arrival=Math.min(1,Math.max(0,(t-.3)/.7));const scale=.07+Math.pow(arrival,2.5)*.93;body.style.setProperty('--flight-scale',String(scale));body.style.setProperty('--flight-lift',((1-scale)*50)+'vh');body.style.setProperty('--flight-reveal',String(Math.max(0,(t-.72)/.28)));if(t>=1){finish();return}raf=requestAnimationFrame(tick)}
raf=requestAnimationFrame(tick);return finish;
};
})();