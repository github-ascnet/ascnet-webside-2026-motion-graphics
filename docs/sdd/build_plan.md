# build_plan.md – Baufolge (rückwärts rekonstruiert)

SDD-Modus **INIT**, Stand 15.10.2026. Die Arbeitspakete (BP) zeigen, **in welcher Reihenfolge** der heutige Stand entstanden ist. Sie wurden aus Code, Git, Dokumentation und dem Projektverlauf rekonstruiert, nicht vorab geplant.

**Lesehilfe**
- Status aller BP-001 bis BP-017: `abgeschlossen` (Ausnahmen genannt).
- **Git-Zuordnung:** Das erste Commit `d5e6acc` (12.10.2026) bündelt die Arbeit von BP-001 bis BP-009. Eine feinere Zuordnung einzelner Pakete zu Commits ist **nicht belegbar** und wird nicht erfunden. Ab BP-010 ist die Zuordnung eindeutig.
- **Nachweis** nennt Datei, Commit oder Messung. Herkunftsmarken wie in `project_plan.md`.
- Zeitangaben vor dem 12.10. sind `[offen]`: Es gibt keine Commits davor. Die Entwicklung der Entwürfe fand im Projektverlauf zwischen dem 11. und 12.10.2026 statt. `[Auftrag]`
- Frühere Entwurfsstände (andere Hintergrundmotive, helles Design) sind bewusst nicht Teil dieser Dokumentation.

Abhängigkeiten in einem Blick:

```
BP-001 ─┬─ BP-002 ── BP-003 ── BP-004 ── BP-005 ─┬─ BP-006 ── BP-007
        │                                         └─ BP-008 ── BP-009 ── BP-010 ── BP-011 ── BP-012 ── BP-013
        └──────────────────────────────────────────────────────────────────────────────────────────── BP-014 ── BP-015
```

---

## BP-001 Basis (Vorbestand)
- **Ziel:** Funktionierende Firmenwebsite mit Kalkulator, Skills, Karte, Formular.
- **Scope:** Webpack/Tailwind-Projekt, Seitenstruktur, Preis-Kalkulator, Skills-Fenster, Mapbox-Karte, Kontaktformular (damals Browser-Versand über EmailJS-SDK), Footer.
- **Voraussetzungen:** keine (Vorbestand, Projekt `ascnet-webside-2025`).
- **Dateien:** `src/index.html`, `src/main.js` (Kalkulator), `src/plz.json`, `src/skills.js`, `src/skills.json`, `src/mapbox.js`, `webpack.config.js`, `package.json`.
- **Schritte:** nicht rekonstruierbar (`[offen]`); der Zustand zu Beginn der Arbeit ist die Ausgangslage.
- **Abschlusskriterien (Ist):** Kalkulator-Referenzfall CHF 182'148; Skills-Fenster öffnet für alle vier Bereiche.
- **Nachweis:** `[Code]`; Rechenlogik unverändert in `main.js` (Stundensätze 160/170/185/200).
- **REQ/DEC:** REQ-020, 022, 023, 024, 030 · DEC-001, DEC-008

## BP-002 Hintergrund „Future-State“ (WebGL)
- **Ziel:** Animierter Glasfaser-Hintergrund als Markenmotiv.
- **Scope:** Punktpuffer (Fasern, Spitzen, Bokeh, Staub), Vertex-/Fragment-Shader, Animationsschleife, Anpassung an Hoch-/Querformat, Scroll-, Zeiger-, Impuls-Steuerung, Fallback ohne WebGL.
- **Voraussetzungen:** BP-001.
- **Dateien:** `src/fibers.js`, `src/index.html` (`#fiberCanvas`, `.fx-shade`), `src/main.css` (`.fx-canvas`, `.fx-shade`).
- **Schritte:** Fasern entlang quadratischer Bézierkurven vom oberen linken Bündel zur Wolke; Impulse entlang der Fasern; Bokeh nur für die vordersten Spitzen; Bilddichte für kleine Bildschirme reduziert; Wachstumsanimation für das Intro (`scatter`, `form`).
- **Abschlusskriterien:** Szene sichtbar hinter allen Kapiteln (gedimmt nach dem Hero), kein Fehler ohne WebGL, mit „Motion aus“ angehalten.
- **Nachweis:** `[Code]` `src/fibers.js` (361 Zeilen); Screenshots Desktop/Handy `[Messung]`; 22–25 Bilder/s mit Software-Grafik `[Messung]`.
- **REQ/DEC:** REQ-010, REQ-014 · DEC-002, DEC-003

