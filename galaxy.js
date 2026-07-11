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

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.set(0, 180, 380);
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
        var count = 22000;
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);
        var arms = 4;
        var radius = 450;
        var armWidth = 0.12;

        var cIn = new THREE.Color(0xfff0c0);
        var cMid = new THREE.Color(0xff5e9e);
        var cOut = new THREE.Color(0x3a7bff);
        var cEdge = new THREE.Color(0x1a2a5e);

        for (var i = 0; i < count; i++) {
            var i3 = i * 3;
            var r = Math.pow(Math.random(), 0.35) * radius + 10;
            r = Math.max(1, r);
            var armIdx = i % arms;
            var arm = (armIdx / arms) * Math.PI * 2;
            var spin = r * 0.025;
            var a = arm + spin;

            var spreadFactor = armWidth * Math.max(0.01, 1 - r / radius * 0.5);
            var spread = (Math.random() - 0.5) * 25 * spreadFactor;
            var y = (Math.random() - 0.5) * 14 * Math.pow(Math.max(0, 1 - r / radius), 1.5);

            var sa = Math.sin(a);
            var ca = Math.cos(a);

            positions[i3] = ca * r + spread * Math.cos(a + 1.5708);
            positions[i3 + 1] = y;
            positions[i3 + 2] = sa * r + spread * Math.sin(a + 1.5708);

            var t = r / radius;
            var col;
            if (t < 0.15) {
                col = cIn.clone().lerp(cMid, t / 0.15);
            } else if (t < 0.55) {
                col = cMid.clone().lerp(cOut, (t - 0.15) / 0.4);
            } else {
                col = cOut.clone().lerp(cEdge, (t - 0.55) / 0.45);
            }
            var brightness = 0.7 + Math.random() * 0.3;
            colors[i3] = col.r * brightness;
            colors[i3 + 1] = col.g * brightness;
            colors[i3 + 2] = col.b * brightness;
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var tex = createStarTexture();

        var mat = new THREE.PointsMaterial({
            size: 5,
            map: tex,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            opacity: 0.92
        });

        galaxy = new THREE.Points(geo, mat);
        galaxy.rotation.x = 0.5;
        scene.add(galaxy);
    }

    function createStarTexture() {
        var c = document.createElement('canvas');
        c.width = 64;
        c.height = 64;
        var ctx2 = c.getContext('2d');
        var grad = ctx2.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.1, 'rgba(255,255,255,0.9)');
        grad.addColorStop(0.3, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.6, 'rgba(255,255,255,0.1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx2.fillStyle = grad;
        ctx2.fillRect(0, 0, 64, 64);

        var tex = new THREE.CanvasTexture(c);
        tex.needsUpdate = true;
        return tex;
    }

    function buildCore() {
        var tex = createStarTexture();

        var positions = new Float32Array(1500 * 3);
        var colors = new Float32Array(1500 * 3);
        var cCore = new THREE.Color(0xfff5dd);
        var cGlow = new THREE.Color(0xff7799);
        var cGlow2 = new THREE.Color(0xff9944);

        for (var i = 0; i < 1500; i++) {
            var i3 = i * 3;
            var r = Math.pow(Math.random(), 2.5) * 80;
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3;
            positions[i3 + 2] = r * Math.cos(phi);
            var col;
            if (r < 30) {
                col = cCore.clone().lerp(cGlow, r / 30);
            } else {
                col = cGlow.clone().lerp(cGlow2, (r - 30) / 50);
            }
            colors[i3] = col.r;
            colors[i3 + 1] = col.g;
            colors[i3 + 2] = col.b;
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var mat = new THREE.PointsMaterial({
            size: 22,
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
        var count = 3500;
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);

        for (var i = 0; i < count; i++) {
            var i3 = i * 3;
            var r = 1200 + Math.random() * 1800;
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);
            var b = 0.4 + Math.random() * 0.6;
            colors[i3] = b * 0.6;
            colors[i3 + 1] = b * 0.75;
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
            opacity: 0.75
        });

        starField = new THREE.Points(geo, mat);
        scene.add(starField);
    }

    function buildDustLanes() {
        var count = 4000;
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);
        var arms = 4;
        var radius = 440;

        var cDust1 = new THREE.Color(0x3a1a4e);
        var cDust2 = new THREE.Color(0x1a2a5e);
        var cDust3 = new THREE.Color(0x2a1a3e);

        for (var i = 0; i < count; i++) {
            var i3 = i * 3;
            var r = Math.pow(Math.random(), 0.6) * radius + 15;
            r = Math.max(1, r);
            var armIdx = i % arms;
            var arm = (armIdx / arms) * Math.PI * 2;
            var spin = r * 0.025;
            var a = arm + spin + 0.35;
            var spread = (Math.random() - 0.5) * 50 * (Math.max(0.01, r / radius) + 0.3);
            var y = (Math.random() - 0.5) * 10;

            positions[i3] = Math.cos(a) * r + spread * Math.cos(a + 1.5708);
            positions[i3 + 1] = y;
            positions[i3 + 2] = Math.sin(a) * r + spread * Math.sin(a + 1.5708);

            var col;
            if (Math.random() < 0.5) {
                col = cDust1.clone().lerp(cDust2, Math.random());
            } else {
                col = cDust2.clone().lerp(cDust3, Math.random());
            }
            colors[i3] = col.r;
            colors[i3 + 1] = col.g;
            colors[i3 + 2] = col.b;
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var mat = new THREE.PointsMaterial({
            size: 12,
            vertexColors: true,
            transparent: true,
            opacity: 0.12,
            blending: THREE.NormalBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        dust = new THREE.Points(geo, mat);
        dust.rotation.x = 0.5;
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
            galaxy.rotation.y += 0.0012;
            dust.rotation.y += 0.0012;
            starField.rotation.y += 0.0002;

            galaxy.rotation.x = 0.5 + mouseY * 0.12;
            dust.rotation.x = 0.5 + mouseY * 0.12;

            camera.position.x += (mouseX * 60 - camera.position.x) * 0.025;
            camera.position.y += (180 - mouseY * 40 - camera.position.y) * 0.025;
            camera.lookAt(0, 0, 0);

            var pulse = 1 + Math.sin(t * 1.5) * 0.08;
            core.scale.setScalar(pulse);
        }

        renderer.render(scene, camera);
    }

    init();
    animate();
});
