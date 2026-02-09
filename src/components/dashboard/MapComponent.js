"use client";

import {useEffect, useRef, useState} from "react";
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

// Component to close all popups when city is deselected
function ClosePopups({selectedCity}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedCity) {
      map.closePopup();
    }
  }, [selectedCity, map]);

  return null;
}

// Component to handle city selection and fly to
function CityFlyTo({selectedCity, locations}) {
  const map = useMap();
  const prevCity = useRef(selectedCity?.city);

  useEffect(() => {
    if (selectedCity && selectedCity.city !== prevCity.current) {
      // Fly to selected city
      const location = locations.find(
        (l) => l.location === selectedCity.location || l.city === selectedCity.city
      );
      if (location) {
        map.flyTo([location.lat, location.lng], 10, {duration: 1.5});
      }
      prevCity.current = selectedCity.city;
    } else if (!selectedCity && prevCity.current) {
      // Reset to Indonesia bounds when city is deselected
      const bounds = [
        [6, 95], // North-West
        [-11, 141] // South-East
      ];
      map.flyToBounds(bounds, {padding: [20, 20], duration: 1.5});
      prevCity.current = null;
    }
  }, [selectedCity, locations, map]);

  return null;
}

export default function MapComponent({
  locations,
  selectedCity,
  selectedCustomer,
  onCityClick,
  onReset,
  activeLayers,
  facilities,
  viewMode,
  members
}) {
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
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      {/* Reset Button */}
      {(selectedCity || selectedCustomer) && (
        <button
          onClick={onReset}
          className="absolute top-3 right-3 z-[1000] cursor-pointer bg-white px-3 py-2 rounded-md shadow-md border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm font-medium text-slate-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset Map
        </button>
      )}

      {/* Legend */}
      {activeLayers.length > 0 && (
        <div className="absolute bottom-8 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-slate-200 p-3 max-w-[200px]">
          <h4 className="font-semibold text-slate-800 text-xs mb-2 border-b border-slate-200 pb-1">Legend</h4>

          {/* Heatmap Legend */}
          {activeLayers.includes("heatmap") && (
            <div className="mb-2">
              <p className="text-xs font-medium text-slate-700 mb-1">Presence Heatmap</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600 border border-red-700"></div>
                  <span className="text-xs text-slate-600">High (&gt;70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 border border-orange-600"></div>
                  <span className="text-xs text-slate-600">Medium (40-70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500"></div>
                  <span className="text-xs text-slate-600">Low (&lt;40%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Bubbles Legend */}
          {activeLayers.includes("bubbles") && (
            <div className="mb-2">
              <p className="text-xs font-medium text-slate-700 mb-1">Presence Bubbles</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500 opacity-60 border-2 border-red-600"></div>
                  <span className="text-xs text-slate-600">More customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 opacity-60 border-2 border-red-600"></div>
                  <span className="text-xs text-slate-600">Fewer customers</span>
                </div>
              </div>
            </div>
          )}

          {/* Trace ASN Legend */}
          {activeLayers.includes("trace-asn") && (
            <div className="mb-0">
              <p className="text-xs font-medium text-slate-700 mb-1">Trace ASN</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-600"></div>
                  <span className="text-xs text-slate-600">Network node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-0.5 bg-blue-500 border-dashed"
                    style={{borderTop: "2px dashed #3b82f6"}}
                  ></div>
                  <span className="text-xs text-slate-600">Connection</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected indicator */}
          <div className="mt-2 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-700"></div>
              <span className="text-xs text-slate-600">Selected</span>
            </div>
          </div>
        </div>
      )}
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
        <ClosePopups selectedCity={selectedCity} />

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
            const isSelected =
              selectedCity?.city === location.city || selectedCity?.location === location.location;
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
                      onCityClick({city: location.city, location: location.location});
                    }
                  }
                }}
              >
                <Popup>
                  {viewMode === "facility" &&
                    (() => {
                      const cityMembers = members.filter((m) => m.locationDisplay === location.city);
                      const breakdown = {
                        "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
                        "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
                        "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length,
                        "Non-Member": cityMembers.filter((m) => m.membershipType === "Non-Member").length
                      };
                      const topMember =
                        breakdown["Class A"] >= breakdown["Class B"] &&
                        breakdown["Class A"] >= breakdown["Class C"]
                          ? "Member Class A"
                          : breakdown["Class B"] >= breakdown["Class C"]
                            ? "Member Class B"
                            : "Member Class C";
                      return (
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-bold text-gray-900 text-base mb-3">{location.city}</h3>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Total Customers:</span>
                              <span className="font-bold text-gray-900">{cityMembers.length}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Member Class A:</span>
                              <span className="font-bold text-gray-900">{breakdown["Class A"]}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Member Class B:</span>
                              <span className="font-bold text-gray-900">{breakdown["Class B"]}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Member Class C:</span>
                              <span className="font-bold text-gray-900">{breakdown["Class C"]}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Non Member:</span>
                              <span className="font-bold text-gray-900">{breakdown["Non-Member"]}</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-2 border-t-2 border-gray-300">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600 font-medium">Top Member:</span>
                              <span className="font-bold text-gray-900">{topMember}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  {viewMode === "network" &&
                    (() => {
                      const cityMembers = members.filter((m) => m.locationDisplay === location.city);
                      const uniqueCustomers = [...new Set(cityMembers.map((m) => m.customer))];
                      const breakdown = {
                        "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
                        "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
                        "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length
                      };
                      return (
                        <div className="p-1 min-w-[200px]">
                          <h3 className="font-bold text-gray-900 text-base mb-2">{location.city}</h3>
                          <div className="bg-purple-50 p-2 rounded mb-2">
                            <p className="text-purple-900 font-bold text-sm">Network Info</p>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Companies:</span>
                              <span className="font-semibold text-gray-900">{uniqueCustomers.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Connections:</span>
                              <span className="font-semibold text-gray-900">{cityMembers.length}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-1 mt-1">
                              <div className="text-gray-600 mb-1">Membership Breakdown:</div>
                              <div className="space-y-0.5 pl-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Class A:</span>
                                  <span className="font-semibold text-gray-900">{breakdown["Class A"]}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Class B:</span>
                                  <span className="font-semibold text-gray-900">{breakdown["Class B"]}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Class C:</span>
                                  <span className="font-semibold text-gray-900">{breakdown["Class C"]}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  {viewMode === "exchange" &&
                    (() => {
                      const cityMembers = members.filter((m) => m.locationDisplay === location.city);
                      const total = cityMembers.length;
                      const uniqueCustomers = [...new Set(cityMembers.map((m) => m.customer))].length;
                      const classAPercent =
                        total > 0
                          ? (
                              (cityMembers.filter((m) => m.membershipType === "Class A").length / total) *
                              100
                            ).toFixed(0)
                          : 0;
                      const classBPercent =
                        total > 0
                          ? (
                              (cityMembers.filter((m) => m.membershipType === "Class B").length / total) *
                              100
                            ).toFixed(0)
                          : 0;
                      const classCPercent =
                        total > 0
                          ? (
                              (cityMembers.filter((m) => m.membershipType === "Class C").length / total) *
                              100
                            ).toFixed(0)
                          : 0;
                      const nonMemberPercent =
                        total > 0
                          ? (
                              (cityMembers.filter((m) => m.membershipType === "Non-Member").length / total) *
                              100
                            ).toFixed(0)
                          : 0;
                      return (
                        <div className="p-1 min-w-[200px]">
                          <h3 className="font-bold text-gray-900 text-base mb-2">{location.city}</h3>
                          <div className="bg-green-50 p-2 rounded mb-2">
                            <p className="text-green-900 font-bold text-sm">Exchange Info</p>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Customers:</span>
                              <span className="font-semibold text-gray-900">{total}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Unique Customers:</span>
                              <span className="font-semibold text-gray-900">{uniqueCustomers}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-1 mt-1">
                              <div className="text-gray-600 mb-1">Membership Mix:</div>
                              <div className="space-y-0.5 pl-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Member Class A:</span>
                                  <span className="font-semibold text-gray-900">{classAPercent}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Member Class B:</span>
                                  <span className="font-semibold text-gray-900">{classBPercent}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Member Class C:</span>
                                  <span className="font-semibold text-gray-900">{classCPercent}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Non Member:</span>
                                  <span className="font-semibold text-gray-900">{nonMemberPercent}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </Popup>
              </CircleMarker>
            );
          })}

        {/* Layer 2: Presence Bubbles */}
        {activeLayers.includes("bubbles") &&
          locations.map((location, index) => {
            const isSelected =
              selectedCity?.city === location.city || selectedCity?.location === location.location;

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
                      onCityClick({city: location.city, location: location.location});
                    }
                  }
                }}
              >
                <Popup>
                  {viewMode === "facility" &&
                    (() => {
                      const cityMembers = members.filter((m) => m.locationDisplay === location.city);
                      const breakdown = {
                        "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
                        "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
                        "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length,
                        "Non-Member": cityMembers.filter((m) => m.membershipType === "Non-Member").length
                      };
                      const topMember =
                        breakdown["Class A"] >= breakdown["Class B"] &&
                        breakdown["Class A"] >= breakdown["Class C"]
                          ? "Member Class A"
                          : breakdown["Class B"] >= breakdown["Class C"]
                            ? "Member Class B"
                            : "Member Class C";
                      return (
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-bold text-gray-900 text-base mb-3">{location.city}</h3>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Total Customers:</span>
                              <span className="font-bold text-gray-900">{cityMembers.length}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Member Class A:</span>
                              <span className="font-bold text-gray-900">{breakdown["Class A"]}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Member Class B:</span>
                              <span className="font-bold text-gray-900">{breakdown["Class B"]}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Member Class C:</span>
                              <span className="font-bold text-gray-900">{breakdown["Class C"]}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Non Member:</span>
                              <span className="font-bold text-gray-900">{breakdown["Non-Member"]}</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-2 border-t-2 border-gray-300">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600 font-medium">Top Member:</span>
                              <span className="font-bold text-gray-900">{topMember}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  {viewMode === "network" &&
                    (() => {
                      const cityMembers = members.filter((m) => m.locationDisplay === location.city);
                      const uniqueCustomers = [...new Set(cityMembers.map((m) => m.customer))];
                      return (
                        <div className="p-1 min-w-[180px]">
                          <h3 className="font-bold text-gray-900 text-base mb-2">{location.city}</h3>
                          <div className="bg-red-50 p-2 rounded mb-2">
                            <p className="text-red-700 font-bold text-base">Network Node</p>
                          </div>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Companies:</span>
                              <span className="font-semibold text-gray-900">{uniqueCustomers.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Connections:</span>
                              <span className="font-semibold text-gray-900">{cityMembers.length}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  {viewMode === "exchange" &&
                    (() => {
                      const cityMembers = members.filter((m) => m.locationDisplay === location.city);
                      const total = cityMembers.length;
                      const uniqueCustomers = [...new Set(cityMembers.map((m) => m.customer))].length;
                      return (
                        <div className="p-1 min-w-[150px]">
                          <h3 className="font-bold text-gray-900 text-base mb-2">{location.city}</h3>
                          <div className="bg-red-50 p-2 rounded">
                            <p className="text-red-700 font-bold text-base">NCIX Location</p>
                            <p className="text-red-600 text-sm mt-1">{total} customers</p>
                            <p className="text-red-600 text-xs">{uniqueCustomers} unique</p>
                          </div>
                        </div>
                      );
                    })()}
                </Popup>
              </CircleMarker>
            );
          })}

        {/* Layer 3: Trace ASN nodes */}
        {activeLayers.includes("trace-asn") &&
          locations.map((location, index) => {
            const isSelected =
              selectedCity?.city === location.city || selectedCity?.location === location.location;

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
                      onCityClick({city: location.city, location: location.location});
                    }
                  }
                }}
              >
                <Popup>
                  {viewMode === "facility" &&
                    (() => {
                      const cityMembers = members.filter((m) => m.locationDisplay === location.city);
                      const breakdown = {
                        "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
                        "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
                        "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length,
                        "Non-Member": cityMembers.filter((m) => m.membershipType === "Non-Member").length
                      };
                      const topMember =
                        breakdown["Class A"] >= breakdown["Class B"] &&
                        breakdown["Class A"] >= breakdown["Class C"]
                          ? "Member Class A"
                          : breakdown["Class B"] >= breakdown["Class C"]
                            ? "Member Class B"
                            : "Member Class C";
                      return (
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-bold text-gray-900 text-base mb-3">{location.city}</h3>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Total Customers:</span>
                              <span className="font-bold text-gray-900">{cityMembers.length}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Member Class A:</span>
                              <span className="font-bold text-gray-900">{breakdown["Class A"]}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Member Class B:</span>
                              <span className="font-bold text-gray-900">{breakdown["Class B"]}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Member Class C:</span>
                              <span className="font-bold text-gray-900">{breakdown["Class C"]}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">Non Member:</span>
                              <span className="font-bold text-gray-900">{breakdown["Non-Member"]}</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-2 border-t-2 border-gray-300">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600 font-medium">Top Member:</span>
                              <span className="font-bold text-gray-900">{topMember}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  {viewMode === "network" &&
                    (() => {
                      const cityMembers = members.filter((m) => m.locationDisplay === location.city);
                      const uniqueCustomers = [...new Set(cityMembers.map((m) => m.customer))];
                      const topCustomers = uniqueCustomers.slice(0, 3);
                      return (
                        <div className="p-1 min-w-[200px]">
                          <h3 className="font-bold text-gray-900 text-base mb-1">{location.city}</h3>
                          <div className="bg-blue-50 p-2 rounded mb-2">
                            <p className="text-blue-700 font-semibold text-sm">ASN Network Hub</p>
                          </div>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Companies:</span>
                              <span className="font-semibold text-gray-900">{uniqueCustomers.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Connections:</span>
                              <span className="font-semibold text-gray-900">{cityMembers.length}</span>
                            </div>
                            {topCustomers.length > 0 && (
                              <div className="border-t border-gray-300 pt-1 mt-1">
                                <p className="text-gray-600 mb-1">Top Companies:</p>
                                <p className="text-gray-700">{topCustomers.join(", ")}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  {viewMode === "exchange" &&
                    (() => {
                      const cityMembers = members.filter((m) => m.locationDisplay === location.city);
                      const total = cityMembers.length;
                      const uniqueCustomers = [...new Set(cityMembers.map((m) => m.customer))].length;
                      const memberCount = cityMembers.filter(
                        (m) =>
                          m.membershipType === "Class A" ||
                          m.membershipType === "Class B" ||
                          m.membershipType === "Class C"
                      ).length;
                      const nonMemberCount = cityMembers.filter(
                        (m) => m.membershipType === "Non-Member"
                      ).length;
                      return (
                        <div className="p-1 min-w-[180px]">
                          <h3 className="font-bold text-gray-900 text-base mb-1">{location.city}</h3>
                          <div className="bg-blue-50 p-2 rounded mb-2">
                            <p className="text-blue-700 font-semibold text-sm">NCIX Exchange Point</p>
                          </div>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Customers:</span>
                              <span className="font-semibold text-gray-900">{total}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Unique Customers:</span>
                              <span className="font-semibold text-gray-900">{uniqueCustomers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Members:</span>
                              <span className="font-semibold text-gray-900">{memberCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Non Members:</span>
                              <span className="font-semibold text-gray-900">{nonMemberCount}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}
