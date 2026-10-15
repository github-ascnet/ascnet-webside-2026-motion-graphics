# agents.md – Arbeitsregeln für Entwickler und KI-Agenten

Gilt für alle Arbeiten an ascnet.ch. Die Regeln sind aus dem tatsächlichen Vorgehen im Projekt abgeleitet (Herkunft: `[Code]`, `[Doku]`, `[Auftrag]`). Sie dürfen fachliche und architektonische Vorgaben aus `project_plan.md` und `decisions.md` **nicht** überschreiben.

Arbeitsweise nach dem Skill `sdd-development-orchestrator`: **nicht erfinden, nicht ausweiten, Konflikte sichtbar machen, nur den belegten Scope bearbeiten.**

## 1. Lesereihenfolge vor jeder Arbeit

1. `docs/sdd/project_plan.md` (REQ, offene Punkte OP-…)
2. `docs/sdd/decisions.md` (DEC, vor allem die zum Bereich gehörenden und alle `offen`)
3. `docs/sdd/build_plan.md` (Voraussetzungen, nächste BP-Nummer)
4. diese Datei
5. betroffener Code

## 2. Ablauf einer Änderung

| Schritt | Modus | Ergebnis |
|---|---|---|
| 1 | **CHANGE** | Änderung erfassen (Vorlage `templates/change.md`): Anforderung, betroffene REQ/DEC/BP, Konflikte |
| 2 | **PLAN** | Arbeitspaket mit Scope, Nicht-Scope, Dateien, Abschlusskriterien; Rückfragen bei blockierenden Unklarheiten |
| 3 | SDD aktualisieren | neue/ersetzte DEC, neue REQ, neues BP (Status `geplant`); Freigabe durch die Projektleitung |
| 4 | **IMPLEMENT** | nur das freigegebene BP und zwingende Abhängigkeiten |
| 5 | **VALIDATE** | Prüfroutine (Abschnitt 6), Ergebnis je Kriterium: erfüllt / teilweise / nicht erfüllt / nicht prüfbar |
| 6 | Abschluss | BP-Status auf `abgeschlossen` setzen, Nachweis eintragen, `project_plan.md` (Ist) nachführen |

Regeln dazu:
- Eine Änderung an einer **gültigen** Decision erzeugt eine neue DEC; die alte wird `ersetzt` und verweist auf die neue. Nichts löschen.
- Ein Konflikt zwischen SDD und Code wird benannt (beide Stellen, betroffene Dateien) und **nicht** eigenmächtig aufgelöst.
- Der Code ist nicht automatisch die Spezifikation. Abweichungen werden als OP-Eintrag erfasst.
- Offene Fragen bleiben `offen`; sie werden nicht als entschieden dargestellt.
- Der Build-Plan wird nicht nachträglich so verändert, dass nicht geplante Arbeit legitimiert wird.

## 3. Scope-Grenzen (aus den Aufträgen)

Nicht ohne ausdrücklichen Auftrag ändern:
- Rechenlogik, Stundensätze und PLZ-Zuschläge des Preis-Kalkulators (DEC-008)
- Kontaktformular und Function (DEC-009, DEC-010) ausser bei einem eigenen BP
- Navigation (Dock) und Intro-Verhalten (DEC-004, DEC-007)
- Erscheinungsbild und Farben (DEC-005)
- Keine neuen Frameworks, keine neuen Abhängigkeiten ohne Decision (DEC-001)
- Keine zusätzlichen Tracking-Dienste, kein Google Analytics (DEC-019)

## 4. Dateistruktur und Konventionen

Kartentabelle: `project_plan.md` §4.2. Zusätzlich:

