/* main.js — Navigation, project filter, carousels, hamburger, before/after */
(function() {

  // ── Mobile Hamburger ──────────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileOverlay = document.querySelector('.nav-mobile-overlay');

  if (hamburger && mobileOverlay) {
    let open = false;
    hamburger.addEventListener('click', () => {
      open = !open;
      mobileOverlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    mobileOverlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        open = false;
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ── Project Filter ────────────────────────────────────────────
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  // ── Carousels ─────────────────────────────────────────────────
  document.querySelectorAll('.carousel-wrap').forEach(wrap => {
    const track  = wrap.querySelector('.carousel-track');
    const slides = wrap.querySelectorAll('.carousel-slide');
    const prev   = wrap.querySelector('.carousel-btn.prev');
    const next   = wrap.querySelector('.carousel-btn.next');
    const dotsWrap = wrap.querySelector('.carousel-dots');
    if (!track || !slides.length) return;

    let current = 0;
    const total = slides.length;

    // Build dots
    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Slide ${i+1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));

    // Keyboard
    wrap.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = startX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) goTo(current + (dx > 0 ? 1 : -1));
    });

    // Auto-advance (optional, 5s)
    // let autoTimer = setInterval(() => goTo(current + 1), 5000);
    // wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
  });

  // ── Before / After Slider ────────────────────────────────────
  document.querySelectorAll('.before-after-wrap').forEach(wrap => {
    const afterImg = wrap.querySelector('.after-img');
    const handle   = wrap.querySelector('.ba-handle');
    if (!afterImg || !handle) return;

    let dragging = false;
    let pct = 50;

    function setPosition(x) {
      const rect = wrap.getBoundingClientRect();
      pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
      afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
    }

    handle.addEventListener('mousedown', () => { dragging = true; });
    document.addEventListener('mouseup',   () => { dragging = false; });
    document.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });

    handle.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive: false });
    document.addEventListener('touchend',   () => { dragging = false; });
    document.addEventListener('touchmove',  e => {
      if (dragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

    // Init
    setPosition(wrap.getBoundingClientRect().left + wrap.getBoundingClientRect().width / 2);
  });

  // ── Smooth active nav link ──────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
    }
  });

})();
