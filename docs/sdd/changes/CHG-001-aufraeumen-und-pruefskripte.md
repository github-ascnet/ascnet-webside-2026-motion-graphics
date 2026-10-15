# CHG-001 – Aufräumen und Prüfskripte

| Feld | Inhalt |
|---|---|
| ID / Datum | CHG-001 / 15.10.2026 |
| Auftraggeber | Projektleitung ASCNET Solutions GmbH |
| Status | validiert (Commit offen, siehe §10) |

## 1. Änderung (in einem Satz)

Die beim INIT festgestellten Inkonsistenzen OP-001, 002, 003, 004, 007 und 009 werden behoben, damit Repository, Doku und Spezifikation zusammenpassen und die Prüfroutine reproduzierbar ist.

## 2. Anforderung (Soll)

- Keine neue fachliche Anforderung. REQ-005 (Footer „©2026“) gilt für alle Seiten; REQ-063 wird durch Skripte prüfbar.
- Abnahmekriterium: Bundle und HTML der Startseite und der 404-Seite bleiben byteidentisch; `npm test` und `npm run test:browser` laufen durch.
- Nicht-Scope: Produktivcode, Design, Abhängigkeiten, Punkt OP-006 (macht die Projektleitung selbst).

## 3. Betroffene Spezifikation

| Typ | ID | Wirkung |
|---|---|---|
| Anforderung | REQ-005 | Geltungsbereich bestätigt |
| Anforderung | REQ-063 | durch Skripte prüfbar |
| Entscheidung | DEC-023, DEC-024 | von offen auf gültig |
| Arbeitspaket | BP-015 | neu |
| Offener Punkt | OP-001, 002, 003, 004, 007, 009 | erledigt |

## 4. Ist / Soll / Delta

| | Beschreibung | Beleg |
|---|---|---|
| Ist | Jahr 2025 auf Rechtsseiten; Workers-`wrangler.jsonc`; veraltete Konfig- und Anleitungsdateien; kein Test im Repo | OP-Tabelle |
| Soll | einheitlich 2026; keine Überbleibsel; Prüfskripte im Repo | Auftrag „Punkte 1–4 fixen“ |
| Delta | siehe BP-015 | – |

## 5. Konflikte und Entscheidungsbedarf

Keine. DEC-023 und DEC-024 waren offen und sind mit dem Auftrag entschieden.

## 6. Neue oder ersetzte Entscheidung

DEC-023 (`wrangler.jsonc` entfernt) und DEC-024 (Prüfskripte im Repository), siehe `decisions.md`.

## 7. Arbeitspaket

BP-015, siehe `build_plan.md`.

## 8. Auswirkungen ausserhalb des Codes

- [x] `sitemap.xml` `lastmod` aktualisiert (Impressum 2026-10-15)
- [x] Cloudflare: kein Eingriff nötig; die Warnung zur `wrangler.jsonc` im Build-Log entfällt
- Punkt OP-006 (EmailJS Private Key und Vorlage, Mapbox-Token-Beschränkung, Turnstile-Hostnames) bleibt bei der Projektleitung.

## 9. Validierung

| Kriterium | Ergebnis | Nachweis |
|---|---|---|
| Bundle/HTML unverändert | erfüllt | SHA-256 von `main.js`, `legal.js`, `index.html`, `404.html` vor/nach identisch |
| `npm ci --dry-run` | erfüllt | Lock nur in den zwei Namenszeilen geändert |
| `npm test` | erfüllt | 10 bestanden, 3 übersprungen (Secrets fehlen lokal, pages.dev-Header) |
| `npm run test:browser` | erfüllt | 5 von 5, Referenzfall CHF 182'148 |
| Lighthouse | erfüllt | SEO 100 / 100 / 100; Performance 92 / 99 / 99 |
| Keine Scope-Erweiterung | erfüllt | Änderungen nur in den Dateien von BP-015 |

Nicht prüfbar: Function-Antworten 400/200 (benötigen `.dev.vars`), `x-robots-tag` auf pages.dev.

## 10. Abschluss

- Freigabe durch: Projektleitung (Auftrag) · 15.10.2026
- Commit/Deployment: lokal committet, Push nach Freigabe
- SDD nachgeführt: `project_plan.md` (OP-Tabelle, Komponentenkarte), `decisions.md`, `build_plan.md`, `agents.md` §6