| Thema | Regel |
|---|---|
| Sprache | Deutsch; Schweizer Schreibweise („ss“ statt „ß“, Umlaute korrekt), `de-CH` |
| Texte | sachlich, keine unbelegten Leistungsversprechen; Fachbegriffe nur, wenn in `src/skills.json` belegt (DEC-016) |
| Kapitel | `<section id="…" data-scene data-scene-title="…">`; neues Kapitel braucht zusätzlich Eintrag in der oberen Navigation und im Mobilmenü |
| Animationen | `data-reveal` (Einblenden, optional `--reveal-delay`), `.tilt-card` (Neigung); beides respektiert `prefers-reduced-motion` |
| CSS | Eigene Styles liegen in `@layer components` in `src/main.css`, damit Tailwind-Utilities (`hidden`, `md:flex`) gewinnen. Farben nur über die Variablen (`--bg`, `--accent`, `--fg`, …) |
| Skills-Fenster | `skills.js` setzt Tailwind-Klassen (`zinc`, `amber`); Anpassung der Farben nur über die Overrides am Ende von `main.css` |
| JavaScript | ES-Module für `main.js`/`legal.js`; `mapbox.js` und `skills.js` sind klassische Skripte und werden nur kopiert |
| Schriften | lokal in `src/fonts/`, eingebunden über `src/fonts.css` (DEC-017) |
| Bilder | Logo-Dunkelvariante für die Seite; Original bleibt unverändert (DEC-006) |

## 4a. Neue Seiten und statische Dateien

- Neue statische Datei: in `src/` ablegen und in `STATIC_FILES` (`webpack.config.js`) eintragen (DEC-022). **Nie** von Hand in `dist/` ablegen.
- Neue Seite: HTML in `src/`, `HtmlWebpackPlugin`-Eintrag, Title, Description, Canonical, Open Graph, Favicon-Links, Eintrag in `src/sitemap.xml`, Eintrag in der Kartentabelle (DEC-018).
- Neuer Drittdienst oder Wegfall eines Dienstes: **Datenschutzerklärung nachführen** (DEC-014).
- Inhaltliche Änderung einer Seite: `lastmod` in `src/sitemap.xml` aktualisieren.

## 5. Befehle

| Befehl | Zweck |
|---|---|
| `npm install` / `npm ci` | Abhängigkeiten |
| `npm run dev` | Entwicklungsserver, Port 8080, Live-Reload, Entwicklungsmodus |
| `npm run build` | Produktions-Build nach `dist/` (minifiziert, `dist/` wird geleert) |
| `npm run dev:api` | Pages Function lokal (`wrangler pages dev dist`, Port 8788); `npm run build` vorher |
| `npx wrangler pages dev dist --port 8788` | wie oben, liefert Statuscodes und `_headers` wie Cloudflare (404, Clean URLs) |
| `npm test` | HTTP-/SEO-Prüfungen (`scripts/test-http.mjs`), Pages-Server muss laufen |
| `npm run test:browser` | Browser-Prüfungen (`scripts/test-browser.mjs`), braucht `puppeteer-core` (`--no-save`) und Chrome |
| `npm run lighthouse` | Lighthouse-Messung der drei Seiten (`scripts/lighthouse.mjs`) |

Lokale Werte: `.env` (Build-Variablen, Vorlage `.env.example`) und `.dev.vars` (Secrets für Wrangler, Vorlage `.dev.vars.example`). Beide stehen in `.gitignore` und dürfen **nie** committet werden.

## 6. Prüfroutine vor einer Freigabe

Die Prüfungen sind als Skripte im Repository (DEC-024). Ablauf: `npm run build`, `npm run dev:api` (Terminal 1), dann `npm test` (Punkte 2, 6, teils 1), `npm run test:browser` (Punkte 3, 4, 5, 7; braucht `npm install --no-save puppeteer-core@23.11.1` und Chrome) und `npm run lighthouse` (Punkt 8). Mit `BASE_URL=https://ascnet.ch` laufen sie auch live (Punkt 10). Die Function-Tests werden ohne `.dev.vars` übersprungen. Punkt 9 bleibt Handarbeit. Dokumentiere bei jedem Lauf, was geprüft wurde und was nicht prüfbar war.

