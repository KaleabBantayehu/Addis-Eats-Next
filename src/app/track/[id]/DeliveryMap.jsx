"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix standard Leaflet default icon paths in bundlers/browsers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom markers for courier and customer delivery destination
const courierIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function BoundsFitter({ courierPos, deliveryPos }) {
  const map = useMap();

  useEffect(() => {
    if (!courierPos || !deliveryPos) return;
    const bounds = L.latLngBounds([courierPos, deliveryPos]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [map, courierPos, deliveryPos]);

  return null;
}

export default function DeliveryMap({ courierLocation, deliveryLocation, area, status }) {
  // Default fallback center in Addis Ababa
  const defaultCenter = [9.0200, 38.7600];
  const courierPos = courierLocation || defaultCenter;
  const deliveryPos = deliveryLocation || defaultCenter;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border shadow-card" style={{ height: "320px" }}>
      <MapContainer
        center={courierPos}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={courierPos} icon={courierIcon}>
          <Popup>
            <div className="text-xs">
              <strong className="text-primary block">Courier</strong>
              <span>Status: {status}</span>
            </div>
          </Popup>
        </Marker>

        <Marker position={deliveryPos} icon={deliveryIcon}>
          <Popup>
            <div className="text-xs">
              <strong className="text-green-700 block">Delivery Location</strong>
              <span>Area: {area || "Addis Ababa"}</span>
            </div>
          </Popup>
        </Marker>

        <BoundsFitter courierPos={courierPos} deliveryPos={deliveryPos} />
      </MapContainer>
    </div>
  );
}