## BP-003 Intro mit Kapitel-Loader
- **Ziel:** Intro von ca. 5 s als Auftakt.
- **Scope:** Wachstum der Fasern, Protokoll „verbunden“, Wortmarke, Zähler, Skip, Session-Logik; HUD-Loader für die fünf Kapitel.
- **Voraussetzungen:** BP-002.
- **Dateien:** `src/intro.js`, `src/index.html` (`#intro`), `src/main.css` (Intro- und Loader-Styles).
- **Schritte:** Zeitplan `GROW_MS` 3900 / `LEAVE_AT` 4600 / `DONE_AT` 5300 ms; Loader: Ring mit fünf Segmenten, Zeilen mit je 10 Blöcken, „Hänger“ (zufälliger Stillstand), Status WARTE/LÄDT/OK, BEREIT; Prozentwerte ohne führende Nullen; `?intro` erzwingt Wiederholung (Link im Footer wurde später entfernt).
- **Abschlusskriterien:** Seite nach ca. 5 s bedienbar; Loader steht bei BEREIT vor der Wortmarke; Skip beendet sofort; mit gesetztem Sitzungsschlüssel kein Intro.
- **Nachweis:** `[Messung]` zeitgesteuerte Screenshots und Statusabfrage (live-Klasse nach 5,0 s); `[Code]` `src/intro.js`.
- **REQ/DEC:** REQ-011, REQ-012 · DEC-004

## BP-004 Dock-Navigation und Kapitelsprünge
- **Ziel:** Navigation als Dock unten, Kapitelwechsel mit Impuls.
- **Scope:** Kapitelverwaltung, Timeline mit Markern und ziehbarem Abspielkopf, Menü-Overlay Handy, Pfeiltasten, Motion-Schalter, Hero-Parallax.
- **Voraussetzungen:** BP-002.
- **Dateien:** `src/chapters.js`, `src/index.html` (`#topbar`, `#timeline`, `#mobile-menu`), `src/main.css` (Dock, Menü).
- **Abschlusskriterien:** Sprung zu „Preise“ zeigt „04/05 Preise“; ArrowRight geht zu „Kontakt“; Handy-Menü öffnet und schliesst.
- **Nachweis:** `[Messung]` Browser-Prüfung (Sprung `y`, aktives Kapitel, Pfeiltaste); `[Code]` `src/chapters.js`.
- **REQ/DEC:** REQ-013, 014, 020 · DEC-007

## BP-005 Erscheinungsbild
- **Ziel:** Endgültiger Look: dunkler Grund, Gold, Typografie, Logo, Abstände.
- **Scope:** Farb-Variablen, Typografie-Stil, Hero-Layout (Headline unten links, Kurzprofil rechts), Karten, Rechner-Elemente, Footer, Original-Logo in Dunkel-Variante, engere Kapitelabstände.
- **Voraussetzungen:** BP-003, BP-004.
- **Dateien:** `src/main.css`, `src/index.html`, `src/img/Logo_smart_dark.png`, `Logo_smart_dark_xl.png`.
- **Schritte:** Hintergrund zuerst `#303030`, dann `#222222`; Blautöne durch Gold/Grau ersetzt; Fasern und Perlen hellblau; Logo aus dem PNG abgeleitet; Kapitelabstand von bis zu 17 rem auf `clamp(2rem,5vh,4rem)` je Seite; Footer „Designed by Opus 5.5“.
- **Abschlusskriterien:** Alle Kapitel auf Desktop und Handy ohne horizontalen Überlauf; Logo lesbar; Rechner und Skills-Fenster farblich stimmig.
- **Nachweis:** `[Messung]` Screenshot-Reihen; `[Code]` `src/main.css` (`--bg`, `--accent`).
- **REQ/DEC:** REQ-001 bis 005, 021, 022 · DEC-005, DEC-006

## BP-006 Firmenadresse und Karte
- **Ziel:** Neue Adresse c/o Sarya AG, Chamerstrasse 174, Karte korrekt.
- **Scope:** Adresse im Kontaktbereich und im JSON-LD, Koordinaten der Karte.
- **Voraussetzungen:** BP-005.
- **Dateien:** `src/index.html`, `src/mapbox.js`.
- **Abschlusskriterien:** Adresse identisch an allen Stellen; Karte zeigt Chamerstrasse (Koordinaten 47.181411 / 8.485225 aus OpenStreetMap).
- **Nachweis:** `[Messung]` Screenshot Karte; frühere Koordinaten lagen ca. 2,7 km zu weit östlich.
- **REQ/DEC:** REQ-025, 031 · DEC-021

