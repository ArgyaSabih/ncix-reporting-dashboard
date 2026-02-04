"use client";

import {useEffect, useRef} from "react";
import {MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Component to fit bounds to Indonesia
function FitBounds() {
  const map = useMap();

  useEffect(() => {
    // Indonesia bounds
    const bounds = [
      [6, 95], // North-West
      [-11, 141] // South-East
    ];
    map.fitBounds(bounds, {padding: [20, 20]});
  }, [map]);

  return null;
}

// Component to handle city selection and fly to
function CityFlyTo({selectedCity, locations}) {
  const map = useMap();
  const prevCity = useRef(selectedCity);

  useEffect(() => {
    if (selectedCity && selectedCity !== prevCity.current) {
      const location = locations.find((l) => l.location === selectedCity || l.city === selectedCity);
      if (location) {
        map.flyTo([location.lat, location.lng], 10, {duration: 1.5});
      }
      prevCity.current = selectedCity;
    }
  }, [selectedCity, locations, map]);

  return null;
}

export default function MapComponent({locations, selectedCity, onCityClick, activeLayers, facilities}) {
  // Calculate max for scaling
  const maxTotalRows = locations.length > 0 ? Math.max(...locations.map((l) => l.totalRows || 0)) : 1;

  // Get radius for bubbles layer (based on total rows, not unique members)
  const getBubbleRadius = (location) => {
    const minRadius = 8;
    const maxRadius = 35;
    const value = location.totalRows || 0;
    return minRadius + (value / maxTotalRows) * (maxRadius - minRadius);
  };

  // Process network connections for Trace ASN layer
  const networkConnections = [];
  if (activeLayers.includes("trace-asn") && locations && locations.length > 1) {
    // Create connections between nearby cities based on their coordinates
    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        const loc1 = locations[i];
        const loc2 = locations[j];

        // Calculate distance (simplified Euclidean distance)
        const distance = Math.sqrt(Math.pow(loc1.lat - loc2.lat, 2) + Math.pow(loc1.lng - loc2.lng, 2));

        // Only connect cities within reasonable distance (about 3-8 degrees ~ 300-800km)
        // This creates realistic network topology for Indonesia
        if (distance >= 3 && distance <= 8) {
          networkConnections.push({
            positions: [
              [loc1.lat, loc1.lng],
              [loc2.lat, loc2.lng]
            ],
            from: loc1.city,
            to: loc2.city
          });
        }
      }
    }
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        style={{width: "100%", height: "100%"}}
        scrollWheelZoom={true}
        className="z-0"
      >
        {/* Grayscale tile layer using CARTO */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <FitBounds />
        <CityFlyTo selectedCity={selectedCity} locations={locations} />

        {/* Layer 3: Trace ASN - Network connections */}
        {activeLayers.includes("trace-asn") &&
          networkConnections.map((conn, idx) => (
            <Polyline
              key={`connection-${idx}`}
              positions={conn.positions}
              pathOptions={{
                color: "#3b82f6",
                weight: 2,
                opacity: 0.6,
                dashArray: "5, 10"
              }}
            />
          ))}

        {/* Layer 1: Presence Heatmap */}
        {activeLayers.includes("heatmap") &&
          locations.map((location, index) => {
            const isSelected = selectedCity === location.location || selectedCity === location.city;
            const intensity = (location.totalRows || 0) / maxTotalRows;
            const colors =
              intensity > 0.7
                ? {fill: "#dc2626", stroke: "#b91c1c"}
                : intensity > 0.4
                  ? {fill: "#f97316", stroke: "#ea580c"}
                  : {fill: "#fbbf24", stroke: "#f59e0b"};

            return (
              <CircleMarker
                key={`heatmap-${location.location}-${index}`}
                center={[location.lat, location.lng]}
                radius={10 * (isSelected ? 1.5 : 1)}
                pathOptions={{
                  color: isSelected ? "#1d4ed8" : colors.stroke,
                  fillColor: isSelected ? "#3b82f6" : colors.fill,
                  fillOpacity: isSelected ? 0.9 : 0.5,
                  weight: isSelected ? 3 : 2
                }}
                eventHandlers={{
                  click: () => {
                    if (onCityClick) {
                      onCityClick(location.location);
                    }
                  }
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-gray-900 text-base mb-2">{location.city}</h3>
                    <div className="bg-blue-50 p-2 rounded mb-2">
                      <p className="text-blue-900 font-bold text-sm">Total Members: {location.totalRows}</p>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Class A:</span>
                        <span className="font-semibold text-gray-900">{location.memberClassA}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Class B:</span>
                        <span className="font-semibold text-gray-900">{location.memberClassB}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Class C:</span>
                        <span className="font-semibold text-gray-900">{location.memberClassC}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                        <span className="text-gray-600">Non Member:</span>
                        <span className="font-semibold text-gray-900">{location.nonMember}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* Layer 2: Presence Bubbles */}
        {activeLayers.includes("bubbles") &&
          locations.map((location, index) => {
            const isSelected = selectedCity === location.location || selectedCity === location.city;

            return (
              <CircleMarker
                key={`bubble-${location.location}-${index}`}
                center={[location.lat, location.lng]}
                radius={getBubbleRadius(location) * (isSelected ? 1.3 : 1) * 0.8}
                pathOptions={{
                  color: isSelected ? "#1d4ed8" : "#dc2626",
                  fillColor: isSelected ? "#3b82f6" : "#ef4444",
                  fillOpacity: isSelected ? 0.9 : 0.6,
                  weight: isSelected ? 3 : 2
                }}
                eventHandlers={{
                  click: () => {
                    if (onCityClick) {
                      onCityClick(location.location);
                    }
                  }
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold text-gray-900 text-base mb-2">{location.city}</h3>
                    <div className="bg-red-50 p-2 rounded">
                      <p className="text-red-700 font-bold text-lg">Members: {location.totalRows}</p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* Layer 3: Trace ASN nodes */}
        {activeLayers.includes("trace-asn") &&
          locations.map((location, index) => {
            const isSelected = selectedCity === location.location || selectedCity === location.city;

            return (
              <CircleMarker
                key={`trace-${location.location}-${index}`}
                center={[location.lat, location.lng]}
                radius={10 * (isSelected ? 1.5 : 1)}
                pathOptions={{
                  color: isSelected ? "#1d4ed8" : "#1d4ed8",
                  fillColor: isSelected ? "#3b82f6" : "#3b82f6",
                  fillOpacity: isSelected ? 1 : 0.8,
                  weight: isSelected ? 3 : 2
                }}
                eventHandlers={{
                  click: () => {
                    if (onCityClick) {
                      onCityClick(location.location);
                    }
                  }
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <h3 className="font-bold text-gray-900 text-base mb-1">{location.city}</h3>
                    <p className="text-gray-600 text-xs mb-2">{location.location}</p>
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-blue-700 font-semibold text-sm">Network Node</p>
                      <p className="text-gray-600 text-xs mt-1">Trace ASN connections</p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}
