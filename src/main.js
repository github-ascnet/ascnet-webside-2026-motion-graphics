import "./main.css";
// Glasfaser-Hintergrund, Intro und Kapitel-Navigation
import { initFibers } from "./fibers.js";
import { initChapters } from "./chapters.js";
// Kontaktformular (EmailJS)
import { initContactForm } from "./contact.js";

// --- Preis-Kalkulator ---
import plzMatrix from "./plz.json";

const rates = { msg: 160, dev: 170, bi: 185, iam: 200 };
const sliders = {
  msg: document.getElementById("msgSlider"),
  dev: document.getElementById("devSlider"),
  bi: document.getElementById("biSlider"),
  iam: document.getElementById("iamSlider"),
  onsite: document.getElementById("onsiteSlider"),
};
const vals = {
  msg: document.getElementById("msgVal"),
  dev: document.getElementById("devVal"),
  bi: document.getElementById("biVal"),
  iam: document.getElementById("iamVal"),
  onsite: document.getElementById("onsiteVal"),
};
const units = {
  msg: document.getElementById("msgValUnit"),
  dev: document.getElementById("devValUnit"),
  bi: document.getElementById("biValUnit"),
  iam: document.getElementById("iamValUnit"),
};
const unitBadges = {
  msg: document.getElementById("msgUnit"),
  dev: document.getElementById("devUnit"),
  bi: document.getElementById("biUnit"),
  iam: document.getElementById("iamUnit"),
};
const modeHoursBtn = document.getElementById("modeHours");
const modeDaysBtn = document.getElementById("modeDays");
const hoursPerDayWrap = document.getElementById("hoursPerDayWrap");
const hoursPerDaySel = document.getElementById("hoursPerDay");
const plzInput = document.getElementById("plzInput");

let mode = "hours";

function chf0(n) {
  return Number(n).toLocaleString("de-CH", { maximumFractionDigits: 0 });
}
function setMode(newMode) {
  mode = newMode;
  const isDays = mode === "days";
  // Prüfe, ob das Element existiert, bevor classList verwendet wird
  if (hoursPerDayWrap) {
    hoursPerDayWrap.classList.toggle("hidden", !isDays);
  }
  //hoursPerDayWrap.classList.toggle("hidden", !isDays);
  ["msg", "dev", "bi", "iam"].forEach((k) => {
    if (sliders[k]) {
      sliders[k].min = 0;
      sliders[k].max = isDays ? 63 : 504;
      sliders[k].step = 1;
    }
    if (vals[k]) vals[k].textContent = Math.round(+sliders[k].value);
    // Update unit label
    const unitSpan = document.getElementById(k + "Unit");
    if (unitSpan) unitSpan.textContent = isDays ? "Tage" : "Std";
  });
  if (modeHoursBtn && modeDaysBtn) {
    modeHoursBtn.classList.toggle("is-active", !isDays);
    modeDaysBtn.classList.toggle("is-active", isDays);
    modeHoursBtn.setAttribute("aria-pressed", String(!isDays));
    modeDaysBtn.setAttribute("aria-pressed", String(isDays));
  }
  calc();
}
if (modeHoursBtn && modeDaysBtn) {
  modeHoursBtn.addEventListener("click", () => setMode("hours"));
  modeDaysBtn.addEventListener("click", () => setMode("days"));
}

// Füllstand der Slider-Spur (rein optisch)
function paintSliders() {
  Object.values(sliders).forEach((s) => {
    if (!s) return;
    const pct = ((+s.value - +s.min) / (+s.max - +s.min || 1)) * 100;
    s.style.setProperty("--p", `${pct.toFixed(1)}%`);
  });
}

