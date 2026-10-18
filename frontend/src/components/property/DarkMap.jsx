import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/api";

const goldIcon = L.divIcon({
  className: "",
  html: '<div class="gold-pin"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -22],
});

const MiniCard = ({ m }) => {
  const navigate = useNavigate();
  return (
    <div style={{ width: 240 }}>
      {m.photos?.[0] && <img src={m.photos[0]} alt={m.title} style={{ width: "100%", height: 120, objectFit: "cover" }} />}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "#B5934E", letterSpacing: 1 }}>{m.ref_code}</div>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#f3f1ea", lineHeight: 1.2, marginTop: 2 }}>{m.title}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{m.neighborhood}</div>
        <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#E6D5A9", fontSize: 17, marginTop: 6 }}>{formatPrice(m.price, m.price_period)}</div>
        {m.id && (
          <button onClick={() => navigate(`/immobili/${m.id}`)}
            style={{ marginTop: 10, width: "100%", padding: "9px 0", borderRadius: 999, border: "none", background: "#BE9E5E", color: "#1A160C", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Vedi annuncio →
          </button>
        )}
      </div>
    </div>
  );
};

export const DarkMap = ({ markers = [], center = [40.6418, 15.8086], zoom = 13, height = "420px", neighborhoods = [], clickable = true }) => {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ height, border: "1px solid rgba(181,147,78,0.3)" }} data-testid="dark-map">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          url="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        {neighborhoods.filter((n) => n.lat).map((n, i) => (
          <Circle key={`c-${i}`} center={[n.lat, n.lng]} radius={560}
            pathOptions={{ color: "#B5934E", weight: 1.5, opacity: 0.85, fillColor: "#B5934E", fillOpacity: 0.12 }}>
            <Tooltip permanent direction="center" className="neigh-label">
              <span style={{ color: "#E6D5A9", fontWeight: 700, fontSize: 11 }}>{n.name}</span>
            </Tooltip>
          </Circle>
        ))}
        {markers.filter((m) => m.lat).map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={goldIcon}>
            {clickable && m.id ? (
              <Popup><MiniCard m={m} /></Popup>
            ) : (
              <Popup><div style={{ padding: 12, color: "#f3f1ea", width: 180 }}><strong style={{ color: "#B5934E" }}>{m.title}</strong><div style={{ fontSize: 12, color: "#9ca3af" }}>{m.neighborhood}</div></div></Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
