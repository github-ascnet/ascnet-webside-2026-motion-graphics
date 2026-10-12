// --- Kontaktformular: Versand über die eigene Pages Function /api/contact ---
// Der Browser schickt nur die Formulardaten und das Turnstile-Token. Die
// EmailJS-Schlüssel liegen als Secrets bei Cloudflare Pages und werden in
// functions/api/contact.js verwendet. Anleitung: docs/cloudflare-pages-kontaktformular.md

const ENDPOINT = "/api/contact";
const FALLBACK_MAIL = "ascnet-web@ascnet.ch";

// ===== Toast =====
function showToast({ type = "success", title = "", message = "", timeout = 4000 }) {
  const root = document.getElementById("toast-root");
  if (!root) return;

  const isSuccess = type === "success";
  const bg = isSuccess ? "bg-emerald-600" : "bg-rose-600";
  const ring = isSuccess ? "ring-emerald-400/40" : "ring-rose-400/40";
  const icon = isSuccess
    ? `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const el = document.createElement("div");
  el.className = `pointer-events-auto mx-3 min-w-[300px] max-w-[560px] rounded-xl ${bg} text-white shadow-2xl ring-1 ${ring}
                  backdrop-blur-sm transition-all duration-300 data-[hide=true]:opacity-0 data-[hide=true]:translate-y-3`;
  el.setAttribute("role", isSuccess ? "status" : "alert");
  el.innerHTML = `
    <div class="flex items-start gap-3 p-4">
      <div class="mt-0.5">${icon}</div>
      <div class="flex-1">
        <div class="text-sm font-semibold"></div>
        <div class="text-sm/6 opacity-90"></div>
      </div>
      <button type="button" class="ml-2 rounded-md bg-white/15 px-2 py-1 text-xs hover:bg-white/25">Schliessen</button>
    </div>
    <div class="h-1 w-full bg-white/15 overflow-hidden rounded-b-xl">
      <div class="toast-bar h-full bg-white/70 origin-left"></div>
    </div>
  `;
  // Texte per textContent, nie als HTML
  el.querySelector(".font-semibold").textContent = title;
  el.querySelector(".opacity-90").textContent = message;
  el.style.setProperty("--t", `${timeout}ms`);
  root.appendChild(el);

  const close = () => {
    el.dataset.hide = "true";
    setTimeout(() => el.remove(), 300);
  };
  el.querySelector("button").addEventListener("click", close);
  setTimeout(close, timeout);
}

// ===== Blockier-Overlay während des Versands =====
function showBlocker() {
  let blocker = document.getElementById("form-blocker");
  if (!blocker) {
    blocker = document.createElement("div");
    blocker.id = "form-blocker";
    blocker.className = "fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center transition-opacity duration-200";
    blocker.innerHTML = `
      <div class="bg-[#2d2b2b] rounded-xl px-6 py-4 text-white text-lg shadow-2xl flex items-center gap-3">
        <svg class="animate-spin h-6 w-6 text-yellow-300" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Bitte warten...
      </div>
    `;
    document.body.appendChild(blocker);
  }
  blocker.style.opacity = "1";
}

function hideBlocker() {
  const blocker = document.getElementById("form-blocker");
  if (!blocker) return;
  blocker.style.opacity = "0";
  setTimeout(() => blocker.remove(), 300);
}

// ===== Fehlertexte nach Antwort der Function =====
function errorMessage(status, code) {
  if (status === 0) return "Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung.";
  if (status === 429) return "Bitte warten Sie einen Moment, bevor Sie erneut senden.";
  if (code === "turnstile") return "Die Sicherheitsprüfung ist fehlgeschlagen. Bitte versuchen Sie es erneut.";
  if (code === "invalid") return "Bitte prüfen Sie Name, E-Mail-Adresse und Nachricht.";
  return `Bitte versuchen Sie es erneut oder schreiben Sie an ${FALLBACK_MAIL}.`;
}

// ===== Cloudflare Turnstile =====
// Das Skript lädt asynchron; gerendert wird, sobald es bereitsteht.
function initTurnstile(form) {
  const slot = document.getElementById("turnstileSlot");
  const sitekey = form.dataset.turnstileSitekey;
  let widgetId = null;
  if (!slot || !sitekey) return { reset() {} };

  const render = () => {
    if (widgetId !== null || !window.turnstile) return;
    widgetId = window.turnstile.render(slot, {
      sitekey,
      theme: "dark",
      language: "de",
      size: "flexible",
      appearance: "interaction-only",
      action: "contact",
      // Token läuft nach einigen Minuten ab: dann neu anfordern
      "expired-callback": () => window.turnstile.reset(widgetId),
    });
  };
  if (window.turnstile) render();
  else {
    const t = setInterval(() => {
      if (window.turnstile) {
        clearInterval(t);
        render();
      }
    }, 200);
    setTimeout(() => clearInterval(t), 20000);
  }
  return {
    reset() {
      if (widgetId !== null) window.turnstile.reset(widgetId);
    },
  };
}

export function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const turnstile = initTurnstile(form);
  const submitBtn = form.querySelector('[type="submit"]');
  let sending = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!form.reportValidity()) return;

    sending = true;
    if (submitBtn) submitBtn.disabled = true;
    showBlocker();

    let status = 0;
    let code = "";
    try {
      const res = await fetch(form.action || ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      status = res.status;
      const data = await res.json().catch(() => ({}));
      code = data.error || "";
      if (!res.ok || !data.ok) throw new Error(`HTTP ${status} ${code}`);

      form.reset();
      showToast({
        type: "success",
        title: "Danke! Nachricht gesendet.",
        message: "Wir melden uns schnellstmöglich.",
        timeout: 4200,
      });
    } catch (err) {
      console.error("Kontaktformular:", err);
      showToast({
        type: "error",
        title: "Senden fehlgeschlagen.",
        message: errorMessage(status, code),
        timeout: 6000,
      });
    } finally {
      // Ein Turnstile-Token gilt nur einmal: für den nächsten Versand neu holen
      turnstile.reset();
      hideBlocker();
      sending = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
