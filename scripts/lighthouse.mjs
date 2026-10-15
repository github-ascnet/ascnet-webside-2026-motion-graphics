// Lighthouse-Messung der drei Seiten (Mobile-Profil, Standard-Drosselung).
//
//   Terminal 1:  npm run build && npm run dev:api
//   Terminal 2:  npm run lighthouse
//
// Optional: BASE_URL=https://ascnet.ch npm run lighthouse
// Braucht Chrome (CHROME_PATH, sonst Windows-Standardpfad). Lighthouse wird per npx in
// fester Version geladen und nicht ins Projekt installiert.
// Exit-Code 1, wenn der SEO-Wert einer Seite unter 100 liegt (docs/sdd/project_plan.md, REQ-063).

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = (process.env.BASE_URL || "http://127.0.0.1:8788").replace(/\/$/, "");
const VERSION = "13.5.0";
const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const dir = mkdtempSync(join(tmpdir(), "ascnet-lh-"));
let failed = false;

for (const path of ["/", "/impressum", "/datenschutz"]) {
  const out = join(dir, "report.json");
  const res = spawnSync(
    "npx",
    [
      "--yes",
      `lighthouse@${VERSION}`,
      BASE + path,
      "--quiet",
      "--output=json",
      `--output-path=${out}`,
      "--only-categories=performance,seo,best-practices,accessibility",
      "--chrome-flags=--headless=new --use-angle=swiftshader --enable-unsafe-swiftshader",
    ],
    { shell: true, env: { ...process.env, CHROME_PATH: CHROME }, stdio: ["ignore", "ignore", "inherit"] }
  );
  if (res.status !== 0) {
    console.error(`${path}: Lighthouse fehlgeschlagen`);
    failed = true;
    continue;
  }
  const r = JSON.parse(readFileSync(out, "utf8"));
  const score = (k) => Math.round(r.categories[k].score * 100);
  const a = r.audits;
  console.log(
    `${path.padEnd(14)} Performance ${score("performance")} | SEO ${score("seo")} | Best Practices ${score("best-practices")} | ` +
      `Accessibility ${score("accessibility")} | LCP ${a["largest-contentful-paint"].displayValue} | ` +
      `CLS ${a["cumulative-layout-shift"].displayValue} | TBT ${a["total-blocking-time"].displayValue}`
  );
  if (score("seo") < 100) failed = true;
}

rmSync(dir, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
