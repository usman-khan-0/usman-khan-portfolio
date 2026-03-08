/* ============================================================
   BALLISTIC MISSILE FYP — SCRIPT.JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initHamburger();
  initCounters();
  initReveal();
  initTimelineFills();
  initScoreArc();
  initParallax();
  colorizeFlowNodes();
  initTableGlow();
  initKeyboardAccess();
  printConsoleHeader();
});


// ---- SCROLL PROGRESS BAR ----
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docH > 0 ? (scrollTop / docH * 100) + '%' : '0';
  }, { passive: true });
}


// ---- NAVBAR ----
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active-link', l.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}


// ---- HAMBURGER ----
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}


// ---- COUNTER ANIMATION ----
function initCounters() {
  const counters = document.querySelectorAll('.s-val[data-target]');
  if (!counters.length) return;

  const animate = el => {
    const target = +el.dataset.target;
    const dur = 1600;
    const start = performance.now();

    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - (1 - p) ** 3;
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}


// ---- SCROLL REVEAL ----
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger siblings
      const siblings = [...(entry.target.parentElement?.querySelectorAll('.reveal') || [])];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.07}s`;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => obs.observe(el));
}


// ---- FLOWCHART TOGGLE ----
function toggleStage(n) {
  const items = document.querySelectorAll('.flow-item');
  const target = document.querySelector(`.flow-item[data-stage="${n}"]`);
  if (!target) return;

  const wasActive = target.classList.contains('active');

  // Close all, update aria
  items.forEach(item => {
    item.classList.remove('active');
    const btn = item.querySelector('.flow-node');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });

  if (!wasActive) {
    target.classList.add('active');
    const btn = target.querySelector('.flow-node');
    if (btn) btn.setAttribute('aria-expanded', 'true');

    // Smooth scroll to item after expand animation starts
    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const top = window.pageYOffset + rect.top - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 80);
  }
}


// ---- TIMELINE FILL BARS ----
function initTimelineFills() {
  const fills = document.querySelectorAll('.tl-fill');
  if (!fills.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('go'), 150);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(f => obs.observe(f));
}


// ---- SCORE ARC ANIMATION ----
function initScoreArc() {
  const arc = document.querySelector('.score-arc');
  if (!arc) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => arc.classList.add('animated'), 300);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  obs.observe(arc);
}


// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    }
  });
});


// ---- PARALLAX ----
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const missile = document.querySelector('.hero-missile-wrap');
  const grid = document.querySelector('.hero-grid-overlay');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.pageYOffset;
        if (missile && y < window.innerHeight) {
          missile.style.transform = `translateY(calc(-50% + ${y * 0.12}px))`;
        }
        if (grid && y < window.innerHeight) {
          grid.style.backgroundPosition = `0 ${y * 0.3}px, 0 ${y * 0.3}px`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mouse parallax for radar
  const hero = document.querySelector('.hero');
  const radar = document.querySelector('.hero-radar');
  if (hero && radar) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      radar.style.transform = `translateY(-50%) translate(${x * 15}px, ${y * 10}px)`;
    });
  }
}


// ---- COLORIZE FLOW NODES ----
function colorizeFlowNodes() {
  const colors = ['#ff4400','#ff9900','#ffcc00','#ff6600','#cc3300','#ff9900','#ffcc00','#cc3300'];
  document.querySelectorAll('.flow-node').forEach((node, i) => {
    const c = colors[i % colors.length];
    const icon = node.querySelector('.fn-icon');
    if (icon) {
      icon.style.setProperty('--nc', c);
      icon.style.color = c;
      icon.style.borderColor = c + '33';
      icon.style.background = c + '15';
    }
    const badge = node.querySelector('.fn-badge');
    if (badge) badge.style.color = c + '60';
  });
}


// ---- TABLE HOVER GLOW ----
function initTableGlow() {
  document.querySelectorAll('.cost-table tbody tr:not(.total-row)').forEach(row => {
    row.addEventListener('mouseenter', () => {
      const cv = row.querySelector('.cv');
      if (cv) cv.style.textShadow = '0 0 10px rgba(255,153,0,0.7)';
    });
    row.addEventListener('mouseleave', () => {
      const cv = row.querySelector('.cv');
      if (cv) cv.style.textShadow = 'none';
    });
  });
}


// ---- KEYBOARD ACCESSIBILITY ----
function initKeyboardAccess() {
  document.querySelectorAll('.flow-node').forEach(node => {
    node.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        node.click();
      }
    });
  });
}


// ---- VIEWPORT HEIGHT FIX ----
function setVh() {
  document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}
setVh();
window.addEventListener('resize', setVh, { passive: true });


// ---- TACTICAL TERMINAL EFFECT (Classified header typing) ----
(function terminalEffect() {
  const stamp = document.querySelector('.classify-stamp');
  if (!stamp) return;

  const texts = [
    'UNCLASSIFIED // ACADEMIC',
    'FOR EDUCATIONAL USE ONLY',
    'FYP RESEARCH PROJECT 2025-26',
    'UNCLASSIFIED // ACADEMIC',
  ];

  let idx = 0;
  let charIdx = 0;
  let deleting = false;

  const type = () => {
    const current = texts[idx];
    if (!deleting) {
      stamp.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      stamp.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? 40 : 80);
  };

  setTimeout(type, 1500);
})();


// ---- RADAR ALERT SOUND EFFECT (visual only) ----
(function radarPing() {
  const dots = document.querySelectorAll('.radar-dot');
  let activeDot = 0;

  setInterval(() => {
    dots.forEach(d => d.style.background = 'var(--amber)');
    const d = dots[activeDot % dots.length];
    if (d) {
      d.style.background = '#ff4400';
      d.style.boxShadow = '0 0 14px #ff4400, 0 0 28px #ff4400';
      setTimeout(() => {
        d.style.background = 'var(--amber)';
        d.style.boxShadow = '0 0 8px var(--amber)';
      }, 800);
    }
    activeDot++;
  }, 2100);
})();


// ---- CONSOLE ----
function printConsoleHeader() {
  console.log('%c🎯 BALLISTIC MISSILE FYP — SYSTEMS ONLINE', 'color:#ff4400; font-family:monospace; font-size:15px; font-weight:bold;');
  console.log('%cSmall-Scale Ballistic Missile Development — Academic Research', 'color:#ff9900; font-family:monospace; font-size:11px;');
  console.log('%c[STATUS] All modules initialized. Launch sequence STANDBY.', 'color:#ffcc00; font-family:monospace; font-size:10px;');
  console.log('%c[NOTICE] This is an academic project. For educational purposes only.', 'color:#888; font-family:monospace; font-size:10px;');
}
