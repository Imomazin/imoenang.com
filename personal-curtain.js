(()=>{
  const init=()=>{
    const root=document.querySelector('#personal-moments');
    if(!root) return;
    const oldGrid=root.querySelector('.xp-personal-finale-grid');
    if(!oldGrid) return;

    const slides=[
      {src:'/assets/personal-portrait-1.webp',caption:'THE PERSON BEHIND THE WORK',cls:'is-wide'},
      {src:'/assets/personal-portrait-2.webp',caption:'QUIET CONFIDENCE',cls:'is-chain'},
      {src:'/assets/personal-portrait-3.webp',caption:'STYLE & PRESENCE',cls:''},
      {src:'/assets/personal-blue-shirt.jpeg',caption:'BETWEEN THE MOMENTS',cls:''}
    ];

    const gallery=document.createElement('div');
    gallery.className='xp-curtain-gallery xp-carousel-gallery';
    gallery.setAttribute('aria-label','Personal portrait carousel');
    gallery.innerHTML=`
      <div class="xp-curtain-stage xp-carousel-stage">
        <div class="xp-carousel-track">
          ${slides.map((s,i)=>`<figure class="xp-curtain-slide xp-carousel-slide ${s.cls}" data-index="${i}"><img src="${s.src}" alt="Dr Imo Enang personal portrait ${i+1}" ${i===0?'fetchpriority="high"':'loading="lazy"'} decoding="async"><figcaption class="xp-curtain-caption">${s.caption}</figcaption></figure>`).join('')}
        </div>
        <div class="xp-curtain-counter" aria-live="polite">01 / ${String(slides.length).padStart(2,'0')}</div>
      </div>
      <div class="xp-curtain-controls">
        <button type="button" class="xp-curtain-prev" aria-label="Previous portrait">←</button>
        <div class="xp-curtain-dots" role="tablist" aria-label="Choose portrait">
          ${slides.map((_,i)=>`<button type="button" class="xp-curtain-dot ${i===0?'is-active':''}" data-go="${i}" role="tab" aria-label="Portrait ${i+1}" aria-selected="${i===0?'true':'false'}"></button>`).join('')}
        </div>
        <button type="button" class="xp-curtain-next" aria-label="Next portrait">→</button>
      </div>`;

    oldGrid.replaceWith(gallery);

    const stage=gallery.querySelector('.xp-carousel-stage');
    const track=gallery.querySelector('.xp-carousel-track');
    const dots=[...gallery.querySelectorAll('.xp-curtain-dot')];
    const counter=gallery.querySelector('.xp-curtain-counter');
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index=0,timer=null,visible=false;

    const update=(next)=>{
      index=(next+slides.length)%slides.length;
      track.style.transform=`translate3d(-${index*100}%,0,0)`;
      dots.forEach((dot,i)=>{
        const active=i===index;
        dot.classList.toggle('is-active',active);
        dot.setAttribute('aria-selected',active?'true':'false');
      });
      counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    };

    const next=()=>update(index+1);
    const prev=()=>update(index-1);
    gallery.querySelector('.xp-curtain-next').addEventListener('click',next);
    gallery.querySelector('.xp-curtain-prev').addEventListener('click',prev);
    dots.forEach(d=>d.addEventListener('click',()=>update(Number(d.dataset.go))));

    let sx=0,sy=0;
    stage.addEventListener('touchstart',e=>{const t=e.changedTouches[0];sx=t.clientX;sy=t.clientY},{passive:true});
    stage.addEventListener('touchend',e=>{const t=e.changedTouches[0];const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){dx<0?next():prev()}},{passive:true});

    const start=()=>{if(reduce||timer||!visible)return;timer=window.setInterval(next,4600)};
    const stop=()=>{if(timer){window.clearInterval(timer);timer=null}};
    gallery.addEventListener('mouseenter',stop);
    gallery.addEventListener('mouseleave',start);
    gallery.addEventListener('focusin',stop);
    gallery.addEventListener('focusout',start);

    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting;visible?start():stop()},{threshold:.25});
      io.observe(gallery);
    }else{visible=true;start()}

    update(0);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
