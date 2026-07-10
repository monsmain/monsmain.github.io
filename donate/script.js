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
                footer_thanks: "Thank you for your support❤️"
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
                footer_thanks: "از حمایت شما سپاسگزارم❤️"
            }
        },
        transition_delay: 400
    };

    const dom = {};

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
                    el.textContent = langPack[key];
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
    }

    function performLanguageTransition(newLang) {
        if (!dom.transitionOverlay) return;
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
                    <button class="copy-btn" data-address="${wallet.address}" data-lang-key="copy_button"></button>
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

        document.body.classList.add('loaded');
    }

    init();
});