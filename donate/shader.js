(function () {
    'use strict';

    var canvas = document.getElementById('shader-bg');
    if (!canvas) return;

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: true }) || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true, antialias: true });
    if (!gl) return;

    var mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    var scrollProgress = 0;
    var time = 0;
    var lastFrame = performance.now();
    var running = true;

    function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = window.innerWidth;
        var h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    var vertSrc = [
        'attribute vec2 a_pos;',
        'void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }'
    ].join('\n');

    var fragSrc = [
        'precision highp float;',
        'uniform float u_time;',
        'uniform vec2 u_resolution;',
        'uniform vec2 u_mouse;',
        'uniform float u_scroll;',
        '',
        'vec3 hash3(float n) {',
        '    return fract(sin(vec3(n, n + 1.0, n + 2.0)) * vec3(43758.5453, 22578.1459, 19642.3137));',
        '}',
        '',
        'float noise(vec2 p) {',
        '    vec2 i = floor(p);',
        '    vec2 f = fract(p);',
        '    vec2 u = f * f * (3.0 - 2.0 * f);',
        '    float a = mix(',
        '        mix(dot(hash3(i.x + i.y * 57.0).xy - 0.5, f),',
        '            dot(hash3(i.x + 1.0 + i.y * 57.0).xy - 0.5, f - vec2(1.0, 0.0)), u.x),',
        '        mix(dot(hash3(i.x + (i.y + 1.0) * 57.0).xy - 0.5, f - vec2(0.0, 1.0)),',
        '            dot(hash3(i.x + 1.0 + (i.y + 1.0) * 57.0).xy - 0.5, f - vec2(1.0, 1.0)), u.x),',
        '        u.y);',
        '    return a * 0.5 + 0.5;',
        '}',
        '',
        'float fbm(vec2 p) {',
        '    float v = 0.0;',
        '    float a = 0.5;',
        '    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);',
        '    for (int i = 0; i < 6; i++) {',
        '        v += a * noise(p);',
        '        p = rot * p * 2.0;',
        '        a *= 0.5;',
        '    }',
        '    return v;',
        '}',
        '',
        'void main() {',
        '    vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
        '    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);',
        '',
        '    float t = u_time * 0.06;',
        '    float s = u_scroll * 2.0;',
        '',
        '    vec2 q;',
        '    q.x = fbm(p * 1.3 + vec2(t, s * 0.3));',
        '    q.y = fbm(p * 1.3 + vec2(-t * 0.7, s * 0.2) + 5.2);',
        '',
        '    vec2 r;',
        '    r.x = fbm(p * 1.8 + q + vec2(1.7, 9.2) + t * 0.5);',
        '    r.y = fbm(p * 1.8 + q + vec2(8.3, 2.8) + t * 0.4);',
        '',
        '    float f = fbm(p * 2.5 + r * 1.5);',
        '',
        '    vec2 m = u_mouse - 0.5;',
        '    float md = length(p - m * 1.5);',
        '    float mouseGlow = smoothstep(0.6, 0.0, md) * 0.12;',
        '    f += mouseGlow;',
        '',
        '    vec3 c1 = vec3(0.015, 0.03, 0.08);',
        '    vec3 c2 = vec3(0.04, 0.07, 0.16);',
        '    vec3 c3 = vec3(0.13, 0.2, 0.35);',
        '    vec3 c4 = vec3(0.35, 0.5, 0.75);',
        '    vec3 c5 = vec3(0.51, 0.63, 0.77);',
        '    vec3 c6 = vec3(0.8, 0.86, 0.95);',
        '',
        '    vec3 col = c1;',
        '    col = mix(col, c2, smoothstep(0.2, 0.55, f));',
        '    col = mix(col, c3, smoothstep(0.3, 0.7, f * f));',
        '    col = mix(col, c4, smoothstep(0.5, 0.9, f * r.x));',
        '    col = mix(col, c5, smoothstep(0.4, 0.65, r.y * 0.5));',
        '    col = mix(col, c6, smoothstep(0.6, 0.8, length(r) * 0.6) * 0.4);',
        '',
        '    float ca = 0.015;',
        '    vec2 caUv = uv - 0.5;',
        '    float dist = length(caUv);',
        '    float caR = fbm(p * 2.5 + r * 1.5 + vec2(ca, 0.0));',
        '    float caG = fbm(p * 2.5 + r * 1.5);',
        '    float caB = fbm(p * 2.5 + r * 1.5 + vec2(-ca, 0.0));',
        '',
        '    vec3 caCol;',
        '    caCol.r = mix(c1.r, c6.r, smoothstep(0.2, 0.8, caR));',
        '    caCol.g = mix(c1.g, c6.g, smoothstep(0.2, 0.8, caG));',
        '    caCol.b = mix(c1.b, c6.b, smoothstep(0.2, 0.8, caB));',
        '',
        '    col = mix(col, caCol, 0.3);',
        '',
        '    float vig = 1.0 - smoothstep(0.4, 1.3, length(p) * 0.9);',
        '    col *= vig * 0.8 + 0.2;',
        '',
        '    col += (fbm(p * 10.0 + t) - 0.5) * 0.015;',
        '',
        '    col += mouseGlow * vec3(0.13, 0.16, 0.22) * 2.0;',
        '',
        '    col = pow(col, vec3(0.88));',
        '',
        '    gl_FragColor = vec4(col, 1.0);',
        '}'
    ].join('\n');

    function compile(src, type) {
        var sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(sh));
            gl.deleteShader(sh);
            return null;
        }
        return sh;
    }

    var vert = compile(vertSrc, gl.VERTEX_SHADER);
    var frag = compile(fragSrc, gl.FRAGMENT_SHADER);
    if (!vert || !frag) return;

    var prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
        return;
    }

    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uTime = gl.getUniformLocation(prog, 'u_time');
    var uRes = gl.getUniformLocation(prog, 'u_resolution');
    var uMouse = gl.getUniformLocation(prog, 'u_mouse');
    var uScroll = gl.getUniformLocation(prog, 'u_scroll');

    window.addEventListener('mousemove', function (e) {
        mouse.tx = e.clientX / window.innerWidth;
        mouse.ty = 1.0 - e.clientY / window.innerHeight;
    });

    window.addEventListener('scroll', function () {
        var maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    }, { passive: true });

    function render() {
        if (!running) return;
        requestAnimationFrame(render);

        var now = performance.now();
        var dt = Math.min(0.05, (now - lastFrame) / 1000);
        lastFrame = now;

        if (!reducedMotion) {
            time += dt;
            mouse.x += (mouse.tx - mouse.x) * 0.04;
            mouse.y += (mouse.ty - mouse.y) * 0.04;
        }

        gl.uniform1f(uTime, time);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uScroll, scrollProgress);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            running = entries[0].isIntersecting;
        }, { threshold: 0 });
        obs.observe(canvas);
    }

    render();
})();
