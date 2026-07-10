a/donate-upgrade\script.js → b/donate-upgrade\script.js
@@ -0,0 +1,226 @@
+document.addEventListener('DOMContentLoaded', () => {
+
+    const config = {
+        wallets: [
+            { name: "USDT (Bep20)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/tether.png" },
+            { name: "USDT (Polygon)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/tether.png" },
+            { name: "TRX (Tron)", address: "TPDgDE7nEKHnDLX25wLtdjjs76nAK9pQE7", logo: "images/tron.png" },
+            { name: "Polygon (Matic)", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/polygon.png" },
+            { name: "Ethereum", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/ethereum.png" },
+            { name: "Solana", address: "BnQ11hLZTDJQBZSzVWxJshT3o1SEUWBn1QahdxTYDH8d", logo: "images/solana.png" },
+            { name: "Shiba", address: "0xD3fCf0b46D38A423B6f33aaCf041493965AE83C5", logo: "images/shiba.png" }
+        ],
+        rialOptions: [
+            { amount: "۵۰۰,۰۰۰ تومان",    value: 500000,  url: "https://sponsoracb.mydigify.app/products/3019690/%D8%AF%D9%88%D9%86%DB%8C%D8%AA" },
+            { amount: "۱,۰۰۰,۰۰۰ تومان",  value: 1000000, url: "https://sponsoracb.mydigify.app/products/3019691/%D8%AF%D9%88%D9%86%DB%8C%D8%AA" },
+            { amount: "۳,۰۰۰,۰۰۰ تومان",  value: 3000000, url: "https://sponsoracb.mydigify.app/products/3019692/%D8%AF%D9%88%D9%86%DB%8C%D8%AA" },
+            { amount: "۶,۰۰۰,۰۰۰ تومان",  value: 6000000, url: "https://sponsoracb.mydigify.app/products/3019693/%D8%AF%D9%88%D9%86%DB%8C%D8%AA" },
+            { amount: "۸,۰۰۰,۰۰۰ تومان",  value: 8000000, url: "https://sponsoracb.mydigify.app/products/3019694/%D8%AF%D9%88%D9%86%DB%8C%D8%AA" }
+        ],
+        translations: {
+            en: {
+                page_title: "Financial Support",
+                main_title: "Support My Work",
+                main_subtitle: "Your contribution empowers me to create more and better content. Every amount is valuable.",
+                section_crypto: "Crypto Donation",
+                section_rial: "Rial Donation",
+                copy_button: "Copy",
+                copied_button: "Copied!",
+                rial_button: "Donate",
+                footer_thanks: "Thank you for your support❤️"
+            },
+            fa: {
+                page_title: "حمایت مالی",
+                main_title: "حمایت از فعالیت من",
+                main_subtitle: "کمک شما به من انگیزه می‌دهد تا محتوای بهتر و بیشتری تولید کنم، هر مبلغی برای من ارزشمند است.",
+                section_crypto: "حمایت با ارز دیجیتال",
+                section_rial: "حمایت ریالی",
+                copy_button: "کپی",
+                copied_button: "کپی شد!",
+                rial_button: "پرداخت",
+                footer_thanks: "از حمایت شما سپاسگزارم❤️"
+            }
+        },
+        transition_delay: 400
+    };
+
+    const dom = {};
+
+    function safeLocalStorage(action, key, value) {
+        try {
+            if (action === 'get') return localStorage.getItem(key);
+            if (action === 'set') localStorage.setItem(key, value);
+        } catch (_) {
+        }
+        return null;
+    }
+
+    function setLanguage(lang) {
+        const langPack = config.translations[lang] || config.translations.en;
+
+        if (dom.translatableElements) {
+            dom.translatableElements.forEach(el => {
+                const key = el.getAttribute('data-lang-key');
+                if (langPack[key]) {
+                    if (el.tagName === 'BUTTON' && el.classList.contains('copy-btn')) {
+                    } else {
+                        el.textContent = langPack[key];
+                    }
+                }
+            });
+        }
+
+        document.querySelectorAll('.copy-btn').forEach(btn => {
+            btn.textContent = langPack.copy_button;
+        });
… omitted 148 diff line(s) across 1 additional file(s)/section(s)
