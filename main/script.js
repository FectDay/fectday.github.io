/* ==== particle фон ==== */
(() => {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w = 0, h = 0;
  let DPR = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initParticles();
  }

  function initParticles() {
    // уменьшим на мобильных
    const isSmall = window.innerWidth < 640;
    const targetCount = isSmall ? Math.max(10, Math.floor((w * h) / 250000)) : Math.max(28, Math.floor((w * h) / 90000));
    particles = [];
    for (let i = 0; i < targetCount; i++) particles.push(createParticle());
  }

  function createParticle() {
    const size = Math.random() * 2.2 + 0.6;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: size,
      alpha: 0.08 + Math.random() * 0.25,
      hue: 150 + Math.random() * 40
    };
  }

  let tLast = performance.now();
  function loop(now) {
    const dt = Math.min(60, now - tLast);
    tLast = now;
    ctx.clearRect(0, 0, w, h);

    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0, 'rgba(20,24,24,0.08)');
    g.addColorStop(1, 'rgba(4,6,8,0.18)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for (let p of particles) {
      p.x += p.vx * (dt * 0.06);
      p.y += p.vy * (dt * 0.06);

      if (p.x < -50) p.x = w + 50;
      if (p.x > w + 50) p.x = -50;
      if (p.y < -50) p.y = h + 50;
      if (p.y > h + 50) p.y = -50;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 10);
      grad.addColorStop(0, `hsla(${p.hue}, 60%, 60%, ${p.alpha})`);
      grad.addColorStop(0.15, `hsla(${p.hue}, 60%, 50%, ${p.alpha * 0.55})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.r * 10, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(resize, 120);
  });

  resize();
  requestAnimationFrame(loop);
})();

/* ==== карточки: открытие по клику + появление при скролле ==== */
(() => {
  document.querySelectorAll('.card[data-link]').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.link;
      if (!url) return;
      window.open(url, '_blank', 'noopener');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, threshold: 0.12 });

  document.querySelectorAll('.card').forEach((el, i) => {
    el.style.transitionDelay = (i * 40) + 'ms';
    observer.observe(el);
  });
})();

/* ==== гамбургер/мобильное меню ==== */
(() => {
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-link, .nav-link, .btn');

  function openMenu() {
    burger.classList.add('open');
    burger.setAttribute('aria-expanded','true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden'; // блокируем скролл фона
  }
  function closeMenu() {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden','true');
    document.body.style.overflow = ''; // возвращаем скролл
  }

  burger.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  // закрывать при клике по ссылке внутри меню
  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(a => {
    a.addEventListener('click', () => {
      closeMenu();
    });
  });

  // закрывать при клике вне панели
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // ESC для закрытия
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
})();

/* ==== плавный якорь (старые браузеры) ==== */
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });
})();
