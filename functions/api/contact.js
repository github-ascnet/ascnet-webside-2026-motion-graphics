// --- Cloudflare Pages Function: POST /api/contact ---
// Nimmt das Kontaktformular entgegen, prüft Eingaben und Turnstile-Token und
// versendet die Mail serverseitig über die EmailJS-REST-API. Schlüssel und IDs
// kommen ausschliesslich aus den Secrets des Pages-Projekts (env), nie aus dem
// Browser. Anleitung: docs/cloudflare-pages-kontaktformular.md

const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";
const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SUBJECT = "Kontaktanfrage über ascnet.ch";
const REQUIRED_ENV = [
  "EMAILJS_PUBLIC_KEY",
  "EMAILJS_PRIVATE_KEY",
  "EMAILJS_SERVICE_ID",
  "EMAILJS_TEMPLATE_ID",
  "TURNSTILE_SECRET_KEY",
];
const LIMITS = { name: 100, email: 150, message: 512 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (status, body) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

// Turnstile-Token bei Cloudflare prüfen
async function verifyTurnstile(token, secret, ip) {
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  try {
    const res = await fetch(TURNSTILE_URL, { method: "POST", body });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("Turnstile nicht erreichbar:", err);
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  const missing = REQUIRED_ENV.filter((k) => !env[k]);
  if (missing.length) {
    console.error("Fehlende Secrets:", missing.join(", "));
    return json(500, { ok: false, error: "config" });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: "invalid" });
  }
  const field = (k) => String(form.get(k) ?? "").trim();
  const name = field("name");
  const email = field("email");
  const message = field("message");

  // Honeypot: Bots füllen das unsichtbare Feld aus; still "erfolgreich" antworten
  if (field("website")) return json(200, { ok: true });

  if (
    !name || !email || !message ||
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message ||
    !EMAIL_RE.test(email)
  ) {
    return json(400, { ok: false, error: "invalid" });
  }

  const ip = request.headers.get("CF-Connecting-IP");
  const human = await verifyTurnstile(field("cf-turnstile-response"), env.TURNSTILE_SECRET_KEY, ip);
  if (!human) return json(403, { ok: false, error: "turnstile" });

  const time = new Date().toLocaleString("de-CH", {
    timeZone: "Europe/Zurich",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Variablen passend zur EmailJS-Standardvorlage ({{name}}, {{email}}, {{title}} …)
  const res = await fetch(EMAILJS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: env.EMAILJS_TEMPLATE_ID,
      user_id: env.EMAILJS_PUBLIC_KEY,
      accessToken: env.EMAILJS_PRIVATE_KEY,
      template_params: {
        name,
        email,
        message,
        title: SUBJECT,
        time,
        from_name: name,
        reply_to: email,
      },
    }),
  });

  if (!res.ok) {
    console.error("EmailJS Fehler:", res.status, await res.text());
    return json(502, { ok: false, error: "send" });
  }
  return json(200, { ok: true });
}

// Alle anderen Methoden ablehnen
export function onRequest() {
  return json(405, { ok: false, error: "method" });
}
