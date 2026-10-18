/* Imomazin — 2.55-second cinematic descent, ascent, ignition and hero hold. Original artwork intact. */
(()=>{'use strict';
window.imoEntranceFlight=({intro,complete})=>{
 const duration=2550,body=document.body,root=document.documentElement;
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
 const out=x=>1-Math.pow(1-clamp(x),3);
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:true});
 const skip=document.createElement('button');
 skip.type='button';skip.className='xp-flight-skip';skip.textContent='SKIP INTRO ↗';
 canvas.className='xp-flight-canvas';canvas.setAttribute('aria-hidden','true');
 canvas.dataset.layer='signature';intro.prepend(canvas);intro.append(skip);
 const img=document.querySelector('.xp-entry-logo');
 const logo=img?.complete&&img.naturalWidth?img:new Image();
 if(logo!==img)logo.src=img?.currentSrc||img?.src||'/assets/imomazin-dark.png';
 const style=document.createElement('style');
 style.textContent='.xp-flight-running::before{animation:none!important;background:transparent!important}.xp-flight-running .xp-cinema-inner,.xp-flight-running .xp-entry-orbit{opacity:0!important;animation:none!important}.xp-flight-running canvas[data-layer="signature"]{z-index:4}.xp-flight-running .xp-flight-skip{z-index:6}';
 document.head.append(style);
 let done=false,frame=0,start=0,W=0,H=0,dpr=1,art=null;
 const nativeW=1672,nativeH=941;
 const anchor={x:850,y:438};
 const gold=(r,g,b,a)=>a>0&&r>85&&g>50&&r>g*.95&&b<g*.91;
 const partCanvas=()=>{const c=document.createElement('canvas');c.width=nativeW;c.height=nativeH;return c};
 function prepare(){
   if(art||!logo.complete||!logo.naturalWidth)return;
   try{
     const src=partCanvas(),sc=src.getContext('2d',{willReadFrequently:true});
     sc.drawImage(logo,0,0,nativeW,nativeH);
     const original=sc.getImageData(0,0,nativeW,nativeH);
     const base=partCanvas(),bc=base.getContext('2d');
     const rest=bc.createImageData(nativeW,nativeH);
     rest.data.set(original.data);
     const names=['upper','back','front'],images={};
     for(const name of names){const c=partCanvas(),context=c.getContext('2d');images[name]={c,context,data:context.createImageData(nativeW,nativeH)}}
     let count=0;
     for(let y=253;y<625;y++)for(let x=725;x<1015;x++){
       const i=(y*nativeW+x)*4,r=original.data[i],g=original.data[i+1],b=original.data[i+2],a=original.data[i+3];
       if(!gold(r,g,b,a))continue;
       // Keep the flag separate. The source figure's precise metallic pixels are used.
       if(y<275&&x>899)continue;
       const name=y<454?'upper':x<871?'back':'front';
       images[name].data.data.set(original.data.subarray(i,i+4),i);
       rest.data[i+3]=0;count++;
     }
     if(count<500)throw Error('Emblem figure mask unavailable');
     bc.putImageData(rest,0,0);
     for(const name of names)images[name].context.putImageData(images[name].data,0,0);
     art={base,upper:images.upper.c,back:images.back.c,front:images.front.c};
   }catch(_){art=null}
 }
 function resize(){
   W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);
   canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
   ctx?.setTransform(dpr,0,0,dpr,0,0);
 }
 function finish(){
   if(done)return;done=true;cancelAnimationFrame(frame);
   removeEventListener('resize',resize);document.removeEventListener('keydown',key);
   document.removeEventListener('visibilitychange',hidden);
   style.remove();canvas.remove();skip.remove();
   body.classList.remove('xp-flight-active');
   ['--flight-scale','--flight-lift','--flight-reveal','--flight-header-height'].forEach(x=>body.style.removeProperty(x));
   intro.classList.remove('xp-flight-running');intro.removeAttribute('aria-busy');
   body.classList.add('imomazin-kindled');
   art=null;complete();
 }
 function key(e){if(e.key==='Escape'){e.preventDefault();finish()}}
 function hidden(){if(document.hidden)finish()}
 skip.addEventListener('click',finish);
 document.addEventListener('keydown',key);document.addEventListener('visibilitychange',hidden);
 addEventListener('resize',resize,{passive:true});
 resize();
 body.style.setProperty('--flight-header-height',(document.querySelector('.xp-header')?.getBoundingClientRect().height||88)+'px');
 body.classList.add('xp-flight-active');
 intro.classList.add('xp-flight-running');intro.dataset.flightDuration=String(duration);
 intro.dataset.flightStyle='living-emblem-eternal-flame';intro.setAttribute('aria-busy','true');
 if(!ctx){finish();return finish}
 prepare();
 function flame(x,y,size,a,time){
   if(a<=0)return;
   ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=clamp(a);
   const aura=ctx.createRadialGradient(x,y,0,x,y,size*1.5);
   aura.addColorStop(0,'rgba(255,218,111,.38)');aura.addColorStop(.45,'rgba(234,123,30,.13)');
   aura.addColorStop(1,'rgba(211,80,14,0)');
   ctx.fillStyle=aura;ctx.beginPath();ctx.arc(x,y,size*1.5,0,Math.PI*2);ctx.fill();
   for(let k=2;k>=0;k--){
     const width=size*(.31-k*.073),height=size*(1.18-k*.16);
     const sway=Math.sin(time*16+k*2)*size*.08;
     const gradient=ctx.createLinearGradient(x,y+height*.55,x,y-height*.72);
     gradient.addColorStop(0,k===0?'#ff6b1b':k===1?'#ffb433':'#fff1bd');
     gradient.addColorStop(.7,k===0?'#ffbf4d':k===1?'#ffe4a4':'#fff9e3');
     gradient.addColorStop(1,'rgba(255,223,106,0)');
     ctx.fillStyle=gradient;
     ctx.beginPath();ctx.moveTo(x-width,y+height*.5);
     ctx.bezierCurveTo(x-width*1.15,y-height*.10,x+sway-width*.27,y-height*.38,x+sway,y-height*.72);
     ctx.bezierCurveTo(x+sway+width*.18,y-height*.40,x+width*1.05,y-height*.13,x+width,y+height*.5);
     ctx.closePath();ctx.fill();
   }
   ctx.restore();
 }
 function drawFigure(ox,oy,s,move,t){
   if(!art)return;
   const dx=-170*move,dy=250*move,zoom=1+.26*move;
   ctx.save();ctx.translate(ox,oy);ctx.scale(s,s);
   ctx.translate(anchor.x+dx,anchor.y+dy);
   ctx.rotate(-.085*move);ctx.scale(zoom,zoom);ctx.translate(-anchor.x,-anchor.y);
   ctx.shadowColor='#372310';ctx.shadowBlur=15*move;ctx.shadowOffsetY=12*move;
   function limb(name,hx,hy,angle){
     ctx.save();ctx.translate(hx,hy);ctx.rotate(angle);ctx.translate(-hx,-hy);
     ctx.drawImage(art[name],0,0);ctx.restore();
   }
   limb('back',818,466,-.13*move+Math.sin(t*13)*.025*move);
   ctx.drawImage(art.upper,0,0);
   limb('front',889,460,.14*move-Math.sin(t*11)*.035*move);
   ctx.restore();
 }
 function draw(t){
   prepare();ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
   const transition=smooth((t-2.19)/.36),visible=1-transition;
   const width=Math.min(W*.90,H*1.60,1060),s=width/nativeW;
   const height=nativeH*s,ox=(W-width)/2,oy=H*.45-height/2;
   ctx.fillStyle='#050e0a';ctx.fillRect(0,0,W,H);
   const pool=ctx.createRadialGradient(W*.5,H*.44,0,W*.5,H*.44,Math.max(W,H)*.65);
   pool.addColorStop(0,'rgba(25,61,44,.58)');pool.addColorStop(.6,'rgba(8,25,17,.38)');
   pool.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=pool;ctx.fillRect(0,0,W,H);
   const detach=smooth((t-.12)/.40),returning=smooth((t-1.09)/.67),move=detach*(1-returning);
   const stable=t<.12||t>=1.76;
   ctx.save();ctx.globalAlpha=visible;
   if(stable||!art){if(logo.complete&&logo.naturalWidth)ctx.drawImage(logo,ox,oy,width,height)}
   else{
     ctx.drawImage(art.base,ox,oy,width,height);
     drawFigure(ox,oy,s,move,t);
   }
   const scene=(x,y)=>({x:ox+x*s,y:oy+y*s});
   // The fire is gathered from beneath the figure and guided into the actual flag.
   if(t>=.43&&t<=1.98){
     const rise=smooth((t-.48)/.34),journey=smooth((t-1.09)/.67);
     const low=scene(550,815),hand=scene(590,650),flag=scene(1165,135);
     let fx=low.x+(hand.x-low.x)*rise,fy=low.y+(hand.y-low.y)*rise;
     if(journey>0){
       const q=journey;
       const x1=hand.x+width*.015,y1=hand.y-height*.38,x2=flag.x-width*.08,y2=flag.y+height*.18;
       fx=Math.pow(1-q,3)*hand.x+3*Math.pow(1-q,2)*q*x1+3*(1-q)*q*q*x2+q*q*q*flag.x;
       fy=Math.pow(1-q,3)*hand.y+3*Math.pow(1-q,2)*q*y1+3*(1-q)*q*q*y2+q*q*q*flag.y;
       if(q>.07){
         ctx.save();ctx.globalCompositeOperation='lighter';
         ctx.strokeStyle='rgba(254,189,86,'+(Math.sin(Math.PI*q)*.65)+')';
         ctx.shadowColor='#ffbb54';ctx.shadowBlur=14;
         ctx.lineWidth=Math.max(1.2,width*.0022);
         ctx.beginPath();ctx.moveTo(hand.x,hand.y);
         for(let i=1;i<=12;i++){const z=q*i/12,ix=Math.pow(1-z,3)*hand.x+3*Math.pow(1-z,2)*z*x1+3*(1-z)*z*z*x2+z*z*z*flag.x,iy=Math.pow(1-z,3)*hand.y+3*Math.pow(1-z,2)*z*y1+3*(1-z)*z*z*y2+z*z*z*flag.y;ctx.lineTo(ix,iy)}
         ctx.stroke();ctx.restore();
       }
     }
     const appear=smooth((t-.43)/.16)*(1-smooth((t-1.75)/.22));
     flame(fx,fy,Math.max(18,width*.069)*(1-.35*journey),appear,t);
   }
   // A single localized flash crowns the unaltered original flag.
   if(t>=1.76&&t<2.14){
     const impact=smooth((t-1.76)/.08)*(1-smooth((t-1.86)/.26)),point=scene(1165,135);
     ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=impact*.75;
     const g=ctx.createRadialGradient(point.x,point.y,0,point.x,point.y,width*.18);
     g.addColorStop(0,'rgba(255,245,185,.92)');g.addColorStop(.15,'rgba(255,210,99,.37)');
     g.addColorStop(1,'rgba(255,176,66,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(point.x,point.y,width*.18,0,Math.PI*2);ctx.fill();
     ctx.restore();
   }
   // The newly gathered fire becomes the enduring, restrained signature of the flag.
   if(t>=1.77){
     const kindle=smooth((t-1.77)/.20);
     const tip=scene(1165,135),size=Math.max(11,width*.028);
     flame(tip.x,tip.y-size*.5,size,kindle*.88,1.7);
   }
   // A small reflective sweep gives the finished metallic signature its final weight.
   if(t>=1.86&&t<2.14){
     const q=smooth((t-1.86)/.28);
     ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=(1-q)*.32;
     ctx.translate(ox+width*(.2+q*.65),oy+height*.66);
     ctx.rotate(-.25);const ray=ctx.createLinearGradient(-width*.05,0,width*.05,0);
     ray.addColorStop(0,'rgba(255,255,255,0)');ray.addColorStop(.5,'#ffda85');
     ray.addColorStop(1,'rgba(255,255,255,0)');
     ctx.fillStyle=ray;ctx.fillRect(-width*.05,-height*.05,width*.1,height*.26);ctx.restore();
   }
   ctx.restore();
   // The completed kindled emblem is held visibly before the homepage reveal.
   ctx.save();ctx.globalAlpha=transition;ctx.fillStyle='#050e0a';ctx.fillRect(0,0,W,H);ctx.restore();
   canvas.style.opacity=String(visible);
   body.style.setProperty('--flight-scale',String(.975+.025*out((t-2.19)/.36)));
   body.style.setProperty('--flight-lift',String((1-out((t-2.19)/.36))*1.6)+'vh');
   body.style.setProperty('--flight-reveal',String(transition));
 }
 function tick(now){
   if(done)return;if(!start)start=now;
   // Draw uses seconds, not a normalized 0..1 fraction. Last beat must actually run.
   const elapsed=Math.min(duration/1000,(now-start)/1000);
   try{draw(elapsed)}catch(_){finish();return}
   if(elapsed>=duration/1000){finish();return}frame=requestAnimationFrame(tick);
 }
 frame=requestAnimationFrame(tick);
 return finish;
};
})();