import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { site } from "../config.js";
import { placeOf } from "../lib/geo.js";

// A map with a pin per business. Loaded on demand (React.lazy) so Leaflet stays out of the main bundle.
// active: the id to highlight (the card under the pointer). onSelect(id): a pin was clicked.
// static: no dragging or zooming, for the small map on a business page.
const pin = (active) =>
  L.divIcon({
    className: `map-pin${active ? " active" : ""}`,
    html: "<span></span>",
    iconSize: active ? [34, 34] : [26, 26],
    iconAnchor: active ? [17, 17] : [13, 13],
  });

export default function BusinessMap({ businesses, active, onSelect, centre, staticMap = false, zoom = 13 }) {
  const box = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const markers = useRef({});
  const fit = useRef(() => {});

  useEffect(() => {
    map.current = L.map(box.current, {
      zoomControl: !staticMap,
      dragging: !staticMap,
      scrollWheelZoom: false,
      doubleClickZoom: !staticMap,
      touchZoom: !staticMap,
      attributionControl: true,
    });
    L.tileLayer(site.mapTiles.url, { attribution: site.mapTiles.attribution, maxZoom: 18 }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    if (!staticMap) map.current.zoomControl.setPosition("bottomleft");
    // The map can start hidden (phones, small screens): re-measure and re-fit whenever its box changes size.
    const ro = new ResizeObserver(() => {
      if (!box.current?.offsetWidth) return;
      map.current.invalidateSize();
      fit.current();
    });
    ro.observe(box.current);
    return () => {
      ro.disconnect();
      map.current.remove();
    };
  }, [staticMap]);

  useEffect(() => {
    layer.current.clearLayers();
    markers.current = {};
    const points = [];
    businesses.forEach((b) => {
      const at = placeOf(b);
      if (!at) return;
      points.push(at);
      const m = L.marker(at, { icon: pin(false), title: b.name, keyboard: !staticMap }).addTo(layer.current);
      if (!staticMap) {
        m.bindTooltip(b.name, { direction: "top", offset: [0, -14] });
        m.on("click", () => onSelect?.(b.id));
      }
      markers.current[b.id] = m;
    });
    fit.current = () => {
      if (points.length === 1 || staticMap) map.current.setView(points[0] || centre || [-19.0, 29.8], zoom);
      else if (points.length) map.current.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 14 });
      else map.current.setView(centre || [-19.0, 29.8], centre ? 12 : 6);
    };
    fit.current();
  }, [businesses, staticMap, centre, zoom, onSelect]);

  useEffect(() => {
    Object.entries(markers.current).forEach(([id, m]) => {
      m.setIcon(pin(id === active));
      m.setZIndexOffset(id === active ? 1000 : 0);
    });
  }, [active, businesses]);

  return <div className="business-map" ref={box} />;
}
