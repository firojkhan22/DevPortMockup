// src/screens/projects/ProjectsMapView.jsx
// Provides (global): ProjectsMapView
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function ProjectsMapView({ rows, onOpenProject }) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const tileLayerRef = useRef(null);
  const [mapStyle, setMapStyle] = useState("street");

  // Keep a live ref to the latest onOpenProject so the raw-DOM popup
  // button (built once per marker, outside React's render cycle) can
  // always call the current handler.
  const onOpenProjectRef = useRef(onOpenProject);
  useEffect(() => {
    onOpenProjectRef.current = onOpenProject;
  }, [onOpenProject]);

  // Create the map + markers once, and whenever the filtered rows change.
  useEffect(() => {
    if (!mapElRef.current || typeof L === "undefined") return;
    const plottable = rows.filter(
      (r) => typeof r.lat === "number" && typeof r.lng === "number"
    );
    if (!mapRef.current) {
      mapRef.current = L.map(mapElRef.current, {
        // Mouse-wheel zoom in/out, as requested.
        scrollWheelZoom: true,
      });
    }
    const map = mapRef.current;

    // Clear previous markers before redrawing (filters can change rows)
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const navyPin = L.divIcon({
      className: "",
      html:
        '<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;' +
        "background:var(--navy);border:2px solid #fff;transform:rotate(-45deg);" +
        'box-shadow:0 2px 6px rgba(0,0,0,.35);"></div>',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
    });

    plottable.forEach((r) => {
      const marker = L.marker([r.lat, r.lng], { icon: navyPin }).addTo(map);

      // Hover bubble with project name, location, and key figures —
      // plus a "View project" button. Built as raw HTML since Leaflet
      // popups render outside the React tree.
      const popupHtml =
        '<div class="map-pin-popup-body">' +
        '<div class="map-pin-popup-title">' +
        escapeMapHtml(r.n) +
        "</div>" +
        '<div class="map-pin-popup-loc">' +
        escapeMapHtml(r.loc) +
        "</div>" +
        '<div class="map-pin-popup-stats">' +
        "Total units: " + escapeMapHtml(r.units) + "<br/>" +
        "Total loans: " + escapeMapHtml(r.totalLoans) + "<br/>" +
        "Loan amount: " + escapeMapHtml(r.loanAmount) + "<br/>" +
        "Disbursed: " + escapeMapHtml(r.disbAmount) + "<br/>" +
        "Approval counts: " + escapeMapHtml(r.approvalCount) +
        "</div>" +
        '<button type="button" class="btn btn-navy btn-sm w-100 mt-2 map-pin-popup-btn">View project →</button>' +
        "</div>";

      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoClose: false,
        className: "map-pin-popup",
        maxWidth: 230,
      });

      // Hover shows the bubble; a short close delay (and listeners on
      // the popup itself) lets the pointer travel down into the
      // popup to click "View project" without it disappearing first.
      let closeTimer = null;
      const cancelClose = () => {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
      };
      const scheduleClose = () => {
        cancelClose();
        closeTimer = setTimeout(() => marker.closePopup(), 220);
      };

      marker.on("mouseover", () => {
        cancelClose();
        marker.openPopup();
      });
      marker.on("mouseout", scheduleClose);
      marker.on("click", () => {
        cancelClose();
        marker.openPopup();
      });
      marker.on("popupopen", () => {
        const el = marker.getPopup() && marker.getPopup().getElement();
        if (!el) return;
        el.addEventListener("mouseenter", cancelClose);
        el.addEventListener("mouseleave", scheduleClose);
        const btn = el.querySelector(".map-pin-popup-btn");
        if (btn) {
          btn.onclick = () => {
            marker.closePopup();
            onOpenProjectRef.current && onOpenProjectRef.current(r);
          };
        }
      });

      markersRef.current.push(marker);
    });

    if (plottable.length > 0) {
      const bounds = L.latLngBounds(plottable.map((r) => [r.lat, r.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    } else {
      map.setView([19.076, 72.8777], 10); // fallback: Mumbai
    }

    setTimeout(() => map.invalidateSize(), 0);
  }, [rows]);

  // Swap the tile layer whenever the Street/Satellite/Terrain toggle
  // changes, without rebuilding the whole map or losing markers/zoom.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || typeof L === "undefined") return;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const layer = MAP_TILE_LAYERS[mapStyle] || MAP_TILE_LAYERS.street;
    tileLayerRef.current = L.tileLayer(layer.url, layer.options).addTo(map);
  }, [mapStyle]);

  return (
    <div className="kpi-card p-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <div className="small text-secondary">
          Live map — scroll to zoom, hover a pin for project details.
          Locations are approximate, city-level coordinates.
        </div>
        <div className="btn-group btn-group-sm" role="group" aria-label="Map view">
          {Object.entries(MAP_TILE_LAYERS).map(([key, layer]) => (
            <button
              key={key}
              type="button"
              className={
                "btn " +
                (mapStyle === key ? "btn-navy" : "btn-outline-navy")
              }
              onClick={() => setMapStyle(key)}
            >
              {layer.icon} {layer.label}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          height: 360,
          borderRadius: 12,
          border: "1px solid #d8dee8",
          overflow: "hidden",
        }}
      >
        <div ref={mapElRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
