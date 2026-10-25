# CHG-003 – Kapitel „Vorgehen“

| Feld | Inhalt |
|---|---|
| ID / Datum | CHG-003 / 25.10.2026 |
| Auftraggeber | Projektleitung ASCNET Solutions GmbH |
| Status | umgesetzt (Commit offen; Aussagen zu bestätigen, OP-015) |

## 1. Änderung (in einem Satz)

Die Startseite erhält zwischen Leistungen und Preise ein Kapitel „Vorgehen“, das in vier Schritten zeigt, wie ein Auftrag abläuft und was die Kundin bzw. der Kunde am Ende jedes Schritts in der Hand hat.

## 2. Anforderung (Soll)

- Neu: REQ-026; geändert: REQ-011 (sechs Loader-Zeilen), REQ-013 (Anzeige „05/06 Preise“), REQ-020 (sechs Kapitel) (siehe `project_plan.md`).
- Abnahmekriterium: `#vorgehen` vorhanden mit `data-scene`; Dock zeigt „/06“, Sprung zu „Vorgehen“ zeigt „04“, zu „Preise“ „05“; Loader erreicht 06/06 vor dem Ausblenden; 390 px ohne Überlauf; `npm test` und `npm run test:browser` bestanden.
- Nicht-Scope: JSON-LD, Meta-Texte, Kalkulator, Intro-Protokoll (vier Kompetenzfelder), AI-Karte (Todo.md Punkt 1).

## 3. Betroffene Spezifikation

| Typ | ID | Wirkung |
|---|---|---|
| Anforderung | REQ-026 | neu |
| Anforderung | REQ-011, REQ-013, REQ-020 | ändert (Kapitelzahl) |
| Entscheidung | DEC-026 | neu (DEC-004 Punkt 5 gilt sinngemäss für sechs Kapitel) |
| Arbeitspaket | BP-017 | neu |
| Offener Punkt | OP-015 | entsteht (Aussagen bestätigen) |

## 4. Ist / Soll / Delta

| | Beschreibung | Beleg |
|---|---|---|
| Ist | Fünf Kapitel: Start, Mehrwert, Leistungen, Preise, Kontakt | `src/index.html` |
| Soll | Sechs Kapitel mit „Vorgehen“ an Position 04 | Auftrag (Vorschlag freigegeben 25.10.2026) |
| Delta | siehe BP-017 | – |

## 5. Konflikte und Entscheidungsbedarf

- DEC-004 Punkt 5 nennt „fünf Kapitel“. Nicht ersetzt, sondern in DEC-026 sinngemäss auf sechs erweitert.
- Offen (OP-015): Die Aussagen „Rückfallebene“, „Zwischenstände“, „Workshop“ und „Befund auch ohne uns verwendbar“ sind Zusagen an Kunden und von der Projektleitung zu bestätigen.
- Optionaler Satz zur spezifikationsgetriebenen Arbeit mit AI: weggelassen, bis Todo.md Punkt 1 entschieden ist.

## 6. Neue oder ersetzte Entscheidung

DEC-026, siehe `decisions.md`.

## 7. Arbeitspaket

BP-017, siehe `build_plan.md`.

## 8. Auswirkungen ausserhalb des Codes

- [ ] Datenschutzerklärung nachführen: nicht nötig (kein neuer Dienst)
- [ ] `sitemap.xml` `lastmod`: `[offen]`, Projektleitung entscheidet beim Deployment
- [ ] JSON-LD und Meta-Texte: nicht betroffen (keine neue Leistung)
- [ ] Kalkulator-Referenzfall: unverändert (DEC-008)

## 9. Validierung

| Kriterium | Ergebnis | Nachweis |
|---|---|---|
| Kapitel, Dock, Navigation, Intro | erfüllt | `npm run test:browser` 5 von 5; Loader „06 BEREIT“ vor dem Ausblenden |
| HTTP-Prüfungen | erfüllt | `npm test` 10 bestanden, 3 übersprungen (Secrets, pages.dev) |
| 1440/800/390 px ohne Überlauf | erfüllt | Screenshots, Überlauf 0 px |
| Keine Scope-Erweiterung | erfüllt | Änderungen nur in den Dateien von BP-017 |

Nicht geprüft: Lighthouse.

## 10. Abschluss

- Freigabe durch: Projektleitung (Vorschlag freigegeben) · 25.10.2026
- Commit/Deployment: lokal, Commit auf Anweisung
- SDD nachgeführt: `project_plan.md`, `decisions.md`, `build_plan.md`, `agents.md` §6, `Todo.md` (AI-Karte rückt auf CHG-004)
