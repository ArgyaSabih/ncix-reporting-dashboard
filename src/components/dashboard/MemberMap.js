"use client";

import {useEffect, useRef} from "react";
import {useMemberData} from "@/src/hooks/useDataHooks";

/**
 * Simple Map Component using Google Maps-like visualization
 * You can replace this with Leaflet, Mapbox, or Google Maps
 */
export default function MemberMap() {
  const {data, loading, error} = useMemberData();
  const mapRef = useRef(null);

  useEffect(() => {
    if (!data?.members || !mapRef.current) return;

    // Group members by location
    const locationGroups = {};
    data.members.forEach((member) => {
      const key = member.location;
      if (!locationGroups[key]) {
        locationGroups[key] = {
          location: member.location,
          city: member.locationDisplay,
          region: member.region,
          lat: member.latitude,
          lng: member.longitude,
          count: 0,
          members: []
        };
      }
      locationGroups[key].count++;
      locationGroups[key].members.push(member);
    });

    const locations = Object.values(locationGroups);

    // Simple SVG-based map visualization
  }, [data]);

  const renderSVGMap = (locations) => {
    if (!mapRef.current) return;

    // Clear previous content
    mapRef.current.innerHTML = "";

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "600");
    svg.setAttribute("viewBox", "0 0 1000 600");
    svg.style.backgroundColor = "#e8f4f8";
    svg.style.border = "1px solid #ccc";
    svg.style.borderRadius = "8px";

    // Convert lat/lng to SVG coordinates (simplified projection for Indonesia)
    const latRange = {min: -11, max: 6}; // Indonesia latitude range
    const lngRange = {min: 95, max: 141}; // Indonesia longitude range

    const latToY = (lat) => {
      const normalized = (lat - latRange.max) / (latRange.min - latRange.max);
      return normalized * 500 + 50;
    };

    const lngToX = (lng) => {
      const normalized = (lng - lngRange.min) / (lngRange.max - lngRange.min);
      return normalized * 900 + 50;
    };

    // Get max count for scaling
    const maxCount = Math.max(...locations.map((l) => l.count));

    // Add markers for each location
    locations.forEach((loc, index) => {
      const x = lngToX(loc.lng);
      const y = latToY(loc.lat);
      const radius = Math.max(5, Math.min(30, (loc.count / maxCount) * 40));

      // Marker circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", radius);
      circle.setAttribute("fill", "#3b82f6");
      circle.setAttribute("fill-opacity", "0.6");
      circle.setAttribute("stroke", "#1d4ed8");
      circle.setAttribute("stroke-width", "2");
      circle.style.cursor = "pointer";
      circle.style.transition = "all 0.2s";

      // Add hover effect
      circle.addEventListener("mouseenter", (e) => {
        e.target.setAttribute("fill-opacity", "0.9");
        e.target.setAttribute("r", radius * 1.2);
        showTooltip(loc, x, y);
      });

      circle.addEventListener("mouseleave", (e) => {
        e.target.setAttribute("fill-opacity", "0.6");
        e.target.setAttribute("r", radius);
        hideTooltip();
      });

      svg.appendChild(circle);

      // Add count label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y + 5);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "12");
      text.setAttribute("font-weight", "bold");
      text.setAttribute("pointer-events", "none");
      text.textContent = loc.count;
      svg.appendChild(text);

      // Add city label below marker
      const cityLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      cityLabel.setAttribute("x", x);
      cityLabel.setAttribute("y", y + radius + 15);
      cityLabel.setAttribute("text-anchor", "middle");
      cityLabel.setAttribute("fill", "#1f2937");
      cityLabel.setAttribute("font-size", "10");
      cityLabel.setAttribute("pointer-events", "none");
      cityLabel.textContent = loc.city;
      svg.appendChild(cityLabel);
    });

    mapRef.current.appendChild(svg);
  };

  const showTooltip = (location, x, y) => {
    const existing = document.getElementById("map-tooltip");
    if (existing) existing.remove();

    const tooltip = document.createElement("div");
    tooltip.id = "map-tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "white";
    tooltip.style.border = "2px solid #3b82f6";
    tooltip.style.borderRadius = "8px";
    tooltip.style.padding = "12px";
    tooltip.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    tooltip.style.zIndex = "1000";
    tooltip.style.minWidth = "200px";

    tooltip.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">${location.city}</div>
      <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">${location.location}</div>
      <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${location.region}</div>
      <div style="font-size: 14px; font-weight: bold; color: #3b82f6;">
        Total Members: ${location.count}
      </div>
      <div style="font-size: 11px; color: #9ca3af; margin-top: 8px;">
        Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}
      </div>
    `;

    mapRef.current.appendChild(tooltip);

    // Position tooltip near cursor
    const rect = mapRef.current.getBoundingClientRect();
    tooltip.style.left = `${Math.min(x, rect.width - 220)}px`;
    tooltip.style.top = `${Math.max(20, y - 100)}px`;
  };

  const hideTooltip = () => {
    const tooltip = document.getElementById("map-tooltip");
    if (tooltip) tooltip.remove();
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">Failed to load map data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Member Distribution Map</h2>
        <p className="text-gray-600 text-sm">
          Peta menampilkan distribusi member NCIX di seluruh Indonesia. Ukuran marker menunjukkan jumlah
          member di lokasi tersebut.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <div ref={mapRef} className="relative w-full" style={{minHeight: "600px"}}>
          {/* Map will be rendered here */}
        </div>

        {data && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Total Locations:</span>
                <span className="ml-2 text-gray-900">{data.locations?.length || 0}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Total Members:</span>
                <span className="ml-2 text-gray-900">{data.metadata?.totalRecords || 0}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Regions Covered:</span>
                <span className="ml-2 text-gray-900">
                  {new Set(data.members?.map((m) => m.region)).size || 0}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Last Updated:</span>
                <span className="ml-2 text-gray-900">
                  {data.metadata?.processedAt
                    ? new Date(data.metadata.processedAt).toLocaleDateString("id-ID")
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>💡 Hover over markers untuk melihat detail lokasi</p>
          <p className="mt-1">Marker size represents member count at each location</p>
        </div>
      </div>
    </div>
  );
}
