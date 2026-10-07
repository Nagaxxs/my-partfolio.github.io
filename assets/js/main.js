/* Naga portfolio — vanilla JS interactions (no dependencies) */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- split headline into words (text reveal) ---------- */
  let wi = 0;
  const splitNode = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const inner = document.createElement('span'); inner.textContent = part;
          inner.style.setProperty('--i', wi++);
          w.appendChild(inner); frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) splitNode(child);
    });
  };
  $$('[data-split]').forEach(splitNode);
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-loaded')));

  /* ---------- word rotate ---------- */
  const items = $$('.word-rotate__item');
  const rot = $('.word-rotate');
  const fitRot = () => { const a = $('.word-rotate__item.is-active'); if (rot && a) rot.style.width = a.offsetWidth + 'px'; };
  fitRot();
  window.addEventListener('resize', fitRot);
  if (document.fonts) document.fonts.ready.then(fitRot);
  if (items.length > 1 && !reduce) {
    let idx = 0;
    setInterval(() => {
      const cur = items[idx];
      idx = (idx + 1) % items.length;
      const next = items[idx];
      cur.classList.remove('is-active'); cur.classList.add('is-leaving');
      next.classList.remove('is-leaving'); next.classList.add('is-active');
      fitRot();
      setTimeout(() => cur.classList.remove('is-leaving'), 650);
    }, 2600);
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else revealEls.forEach((el) => el.classList.add('is-in'));

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const burger = $('.nav__burger');
  const onScrollNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScrollNav();
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.nav__mobile a').forEach((a) => a.addEventListener('click', () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }));

  // active link highlight
  const links = $$('.nav__links a');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => so.observe(s));
  }

  /* ---------- spotlight cards + cursor glow ---------- */
  if (fine) {
    $$('.spot').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
    const glow = $('.cursor-glow');
    let gx = 0, gy = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const loop = () => { gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12; glow.style.transform = `translate(${gx - 260}px, ${gy - 260}px)`; requestAnimationFrame(loop); };
    if (!reduce) loop();
  }

  /* ---------- hero 3D showcase tilt ---------- */
  const stage = $('.showcase__stage');
  if (stage && !reduce) {
    let mx = 0, my = 0;
    const apply = () => {
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = Math.min(Math.max(1 - (r.top / vh), 0), 1); // 0 → 1 while scrolling into view
      const rx = 16 - prog * 14 + my * -4;
      stage.style.setProperty('--rx', `${rx}deg`);
      stage.style.setProperty('--ry', `${mx * 6}deg`);
    };
    if (fine) window.addEventListener('pointermove', (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      apply();
    }, { passive: true });
    window.addEventListener('scroll', apply, { passive: true });
    apply();
  }

  /* ---------- case tilt ---------- */
  if (fine && !reduce) {
    $$('.tilt').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `rotateY(${px * 8}deg) rotateX(${py * -8}deg) translateZ(10px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- screen height for hover-scroll screenshots ---------- */
  const setScreenH = () => $$('.bframe__screen--scroll').forEach((s) => s.style.setProperty('--screen-h', `${s.clientHeight}px`));
  setScreenH();
  window.addEventListener('resize', setScreenH);

  /* ---------- process progress line ---------- */
  const steps = $('#steps');
  const stepEls = $$('.step');
  const updateSteps = () => {
    if (!steps) return;
    const r = steps.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(Math.max((vh * 0.7 - r.top) / r.height, 0), 1);
    steps.style.setProperty('--p', `${p * 100}%`);
    stepEls.forEach((s, i) => s.classList.toggle('is-active', p >= (i + 0.2) / stepEls.length || p >= 0.99));
  };

  /* ---------- rAF-throttled scroll ---------- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { onScrollNav(); updateSteps(); ticking = false; });
  }, { passive: true });
  updateSteps();

  /* ---------- star field ---------- */
  const cvs = $('#stars');
  if (cvs && !reduce) {
    const ctx = cvs.getContext('2d');
    let w, h, stars = [], dpr = Math.min(window.devicePixelRatio || 1, 2), running = true;
    const resize = () => {
      w = cvs.clientWidth; h = cvs.clientHeight;
      cvs.width = w * dpr; cvs.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 9000);
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + 0.2, s: Math.random() * 0.25 + 0.05, a: Math.random() * Math.PI * 2 }));
    };
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        st.y -= st.s; st.a += 0.02;
        if (st.y < -2) { st.y = h + 2; st.x = Math.random() * w; }
        ctx.globalAlpha = 0.35 + Math.sin(st.a) * 0.3;
        ctx.fillStyle = '#c7c3ff';
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    // pause when hero is off-screen
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) draw(); }).observe(cvs);
  }

  /* ---------- placeholders (contacts not set yet) ---------- */
  $$('[data-placeholder]').forEach((a) => {
    a.addEventListener('click', (e) => { if (a.getAttribute('href') === '#') e.preventDefault(); });
  });

  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
