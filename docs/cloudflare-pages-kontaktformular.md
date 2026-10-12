# Kontaktformular auf Cloudflare Pages einrichten

Diese Anleitung beschreibt, was in **EmailJS** und **Cloudflare** einzurichten ist, damit das Kontaktformular live funktioniert. Die EmailJS-Schlüssel stehen dabei nirgends im Browser-Code.

Stand: Oktober 2026 · Cloudflare Pages (Free Plan) · Wrangler 4.142.0

---

## 1. Wie es funktioniert

```
Browser ──POST /api/contact──▶ Pages Function ──REST + Private Key──▶ EmailJS ──▶ Outlook
   │                           functions/api/contact.js
   └── Turnstile (unsichtbarer Bot-Schutz) liefert ein Token mit
```

| Datei | Aufgabe |
|---|---|
| `src/contact.js` | Schickt die Formulardaten und das Turnstile-Token an `/api/contact`. Enthält **keine** Schlüssel. |
| `functions/api/contact.js` | Pages Function: prüft Eingaben, Fangfeld (Honeypot) und Turnstile, ruft dann EmailJS serverseitig auf. |
| `webpack.config.js` | Setzt beim Build den öffentlichen Turnstile Site Key ins HTML (`TURNSTILE_SITE_KEY`). |
| `.dev.vars.example` | Vorlage für die lokalen Secrets. |

Antworten der Function (für die Fehlersuche):

| HTTP | `error` | Bedeutung |
|---|---|---|
| 200 | – | Mail versendet |
| 400 | `invalid` | Pflichtfeld fehlt, E-Mail ungültig oder Text zu lang |
| 403 | `turnstile` | Turnstile-Prüfung fehlgeschlagen oder Token fehlt |
| 405 | `method` | Kein POST |
| 500 | `config` | Ein Secret fehlt (Name steht im Function-Log) |
| 502 | `send` | EmailJS hat abgelehnt (Grund steht im Function-Log) |

---

## 2. Benötigte Werte im Überblick

| Name | Typ in Cloudflare | Woher | Hinweis |
|---|---|---|---|
| `EMAILJS_PUBLIC_KEY` | Secret | EmailJS → Account → **General** → Public Key | |
| `EMAILJS_PRIVATE_KEY` | Secret | EmailJS → Account → **Security** → Private Key | Niemals weitergeben |
| `EMAILJS_SERVICE_ID` | Secret | EmailJS → Email Services | aktuell `service_z6esdss` |
| `EMAILJS_TEMPLATE_ID` | Secret | EmailJS → Email Templates | aktuell `template_9wp4pj5` |
| `TURNSTILE_SECRET_KEY` | Secret | Cloudflare → Turnstile → Widget | Niemals weitergeben |
| `TURNSTILE_SITE_KEY` | **Text** (Variable) | Cloudflare → Turnstile → Widget | Öffentlich, wird beim **Build** gebraucht |
| `MAPBOX_TOKEN` | **Text** (Variable) | Mapbox → Access tokens | Öffentlicher `pk.`-Token für die Karte, beim **Build** nötig. Im Mapbox-Konto auf ascnet.ch beschränken. Fehlt er, erscheint keine Karte |

> **Reihenfolge beachten:** Den Schalter „Use Private Key“ in EmailJS erst **nach** dem erfolgreichen Live-Test aktivieren (Schritt 7). Sonst funktioniert das bisherige Formular nicht mehr, bevor das neue live ist.

---

## 3. EmailJS vorbereiten

