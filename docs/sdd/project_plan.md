# project_plan.md – ascnet.ch (Future-State)

Rückwärts erstellte Spezifikation (SDD-Modus **INIT**). Stand: 15.10.2026, Repository-Stand `0e6c95f`.

**Lesehilfe:** Diese Datei beschreibt das **Sollbild** des heute live laufenden Standes. Es wurde aus dem Ist-Zustand und aus den Aufträgen der Projektleitung abgeleitet, nicht umgekehrt. Aussagen tragen eine Herkunftsmarke:

| Marke | Bedeutung |
|---|---|
| `[Code]` | im Repository nachweisbar (Datei genannt) |
| `[Git]` | durch Commit nachweisbar |
| `[Doku]` | in `README.md` oder `docs/*.md` beschrieben |
| `[Auftrag]` | ausdrücklicher Wunsch oder Entscheid der Projektleitung im Projektverlauf (nur dort belegt, nicht in Dateien) |
| `[Messung]` | Messwert oder Prüfergebnis aus der Entwicklung |
| `[offen]` | nicht belegbar, wird nicht als Tatsache geführt |

Verwandte Dateien: `decisions.md` (DEC-…), `build_plan.md` (BP-…), `agents.md` (Arbeitsregeln), `templates/change.md`.

In den Anforderungstabellen bedeutet „–“ bei **DEC**: Es gibt keine eigene Entscheidung (reiner Bestandsinhalt oder Detail einer anderen Anforderung).

---

## 1. Zweck und Ziel

ascnet.ch ist die Firmenwebsite der **ASCNET Solutions GmbH**, Zug. Sie stellt die vier Leistungsfelder vor, zeigt einen unverbindlichen Preis-Kalkulator und nimmt Kontaktanfragen entgegen. `[Code]` `src/index.html`

Ziele:
1. Professionelle Darstellung der Kompetenz (Collaboration, Identity, Development, Business Intelligence). `[Auftrag]`
2. Auffindbarkeit über Suchmaschinen für B2B-Kunden. `[Auftrag]` (`seo-prompt.txt`, lokal)
3. Qualifizierte Kontaktanfragen über ein Formular, ohne Spam-Last. `[Auftrag]`

Zielgruppe: Unternehmenskunden, Interessenten und Projektpartner im deutschsprachigen Raum, vorrangig Schweiz. `[Auftrag]`

## 2. Scope und Nicht-Scope

**Im Scope (Ist):** eine Startseite mit fünf Kapiteln, Impressum, Datenschutzerklärung, 404-Seite, Kontaktformular mit serverseitigem Versand, Karte, SEO-Grundlagen, Besucherstatistik über Cloudflare.

**Nicht im Scope** (bewusst nicht vorhanden bzw. ausdrücklich ausgeschlossen):

| Punkt | Herkunft |
|---|---|
| Blog, Fachartikel, zusätzliche Leistungsseiten | `[Auftrag]` (SEO-Auftrag) |
| Google Analytics, Tracking-Events für Kalkulator und Formular, Tracking-Cookies | `[Auftrag]` |
| Mehrsprachigkeit (kein hreflang) | `[Doku]` `docs/SEO-IMPLEMENTATION.md` |
| Benutzerkonten, Datenbank, Zahlungen | `[Code]` (nicht vorhanden) |
| Rechtsberatung: Impressum und Datenschutzerklärung sind Entwürfe nach bestem Wissen und sollen vor Veröffentlichung fachkundig geprüft werden | `[Auftrag]` |

## 3. Anforderungen (Ist-Sollbild)

Jede Anforderung nennt Herkunft, die massgebende Entscheidung (DEC), das Arbeitspaket (BP) und das Abnahmekriterium.

### 3.1 Darstellung und Marke

