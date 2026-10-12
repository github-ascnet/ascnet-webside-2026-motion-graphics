// --- Kapitel-Engine: Dock-Timeline, Kapitelwechsel, Hero-Parallax ---
// Übernimmt die Timeline-Navigation aus dem Film-Konzept: Kapitelmarker,
// scrubbarer Playhead, Pfeiltasten. Ein Kapitelwechsel blendet den Inhalt
// kurz aus, während im Hintergrund ein Lichtimpuls durch die Fasern läuft.

import { playIntro } from "./intro.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const MOTION_KEY = "ascnet-motion";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const pad2 = (n) => String(n).padStart(2, "0");

// --- DOM ---
const html = document.documentElement;
const topbar = $("#topbar");
const menuBtn = $("#menu-btn");
const mobileMenu = $("#mobile-menu");
const track = $("#tlTrack");
const progressEl = $("#tlProgress");
const playhead = $("#tlPlayhead");
const markersEl = $("#tlMarkers");
const chapterNoEl = $("#chapterNo");
const chapterOfEl = $("#chapterOf");
const chapterTitleEl = $("#chapterTitle");
const readoutEls = $$("[data-readout]");
const motionBtn = $("#motionToggle");
const heroCopy = $("#hero .hero-copy");
const heroMeta = $("#hero .hero-meta");

const scenes = $$("[data-scene]").map((el, i) => ({
  el,
  id: el.id,
  title: el.dataset.sceneTitle || el.id,
  no: pad2(i + 1),
  top: 0,
  progress: 0,
  marker: null,
  links: $$(`.top-nav a[href="#${el.id}"], .menu-list a[href="#${el.id}"]`),
}));

let wave = null;
let maxScroll = 1;
let activeIdx = -1;
let jumping = false;
let scrubbing = false;

// --- Mobile Kapitelauswahl ---
function setMenuOpen(open) {
  if (!menuBtn || !mobileMenu) return;
  topbar?.classList.toggle("is-open", open);
  mobileMenu.classList.toggle("is-open", open);
  mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  menuBtn.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
}

function isMenuOpen() {
  return !!mobileMenu?.classList.contains("is-open");
}

function isModalOpen() {
  const modal = $("#skill-modal");
  return !!modal && !modal.classList.contains("hidden");
}

// --- Vermessung: Kapitel-Positionen und Timeline-Marker ---
function measure() {
  maxScroll = Math.max(1, html.scrollHeight - window.innerHeight);
  const offset = topbar?.offsetHeight || 0;
  scenes.forEach((s, i) => {
    const absTop = s.el.getBoundingClientRect().top + window.scrollY;
    s.top = i === 0 ? 0 : Math.max(0, Math.round(absTop - offset));
    s.progress = Math.min(s.top / maxScroll, 1);
    if (s.marker) s.marker.style.left = `${(s.progress * 100).toFixed(3)}%`;
  });
  update();
}

// --- Timeline mit Kapitelmarkern ---
function buildTimeline() {
  if (chapterOfEl) chapterOfEl.textContent = `/${pad2(scenes.length)}`;
  if (!markersEl) return;
  scenes.forEach((s, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tl-marker";
    btn.innerHTML = `<i></i><span>${s.title}</span>`;
    btn.setAttribute("aria-label", `Zu Kapitel ${s.no}: ${s.title} springen`);
    btn.addEventListener("click", () => jumpTo(i));
    markersEl.appendChild(btn);
    s.marker = btn;
  });
}

function scrubAt(clientX) {
  const rect = track.getBoundingClientRect();
  const p = clamp01((clientX - rect.left) / rect.width);
  window.scrollTo({ top: p * maxScroll, behavior: "instant" });
}

function initScrubbing() {
  if (!track) return;
  track.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest(".tl-marker") || jumping) return;
    scrubbing = true;
    track.setPointerCapture(e.pointerId);
    track.classList.add("is-scrubbing");
    scrubAt(e.clientX);
  });
  track.addEventListener("pointermove", (e) => {
    if (scrubbing) scrubAt(e.clientX);
  });
  const end = () => {
    if (!scrubbing) return;
    scrubbing = false;
    track.classList.remove("is-scrubbing");
  };
  track.addEventListener("pointerup", end);
  track.addEventListener("pointercancel", end);
}

// --- Aktives Kapitel ---
function setActive(idx) {
  if (idx === activeIdx) return;
  activeIdx = idx;
  const s = scenes[idx];
  if (!s) return;
  if (chapterNoEl) chapterNoEl.textContent = s.no;
  if (chapterTitleEl) {
    chapterTitleEl.textContent = s.title;
    chapterTitleEl.classList.remove("is-swapping");
    void chapterTitleEl.offsetWidth;
    chapterTitleEl.classList.add("is-swapping");
  }
  scenes.forEach((sc, i) => {
    sc.links.forEach((a) => {
      a.classList.toggle("is-active", i === idx);
      if (i === idx) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    sc.marker?.classList.toggle("is-current", i === idx);
    sc.marker?.classList.toggle("is-passed", i <= idx);
  });
}

// --- Haupt-Update pro Frame ---
let ticking = false;
function requestUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    update();
  });
}

