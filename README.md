# Webpack & TailwindCSS Website

Dieses Projekt ist ein einfaches Beispiel für eine Website mit Webpack und TailwindCSS.

## Starten

1. Installiere die Abhängigkeiten:
   ```powershell
   npm install
   ```
2. Baue das Projekt:
   ```powershell
   npx webpack
   ```
3. Öffne die Datei `dist/index.html` im Browser.

`npm run build` baut `dist/` jedes Mal komplett neu aus `src/` (vorher wird `dist/` geleert). Statische Dateien, die die Seite direkt lädt (`mapbox.js`, `skills.js`, `skills.json`, `img/`), stehen in `STATIC_FILES` in `webpack.config.js`; nie von Hand in `dist/` ablegen.

## Struktur
- `src/index.html` – Haupt-HTML-Datei
- `src/main.js` – Einstiegspunkt für JavaScript
- `src/main.css` – TailwindCSS-Stile
- `webpack.config.js` – Webpack-Konfiguration
- `postcss.config.js` – PostCSS-Konfiguration

## Motion-Konzept "Future-State"

Entwurf nach dem Motionsites-Sample "Future-State", eingefärbt im Farbton der Original-Variante: Hintergrund `#222222`, Akzent Gold `#FFC125`. Frühere Stände liegen vollständig in `_backup_film-konzept/` und `_backup_agent-wave/`.

- **Glasfasern** (`src/fibers.js`): rund 220 Fasern laufen gebündelt von oben links ins Bild und fächern zu einer Wolke leuchtender Spitzen rechts der Mitte auf. Gerechnet per WebGL, ohne Bibliothek. Datenimpulse laufen die Fasern entlang, die vordersten Spitzen zerfliessen zu Bokeh. Die Szene reagiert auf Scroll und Zeiger und wird nach dem Hero gedimmt. Ohne WebGL erscheint ein ruhiger Verlauf.
- **Intro** (`src/intro.js`, ca. 5 s): Die Fasern wachsen vom Bündel zu ihren Spitzen. Ein Protokoll meldet dazu die vier Kompetenzfelder als "verbunden", ein Zähler läuft bis 100 %, danach erscheint die Wortmarke unten links, wo anschliessend die Headline steht. Unten rechts lädt ein HUD-Loader scheinbar die fünf Kapitel (Segmentring, Blockbalken, Status WARTE/LÄDT/OK, zum Schluss BEREIT). Einmal pro Session (`sessionStorage`-Key `ascnet-fs-intro-seen`), überspringbar per Button, Klick, Enter, Leertaste oder Escape. Mit `?intro` in der Adresse läuft es jederzeit erneut.
- **Kapitel** (`src/chapters.js`): Jede Section mit `data-scene` und `data-scene-title` wird zum Kapitel. Das Dock unten ist die Timeline aus dem Film-Konzept, mit Kapitelmarkern und einem Playhead, der sich mit Maus oder Touch ziehen lässt. Pfeil links/rechts springt zum vorherigen bzw. nächsten Kapitel. Beim Sprung blendet der Inhalt kurz aus, ein Lichtimpuls läuft durch alle Fasern bis zu den Spitzen.
- **Schalter "Motion"** im Dock hält die Animation an (`localStorage`-Key `ascnet-motion`).
- `prefers-reduced-motion` schaltet Intro, Sprung-Blenden und Animationen ab und zeigt die Fasern als Standbild.
## Kontaktformular (Cloudflare Pages Function + EmailJS)

Das Formular sendet an die eigene Pages Function `functions/api/contact.js` (`POST /api/contact`). Sie prüft Eingaben, Honeypot und Cloudflare Turnstile und ruft EmailJS serverseitig mit Private Key auf. Im Browser-Code stehen keine Schlüssel und IDs mehr; sie liegen als Secrets im Pages-Projekt.

- Einrichtung in EmailJS und Cloudflare: **`docs/cloudflare-pages-kontaktformular.md`**
- Lokal: `.dev.vars.example` nach `.dev.vars` kopieren, dann `npm run build`, `npm run dev:api` (Function auf Port 8788) und `npm run dev` (Port 8080, leitet `/api` weiter).
- Der öffentliche Turnstile Site Key kommt beim Build aus der Umgebungsvariable `TURNSTILE_SITE_KEY`, der Mapbox-Token aus `MAPBOX_TOKEN`. Lokal stehen beide in einer `.env` (Vorlage `.env.example`, nicht im Git).
## Impressum und Datenschutz

`src/impressum.html` und `src/datenschutz.html` sind eigene Seiten mit dem schlanken Webpack-Einstieg `src/legal.js` (nur Styles, keine Animation). Die Firmendaten stammen aus dem UID-Register (CHE-180.731.045) und Zefix. Die Datenschutzerklärung beschreibt die tatsächlich eingesetzten Dienste: Cloudflare (Hosting), Cloudflare Turnstile, EmailJS und Microsoft (Kontaktformular), Mapbox (Karte) und Google Fonts. Wird ein Dienst ergänzt oder entfernt, muss die Erklärung nachgeführt werden.
## SEO

Titles, Descriptions, Canonicals, Open Graph, strukturierte Daten, `robots.txt`, `sitemap.xml`, `_headers` (noindex für pages.dev) und die 404-Seite sind in **`docs/SEO-IMPLEMENTATION.md`** beschrieben, inklusive Anleitung für Google Search Console und Cloudflare Web Analytics. `npm run build` erzeugt einen Produktions-Build.

## Hinweise
- Die Entwicklung läuft im Modus "development".
- Passe die Konfigurationen nach Bedarf an.
