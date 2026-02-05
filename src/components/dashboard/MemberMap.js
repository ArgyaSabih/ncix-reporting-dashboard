"use client";

import {useMemo} from "react";
import {useMemberData} from "@/src/hooks/useDataHooks";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

export default function MemberMap({
  activeLayers,
  viewMode,
  selectedCity,
  selectedCustomer,
  onCityClick,
  onReset
}) {
  const {data, loading, error} = useMemberData();

  // Use useMemo instead of useState + useEffect to avoid the setState in effect warning
  const locations = useMemo(() => {
    if (!data?.members) return [];

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
          // Layer 1: Presence Heatmap - total baris CSV
          totalRows: 0,
          memberClassA: 0,
          memberClassB: 0,
          memberClassC: 0,
          nonMember: 0,
          // Layer 2: Member Bubbles - unique members
          uniqueMembers: new Set(),
          members: []
        };
      }

      // Count total rows (setiap baris CSV)
      locationGroups[key].totalRows++;

      // Breakdown by membership type
      const membershipType = member.membershipType || "";
      if (membershipType.includes("Member Class A")) {
        locationGroups[key].memberClassA++;
      } else if (membershipType.includes("Member Class B")) {
        locationGroups[key].memberClassB++;
      } else if (membershipType.includes("Member Class C")) {
        locationGroups[key].memberClassC++;
      } else {
        locationGroups[key].nonMember++;
      }

      // Track unique members
      locationGroups[key].uniqueMembers.add(member.customer);
      locationGroups[key].members.push(member);
    });

    // Convert Set to count
    return Object.values(locationGroups).map((loc) => ({
      ...loc,
      uniqueMemberCount: loc.uniqueMembers.size,
      uniqueMembers: undefined // Remove Set from output
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">Failed to load map data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full">
      <MapComponent
        locations={locations}
        selectedCity={selectedCity}
        selectedCustomer={selectedCustomer}
        onCityClick={onCityClick}
        onReset={onReset}
        activeLayers={activeLayers}
        facilities={data?.facilities || []}
      />
    </div>
  );
}