function update() {
  const y = window.scrollY;
  const p = clamp01(y / maxScroll);
  const hp = clamp01(y / (window.innerHeight * 0.9));

  const readout = `${Math.round(p * 100)} %`;
  readoutEls.forEach((el) => (el.textContent = readout));
  if (progressEl) progressEl.style.transform = `scaleX(${p})`;
  if (playhead && track) {
    playhead.style.transform = `translate3d(${(p * track.clientWidth).toFixed(1)}px,0,0)`;
  }

  // Aktives Kapitel: letztes, dessen Anfang das obere Bilddrittel erreicht hat
  const probe = y + window.innerHeight * 0.35;
  let idx = 0;
  scenes.forEach((s, i) => {
    if (s.top <= probe) idx = i;
  });
  setActive(idx);

  wave?.setScroll(p, hp);
  topbar?.classList.toggle("is-scrolled", y > 8);

  if (prefersReducedMotion) return;

  // Hero: Copy zieht beim Weiterscrollen nach oben weg und verliert Schärfe
  if (heroCopy) {
    heroCopy.style.transform = `translate3d(0, ${(hp * -60).toFixed(1)}px, 0)`;
    heroCopy.style.opacity = String(Math.max(0, 1 - hp * 1.2));
    heroCopy.style.filter = hp > 0.01 ? `blur(${(hp * 6).toFixed(2)}px)` : "";
  }
  if (heroMeta) heroMeta.style.opacity = String(Math.max(0, 1 - hp * 2));
}

// --- Kapitelwechsel: Inhalt aus, Lichtimpuls im Hintergrund, Inhalt ein ---
function focusScene(s) {
  if (!s.el.hasAttribute("tabindex")) s.el.setAttribute("tabindex", "-1");
  s.el.focus({ preventScroll: true });
}

async function jumpTo(idx) {
  const s = scenes[idx];
  if (!s || jumping) return;
  setMenuOpen(false);
  try {
    history.replaceState(null, "", `#${s.id}`);
  } catch (e) {}

  if (prefersReducedMotion) {
    window.scrollTo({ top: s.top, behavior: "instant" });
    focusScene(s);
    return;
  }

  jumping = true;
  wave?.kick(1);
  document.body.classList.add("is-jumping");
  await wait(320);

  window.scrollTo({ top: s.top, behavior: "instant" });
  update();
  s.el.classList.remove("scene-enter");
  void s.el.offsetWidth;
  s.el.classList.add("scene-enter");
  document.body.classList.remove("is-jumping");

  await wait(450);
  jumping = false;
  focusScene(s);
}

function initLinks() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const idx = scenes.findIndex((s) => `#${s.id}` === a.getAttribute("href"));
    if (idx < 0) return;
    e.preventDefault();
    jumpTo(idx);
  });

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => setMenuOpen(!isMenuOpen()));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen()) {
      setMenuOpen(false);
      return;
    }
    // Pfeil links/rechts springt zum vorherigen/nächsten Kapitel
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (html.classList.contains("intro-playing") || isModalOpen()) return;
    const t = e.target;
    if (t instanceof Element && t.closest("input, textarea, select, [contenteditable], .mapboxgl-map")) return;
    const next = activeIdx + (e.key === "ArrowRight" ? 1 : -1);
    if (next < 0 || next >= scenes.length) return;
    e.preventDefault();
    jumpTo(next);
  });
}

// --- Schalter "Motion": Hintergrund-Animation anhalten/fortsetzen ---
function initMotionToggle() {
  const apply = (on) => {
    html.classList.toggle("motion-off", !on);
    motionBtn?.setAttribute("aria-pressed", on ? "true" : "false");
    wave?.setMotion(on);
  };
  apply(!html.classList.contains("motion-off"));
  motionBtn?.addEventListener("click", () => {
    const on = html.classList.contains("motion-off");
    apply(on);
    try {
      localStorage.setItem(MOTION_KEY, on ? "on" : "off");
    } catch (e) {}
  });
}

export function initChapters(waveCtrl) {
  wave = waveCtrl;
  buildTimeline();
  initScrubbing();
  initLinks();
  initMotionToggle();
  measure();

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("load", measure);
  document.fonts?.ready.then(measure);
  if ("ResizeObserver" in window) {
    let roFrame = 0;
    new ResizeObserver(() => {
      cancelAnimationFrame(roFrame);
      roFrame = requestAnimationFrame(measure);
    }).observe(document.body);
  }

  playIntro(wave).then(() => {
    document.body.classList.add("is-live");
  });
}
