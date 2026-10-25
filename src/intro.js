// --- Intro (ca. 5 s): Fasern wachsen, Kompetenzfelder verbinden sich ---
// Ablauf: Die Fasern wachsen vom Bündel zu ihren Spitzen (0–3.9 s). Dazu
// meldet ein Protokoll die vier Kompetenzfelder als "verbunden"
// (0.3–2.9 s), danach erscheint die Wortmarke (3.05–4.55 s). Ein Zähler
// läuft bis 100 %. Parallel lädt ein HUD-Loader scheinbar die sechs Kapitel
// (0.35–4.15 s). Ab 4.6 s blendet die Sequenz aus und gibt den Hero frei.
// Einmal pro Session, überspringbar, nie bei reduzierter Bewegung.

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const INTRO_KEY = "ascnet-fs-intro-seen";
const GROW_MS = 3900;
const LEAVE_AT = 4600;
const DONE_AT = 5300;

// Loader: Start des ersten Kapitels, Versatz und Ladedauer je Kapitel (s)
const ROW_START = 0.35;
const ROW_STEP = 0.55;
const ROW_DUR = 1.05;
const BLOCKS = 10;
const RING_R = 50;
const RING_GAP = 7;

// HUD-Loader aufbauen; liefert update(sekunden) zurück
function createLoader() {
  const rows = [...document.querySelectorAll("[data-loader-row]")];
  const ring = document.getElementById("loaderRing");
  const countEl = document.getElementById("loaderCount");
  const stateEl = document.getElementById("loaderState");
  if (!rows.length) return () => {};

  // Ring: ein Segment je Kapitel, je eine Spur und eine Füllung
  const C = 2 * Math.PI * RING_R;
  const seg = C / rows.length - RING_GAP;
  let svg = `<circle class="ring-ticks" cx="60" cy="60" r="57"/><circle class="ring-inner" cx="60" cy="60" r="40"/><g transform="rotate(-90 60 60)">`;
  rows.forEach((_, i) => {
    const off = -(i * (C / rows.length) + RING_GAP / 2);
    svg += `<circle class="ring-track" cx="60" cy="60" r="${RING_R}" stroke-dasharray="${seg} ${C}" stroke-dashoffset="${off}"/>`;
    svg += `<circle class="ring-fill" cx="60" cy="60" r="${RING_R}" stroke-dasharray="0 ${C}" stroke-dashoffset="${off}"/>`;
  });
  ring.innerHTML = svg + "</g>";
  const fills = [...ring.querySelectorAll(".ring-fill")];

  // Blockbalken je Zeile und eine zufällige "Hänger"-Stelle wie bei echtem Laden
  const state = rows.map((row) => {
    const bar = row.querySelector(".lr-bar");
    bar.innerHTML = "<i></i>".repeat(BLOCKS);
    return {
      row,
      blocks: [...bar.children],
      pct: row.querySelector(".lr-pct"),
      st: row.querySelector(".lr-st"),
      stall: 0.35 + Math.random() * 0.3,
      phase: "",
    };
  });

  // Fortschritt mit Hänger: schnell bis zur Stelle, kurz stehen, dann fertig
  const shape = (x, stall) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    if (x < 0.45) return (x / 0.45) * stall;
    if (x < 0.62) return stall;
    return stall + ((x - 0.62) / 0.38) * (1 - stall);
  };

  return (sec) => {
    let done = 0;
    state.forEach((s, i) => {
      const x = (sec - (ROW_START + i * ROW_STEP)) / ROW_DUR;
      const p = shape(x, s.stall);
      const lit = Math.floor(p * BLOCKS + 1e-6);
      s.blocks.forEach((b, k) => b.classList.toggle("on", k < lit));
      s.pct.textContent = String(Math.round(p * 100));
      fills[i].setAttribute("stroke-dasharray", `${(seg * p).toFixed(2)} ${C}`);
      const phase = p >= 1 ? "ok" : x > 0 ? "load" : "wait";
      if (phase !== s.phase) {
        s.phase = phase;
        s.row.dataset.phase = phase;
        s.st.textContent = phase === "ok" ? "OK" : phase === "load" ? "LÄDT" : "WARTE";
      }
      if (p >= 1) done++;
    });
    countEl.textContent = String(done).padStart(2, "0");
    const all = done === state.length;
    const label = all ? "BEREIT" : sec > ROW_START ? "LADEN" : "INIT";
    if (stateEl.textContent !== label) {
      stateEl.textContent = label;
      stateEl.classList.toggle("is-ready", all);
    }
  };
}

export function playIntro(fibers) {
  const html = document.documentElement;
  return new Promise((resolve) => {
    const intro = document.getElementById("intro");
    // ?intro in der Adresse erzwingt das Intro, auch nach dem ersten Besuch
    const forced = new URLSearchParams(location.search).has("intro");
    if (!intro || html.classList.contains("skip-intro") || (prefersReducedMotion && !forced)) {
      intro?.remove();
      fibers?.form(0);
      resolve();
      return;
    }
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
      // Parameter wieder entfernen, damit ein Neuladen nicht erneut abspielt
      if (forced) history.replaceState(null, "", location.pathname + location.hash);
    } catch (e) {}

    html.classList.add("intro-playing");
    fibers?.scatter();
    fibers?.form(GROW_MS);
    intro.classList.add("is-playing");

    const skipBtn = document.getElementById("introSkip");
    const countEl = document.getElementById("introCount");
    const timers = [];
    const updateLoader = createLoader();
    const t0 = performance.now();
    let raf = 0;
    let done = false;

    // Prozentzähler bis zum Ende der Sequenz, dazu der Kapitel-Loader
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DONE_AT);
      if (countEl) countEl.textContent = `${Math.round(p * 100)} %`;
      updateLoader((now - t0) / 1000);
      if (p < 1 && !done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e) => {
      if (["Escape", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        finish();
      }
    };
    function finish() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      // Beim Überspringen das Wachstum zügig zu Ende führen
      fibers?.form(700);
      intro.classList.add("is-leaving", "is-done");
      html.classList.remove("intro-playing");
      resolve();
      setTimeout(() => intro.remove(), 900);
    }

    timers.push(setTimeout(() => intro.classList.add("is-leaving"), LEAVE_AT));
    timers.push(setTimeout(finish, DONE_AT));

    skipBtn?.addEventListener("click", finish);
    intro.addEventListener("click", finish);
    document.addEventListener("keydown", onKey);
    skipBtn?.focus({ preventScroll: true });
  });
}
