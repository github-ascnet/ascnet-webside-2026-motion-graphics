# SEO-Implementierung ascnet.ch

Stand: 15. Oktober 2026 · Website: https://ascnet.ch · Hosting: Cloudflare Pages (Projekt `ascnet-webside-2026-motion-graphics`)

Diese Dokumentation beschreibt die SEO-Optimierung der fertigen Website. Design, Animationen, Navigation, Preis-Kalkulator und Kontaktformular sind unverändert geblieben. Geändert wurden nur Metadaten, technische SEO-Dateien, strukturierte Daten, die Build-Konfiguration und einzelne Formulierungen in den vier Leistungskarten.

---

## 1. SEO-Ausgangslage

Geprüft am 15.10.2026 an der Live-Seite (`curl`) und im Repository.

### Bereits korrekt

| Bereich | Befund |
|---|---|
| HTTPS | `http://ascnet.ch/` → 301 auf `https://ascnet.ch/` |
| www | `https://www.ascnet.ch/` → 301 auf `https://ascnet.ch/` |
| Clean URLs | `/impressum.html` → 308 auf `/impressum` (Cloudflare Pages) |
| Rendering | Statisches HTML (Webpack), alle Texte stehen im ausgelieferten HTML und sind ohne JavaScript crawlbar |
| Überschriften | Je Seite eine H1, H2/H3 ohne Sprünge |
| Bilder | Logo mit Alt-Text, feste Breite/Höhe (kein Layout-Sprung) |
| Viewport | gesetzt |
| Structured Data | Organization-JSON-LD vorhanden |
| API | `/api/contact` antwortet auf GET mit 405 (kein indexierbarer Inhalt) |
| Analytics | kein Skript eingebunden, keine Doppel-Einbindung |

### Defizite

| Prio | Befund | Status vorher |
|---|---|---|
| 1 | **Soft-404:** Jede unbekannte Adresse lieferte die Startseite mit Status 200 | Pages-SPA-Fallback, kein `404.html` |
| 1 | **`robots.txt` und `sitemap.xml` fehlten.** Beide Adressen lieferten die Startseite als `text/html` | Lighthouse: `robots-txt` ungültig |
| 1 | **Keine Canonicals**; `ascnet-webside-2026-motion-graphics.pages.dev` war als Duplikat indexierbar | kein `X-Robots-Tag` |
| 2 | Title der Startseite generisch („ASCNET Solutions GmbH“) | |
| 2 | Fachbegriffe (Exchange, Active Directory, Entra ID, PowerShell, Power BI …) standen nur im Skills-Fenster, das per JavaScript erst beim Klick geladen wird | `skills.json` |
| 2 | Kein Open Graph, keine Twitter Card | |
| 2 | Sprache `de` statt `de-CH` | alle Seiten |
| 2 | Interne Links auf `*.html` → jeweils ein Umweg über 308 | Footer, Kopf der Rechtsseiten |
| 3 | JSON-LD ohne WebSite, Leistungsnamen wichen von der Seite ab, ohne UID/MWST und Logo | |
| 3 | Kein Favicon (404) | |
| 3 | Build im Modus `development`: `main.js` 144 KB mit 17 `eval`-Aufrufen | |
| 3 | „ß“ in Seitentexten (Schweizer Schreibweise: „ss“) | 4 Stellen |

### Nicht erforderlich bzw. bewusst nicht geändert

