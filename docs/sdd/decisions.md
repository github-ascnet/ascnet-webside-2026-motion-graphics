# decisions.md – verbindliche Entscheidungen

Rückwärts erfasst (SDD-Modus **INIT**), Stand 15.10.2026. Jeder Eintrag beschreibt eine Entscheidung, die im heutigen Stand wirksam ist. Herkunftsmarken wie in `project_plan.md`: `[Code]` `[Git]` `[Doku]` `[Auftrag]` `[Messung]`.

**Regeln für diese Datei**
- Bestehende Entscheidungen werden **nie stillschweigend** geändert oder gelöscht. Eine Änderung erzeugt einen neuen Eintrag; der alte erhält Status `ersetzt` mit Verweis (`ersetzt durch DEC-…`).
- Status: `gültig`, `ersetzt`, `offen` (noch nicht entschieden).
- Datum = Zeitpunkt der Auslieferung bzw. ausdrücklichen Zustimmung; ist es nicht belegt, steht „Vorbestand“ oder die Commit-Spanne (alle vier Commits vom 12.–15.10.2026).
- Zuordnung zu Anforderungen: Spalte „Betrifft“.

Übersicht

| ID | Titel | Status | Betrifft |
|---|---|---|---|
| DEC-001 | Technologie-Stack ohne Framework | gültig | alle |
| DEC-002 | Hintergrund in Echtzeit statt als Video | gültig | REQ-010 |
| DEC-003 | Motiv „Future-State“ (Glasfasern) mit hellblauen Fasern | gültig | REQ-010 |
| DEC-004 | Intro- und Bewegungsregeln | gültig | REQ-011/012/014 |
| DEC-005 | Dunkles Erscheinungsbild und Typografie | gültig | REQ-001/002/005 |
| DEC-006 | Logo nur als Dunkel-Variante aus dem PNG | gültig | REQ-003 |
| DEC-007 | Dock-Navigation und Kapitelsprünge | gültig | REQ-013/020 |
| DEC-008 | Preis-Kalkulator: Logik unverändert | gültig | REQ-030 |
| DEC-009 | Mailversand serverseitig über Pages Function | gültig | REQ-032/060/061 |
| DEC-010 | Missbrauchsschutz des Formulars | gültig | REQ-032 |
| DEC-011 | Karte mit Mapbox, bei Bedarf geladen | gültig | REQ-031 |
| DEC-012 | Hosting auf Cloudflare Pages mit Git-Anbindung | gültig | REQ-060 |
| DEC-013 | Öffentliche Schlüssel als Build-Variablen | gültig | REQ-031/061 |
| DEC-014 | Rechtsseiten als schlanker Einstieg, Quelle UID-Register | gültig | REQ-040/041 |
| DEC-015 | H1 der Startseite bleibt der Slogan | gültig | REQ-021 |
| DEC-016 | Kartentexte nur mit belegten Fachbegriffen | gültig | REQ-023/024 |
| DEC-017 | Schriften lokal, Produktions-Build | gültig | REQ-002/063 |
| DEC-018 | SEO-Grundsätze | gültig | REQ-042/050–053/064 |
| DEC-019 | Besucherstatistik über Cloudflare, ohne Code | gültig | REQ-062 |
| DEC-020 | Search Console als Domain-Property | gültig | REQ-054 |
| DEC-021 | Firmenangaben: Quelle und Einheitlichkeit | gültig | REQ-025/040 |
| DEC-022 | Build erzeugt `dist/` vollständig | gültig | REQ-060 |
| DEC-023 | `wrangler.jsonc`: Umgang offen | **offen** | OP-002 |
| DEC-024 | Messskripte ins Repository aufnehmen? | **offen** | OP-009 |

---

## DEC-001 Technologie-Stack ohne Framework
- **Status:** gültig · **Datum:** Vorbestand, fortgeführt 12.–15.10.2026
- **Kontext:** Die Seite war bereits mit Webpack, Tailwind und Vanilla JavaScript gebaut. `[Code]` `[Doku]` `README.md`
- **Entscheid:** Kein UI-Framework (kein React/Vue), keine 3D-Bibliothek. Webpack 5 für den Build, Tailwind CSS 4 über PostCSS, Vanilla JavaScript (ES-Module), WebGL ohne Bibliothek.
- **Begründung:** Minimaler Umfang (`main.js` 104 KB produktiv), keine Abhängigkeiten, die gepflegt werden müssen. `[Messung]`
- **Konsequenzen:** Neue Funktionen werden in Vanilla JS umgesetzt; neue Pakete nur mit eigener Decision.

