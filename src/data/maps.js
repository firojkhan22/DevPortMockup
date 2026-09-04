// src/data/maps.js
// Provides (global): MAP_TILE_LAYERS, escapeMapHtml
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 5. ALL PROJECTS + COMPLETE PROJECT LEAD ================= */
// BRD: "View all projects on map" — pins show project name, total
// units, total loans, and total HDFC business (loan + disbursed),
// clicking a pin opens the project detail page. No real map-tile
// provider is wired into this prototype, so pins sit on a plain
// illustrative panel rather than an actual map.
// Small SVG pin marker — used instead of an emoji glyph, since emoji
// pin rendering is inconsistent across OS/fonts (shows as a plain
// dot on some systems).
// Real interactive map — Leaflet with a Street / Satellite / Terrain
// toggle, plotted using each project's actual lat/lng (see
// BUILDER_PROJECT_DETAILS). All three tile providers are free,
// no API key required. Replaces the earlier schematic placeholder.
const MAP_TILE_LAYERS = {
  street: {
    label: "Street",
    icon: "🗺️",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: { maxZoom: 19, attribution: "© OpenStreetMap contributors" },
  },
  satellite: {
    label: "Satellite",
    icon: "🛰️",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: {
      maxZoom: 19,
      attribution:
        "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics",
    },
  },
  terrain: {
    label: "Terrain",
    icon: "⛰️",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    options: {
      maxZoom: 17,
      attribution:
        "© OpenStreetMap contributors, SRTM — Style: © OpenTopoMap (CC-BY-SA)",
    },
  },
};

function escapeMapHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}
