# CHG-002 – AGB-Seite

| Feld | Inhalt |
|---|---|
| ID / Datum | CHG-002 / 17.10.2026 |
| Auftraggeber | Projektleitung ASCNET Solutions GmbH |
| Status | validiert (Commit offen; juristische Prüfung offen, OP-014) |

## 1. Änderung (in einem Satz)

Die Website erhält eine Seite `/agb` mit eigenen AGB der ASCNET Solutions GmbH als Anbieterin und einem Hinweis, dass für öffentliche Auftraggeber auf Verlangen die DVS-AGB (früher SIK) gelten.

## 2. Anforderung (Soll)

- Neu: REQ-043 (siehe `project_plan.md`).
- Abnahmekriterium: `/agb` liefert 200, hat eigenen Title/Description/Canonical, steht in Sitemap und Footer aller Seiten; `npm test` und `npm run test:browser` laufen durch.
- Nicht-Scope: Verweis in Offerten, juristische Prüfung, Download-Version (PDF).

## 3. Betroffene Spezifikation

| Typ | ID | Wirkung |
|---|---|---|
| Anforderung | REQ-043 | neu |
| Entscheidung | DEC-025 | neu |
| Arbeitspaket | BP-016 | neu |
| Offener Punkt | OP-014 | entsteht (juristische Prüfung) |

## 4. Ist / Soll / Delta

| | Beschreibung | Beleg |
|---|---|---|
| Ist | Keine AGB; Rechtsseiten: Impressum, Datenschutz | `src/` |
| Soll | AGB als Anbieterin; DVS-AGB für öffentliche Auftraggeber auf Verlangen | Auftrag „Variante C“ |
| Delta | siehe BP-016 | – |

## 5. Konflikte und Entscheidungsbedarf

- Ursprünglicher Wunsch: SIK-AGB 2020 als Basis. Befund: aus Auftraggebersicht geschrieben (Ziff. 1.2), Ausgabe 2020 durch DVS-AGB März 2025 abgelöst. Entscheid der Projektleitung: Variante C (DEC-025).
- Offen (OP-014): Eckwerte im Text (Haftungsgrenze CHF 100'000, Gewährleistung 12 Monate, Verzugszins 5 %, Zahlungsfrist 30 Tage, Gerichtsstand Zug) sind Annahmen und fachkundig zu prüfen. Link in Ziffer 14 auf die offizielle DVS-Quelle ersetzen.

## 6. Neue oder ersetzte Entscheidung

DEC-025, siehe `decisions.md`.

## 7. Arbeitspaket

BP-016, siehe `build_plan.md`.

## 8. Auswirkungen ausserhalb des Codes

- [ ] Datenschutzerklärung nachführen: nicht nötig (kein neuer Dienst)
- [x] `sitemap.xml` `lastmod` aktualisiert (alle vier Seiten 2026-10-17, Footer geändert)
- [ ] Cloudflare, DNS: kein Eingriff; Indexierung von `/agb` kann in der Search Console beantragt werden (Projektleitung)
- Offerten-Vorlagen: Verweis auf `https://ascnet.ch/agb` einfügen (Projektleitung)

## 9. Validierung

| Kriterium | Ergebnis | Nachweis |
|---|---|---|
| `/agb` 200, Title/Description/Canonical, Sitemap | erfüllt | `npm test` 10 bestanden, 3 übersprungen (Secrets, pages.dev) |
| Handyansicht ohne Überlauf | erfüllt | `npm run test:browser` 5 von 5 |
| Keine Scope-Erweiterung | erfüllt | Änderungen nur in den Dateien von BP-016 |

Nicht geprüft: Lighthouse für `/agb`, juristische Richtigkeit.

## 10. Abschluss

- Freigabe durch: Projektleitung (Auftrag) · 17.10.2026
- Commit/Deployment: lokal, Commit auf Anweisung
- SDD nachgeführt: `project_plan.md`, `decisions.md`, `build_plan.md`, `agents.md` §6, `SEO-IMPLEMENTATION.md`
