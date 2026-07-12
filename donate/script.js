document.addEventListener('DOMContentLoaded', () => {

    const config = {
        wallets: [
            { name: "USDT (Bep20)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/tether.png" },
            { name: "USDT (Polygon)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/tether.png" },
            { name: "TRX (Tron)", address: "TPDgDE7nEKHnDLX25wLtdjjs76nAK9pQE7", logo: "images/tron.png" },
            { name: "Polygon (Matic)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/polygon.png" },
            { name: "Ethereum", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/ethereum.png" },
            { name: "Solana", address: "BnQ11hLZTDJQBZSzVWxJshT3o1SEUWBn1QahdxTYDH8d", logo: "images/solana.png" },
            { name: "Shiba", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/shiba.png" }
        ],
        rialOptions: [
            { amount: "۵۰,۰۰۰ تومان",     value: 50000,    url: "https://sponsoracb.mydigify.app/product/3106809/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-8", featured: false },
            { amount: "۱۰۰,۰۰۰ تومان",    value: 100000,   url: "https://sponsoracb.mydigify.app/product/3106808/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-7", featured: false },
            { amount: "۲۵۰,۰۰۰ تومان",    value: 250000,   url: "https://sponsoracb.mydigify.app/product/3106807/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-6", featured: false },
            { amount: "۵۰۰,۰۰۰ تومان",    value: 500000,   url: "https://sponsoracb.mydigify.app/product/3106772/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-5", featured: false },
            { amount: "۱,۰۰۰,۰۰۰ تومان",  value: 1000000,  url: "https://sponsoracb.mydigify.app/product/3106771/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-4", featured: true },
            { amount: "۳,۰۰۰,۰۰۰ تومان",  value: 3000000,  url: "https://sponsoracb.mydigify.app/product/3106770/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-3", featured: false },
            { amount: "۶,۰۰۰,۰۰۰ تومان",  value: 6000000,  url: "https://sponsoracb.mydigify.app/product/3106762/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-2", featured: false },
            { amount: "۸,۰۰۰,۰۰۰ تومان",  value: 8000000,  url: "https://sponsoracb.mydigify.app/product/3106758/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain", featured: false }
        ],
        translations: {
            en: {
                page_title: "Financial Support",
                main_title: "Support My Work",
                main_subtitle: "Your contribution empowers me to create more and better content. Every amount is valuable.",
                tab_crypto: "Crypto",
                tab_rial: "Rial (تومان)",
                tab_crypto_desc: "USDT, TRX, ETH, SOL & more",
                tab_rial_desc: "Pay in Iranian Rial",
                copy_button: "Copy",
                copied_button: "Copied!",
                rial_button: "Donate",
                rial_popular: "Popular",
                footer_thanks: "Thank you for your support❤️",
                qr_hint: "Scan with your wallet app"
            },
            fa: {
                page_title: "حمایت مالی",
                main_title: "حمایت از فعالیت من",
                main_subtitle: "کمک شما به من انگیزه می‌دهد تا محتوای بهتر و بیشتری تولید کنم، هر مبلغی برای من ارزشمند است.",
                tab_crypto: "ارز دیجیتال",
                tab_rial: "ریالی (تومان)",
                tab_crypto_desc: "USDT، ترون، اتریوم، سولانا و...",
                tab_rial_desc: "پرداخت به تومان",
                copy_button: "کپی",
                copied_button: "کپی شد!",
                rial_button: "پرداخت",
                rial_popular: "محبوب",
                footer_thanks: "از حمایت شما سپاسگزارم❤️",
                qr_hint: "با کیف پول خود اسکن کنید"
            }
        },
        transition_delay: 400
    };

    const dom = {};
    const animatedElements = new WeakSet();

    function safeLocalStorage(action, key, value) {
        try {
            if (action === 'get') return localStorage.getItem(key);
            if (action === 'set') localStorage.setItem(key, value);
        } catch (_) {
            /* storage unavailable: private mode, quota, etc — silently degrade */
        }
        return null;
    }

    function setLanguage(lang) {
        const langPack = config.translations[lang] || config.translations.en;

        if (dom.translatableElements) {
            dom.translatableElements.forEach(el => {
                const key = el.getAttribute('data-lang-key');
                if (langPack[key]) {
                    if (el.classList.contains('copy-btn')) return;
                    if (el.classList.contains('rial-btn')) return;

                    const wasAnimated = animatedElements.has(el);

                    if (wasAnimated) {
                        el.removeAttribute('data-split');
                        el.textContent = langPack[key];
                    } else {
                        el.textContent = langPack[key];
                    }
                }
            });
        }

        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.textContent = langPack.copy_button;
        });
        document.querySelectorAll('.rial-btn').forEach(btn => {
            btn.textContent = langPack.rial_button;
        });

        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'fa') ? 'rtl' : 'ltr';
        document.body.className = `lang-${lang} loaded`;

        if (dom.langSwitcher) {
            dom.langSwitcher.querySelector('.active')?.classList.remove('active');
            dom.langSwitcher.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');
        }

        safeLocalStorage('set', 'user_lang', lang);

        reSplitAnimatedTexts(lang);
    }

    function reSplitAnimatedTexts(lang) {
        const h1 = document.querySelector('header h1');
        const subtitle = document.querySelector('header p');
        if (h1) splitTextToLetters(h1);
        if (subtitle) splitTextToWords(subtitle);
    }

    function performLanguageTransition(newLang) {
        if (!dom.transitionOverlay) {
            setLanguage(newLang);
            return;
        }

        dom.transitionOverlay.classList.add('active');

        setTimeout(() => {
            setLanguage(newLang);
            dom.transitionOverlay.classList.remove('active');
        }, config.transition_delay);
    }

    function renderWallets() {
        if (!dom.walletContainer) return;
        dom.walletContainer.innerHTML = '';
        config.wallets.forEach((wallet, index) => {
            const card = document.createElement('div');
            card.className = 'wallet-card';
            card.style.animationDelay = `${index * 0.08}s`;
            card.innerHTML =
                `<div class="wallet-header">
                    <img src="${wallet.logo}" alt="${wallet.name} Logo" class="crypto-logo" loading="lazy">
                    <h3>${wallet.name}</h3>
                </div>
                <div class="address-bar">
                    <span class="address-text">${wallet.address}</span>
                    <div class="address-actions">
                        <button class="qr-btn" data-qr="${wallet.address}" data-name="${wallet.name}" title="QR">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1"/>
                                <rect x="14" y="3" width="7" height="7" rx="1"/>
                                <rect x="3" y="14" width="7" height="7" rx="1"/>
                                <rect x="14" y="14" width="3" height="3" rx="0.5"/>
                                <rect x="18" y="18" width="3" height="3" rx="0.5"/>
                                <rect x="14" y="18" width="3" height="3" rx="0.5"/>
                                <rect x="18" y="14" width="3" height="3" rx="0.5"/>
                            </svg>
                        </button>
                        <button class="copy-btn" data-address="${wallet.address}" data-lang-key="copy_button"></button>
                    </div>
                </div>`;
            dom.walletContainer.appendChild(card);
        });
    }

    function renderRialOptions() {
        if (!dom.rialContainer) return;
        dom.rialContainer.innerHTML = '';
        config.rialOptions.forEach((option, index) => {
            const card = document.createElement('div');
            card.className = 'rial-card';
            if (option.featured) card.classList.add('featured');
            card.style.animationDelay = `${index * 0.08}s`;
            const featuredBadge = option.featured ? '<span class="rial-badge" data-lang-key="rial_popular"></span>' : '';
            card.innerHTML =
                `<div class="rial-header">
                    <span class="rial-amount">${option.amount}</span>
                    ${featuredBadge}
                </div>
                <div class="rial-bar">
                    <span class="rial-value">${option.amount}</span>
                    <a href="${option.url}" target="_blank" class="rial-btn" data-lang-key="rial_button" rel="noopener"></a>
                </div>`;
            dom.rialContainer.appendChild(card);
        });
    }

    function switchTab(tab) {
        const tabs = document.querySelectorAll('.tab-btn');
        const panels = document.querySelectorAll('.tab-panel');

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        const activeTab = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
        const activePanel = document.querySelector(`.tab-panel[data-panel="${tab}"]`);

        if (activeTab) activeTab.classList.add('active');
        if (activePanel) activePanel.classList.add('active');

        safeLocalStorage('set', 'donate_tab', tab);
    }

    function setupEventListeners() {
        if (dom.walletContainer) {
            dom.walletContainer.addEventListener('click', (e) => {
                var qrBtn = e.target.closest('.qr-btn');
                if (qrBtn) {
                    var addr = qrBtn.dataset.qr;
                    var name = qrBtn.dataset.name || '';
                    openQRModal(addr, name);
                    return;
                }

                if (e.target.classList.contains('copy-btn')) {
                    const button = e.target;
                    const address = button.dataset.address;
                    const currentLang = document.documentElement.lang;
                    const langPack = config.translations[currentLang] || config.translations.en;

                    navigator.clipboard.writeText(address).then(() => {
                        button.textContent = langPack.copied_button;
                        button.classList.add('copied');
                        setTimeout(() => {
                            button.textContent = langPack.copy_button;
                            button.classList.remove('copied');
                        }, 2000);
                    }).catch(() => {
                        try {
                            const ta = document.createElement('textarea');
                            ta.value = address;
                            ta.style.position = 'fixed';
                            ta.style.left = '-9999px';
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand('copy');
                            document.body.removeChild(ta);
                            button.textContent = langPack.copied_button;
                            setTimeout(() => {
                                button.textContent = langPack.copy_button;
                            }, 2000);
                        } catch (_) {
                            button.textContent = 'Error';
                            setTimeout(() => {
                                button.textContent = langPack.copy_button;
                            }, 2000);
                        }
                    });
                }
            });
        }

        var qrOverlay = document.getElementById('qr-overlay');
        var qrClose = document.getElementById('qr-close');

        if (qrClose) {
            qrClose.addEventListener('click', closeQRModal);
        }
        if (qrOverlay) {
            qrOverlay.addEventListener('click', function(e) {
                if (e.target === qrOverlay) closeQRModal();
            });
        }
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && qrOverlay && qrOverlay.classList.contains('active')) {
                closeQRModal();
            }
        });

        if (dom.langSwitcher) {
            dom.langSwitcher.addEventListener('click', (e) => {
                const langButton = e.target.closest('[data-lang]');
                if (langButton) {
                    const newLang = langButton.dataset.lang;
                    if (newLang !== document.documentElement.lang) {
                        performLanguageTransition(newLang);
                    }
                }
            });
        }

        if (dom.tabContainer) {
            dom.tabContainer.addEventListener('click', (e) => {
                const tabBtn = e.target.closest('.tab-btn');
                if (tabBtn) {
                    const tab = tabBtn.dataset.tab;
                    if (tab) switchTab(tab);
                }
            });
        }
    }

    function openQRModal(address, name) {
        var overlay = document.getElementById('qr-overlay');
        var qrCode = document.getElementById('qr-code');
        var qrTitle = document.getElementById('qr-title');
        if (!overlay || !qrCode || typeof QRCode === 'undefined') return;

        var lang = document.documentElement.lang;
        var lp = config.translations[lang] || config.translations.en;

        qrTitle.textContent = name + (lang === 'fa' ? ' — اسکن کنید' : ' — Scan to Pay');

        qrCode.innerHTML = '';
        new QRCode(qrCode, {
            text: address,
            width: 200,
            height: 200,
            colorDark: '#0a0c14',
            colorLight: '#f0f0f0',
            correctLevel: QRCode.CorrectLevel.M
        });

        var canvas = qrCode.querySelector('canvas');
        if (canvas) {
            canvas.style.borderRadius = '12px';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
        }

        var hint = document.querySelector('.qr-hint');
        if (hint) hint.textContent = lp.qr_hint || '';

        overlay.classList.add('active');
    }

    function closeQRModal() {
        var overlay = document.getElementById('qr-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    function splitTextToLetters(el) {
        var text = el.textContent;
        el.textContent = '';
        var words = text.split(' ');
        var letterIdx = 0;
        words.forEach(function (word, wi) {
            var wordSpan = document.createElement('span');
            wordSpan.className = 'word-wrap';
            var letters = word.split('');
            letters.forEach(function (ch) {
                var span = document.createElement('span');
                span.className = 'letter';
                span.textContent = ch;
                span.style.animationDelay = (0.6 + letterIdx * 0.04) + 's';
                wordSpan.appendChild(span);
                letterIdx++;
            });
            el.appendChild(wordSpan);
            if (wi < words.length - 1) {
                el.appendChild(document.createTextNode(' '));
            }
        });
        animatedElements.add(el);
    }

    function splitTextToWords(el) {
        var text = el.textContent;
        var words = text.split(' ');
        el.textContent = '';
        var baseDelay = 1.0;
        words.forEach(function (w, i) {
            var span = document.createElement('span');
            span.className = 'word';
            span.textContent = w;
            span.style.animationDelay = (baseDelay + i * 0.06) + 's';
            el.appendChild(span);
            if (i < words.length - 1) {
                el.appendChild(document.createTextNode(' '));
            }
        });
        animatedElements.add(el);
    }

    function setup3DTilt() {
        var cards = document.querySelectorAll('.wallet-card, .rial-card');
        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = 'perspective(800px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg) translateY(-5px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    function setupScrollReveal() {
        if (!('IntersectionObserver' in window)) return;
        var els = document.querySelectorAll('[data-reveal]');
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        els.forEach(function (el) { obs.observe(el); });
    }

    function setupParallax() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var parallaxEls = document.querySelectorAll('[data-parallax]');
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var sy = window.scrollY;
                    parallaxEls.forEach(function (el) {
                        var speed = parseFloat(el.dataset.parallax) || 0.3;
                        el.style.transform = 'translateY(' + (sy * speed) + 'px)';
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    function init() {
        dom.walletContainer = document.getElementById('wallet-container');
        dom.rialContainer = document.getElementById('rial-container');
        dom.langSwitcher = document.getElementById('lang-switcher');
        dom.transitionOverlay = document.getElementById('transition-overlay');
        dom.tabContainer = document.getElementById('tab-container');

        if (!dom.walletContainer || !dom.rialContainer || !dom.langSwitcher || !dom.transitionOverlay) {
            console.error("Critical elements are missing from the page. Initialization failed.");
            document.body.classList.add('loaded');
            return;
        }

        renderWallets();
        renderRialOptions();
        dom.translatableElements = document.querySelectorAll('[data-lang-key]');

        const browserLang = navigator.language.split('-')[0];
        const initialLang = safeLocalStorage('get', 'user_lang') || ((browserLang === 'fa') ? 'fa' : 'en');

        setLanguage(initialLang);

        const savedTab = safeLocalStorage('get', 'donate_tab') || 'crypto';
        switchTab(savedTab);

        setupEventListeners();
        setup3DTilt();
        setupScrollReveal();
        setupParallax();

        document.body.classList.add('loaded');

        var intro = document.getElementById('intro-overlay');
        var introText = document.getElementById('intro-text');
        if (intro && introText) {
            var introChars = '▮▮▮▮▮▮▮▮';
            var chars = introChars.split('');
            var idx = 0;
            var introTimer = setInterval(function () {
                if (idx <= chars.length) {
                    introText.textContent = chars.slice(0, idx).join('') + ' INIT';
                    idx++;
                } else {
                    clearInterval(introTimer);
                }
            }, 120);
            setTimeout(function () {
                intro.classList.add('hidden');
            }, 2000);
        }
    }

    init();
});
