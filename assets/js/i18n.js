class I18n {
  constructor() {
    this.currentLang = 'fa';
    this.translations = {};
    this.loaded = false;
    this.transitionOverlay = null;
    this.basePath = this._detectBasePath();
  }

  _detectBasePath() {
    const p = window.location.pathname;
    if (p.includes('/blog/') || p.includes('/donate/')) return '../';
    return './';
  }

  _safeLocalStorage(action, key, value) {
    try {
      if (action === 'get') return localStorage.getItem(key);
      if (action === 'set') localStorage.setItem(key, value);
    } catch (_) {  }
    return null;
  }

  _getNested(obj, path) {
    return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
  }

  async load() {
    try {
      const [en, fa] = await Promise.all([
        fetch(this.basePath + 'locales/en.json'),
        fetch(this.basePath + 'locales/fa.json'),
      ]);
      if (!en.ok || !fa.ok) throw new Error(`HTTP ${en.status}/${fa.status}`);
      this.translations.en = await en.json();
      this.translations.fa = await fa.json();
      this.loaded = true;
    } catch (e) {
      console.error('[i18n] failed to load translations:', e);
    }
  }

  async init() {
    await this.load();
    if (!this.loaded) return;

    this.transitionOverlay = document.getElementById('transition-overlay');

    const stored = this._safeLocalStorage('get', 'user_lang');
    const browserLang = (navigator.language || 'en').split('-')[0];
    this.currentLang = stored || (browserLang === 'fa' ? 'fa' : 'en');

    this.apply(this.currentLang);
    this._setupSwitcher();
    document.body.classList.add('loaded');
  }

  apply(lang) {
    const pack = this.translations[lang] || this.translations.en;
    this.currentLang = lang;

    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'fa') ? 'rtl' : 'ltr';

    document.body.classList.remove('lang-fa', 'lang-en');
    document.body.classList.add('lang-' + lang);
    document.body.classList.add('loaded');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = this._getNested(pack, el.getAttribute('data-i18n'));
      if (value == null) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = value;
      else el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.getAttribute('data-i18n-attr').split(',').forEach((pair) => {
        const [attr, key] = pair.trim().split(':');
        const value = this._getNested(pack, key);
        if (value != null) el.setAttribute(attr, value);
      });
    });

    document.querySelectorAll('.copy-btn').forEach((btn) => {
      if (btn.dataset.langKey) btn.textContent = this._getNested(pack, btn.dataset.langKey) || 'QR';
    });

    this._safeLocalStorage('set', 'user_lang', lang);

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    document.querySelectorAll('.lang-switcher').forEach((el) => {
      el.dataset.active = lang;
    });

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  _setupSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;

    switcher.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lang]');
      const next = btn ? btn.dataset.lang : (this.currentLang === 'fa' ? 'en' : 'fa');
      if (next !== this.currentLang) this._transition(next);
    });
  }

  _transition(newLang) {
    if (this.transitionOverlay) {
      this.transitionOverlay.classList.add('active');
      setTimeout(() => {
        this.apply(newLang);
        this.transitionOverlay.classList.remove('active');
      }, 400);
    } else {
      this.apply(newLang);
    }
  }

  t(key) {
    const pack = this.translations[this.currentLang] || this.translations.en;
    const v = this._getNested(pack, key);
    return v == null ? key : v;
  }
}

window.i18n = new I18n();
