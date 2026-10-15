// HTTP- und SEO-Prüfungen gegen den ausgelieferten Stand (ohne Zusatzpakete).
//
//   Terminal 1:  npm run build && npm run dev:api     (Pages-Server auf Port 8788)
//   Terminal 2:  npm test
//
// Gegen eine andere Adresse prüfen (z. B. live):  BASE_URL=https://ascnet.ch npm test
// Spezifikation: docs/sdd/agents.md §6, Anforderungen REQ-042, REQ-050 bis REQ-053.

import { test, before } from "node:test";
import assert from "node:assert/strict";

const BASE = (process.env.BASE_URL || "http://127.0.0.1:8788").replace(/\/$/, "");
const PAGES = ["/", "/impressum", "/datenschutz"];

const get = (path, init) => fetch(BASE + path, { redirect: "manual", ...init });
const text = async (path) => (await get(path)).text();
const meta = (html, re) => (html.match(re) || [])[1] || "";

before(async () => {
  try {
    await get("/");
  } catch {
    throw new Error(
      `Server unter ${BASE} nicht erreichbar. Vorher "npm run build" und "npm run dev:api" starten oder BASE_URL setzen.`
    );
  }
});

test("Statuscodes und Content-Types", async () => {
  const expectations = [
    ["/", 200, /text\/html/],
    ["/impressum", 200, /text\/html/],
    ["/datenschutz", 200, /text\/html/],
    ["/robots.txt", 200, /text\/plain/],
    ["/sitemap.xml", 200, /xml/],
    ["/favicon.ico", 200, /icon/],
    ["/fonts.css", 200, /text\/css/],
    ["/fonts/saira-normal-latin.woff2", 200, /font\/woff2|octet-stream/],
    ["/gibtsnicht", 404, /text\/html/],
    ["/a/b/c", 404, /text\/html/],
  ];
  for (const [path, status, type] of expectations) {
    const res = await get(path);
    assert.equal(res.status, status, `${path}: Status ${res.status}, erwartet ${status}`);
    assert.match(res.headers.get("content-type") || "", type, `${path}: Content-Type`);
  }
});

test("404-Seite: noindex, kein Soft-404", async () => {
  const html = await text("/gibtsnicht");
  assert.match(html, /<meta name="robots" content="noindex/);
  assert.match(html, /<h1[^>]*>[\s\S]*Seite nicht[\s\S]*<\/h1>/);
});

test("robots.txt: Sitemap-Verweis, /api/ gesperrt, Inhalt frei", async () => {
  const robots = await text("/robots.txt");
  assert.match(robots, /^Sitemap: https:\/\/ascnet\.ch\/sitemap\.xml$/m);
  assert.match(robots, /^Disallow: \/api\/$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.doesNotMatch(robots, /^Disallow: \/\s*$/m, "robots.txt sperrt die ganze Seite");
});

test("Sitemap: nur kanonische Seiten, jede mit 200 und passendem Canonical", async () => {
  const xml = await text("/sitemap.xml");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.deepEqual(locs.sort(), ["https://ascnet.ch/", "https://ascnet.ch/datenschutz", "https://ascnet.ch/impressum"]);
  for (const loc of locs) {
    const path = new URL(loc).pathname;
    const html = await text(path);
    assert.equal(meta(html, /<link rel="canonical" href="([^"]+)"/), loc, `Canonical von ${path}`);
  }
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  assert.equal(lastmods.length, locs.length);
  lastmods.forEach((d) => assert.match(d, /^\d{4}-\d{2}-\d{2}$/));
});

test("Seiten: Titel, Description, lang, Robots, Canonical, Open Graph", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const path of PAGES) {
    const html = await text(path);
    const where = `Seite ${path}`;
    assert.match(html, /<html lang="de-CH"/, `${where}: lang`);
    const title = meta(html, /<title>([^<]+)<\/title>/).replace(/&amp;/g, "&");
    const desc = meta(html, /<meta name="description" content="([^"]+)"/);
    assert.ok(title.length > 10 && title.length <= 65, `${where}: Title-Länge ${title.length}`);
    assert.ok(desc.length >= 70 && desc.length <= 165, `${where}: Description-Länge ${desc.length}`);
    assert.ok(!titles.has(title), `${where}: Title doppelt`);
    assert.ok(!descriptions.has(desc), `${where}: Description doppelt`);
    titles.add(title);
    descriptions.add(desc);
    assert.match(html, /<meta name="robots" content="index, follow"/, `${where}: robots`);
    assert.equal(meta(html, /<link rel="canonical" href="([^"]+)"/), "https://ascnet.ch" + path, `${where}: Canonical`);
    for (const prop of ["og:title", "og:description", "og:url", "og:image", "og:type", "og:locale"]) {
      assert.ok(meta(html, new RegExp(`<meta property="${prop}" content="([^"]+)"`)), `${where}: ${prop}`);
    }
    assert.ok(meta(html, /<meta name="twitter:card" content="([^"]+)"/), `${where}: twitter:card`);
    assert.match(html, /<link rel="icon"/, `${where}: Favicon`);
  }
});

