document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("map");
  if (!el || !el.dataset.mapboxToken) return;
  // Token kommt beim Build aus MAPBOX_TOKEN (webpack.config.js)
  mapboxgl.accessToken = el.dataset.mapboxToken;
  // c/o Sarya AG, Chamerstrasse 174, 6300 Zug (OpenStreetMap)
  const longitude = 8.485225;
  const latitude = 47.181411;
  const map = new mapboxgl.Map({
    container: "map",
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
});