## BP-007 Rechtsseiten
- **Ziel:** Impressum und Datenschutzerklärung (AGB folgen mit BP-016).
- **Scope:** Zwei Seiten im Design, Einstieg `legal.js`, Daten aus UID-Register und Zefix, Footer-Links, Webpack-Mehrseiten-Build.
- **Voraussetzungen:** BP-005.
- **Dateien:** `src/impressum.html`, `src/datenschutz.html`, `src/legal.js`, `webpack.config.js`, `src/main.css` (Legal-Styles).
- **Abschlusskriterien:** Footer-Links führen zu den Seiten, Inhaltsverzeichnis springt, Handyansicht ohne Überlauf.
- **Nachweis:** `[Messung]` Browser-Prüfung; Quelle UID-Register `[Doku]`.
- **REQ/DEC:** REQ-040, 041 · DEC-014, DEC-021

## BP-008 Kontaktformular serverseitig
- **Ziel:** Mailversand ohne Schlüssel im Browser, mit Bot-Schutz.
- **Scope:** Pages Function, Turnstile, Honeypot, Eingabeprüfung, Client-Anpassung, Dev-Proxy und lokaler Lauf, Formular-Layout (unten bündig mit Karte), Anleitung für Cloudflare.
- **Voraussetzungen:** BP-005.
- **Dateien:** `functions/api/contact.js`, `src/contact.js`, `src/index.html` (Formular), `webpack.config.js` (Proxy), `.dev.vars.example`, `docs/cloudflare-pages-kontaktformular.md`.
- **Abschlusskriterien:** Alle Function-Antworten laut REQ-032 prüfbar; Testmail kommt an.
- **Nachweis:** `[Messung]` curl-Fälle (405/400/403/500/502/200-Honeypot) mit Platzhalterwerten; Testmail bestätigt durch Projektleitung `[Auftrag]`.
- **REQ/DEC:** REQ-032, 033 · DEC-009, DEC-010

## BP-009 Vollständiger Build und Build-Variablen
- **Ziel:** `npm run build` liefert eine vollständige Seite; keine Geheimnisse im Code.
- **Scope:** Kopierliste `STATIC_FILES`, `output.clean`, `.env`-Leser, Mapbox-Token und Turnstile Site Key als Build-Variablen.
- **Voraussetzungen:** BP-008.
- **Dateien:** `webpack.config.js`, `src/mapbox.js`, `src/index.html`, `.env.example`, `.gitignore`.
- **Abschlusskriterien:** Frischer Build aus einer Kopie ohne `dist` und `node_modules` liefert alle Dateien; `git grep` findet keinen Token.
- **Nachweis:** `[Messung]` Build in leerem Ordner (`npm ci`, `npm run build`); GitHub-Scan nach Umstellung ohne Treffer `[Git]`.
- **REQ/DEC:** REQ-031, 061 · DEC-013, DEC-022

## BP-010 GitHub, Cloudflare Pages und Domain
- **Ziel:** Livegang über Git-Anbindung.
- **Scope:** Repository, Erst-Commit, Push, Pages-Projekt mit Variablen/Secrets, Domain-Umzug von `ascnet-web-2025`, Anleitung in der Reihenfolge Projekt → Variablen → Secrets.
- **Voraussetzungen:** BP-009.
- **Dateien:** `docs/cloudflare-pages-kontaktformular.md`, `README.md`.
- **Abschlusskriterien:** Build-Log zeigt Functions-Upload und Erfolg; Live-Test des Formulars; Domain ausgeliefert.
- **Nachweis:** `[Git]` `d5e6acc`, `0f266c9`; Build-Log aus Cloudflare `[Auftrag]`; Testmail `[Auftrag]`. Der Domain-Umzug wurde von der Projektleitung durchgeführt; das alte Projekt besteht noch (OP-005).
- **REQ/DEC:** REQ-060, 061 · DEC-012

## BP-011 SEO
- **Ziel:** Technische und inhaltliche Suchmaschinen-Optimierung ohne Design-Änderung.
- **Scope:** `robots.txt`, `sitemap.xml`, `_headers`, `404.html`, Canonicals, Titles, Descriptions, Open Graph, Twitter Card, `lang="de-CH"`, JSON-LD, Favicon, Kartentexte, „ss“, kanonische interne Links, Produktions-Build, Dokumentation.
- **Voraussetzungen:** BP-010.
- **Dateien:** `src/robots.txt`, `src/sitemap.xml`, `src/_headers`, `src/404.html`, `src/*.html`, `src/favicon.ico`, `src/img/favicon-32.png`, `src/img/apple-touch-icon.png`, `webpack.config.js`, `package.json`, `docs/SEO-IMPLEMENTATION.md`.
- **Abschlusskriterien:** Prüfskript ohne Befund; Lighthouse-SEO 100 auf allen Seiten; Live: Sitemap als XML, 404 für unbekannte Adressen, noindex auf pages.dev.
- **Nachweis:** `[Git]` `4d80942`; `[Messung]` Lighthouse 92 → 100 (SEO), Live-Prüfung nach Deployment.
- **REQ/DEC:** REQ-023, 042, 050 bis 053, 063, 064 · DEC-015, DEC-016, DEC-018