test("Überschriften: genau eine H1 pro Seite, keine Sprünge", async () => {
  for (const path of PAGES) {
    const html = await text(path);
    const levels = [...html.matchAll(/<h([1-3])[\s>]/g)].map((m) => Number(m[1]));
    assert.equal(levels.filter((l) => l === 1).length, 1, `${path}: Anzahl H1`);
    for (let i = 1; i < levels.length; i++) {
      assert.ok(levels[i] - levels[i - 1] <= 1, `${path}: Sprung von h${levels[i - 1]} auf h${levels[i]}`);
    }
  }
});

test("Strukturierte Daten: ein gültiger JSON-LD-Block mit Organization, WebSite und 4 Services", async () => {
  const html = await text("/");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1, "genau ein JSON-LD-Block");
  const graph = JSON.parse(blocks[0][1])["@graph"];
  const types = graph.map((n) => n["@type"]);
  assert.deepEqual(types.sort(), ["Organization", "Service", "Service", "Service", "Service", "WebSite"]);
  const org = graph.find((n) => n["@type"] === "Organization");
  assert.equal(org.identifier.value, "CHE-180.731.045");
  assert.match(org.address.streetAddress, /Chamerstrasse 174/);
});

test("Schweizer Schreibweise und keine Google-Dienste im HTML", async () => {
  for (const path of PAGES) {
    const html = await text(path);
    assert.doesNotMatch(html, /ß/, `${path}: enthält ß`);
    assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic/, `${path}: verweist auf Google Fonts`);
    assert.ok((html.match(/cloudflareinsights\.com\/beacon/g) || []).length <= 1, `${path}: Analytics-Beacon doppelt`);
    assert.doesNotMatch(html, /googletagmanager|google-analytics/, `${path}: Google Analytics`);
  }
});

test("Interne Links: alle liefern 200", async () => {
  const links = new Set();
  for (const path of PAGES) {
    const html = await text(path);
    for (const m of html.matchAll(/<a [^>]*href="(\/[^"#]*)(?:#[^"]*)?"/g)) links.add(m[1] || "/");
  }
  assert.ok(links.size >= 3, "keine internen Links gefunden");
  for (const link of links) {
    assert.equal((await get(link)).status, 200, `Link ${link}`);
  }
});

// Ohne Secrets (.dev.vars) antwortet die Function vor jeder Prüfung mit 500 "config"
const noSecrets = async (res) => res.status === 500 && (await res.clone().json()).error === "config";

test("Kontakt-Function: GET 405", async () => {
  const res = await get("/api/contact");
  assert.equal(res.status, 405);
  assert.equal((await res.json()).error, "method");
});

test("Kontakt-Function: leere Eingabe 400", async (t) => {
  const res = await get("/api/contact", { method: "POST", body: new FormData() });
  if (await noSecrets(res)) return t.skip("keine Secrets (.dev.vars) gesetzt");
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "invalid");
});

test("Kontakt-Function: Honeypot antwortet 200 ohne Versand", async (t) => {
  const fd = new FormData();
  fd.set("name", "Test");
  fd.set("email", "test@example.ch");
  fd.set("message", "Hallo");
  fd.set("website", "http://spam.example");
  const res = await get("/api/contact", { method: "POST", body: fd });
  if (await noSecrets(res)) return t.skip("keine Secrets (.dev.vars) gesetzt");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});

test("Hosting: pages.dev ist noindex (nur gegen Pages-Adressen prüfbar)", async (t) => {
  if (!/\.pages\.dev$/.test(new URL(BASE).hostname)) return t.skip("nur bei BASE_URL=https://<projekt>.pages.dev");
  assert.match((await get("/")).headers.get("x-robots-tag") || "", /noindex/);
});
