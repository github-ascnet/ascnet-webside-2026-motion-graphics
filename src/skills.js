let SKILLS = {};

async function loadSkills() {
  try {
    const res = await fetch("skills.json");
    SKILLS = await res.json();
  } catch (err) {
    console.error("Fehler beim Laden von skills.json:", err);
  }
}

function levelBar(lvl) {
  const max = 5,
    pct = (Math.max(1, Math.min(lvl, max)) / max) * 100;
  return `
    <div class="mt-2 h-2 rounded bg-zinc-700/70">
      <div class="h-full rounded bg-gradient-to-r from-amber-400 to-amber-300" style="width:${pct}%"></div>
    </div>`;
}

function levelMeter(lvl) {
  const max = 5;
  const clamped = Math.max(1, Math.min(lvl, max));
  const pct = (clamped / max) * 100;

  return `
    <div class="mt-3 relative">

      <!-- Overlay-Badge: links, mit Abstand -->
      <span class="absolute -top-4 left-0
                   rounded-md bg-amber-400/25 border border-amber-300/40
                   px-2 py-0.5 text-[11px] leading-none text-amber-200 font-medium shadow-sm mt-2">
        Level ${clamped}
      </span>
    </div>`;
}

function renderList(area) {
  const cfg = SKILLS[area];
  if (!cfg) return;

  document.getElementById("skill-title").textContent = cfg.title;
  document.getElementById("skill-sub").textContent = cfg.subtitle ?? "";

  document.getElementById("skill-list").innerHTML = cfg.items
    .map(
      (x) => `
    <div class="rounded-xl border border-white/10 bg-zinc-800/60 p-4 hover:border-amber-400/40">
      <div class="font-medium">${x.name}</div>
      ${
        x.notes
          ? `<div class="mt-1 text-sm text-zinc-300">${x.notes}</div>`
          : ""
      }
      ${levelMeter(x.level)}
    </div>
  `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadSkills();

  const modal = document.getElementById("skill-modal");
  const openers = document.querySelectorAll(".skill-btn");
  const closers = modal.querySelectorAll("[data-close-modal]");
  let lastFocus = null;

  openers.forEach((btn) => {
    btn.addEventListener("click", () => {
      lastFocus = document.activeElement;
      renderList(btn.dataset.area);
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      modal.querySelector("button[data-close-modal]").focus();
    });
  });

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    if (lastFocus) lastFocus.focus();
  }
  closers.forEach((el) => el.addEventListener("click", closeModal));
  modal.addEventListener("click", (e) => {
    if (e.target.dataset.closeModal !== undefined) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });
});
