import * as THREE from 'three';

THREE.ColorManagement.enabled = false;

class GalaxyBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.isMobile =
      window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.params = {
      count: this.isMobile ? 40000 : 100000,
      size: this.isMobile ? 0.014 : 0.01,
      radius: 2.15,
      branches: 3,
      spin: 3,
      randomness: 5,
      randomnessPower: 4,
      insideColor: '#ff6030',
      outsideColor: '#0949f0',
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
    this.camera.position.set(3, 3, 3);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'low-power',
    });
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.setClearColor(0x000000, 1);

    this.baseY = 3;
    this.time = 0;
    this.last = 0;
    this.scrollTarget = 0;
    this.scrollCurrent = 0;
    this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    this.lastW = 0;
    this.lastH = 0;
    this._rafId = null;
    this._running = false;
    this._disposed = false;

    this._onResize = this._onResize.bind(this);
    this._onVisibility = this._onVisibility.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onPointer = this._onPointer.bind(this);

    this._buildGalaxy();
    this._onResize();
    this._bindEvents();

    if (this.reducedMotion) {
      this._frame(0);
    } else {
      this._start();
    }
  }

  _buildGalaxy() {
    const p = this.params;
    const positions = new Float32Array(p.count * 3);
    const colors = new Float32Array(p.count * 3);
    const colorInside = new THREE.Color(p.insideColor);
    const colorOutside = new THREE.Color(p.outsideColor);
    const signs = [1, -1];

    for (let i = 0; i < p.count; i++) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random() * p.randomness, Math.random() * p.radius);
      const spinAngle = radius * p.spin;
      const branchAngle = ((i % p.branches) / p.branches) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), p.randomnessPower) * signs[Math.floor(Math.random() * 2)];
      const randomY = Math.pow(Math.random(), p.randomnessPower) * signs[Math.floor(Math.random() * 2)];
      const randomZ = Math.pow(Math.random(), p.randomnessPower) * signs[Math.floor(Math.random() * 2)];

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixed = colorInside.clone();
      mixed.lerp(colorOutside, (Math.random() * radius) / p.radius);
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.material = new THREE.PointsMaterial({
      size: p.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  _bindEvents() {
    window.addEventListener('resize', this._onResize);
    window.addEventListener('orientationchange', this._onResize);
    document.addEventListener('visibilitychange', this._onVisibility);
    if (!this.reducedMotion) {
      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('pointermove', this._onPointer, { passive: true });
      this._onScroll();
    }
  }

  _onScroll() {
    this.scrollTarget = Math.max(0, window.scrollY || window.pageYOffset || 0);
  }

  _onPointer(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    this.pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    this.pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  _onResize() {
    if (this._disposed) return;
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    if (w === this.lastW && h === this.lastH) return;
    this.lastW = w;
    this.lastH = h;

    const aspect = w / h;
    this.camera.aspect = aspect;
    this.baseY = 3 + (1 - Math.min(aspect, 1)) * 1.5;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.5 : 2));
    this.renderer.setSize(w, h, false);

    if (this.reducedMotion) this._frame(0);
  }

  _onVisibility() {
    if (this._disposed || this.reducedMotion) return;
    if (document.hidden) this._stop();
    else this._start();
  }

  _start() {
    if (this._disposed || this._running || document.hidden) return;
    this._running = true;
    this.last = performance.now();
    this._animate(this.last);
  }

  _stop() {
    this._running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _frame(t) {
    const px = this.scrollCurrent;
    const depth = 1 - Math.exp(-px / 1800);
    const angle = t * 0.05 + px * 0.0009;
    const radius = 1 + depth * 1.6;
    const height = this.baseY * (1 - depth * 0.5);

    this.camera.position.x = Math.cos(angle) * radius + this.pointer.x * 0.3;
    this.camera.position.z = Math.sin(angle) * radius;
    this.camera.position.y = height - this.pointer.y * 0.2;
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }

  _animate(now) {
    if (!this._running || this._disposed) return;
    const dt = Math.min(Math.max((now - this.last) / 1000, 0), 0.1);
    this.last = now;
    const k = 1 - Math.exp(-dt * 5);
    this.scrollCurrent += (this.scrollTarget - this.scrollCurrent) * k;
    this.pointer.x += (this.pointer.tx - this.pointer.x) * k;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * k;
    this.time += dt;
    this._frame(this.time);
    this._rafId = requestAnimationFrame((n) => this._animate(n));
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this._stop();
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('orientationchange', this._onResize);
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('pointermove', this._onPointer);
    document.removeEventListener('visibilitychange', this._onVisibility);
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}

export { GalaxyBackground };
