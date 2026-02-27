/* ═══════════════════════════════════════════════════════════════
   SILVA DIGITAL — Script
   Calm motion. Deliberate transitions. Precision interaction.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Viewport detection (mobile vs desktop) ───────────────────────
  const MOBILE_BREAKPOINT = 900;
  function setViewport() {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    document.documentElement.dataset.viewport = isMobile ? 'mobile' : 'desktop';
  }
  setViewport();
  window.addEventListener('resize', setViewport);
  window.addEventListener('orientationchange', () => { setTimeout(setViewport, 100); });

  // ── Scroll Reveal & Fade Out (reset and replay on every scroll in/out) ─
  const revealElements = document.querySelectorAll('.reveal');
  const revealTimeouts = new WeakMap();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          const delay = parseInt(el.dataset.delay || '0', 10);
          el.classList.remove('revealed');
          el.classList.add('faded-out');
          const tid = setTimeout(() => {
            el.classList.add('revealed');
            el.classList.remove('faded-out');
            revealTimeouts.delete(el);
          }, delay);
          revealTimeouts.set(el, tid);
        } else {
          const tid = revealTimeouts.get(el);
          if (tid) clearTimeout(tid);
          revealTimeouts.delete(el);
          el.classList.remove('revealed');
          el.classList.add('faded-out');
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '20px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => {
    el.classList.add('faded-out');
    revealObserver.observe(el);
  });


  // ── Navigation Show/Hide on Scroll ────────────────────────────
  const nav = document.getElementById('nav');
  let navVisible = false;

  function handleNavScroll() {
    if (!nav) return;
    const currentScroll = window.scrollY;
    const heroHeight = window.innerHeight * 0.6;

    if (currentScroll > heroHeight) {
      if (!navVisible) {
        nav.classList.add('visible');
        navVisible = true;
      }
    } else {
      if (navVisible) {
        nav.classList.remove('visible');
        navVisible = false;
      }
    }
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });


  // ── Nav: highlight link for section in view ─────────────────────
  const sectionIds = ['hero', 'services', 'capability', 'process', 'philosophy', 'contact'];
  const navLinks = document.querySelectorAll('.nav-links .nav-link[data-section]');

  function updateActiveNav() {
    const trigger = window.innerHeight * 0.25;
    let currentId = null;
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top <= trigger) currentId = id;
    });
    navLinks.forEach((link) => {
      if (link.dataset.section === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', () => { updateActiveNav(); }, { passive: true });
  updateActiveNav();


  // ── Mobile Menu Toggle ────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      navToggle.classList.toggle('active', menuOpen);

      const spans = navToggle.querySelectorAll('span');
      if (menuOpen) {
        spans[0].style.transform = 'translateY(3.5px) rotate(45deg)';
        spans[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      }
    });

    mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        navToggle.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      });
    });
  }


  // ── Smooth Anchor Scroll ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        const isMobile = document.documentElement.dataset.viewport === 'mobile';
        const offset = isMobile ? 56 : 40;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    });
  });


  // ── Cursor Glow (Desktop Only) ────────────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.06;
      glowY += (mouseY - glowY) * 0.06;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }




  // ── Precision Gauges — Scroll Activation ────────────────────────
  const gaugeCells = document.querySelectorAll('.gauge-cell');

  const gaugeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const cell = entry.target;
        if (entry.isIntersecting) {
          const delay = parseInt(cell.dataset.delay || '0', 10);
          setTimeout(() => { cell.classList.add('gauge-active'); }, delay + 200);
        } else {
          cell.classList.remove('gauge-active');
        }
      });
    },
    { threshold: 0.3, rootMargin: '0px 0px -40px 0px' }
  );

  gaugeCells.forEach((el) => gaugeObserver.observe(el));


  // ── Parallax Depth on Glass Cards ─────────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -4;
        const rotateY = (x - 0.5) * 4;
        card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  // ── Contact Form Handling ─────────────────────────────────────
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      const btnText = btn.querySelector('.btn-text');
      const originalText = btnText.textContent;

      const name = contactForm.querySelector('input[name="name"]').value.trim();
      const email = contactForm.querySelector('input[name="email"]').value.trim();
      const message = contactForm.querySelector('textarea[name="message"]').value.trim();

      if (!name || !email || !message) return;

      btnText.textContent = 'Sending...';
      btn.disabled = true;

      const payload = JSON.stringify({ name, email, message });
      const webhooks = [
        'http://localhost:5678/webhook-test/1e9ad1ef-d394-4c04-8348-7238f5545d50',
        'http://localhost:5678/webhook/1e9ad1ef-d394-4c04-8348-7238f5545d50'
      ];

      Promise.all(webhooks.map((url) =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        }).then((res) => res.ok)
      ))
        .then((results) => {
          if (results.every(Boolean)) {
            btnText.textContent = 'Message Sent';
            btn.style.borderColor = 'rgba(139, 156, 198, 0.3)';
            contactForm.reset();
          } else {
            btnText.textContent = 'Error — Try Again';
          }
        })
        .catch(() => {
          btnText.textContent = 'Error — Try Again';
        })
        .finally(() => {
          btn.disabled = false;
          setTimeout(() => {
            btnText.textContent = originalText;
            btn.style.borderColor = '';
          }, 3000);
        });
    });
  }


  // ── Ambient Orb Slow Drift (desktop only; static on mobile to avoid background movement) ─
  const orbs = document.querySelectorAll('.orb');
  const MOBILE_ORB_BREAKPOINT = 900;

  orbs.forEach((orb, i) => {
    if (window.innerWidth <= MOBILE_ORB_BREAKPOINT) return;
    const speed = 0.0002 + i * 0.00005;
    const amplitude = 30 + i * 10;
    const offset = i * 1000;
    const hasTranslateX = orb.classList.contains('orb-1') || orb.classList.contains('orb-4');

    function driftOrb(now) {
      if (window.innerWidth <= MOBILE_ORB_BREAKPOINT) return;
      const t = (now + offset) * speed;
      const dx = Math.sin(t) * amplitude;
      const dy = Math.cos(t * 0.7) * amplitude * 0.6;

      if (hasTranslateX) {
        orb.style.transform = `translateX(-50%) translate(${dx}px, ${dy}px)`;
      } else {
        orb.style.transform = `translate(${dx}px, ${dy}px)`;
      }
      requestAnimationFrame(driftOrb);
    }
    requestAnimationFrame(driftOrb);
  });



})();
