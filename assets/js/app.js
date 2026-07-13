import { CodeUniverse } from './scene.js';
import { TypeEffect, CounterAnim, SectionReveal } from './effects.js';

let canvas3D = null;
let universe = null;

function init3D() {
    canvas3D = document.getElementById('bg-canvas');
    if (!canvas3D) return;

    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    if (isMobile || isLowEnd) {
        canvas3D.style.display = 'block';
        universe = new CodeUniverse(canvas3D);
    } else {
        universe = new CodeUniverse(canvas3D);
    }
}

function initTyped() {
    const typedEl = document.getElementById('typed');
    if (!typedEl) return;

    const onLangChange = () => {
        const words = i18n.t('hero.typed') || ['Hello World'];
        new TypeEffect(typedEl, words);
    };

    document.addEventListener('langchange', () => {
        typedEl.textContent = '';
        onLangChange();
    });

    onLangChange();
}

function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length) CounterAnim.observe(stats);
}

function initReveals() {
    SectionReveal.init();
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initBackToTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) btn.classList.add('visible');
        else btn.classList.remove('visible');
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initPrivacy() {
    if (window.location.pathname.includes('donate')) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

async function main() {
    await i18n.init();
    init3D();
    initTyped();
    initStats();
    initReveals();
    initSmoothScroll();
    initBackToTop();
}

document.addEventListener('DOMContentLoaded', main);
