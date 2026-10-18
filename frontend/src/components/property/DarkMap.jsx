import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/api";

const goldIcon = L.divIcon({
  className: "",
  html: '<div class="gold-pin"></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  popupAnchor: [0, -24],
});

export const DarkMap = ({ markers = [], center = [40.6418, 15.8086], zoom = 13, height = "420px", neighborhoods = [], clickable = true }) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl overflow-hidden border border-gold/25 gold-glow" style={{ height }} data-testid="dark-map">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {neighborhoods.map((n, i) => (
          <Circle key={`c-${i}`} center={[n.lat, n.lng]} radius={520}
            pathOptions={{ color: "#D4AF37", weight: 1, fillColor: "#D4AF37", fillOpacity: 0.08 }}>
            <Popup><strong style={{ color: "#D4AF37" }}>{n.name}</strong><br />Indice richiesta {n.demand_index}/100</Popup>
          </Circle>
        ))}
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={goldIcon}
            eventHandlers={clickable && m.id ? { click: () => navigate(`/immobili/${m.id}`) } : {}}>
            <Popup>
              <div style={{ minWidth: 150 }}>
                <strong style={{ color: "#D4AF37" }}>{m.title}</strong>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{m.neighborhood}</div>
                <div style={{ fontFamily: "monospace", color: "#10B981", marginTop: 4 }}>{formatPrice(m.price, m.price_period)}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