function calc() {
  paintSliders();
  const pOnsite = sliders.onsite ? Math.round(+sliders.onsite.value) : 0;
  if (vals.onsite) vals.onsite.textContent = pOnsite;
  const hpd = hoursPerDaySel ? parseFloat(hoursPerDaySel.value || "8") : 8;
  const raw = {
    msg: sliders.msg ? Math.round(+sliders.msg.value) : 0,
    dev: sliders.dev ? Math.round(+sliders.dev.value) : 0,
    bi: sliders.bi ? Math.round(+sliders.bi.value) : 0,
    iam: sliders.iam ? Math.round(+sliders.iam.value) : 0,
  };
  if (vals.msg) vals.msg.textContent = raw.msg;
  if (vals.dev) vals.dev.textContent = raw.dev;
  if (vals.bi) vals.bi.textContent = raw.bi;
  if (vals.iam) vals.iam.textContent = raw.iam;

  // const pOnsite = Math.round(+sliders.onsite.value);
  // if (vals.onsite) vals.onsite.textContent = pOnsite;
  // const hpd = parseFloat(hoursPerDaySel.value || "8");
  // const raw = {
  //   msg: Math.round(+sliders.msg.value),
  //   dev: Math.round(+sliders.dev.value),
  //   bi: Math.round(+sliders.bi.value),
  //   iam: Math.round(+sliders.iam.value),
  // };
  // if (vals.msg) vals.msg.textContent = raw.msg;
  // if (vals.dev) vals.dev.textContent = raw.dev;
  // if (vals.bi) vals.bi.textContent = raw.bi;
  // if (vals.iam) vals.iam.textContent = raw.iam;
  const h =
    mode === "days"
      ? {
          msg: raw.msg * hpd,
          dev: raw.dev * hpd,
          bi: raw.bi * hpd,
          iam: raw.iam * hpd,
        }
      : raw;
  const z = {
    msg: h.msg * rates.msg,
    dev: h.dev * rates.dev,
    bi: h.bi * rates.bi,
    iam: h.iam * rates.iam,
  };
  const sumOhne = z.msg + z.dev + z.bi + z.iam;
  const hGes = h.msg + h.dev + h.bi + h.iam;
  const hOn = hGes * (pOnsite / 100);
  // PLZ bleibt editierbar, Default nur beim Laden
  const rawPlz = plzInput?.value?.trim() || "4000";
  const prefix = /^\d{2,}/.test(rawPlz) ? rawPlz.slice(0, 2) : "";
  const ratePct = prefix && prefix in plzMatrix ? plzMatrix[prefix] : 25;
  const sAvg = hGes > 0 ? sumOhne / hGes : 0;
  const zuschlag = hGes > 0 ? hOn * sAvg * (ratePct / 100) : 0;
  const sumMit = sumOhne + zuschlag;
  const onsiteUnit = mode === "days" ? "Tage" : "Stunden";
  let onsiteValue = hOn;
  if (mode === "days") {
    onsiteValue = hGes > 0 ? (hOn / hpd).toFixed(2) : 0;
  } else {
    onsiteValue = Math.ceil(hOn);
  }
  let zuschlagText = zuschlag === 0 ? "Ohne Zuschlag" : `CHF ${chf0(zuschlag)}`;
  let distanzText =
    ratePct === 0
      ? `${prefix}  → ohne Zuschlag`
      : `${prefix}  → +${ratePct}% Zuschlag`;
  let distanzLine = pOnsite > 0 ? `Distanzklasse: ${distanzText}\n` : "";
  const resultEl = document.getElementById("result");
  if (resultEl) {
    resultEl.textContent = `Messaging: CHF ${chf0(
      z.msg
    )}\nEntwicklung: CHF ${chf0(z.dev)}\nBusiness Intelligence: CHF ${chf0(
      z.bi
    )}\nIdentity & Access Management: CHF ${chf0(
      z.iam
    )}\n---------------------------------------\nGesamt ohne Zuschlag: CHF ${chf0(
      sumOhne
    )}\nOnsite Anteil: ${chf0(
      pOnsite
    )} %\nOnsite ${onsiteUnit}: ${onsiteValue}\n${distanzLine}Zuschlag (auf Onsite): ${zuschlagText}\nGesamt mit Zuschlag: CHF ${chf0(
      sumMit
    )}`;
  }
  // let distanzLine = pOnsite > 0 ? `Distanzklasse: ${distanzText}\n` : "";
  // document.getElementById("result").textContent = `Messaging: CHF ${chf0(
  //   z.msg
  // )}\nEntwicklung: CHF ${chf0(z.dev)}\nBusiness Intelligence: CHF ${chf0(
  //   z.bi
  // )}\nIdentity & Access Management: CHF ${chf0(
  //   z.iam
  // )}\n---------------------------------------\nGesamt ohne Zuschlag: CHF ${chf0(
  //   sumOhne
  // )}\nOnsite Anteil: ${chf0(
  //   pOnsite
  // )} %\nOnsite ${onsiteUnit}: ${onsiteValue}\n${distanzLine}Zuschlag (auf Onsite): ${zuschlagText}\nGesamt mit Zuschlag: CHF ${chf0(
  //   sumMit
  // )}`;
}
["msg", "dev", "bi", "iam", "onsite"].forEach((k) =>
  sliders[k]?.addEventListener("input", calc)
);
hoursPerDaySel?.addEventListener("change", calc);
plzInput?.addEventListener("input", calc);
setMode("hours");
calc();

// --- Motion Layer: Scroll-Reveal, Tilt-Karten, Aura ---
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

function initTiltCards() {
  const cards = document.querySelectorAll(".tilt-card");
  if (!cards.length || prefersReducedMotion) return;
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = x / r.width - 0.5;
      const cy = y / r.height - 0.5;
      card.style.setProperty("--ry", `${(cx * 10).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(cy * -8).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${((x / r.width) * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${((y / r.height) * 100).toFixed(1)}%`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const fibers = initFibers(document.getElementById("fiberCanvas"));
  initChapters(fibers);
  initReveal();
  initTiltCards();
  initContactForm();
});
