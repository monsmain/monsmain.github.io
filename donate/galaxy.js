document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var canvas = document.getElementById('galaxy-bg');
    if (!canvas || typeof THREE === 'undefined') return;

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var scene, camera, renderer, galaxy, core, starField, dust;
    var mouseX = 0, mouseY = 0;
    var clock = new THREE.Clock();

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.set(0, 150, 320);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x03050c, 1);

        buildGalaxy();
        buildCore();
        buildDistantStars();
        buildDustLanes();

        window.addEventListener('resize', onResize);
        if (!reducedMotion) {
            window.addEventListener('mousemove', onMouseMove);
        }
    }

    function buildGalaxy() {
        var count = 15000;
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);
        var arms = 3;
        var radius = 420;

        var cIn = new THREE.Color(0xffaa55);
        var cMid = new THREE.Color(0xff44aa);
        var cOut = new THREE.Color(0x4477ff);

        for (var i = 0; i < count; i++) {
            var i3 = i * 3;
            var r = Math.pow(Math.random(), 0.5) * radius + 15;
            var arm = (i % arms) / arms * Math.PI * 2;
            var spin = r * 0.018;
            var a = arm + spin;

            var spread = (Math.random() - 0.5) * 15 * (r / radius + 0.2);
            var y = (Math.random() - 0.5) * 18 * Math.pow(1 - r / radius, 1.5);

            positions[i3] = Math.cos(a) * r + spread;
            positions[i3 + 1] = y;
            positions[i3 + 2] = Math.sin(a) * r + spread;

            var t = r / radius;
            var col;
            if (t < 0.3) {
                col = cIn.clone().lerp(cMid, t / 0.3);
            } else {
                col = cMid.clone().lerp(cOut, (t - 0.3) / 0.7);
            }
            colors[i3] = col.r;
            colors[i3 + 1] = col.g;
            colors[i3 + 2] = col.b;
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var tex = createStarTexture();

        var mat = new THREE.PointsMaterial({
            size: 6,
            map: tex,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            opacity: 0.9
        });

        galaxy = new THREE.Points(geo, mat);
        galaxy.rotation.x = 0.45;
        scene.add(galaxy);
    }

    function createStarTexture() {
        var c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        var ctx2 = c.getContext('2d');
        var grad = ctx2.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.15, 'rgba(255,255,255,0.85)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.3)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx2.fillStyle = grad;
        ctx2.fillRect(0, 0, 64, 64);

        var tex = new THREE.CanvasTexture(c);
        tex.needsUpdate = true;
        return tex;
    }

    function buildCore() {
        var tex = createStarTexture();

        var positions = new Float32Array(900 * 3);
        var colors = new Float32Array(900 * 3);
        var cCore = new THREE.Color(0xffeecc);
        var cGlow = new THREE.Color(0xff6699);

        for (var i = 0; i < 900; i++) {
            var i3 = i * 3;
            var r = Math.pow(Math.random(), 2) * 70;
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
            positions[i3 + 2] = r * Math.cos(phi);
            var col = cCore.clone().lerp(cGlow, r / 70);
            colors[i3] = col.r;
            colors[i3 + 1] = col.g;
            colors[i3 + 2] = col.b;
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var mat = new THREE.PointsMaterial({
            size: 18,
            map: tex,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            opacity: 0.95
        });

        core = new THREE.Points(geo, mat);
        scene.add(core);
    }

    function buildDistantStars() {
        var count = 2500;
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);

        for (var i = 0; i < count; i++) {
            var i3 = i * 3;
            var r = 1200 + Math.random() * 1500;
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);
            var b = 0.5 + Math.random() * 0.5;
            colors[i3] = b * 0.7;
            colors[i3 + 1] = b * 0.8;
            colors[i3 + 2] = b;
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var tex = createStarTexture();

        var mat = new THREE.PointsMaterial({
            size: 4,
            map: tex,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            opacity: 0.7
        });

        starField = new THREE.Points(geo, mat);
        scene.add(starField);
    }

    function buildDustLanes() {
        var count = 3000;
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);
        var arms = 3;
        var radius = 400;

        var cDust1 = new THREE.Color(0x2a1a3e);
        var cDust2 = new THREE.Color(0x1a2a4e);

        for (var i = 0; i < count; i++) {
            var i3 = i * 3;
            var r = Math.pow(Math.random(), 0.7) * radius + 20;
            var arm = (i % arms) / arms * Math.PI * 2;
            var spin = r * 0.018;
            var a = arm + spin + 0.3;
            var spread = (Math.random() - 0.5) * 60 * (r / radius + 0.3);
            var y = (Math.random() - 0.5) * 12;

            positions[i3] = Math.cos(a) * r + spread;
            positions[i3 + 1] = y;
            positions[i3 + 2] = Math.sin(a) * r + spread;

            var col = cDust1.clone().lerp(cDust2, Math.random());
            colors[i3] = col.r;
            colors[i3 + 1] = col.g;
            colors[i3 + 2] = col.b;
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var mat = new THREE.PointsMaterial({
            size: 10,
            vertexColors: true,
            transparent: true,
            opacity: 0.15,
            blending: THREE.NormalBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        dust = new THREE.Points(geo, mat);
        dust.rotation.x = 0.45;
        scene.add(dust);
    }

    function onMouseMove(e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!renderer || !galaxy) return;
        var t = clock.getElapsedTime();

        if (!reducedMotion) {
            galaxy.rotation.y += 0.0015;
            dust.rotation.y += 0.0015;
            starField.rotation.y += 0.0003;

            galaxy.rotation.x = 0.45 + mouseY * 0.15;
            dust.rotation.x = 0.45 + mouseY * 0.15;

            camera.position.x += (mouseX * 80 - camera.position.x) * 0.03;
            camera.position.y += (150 - mouseY * 60 - camera.position.y) * 0.03;
            camera.lookAt(0, 0, 0);

            var pulse = 1 + Math.sin(t * 1.2) * 0.06;
            core.scale.setScalar(pulse);
        }

        renderer.render(scene, camera);
    }

    init();
    animate();
});