| ID | Anforderung | Herkunft | DEC | BP | Abnahme |
|---|---|---|---|---|---|
| REQ-001 | Dunkles Erscheinungsbild: Hintergrund `#222222`, Akzent Gold `#FFC125`, Text `#F3F0E8`. Farben als CSS-Variablen `--bg`, `--accent`, `--fg`. | `[Auftrag]` `[Code]` `src/main.css` | DEC-005 | BP-005 | Seitenhintergrund und Akzente entsprechen den Werten, Karten/Felder in Grautönen abgeleitet |
| REQ-002 | Typografie: **Saira** (Versalien, kursive Akzentwörter in Gold) für Überschriften und Text, **JetBrains Mono** für Labels, Zähler, Klammer-Schreibweise `[ 03 ] ( … )`. | `[Auftrag]` `[Code]` `src/fonts.css` | DEC-005, DEC-017 | BP-005, BP-012 | Beide Schriften laden lokal (0 Anfragen an Google) |
| REQ-003 | Logo oben links: Original-Logo in einer **Dunkel-Variante** (heller Schriftzug, goldene Punkte). Beim Scrollen verkleinert es sich von 84 px auf 50 px Höhe. | `[Auftrag]` `[Code]` `src/img/Logo_smart_dark.png`, `src/main.css` `.brand-logo` | DEC-006 | BP-005 | Logo lesbar auf `#222222`, auf Desktop und Handy geprüft |
| REQ-004 | Abstände zwischen den Kapiteln eng gehalten (Abstand Inhalt → nächste Kapitelkopfzeile ca. 90 px Desktop, 84 px Handy). | `[Auftrag]` `[Messung]` | – | BP-005 | `.section { padding: clamp(2rem, 5vh, 4rem) 0 }` |
| REQ-005 | Footer: „©2026 ASCNET Solutions GmbH“, Links „Impressum // Datenschutz“, Vermerk „Designed by Opus 5.5“. | `[Auftrag]` `[Code]` `src/index.html` | DEC-005 | BP-005 | Text im Footer; gilt auch für Impressum und Datenschutz (OP-007 erledigt) |

### 3.2 Hintergrund, Intro, Navigation

| ID | Anforderung | Herkunft | DEC | BP | Abnahme |
|---|---|---|---|---|---|
| REQ-010 | Animierter Hintergrund **„Future-State“**: Glasfaser-Bündel von oben links, Wolke leuchtender Spitzen rechts der Mitte. Stränge und Lichtperlen **hellblau**; grosse unscharfe Bokeh-Scheiben und feiner Staub im Hintergrund golden bzw. neutral. Echtzeit-Berechnung per WebGL, keine Videodatei. | `[Auftrag]` `[Code]` `src/fibers.js` | DEC-002, DEC-003 | BP-002 | 220 Fasern à 400 Stützpunkte (Handy 120 à 260), 40 Bokeh, 800 Staub; reagiert auf Scroll, Zeiger, Kapitelwechsel |
| REQ-011 | **Intro** von ca. 5 Sekunden: Fasern wachsen, Protokoll „verbunden“ für die vier Kompetenzfelder, Wortmarke „(ASCNET_)“, Prozentzähler bis 100 %, **Kapitel-Loader** (Ring mit fünf Segmenten, fünf Zeilen mit Blockbalken, Status WARTE/LÄDT/OK, Abschluss BEREIT). Prozentwerte ohne führende Nullen (dreistellig erst ab 100 %). | `[Auftrag]` `[Code]` `src/intro.js` | DEC-004 | BP-003 | Seite nach 5300 ms frei (`DONE_AT`), Ausblendbeginn 4600 ms; gemessen: Seite nach ca. 5 s bedienbar |
| REQ-012 | Intro läuft **einmal pro Browser-Sitzung** (`sessionStorage` `ascnet-fs-intro-seen`), ist überspringbar (Button, Klick, Enter, Leertaste, Escape), entfällt bei „reduzierter Bewegung“. `?intro` in der Adresse erzwingt es. Kein sichtbarer Link dafür im Footer. | `[Auftrag]` `[Code]` | DEC-004 | BP-003 | Mit gesetztem Schlüssel kein Intro; mit `?intro` Intro läuft, Parameter wird aus der Adresse entfernt |
| REQ-013 | **Navigation unten (Dock)**: Kapitelnummer, Kapitelname, Timeline mit Kapitelmarkern und ziehbarem Abspielkopf, Schalter „Motion“, Fortschritt in %. Oben Kapitel-Links (Desktop) bzw. Menü-Overlay (Handy). Pfeiltasten links/rechts springen zum vorherigen/nächsten Kapitel. Beim Sprung blendet der Inhalt kurz aus und ein Lichtimpuls läuft durch die Fasern. | `[Auftrag]` `[Code]` `src/chapters.js` | DEC-007 | BP-004 | Sprung zu „Preise“ landet bei `y` des Kapitels, Anzeige „04/05 Preise“; ArrowRight → „Kontakt“ |
| REQ-014 | Schalter **„Motion“** hält die Hintergrund-Animation an (`localStorage` `ascnet-motion`). `prefers-reduced-motion` schaltet Intro, Sprung-Blenden und Animationen ab; die Szene wird dann als Standbild gezeigt. | `[Code]` | DEC-004 | BP-002, BP-004 | Mit reduzierter Bewegung kein Intro, Inhalte sofort sichtbar |

