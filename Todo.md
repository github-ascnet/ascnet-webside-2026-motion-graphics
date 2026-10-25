# Todo

Offene Aufgaben, die nicht in der Spezifikation (`docs/sdd/`) stehen, weil sie nicht beauftragt oder zurückgestellt sind. Vor der Umsetzung als Änderung nach `docs/sdd/templates/change.md` anlegen (nächste freie Nummer: CHG-004).

---

## 1. Leistungsfeld «AI-gestützte Entwicklung (SDD)» als fünfte Leistungskarte

**Stand:** umgesetzt, getestet und am 17.10.2026 wieder entfernt (Entscheid der Projektleitung). Nichts davon ist committet. Die Bausteine unten sind fertig formuliert.

### Warum und wie positioniert

- Seit August 2023 AI-gestützte Entwicklung (GitHub Copilot, später Codex und Claude), heute ausschliesslich spezifikationsgetrieben (SDD).
- Beleg ist die Website selbst: `docs/sdd/` mit REQ, DEC, BP, CHG und Prüfskripten.
- Positionierung: nicht «ich nutze AI», sondern «Spezifikation vorne, AI unterstützt, ich verantworte Architektur, Review und Sicherheit».
- Kein eigener Stundensatz im Kalkulator (Preislogik DEC-008 und REQ-030 bleiben unverändert).

### Vor der Umsetzung klären

1. **Level (1–5) bestätigen.** Vorschlag: SDD 5, Implementierung 5, Analyse 4, Assessments/Migration 4, Qualitätssicherung 5, Werkzeuge 4.
2. **Datenschutz-Zusage freigeben.** «Kundendaten nur mit Zustimmung in AI-Werkzeuge» bindet ASCNET gegenüber Kunden und muss der Praxis entsprechen. Ohne Zusage: Satz auf der Karte und AGB-Absatz weglassen.
3. **Intro-Protokoll:** bleibt bei vier Feldern. Ein fünfter Eintrag würde erst nach dem Ausblenden des Protokolls (2,85 s) erscheinen (`src/intro.js`, `src/main.css` `.intro-log`).

### Bausteine

**a) `src/skills.json`:** neuer Bereich `ai`; im Bereich `bi` den letzten Eintrag «Data Analytics & AI» in «Data Analytics & Machine Learning» umbenennen (sonst widerspricht er dem neuen Bereich).

```json
"ai": {
  "title": "Expertenprofil",
  "subtitle": "AI-gestützte Entwicklung · Spezifikationsgetriebene Entwicklung (SDD) · Analyse, Migration, Qualitätssicherung",
  "items": [
    { "name": "Specification-Driven Development (SDD)", "level": 5, "notes": "Anforderungen und Spezifikation steuern die Arbeit, Entscheidungen und Änderungen werden nachvollziehbar dokumentiert" },
    { "name": "AI-gestützte Implementierung & Refactoring", "level": 5, "notes": ".NET/C#, React/Next.js, PowerShell, unter fachlicher Leitung und Review" },
    { "name": "Code-Analyse & Review mit AI", "level": 4, "notes": "Analyse bestehender Anwendungen, Refactoring-Vorschläge, Prüfung der Ergebnisse" },
    { "name": "Technische Assessments & Migrationen", "level": 4, "notes": "AI-Unterstützung bei Bestandsaufnahme, Planung und Durchführung nach demselben spezifikationsgeführten Vorgehen" },
    { "name": "Verantwortung & Qualitätssicherung", "level": 5, "notes": "Architektur, technische Entscheide, Bewertung der Ergebnisse, Sicherheit und Datenschutz bleiben bei ASCNET" },
    { "name": "Werkzeuge", "level": 4, "notes": "GitHub Copilot (seit 2023), Codex, Claude" }
  ]
}
```

**b) `src/index.html`, Abschnitt `#leistungen`:**

- Titel «Vier Felder ein // Partner» → «Fünf Felder ein // Partner».
- Zähler in den bestehenden Karten `[ 001/004 ]` … `[ 004/004 ]` → `/005`. Nicht ändern: die Zähler im Intro-Protokoll (Zeilen mit `<b>Collaboration</b>` usw.).
- Fünfte Karte nach der BI-Karte einfügen. Über die volle Breite, damit das Vierer-Raster nicht bricht (`md:col-span-2 lg:col-span-4`):

```html
<article class="frame service-card tilt-card md:col-span-2 lg:col-span-4" data-reveal style="--reveal-delay:0.32s">
    <div class="service-top"><span>[ 005/005 ]</span><i aria-hidden="true">↗</i></div>
    <h3>AI-gestützte Entwicklung</h3>
    <p>Wir entwickeln und prüfen Software spezifikationsgetrieben (Specification-Driven Development): Anforderungen und Spezifikation führen die Arbeit, AI unterstützt bei Analyse, Umsetzung, Assessments und Migrationen – mit .NET (C#), React/Next.js und PowerShell. Architektur, Entscheide, Review und Sicherheit verantworten wir selbst. Kundendaten gelangen nur mit Ihrer Zustimmung in AI-Werkzeuge.</p>
    <button class="skill-btn link-line" data-area="ai">( Details )</button>
</article>
```