## DEC-002 Hintergrund in Echtzeit statt als Video
- **Status:** gültig · **Datum:** 12.10.2026 (`d5e6acc`)
- **Kontext:** Es wurden mehrere Hintergrundmotive geprüft; Vorlagen gab es als Video (lizenzpflichtig). `[Auftrag]`
- **Entscheid:** Hintergrund wird zur Laufzeit per WebGL berechnet (`src/fibers.js`), nicht als Videodatei.
- **Begründung:** Keine Lizenz, keine Videodatei (Ladezeit), unendlich laufend, steuerbar durch Scroll, Zeiger und Kapitelwechsel.
- **Konsequenzen:** Ohne WebGL erscheint ein ruhiger Verlauf (`.no-webgl`); Rechenaufwand auf schwacher Hardware (gemessen 22–25 Bilder/s mit Software-Grafik). `[Messung]`

## DEC-003 Motiv „Future-State“ (Glasfasern) mit hellblauen Fasern
- **Status:** gültig · **Datum:** 12.10.2026
- **Kontext:** Aus mehreren Mustern wurde „Future-State“ gewählt (Glasfasern passend zu „Innovation verbindet“). `[Auftrag]`
- **Entscheid:** Fasern von oben links, Spitzen-Wolke rechts der Mitte; **Stränge und Lichtperlen hellblau** (`vec3(0.3,0.64,1.0)` bis `(0.72,0.9,1.0)`), Bokeh-Scheiben im Hintergrund golden.
- **Begründung:** Wunsch der Projektleitung nach hellblauen Fasern auf dem grauen Grund, Gold bleibt Akzentfarbe der Oberfläche. `[Auftrag]`
- **Konsequenzen:** Farbänderungen der Fasern erfolgen in den Shadern von `fibers.js`, nicht in CSS.

## DEC-004 Intro- und Bewegungsregeln
- **Status:** gültig · **Datum:** 12.10.2026
- **Entscheid:**
  1. Intro ca. 5 s (`GROW_MS` 3900, `LEAVE_AT` 4600, `DONE_AT` 5300 ms), danach Hero-Aufbau.
  2. Einmal pro Sitzung (`sessionStorage` `ascnet-fs-intro-seen`); `?intro` erzwingt es; kein sichtbarer Link dafür.
  3. Überspringbar, entfällt bei `prefers-reduced-motion`.
  4. Prozentzähler ohne führende Nullen.
  5. Kapitel-Loader als scheinbarer Ladevorgang der fünf Kapitel (rein optisch, kein echtes Laden).
  6. „Motion“-Schalter speichert die Wahl in `localStorage` `ascnet-motion`.
- **Begründung:** Wünsche der Projektleitung (5 s, Loader, keine führenden Nullen, Link entfernen); Barrierefreiheit durch Skip und reduzierte Bewegung. `[Auftrag]`
- **Konsequenzen:** Intro erscheint beim Testen nur einmal pro Tab, deshalb `?intro`.

## DEC-005 Dunkles Erscheinungsbild und Typografie
- **Status:** gültig · **Datum:** 12.–15.10.2026
- **Entscheid:** Hintergrund `#222222`, Akzent Gold `#FFC125` (Hell-Gold `#FFE08A`), Text `#F3F0E8`. Schriften Saira und JetBrains Mono. Überschriften in Versalien mit kursivem Akzentwort; Labels im Stil `[ 03 ] ( Leistungen )`. Alle Farben als CSS-Variablen; Blautöne des früheren Entwurfs wurden durch Gold bzw. Grautöne ersetzt.
- **Begründung:** Die Farbwelt entspricht der Original-Variante der Firma; ein heller Entwurf („Cast and Render“) passte nicht. `[Auftrag]` Der Hintergrund wurde von `#303030` auf `#222222` abgedunkelt. `[Auftrag]`
- **Konsequenzen:** Neue Flächen nutzen die Variablen aus `src/main.css`; ein Wechsel der Farben bedeutet ein CHANGE (REQ-001).

## DEC-006 Logo nur als Dunkel-Variante aus dem PNG
- **Status:** gültig · **Datum:** 12.–15.10.2026
- **Kontext:** Das Original-PNG ist für hellen Grund gemacht (dunkelgrauer Schriftzug, halbtransparente goldene Punkte). Das vorhandene SVG nutzt die nicht eingebettete Schrift „Nulshock“. `[Code]`
- **Entscheid:** Aus dem Original-PNG wurde eine Dunkel-Variante abgeleitet (Schriftzug hell, Schatten dunkel, Punkte voll deckend). Form und Aufbau bleiben. Das SVG wird nicht verwendet.
- **Konsequenzen:** Änderungen am Logo erfolgen am PNG (`Logo_smart_dark*.png`); das Original `Logo_smart_xl.png` bleibt unverändert. Favicons sind ein Ausschnitt („A“) davon.

