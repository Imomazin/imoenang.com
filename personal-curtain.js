(()=>{
  const init=()=>{
    const root=document.querySelector('#personal-moments');
    if(!root) return;
    const oldGrid=root.querySelector('.xp-personal-finale-grid');
    if(!oldGrid) return;

    const slides=[
  {
    "src": "/assets/personal-evening.webp",
    "small": "/assets/personal-evening-small.webp",
    "width": 1086,
    "height": 1448,
    "caption": "AN EVENING BETWEEN CHAPTERS",
    "alt": "Dr Imo Enang in a black tuxedo beside an illuminated courtyard and reflecting pool",
    "cls": "is-portrait"
  },
  {
    "src": "/assets/personal-lounge.webp",
    "small": "/assets/personal-lounge-small.webp",
    "width": 1086,
    "height": 1448,
    "caption": "A MOMENT TO REFLECT",
    "alt": "Dr Imo Enang seated in a blue shirt and waistcoat in an executive lounge",
    "cls": "is-portrait"
  },
  {
    "src": "/assets/personal-suit.webp",
    "small": "/assets/personal-suit-small.webp",
    "width": 1440,
    "height": 1080,
    "caption": "PERSONAL STYLE",
    "alt": "Dr Imo Enang taking a mirror portrait in a black suit",
    "cls": "is-wide"
  },
  {
    "src": "/assets/personal-smile-approved.jpg",
    "small": "/assets/personal-smile-approved.jpg",
    "width": 1086,
    "height": 1448,
    "caption": "THE PERSON BEHIND THE WORK",
    "alt": "Dr Imo Enang smiling in a blue shirt and navy waistcoat",
    "cls": "is-portrait"
  }
];

    const gallery=document.createElement('div');
    gallery.className='xp-curtain-gallery xp-carousel-gallery xp-single-frame-gallery';
    gallery.setAttribute('aria-label','Personal portraits, one continuous gallery');
    gallery.innerHTML=`
      <div class="xp-curtain-stage xp-carousel-stage">
        <div class="xp-carousel-track">
          ${slides.map((s,i)=>`<figure class="xp-curtain-slide xp-carousel-slide ${s.cls} ${i===0?'is-active':''}" data-index="${i}" aria-hidden="${i===0?'false':'true'}"><img src="${s.src}" srcset="${s.small} 600w, ${s.src} ${s.width}w" sizes="(max-width: 760px) 88vw, 900px" width="${s.width}" height="${s.height}" alt="${s.alt}" loading="lazy" decoding="async"><figcaption class="xp-curtain-caption">${s.caption}</figcaption></figure>`).join('')}
        </div>
        <div class="xp-curtain-counter" aria-live="off">01 / ${String(slides.length).padStart(2,'0')}</div>
        <div class="xp-curtain-controls">
          <button type="button" class="xp-curtain-prev" aria-label="Previous portrait">←</button>
          <div class="xp-curtain-dots" role="tablist" aria-label="Choose portrait">
            ${slides.map((_,i)=>`<button type="button" class="xp-curtain-dot ${i===0?'is-active':''}" data-go="${i}" role="tab" aria-label="Portrait ${i+1}" aria-selected="${i===0?'true':'false'}"></button>`).join('')}
          </div>
          <button type="button" class="xp-curtain-next" aria-label="Next portrait">→</button>
        </div>
      </div>`;

    oldGrid.replaceWith(gallery);

    const stage=gallery.querySelector('.xp-carousel-stage');
    const frames=[...gallery.querySelectorAll('.xp-carousel-slide')];
    const dots=[...gallery.querySelectorAll('.xp-curtain-dot')];
    const counter=gallery.querySelector('.xp-curtain-counter');
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index=0,timer=null,visible=false;

    const update=(next)=>{
      const target=(next+slides.length)%slides.length;
      if(target===index)return;
      index=target;
      frames.forEach((frame,i)=>{
        const active=i===index;
        frame.classList.toggle('is-active',active);
        frame.setAttribute('aria-hidden',active?'false':'true');
      });
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
    stage.addEventListener('touchend',e=>{
      const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
      if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){dx<0?next():prev()}
    },{passive:true});

    const start=()=>{
      if(reduce||timer||!visible||document.hidden)return;
      timer=window.setInterval(next,5200);
    };
    const stop=()=>{if(timer){window.clearInterval(timer);timer=null}};
    gallery.addEventListener('mouseenter',stop);
    gallery.addEventListener('mouseleave',start);
    gallery.addEventListener('focusin',stop);
    gallery.addEventListener('focusout',start);
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());

    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(entries=>{
        visible=entries[0]?.isIntersecting;
        visible?start():stop();
      },{threshold:.25});
      io.observe(gallery);
    }else{visible=true;start()}
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