- **H1 der Startseite** („Innovation verbindet // Wissen bewegt“) bleibt der Slogan. Eine Änderung würde die Gestaltung verändern; die Suchbegriffe tragen Title, Description und die Leistungskarten.
- **`meta keywords`** bleibt unverändert. Google wertet das Feld nicht aus, es schadet aber nicht.
- **BreadcrumbList:** nicht sinnvoll, die Seitenstruktur ist flach (Startseite plus zwei Rechtsseiten).
- **hreflang:** nicht nötig, es gibt nur eine Sprachfassung.
- **CSS über `style-loader`** (CSS kommt per JavaScript): bleibt aus Architekturgründen unverändert, siehe offene Punkte.

---

## 2. Implementierte Änderungen

| Datei | Änderung |
|---|---|
| `src/robots.txt` | **neu**: alle Seiten frei, `/api/` gesperrt, Verweis auf Sitemap |
| `src/sitemap.xml` | **neu**: drei kanonische URLs mit `lastmod` |
| `src/_headers` | **neu**: `X-Robots-Tag: noindex` für `*.pages.dev`, korrekter Content-Type für die Sitemap |
| `src/404.html` | **neu**: Fehlerseite im Layout der Rechtsseiten, `noindex`; Cloudflare Pages liefert sie mit Status 404 aus |
| `src/favicon.ico`, `src/img/favicon-32.png`, `src/img/apple-touch-icon.png` | **neu**: aus dem bestehenden Logo abgeleitet (Buchstabe „A“ des Schriftzugs) |
| `src/index.html` | Title, Description, Canonical, Robots, Open Graph, Twitter Card, Favicon-Links, `lang="de-CH"`, strukturierte Daten als ein `@graph`, Leistungskarten ergänzt, „ß“ → „ss“, interne Links kanonisch |
| `src/impressum.html`, `src/datenschutz.html` | Title, Description, Canonical, Robots, Open Graph, Favicon-Links, `lang="de-CH"`, interne Links kanonisch |
| `src/datenschutz.html` | Abschnitt 02 um Cloudflare Web Analytics ergänzt, Abschnitt 06 angepasst |
| `src/chapters.js` | `aria-label` „Menü schliessen“ (Schweizer Schreibweise) |
| `webpack.config.js` | neue Dateien in `STATIC_FILES`, `404.html` als Seite, `publicPath: "/"`, Clean URLs im Dev-Server, Modus nicht mehr fest auf `development` |
| `package.json` | `build` = `webpack --mode production`; `start` explizit `development` |

---

## 3. On-Page SEO

### Titles und Meta-Descriptions

| Seite | Title | Meta-Description |
|---|---|---|
| `/` | IT-Beratung Zug: Exchange, Teams, Entra ID & BI \| ASCNET (56 Zeichen) | Microsoft Exchange und Teams, Active Directory und Entra ID, .NET- und PowerShell-Entwicklung, Business Intelligence mit SQL Server und Power BI – ASCNET, Zug. (159) |
| `/impressum` | Impressum – ASCNET Solutions GmbH, Zug (38) | Impressum der ASCNET Solutions GmbH, Zug: Anschrift, Handelsregister, UID CHE-180.731.045, MWST-Nummer sowie Haftungs- und Urheberrechtshinweise. (145) |
| `/datenschutz` | Datenschutzerklärung – ASCNET Solutions GmbH (44) | Datenschutzerklärung der ASCNET Solutions GmbH nach Schweizer DSG: Hosting, Kontaktformular, Karte, Schriften, Besucherstatistik ohne Cookies sowie Ihre Rechte. (160) |
| 404 | Seite nicht gefunden – ASCNET Solutions GmbH | `noindex, follow` |

Alle Begriffe in Title und Description sind durch Seiteninhalt bzw. `src/skills.json` belegt. „Microsoft 365“, „Cross-Forest“ und Zertifizierungen werden nicht genannt, weil die Seite sie nicht ausdrücklich belegt.

### Leistungskarten

Die Karten wurden um je einen Satzteil mit den Technologien aus dem jeweiligen Expertenprofil (`src/skills.json`) ergänzt. Bisher standen diese Begriffe nur im Skills-Fenster, das Google nicht als Seitentext wertet.

| Karte | Ergänzung |
|---|---|
| Collaboration-Management | „… mit Microsoft Exchange (On-Prem und Hybrid) und Microsoft Teams …“ |
| Identity-Management | „… mit Active Directory, Entra ID, ADFS, MFA und SSO sowie …“ |
| Development | „… mit .NET (C#), JavaScript und React sowie PowerShell-Automatisierung …“ |
| Business Intelligence | „… mit MS SQL Server, Data Warehouse, SSIS/SSAS und Power BI …“ |

Abgedeckte Suchkontexte: Microsoft Exchange / Exchange Hybrid, Microsoft Teams, Active Directory, Entra ID, Identity & Access Management, PowerShell-Automatisierung, .NET-Softwareentwicklung, Business Intelligence, Power BI, SQL Server.

### Weitere Massnahmen

- **Sprache:** `lang="de-CH"` auf allen Seiten, `og:locale=de_CH`.
- **Schreibweise:** „Grösse“, „massgeschneiderte“, „grösstmöglichen“, „Schliessen“.
- **Interne Links:** zeigen direkt auf `/`, `/impressum`, `/datenschutz`, ohne den Umweg über 308.

---

## 4. Technical SEO

### Canonical URLs

| Seite | Canonical |
|---|---|
| Startseite | `https://ascnet.ch/` |
| Impressum | `https://ascnet.ch/impressum` |
| Datenschutz | `https://ascnet.ch/datenschutz` |

Einheitlich ohne `www`, ohne `.html`, mit HTTPS, also passend zu den bestehenden Weiterleitungen.

### robots.txt (`src/robots.txt`)

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://ascnet.ch/sitemap.xml
```

`/api/` ist nur der POST-Endpunkt des Kontaktformulars. Die Sperre ist kein Schutz (dafür sorgen Turnstile und die Function), sie verhindert nur unnötige Crawler-Aufrufe.

### XML-Sitemap (`src/sitemap.xml`)

Drei kanonische, indexierbare URLs. `lastmod` entspricht dem Datum der letzten inhaltlichen Änderung der jeweiligen Seite und muss bei künftigen Inhaltsänderungen von Hand nachgeführt werden.

### Meta Robots und X-Robots-Tag

- Inhaltsseiten: `index, follow`.
- 404-Seite: `noindex, follow`.
- `https://<projekt>.pages.dev/*`: Header `X-Robots-Tag: noindex` über `src/_headers`. Vorschau-Deployments erhalten `noindex` laut Cloudflare automatisch.

### Soft-404 behoben

Cloudflare Pages behandelt ein Projekt ohne `404.html` als Single-Page-App und liefert für jede unbekannte Adresse die Startseite mit Status 200 aus. Mit `src/404.html` antworten unbekannte Adressen jetzt mit **404**. Skripte und Styles werden über absolute Pfade geladen (`publicPath: "/"`), damit die Fehlerseite auch unter verschachtelten Adressen wie `/a/b/c` korrekt aussieht.

### Social Metadata

Open Graph (`og:type`, `og:locale`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` mit Grösse und Alt-Text) und `twitter:card=summary_large_image` auf allen drei Inhaltsseiten. Als Bild dient das bestehende Logo `img/Logo_smart_dark_xl.png` (1644 × 654 px). Es wurde keine neue Grafik erstellt.

### Structured Data (JSON-LD, nur Startseite)

Ein einziger Block mit `@graph`:

| Typ | Inhalt |
|---|---|
| `Organization` (`#organization`) | Name, URL, Logo, E-Mail, Adresse c/o Sarya AG, Chamerstrasse 174, 6300 Zug; `vatID` CHE-180.731.045 MWST und `identifier` UID CHE-180.731.045 (beides aus dem UID-Register) |
| `WebSite` (`#website`) | Name, URL, `inLanguage de-CH`, `publisher` → Organization. Keine `SearchAction`, da es keine Suche gibt |
| `Service` × 4 | Namen exakt wie die Leistungskarten, Beschreibung aus dem Kartentext, `provider` → Organization, `areaServed CH` |

Nicht enthalten: `sameAs` (keine verifizierten Profile bekannt), Bewertungen, FAQ, BreadcrumbList.

### Performance (Build)

`npm run build` erzeugt jetzt einen Produktions-Build (minifiziert, ohne `eval`). Der lokale Entwicklungsserver (`npm run dev`) läuft weiterhin im Entwicklungsmodus.

---

## 5. Google Search Console – manuelle Einrichtung

Voraussetzungen sind erfüllt: Sitemap erreichbar, `robots.txt` gültig, Canonicals gesetzt, Seiten indexierbar. Es wurde **kein** Google-Skript eingebunden.

1. **Search Console öffnen:** <https://search.google.com/search-console> mit dem Google-Konto anmelden, das die Property verwalten soll.
2. **Domain-Property anlegen:** „Property hinzufügen“ → Typ **Domain** → `ascnet.ch` (ohne `https://`, ohne `www`). Die Domain-Property deckt `http`, `https`, `www` und alle Subdomains ab.
3. **Per DNS bestätigen:**
   - Google zeigt einen TXT-Eintrag der Form `google-site-verification=…` an. Den Wert aus der Search Console kopieren.
   - Cloudflare-Dashboard → Domain `ascnet.ch` → **DNS** → **Records** → **Add record**: Typ `TXT`, Name `@`, Inhalt = kopierter Wert, TTL `Auto` → **Save**.
   - Bestehende TXT-Einträge (z. B. SPF `v=spf1 …`) **nicht** ändern, der neue Eintrag kommt zusätzlich dazu.
   - Alternativ bietet Google bei Domains auf Cloudflare oft eine automatische Bestätigung über die Cloudflare-Anmeldung an. Das Ergebnis ist derselbe TXT-Eintrag.
   - In der Search Console auf **Bestätigen** klicken. Die DNS-Aktualisierung dauert meist wenige Minuten.
4. **Sitemap einreichen:** links **Sitemaps** → `sitemap.xml` eintragen (vollständig: `https://ascnet.ch/sitemap.xml`) → **Senden**. Status sollte nach kurzer Zeit „Erfolgreich“ zeigen, mit 3 gefundenen URLs.
5. **Indexierung prüfen:**
   - **URL-Prüfung** oben: `https://ascnet.ch/` eingeben → „Indexierung beantragen“. Dasselbe für `/impressum` und `/datenschutz`.
   - Nach einigen Tagen unter **Indexierung → Seiten** kontrollieren: erwartet sind 3 indexierte Seiten. Die `pages.dev`-Adresse erscheint nicht, sie liegt ausserhalb der Property und ist `noindex`.
6. **Suchleistung beobachten:** **Leistung → Suchergebnisse** zeigt Impressionen, Klicks, CTR, durchschnittliche Position und die Suchanfragen. Erste Daten erscheinen nach etwa 2–3 Tagen.

Optional: **Rich-Results-Test** (<https://search.google.com/test/rich-results>) mit `https://ascnet.ch/` ausführen. Erwartet werden Organisation und Website ohne Fehler.

---

## 6. Cloudflare Web Analytics

### Implementierung

Es wurde **kein Skript ins Repository** eingebaut. Cloudflare Pages kann den Analytics-Beacon automatisch in jede ausgelieferte Seite einfügen. So gibt es keinen Token im Code und keine Gefahr einer doppelten Einbindung. Geprüft: Weder Quellcode noch Live-Seite enthalten heute ein Analytics-Skript.

### Einstellungen in Cloudflare

1. Cloudflare-Dashboard → **Workers & Pages** → Projekt `ascnet-webside-2026-motion-graphics` → **Metrics**.
2. Unter **Web Analytics** auf **Enable** klicken. Cloudflare fügt das Skript ab dem nächsten Deployment automatisch ein; gegebenenfalls unter **Deployments** einmal **Retry deployment** auslösen.
3. **Besucher aus der EU:** In den Web-Analytics-Einstellungen der Site (Dashboard → **Analytics & Logs → Web Analytics → Manage site**) lässt sich wählen, ob Besuche aus der EU erfasst werden („Enable“) oder ausgeschlossen werden („Enable, excluding visitor data in the EU“). Cloudflare Web Analytics setzt keine Cookies und erstellt keine Profile, gilt daher als datenschutzfreundlich. Wer jedes Restrisiko bei EU-Besuchern vermeiden will, wählt den EU-Ausschluss. Dann fehlen diese Besuche in der Statistik.
4. Die Daten erscheinen unter **Analytics & Logs → Web Analytics**: Besuche, Seitenaufrufe, Herkunft, Länder, Geräte und Core Web Vitals echter Besucher.

**Wichtig:** Das Skript nicht zusätzlich von Hand in `src/*.html` einbauen, solange die automatische Einfügung aktiv ist, sonst wird doppelt gezählt.

### Performance und Datenschutz

- Das Beacon-Skript ist klein (wenige KB), wird asynchron geladen und blockiert die Darstellung nicht.
- Die Datenschutzerklärung (Abschnitt 02 und 06) beschreibt die Besucherstatistik bereits. Sie muss **vor oder mit** der Aktivierung online sein. Das ist mit diesem Deployment erledigt.
- Es gibt weder Google Analytics noch Tracking-Events für Formular und Kalkulator.

---

## 7. Tests

### Gemessen (lokal, `wrangler pages dev dist`, Produktions-Build)

| Prüfung | Ergebnis |
|---|---|
| `npm run build` (production) | erfolgreich, keine Warnungen ausser der bewussten Turnstile-Test-Key-Meldung lokal |
| `main.js` | 144 KB → 104 KB, `eval`-Aufrufe 17 → 0 |
| Statuscodes | `/` 200 · `/impressum` 200 · `/datenschutz` 200 · `/gibtsnicht` **404** · `/a/b/c` **404** · `/api/contact` 405 |
| `robots.txt` | 200, `text/plain` |
| `sitemap.xml` | 200, `application/xml` |
| Favicon | `/favicon.ico` 200, `/img/favicon-32.png` 200 |
| Titles / Descriptions | eindeutig, Titles ≤ 56 Zeichen, Descriptions 145–160 Zeichen |
| Canonical, `lang`, Robots, OG, Twitter | auf allen Inhaltsseiten vorhanden und korrekt |
| H1 | genau eine pro Seite, keine Sprünge in der Überschriftenfolge |
| JSON-LD | genau ein Block, `JSON.parse` gültig: Organization, WebSite, 4 × Service |
| Interne Links | 18 Links geprüft, alle 200 |
| Analytics-Skripte | 0 (keine Doppel-Einbindung) |
| Funktionen | Preis-Kalkulator identische Ergebnisse, Kapitelsprünge und Pfeiltasten, Skills-Fenster, Karte, Kontaktformular-Endpunkt; keine Konsolenfehler (der frühere 404 des Favicons ist weg) |
| Responsive | Handy (390 px) ohne horizontalen Überlauf; Leistungskarten Desktop und Handy optisch unverändert bis auf die längeren Texte |

### Lighthouse (13.5, Mobile-Profil, simulierte Drosselung CPU × 4, lokal)

| Seite | SEO | Performance | Best Practices | Accessibility | LCP |
|---|---|---|---|---|---|
| Start – vorher | 92 | 33 | 96 | 93 | 10,0 s |
| Start – nachher | **100** | 41 | 96 | 93 | 7,1 s |
| Impressum – vorher | 92 | 92 | 96 | 95 | 2,6 s |
| Impressum – nachher | **100** | 92 | 96 | 95 | 2,6 s |
| Datenschutz – vorher | 92 | 92 | 96 | 95 | 2,6 s |
| Datenschutz – nachher | **100** | 93 | 96 | 95 | 2,6 s |

Einordnung: Die Performance-Werte der Startseite sind lokal ermittelt und wegen der Software-Grafik im Test (kein GPU-Zugriff) eher zu pessimistisch. Aussagekräftig sind die Werte echter Besucher in Cloudflare Web Analytics (Core Web Vitals). Laut Lighthouse verbraucht **Mapbox** (`mapbox-gl.js`) mit rund 6,1 s den grössten Teil der Rechenzeit auf der Startseite, siehe offene Punkte.

### Noch nicht live geprüft

Die Änderungen sind erst nach dem Deployment auf ascnet.ch wirksam. Nach dem Push sind live zu prüfen: Statuscodes wie oben, `X-Robots-Tag: noindex` auf der pages.dev-Adresse, Rich-Results-Test.

---

## 8. Offene Punkte (ausserhalb des Repositories)

| Punkt | Wer / Wo |
|---|---|
| Deployment freigeben (Push auf `main` löst das Production-Deployment aus) | Repository |
| Nach dem Deployment Live-Prüfung (Abschnitt 7) | Browser / `curl` |
| Google Search Console einrichten und Sitemap einreichen (Abschnitt 5) | Google, Cloudflare DNS |
| Cloudflare Web Analytics aktivieren, EU-Option wählen (Abschnitt 6) | Cloudflare-Dashboard |
| Rich-Results-Test ausführen | Google |
| Verifizierte Profile (z. B. LinkedIn-Firmenseite) nennen → als `sameAs` ergänzen | Inhaber |
| `lastmod` in `src/sitemap.xml` bei Inhaltsänderungen nachführen | Repository |

### Empfehlungen (nicht umgesetzt, da ausserhalb des freigegebenen Umfangs)

1. **Mapbox erst bei Bedarf laden** (grösster Performance-Hebel): `mapbox-gl.js` und `mapbox-gl.css` erst laden, wenn der Kontaktbereich in die Nähe des Bildschirms kommt. Die Optik bleibt gleich, die Startseite lädt deutlich schneller.
2. **CSS als Datei ausliefern** statt per JavaScript (`mini-css-extract-plugin`): früheres erstes Rendern. Das ist eine Architekturänderung am Build und eine neue Abhängigkeit.
3. **Eigenes Open-Graph-Bild** im Format 1200 × 630 px: wirkt beim Teilen auf LinkedIn und Co. besser als das breite Logo.
4. **Google Fonts lokal ausliefern:** spart einen externen Dienst (Datenschutz) und eine Verbindung.

---

## 9. SEO-Monitoring

| Rhythmus | Was | Wo |
|---|---|---|
| wöchentlich (erste 4 Wochen) | Indexierungsstatus der 3 Seiten, neue Fehler | Search Console → Indexierung → Seiten |
| monatlich | Impressionen, Klicks, CTR, Position; welche Suchanfragen führen zu ascnet.ch | Search Console → Leistung |
| monatlich | Besuche, Herkunft, Geräte, Core Web Vitals (LCP, INP, CLS) echter Besucher | Cloudflare → Web Analytics |
| bei jeder Inhaltsänderung | `lastmod` in der Sitemap nachführen, Title/Description noch passend? | Repository |
| vierteljährlich | Lighthouse-Audit (SEO, Performance), Rich-Results-Test | Chrome DevTools / Google |
| bei Auffälligkeiten | Suchanfragen mit vielen Impressionen, aber niedriger CTR → Title/Description dieser Seite schärfen | Search Console |

Ziele zur Orientierung: alle 3 Seiten indexiert, keine Fehler in „Seiten“, Core Web Vitals im Bereich „Gut“, steigende Impressionen zu Suchbegriffen rund um Exchange, Entra ID, Active Directory, PowerShell und Power BI.
