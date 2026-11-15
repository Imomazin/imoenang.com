/* THE ASCENT — eight-second Imomazin cinematic entrance. Existing logo asset remains unchanged. */
(()=>{'use strict';
window.imoEntranceFlight=({intro,complete})=>{
 const DURATION=8000,canvas=document.createElement('canvas'),ctx=canvas.getContext('2d'),skip=document.createElement('button');
 canvas.className='xp-ascent-canvas';canvas.setAttribute('aria-hidden','true');intro.prepend(canvas);
 skip.type='button';skip.className='xp-ascent-skip';skip.textContent='SKIP INTRO ↗';intro.append(skip);
 const style=document.createElement('style');style.textContent=`
 .xp-cinema.xp-ascent-active{background:#030c0a!important;isolation:isolate}
 .xp-ascent-active .xp-cinema-inner,.xp-ascent-active .xp-entry-orbit{opacity:0!important;pointer-events:none!important}
 .xp-ascent-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:4;display:block}
 .xp-ascent-skip{position:absolute;right:clamp(18px,4vw,60px);top:clamp(18px,4vw,45px);z-index:7;background:rgba(5,19,15,.65);color:#e7d5ae;border:1px solid rgba(195,163,106,.5);padding:12px 18px;letter-spacing:.15em;font-size:11px;min-height:44px}
 .xp-ascent-skip:focus-visible{outline:2px solid #e7c88a;outline-offset:4px}
 `;document.head.append(style);intro.classList.add('xp-ascent-active');
 const logo=new Image();logo.src='/assets/imomazin-flame.png?v=20261029';
 let w=0,h=0,dpr=1,raf=0,start=0,finished=false;
 const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 const fade=(t,a,b)=>smooth((t-a)/(b-a));
 const opacity=(t,a,b,c,d)=>fade(t,a,b)*(1-fade(t,c,d));
 function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
 function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()}
 function label(text,y,size,alpha,tracking=0){ctx.save();ctx.globalAlpha=alpha;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#e7d8bb';ctx.font=`500 ${size}px Arial,Helvetica,sans-serif`;if('letterSpacing'in ctx)ctx.letterSpacing=tracking+'px';ctx.fillText(text,w/2,y);ctx.restore()}
 function wolf(x,y,s,progress){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(-.07+Math.sin(progress*12)*.025);
  const fur='#07100f',rim='#b89c6b';ctx.shadowColor='rgba(208,174,107,.28)';ctx.shadowBlur=17;
  poly([[-52,-22],[-24,-41],[27,-44],[58,-28],[75,-15],[56,-8],[27,-18],[-18,-14],[-47,-5]],fur);
  poly([[38,-34],[51,-62],[61,-74],[69,-60],[80,-70],[82,-44],[70,-26],[56,-21]],fur);
  poly([[73,-51],[95,-43],[79,-34]],fur);
  poly([[-49,-25],[-78,-46],[-87,-38],[-65,-14]],fur);
  for(const [a,b] of [[-33,-15],[-5,14],[32,46],[52,66]])poly([[a,-15],[a+13,-14],[b+4,30],[b-4,33]],fur);
  ctx.strokeStyle=rim;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-48,-23);ctx.lineTo(-20,-40);ctx.lineTo(26,-43);ctx.lineTo(52,-31);ctx.stroke();
  ctx.fillStyle='#e7bd72';ctx.fillRect(72,-48,3,2);ctx.restore();
 }
 function draw(ms){
  const t=ms/1000;ctx.clearRect(0,0,w,h);
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#020807');bg.addColorStop(.55,'#09221c');bg.addColorStop(1,'#07120f');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  const mist=ctx.createRadialGradient(w*.55,h*.48,0,w*.55,h*.48,w*.7);mist.addColorStop(0,'rgba(34,95,73,.32)');mist.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=mist;ctx.fillRect(0,0,w,h);
  const scale=Math.max(w/1300,h/780),cx=w*.5,ground=h*.82;
  ctx.save();ctx.translate(cx,ground);ctx.scale(scale,scale);
  const drift=fade(t,0,5)*55;
  poly([[-850,70],[-530,-115],[-300,-15],[-50,-245],[240,-35],[530,-180],[900,50]],'#112820');
  poly([[-850,95],[-470,10],[-240,-100],[30,-10],[240,-215],[500,-50],[850,110]],'#0a1b17');
  const climb=fade(t,1.6,4.1),wx=-315+climb*390,wy=-115-climb*130+Math.sin(t*13)*2;
  wolf(wx,wy,.95,climb);
  if(t>3.7){ctx.globalAlpha=fade(t,3.7,4.5);poly([[30,-10],[280,-350],[550,-35],[820,-125],[900,70]],'#17352a');ctx.globalAlpha=1}
  ctx.restore();
  const mountainAlpha=1-fade(t,5.15,6.2);
  ctx.fillStyle=`rgba(3,12,10,${1-mountainAlpha})`;ctx.fillRect(0,0,w,h);
  const small=Math.max(12,Math.min(w*.019,21));
  label('THE WOLF AT THE TOP OF THE HILL',h*.17,small,opacity(t,.25,.8,2.25,2.7),2);
  label('IS NO MATCH FOR THE WOLF CLIMBING THE HILL',h*.17,Math.max(11,Math.min(w*.017,19)),opacity(t,2.3,2.75,4.9,5.3),1.2);
  const reveal=fade(t,5.4,6.35);
  if(reveal){ctx.save();ctx.globalAlpha=reveal;
   const lw=Math.min(w*.8,650),lh=lw*941/1672;
   if(logo.complete&&logo.naturalWidth){ctx.shadowColor='rgba(217,175,91,.28)';ctx.shadowBlur=22;ctx.drawImage(logo,(w-lw)/2,h*.47-lh/2,lw,lh)}
   else label('IMOMAZIN',h*.47,Math.max(35,Math.min(w*.09,100)),1,3);
   ctx.restore();
  }
  label('Never finished. Always ascending.',h*.72,Math.max(16,Math.min(w*.027,29)),opacity(t,6.1,6.65,7.65,8),1);
  const sheen=opacity(t,6.25,6.5,7.15,7.45);
  if(sheen){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=sheen*.35;const x=w*(.25+.55*fade(t,6.25,7.45));const g=ctx.createLinearGradient(x-90,0,x+90,0);g.addColorStop(0,'rgba(255,220,146,0)');g.addColorStop(.5,'rgba(255,220,146,.5)');g.addColorStop(1,'rgba(255,220,146,0)');ctx.fillStyle=g;ctx.fillRect(x-90,h*.25,180,h*.5);ctx.restore()}
 }
 function finish(natural=false){if(finished)return;finished=true;cancelAnimationFrame(raf);removeEventListener('resize',resize);skip.remove();canvas.remove();style.remove();intro.classList.remove('xp-ascent-active');complete({natural})}
 function tick(now){if(finished)return;if(!start)start=now;const ms=Math.min(DURATION,now-start);try{draw(ms)}catch(e){finish();return}if(ms>=DURATION){finish(true);return}raf=requestAnimationFrame(tick)}
 skip.addEventListener('click',()=>finish());resize();addEventListener('resize',resize,{passive:true});raf=requestAnimationFrame(tick);
 return finish;
};
})();