/* Three-second Imomazin signature reveal, inspired by the approved gold-emblem outro. */
(()=>{'use strict';
window.imoEntranceFlight=({intro,complete})=>{
let done=false,frame=0,start=performance.now(),W=0,H=0,dpr=1;
const duration=3000,body=document.body,canvas=document.createElement('canvas');
canvas.className='xp-flight-canvas';canvas.setAttribute('aria-hidden','true');intro.prepend(canvas);
const ctx=canvas.getContext('2d',{alpha:true});
const skip=document.createElement('button');skip.type='button';skip.className='xp-flight-skip';skip.textContent='SKIP INTRO ↗';intro.append(skip);
const logo=document.querySelector('.xp-entry-logo')||new Image();if(!logo.src)logo.src='/assets/imomazin-dark.png';
const style=document.createElement('style');
style.textContent='.xp-flight-running::before{animation:none!important;background:transparent!important}.xp-flight-running .xp-cinema-inner,.xp-flight-running .xp-entry-orbit{opacity:0!important;animation:none!important}.xp-flight-running .xp-flight-canvas{z-index:3}';
document.head.append(style);
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-clamp(x),3);
const particles=Array.from({length:100},(_,i)=>({a:i*2.399963,r:.08+((i*37)%97)/97*.72,z:.3+((i*19)%83)/83,s:.5+(i%4)*.35}));
function resize(){dpr=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0)}
function finish(){if(done)return;done=true;cancelAnimationFrame(frame);removeEventListener('resize',resize);document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);style.remove();canvas.remove();skip.remove();body.classList.remove('xp-flight-active');['--flight-scale','--flight-lift','--flight-reveal','--flight-header-height'].forEach(p=>body.style.removeProperty(p));complete()}
function key(e){if(e.key==='Escape'){e.preventDefault();finish()}}
function visibility(){if(document.hidden)finish()}
skip.addEventListener('click',finish);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);addEventListener('resize',resize,{passive:true});resize();
body.style.setProperty('--flight-header-height',(document.querySelector('.xp-header')?.getBoundingClientRect().height||104)+'px');body.classList.add('xp-flight-active');intro.classList.add('xp-flight-running');intro.dataset.flightDuration=String(duration);intro.dataset.flightStyle='gold-signature';intro.setAttribute('aria-busy','true');
if(!ctx){finish();return finish}
function draw(t){
const settle=ease(t/.24),launch=ease((t-.62)/.34),fade=clamp((t-.84)/.16),cx=W*.5,cy=H*.46;
ctx.clearRect(0,0,W,H);ctx.globalAlpha=1-fade;ctx.fillStyle='#030a07';ctx.fillRect(0,0,W,H);
const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.65);
glow.addColorStop(0,'rgba(24,69,49,.6)');glow.addColorStop(.6,'rgba(6,20,14,.4)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
for(const p of particles){const r=p.r*Math.min(W,H)*(1+launch*14*p.z),a=p.a+t*.08,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
ctx.strokeStyle='rgba(195,163,106,'+((.25+p.z*.5)*(1-fade))+')';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=p.s;
ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(cx+(x-cx)*(1+launch*.32),cy+(y-cy)*(1+launch*.32)-t*12);ctx.stroke();ctx.beginPath();ctx.arc(x,y,p.s,0,Math.PI*2);ctx.fill()}
const logoWidth=Math.min(W*.67,560),ratio=(logo.naturalHeight||941)/(logo.naturalWidth||1672),scale=(5.5-4.5*settle)*(1+launch*17);
ctx.save();ctx.translate(cx+Math.sin(t*Math.PI*3)*launch*W*.055,cy+Math.sin(t*Math.PI*4)*launch*H*.045);ctx.rotate(Math.sin(t*Math.PI*2)*launch*.055);ctx.scale(scale,scale);ctx.globalAlpha=(1-fade)*(1-clamp((launch-.55)/.45));
ctx.shadowColor='#c3a36a';ctx.shadowBlur=8+Math.sin(t*Math.PI)*9;
if(logo.complete&&logo.naturalWidth){ctx.save();const reveal=ease((t-.05)/.23);ctx.beginPath();ctx.rect(-logoWidth/2,-logoWidth*ratio/2,logoWidth*reveal,logoWidth*ratio);ctx.clip();ctx.drawImage(logo,-logoWidth/2,-logoWidth*ratio/2,logoWidth,logoWidth*ratio);ctx.restore()}
else{ctx.fillStyle='#c3a36a';ctx.textAlign='center';ctx.font='bold '+Math.min(W*.095,70)+'px Georgia';ctx.fillText('IMOMAZIN',0,0)}
ctx.shadowBlur=0;const title=ease((t-.25)/.2);ctx.globalAlpha*=title;ctx.fillStyle='#f4f2ec';ctx.textAlign='center';
const name='DR IMO ENANG',font=Math.min(W*.038,25),spacing=font*(.65-.42*title);ctx.font='500 '+font+'px Arial';
const widths=Array.from(name,c=>ctx.measureText(c).width),total=widths.reduce((a,b)=>a+b,0)+(name.length-1)*spacing;let x=-total/2;
for(let i=0;i<name.length;i++){ctx.fillText(name[i],x+widths[i]/2,logoWidth*ratio*.58+font*1.4);x+=widths[i]+spacing}
ctx.restore();ctx.globalAlpha=1;
}
function tick(now){if(done)return;const t=clamp((now-start)/duration);draw(t);const arrival=ease((t-.69)/.31),scale=.92+.08*arrival;body.style.setProperty('--flight-scale',String(scale));body.style.setProperty('--flight-lift',((1-scale)*50)+'vh');body.style.setProperty('--flight-reveal',String(arrival));if(t>=1){finish();return}frame=requestAnimationFrame(tick)}
frame=requestAnimationFrame(tick);return finish;
};
})();