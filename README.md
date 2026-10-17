# ascnet.ch – Website der ASCNET Solutions GmbH

Firmenwebsite mit Glasfaser-Hintergrund (WebGL), Intro, Dock-Navigation, Preis-Kalkulator, Karte und Kontaktformular. Gebaut mit Webpack 5, Tailwind CSS 4 und Vanilla JavaScript; ausgeliefert über Cloudflare Pages mit einer Pages Function für das Formular.

Live: <https://ascnet.ch>

## Schnellstart

Voraussetzung: Node.js 22.

```powershell
npm install
copy .env.example .env      # MAPBOX_TOKEN eintragen (sonst keine Karte)
npm run dev                 # Entwicklungsserver auf http://localhost:8080
```

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver mit Live-Reload (Port 8080) |
| `npm run build` | Produktions-Build nach `dist/` (minifiziert; `dist/` wird bei jedem Lauf geleert) |
| `npm run dev:api` | Pages Function und statische Seite lokal wie bei Cloudflare (Port 8788); vorher `npm run build` |
| `npm test` | HTTP-/SEO-Prüfungen gegen den lokalen Pages-Server (siehe unten) |
| `npm run test:browser` | Browser-Prüfungen (Kalkulator, Navigation, Karte); braucht `puppeteer-core` und Chrome |
| `npm run lighthouse` | Lighthouse-Messung der drei Seiten |

Das Formular lokal testen: `.dev.vars.example` nach `.dev.vars` kopieren und ausfüllen, dann `npm run build`, `npm run dev:api` und in einem zweiten Terminal `npm run dev` (leitet `/api` an die Function weiter). Mit echten Werten in `.dev.vars` werden echte Mails versendet.

## Struktur

| Pfad | Inhalt |
|---|---|
| `src/index.html`, `src/main.js` | Startseite und Einstieg (Kalkulator, Reveal, Tilt) |
| `src/fibers.js`, `src/intro.js`, `src/chapters.js` | Hintergrund (WebGL), Intro mit Kapitel-Loader, Dock und Kapitelsprünge |
| `src/contact.js`, `functions/api/contact.js` | Formular im Browser und Pages Function (Turnstile, EmailJS) |
| `src/impressum.html`, `src/datenschutz.html`, `src/agb.html`, `src/404.html`, `src/legal.js` | Rechtsseiten und Fehlerseite (schlanker Einstieg) |
| `src/mapbox.js`, `src/skills.js`, `src/skills.json`, `src/plz.json` | Karte (lädt bei Bedarf), Skills-Fenster, Zuschlagstabelle |
| `src/main.css`, `src/fonts*`, `src/img/` | Styles, lokale Schriften, Logos und Favicons |
| `src/robots.txt`, `src/sitemap.xml`, `src/_headers`, `src/favicon.ico` | SEO- und Hosting-Dateien |
| `webpack.config.js` | Build (zwei Einstiege, statische Dateien über `STATIC_FILES`, Build-Variablen aus `.env`) |
| `scripts/` | Prüfskripte (`npm test` und weitere) |
| `docs/` | Betriebs- und SEO-Doku, Spezifikation (`docs/sdd/`), Logo-Original (`docs/logo/`) |

Statische Dateien, die die Seite direkt lädt, gehören nach `src/` und in die Liste `STATIC_FILES`. Nie von Hand in `dist/` ablegen.

## Konfiguration

Build-Variablen (lokal in `.env`, bei Cloudflare als Variablen vom Typ „Text“): `MAPBOX_TOKEN`, `TURNSTILE_SITE_KEY`. Secrets der Function (lokal in `.dev.vars`, bei Cloudflare als „Secret“): `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `TURNSTILE_SECRET_KEY`. `.env` und `.dev.vars` sind nicht im Git.

## Betrieb

Jeder Push auf `main` löst bei Cloudflare Pages ein Production-Deployment aus (Build `npm run build`, Ausgabe `dist`). Einrichtung von Cloudflare, EmailJS und Turnstile: [`docs/cloudflare-pages-kontaktformular.md`](docs/cloudflare-pages-kontaktformular.md). Auf eine `wrangler.jsonc` wird bewusst verzichtet; die Einstellungen werden im Pages-Dashboard gepflegt.

## Dokumentation

- [`docs/sdd/`](docs/sdd/): Spezifikation (Anforderungen, Entscheidungen, Baufolge, Arbeitsregeln). Änderungen werden zuerst mit [`templates/change.md`](docs/sdd/templates/change.md) als Spec erfasst.
- [`docs/SEO-IMPLEMENTATION.md`](docs/SEO-IMPLEMENTATION.md): SEO-Umsetzung, Search Console, Cloudflare Web Analytics, Messwerte.
- [`docs/cloudflare-pages-kontaktformular.md`](docs/cloudflare-pages-kontaktformular.md): Cloudflare-, EmailJS- und Turnstile-Einrichtung.
- [`src/fonts/README.md`](src/fonts/README.md): Schriften und Lizenzen.

## Prüfen

```powershell
npm run build
npm run dev:api          # Terminal 1: Pages-Server auf Port 8788
npm test                 # Terminal 2: HTTP-/SEO-Prüfungen (ohne Zusatzpakete)
```

Die Browser-Prüfungen und Lighthouse brauchen zusätzliche Werkzeuge, die bewusst nicht in `package.json` stehen (der Cloudflare-Build installiert alle Abhängigkeiten): `npm install --no-save puppeteer-core@23.11.1`, dazu Chrome (Pfad über `CHROME_PATH`). Ablauf und Prüfroutine: [`docs/sdd/agents.md`](docs/sdd/agents.md) §6.
