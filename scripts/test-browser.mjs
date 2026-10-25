// Browser-Prüfungen: Kalkulator-Referenzfall, Navigation, Skills-Fenster, Intro,
// Handyansicht, Laden von Schriften und Karte.
//
// Zusatzwerkzeuge (bewusst nicht in package.json, damit der Cloudflare-Build schlank bleibt):
//   npm install --no-save puppeteer-core@23.11.1
//   Chrome: Standardpfad Windows, sonst CHROME_PATH setzen
//
//   Terminal 1:  npm run build && npm run dev:api
//   Terminal 2:  npm run test:browser
//
// Optional: BASE_URL=https://ascnet.ch npm run test:browser
// Spezifikation: docs/sdd/agents.md §6, REQ-011 bis 014, REQ-030, REQ-031.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";

const BASE = (process.env.BASE_URL || "http://127.0.0.1:8788").replace(/\/$/, "");
const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let puppeteer;
let browser;

before(async () => {
  try {
    puppeteer = (await import("puppeteer-core")).default;
  } catch {
    throw new Error('puppeteer-core fehlt: "npm install --no-save puppeteer-core@23.11.1" ausführen.');
  }
  try {
    await fetch(BASE + "/");
  } catch {
    throw new Error(`Server unter ${BASE} nicht erreichbar ("npm run build" und "npm run dev:api").`);
  }
  browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  });
});

after(async () => {
  await browser?.close();
});

// Neue Seite; Intro gilt als gesehen, ausser skipIntro ist false
async function open(path, { viewport = { width: 1440, height: 900 }, skipIntro = true, reduced = false } = {}) {
  const page = await browser.newPage();
  const errors = [];
  const requests = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => requests.push(r.url()));
  await page.setViewport(viewport);
  if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  if (skipIntro) await page.evaluateOnNewDocument(() => sessionStorage.setItem("ascnet-fs-intro-seen", "1"));
  await page.goto(BASE + path, { waitUntil: "networkidle2" });
  return { page, errors, requests };
}

test("Preis-Kalkulator: Referenzfall CHF 182'148", async () => {
  const { page, errors } = await open("/", { reduced: true });
  await page.evaluate(() => {
    const set = (id, v) => {
      const el = document.getElementById(id);
      el.value = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };
    document.getElementById("modeDays").click();
    set("msgSlider", 63);
    set("biSlider", 60);
    set("onsiteSlider", 30);
    set("plzInput", "8000");
  });
  const result = await page.$eval("#result", (el) => el.textContent);
  assert.match(result, /Gesamt ohne Zuschlag: CHF 169[’']?\s?[’']?\d*/);
  assert.match(result, /Messaging: CHF 80[’']640/);
  assert.match(result, /Business Intelligence: CHF 88[’']800/);
  assert.match(result, /Gesamt ohne Zuschlag: CHF 169[’']440/);
  assert.match(result, /Zuschlag \(auf Onsite\): CHF 12[’']708/);
  assert.match(result, /Gesamt mit Zuschlag: CHF 182[’']148/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("Navigation: Kapitelsprung, Pfeiltaste, Skills-Fenster", async () => {
  const { page, errors } = await open("/");
  await sleep(1200);
  await page.click('.top-nav a[href="#preise"]');
  await sleep(1800);
  assert.equal(await page.$eval("#chapterNo", (e) => e.textContent), "05");
  assert.equal(await page.$eval("#chapterOf", (e) => e.textContent), "/06");
  assert.equal(await page.$eval("#chapterTitle", (e) => e.textContent), "Preise");
  await page.keyboard.press("ArrowRight");
  await sleep(1800);
  assert.equal(await page.$eval("#chapterTitle", (e) => e.textContent), "Kontakt");
  await page.click('.top-nav a[href="#vorgehen"]');
  await sleep(1800);
  assert.equal(await page.$eval("#chapterNo", (e) => e.textContent), "04");
  assert.equal(await page.$eval("#chapterTitle", (e) => e.textContent), "Vorgehen");

  await page.evaluate(() => document.getElementById("leistungen").scrollIntoView());
  await sleep(800);
  await page.click('.skill-btn[data-area="iam"]');
  await sleep(600);
  assert.equal(await page.$eval("#skill-modal", (e) => e.classList.contains("hidden")), false, "Modal offen");
  assert.equal((await page.$$("#skill-list > div")).length, 8, "8 Einträge im Identity-Profil");
  await page.keyboard.press("Escape");
  await sleep(300);
  assert.equal(await page.$eval("#skill-modal", (e) => e.classList.contains("hidden")), true, "Modal geschlossen");
  assert.deepEqual(errors, []);
  await page.close();
});

test("Intro: spielt mit ?intro, ist nach ca. 5 s vorbei, kein Intro bei gesetztem Schlüssel", async () => {
  const withIntro = await open("/?intro", { skipIntro: false });
  assert.equal(await withIntro.page.evaluate(() => !!document.querySelector("#intro")), true, "Intro vorhanden");
  const t0 = Date.now();
  await withIntro.page.waitForSelector("body.is-live", { timeout: 9000 });
  const seconds = (Date.now() - t0) / 1000;
  assert.ok(seconds < 6.5, `Intro dauerte ${seconds.toFixed(1)} s`);
  assert.equal(withIntro.page.url().includes("intro"), false, "?intro wird aus der Adresse entfernt");
  await withIntro.page.close();

  const skipped = await open("/");
  assert.equal(await skipped.page.evaluate(() => document.documentElement.classList.contains("skip-intro")), true);
  await skipped.page.close();
});

test("Handyansicht: kein horizontaler Überlauf", async () => {
  for (const path of ["/", "/impressum", "/datenschutz", "/agb"]) {
    const { page } = await open(path, { viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true }, reduced: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `${path}: ${overflow}px Überlauf`);
    await page.close();
  }
});

test("Dienste: keine Google-/Mapbox-Anfragen beim Laden, Karte lädt nach dem Scrollen", async (t) => {
  const { page, requests, errors } = await open("/");
  await sleep(1500);
  assert.equal(requests.filter((u) => /fonts\.(googleapis|gstatic)/.test(u)).length, 0, "Google Fonts");
  assert.equal(requests.filter((u) => /mapbox\.com/.test(u)).length, 0, "Mapbox beim Laden");
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family);
  });
  assert.ok(fonts.includes("Saira") && fonts.includes("JetBrains Mono"), `geladene Schriften: ${fonts}`);

  const hasToken = await page.$eval("#map", (el) => !!el.dataset.mapboxToken);
  if (!hasToken) {
    t.diagnostic("Kein Mapbox-Token im HTML (MAPBOX_TOKEN beim Build setzen): Kartenprüfung übersprungen");
  } else {
    await page.evaluate(() => document.getElementById("kontakt").scrollIntoView());
    await sleep(4500);
    assert.equal(await page.evaluate(() => !!document.querySelector("#map canvas.mapboxgl-canvas")), true, "Karte gerendert");
    assert.equal(await page.evaluate(() => !!document.querySelector("#map .mapboxgl-marker")), true, "Markierung");
  }
  assert.deepEqual(errors.filter((e) => !/WebGL/i.test(e)), []);
  await page.close();
});
