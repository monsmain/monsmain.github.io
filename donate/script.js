document.addEventListener('DOMContentLoaded', () => {

    const config = {
        wallets: [
            { name: "USDT (Bep20)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/tether.png" },
            { name: "USDT (Polygon)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/tether.png" },
            { name: "TRX (Tron)", address: "TPDgDE7nEKHnDLX25wLtdjjs76nAK9pQE7", logo: "images/tron.png" },
            { name: "Polygon (Matic)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/polygon.png" },
            { name: "Ethereum", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/ethereum.png" },
            { name: "Solana", address: "BnQ11hLZTDJQBZSzVWxJshT3o1SEUWBn1QahdxTYDH8d", logo: "images/solana.png" },
            { name: "Shiba", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/shiba.png" },
            { name: "TON", address: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c", logo: "images/ton.png" }
        ],
        rialOptions: [
            { amount: "۵۰,۰۰۰ تومان",     amountEn: "50,000 Toman",   value: 50000,    url: "https://sponsoracb.mydigify.app/product/3106809/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-8", featured: false },
            { amount: "۱۰۰,۰۰۰ تومان",    amountEn: "100,000 Toman",  value: 100000,   url: "https://sponsoracb.mydigify.app/product/3106808/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-7", featured: false },
            { amount: "۲۵۰,۰۰۰ تومان",    amountEn: "250,000 Toman",  value: 250000,   url: "https://sponsoracb.mydigify.app/product/3106807/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-6", featured: false },
            { amount: "۵۰۰,۰۰۰ تومان",    amountEn: "500,000 Toman",  value: 500000,   url: "https://sponsoracb.mydigify.app/product/3106772/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-5", featured: false },
            { amount: "۱,۰۰۰,۰۰۰ تومان",  amountEn: "1,000,000 Toman", value: 1000000,  url: "https://sponsoracb.mydigify.app/product/3106771/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-4", featured: true },
            { amount: "۳,۰۰۰,۰۰۰ تومان",  amountEn: "3,000,000 Toman", value: 3000000,  url: "https://sponsoracb.mydigify.app/product/3106770/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-3", featured: false },
            { amount: "۶,۰۰۰,۰۰۰ تومان",  amountEn: "6,000,000 Toman", value: 6000000,  url: "https://sponsoracb.mydigify.app/product/3106762/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain-2", featured: false },
            { amount: "۸,۰۰۰,۰۰۰ تومان",  amountEn: "8,000,000 Toman", value: 8000000,  url: "https://sponsoracb.mydigify.app/product/3106758/%D8%AF%D9%88%D9%86%DB%8C%D8%AA-%D8%B1%DB%8C%D8%A7%D9%84%DB%8C-%7C-monsmain", featured: false }
        ]
    };

    const dom = {};

    function safeLocalStorage(action, key, value) {
        try {
            if (action === 'get') return localStorage.getItem(key);
            if (action === 'set') localStorage.setItem(key, value);
        } catch (_) {}
        return null;
    }

    function t(key) {
        if (typeof i18n !== 'undefined' && i18n.translations && i18n.translations[i18n.currentLang]) {
            return i18n.t(key);
        }
        return key;
    }

    function updateDonateTexts() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.textContent = t('donate.copy_button');
        });
        document.querySelectorAll('.rial-btn').forEach(btn => {
            btn.textContent = t('donate.rial_button');
        });
        const qrTitle = document.querySelector('.qr-title');
        if (qrTitle) qrTitle.textContent = t('donate.qr_scan');
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
                        <button class="qr-btn" data-address="${wallet.address}" data-lang-key="donate.qr_button">${t('donate.qr_button')}</button>
                        <button class="copy-btn" data-address="${wallet.address}">${t('donate.copy_button')}</button>
                    </div>
                </div>`;
            dom.walletContainer.appendChild(card);
        });
    }

    function renderRialOptions() {
        if (!dom.rialContainer) return;
        dom.rialContainer.innerHTML = '';
        const lang = document.documentElement.lang;
        config.rialOptions.forEach((option, index) => {
            const amt = (lang === 'en' && option.amountEn) ? option.amountEn : option.amount;
            const card = document.createElement('div');
            card.className = 'rial-card';
            if (option.featured) card.classList.add('featured');
            card.style.animationDelay = `${index * 0.08}s`;
            const featuredBadge = option.featured ? `<span class="rial-badge">${t('donate.rial_popular')}</span>` : '';
            card.innerHTML =
                `<div class="rial-header">
                    <span class="rial-amount">${amt}</span>
                    ${featuredBadge}
                </div>
                <div class="rial-bar">
                    <span class="rial-value">${amt}</span>
                    <a href="${option.url}" target="_blank" class="rial-btn" rel="noopener">${t('donate.rial_button')}</a>
                </div>`;
            dom.rialContainer.appendChild(card);
        });
    }

    function showQR(address) {
        if (!dom.qrModal || !dom.qrCanvas) return;
        if (typeof QRious === 'undefined') return;
        dom.qrCanvas.width = 220;
        dom.qrCanvas.height = 220;
        new QRious({
            element: dom.qrCanvas,
            value: address,
            size: 220,
            background: '#ffffff',
            foreground: '#05070f',
            level: 'M'
        });
        if (dom.qrAddressText) dom.qrAddressText.textContent = address;
        dom.qrModal.classList.add('active');
        dom.qrModal.setAttribute('aria-hidden', 'false');
    }

    function hideQR() {
        if (!dom.qrModal) return;
        dom.qrModal.classList.remove('active');
        dom.qrModal.setAttribute('aria-hidden', 'true');
    }

    function switchTab(tab) {
        const validTabs = ['crypto', 'rial'];
        if (!validTabs.includes(tab)) tab = 'crypto';

        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        const activeTab = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
        const activePanel = document.querySelector(`.tab-panel[data-panel="${tab}"]`);

        if (activeTab) activeTab.classList.add('active');
        if (activePanel) activePanel.classList.add('active');

        safeLocalStorage('set', 'donate_tab', tab);
    }

    function copyToClipboard(address, button) {
        const copyText = t('donate.copied_button');
        const resetText = t('donate.copy_button');
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(address).then(() => {
                button.textContent = copyText;
                button.classList.add('copied');
                setTimeout(() => { button.textContent = resetText; button.classList.remove('copied'); }, 2000);
            }).catch(() => fallbackCopy(address, button, copyText, resetText));
        } else {
            fallbackCopy(address, button, copyText, resetText);
        }
    }

    function fallbackCopy(address, button, copyText, resetText) {
        try {
            const ta = document.createElement('textarea');
            ta.value = address;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            button.textContent = copyText;
            button.classList.add('copied');
            setTimeout(() => { button.textContent = resetText; button.classList.remove('copied'); }, 2000);
        } catch (_) {
            button.textContent = 'Error';
            setTimeout(() => { button.textContent = resetText; }, 2000);
        }
    }

    function setupEventListeners() {
        if (dom.walletContainer) {
            dom.walletContainer.addEventListener('click', (e) => {
                const copyBtn = e.target.closest('.copy-btn');
                const qrBtn = e.target.closest('.qr-btn');
                if (copyBtn) copyToClipboard(copyBtn.dataset.address, copyBtn);
                if (qrBtn) showQR(qrBtn.dataset.address);
            });
        }

        if (dom.tabContainer) {
            dom.tabContainer.addEventListener('click', (e) => {
                const tabBtn = e.target.closest('.tab-btn');
                if (tabBtn) switchTab(tabBtn.dataset.tab);
            });
        }

        if (dom.qrModal) {
            const closeBtn = dom.qrModal.querySelector('.qr-close');
            if (closeBtn) closeBtn.addEventListener('click', hideQR);
            dom.qrModal.addEventListener('click', (e) => { if (e.target === dom.qrModal) hideQR(); });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dom.qrModal && dom.qrModal.classList.contains('active')) hideQR();
        });

        document.addEventListener('langchange', () => {
            setTimeout(() => {
                renderWallets();
                renderRialOptions();
                updateDonateTexts();
            }, 50);
        });
    }

    function init() {
        dom.walletContainer = document.getElementById('wallet-container');
        dom.rialContainer = document.getElementById('rial-container');
        dom.tabContainer = document.getElementById('tab-container');
        dom.qrModal = document.getElementById('qr-modal');
        dom.qrCanvas = document.getElementById('qr-canvas');
        dom.qrAddressText = document.getElementById('qr-address-text');

        if (!dom.walletContainer || !dom.rialContainer) return;

        renderWallets();
        renderRialOptions();

        const savedTab = safeLocalStorage('get', 'donate_tab') || 'crypto';
        switchTab(savedTab);

        setupEventListeners();

        const checkLang = () => {
            if (document.body.classList.contains('loaded')) {
                updateDonateTexts();
            } else {
                setTimeout(checkLang, 100);
            }
        };
        checkLang();
    }

    init();
});
