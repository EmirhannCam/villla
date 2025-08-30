// Global JS
// - Yıl bilgisini footer'da günceller
// - Küçük UX iyileştirmeleri

(function(){
    const yilEl = document.getElementById('yil');
    if (yilEl) yilEl.textContent = new Date().getFullYear();
  
    // Turizm Belge No
    const TURIZM_BELGE_NO = '1234567890';
    document.querySelectorAll('[data-turizm-belge-no]').forEach(el=> el.textContent = TURIZM_BELGE_NO);
  
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        const id = a.getAttribute('href');
        if(id.length > 1){
          const target = document.querySelector(id);
          if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
        }
      });
    });
  
    // Mobile menu toggle
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.nav-links');
    if(toggle && links){
      toggle.addEventListener('click', ()=> {
        const opened = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
      });
      links.querySelectorAll('a').forEach(l=> l.addEventListener('click', ()=>{
        links.classList.remove('open'); toggle.setAttribute('aria-expanded','false');
      }));
    }
  
    // Slider
    const slider = document.querySelector('.slider');
    if(slider){
      const slidesEl = slider.querySelector('.slides');
      const slideEls = slider.querySelectorAll('.slide');
      const prev = slider.querySelector('[data-prev]');
      const next = slider.querySelector('[data-next]');
      const dots = slider.querySelectorAll('.slider-dot');
      let index = 0;
      function go(i){
        index = (i + slideEls.length) % slideEls.length;
        slidesEl.style.transform = `translateX(-${index*100}%)`;
        dots.forEach((d,di)=> d.classList.toggle('active', di===index));
      }
      prev && prev.addEventListener('click', ()=> go(index-1));
      next && next.addEventListener('click', ()=> go(index+1));
      dots.forEach((d,di)=> d.addEventListener('click', ()=> go(di)));
      setInterval(()=> go(index+1), 5000);
      go(0);
    }
  
    // Lightbox
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = `
      <div class="lightbox-inner">
        <button class="lightbox-close" aria-label="Kapat">×</button>
        <div class="lightbox-stage">
          <img class="lightbox-img" alt="Galeri görseli" />
          <div class="lightbox-nav">
            <button class="lightbox-btn" data-prev aria-label="Önceki">‹</button>
            <button class="lightbox-btn" data-next aria-label="Sonraki">›</button>
          </div>
        </div>
        <div class="lightbox-thumbs"></div>
      </div>`;
    document.body.appendChild(overlay);
  
    const lbImg = overlay.querySelector('.lightbox-img');
    const lbThumbs = overlay.querySelector('.lightbox-thumbs');
    const prevBtn = overlay.querySelector('[data-prev]');
    const nextBtn = overlay.querySelector('[data-next]');
    const closeBtn = overlay.querySelector('.lightbox-close');
  
    let images = [], lbIndex = 0;
  
    function go(i){
      lbIndex = (i + images.length) % images.length;
      lbImg.src = images[lbIndex];
      lbThumbs.querySelectorAll('img').forEach((t,di)=> t.classList.toggle('active', di===lbIndex));
    }
  
    function open(startIndex, imgs){
      images = imgs;
      lbThumbs.innerHTML = '';
      images.forEach((src,di)=>{
        const t = document.createElement('img');
        t.src = src;
        if(di===startIndex) t.classList.add('active');
        t.addEventListener('click', ()=> go(di));
        lbThumbs.appendChild(t);
      });
      overlay.classList.add('open');
      document.body.style.overflow='hidden';
      go(startIndex);
    }
  
    function close(){ overlay.classList.remove('open'); document.body.style.overflow=''; }
  
    closeBtn.onclick = close;
    prevBtn.onclick = ()=> go(lbIndex-1);
    nextBtn.onclick = ()=> go(lbIndex+1);
    overlay.addEventListener('click', e=> { if(e.target===overlay) close(); });
    document.addEventListener('keydown', e=>{
      if(!overlay.classList.contains('open')) return;
      if(e.key==='Escape') close();
      if(e.key==='ArrowLeft') go(lbIndex-1);
      if(e.key==='ArrowRight') go(lbIndex+1);
    });
  
    // Bind villa galleries per .thumbs block (each gallery has its own overlay)
    document.querySelectorAll('.thumbs').forEach(gallery=>{
      const thumbs = gallery.querySelectorAll('img');
      if(!thumbs.length) return;

      // Create an overlay per gallery
      const overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML = `
        <div class="lightbox-inner">
          <button class="lightbox-close" aria-label="Kapat">×</button>
          <div class="lightbox-stage">
            <img class="lightbox-img" alt="Galeri görseli" />
            <div class="lightbox-nav">
              <button class="lightbox-btn" data-prev aria-label="Önceki">‹</button>
              <button class="lightbox-btn" data-next aria-label="Sonraki">›</button>
            </div>
          </div>
          <div class="lightbox-thumbs"></div>
        </div>`;
      document.body.appendChild(overlay);

      const lbImg = overlay.querySelector('.lightbox-img');
      const lbThumbs = overlay.querySelector('.lightbox-thumbs');
      const prevBtn = overlay.querySelector('[data-prev]');
      const nextBtn = overlay.querySelector('[data-next]');
      const closeBtn = overlay.querySelector('.lightbox-close');

      const imgs = Array.from(thumbs).map(t=> t.getAttribute('data-src') || t.src);
      let idx = 0;
      function go(i){ idx = (i + imgs.length) % imgs.length; lbImg.src = imgs[idx]; lbThumbs.querySelectorAll('img').forEach((im,di)=> im.classList.toggle('active', di===idx)); }
      function open(start){
        lbThumbs.innerHTML = '';
        imgs.forEach((src,di)=>{ const ti=document.createElement('img'); ti.src=src; if(di===start) ti.classList.add('active'); ti.addEventListener('click', ()=> go(di)); lbThumbs.appendChild(ti); });
        overlay.classList.add('open'); document.body.style.overflow='hidden'; go(start);
      }
      function close(){ overlay.classList.remove('open'); document.body.style.overflow=''; }
      prevBtn.onclick = ()=> go(idx-1);
      nextBtn.onclick = ()=> go(idx+1);
      closeBtn.onclick = close;
      overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
      document.addEventListener('keydown', e=>{ if(!overlay.classList.contains('open')) return; if(e.key==='Escape') close(); if(e.key==='ArrowLeft') go(idx-1); if(e.key==='ArrowRight') go(idx+1); });

      // Click bindings scoped to this gallery
      thumbs.forEach((t,i)=> t.addEventListener('click', ()=> open(i)));
      const main = document.getElementById('mainPhoto');
      if(main){
        main.addEventListener('click', ()=>{
          const activeIdx = Array.from(thumbs).findIndex(ti=> ti.classList.contains('active'));
          open(activeIdx >= 0 ? activeIdx : 0);
        });
      }
    });
  
  })();
  