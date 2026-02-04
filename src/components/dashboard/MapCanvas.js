"use client";

import {useEffect, useRef, useState, useCallback} from "react";
import {useMemberData, useFacilityData} from "@/src/hooks/useDataHooks";

const MapCanvas = ({activeLayer, viewMode, selectedCity, onCityClick}) => {
  const {data: memberData, loading, error} = useMemberData();
  const {data: facilityData} = useFacilityData();
  const canvasRef = useRef(null);
  const citiesRef = useRef([]);
  const projectToCanvasRef = useRef(null);

  // Drawing helpers (declare before useEffect to avoid TDZ errors)
  const drawHeatmap = (ctx, cities, projectToCanvas, canvas) => {
    // Find max count for normalization
    const maxCount = Math.max(...cities.map((c) => c.count));

    // Draw heatmap circles
    cities.forEach((city) => {
      const {x, y} = projectToCanvas(city.lat, city.lng);
      const intensity = city.count / maxCount;

      // Create radial gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
      gradient.addColorStop(0, `rgba(239, 68, 68, ${intensity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(251, 146, 60, ${intensity * 0.5})`);
      gradient.addColorStop(1, `rgba(252, 211, 77, ${intensity * 0.2})`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fill();

      // Draw center point
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawBubbles = (ctx, cities, projectToCanvas) => {
    const maxCount = Math.max(...cities.map((c) => c.count));

    cities.forEach((city) => {
      const {x, y} = projectToCanvas(city.lat, city.lng);
      const radius = 10 + (city.count / maxCount) * 40;

      // Draw bubble with gradient
      const gradient = ctx.createRadialGradient(x - radius / 3, y - radius / 3, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
      gradient.addColorStop(1, "rgba(37, 99, 235, 0.4)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = "#1e40af";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw count
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(city.count, x, y);
    });
  };

  const drawTraceASN = (ctx, cities, facilityData, projectToCanvas) => {
    // Draw connections between cities based on network data
    if (!facilityData || facilityData.length === 0) return;

    // Group facilities by city
    const facilityByCity = {};
    facilityData.forEach((facility) => {
      const cityName = facility.name.toLowerCase();
      facilityByCity[cityName] = facility;
    });

    // Draw network lines
    ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
    ctx.lineWidth = 2;

    cities.forEach((city1, i) => {
      cities.slice(i + 1).forEach((city2) => {
        const pos1 = projectToCanvas(city1.lat, city1.lng);
        const pos2 = projectToCanvas(city2.lat, city2.lng);

        // Draw line
        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.stroke();
      });
    });

    // Draw city nodes
    cities.forEach((city) => {
      const {x, y} = projectToCanvas(city.lat, city.lng);

      // Draw node
      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw ring
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  useEffect(() => {
    if (!memberData?.members || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Group members by city
    const cityGroups = {};
    memberData.members.forEach((member) => {
      const key = member.locationDisplay;
      if (!cityGroups[key]) {
        cityGroups[key] = {
          city: member.locationDisplay,
          region: member.region,
          lat: member.latitude,
          lng: member.longitude,
          count: 0,
          members: []
        };
      }
      cityGroups[key].count++;
      cityGroups[key].members.push(member);
    });

    const cities = Object.values(cityGroups);
    citiesRef.current = cities;

    // Map projection (simple lat/lng to x/y)
    const latMin = -11,
      latMax = 6;
    const lngMin = 95,
      lngMax = 141;
    const padding = 50;

    const projectToCanvas = (lat, lng) => {
      const x = ((lng - lngMin) / (lngMax - lngMin)) * (canvas.width - 2 * padding) + padding;
      const y = ((latMax - lat) / (latMax - latMin)) * (canvas.height - 2 * padding) + padding;
      return {x, y};
    };
    projectToCanvasRef.current = projectToCanvas;

    // Draw based on active layer
    if (activeLayer === "heatmap") {
      drawHeatmap(ctx, cities, projectToCanvas, canvas);
    } else if (activeLayer === "bubbles") {
      drawBubbles(ctx, cities, projectToCanvas);
    } else if (activeLayer === "trace-asn") {
      drawTraceASN(ctx, cities, facilityData, projectToCanvas);
    }

    // Draw city labels and highlight selected
    cities.forEach((city) => {
      const {x, y} = projectToCanvas(city.lat, city.lng);

      // Highlight selected city
      if (selectedCity && selectedCity.city === city.city) {
        ctx.strokeStyle = "#dc2626";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "#1e293b";
      ctx.font = "12px sans-serif";
      ctx.fillText(city.city, x + 15, y + 5);
    });
  }, [memberData, facilityData, activeLayer, selectedCity]);

  // Handle canvas click
  const handleCanvasClick = useCallback(
    (e) => {
      if (!canvasRef.current || !projectToCanvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check which city was clicked
      const cities = citiesRef.current;
      for (const city of cities) {
        const {x, y} = projectToCanvasRef.current(city.lat, city.lng);
        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);

        if (distance < 25) {
          onCityClick(city);
          return;
        }
      }
    },
    [onCityClick]
  );

  if (loading) {
    return (
      <div className="flex-1">
        <div
          className="w-full h-full bg-slate-100 rounded-md border border-slate-300 flex items-center justify-center"
          style={{minHeight: "600px"}}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading map data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1">
        <div
          className="w-full h-full bg-slate-100 rounded-md border border-slate-300 flex items-center justify-center"
          style={{minHeight: "600px"}}
        >
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div
        className="w-full h-full bg-white rounded-md border border-slate-300 relative overflow-hidden"
        style={{minHeight: "600px"}}
      >
        <canvas ref={canvasRef} className="w-full h-full cursor-pointer" onClick={handleCanvasClick} />
        {selectedCity && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-slate-200">
            <p className="text-sm font-semibold text-slate-800">📍 {selectedCity.city}</p>
            <p className="text-xs text-slate-500">{selectedCity.count} members</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapCanvas;
