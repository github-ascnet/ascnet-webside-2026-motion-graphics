const fs = require("fs");
const path = require("path");
const { Compilation, sources } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Statische Dateien, die die Seite per <script> bzw. fetch() lädt, sowie
// SEO- und Hosting-Dateien (robots.txt, sitemap.xml, Cloudflare-Pages-_headers,
// Favicon); sie werden unverändert aus src/ nach dist/ übernommen (Ordner rekursiv).
const STATIC_FILES = [
  "mapbox.js",
  "skills.js",
  "skills.json",
  "img",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "favicon.ico",
];

// Kopiert STATIC_FILES in die Build-Ausgabe; im Dev-Server mit Live-Reload
class CopyStaticPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("CopyStaticPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: "CopyStaticPlugin", stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        () => {
          const copy = (rel) => {
            const abs = path.resolve(__dirname, "src", rel);
            if (fs.statSync(abs).isDirectory()) {
              compilation.contextDependencies.add(abs);
              fs.readdirSync(abs).forEach((f) => copy(path.posix.join(rel, f)));
              return;
            }
            compilation.fileDependencies.add(abs);
            compilation.emitAsset(rel, new sources.RawSource(fs.readFileSync(abs)));
          };
          STATIC_FILES.forEach(copy);
        }
      );
    });
  }
}

// Lokale Build-Werte aus .env (nicht im Git); bereits gesetzte Umgebungsvariablen
// (z. B. bei Cloudflare Pages) haben Vorrang.
if (fs.existsSync(path.resolve(__dirname, ".env"))) {
  fs.readFileSync(path.resolve(__dirname, ".env"), "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !line.trim().startsWith("#") && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    });
}

// Mapbox-Token (öffentlicher pk.-Token) wird beim Build ins HTML geschrieben,
// damit er nicht im Quellcode steht. Ohne Wert erscheint keine Karte.
const mapboxToken = process.env.MAPBOX_TOKEN || "";
if (!mapboxToken) {
  console.warn("[build] MAPBOX_TOKEN nicht gesetzt – die Karte wird nicht angezeigt (siehe .env.example).");
}

// Turnstile Site Key (öffentlich, darf im HTML stehen). Beim Build über die
// Umgebungsvariable TURNSTILE_SITE_KEY setzen, siehe docs/. Ohne Angabe gilt
// Cloudflares Test-Key: lokal funktioniert alles, live lehnt die Function ab.
const TURNSTILE_TEST_KEY = "1x00000000000000000000AA";
const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY || TURNSTILE_TEST_KEY;
if (turnstileSiteKey === TURNSTILE_TEST_KEY) {
  console.warn("[build] TURNSTILE_SITE_KEY nicht gesetzt – Turnstile-Test-Key wird verwendet (nur für lokale Tests).");
}

// Rechtsseiten und Fehlerseite: eigener, schlanker Einstieg ohne Animation.
// 404.html liefert Cloudflare Pages für unbekannte Pfade mit Status 404 aus.
const legalPages = ["impressum", "datenschutz", "404"].map(
  (name) =>
    new HtmlWebpackPlugin({
      template: `./src/${name}.html`,
      filename: `${name}.html`,
      chunks: ["legal"],
    })
);

module.exports = {
  entry: {
    main: "./src/main.js",
    legal: "./src/legal.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    // absolute Skriptpfade, damit auch die 404-Seite unter /a/b/c ihre Dateien findet
    publicPath: "/",
    // dist/ bei jedem Build komplett neu aufbauen: nur, was src/ erzeugt
    clean: true,
  },
  devServer: {
    static: "./dist",
    hot: true,
    watchFiles: ["src/**/*.html", "src/**/*.css", "src/**/*.js"],
    liveReload: true,
    // Kontaktformular: /api an die lokale Pages Function (npm run dev:api) weiterreichen
    proxy: [{ context: ["/api"], target: "http://127.0.0.1:8788" }],
    // Clean URLs wie bei Cloudflare Pages (/impressum statt /impressum.html)
    historyApiFallback: {
      rewrites: [
        { from: /^\/impressum\/?$/, to: "/impressum.html" },
        { from: /^\/datenschutz\/?$/, to: "/datenschutz.html" },
        // alle übrigen unbekannten Seiten (nicht "/") wie live auf die Fehlerseite
        { from: /^\/.+/, to: "/404.html" },
      ],
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["main"],
      templateParameters: { turnstileSiteKey, mapboxToken },
    }),
    ...legalPages,
    new CopyStaticPlugin(),
  ],
  // Modus kommt aus den npm-Skripten: build = production, dev = development
};