1. Auf [dashboard.emailjs.com](https://dashboard.emailjs.com) anmelden.
2. **Account → General:** Public Key notieren.
3. **Account → Security:**
   - Private Key notieren. Falls keiner angezeigt wird, einen erzeugen.
   - **„Allow EmailJS API for non-browser applications“ aktivieren.** Ohne diesen Schalter lehnt EmailJS Aufrufe der Pages Function ab.
   - „Use Private Key“ vorerst **noch nicht** aktivieren (siehe Schritt 7).
   - Falls eine Domain-Beschränkung (Allowed origins) aktiv ist: Sie gilt nur für Browser-Aufrufe und spielt für die Function keine Rolle.
4. **Email Templates → My Default Template:** Prüfen, dass die Vorlage diese Variablen nutzt (alle werden von der Function befüllt):
   `{{name}}`, `{{email}}`, `{{message}}`, `{{title}}`, `{{time}}`, `{{from_name}}`, `{{reply_to}}`.
   Empfehlung: Im Feld **Reply To** der Vorlage `{{reply_to}}` eintragen, damit „Antworten“ in Outlook direkt an die anfragende Person geht.

---

## 4. Turnstile-Widget anlegen

1. Im [Cloudflare-Dashboard](https://dash.cloudflare.com) links **Turnstile** öffnen → **Add widget**.
2. Einstellungen:
   - **Widget name:** `ascnet.ch Kontaktformular`
   - **Hostnames:** `ascnet.ch`, `www.ascnet.ch` und die Pages-Adresse `<projektname>.pages.dev` (für Tests auf der Vorschau-URL)
   - **Widget mode:** `Managed` (zeigt nur bei Verdacht eine kurze Bestätigung)
   - Pre-clearance: `No`
3. **Create** → **Site Key** und **Secret Key** notieren.

---

## 5. Variablen und Secrets im Pages-Projekt hinterlegen

1. Cloudflare-Dashboard → **Workers & Pages** → Pages-Projekt öffnen → **Settings** → **Variables and Secrets**.
2. Für die Umgebung **Production** über **Add** anlegen:

   | Variable name | Type | Value |
   |---|---|---|
   | `EMAILJS_PUBLIC_KEY` | Secret | Public Key aus Schritt 3 |
   | `EMAILJS_PRIVATE_KEY` | Secret | Private Key aus Schritt 3 |
   | `EMAILJS_SERVICE_ID` | Secret | `service_z6esdss` |
   | `EMAILJS_TEMPLATE_ID` | Secret | `template_9wp4pj5` |
   | `TURNSTILE_SECRET_KEY` | Secret | Secret Key aus Schritt 4 |
   | `TURNSTILE_SITE_KEY` | **Text** | Site Key aus Schritt 4 |
   | `MAPBOX_TOKEN` | **Text** | Öffentlicher Mapbox-Token (`pk.…`) aus dem Mapbox-Konto |

3. Dasselbe für **Preview** wiederholen, falls Vorschau-Deployments ebenfalls Mails senden sollen.
4. **Save.** Die Werte gelten erst ab dem **nächsten Deployment**.

Alternativ per Kommandozeile (fragt den Wert ab, er erscheint nicht im Verlauf):

```powershell
npx wrangler login
npx wrangler pages secret put EMAILJS_PRIVATE_KEY --project-name <projektname>
```

> **Hinweis zur `wrangler.jsonc`:** Die Datei enthält bewusst **kein** `pages_build_output_dir`. Damit bleibt das Dashboard massgebend für die Einstellungen. Wird dieser Eintrag ergänzt, übernimmt die Datei die Konfiguration und die Felder im Dashboard lassen sich nicht mehr bearbeiten.

---

## 6. Deployen

**Wichtig:** Drag-and-drop im Dashboard unterstützt laut Cloudflare **keine Functions**. Der Ordner `functions/` würde ignoriert, das Formular liefe ins Leere. Es braucht einen der beiden folgenden Wege. Welcher passt, steht im Projekt unter **Settings → Builds & deployments** (Git-Anbindung) bzw. fehlt dort (Direct Upload). Ein Direct-Upload-Projekt lässt sich laut Cloudflare nicht nachträglich auf Git umstellen.

### Variante A: Git-Anbindung (automatischer Build bei Cloudflare)

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** leer bzw. `/` (der Ordner `functions/` muss im Repository-Root liegen)
- `TURNSTILE_SITE_KEY` steht als Variable zur Verfügung und wird beim Build ins HTML geschrieben.

> `npm run build` erzeugt `dist/` vollständig aus `src/`, inklusive `mapbox.js`, `skills.js`, `skills.json` und `img/` (Liste `STATIC_FILES` in `webpack.config.js`). `dist/` wird dabei jedes Mal geleert. Dateien also nie von Hand in `dist/` ablegen, sondern in `src/` und bei Bedarf in `STATIC_FILES` eintragen.

### Variante B: Direct Upload per Wrangler (Build auf dem eigenen Rechner)

Im Projekt-Root ausführen, damit der Ordner `functions/` mit hochgeladen wird:

```powershell
$env:TURNSTILE_SITE_KEY = "<Site Key aus Schritt 4>"
npm run build
npx wrangler pages deploy dist --project-name <projektname>
```

Fehlt `TURNSTILE_SITE_KEY` beim Build, meldet Webpack eine Warnung und verwendet den Test-Key von Cloudflare. Live lehnt die Function dann jede Anfrage mit `403 turnstile` ab. Das ist gewollt: lieber kein Versand als ungeschützter Versand.

---

## 7. Live testen und absichern

1. Die Live-Seite öffnen, Formular ausfüllen, absenden. Erwartet: grüne Meldung „Danke! Nachricht gesendet.“ und Mail in Outlook.
2. Bei Fehlern: Pages-Projekt → **Deployments** → aktuelles Deployment → **Functions** → **Real-time Logs** starten und erneut senden. Die Function schreibt dort z. B. `Fehlende Secrets: …` oder `EmailJS Fehler: 4xx …`.
3. Funktioniert der Versand: in EmailJS unter **Account → Security** **„Use Private Key“ aktivieren**. Ab jetzt nimmt EmailJS nur noch Aufrufe mit Private Key an. Der früher im Browser-Code sichtbare Public Key ist damit für Dritte wertlos.
4. Erneut eine Testnachricht senden, um zu bestätigen, dass alles weiterhin funktioniert.

---

## 8. Optional: Rate Limiting (gratis, ohne Code)

Läuft die Domain `ascnet.ch` über Cloudflare-DNS, enthält der Free Plan eine Rate-Limiting-Regel:

1. Dashboard → Domain `ascnet.ch` → **Security** → **WAF** → **Rate limiting rules** → **Create rule**.
2. **If incoming requests match:** Field `URI Path` · Operator `equals` · Value `/api/contact`
3. **Characteristics:** IP
4. **When rate exceeds:** z. B. 3 Requests pro 10 Sekunden
5. **Then:** Block für 10 Sekunden (im Free Plan die einzige Dauer)
6. **Deploy.**

Das Formular zeigt bei einer Sperre (HTTP 429) automatisch „Bitte warten Sie einen Moment, bevor Sie erneut senden.“

---

## 9. Lokal entwickeln und testen

1. Einmalig: `.dev.vars.example` nach `.dev.vars` kopieren und die EmailJS-Werte eintragen. `.dev.vars` ist per `.gitignore` vom Git ausgeschlossen.
   Für Turnstile ist dort bereits Cloudflares **Test-Secret** eingetragen, das jede Prüfung bestehen lässt.
2. Zwei Terminals:

   ```powershell
   # Terminal 1: Seite bauen und Pages Function lokal starten (Port 8788)
   npm run build
   npm run dev:api

   # Terminal 2: Entwicklungsserver mit Live-Reload (Port 8080)
   npm run dev
   ```

3. Auf <http://localhost:8080> arbeiten. Der Entwicklungsserver leitet `/api/*` an die lokale Function weiter.

> Mit echten Werten in `.dev.vars` verschickt auch der lokale Test **echte Mails**.

---

## 10. Checkliste

- [ ] EmailJS: „Allow EmailJS API for non-browser applications“ aktiv
- [ ] EmailJS-Vorlage nutzt die Variablen aus Schritt 3, Reply To = `{{reply_to}}`
- [ ] Turnstile-Widget angelegt, Hostnames eingetragen
- [ ] 5 Secrets + `TURNSTILE_SITE_KEY` (Text) im Pages-Projekt hinterlegt
- [ ] Deploy über Git-Anbindung oder `wrangler pages deploy`, nicht per Drag-and-drop
- [ ] Live-Test erfolgreich
- [ ] Danach EmailJS: „Use Private Key“ aktiviert und erneut getestet
- [ ] Optional: Rate-Limiting-Regel für `/api/contact`
