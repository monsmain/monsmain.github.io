class TypeEffect {
    constructor(element, words, options = {}) {
        this.el = element;
        this.words = words;
        this.typeSpeed = options.typeSpeed || 60;
        this.backSpeed = options.backSpeed || 30;
        this.pauseTime = options.pauseTime || 2000;
        this.index = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this._tick();
    }

    _tick() {
        const word = this.words[this.index];
        let txt = '';

        if (this.isDeleting) {
            txt = word.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            txt = word.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        this.el.textContent = txt;

        let delay = this.isDeleting ? this.backSpeed : this.typeSpeed;

        if (!this.isDeleting && this.charIndex === word.length) {
            delay = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.index = (this.index + 1) % this.words.length;
            delay = 300;
        }

        setTimeout(() => this._tick(), delay);
    }
}

class CounterAnim {
    static observe(elements) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target || '0');
                    const duration = 2000;
                    const start = performance.now();

                    const step = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target).toLocaleString();
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        elements.forEach(el => observer.observe(el));
    }
}

class SectionReveal {
    static init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
}

export { TypeEffect, CounterAnim, SectionReveal };
