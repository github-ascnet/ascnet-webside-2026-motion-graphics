// --- Future-State: Glasfaser-Bündel im Hintergrund ---
// Hunderte Fasern laufen gebündelt von oben links ins Bild und fächern zu
// einer Wolke leuchtender Spitzen rechts der Mitte auf. Datenimpulse laufen
// die Fasern entlang, nahe Spitzen zerfliessen zu Bokeh. Im Intro wachsen
// die Fasern vom Bündel aus bis zu ihren Spitzen. Gerechnet per WebGL.

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Kamera: Abstand und Brennweite (halbe Bildhöhe in Weltkoordinaten = CAM_Z / FOCAL)
const CAM_Z = 3.4;
const FOCAL = 1.8;
// Startzeit, damit Impulse und Schwingung nicht synchron beginnen
const T0 = 8;

// Punktarten im Vertex-Puffer
const STRAND = 0;
const TIP = 1;
const BOKEH = 2;
const DUST = 3;

const VERT = `
precision highp float;
attribute vec2 aS;   // x: Position entlang der Faser 0..1, y: Punktart
attribute vec4 aA;   // Zufallswerte pro Faser bzw. Partikel
attribute vec4 aB;
uniform float uTime;
uniform float uGrow;
uniform float uAspect;
uniform float uScroll;
uniform float uPx;
uniform float uKick;
uniform vec2 uPointer;
varying vec3 vCol;
varying float vA;
varying float vSoft;

const float CAM_Z = ${CAM_Z.toFixed(2)};
const float FOCAL = ${FOCAL.toFixed(2)};

void main() {
  float t = uTime;
  float halfH = CAM_Z / FOCAL;
  float halfW = halfH * uAspect;
  // Hochformat: Wolke höher und kompakter, damit unten Platz für Text bleibt
  float portrait = clamp((1.0 - uAspect) / 0.45, 0.0, 1.0);
  float s = aS.x;
  float kind = aS.y;
  vec3 pos;
  vec3 col;
  float a;
  float size;
  float soft = 0.0;

  if (kind < 1.5) {
    // Bündel ausserhalb der oberen linken Ecke
    vec3 P0 = vec3(-halfW * 1.08, halfH * 1.14, -0.3)
            + vec3(aA.x - 0.5, aA.y - 0.5, 0.0) * 0.3;
    // Wolke der Spitzen rechts der Mitte
    vec2 C = mix(vec2(halfW * 0.3, halfH * 0.1), vec2(halfW * 0.15, halfH * 0.42), portrait);
    vec2 R = vec2(0.66, 0.52) * mix(1.0, 0.72, portrait);
    float ang = aA.z * 6.2832;
    float rad = sqrt(aA.w);
    vec3 P1 = vec3(C + vec2(cos(ang), sin(ang)) * rad * R, (aB.x * 2.0 - 1.0) * 0.95);
    P1 += vec3(0.05 * sin(t * 0.5 + aA.z * 20.0),
               0.05 * cos(t * 0.43 + aA.w * 17.0),
               0.06 * sin(t * 0.37 + aB.x * 11.0));
    P1.xy += uPointer * vec2(0.18, -0.12);
    P1.y += uScroll * 0.5;
    vec3 Q = mix(P0, P1, 0.5) + vec3(-0.21, -0.27, 0.0);

    // Wachstum pro Faser (Intro), gestaffelt
    float g = clamp(uGrow * 1.6 - aB.w * 0.6, 0.0, 1.0);
    float sp = min(s, g);
    vec3 p = (1.0 - sp) * (1.0 - sp) * P0 + 2.0 * (1.0 - sp) * sp * Q + sp * sp * P1;
    float sw = sin(sp * 3.1416);
    p += vec3(0.0, 0.07 * sin(t * 0.45 + aA.z * 13.0), 0.09 * cos(t * 0.35 + aA.w * 9.0)) * sw;
    pos = p;
    float depth = clamp((p.z + 0.95) / 1.9, 0.0, 1.0);

    if (kind < 0.5) {
      float vis = step(s, g + 0.0001);
      float base = 0.1 + 0.42 * pow(s, 3.0);
      // regelmässige Datenimpulse auf etwa der Hälfte der Fasern
      float pp = fract(t * (0.05 + aB.z * 0.08) + aB.y);
      float pulse = step(0.5, aB.y) * exp(-pow((s - pp) * 26.0, 2.0)) * 0.9;
      // Schub bei Kapitelwechsel: läuft vom Bündel zu den Spitzen
      float kick = uKick * exp(-pow((s - (1.0 - uKick)) * 16.0, 2.0)) * 1.3;
      // leuchtender Kopf, solange die Faser wächst
      float head = exp(-pow((s - g) * 38.0, 2.0)) * (1.0 - step(0.999, g)) * 1.6;
      float hi = clamp(pow(s, 3.0) + pulse + kick + head, 0.0, 1.0);
      a = (base + pulse + kick + head) * vis * mix(0.5, 1.0, depth);
      // Stränge hellblau, Bokeh im Hintergrund bleibt golden
      col = mix(vec3(0.3, 0.64, 1.0), vec3(0.72, 0.9, 1.0), hi);
      size = 3.0;
    } else {
      float on = smoothstep(0.96, 1.0, g);
      float tw = 0.8 + 0.2 * sin(t * (0.8 + aB.z) + aA.z * 30.0);
      float arrive = step(0.001, uKick) * exp(-pow((1.0 - uKick - 0.97) * 9.0, 2.0));
      // nur die vordersten Spitzen zerfliessen zu Bokeh
      soft = smoothstep(0.88, 1.0, depth);
      a = on * tw * (0.95 + arrive * 0.8) * mix(1.0, 0.3, soft);
      // Lichtperlen im selben Hellblau wie die Stränge
      col = mix(vec3(0.3, 0.64, 1.0), vec3(0.72, 0.9, 1.0), aB.z);
      col = mix(col, vec3(0.28, 0.58, 1.0), soft);
      size = 12.0 + 10.0 * aB.w + 22.0 * soft;
    }
  } else if (kind < 2.5) {
    // grosse, unscharfe Lichtscheiben im Vordergrund
    pos = vec3((aA.x * 2.0 - 1.0) * halfW * 1.05 + 0.2 * sin(t * 0.05 + aB.x * 9.0),
               (aA.y * 2.0 - 1.0) * halfH * 1.05 + 0.15 * cos(t * 0.04 + aB.x * 7.0),
               0.4);
    soft = 1.0;
    a = (0.012 + 0.025 * aB.y) * smoothstep(0.2, 0.8, uGrow);
    col = mix(vec3(0.7, 0.45, 0.08), vec3(1.0, 0.72, 0.25), aB.z);
    size = 30.0 + 80.0 * aA.z;
  } else {
    // feiner Staub, langsam aufsteigend
    float span = halfH * 2.4;
    float y = mod(aA.y * span + t * 0.015 * (0.4 + aB.y), span) - span * 0.5;
    pos = vec3((aA.x * 2.0 - 1.0) * halfW * 1.15, y, (aA.z * 2.0 - 1.0) * 1.0);
    float twk = pow(0.5 + 0.5 * sin(t * (0.5 + aB.z * 1.3) + aA.x * 40.0), 12.0);
    a = 0.05 + 0.4 * twk;
    col = vec3(1.0, 0.85, 0.55);
    size = 1.0 + aB.y * 1.3;
  }

  float d = CAM_Z - pos.z;
  gl_Position = vec4(pos.x * FOCAL / d / uAspect, pos.y * FOCAL / d, 0.0, 1.0);
  gl_PointSize = size * uPx * (CAM_Z / d);
  vCol = col;
  vA = a;
  vSoft = soft;
}
`;