- JSON-LD (`@graph`) um einen fünften `Service` ergänzen, Kommentar «die vier Leistungen» → «fünf»:

```json
{
  "@type": "Service",
  "name": "AI-gestützte Entwicklung",
  "serviceType": "Spezifikationsgetriebene Softwareentwicklung mit AI-Unterstützung",
  "description": "Specification-Driven Development mit AI-Unterstützung für Analyse, Umsetzung, Assessments und Migrationen mit .NET (C#), React/Next.js und PowerShell, unter fachlicher Leitung und Review.",
  "provider": { "@id": "https://ascnet.ch/#organization" },
  "areaServed": "CH",
  "url": "https://ascnet.ch/#leistungen"
}
```

**c) `src/agb.html` (nur bei freigegebener Datenschutz-Zusage; juristisch mitprüfen lassen, OP-014):**

- Ziffer 3 «Leistungen und Mitwirkung», neuer Absatz nach «ASCNET darf Hilfspersonen …»:
  «ASCNET darf bei Analyse, Entwicklung und Dokumentation AI-gestützte Werkzeuge einsetzen. Die Ergebnisse werden von ASCNET fachlich geprüft; ASCNET bleibt für die vertragsgemässe Leistung verantwortlich. Daten, Quellcode und Unterlagen der Kundin bzw. des Kunden gibt ASCNET nur mit deren Zustimmung in solche Werkzeuge ein, die von Dritten betrieben werden.»
- Ziffer 10 «Vertraulichkeit und Datenschutz», im ersten Absatz nach «Die Pflicht gilt über das Vertragsende hinaus.» ergänzen:
  «Dies gilt auch für Informationen, die mit AI-gestützten Werkzeugen (Ziffer 3) verarbeitet werden.»
- Fassung im Seitenkopf nachführen («Oktober 2026 (Rev. 2)») und `lastmod` in `src/sitemap.xml` für `/` und `/agb`.

**d) Tests (`scripts/`):**

- `test-http.mjs`, JSON-LD-Test: «4 Services» → «5 Services» und im Typen-Array ein fünftes `"Service"`.
- `test-browser.mjs`, Test «Navigation …»: nach dem Schliessen des Identity-Fensters `.skill-btn[data-area="ai"]` klicken und 6 Einträge in `#skill-list > div` erwarten.

**e) SDD nachführen (CHG-004, nächste freie Nummern: DEC-027, BP-018, OP-016):**

- `project_plan.md`: Einleitung (fünf Leistungsfelder), REQ-023 (fünf Karten), REQ-024 (AI 6 Einträge), Stand, offener Punkt für Level und Datenschutz-Zusage.
- `decisions.md`: DEC-016 ergänzen (Quelle LinkedIn-Profil, BI-Eintrag umbenannt); neue DEC «AI-Methode als fünftes Leistungsfeld, nicht im Kalkulator, Intro unverändert».
- `build_plan.md`: neues BP; `changes/CHG-004-…md` nach Vorlage; DEC-Index-Tabelle ergänzen.

### Prüfung nach der Umsetzung

`npm run build`, `npm run dev:api`, `npm test`, `npm run test:browser`; Sichtprüfung der fünften Karte bei 1440, 800 und 390 px (Karte 5 volle Breite, kein Überlauf); `npm run lighthouse` (SEO 100 halten). Im früheren Versuch: `npm test` 10 bestanden und 3 übersprungen, `npm run test:browser` 5 von 5, Referenzfall CHF 182'148 unverändert.

### Hinweis zum Text

Der Kartentext nutzt nur Begriffe aus dem LinkedIn-Profil (DEC-016: keine unbelegten Leistungsversprechen). Keine Werkzeug-Logos (Markenrechte) und keine Aussagen wie «schneller und günstiger».

---

## 2. AGB (`/agb`) juristisch prüfen lassen (OP-014)

- Eckwerte sind Annahmen: Haftungsgrenze CHF 100'000, Gewährleistung 12 Monate, Verzugszins 5 %, Zahlungsfrist 30 Tage, Abnahme nach 10 Arbeitstagen, Gerichtsstand Zug.
- Link in Ziffer 14 (DVS-AGB, Ausgabe März 2025) zeigt auf die Kopie des Kantons Solothurn. Durch die offizielle DVS-Quelle ersetzen.
- Erst danach in Offerten verweisen: «Es gelten die AGB der ASCNET Solutions GmbH, Fassung Oktober 2026, unter ascnet.ch/agb».
