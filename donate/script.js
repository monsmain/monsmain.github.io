document.addEventListener('DOMContentLoaded', () => {

    const config = {
        wallets: [
            { name: "USDT (TRC20)", address: "TPDgDE7nEKHnDLX25wLtdjjs76nAK9pQE7", logo: "images/tether.png" },
            { name: "USDT (Polygon)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/tether.png" },
            { name: "TRX (Tron)", address: "TPDgDE7nEKHnDLX25wLtdjjs76nAK9pQE7", logo: "images/tron.png" },
            { name: "Polygon (Matic)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/polygon.png" },
            { name: "Ethereum", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/ethereum.png" },
            { name: "Solana", address: "BnQ11hLZTDJQBZSzVWxJshT3o1SEUWBn1QahdxTYDH8d", logo: "images/solana.png" },
            { name: "Shiba", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/shiba.png" }
        ],
        translations: {
            en: {
                page_title: "Financial Support", main_title: "Support My Work", main_subtitle: "Your contribution empowers me to create more and better content. Every amount is valuable.", copy_button: "Copy", copied_button: "Copied!", footer_thanks: "Thank you for your support❤️"
            },
            fa: {
                page_title: "حمایت مالی", main_title: "حمایت از فعالیت من", main_subtitle: "کمک شما به من انگیزه می‌دهد تا محتوای بهتر و بیشتری تولید کنم، هر مبلغی برای من ارزشمند است.", copy_button: "کپی", copied_button: "کپی شد!", footer_thanks: "از حمایت شما سپاسگزارم❤️"
            }
        },
        transition_delay: 500 
    };

    const dom = {};

    function setLanguage(lang) {
        const langPack = config.translations[lang] || config.translations.en;

        if (dom.translatableElements) {
            dom.translatableElements.forEach(el => {
                const key = el.getAttribute('data-lang-key');
                if (langPack[key]) {
                    el.textContent = langPack[key];
                }
            });
        }

        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'fa') ? 'rtl' : 'ltr';
        document.body.className = `lang-${lang} loaded`;
        
        if (dom.langSwitcher) {
            dom.langSwitcher.querySelector('.active')?.classList.remove('active');
            dom.langSwitcher.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');
        }
        
        localStorage.setItem('user_lang', lang);
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
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="wallet-header">
                    <img src="${wallet.logo}" alt="${wallet.name} Logo" class="crypto-logo">
                    <h3>${wallet.name}</h3>
                </div>
                <div class="address-bar">
                    <span class="address-text">${wallet.address}</span>
                    <button class="copy-btn" data-address="${wallet.address}" data-lang-key="copy_button"></button>
                </div>`;
            dom.walletContainer.appendChild(card);
        });
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
                        setTimeout(() => {
                            button.textContent = langPack.copy_button;
                        }, 2000);
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
    }

    function init() {
        dom.walletContainer = document.getElementById('wallet-container');
        dom.langSwitcher = document.getElementById('lang-switcher');
        dom.transitionOverlay = document.getElementById('transition-overlay');
        
        if (!dom.walletContainer || !dom.langSwitcher || !dom.transitionOverlay) {
            console.error("Critical elements are missing from the page. Initialization failed.");
            document.body.classList.add('loaded'); 
            return;
        }
        
        renderWallets();
        dom.translatableElements = document.querySelectorAll('[data-lang-key]');
        
        const browserLang = navigator.language.split('-')[0];
        const initialLang = localStorage.getItem('user_lang') || ((browserLang === 'fa') ? 'fa' : 'en');
        
        setLanguage(initialLang);
        setupEventListeners();
        
        document.body.classList.add('loaded');
    }

    init();
});
