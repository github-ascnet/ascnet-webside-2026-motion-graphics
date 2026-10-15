# CHG-0NN – <Titel der Änderung>

Vorlage für eine Änderung als Spec (SDD-Modus CHANGE). Kopieren, ausfüllen, ablegen unter `docs/sdd/changes/CHG-0NN-<kurztitel>.md` (Ordner bei der ersten Änderung anlegen). Nichts erfinden: Unbekanntes als `[offen]` kennzeichnen.

| Feld | Inhalt |
|---|---|
| ID / Datum | CHG-0NN / TT.MM.JJJJ |
| Auftraggeber | Name oder Funktion |
| Status | Entwurf · freigegeben · umgesetzt · validiert · verworfen |

## 1. Änderung (in einem Satz)

Was soll anders werden, und warum? (Fachlicher Anlass, nicht die Umsetzung.)

## 2. Anforderung (Soll)

- Neue oder geänderte Anforderung: `REQ-…` (Formulierung)
- Abnahmekriterium (prüfbar):
- Nicht-Scope (was ausdrücklich nicht geändert wird):

## 3. Betroffene Spezifikation

| Typ | ID | Wirkung |
|---|---|---|
| Anforderung | REQ-… | ändert / neu / entfällt |
| Entscheidung | DEC-… | bleibt / ersetzt / neu |
| Arbeitspaket | BP-… | neu BP-0NN |
| Offener Punkt | OP-… | wird gelöst / entsteht |

## 4. Ist / Soll / Delta

| | Beschreibung | Beleg |
|---|---|---|
| Ist | aktueller Zustand im Code bzw. Betrieb | Datei/Zeile oder Messung |
| Soll | gewünschter Zustand | Auftrag |
| Delta | was zu ändern ist | – |

## 5. Konflikte und Entscheidungsbedarf

- Widerspruch zu bestehenden `DEC`/`REQ`? Benennen, nicht eigenmächtig auflösen.
- Offene Fragen an die Projektleitung:

## 6. Neue oder ersetzte Entscheidung

```
## DEC-0NN <Titel>
- Status: gültig (ersetzt DEC-0MM)
- Datum:
- Kontext:
- Entscheid:
- Begründung:
- Konsequenzen:
```

Die ersetzte Decision erhält Status `ersetzt durch DEC-0NN`; sie wird nicht gelöscht.

## 7. Arbeitspaket

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
- Status: geplant
```

## 8. Auswirkungen ausserhalb des Codes

Zutreffendes ankreuzen:

- [ ] Datenschutzerklärung nachführen (neuer/entfallener Dienst)
- [ ] `sitemap.xml` `lastmod` aktualisieren
- [ ] JSON-LD und Meta-Texte anpassen
- [ ] Cloudflare-Variablen oder Secrets ändern (Projektleitung)
- [ ] DNS oder Search Console betroffen (Projektleitung)
- [ ] Kalkulator-Referenzfall neu berechnen

## 9. Validierung (nach der Umsetzung)

| Kriterium | Ergebnis (erfüllt · teilweise · nicht erfüllt · nicht prüfbar) | Nachweis |
|---|---|---|
| Abnahmekriterium aus §2 | | |
| Prüfroutine `agents.md` §6 | | |
| Keine unbeabsichtigte Scope-Erweiterung | | |

## 10. Abschluss

- Freigabe durch: · Datum:
- Commit/Deployment: `<Hash>` · Live-Prüfung am:
- SDD nachgeführt: `project_plan.md` (Ist), Komponentenkarte, `build_plan.md` (Status)