## DEC-007 Dock-Navigation und Kapitelsprünge
- **Status:** gültig · **Datum:** 12.10.2026
- **Entscheid:** Navigation als Dock am unteren Rand (Kapitel, Timeline mit Marker und Abspielkopf, Motion-Schalter, Fortschritt). Obere Leiste mit Kapitellinks. Kapitelsprung blendet den Inhalt kurz aus und löst einen Lichtimpuls in `fibers.js` aus. Pfeiltasten springen zwischen Kapiteln.
- **Begründung:** Die untere Navigation des früheren „Film-Konzept“-Entwurfs wurde von der Projektleitung ausdrücklich gewünscht und in alle späteren Entwürfe übernommen. `[Auftrag]`
- **Konsequenzen:** Kapitel werden über `data-scene` und `data-scene-title` am Element definiert; ein neues Kapitel braucht diese Attribute und einen Eintrag in der oberen Navigation.

## DEC-008 Preis-Kalkulator: Logik unverändert
- **Status:** gültig · **Datum:** Vorbestand
- **Entscheid:** Rechenlogik, Stundensätze und PLZ-Tabelle bleiben wie im Bestand; bei allen Entwürfen wurde nur die Darstellung angepasst. Ergebnisse müssen identisch bleiben (Referenzfall CHF 182'148).
- **Begründung:** Geschäftslogik, nicht Teil des Design-Auftrags. `[Auftrag]` `[Messung]`
- **Konsequenzen:** Änderungen an Sätzen oder Zuschlägen sind fachliche Änderungen (CHANGE), nicht Teil von Design- oder SEO-Arbeiten.

## DEC-009 Mailversand serverseitig über Pages Function
- **Status:** gültig · **Datum:** 12.–15.10.2026
- **Kontext:** Ursprünglich lag der EmailJS-Public-Key im Browser-Code (`sendForm`). `[Doku]`
- **Entscheid:** Das Formular sendet an `POST /api/contact` (Cloudflare Pages Function). Die Function ruft die EmailJS-REST-API mit **Private Key** auf. Schlüssel und IDs liegen ausschliesslich als **Secrets** im Pages-Projekt, nie im Repository oder im Browser. Template-Variablen: `name`, `email`, `message`, `title`, `time`, `from_name`, `reply_to`.
- **Begründung:** Wunsch der Projektleitung, die Werte vor Crawlern und Besuchern zu verbergen. `[Auftrag]`
- **Konsequenzen:** Deployment nur über Git oder Wrangler (siehe DEC-012); Secrets-Pflege in Cloudflare; EmailJS-Vorlage muss `{{name}}` statt `{{fullName}}` nutzen (Hinweis an Projektleitung erfolgt, Umsetzung nicht bestätigt, OP-006).

## DEC-010 Missbrauchsschutz des Formulars
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** Cloudflare Turnstile (Modus „interaction-only“, Token serverseitig geprüft), Honeypot-Feld `website`, serverseitige Eingabeprüfung (Pflichtfelder, Längen 100/150/512, E-Mail-Format). Keine Sendesperre im Browser.
- **Begründung:** Die Function ist öffentlich erreichbar; ohne Prüfung könnte jeder Mails über das EmailJS-Konto versenden. Turnstile ist kostenlos und ohne Cookies. `[Auftrag]`
- **Konsequenzen:** Turnstile braucht Site Key (Build) und Secret Key; Hostnames im Widget müssen die Domains enthalten. Rate-Limiting als WAF-Regel ist optional (OP-006).

## DEC-011 Karte mit Mapbox, bei Bedarf geladen
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** Mapbox GL JS v2.15.0 wird erst geladen, wenn die Karte bis auf eine Bildschirmhöhe heranrückt (`IntersectionObserver`, Rand 100 %). Dunkler Stil, goldene Markierung, Position 8.485225 / 47.181411.
- **Begründung:** Mapbox verursachte rund 6 s Rechenzeit auf der Startseite. `[Messung]` Wunsch der Projektleitung, es umzusetzen. `[Auftrag]`
- **Konsequenzen:** `mapbox.js` ist eine statische Datei (nicht gebündelt); die Datenschutzerklärung beschreibt das Laden erst beim Scrollen.

## DEC-012 Hosting auf Cloudflare Pages mit Git-Anbindung
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** Cloudflare Pages, angebunden an das GitHub-Repository, Build `npm run build`, Ausgabe `dist`. Kein Drag-and-drop-Upload (unterstützt keine Functions). Die Domain `ascnet.ch` hängt am Projekt `ascnet-webside-2026-motion-graphics`.
- **Begründung:** Functions und automatische Deployments. `[Doku]` `docs/cloudflare-pages-kontaktformular.md`
- **Konsequenzen:** Jeder Push auf `main` ist ein Production-Deployment; Pushes nur nach Freigabe (agents.md). `wrangler.jsonc` wird ignoriert (siehe DEC-023).

## DEC-013 Öffentliche Schlüssel als Build-Variablen
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** `MAPBOX_TOKEN` und `TURNSTILE_SITE_KEY` werden beim Build in das HTML geschrieben (`data-mapbox-token`, `data-turnstile-sitekey`). Lokal liest `webpack.config.js` eine nicht versionierte `.env`. Ohne Mapbox-Token erscheint keine Karte, ohne Site Key gilt der Turnstile-Test-Key.
- **Begründung:** GitHub-Secret-Scanning hat den Mapbox-Token im Quellcode beanstandet; die Projektleitung entschied, ihn aus dem Code zu nehmen. `[Auftrag]` `[Git]`
- **Konsequenzen:** Neue öffentliche Schlüssel folgen demselben Muster (`.env.example` ergänzen, Pages-Variable setzen).

## DEC-014 Rechtsseiten als schlanker Einstieg, Quelle UID-Register
- **Status:** gültig · **Datum:** 12.10.2026
- **Entscheid:** Impressum, Datenschutzerklärung und 404 laden nur `legal.js` (Styles) ohne Fasern, Intro und Navigation. `legal.js` steht im `<head>` und lädt blockierend (verhindert Layoutsprung). Firmendaten stammen aus dem UID-Register (CHE-180.731.045) und Zefix.
- **Begründung:** Lesbarkeit, geringe Ladezeit. Inhalte sind Entwurf und fachkundig zu prüfen. `[Auftrag]`
- **Konsequenzen:** Jede Änderung an Drittdiensten verlangt Nachführung der Datenschutzerklärung (agents.md).

## DEC-015 H1 der Startseite bleibt der Slogan
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** Die H1 „Innovation verbindet // Wissen bewegt“ bleibt unverändert; Suchbegriffe tragen Title, Description und Kartentexte.
- **Begründung:** Eine Anpassung würde die Gestaltung ändern; SEO-Auftrag verbot visuelle Änderungen. `[Auftrag]`
- **Konsequenzen:** Soll die H1 suchmaschinenfreundlicher werden, ist das ein CHANGE mit Design-Freigabe.

## DEC-016 Kartentexte nur mit belegten Fachbegriffen
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** Die vier Leistungskarten nennen nur Technologien, die in `src/skills.json` ausgewiesen sind. „Microsoft 365“ und „Cross-Forest“ werden nicht genannt, da sie dort nicht ausdrücklich stehen.
- **Begründung:** SEO-Auftrag: keine unbelegten Leistungsversprechen. `[Auftrag]`
- **Konsequenzen:** Neue Fachbegriffe erst in `skills.json` belegen, dann in Karten, JSON-LD und Meta-Texten verwenden.

## DEC-017 Schriften lokal, Produktions-Build
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** Saira und JetBrains Mono werden als WOFF2 (latin, latin-ext, SIL OFL 1.1) von der eigenen Domain ausgeliefert. `npm run build` baut im Produktionsmodus (minifiziert, kein `eval`); die Dev-Skripte laufen im Entwicklungsmodus.
- **Begründung:** Keine Verbindung zu Google beim Seitenaufruf (Datenschutz), kürzere Ladezeit. `[Auftrag]` `[Messung]`
- **Konsequenzen:** Weitere Schriftschnitte oder Zeichensätze müssen in `src/fonts/` und `src/fonts.css` ergänzt werden.

## DEC-018 SEO-Grundsätze
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:**
  1. Kanonische Adressen: `https://ascnet.ch/`, `/impressum`, `/datenschutz` (ohne `www`, ohne `.html`); interne Links zeigen darauf.
  2. `lang="de-CH"`; Schweizer Schreibweise („ss“).
  3. Echtes 404 für unbekannte Adressen (`404.html`, `noindex`).
  4. `*.pages.dev` erhält `X-Robots-Tag: noindex`.
  5. Sitemap und `robots.txt` als statische Dateien; `lastmod` von Hand bei inhaltlicher Änderung.
  6. Ein JSON-LD-Block mit Organization (UID, MWST), WebSite und vier Services; keine erfundenen Profile (`sameAs`), keine Bewertungen, keine FAQ, keine BreadcrumbList, kein hreflang.
  7. Open Graph mit bestehendem Logo (kein neues Bild), `meta keywords` unverändert.
- **Begründung:** SEO-Auftrag mit Scope-Grenzen (keine Gestaltungsänderung). `[Auftrag]` `[Doku]` `docs/SEO-IMPLEMENTATION.md`
- **Konsequenzen:** Neue Seiten brauchen Title, Description, Canonical, Sitemap-Eintrag und gegebenenfalls einen Eintrag in `webpack.config.js`.

## DEC-019 Besucherstatistik über Cloudflare, ohne Code
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** Cloudflare Web Analytics wird im Pages-Dashboard aktiviert; Cloudflare fügt den Beacon automatisch ein. Kein Skript im Repository, kein Google Analytics, keine Zusatz-Events.
- **Begründung:** Keine Cookies, keine Tokens im Code, keine Doppel-Einbindung. `[Auftrag]`
- **Konsequenzen:** Ein zusätzliches manuelles Skript würde doppelt zählen und ist zu unterlassen. Live nachgewiesen: genau ein Beacon je Seite. `[Messung]`

## DEC-020 Search Console als Domain-Property
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** Google Search Console mit Domain-Property `ascnet.ch`, Bestätigung über DNS-TXT in Cloudflare, Sitemap `https://ascnet.ch/sitemap.xml`. Kein Google-Skript auf der Seite.
- **Begründung:** Deckt http/https/www ab. Einrichtung erfolgte manuell durch die Projektleitung. `[Auftrag]`
- **Konsequenzen:** DNS-Änderungen erfolgen nur durch die Projektleitung.

## DEC-021 Firmenangaben: Quelle und Einheitlichkeit
- **Status:** gültig · **Datum:** 12.10.2026
- **Entscheid:** Massgebend sind das UID-Register und Zefix (ASCNET Solutions GmbH, c/o Sarya AG, Chamerstrasse 174, 6300 Zug; UID CHE-180.731.045; Firmennummer CH-170.4.011.922-0; MWST CHE-180.731.045 MWST). Die Adresse steht identisch im Kontaktbereich, im JSON-LD und im Impressum; die Karte zeigt dieselbe Position.
- **Begründung:** Frühere Adresse (c/o uhuhus kmg, Chamerstrasse 172) war überholt; die Kartenkoordinaten lagen rund 2,7 km zu weit östlich. `[Auftrag]` `[Doku]`
- **Konsequenzen:** Bei einem Adresswechsel müssen alle vier Stellen und die Koordinaten in `mapbox.js` angepasst werden.

## DEC-022 Build erzeugt `dist/` vollständig
- **Status:** gültig · **Datum:** 15.10.2026
- **Entscheid:** `npm run build` baut `dist/` bei jedem Lauf komplett neu (`output.clean`). Statische Dateien (`mapbox.js`, `skills.js`, `skills.json`, `img/`, `robots.txt`, `sitemap.xml`, `_headers`, `favicon.ico`, `fonts.css`, `fonts/`) werden über die Liste `STATIC_FILES` in `webpack.config.js` aus `src/` kopiert. Dateien werden nie von Hand in `dist/` gepflegt (`dist/` ist nicht im Git).
- **Begründung:** Ein Build durch Cloudflare muss dieselbe Seite liefern wie lokal; getestet mit einer frischen Kopie ohne `dist` und `node_modules`. `[Messung]`
- **Konsequenzen:** Neue statische Datei → in `src/` ablegen und in `STATIC_FILES` eintragen.

## DEC-023 `wrangler.jsonc`: Umgang offen
- **Status:** **offen**
- **Sachverhalt:** Die Datei nutzt die Workers-Syntax und wird von Pages mit Warnung übersprungen. Ein Eintrag `pages_build_output_dir` würde sie zur massgebenden Konfiguration machen und die Dashboard-Felder sperren. `[Doku]` Build-Log
- **Optionen (nicht entschieden):** entfernen; in Pages-Format überführen; unverändert lassen.
- **Konsequenzen bis zur Entscheidung:** Warnung im Build-Log bleibt, Dashboard-Einstellungen gelten.

## DEC-024 Messskripte ins Repository aufnehmen?
- **Status:** **offen**
- **Sachverhalt:** Lighthouse-, Browser- und Statuscode-Prüfungen wurden mit temporären Skripten ausgeführt, die nicht im Repository liegen. Es gibt keine automatisierten Tests.
- **Optionen (nicht entschieden):** Skripte ins Repository (z. B. `scripts/`) aufnehmen; bei Handprüfung bleiben und die Prüfroutine in `agents.md` nutzen.
