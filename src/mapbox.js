// Karte im Kontaktbereich. Mapbox (Skript + Styles, zusammen mehrere hundert KB
// und viel Rechenzeit) wird erst geladen, wenn die Karte bis auf etwa eine
// Bildschirmhöhe heranrückt – nicht schon beim Seitenaufruf.
(function () {
  const MAPBOX_VERSION = "v2.15.0";
  const MAPBOX_BASE = "https://api.mapbox.com/mapbox-gl-js/" + MAPBOX_VERSION + "/mapbox-gl";
  // c/o Sarya AG, Chamerstrasse 174, 6300 Zug (OpenStreetMap)
  const longitude = 8.485225;
  const latitude = 47.181411;

  function loadMapbox() {
    return new Promise(function (resolve, reject) {
      if (window.mapboxgl) return resolve();
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = MAPBOX_BASE + ".css";
      document.head.appendChild(css);
      const js = document.createElement("script");
      js.src = MAPBOX_BASE + ".js";
      js.async = true;
      js.onload = function () { resolve(); };
      js.onerror = function () { reject(new Error("Mapbox konnte nicht geladen werden")); };
      document.head.appendChild(js);
    });
  }

  function initMap(el) {
    // Token kommt beim Build aus MAPBOX_TOKEN (webpack.config.js)
    mapboxgl.accessToken = el.dataset.mapboxToken;
    const map = new mapboxgl.Map({
      container: el,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [longitude, latitude],
      zoom: 15,
    });
    new mapboxgl.Marker({ color: "#ffc125" })
      .setLngLat([longitude, latitude])
      .addTo(map);
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
      .setLngLat([longitude, latitude])
      .setHTML(
        '<div class="text-[#2d2b2b] text-xs font-semibold">ASCNET Solutions GmbH</div>'
      )
      .addTo(map);
  }

  function start() {
    const el = document.getElementById("map");
    if (!el || !el.dataset.mapboxToken) return;
    let started = false;
    const go = function () {
      if (started) return;
      started = true;
      loadMapbox().then(function () { initMap(el); }).catch(function (err) { console.error(err); });
    };
    if (!("IntersectionObserver" in window)) return go();
    const io = new IntersectionObserver(
      function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          io.disconnect();
          go();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