## BP-012 Performance und Datenschutz
- **Ziel:** Schnellerer Seitenaufruf, kein Google-Dienst.
- **Scope:** Mapbox bei Bedarf laden, lokale Schriften mit Lizenzen, Layoutsprung auf Rechtsseiten beheben, Datenschutzerklärung anpassen.
- **Voraussetzungen:** BP-011.
- **Dateien:** `src/mapbox.js`, `src/fonts.css`, `src/fonts/*`, `src/*.html`, `src/datenschutz.html`, `webpack.config.js`.
- **Abschlusskriterien:** Beim Aufruf 0 Anfragen an Google und Mapbox; Karte lädt nach dem Scrollen vollständig; Lighthouse-Performance der Startseite messbar besser.
- **Nachweis:** `[Git]` `0e6c95f`; `[Messung]` Performance 41 → 83, LCP 7,1 → 3,1 s, TBT 5,1 → 0,2 s, Datenmenge 816 → 320 KB; Live-Prüfung (0 Google-, 0 Mapbox-Anfragen beim Laden).
- **REQ/DEC:** REQ-002, 031, 041, 063 · DEC-011, DEC-017

## BP-013 Besucherstatistik und Search Console
- **Ziel:** Messbarkeit ohne Cookies und ohne Code.
- **Scope:** Cloudflare Web Analytics aktivieren (Pages-Dashboard), Search Console als Domain-Property mit Sitemap, Datenschutzerklärung (Abschnitt 02/06).
- **Voraussetzungen:** BP-011, BP-012 (Datenschutzerklärung vor Aktivierung online).
- **Dateien:** `src/datenschutz.html`, `docs/SEO-IMPLEMENTATION.md`.
- **Abschlusskriterien:** Genau ein Beacon je Seite im Live-HTML; Sitemap in der Search Console „erfolgreich“.
- **Nachweis:** `[Messung]` Live-HTML (Beacon 1×); `[Auftrag]` Bestätigung der Projektleitung für Search Console und Analytics. Die Indexierung der drei Seiten ist nicht geprüft (OP-010).
- **REQ/DEC:** REQ-041, 054, 062 · DEC-019, DEC-020

## BP-014 SDD-Dokumentation (dieses Paket)
- **Ziel:** Rückwärts erstellte Spezifikation, damit der Aufbau nachvollziehbar ist und künftige Änderungen als Spec erfasst werden.
- **Scope:** `docs/sdd/*` (vier SDD-Dateien, Vorlage `templates/change.md`), Verweis in `README.md`. Kein Produktivcode.
- **Voraussetzungen:** BP-001 bis BP-013.
- **Dateien:** `docs/sdd/project_plan.md`, `build_plan.md`, `decisions.md`, `agents.md`, `templates/change.md`, `README.md` (Verweis).
- **Abschlusskriterien:** SDD-CHECK ohne Widerspruch zwischen Dokumentation und Code; alle Dateien aus `git ls-files` in der Komponentenkarte; alle IDs verweisen auf existierende Einträge.
- **Status:** abgeschlossen (SDD-CHECK am 15.10.2026; Nachweis `[Git]` `a0c2cf4`).
- **REQ/DEC:** alle

## BP-015 Aufräumen und Prüfskripte (CHG-001)
- **Ziel:** Die offenen Punkte OP-001, 002, 003, 004, 007 und 009 beheben.
- **Scope:** Copyright-Jahr und `lastmod`; `wrangler.jsonc`, `tailwind.config.js`, `.github/copilot-instructions.md` entfernen; SVG nach `docs/logo/`; Name in `package.json`; README neu; Prüfskripte unter `scripts/`. Nicht im Scope: Produktivcode, Design, Abhängigkeiten.
- **Voraussetzungen:** BP-014.
- **Dateien:** `src/impressum.html`, `src/datenschutz.html`, `src/sitemap.xml`, `package.json`, `package-lock.json` (nur Name), `README.md`, `docs/cloudflare-pages-kontaktformular.md`, `scripts/*`, `docs/sdd/*`.
- **Abschlusskriterien:** `main.js`, `legal.js`, `index.html` und `404.html` im Build unverändert (Hash-Vergleich); `npm ci --dry-run` ok; `npm test` und `npm run test:browser` bestanden; Lighthouse-SEO 100.
- **Nachweis:** `[Messung]` Hash-Vergleich identisch; `npm test` 10 bestanden, 3 übersprungen (Secrets, pages.dev); `npm run test:browser` 5 von 5; Lighthouse SEO 100 auf allen Seiten, Performance 92 / 99 / 99.
- **REQ/DEC:** REQ-005, 063, 064 · DEC-023, DEC-024 · Spezifikation: `changes/CHG-001-aufraeumen-und-pruefskripte.md`
- **Status:** abgeschlossen