const FRAG = `
precision mediump float;
varying vec3 vCol;
varying float vA;
varying float vSoft;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  if (r > 1.0) discard;
  // scharfer Lichtpunkt mit Kern ...
  float sharp = pow(1.0 - r, 1.7) * 0.6 + smoothstep(0.3, 0.0, r) * 0.9;
  // ... oder Bokeh-Scheibe mit leicht hellerem Rand
  float disc = smoothstep(1.0, 0.8, r) * (0.55 + 0.45 * r);
  gl_FragColor = vec4(vCol * vA * mix(sharp, disc, vSoft), 1.0);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("Fiber-Shader:", gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

function buildPoints(small) {
  const FIBERS = small ? 120 : 220;
  const SAMPLES = small ? 260 : 400;
  const BOKEHS = small ? 22 : 40;
  const DUSTS = small ? 400 : 800;
  const count = FIBERS * (SAMPLES + 1) + BOKEHS + DUSTS;
  const data = new Float32Array(count * 10);
  let o = 0;
  const push = (s, kind, A, B) => {
    data[o++] = s;
    data[o++] = kind;
    for (let i = 0; i < 4; i++) data[o++] = A[i];
    for (let i = 0; i < 4; i++) data[o++] = B[i];
  };
  const rnd4 = () => [Math.random(), Math.random(), Math.random(), Math.random()];
  for (let f = 0; f < FIBERS; f++) {
    const A = rnd4();
    const B = rnd4();
    for (let i = 0; i < SAMPLES; i++) push(i / (SAMPLES - 1), STRAND, A, B);
    push(1, TIP, A, B);
  }
  for (let k = 0; k < BOKEHS; k++) push(0, BOKEH, rnd4(), rnd4());
  for (let k = 0; k < DUSTS; k++) push(0, DUST, rnd4(), rnd4());
  return { data, count };
}

export function initFibers(canvas) {
  const noop = {
    scatter() {},
    form() {},
    kick() {},
    setScroll() {},
    setMotion() {},
  };
  if (!canvas) return noop;

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "high-performance",
  });
  const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!gl || !vs || !fs) {
    document.documentElement.classList.add("no-webgl");
    return noop;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Fiber-Programm:", gl.getProgramInfoLog(prog));
    document.documentElement.classList.add("no-webgl");
    return noop;
  }
  gl.useProgram(prog);

  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const { data, count } = buildPoints(small);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const attr = (name, size, offset) => {
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 40, offset);
  };
  attr("aS", 2, 0);
  attr("aA", 4, 8);
  attr("aB", 4, 24);

  const u = {};
  ["uTime", "uGrow", "uAspect", "uScroll", "uPx", "uKick", "uPointer"].forEach(
    (n) => (u[n] = gl.getUniformLocation(prog, n))
  );

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);
  // Hintergrund #222222, muss zu --bg im CSS passen
  gl.clearColor(0.133, 0.133, 0.133, 1);

  const state = {
    t: T0,
    grow: 1,
    growFrom: 1,
    growStart: -1,
    growDur: 0,
    kick: 0,
    scroll: 0,
    scrollTarget: 0,
    px: 0,
    py: 0,
    pxTarget: 0,
    pyTarget: 0,
    motion: !prefersReducedMotion,
    visible: !document.hidden,
    raf: 0,
    last: 0,
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(u.uAspect, w / h);
    gl.uniform1f(u.uPx, dpr);
    if (!state.raf) draw();
  }

  function draw() {
    gl.uniform1f(u.uTime, state.t);
    gl.uniform1f(u.uGrow, state.grow);
    gl.uniform1f(u.uScroll, state.scroll);
    gl.uniform1f(u.uKick, state.kick);
    gl.uniform2f(u.uPointer, state.px, state.py);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, count);
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - (state.last || now)) / 1000);
    state.last = now;
    // Schub klingt in gut einer Sekunde ab, damit der Impuls die Spitzen erreicht
    state.kick = Math.max(0, state.kick - dt * 0.85);
    state.t += dt;
    // Wachstum an der echten Uhr, damit es auch bei wenigen fps rechtzeitig fertig ist
    if (state.growDur) {
      if (state.growStart < 0) state.growStart = now;
      const p = Math.min(1, (now - state.growStart) / state.growDur);
      state.grow = state.growFrom + (1 - state.growFrom) * p;
      if (p >= 1) state.growDur = 0;
    }
    const ease = 1 - Math.pow(0.02, dt);
    state.scroll += (state.scrollTarget - state.scroll) * ease;
    state.px += (state.pxTarget - state.px) * ease;
    state.py += (state.pyTarget - state.py) * ease;
    draw();
    state.raf = requestAnimationFrame(frame);
  }

  function start() {
    if (state.raf || !state.motion || !state.visible) return;
    state.last = 0;
    state.raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    state.visible = !document.hidden;
    if (state.visible) start();
    else stop();
  });
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        state.pxTarget = (e.clientX / window.innerWidth) * 2 - 1;
        state.pyTarget = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
  }
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    stop();
  });

  resize();
  start();

  return {
    // Fasern einziehen (Ausgangslage fürs Intro)
    scatter() {
      state.grow = 0;
      state.growDur = 0;
      if (!state.raf) draw();
    },
    // Fasern aus der aktuellen Lage in `ms` Millisekunden wachsen lassen
    form(ms = 0) {
      if (!ms || !state.raf) {
        state.grow = 1;
        state.growDur = 0;
        if (!state.raf) draw();
        return;
      }
      state.growFrom = state.grow;
      state.growStart = -1;
      state.growDur = ms;
    },
    // Lichtimpuls durch alle Fasern, z. B. bei einem Kapitelwechsel
    kick(amount = 1) {
      state.kick = Math.max(state.kick, amount);
    },
    // p: Gesamtfortschritt 0..1, hero: wie weit der Hero verlassen ist 0..1
    setScroll(p, hero) {
      state.scrollTarget = p;
      canvas.style.opacity = String(1 - 0.6 * hero);
      if (!state.raf) {
        state.scroll = p;
        draw();
      }
    },
    setMotion(on) {
      state.motion = on;
      if (on) start();
      else {
        stop();
        state.grow = 1;
        state.growDur = 0;
        draw();
      }
    },
  };
}