1. **Build:** `npm run build` ohne Fehler; `dist/` enthält alle Dateien (Seiten, `main.js`, `legal.js`, `fonts.css`, `fonts/`, `img/`, `robots.txt`, `sitemap.xml`, `_headers`, `404.html`, Favicons).
2. **Ausgeliefertes HTML** (`wrangler pages dev`): Statuscodes `/` 200, `/impressum` 200, `/datenschutz` 200, `/gibtsnicht` 404, `/impressum.html` Weiterleitung, `/api/contact` GET 405.
3. **Kalkulator-Referenzfall:** 63 Tage Collaboration, 60 Tage BI, Modus Tagessatz (8 Std/Tag), Onsite 30 %, PLZ 8000 → ohne Zuschlag CHF 169'440, Zuschlag CHF 12'708, **gesamt mit Zuschlag CHF 182'148**.
4. **Navigation:** Sprung zu „Preise“ zeigt 04/05, Pfeiltaste rechts geht zu „Kontakt“; Skills-Fenster öffnet.
5. **Handy (390 px):** kein horizontaler Überlauf auf Start, Impressum, Datenschutz.
6. **SEO:** genau eine H1 pro Seite; Title/Description eindeutig; Canonical stimmt; JSON-LD per `JSON.parse` gültig, ein Block; keine „ß“.
7. **Dienste beim Aufruf:** 0 Anfragen an Google und Mapbox; Mapbox lädt nach dem Scrollen zur Karte.
8. **Lighthouse** (Mobile): SEO 100 als Ziel; Verschlechterungen der Performance begründen.
9. **Keine Geheimnisse:** `git grep` nach Tokens vor jedem Commit.
10. **Nach dem Deployment:** dieselben Prüfungen live gegen `https://ascnet.ch` (curl); Analytics-Beacon genau einmal.

## 7. Git und Deployment

- Commit-Nachrichten: kurze Zusammenfassung, Stichpunkte, Messwerte falls relevant. Die vom Werkzeug vorgegebene Attribution wird angehängt.
- **Push auf `main` löst sofort ein Production-Deployment aus** (DEC-012). Vor dem Push die Freigabe der Projektleitung einholen; nach dem Push live prüfen.
- Kein Umgehen des GitHub-Secret-Scannings. Wird ein Fund gemeldet, wird das Geheimnis aus dem Code entfernt (DEC-013) und der Commit ersetzt, nicht freigegeben.
- Kein Drag-and-drop-Deployment (keine Functions, DEC-012).
- DNS-Änderungen, Cloudflare-Dashboard-Einstellungen und Konten werden von der Projektleitung vorgenommen. Anleitungen: `docs/cloudflare-pages-kontaktformular.md`, `docs/SEO-IMPLEMENTATION.md`.

## 8. Sicherheit

- Secrets nur in Cloudflare (Variablen und Secrets) bzw. lokal in `.dev.vars`/`.env`; nie im Quellcode, in Doku, Chat oder Commit.
- Öffentliche Schlüssel (`MAPBOX_TOKEN`, `TURNSTILE_SITE_KEY`) gehören ebenfalls in Build-Variablen; der Mapbox-Token sollte im Mapbox-Konto auf die Domains beschränkt sein (OP-006).
- Sicherheitsrelevante Mechanismen (Turnstile, Honeypot, Validierung) nicht ohne Decision ändern.

## 9. Wie eine Änderung als Spec erfasst wird

1. Vorlage kopieren: `docs/sdd/templates/change.md` → ausfüllen (ID `CHG-0NN`).
2. Betroffene `REQ`, `DEC` und `BP` benennen; Widersprüche aufführen.
3. Neue/ersetzte Decision in `decisions.md`, neue/angepasste Anforderung in `project_plan.md`, neues `BP-0NN` (Status `geplant`) in `build_plan.md`.
4. Freigabe der Projektleitung einholen, dann implementieren und validieren (Abschnitt 2).
5. Status und Nachweis eintragen; den Ist-Teil in `project_plan.md` und die Komponentenkarte nachführen.

Beispiele für typische Änderungen und ihre Zuordnung:

| Änderung | Betrifft | Vorgehen |
|---|---|---|
| Stundensatz oder PLZ-Zuschlag ändert sich | REQ-030, DEC-008 | CHANGE (fachlich), Referenzfall in §6 neu berechnen |
| Neue Leistung oder neuer Skill | REQ-023/024, DEC-016 | zuerst `skills.json`, dann Kartentext, JSON-LD, Meta-Texte, Sitemap prüfen |
| Adresse ändert sich | REQ-025, DEC-021 | Kontaktbereich, JSON-LD, Impressum, `mapbox.js`-Koordinaten |
| Neuer externer Dienst | REQ-041, DEC-014 | Datenschutzerklärung zwingend mitführen |
| Farb- oder Schriftwechsel | REQ-001/002, DEC-005 | CHANGE mit Design-Freigabe; Variablen in `main.css`, Shader-Farben in `fibers.js` |
| Neue Seite | REQ-050 ff., DEC-018 | Abschnitt 4a |