## BP-016 AGB-Seite (CHG-002)
- **Ziel:** Eigene AGB als Anbieterin plus Hinweis auf DVS-AGB für öffentliche Auftraggeber.
- **Scope:** Seite `/agb` im Rechtsseiten-Design, Footer-Link auf allen Seiten, Sitemap, Build-Eintrag und Dev-Rewrite, Prüfskripte. Nicht im Scope: Verweis in Offerten, juristische Prüfung.
- **Voraussetzungen:** BP-007.
- **Dateien:** `src/agb.html`, `src/index.html`, `src/impressum.html`, `src/datenschutz.html`, `src/404.html`, `src/sitemap.xml`, `webpack.config.js`, `scripts/*`, `docs/sdd/*`.
- **Abschlusskriterien:** `/agb` liefert 200 mit eigenem Title, Description und Canonical; Sitemap, Footer und 404-Links stimmen; `npm test` und `npm run test:browser` bestanden.
- **Nachweis:** `[Messung]` `npm test` 10 bestanden, 3 übersprungen; `npm run test:browser` 5 von 5.
- **REQ/DEC:** REQ-043 · DEC-025 · Spezifikation: `changes/CHG-002-agb.md`
- **Status:** abgeschlossen

## BP-017 Kapitel „Vorgehen“ (CHG-003)
- **Ziel:** Ablauf eines Auftrags in vier Schritten mit je einem Ergebnis zeigen, zwischen Leistungen und Preise.
- **Scope:** Sektion `#vorgehen`, Kapitelzähler `/006`, obere Navigation, Mobile-Menü, sechste Loader-Zeile, `ROW_STEP` 0.55, Klassen `.step-out`/`.step-foot`, Navigationstest. Nicht im Scope: JSON-LD, Meta-Texte, Kalkulator, Intro-Protokoll, AI-Karte.
- **Voraussetzungen:** BP-004, BP-005.
- **Dateien:** `src/index.html`, `src/main.css`, `src/intro.js`, `scripts/test-browser.mjs`, `docs/sdd/*`, `Todo.md`.
- **Abschlusskriterien:** Dock zeigt „04/06 Vorgehen“ bzw. „05/06 Preise“; Loader erreicht 06/06 vor dem Ausblenden; 1440/800/390 px ohne Überlauf, Trennlinien der Ergebnisse auf Desktop auf gleicher Höhe; `npm test` und `npm run test:browser` bestanden.
- **Nachweis:** `[Messung]` 25.10.2026: `npm test` 10 bestanden, 3 übersprungen; `npm run test:browser` 5 von 5; Loader „06 BEREIT“ nach ca. 4.2 s Intro-Zeit; Überlauf 0 px bei 1440/800/390. 26.10.2026: Geräte-Emulation (Touch, Pixeldichte 2–3) für iPhone SE/15/15 Pro Max und iPad mini, iPad, iPad Pro 11"/13" hoch und quer: Überlauf 0 px, nichts ragt aus den Karten, Ergebnislinien je Reihe auf gleicher Höhe (Pfeil hängt links, sonst brach er bei 1024 px allein um). Lighthouse nicht gemessen.
- **REQ/DEC:** REQ-011, REQ-013, REQ-020, REQ-026 · DEC-026 · Spezifikation: `changes/CHG-003-kapitel-vorgehen.md`
- **Status:** abgeschlossen (Aussagen zu bestätigen, OP-015)

---

## Vorlage für neue Arbeitspakete

```
## BP-0NN <Titel>
- Ziel:
- Scope / Nicht-Scope:
- Voraussetzungen:
- Dateien:
- Schritte:
- Abschlusskriterien:
- Nachweis:
- REQ/DEC:
- Status: geplant | in Arbeit | abgeschlossen | blockiert
```

Neue BP erhalten die nächste freie Nummer. Bestehende Pakete werden nicht umgeschrieben; Korrekturen entstehen als neues Paket mit Verweis.