### 3.3 Inhalt

| ID | Anforderung | Herkunft | DEC | BP | Abnahme |
|---|---|---|---|---|---|
| REQ-020 | Fünf Kapitel mit festen Ankern: `#hero` (Start), `#mehrwert`, `#leistungen`, `#preise`, `#kontakt`, je mit `data-scene` und `data-scene-title`. | `[Code]` `src/index.html` | DEC-007 | BP-001, BP-004 | Alle fünf Sektionen vorhanden, Marker in der Timeline |
| REQ-021 | Hero: Slogan „Innovation verbindet // Wissen bewegt“ als einzige H1, Kurztext, Button „Kontakt aufnehmen“, Kurzprofil „20+ Jahre“. | `[Code]` `[Auftrag]` | DEC-015 | BP-005 | Eine H1 pro Seite |
| REQ-022 | Mehrwert: „Ihr Nutzen ist unser massstab“ mit Kernaussage 20+ Jahre, Orientierung, Klarheit, Entscheidungsstärke. | `[Code]` | – | BP-001, BP-005 | Text vorhanden |
| REQ-023 | Vier Leistungskarten: **Collaboration-Management**, **Identity-Management**, **Development**, **Business Intelligence**. Der Kartentext nennt die belegten Technologien (Exchange On-Prem/Hybrid, Teams; Active Directory, Entra ID, ADFS, MFA, SSO; .NET (C#), JavaScript, React, PowerShell; MS SQL Server, Data Warehouse, SSIS/SSAS, Power BI). | `[Auftrag]` (Satzteil-Ergänzung) `[Code]` | DEC-016 | BP-001, BP-011 | Begriffe stehen im statischen HTML und sind in `skills.json` belegt |
| REQ-024 | **Skills-Fenster** je Leistung („( Details )“): Liste aus `skills.json` (Collaboration 8, Identity 8, Development 6, BI 6 Einträge) mit Level 1–5 und Legende. Öffnet per Button, schliesst per ✕, Hintergrund-Klick und Escape, stellt den Fokus wieder her. | `[Code]` `src/skills.js`, `src/skills.json` | DEC-016 | BP-001 | Fenster öffnet für alle vier Bereiche |
| REQ-025 | Firmenangaben: ASCNET Solutions GmbH, **c/o Sarya AG, Chamerstrasse 174, 6300 Zug**. | `[Auftrag]` `[Code]` | DEC-021 | BP-006 | Adresse im Kontaktbereich, im JSON-LD und im Impressum identisch |

### 3.4 Funktionen

| ID | Anforderung | Herkunft | DEC | BP | Abnahme |
|---|---|---|---|---|---|
| REQ-030 | **Preis-Kalkulator** (reine Browser-Logik, `src/main.js`): Stundensätze CHF 160 (Collaboration), 170 (Development), 185 (BI), 200 (IAM); Eingabe in Stunden (Regler bis 504) oder Tagen (bis 63; 7,5/8/8,5 Std/Tag, Standard 8); Onsite-Anteil 0–100 %; **Onsite-Zuschlag** auf den Onsite-Anteil nach PLZ-Prefix (2 Ziffern) aus `src/plz.json` (79 Prefixe, 0–30 %; unbekannter oder fehlender Prefix → 25 %; Standard-PLZ „4000“ → 0 %). Ausgabe: Summe je Bereich, Gesamt ohne/mit Zuschlag, alle Preise CHF exkl. MWST. | `[Code]` (Vorbestand) | DEC-008 | BP-001 | Referenzfall: 63 Tage Collaboration + 60 Tage BI, 8 Std/Tag, 30 % Onsite, PLZ 8000 → ohne Zuschlag CHF 169'440, Zuschlag CHF 12'708, **gesamt CHF 182'148** `[Messung]` |
| REQ-031 | Karte im Kontaktbereich (Mapbox, dunkler Stil, goldene Markierung, Popup „ASCNET Solutions GmbH“ bei 8.485225 / 47.181411). Mapbox wird erst geladen, wenn die Karte bis auf eine Bildschirmhöhe heranrückt. Token kommt beim Build aus `MAPBOX_TOKEN`. | `[Auftrag]` `[Code]` `src/mapbox.js` | DEC-011, DEC-013 | BP-006, BP-009, BP-012 | 0 Mapbox-Anfragen beim Seitenaufruf, Karte nach Scroll vollständig `[Messung]` |
| REQ-032 | **Kontaktformular**: Name (≤100), E-Mail (≤150), Nachricht (≤512), Honeypot-Feld, Cloudflare Turnstile. Versand per `POST /api/contact` an eine Pages Function, die Eingaben prüft, Turnstile bei Cloudflare verifiziert und über die EmailJS-REST-API mit Private Key versendet. Rückmeldung per Toast. Antworten der Function: 200 ok, 400 `invalid`, 403 `turnstile`, 405 `method`, 500 `config`, 502 `send`. | `[Auftrag]` `[Code]` `src/contact.js`, `functions/api/contact.js` | DEC-009, DEC-010 | BP-008 | Testmail über ascnet.ch kommt an (Auftraggeber bestätigt); Statuscodes lokal mit Platzhalterwerten geprüft `[Messung]` |
| REQ-033 | Formular am Layout ausgerichtet: Formular endet unten auf derselben Linie wie die Karte (Desktop). | `[Auftrag]` `[Code]` | – | BP-008 | Visuell geprüft |

### 3.5 Rechtliches

| ID | Anforderung | Herkunft | DEC | BP | Abnahme |
|---|---|---|---|---|---|
| REQ-040 | **Impressum** (`/impressum`): Anschrift, E-Mail info@ascnet.ch, Rechtsform GmbH, Sitz Zug, Handelsregisteramt Kanton Zug, Firmennummer CH-170.4.011.922-0, UID CHE-180.731.045, MWST-Nummer CHE-180.731.045 MWST, Haftung, Preis-Kalkulator-Hinweis, Links, Urheberrecht, Marken. Datenquelle: UID-Register und Zefix. | `[Auftrag]` `[Code]` | DEC-014, DEC-021 | BP-007 | Angaben stimmen mit UID-Register überein |
| REQ-041 | **Datenschutzerklärung** (`/datenschutz`) nach Schweizer DSG: Verantwortliche Stelle, Hosting/Server-Logdaten/Cloudflare Web Analytics, Kontaktformular (EmailJS, Microsoft, Turnstile), Karte Mapbox, Schriften (lokal), Browser-Speicher (kein Cookie), Ausland, Aufbewahrung, Rechte, Änderungen. Muss bei jedem Hinzufügen oder Entfernen eines Drittdienstes nachgeführt werden. | `[Auftrag]` `[Code]` | DEC-014 | BP-007, BP-012, BP-013 | Beschriebene Dienste entsprechen den tatsächlich geladenen (siehe 6.2) |
| REQ-042 | Fehlerseite `404.html` (noindex), liefert echten Status 404 für unbekannte Adressen. | `[Code]` | DEC-018 | BP-011 | `/gibtsnicht` → 404 `[Messung]` |

### 3.6 Suchmaschinen (SEO)

| ID | Anforderung | Herkunft | DEC | BP | Abnahme |
|---|---|---|---|---|---|
| REQ-050 | Je indexierbare Seite eigener **Title** und **Meta-Description**, `lang="de-CH"`, `meta robots`, **Canonical** auf `https://ascnet.ch/…` (ohne `www`, ohne `.html`). Titles und Wortlaut siehe `docs/SEO-IMPLEMENTATION.md`. | `[Auftrag]` `[Code]` | DEC-018 | BP-011 | Prüfskript: eindeutig, Title ≤ 56 Zeichen, Description 145–160, Canonical korrekt `[Messung]` |
| REQ-051 | Open Graph und Twitter Card auf allen Inhaltsseiten; Bild: bestehendes Logo (`Logo_smart_dark_xl.png`, 1644×654). Favicon (ICO, 32 px, Apple-Touch) aus dem Logo abgeleitet. | `[Auftrag]` `[Code]` | DEC-018 | BP-011 | Tags vorhanden |
| REQ-052 | `robots.txt` (Allow `/`, Disallow `/api/`, Sitemap-Verweis), `sitemap.xml` mit drei kanonischen URLs, `_headers` mit `X-Robots-Tag: noindex` für `*.pages.dev`. | `[Code]` | DEC-018 | BP-011 | Live: `text/plain`, `application/xml`, noindex auf pages.dev `[Messung]` |
| REQ-053 | JSON-LD (ein Block, `@graph`): Organization (mit UID, MWST, Logo), WebSite, vier Services, Namen identisch zu den Karten. Keine erfundenen Profile, Bewertungen oder FAQ. | `[Auftrag]` `[Code]` | DEC-018 | BP-011 | `JSON.parse` gültig, genau ein Block `[Messung]` |
| REQ-054 | Google Search Console: Domain-Property `ascnet.ch`, Sitemap eingereicht. Das Einrichten erfolgt manuell durch die Projektleitung. | `[Auftrag]` | DEC-020 | BP-013 | Auftraggeber bestätigt: Sitemap eingerichtet |

### 3.7 Betrieb, Qualität

| ID | Anforderung | Herkunft | DEC | BP | Abnahme |
|---|---|---|---|---|---|
| REQ-060 | Auslieferung über **Cloudflare Pages** mit Git-Anbindung an GitHub (`main`); Build `npm run build`, Ausgabe `dist`; Function `/api/contact`; Domain ascnet.ch (www → ascnet.ch per 301). | `[Auftrag]` `[Doku]` | DEC-009, DEC-012, DEC-022 | BP-010 | Live-Prüfung der Statuscodes `[Messung]` |
| REQ-061 | Keine Geheimnisse im Repository: Secrets nur im Pages-Projekt, lokale Werte in `.env` / `.dev.vars` (nicht im Git). Mapbox-Token und Turnstile Site Key als Build-Variablen. | `[Auftrag]` `[Code]` | DEC-009, DEC-013 | BP-009, BP-010 | `git grep` findet keinen Token; GitHub-Push ohne Secret-Scanning-Treffer `[Git]` |
| REQ-062 | Besucherstatistik: **Cloudflare Web Analytics** über das Pages-Dashboard, kein Skript im Repository, kein Google Analytics. | `[Auftrag]` | DEC-019 | BP-013 | Live-HTML enthält genau einen Beacon `[Messung]` |
| REQ-063 | Qualitätsstand (Ist, **keine Zusage**): Lighthouse mobil, lokal: SEO 100 auf allen drei Seiten; Performance Startseite 83, Impressum/Datenschutz 99; Barrierefreiheit 93–96; Best Practices 96. Handyansicht (390 px) ohne horizontalen Überlauf. | `[Messung]` | DEC-017 | BP-011, BP-012 | siehe `docs/SEO-IMPLEMENTATION.md` §7 |
| REQ-064 | Schweizer Standardsprache: „ss“ statt „ß“, korrekte Umlaute, `de-CH`. | `[Auftrag]` | DEC-018 | BP-011 | Keine „ß“ in `src/` |

## 4. Architektur (Ist)

### 4.1 Überblick

Statisches Frontend, bei der Build-Zeit mit Webpack erzeugt, plus **eine** serverseitige Pages Function. Keine Datenbank, keine Server-Sessions. `[Code]`

```
Browser ── GET / ───────────▶ Cloudflare Pages (statische Dateien aus dist/)
   │
   ├─ Kalkulator, Intro, Navigation, WebGL: nur im Browser
   ├─ Karte: lädt Mapbox bei Bedarf (api.mapbox.com)
   └─ Formular ── POST /api/contact ──▶ Pages Function (functions/api/contact.js)
                                           ├─ Turnstile-Prüfung (challenges.cloudflare.com)
                                           └─ EmailJS-REST (api.emailjs.com) ──▶ Outlook-Postfach
```

### 4.2 Komponentenkarte (Datei → Verantwortung)

Alle Dateien aus `git ls-files` (Stand `0e6c95f`):

| Datei | Verantwortung |
|---|---|
| `src/index.html` | Startseite: Head (SEO, OG, JSON-LD), Intro-Markup, Header, Dock, fünf Kapitel, Footer, Skills-Modal, Toast-Container, Skript-Einbindung |
| `src/impressum.html`, `src/datenschutz.html` | Rechtsseiten (Einstieg `legal.js`) |
| `src/404.html` | Fehlerseite (Einstieg `legal.js`, noindex) |
| `src/main.js` | Einstieg der Startseite: Kalkulator, Scroll-Reveal, Tilt-Karten, Init von Fasern, Kapitel, Kontaktformular |
| `src/legal.js` | Einstieg der Rechtsseiten (nur `main.css`) |
| `src/fibers.js` | WebGL-Hintergrund (Vertex-/Fragment-Shader, Punktpuffer, Animationsschleife); API `scatter`, `form`, `kick`, `setScroll`, `setMotion` |
| `src/intro.js` | Intro-Ablauf, Kapitel-Loader (`createLoader`), Session-Logik |
| `src/chapters.js` | Dock, Kapitel, Sprünge, Menü, Scrubbing, Motion-Schalter |
| `src/contact.js` | Formular-Client: Toast, Blocker, Turnstile, `fetch('/api/contact')` |
| `functions/api/contact.js` | Pages Function (Eingabeprüfung, Turnstile, EmailJS) |
| `src/mapbox.js` | Lazy-Laden und Initialisierung der Karte (statische Datei, nicht gebündelt) |
| `src/skills.js`, `src/skills.json` | Skills-Fenster (statische Datei, `fetch('skills.json')`) |
| `src/plz.json` | Onsite-Zuschlag je PLZ-Prefix (in `main.js` importiert) |
| `src/main.css` | Alle Styles (Tailwind 4 + Layer `components`), Design-Variablen |
| `src/fonts.css`, `src/fonts/*` | lokale Schriften und Lizenzen |
| `src/img/*` | Logo (Original, Dunkel, Dunkel-xl), Favicons |
| `src/favicon.ico`, `src/robots.txt`, `src/sitemap.xml`, `src/_headers` | SEO- und Hosting-Dateien (statisch) |
| `webpack.config.js` | Build: zwei Einstiege (`main`, `legal`), HTML-Seiten, statische Dateien (`STATIC_FILES`), Build-Variablen, Dev-Server (Proxy `/api`, Clean URLs), `.env`-Leser |
| `package.json`, `package-lock.json` | Skripte, Abhängigkeiten (Webpack 5, Tailwind 4, PostCSS, Wrangler 4.142.0) |
| `postcss.config.js` | PostCSS-Konfiguration für Tailwind 4 |
| `scripts/test-http.mjs`, `scripts/test-browser.mjs`, `scripts/lighthouse.mjs` | Prüfskripte (DEC-024) |
| `.env.example`, `.dev.vars.example`, `.gitignore` | Vorlagen für lokale Werte, Ausschlüsse |
| `docs/*.md`, `README.md` | Betriebs- und SEO-Doku |
| `docs/logo/ascnet_xxl_2025.svg` | Logo-Original als SVG, nicht im Build (siehe OP-004) |

### 4.3 Datenflüsse

1. **Seitenaufruf:** Cloudflare liefert `index.html`; `main.js` (defer) startet. Intro, Fasern, Navigation, Kalkulator laufen im Browser. Skripte `mapbox.js`, `skills.js` und Turnstile werden separat geladen. Der Analytics-Beacon wird von Cloudflare eingefügt.
2. **Kalkulator:** Regler/Eingaben → `calc()` → Textausgabe. Kein Netzwerk.
3. **Skills-Fenster:** Klick → `skills.json` (einmal geladen) → Liste.
4. **Karte:** `IntersectionObserver` (Rand 100 %) → Mapbox-CSS/JS laden → Karte initialisieren.
5. **Kontaktformular:** Browser prüft Pflichtfelder (`reportValidity`), sendet `FormData` (inkl. Turnstile-Token, Honeypot) → Function: Honeypot → Validierung → Turnstile → EmailJS → JSON-Antwort → Toast; nach jedem Versuch Turnstile-Reset.

### 4.4 Technologien

Webpack 5, Tailwind CSS 4 (`@tailwindcss/postcss`), Vanilla JavaScript (ES-Module), WebGL 1, Cloudflare Pages und Pages Functions, Wrangler 4.142.0, Node 22 beim Build. `[Code]` `package.json`, `[Doku]` Build-Log

## 5. Betrieb

### 5.1 Build und Auslieferung
- Lokal: `npm run dev` (Port 8080), `npm run dev:api` (Function lokal, Port 8788), `npm run build` (Produktion, minifiziert).
- Cloudflare Pages: Git-Anbindung an `github-ascnet/ascnet-webside-2026-motion-graphics`, Branch `main`, Build `npm run build`, Ausgabe `dist`. Jeder Push löst ein Production-Deployment aus. `[Doku]` `docs/cloudflare-pages-kontaktformular.md`
- Domain: `ascnet.ch` im Pages-Projekt `ascnet-webside-2026-motion-graphics`; das frühere Projekt `ascnet-web-2025` ist nicht gelöscht (OP-005). `[Auftrag]`

### 5.2 Variablen und Secrets

| Name | Typ | Verwendung | Wirkung bei Fehlen |
|---|---|---|---|
| `MAPBOX_TOKEN` | Text (Build) | Token der Karte, per `data-mapbox-token` ins HTML | Keine Karte |
| `TURNSTILE_SITE_KEY` | Text (Build) | öffentlicher Turnstile-Schlüssel im Formular | Test-Key; live lehnt die Function mit 403 ab |
| `NODE_VERSION` | Text (Build) | Node-Version bei Cloudflare | Standardversion (Build lief mit 22.22.0) |
| `EMAILJS_PUBLIC_KEY` | Secret | EmailJS-Aufruf | Function antwortet 500 `config` |
| `EMAILJS_PRIVATE_KEY` | Secret | EmailJS-Aufruf (`accessToken`) | 500 `config` |
| `EMAILJS_SERVICE_ID` | Secret | EmailJS (Outlook-Dienst) | 500 `config` |
| `EMAILJS_TEMPLATE_ID` | Secret | EmailJS-Vorlage | 500 `config` |
| `TURNSTILE_SECRET_KEY` | Secret | Turnstile-Prüfung | 500 `config` |

Lokal: `.env` (Build-Werte, wird von `webpack.config.js` gelesen) und `.dev.vars` (Secrets für `wrangler pages dev`). Beide nicht im Git. `[Code]`

### 5.3 Externe Dienste

| Dienst | Zweck | Wann geladen |
|---|---|---|
| Cloudflare Pages / Functions / Turnstile / Web Analytics | Hosting, Bot-Schutz, Statistik | jede Seite bzw. Formular |
| EmailJS, Microsoft (Outlook) | Mailversand serverseitig | beim Absenden |
| Mapbox | Karte | erst beim Heranscrollen |
| GitHub | Quellcode, Auslöser für Deployments | Entwicklung |

Kein Google-Dienst im Seitenaufruf (Schriften lokal). `[Code]` `[Messung]`

## 6. Qualitätsstand (gemessen, keine Zusage)

Lighthouse 13.5, Mobile-Profil, simulierte Drosselung CPU ×4, lokal gegen `wrangler pages dev` (Software-Grafik, eher pessimistisch): `[Messung]`

| Seite | SEO | Performance | Best Practices | Accessibility | LCP |
|---|---|---|---|---|---|
| Start | 100 | 83 | 96 | 96 | 3,1 s |
| Impressum | 100 | 99 | 96 | 95 | 2,0 s |
| Datenschutz | 100 | 99 | 96 | 95 | 2,0 s |

Echte Besucherwerte (Core Web Vitals) liefert Cloudflare Web Analytics; bislang `[offen]`.

## 7. Offene Punkte und bekannte Inkonsistenzen

Diese Punkte wurden beim INIT festgestellt und **nicht** stillschweigend korrigiert. Jeder Punkt ist ein Kandidat für ein CHANGE.

| ID | Befund | Art | Beleg |
|---|---|---|---|
| OP-001 | ~~`README.md` veraltet, `package.json` mit altem Namen~~ **erledigt** (CHG-001): README neu, Name `ascnet-webside-2026-motion-graphics`, Beschreibung gesetzt. | erledigt | `[Code]` |
| OP-002 | ~~`wrangler.jsonc` in Workers-Syntax~~ **erledigt** (CHG-001, DEC-023): Datei entfernt. | erledigt | `[Code]` `[Doku]` |
| OP-003 | ~~`.github/copilot-instructions.md` veraltet~~ **erledigt** (CHG-001): Datei entfernt. | erledigt | `[Code]` |
| OP-004 | ~~Ungenutztes SVG im Build, veraltete `tailwind.config.js`~~ **erledigt** (CHG-001): SVG nach `docs/logo/` verschoben (nicht mehr im Build), `tailwind.config.js` entfernt. | erledigt | `[Code]` |
| OP-005 | Altes Pages-Projekt `ascnet-web-2025` besteht noch; Löschung nach stabilem Betrieb vorgesehen, nicht bestätigt. | offene Aufgabe | `[Auftrag]` |
| OP-006 | Ausserhalb des Repos nicht bestätigt: EmailJS „Use Private Key“ aktiv; EmailJS-Vorlage nutzt `{{name}}` statt `{{fullName}}`; Mapbox-Token auf ascnet.ch beschränkt; Turnstile-Hostnames (`ascnet.ch`, `www.ascnet.ch`) eingetragen; Rate-Limiting-Regel für `/api/contact` (optional). | fehlende Information | `[Doku]` |
| OP-007 | ~~Copyright-Jahr uneinheitlich~~ **erledigt** (CHG-001): alle Seiten „©2026“. | erledigt | `[Code]` |
| OP-008 | Bezeichner stammen aus früheren Entwurfsständen: in `chapters.js` Parametername `waveCtrl`, Kommentar „Welle“; Fasern-API `scatter`/`form` (aus der Wellen-Phase). Funktional unkritisch. | dokumentarisch | `[Code]` |
| OP-009 | ~~Keine automatisierten Tests~~ **erledigt** (CHG-001, DEC-024): `scripts/` mit `npm test`, `npm run test:browser`, `npm run lighthouse`. Die Tests prüfen nur den Ist-Stand. | erledigt | `[Code]` |
| OP-010 | Web Analytics und Search Console sind laut Projektleitung eingerichtet; der Beacon ist live nachgewiesen, die Indexierung der drei Seiten wurde nicht geprüft. | fehlende Information | `[Messung]` |
| OP-011 | `sitemap.xml`: `lastmod` ist von Hand gepflegt (alle drei Seiten 2026-10-15). | Pflegeaufwand | `[Code]` |
| OP-012 | Lokale Sicherungen früherer Entwurfsstände (`_backup_*`) liegen ausserhalb des Gits und sind absichtlich nicht dokumentiert. | Hinweis | `[Auftrag]` |
| OP-013 | `seo-prompt.txt` (Auftrag der SEO-Phase) liegt nur lokal und ist nicht im Git. | Hinweis | `[Code]` `.gitignore` |
