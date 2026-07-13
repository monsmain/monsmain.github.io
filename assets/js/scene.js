import * as THREE from 'three';

class CodeUniverse {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x05070f, 0.0035);

        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.set(0, 0, 500);

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x05070f, 1);

        this.clock = new THREE.Clock();
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth < 768;

        this.particles = [];
        this.codeBlocks = [];
        this.lines = [];
        this.orb = null;

        this._build();
        this._bindEvents();
        this._animate();
    }

    _createGlowTexture() {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.15, 'rgba(255,255,255,0.85)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.3)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        const tex = new THREE.CanvasTexture(c);
        tex.needsUpdate = true;
        return tex;
    }

    _build() {
        this._buildParticleField();
        this._buildCodeOrb();
        this._buildFloatingSymbols();
        this._buildConnectionLines();
        this._buildAmbientLight();
    }

    _buildParticleField() {
        const count = this.isMobile ? 3000 : 8000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const cInner = new THREE.Color(0x6366f1);
        const cMid = new THREE.Color(0xa855f7);
        const cOuter = new THREE.Color(0xec4899);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const r = Math.pow(Math.random(), 0.5) * 800 + 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
            positions[i3 + 2] = r * Math.cos(phi);

            const t = r / 900;
            let col;
            if (t < 0.33) col = cInner.clone().lerp(cMid, t * 3);
            else col = cMid.clone().lerp(cOuter, (t - 0.33) * 1.5);

            const b = 0.6 + Math.random() * 0.4;
            colors[i3] = col.r * b;
            colors[i3 + 1] = col.g * b;
            colors[i3 + 2] = col.b * b;
            sizes[i] = Math.random() * 2 + 0.5;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 3,
            map: this._glowTex || (this._glowTex = this._createGlowTexture()),
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            opacity: 0.8
        });

        this.particleField = new THREE.Points(geo, mat);
        this.scene.add(this.particleField);
    }

    _buildCodeOrb() {
        const group = new THREE.Group();

        const coreGeo = new THREE.IcosahedronGeometry(40, 2);
        const coreMat = new THREE.MeshPhongMaterial({
            color: 0x6366f1,
            emissive: 0x4338ca,
            emissiveIntensity: 0.5,
            shininess: 80,
            transparent: true,
            opacity: 0.7
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        const wireGeo = new THREE.IcosahedronGeometry(55, 2);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wire = new THREE.Mesh(wireGeo, wireMat);
        group.add(wire);

        const outerGeo = new THREE.IcosahedronGeometry(70, 1);
        const outerMat = new THREE.MeshBasicMaterial({
            color: 0xec4899,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const outer = new THREE.Mesh(outerGeo, outerMat);
        group.add(outer);

        const ringCount = this.isMobile ? 2 : 4;
        for (let i = 0; i < ringCount; i++) {
            const ringGeo = new THREE.TorusGeometry(60 + i * 25, 0.8, 8, 80);
            const ringMat = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x6366f1 : 0xa855f7,
                transparent: true,
                opacity: 0.4
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            ring.userData.speed = (Math.random() - 0.5) * 0.005;
            ring.userData.axis = new THREE.Vector3(
                Math.random(), Math.random(), Math.random()
            ).normalize();
            group.add(ring);
            this.codeBlocks.push(ring);
        }

        group.position.set(0, 0, 0);
        this.scene.add(group);
        this.orb = group;
        this.orbCore = core;
        this.orbWire = wire;
        this.orbOuter = outer;
    }

    _buildFloatingSymbols() {
        const symbols = ['{', '}', '<', '>', '/', '(', ')', ';', '=', '[', ']'];
        const symbolCount = this.isMobile ? 15 : 40;

        for (let i = 0; i < symbolCount; i++) {
            const geo = new THREE.PlaneGeometry(1, 1);
            const canvas = document.createElement('canvas');
            canvas.width = 128; canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = 'bold 80px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbols[Math.floor(Math.random() * symbols.length)], 64, 64);

            const tex = new THREE.CanvasTexture(canvas);
            const mat = new THREE.MeshBasicMaterial({
                map: tex,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const mesh = new THREE.Mesh(geo, mat);

            const r = 150 + Math.random() * 300;
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 300;
            mesh.position.set(
                Math.cos(theta) * r,
                y,
                Math.sin(theta) * r - 200
            );
            mesh.scale.setScalar(15 + Math.random() * 20);
            mesh.userData = {
                floatSpeed: 0.001 + Math.random() * 0.003,
                floatOffset: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.01,
                baseY: mesh.position.y
            };

            this.scene.add(mesh);
            this.particles.push(mesh);
        }
    }

    _buildConnectionLines() {
        const lineCount = this.isMobile ? 8 : 20;
        const lineGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(lineCount * 6);
        const colors = new Float32Array(lineCount * 6);

        for (let i = 0; i < lineCount; i++) {
            const i6 = i * 6;
            const angle = (i / lineCount) * Math.PI * 2;
            const r = 100 + Math.random() * 200;
            positions[i6] = 0; positions[i6 + 1] = 0; positions[i6 + 2] = 0;
            positions[i6 + 3] = Math.cos(angle) * r;
            positions[i6 + 4] = (Math.random() - 0.5) * 100;
            positions[i6 + 5] = Math.sin(angle) * r;

            const c = new THREE.Color(0x6366f1);
            colors[i6] = c.r; colors[i6 + 1] = c.g; colors[i6 + 2] = c.b;
            colors[i6 + 3] = c.r * 0.3; colors[i6 + 4] = c.g * 0.3; colors[i6 + 5] = c.b * 0.3;
        }

        lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        lineGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const lineMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });

        const lineGroup = new THREE.LineSegments(lineGeo, lineMat);
        this.orb.add(lineGroup);
    }

    _buildAmbientLight() {
        const ambient = new THREE.AmbientLight(0x6366f1, 0.4);
        this.scene.add(ambient);

        const point1 = new THREE.PointLight(0xa855f7, 1.5, 500);
        point1.position.set(100, 50, 100);
        this.scene.add(point1);

        const point2 = new THREE.PointLight(0xec4899, 1, 400);
        point2.position.set(-100, -50, 100);
        this.scene.add(point2);

        this.ambientP1 = point1;
        this.ambientP2 = point2;
    }

    _bindEvents() {
        if (!this.reducedMotion) {
            window.addEventListener('mousemove', (e) => {
                this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
                this.targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
            });
        }

        window.addEventListener('scroll', () => {
            this.targetScrollY = window.scrollY;
        }, { passive: true });

        window.addEventListener('resize', () => this._onResize());
    }

    _onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    _animate() {
        requestAnimationFrame(() => this._animate());

        const t = this.clock.getElapsedTime();

        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;

        if (!this.reducedMotion) {
            this.particleField.rotation.y = t * 0.02;
            this.particleField.rotation.x = this.mouse.y * 0.1;

            if (this.orb) {
                this.orb.rotation.y = t * 0.15;
                this.orb.rotation.x = this.mouse.y * 0.2;

                const pulse = 1 + Math.sin(t * 1.2) * 0.08;
                this.orbCore.scale.setScalar(pulse);
                this.orbWire.scale.setScalar(1 + Math.sin(t * 0.8) * 0.1);
                this.orbOuter.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);

                this.orb.position.y = this.scrollY * -0.3;
            }

            this.codeBlocks.forEach(ring => {
                ring.rotateOnAxis(ring.userData.axis, ring.userData.speed);
            });

            this.particles.forEach(p => {
                p.position.y = p.userData.baseY + Math.sin(t * p.userData.floatSpeed * 100 + p.userData.floatOffset) * 20;
                p.rotation.z += p.userData.rotSpeed;
                p.material.opacity = 0.3 + Math.sin(t * 0.5 + p.userData.floatOffset) * 0.2;
            });

            this.camera.position.x += (this.mouse.x * 50 - this.camera.position.x) * 0.03;
            this.camera.position.y += (-this.mouse.y * 50 - this.camera.position.y) * 0.03;
            this.camera.position.z = 500 + this.scrollY * 0.15;

            if (this.ambientP1) {
                this.ambientP1.position.x = Math.cos(t * 0.5) * 150;
                this.ambientP1.position.z = Math.sin(t * 0.5) * 150;
            }
            if (this.ambientP2) {
                this.ambientP2.position.x = Math.cos(t * 0.5 + Math.PI) * 150;
                this.ambientP2.position.z = Math.sin(t * 0.5 + Math.PI) * 150;
            }
        }

        this.camera.lookAt(0, this.scrollY * -0.3, 0);
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.renderer.dispose();
        this.scene.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        });
    }
}

export { CodeUniverse };
