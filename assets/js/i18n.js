class I18n {
    constructor() {
        this.currentLang = 'fa';
        this.translations = {};
        this.loaded = false;
        this.transitionOverlay = null;
        this.basePath = this._detectBasePath();
    }

    _detectBasePath() {
        const path = window.location.pathname;
        if (path.includes('/blog/') || path.includes('/donate/')) {
            return '../';
        }
        return './';
    }

    _safeLocalStorage(action, key, value) {
        try {
            if (action === 'get') return localStorage.getItem(key);
            if (action === 'set') localStorage.setItem(key, value);
        } catch (_) {}
        return null;
    }

    async load() {
        try {
            const [enRes, faRes] = await Promise.all([
                fetch(this.basePath + 'locales/en.json'),
                fetch(this.basePath + 'locales/fa.json')
            ]);
            this.translations.en = await enRes.json();
            this.translations.fa = await faRes.json();
            this.loaded = true;
        } catch (e) {
            console.error('Failed to load translations:', e);
        }
    }

    async init() {
        await this.load();
        if (!this.loaded) return;

        this.transitionOverlay = document.getElementById('transition-overlay');

        const browserLang = navigator.language.split('-')[0];
        this.currentLang = this._safeLocalStorage('get', 'user_lang') || (browserLang === 'fa' ? 'fa' : 'en');

        this.apply(this.currentLang);
        this._setupSwitcher();
        document.body.classList.add('loaded');
    }

    apply(lang) {
        this.currentLang = lang;
        const pack = this.translations[lang] || this.translations.en;

        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'fa') ? 'rtl' : 'ltr';
        document.body.className = `lang-${lang} loaded`;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = this._getNested(pack, key);
            if (value !== undefined) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = value;
                } else {
                    el.textContent = value;
                }
            }
        });

        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const pairs = el.getAttribute('data-i18n-attr').split(',');
            pairs.forEach(pair => {
                const [attr, key] = pair.trim().split(':');
                const value = this._getNested(pack, key);
                if (value !== undefined) {
                    el.setAttribute(attr, value);
                }
            });
        });

        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.textContent = pack.donate.copy_button;
        });

        this._safeLocalStorage('set', 'user_lang', lang);

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }

    _getNested(obj, path) {
        return path.split('.').reduce((acc, key) => acc && acc[key], obj);
    }

    _setupSwitcher() {
        const switcher = document.getElementById('lang-switcher');
        if (!switcher) return;

        switcher.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-lang]');
            if (btn) {
                const newLang = btn.dataset.lang;
                if (newLang !== this.currentLang) this._transition(newLang);
                return;
            }
            const newLang = this.currentLang === 'fa' ? 'en' : 'fa';
            this._transition(newLang);
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
        return this._getNested(pack, key);
    }
}

const i18n = new I18n();
