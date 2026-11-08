import { TypeEffect, CounterAnim, SectionReveal } from './effects.js';

let universe = null;
let typedEffect = null;

async function init3D() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  try {
    const { GalaxyBackground } = await import('./scene.js');
    universe = new GalaxyBackground(canvas);
  } catch (e) {
    console.warn('[3D] galaxy init failed (using fallback gradient):', e);
    canvas.style.background = 'radial-gradient(ellipse at 50% 60%, #1b2a6b 0%, #0a0f2e 45%, #000 100%)';
  }
}

function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;

  const start = () => {
    const words = i18n.t('hero.typed');
    if (typedEffect && typedEffect.stop) typedEffect.stop();
    typedEffect = new TypeEffect(el, Array.isArray(words) ? words : [words || '']);
  };
  start();
  document.addEventListener('langchange', start);
}

function initStats() {
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length) CounterAnim.observe(stats);
}

function initReveals() {
  SectionReveal.init();
}

function initSmoothScroll() {
  const getNavH = () => {
    const nav = document.querySelector('.nav');
    return nav ? nav.offsetHeight : 64;
  };
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    link.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = href === '#home'
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - getNavH() - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

function initBackToTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initMenu() {
  const hamburger = document.getElementById('hamburger');
  const panel = document.getElementById('menu-panel');
  const overlay = document.getElementById('menu-overlay');
  if (!hamburger || !panel) return;

  const toggle = (force) => {
    const open = force != null ? force : !panel.classList.contains('open');
    panel.classList.toggle('open', open);
    overlay && overlay.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  };

  hamburger.addEventListener('click', () => toggle());
  if (overlay) overlay.addEventListener('click', () => toggle(false));
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => { if (panel.classList.contains('open')) toggle(false); });
  });
}

function initBottomNav() {
  const links = Array.from(document.querySelectorAll('.bottom-nav .bn-link'));
  if (!links.length) return;

  const anchors = links
    .map((link) => ({ link, href: link.getAttribute('href') || '' }))
    .filter((item) => item.href.length > 1 && item.href.startsWith('#'))
    .map((item) => ({ link: item.link, target: document.querySelector(item.href) }))
    .filter((item) => item.target);
  if (!anchors.length) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const probe = window.innerHeight * 0.35;
    let current = anchors[0];
    anchors.forEach((item) => {
      if (item.target.getBoundingClientRect().top <= probe) current = item;
    });
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = anchors[anchors.length - 1];
    links.forEach((link) => link.classList.toggle('active', link === current.link));
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

async function main() {
  try {
    await i18n.init();
  } catch (e) {
    console.error('[app] i18n failed:', e);
  }
  document.body.classList.add('loaded');
  init3D();
  initTyped();
  initStats();
  initReveals();
  initSmoothScroll();
  initBackToTop();
  initMenu();
  initBottomNav();
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main().catch((e) => console.error('[app] boot failed:', e));
}

window.addEventListener('pagehide', () => { if (universe) universe.dispose(); });
