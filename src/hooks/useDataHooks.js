"use client";

import {useState, useEffect} from "react";

/**
 * Custom hook untuk fetch data member dari API
 */
export function useMemberData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/data/members");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {data, loading, error, refetch: fetchData};
}

/**
 * Custom hook untuk fetch data facility dari API
 */
export function useFacilityData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/data/facilities");

        if (!response.ok) {
          throw new Error("Failed to fetch facility data");
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {data, loading, error};
}

/**
 * Helper functions untuk data transformation
 */

// Group members by location
export function groupByLocation(members) {
  if (!members) return {};

  return members.reduce((acc, member) => {
    const location = member.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(member);
    return acc;
  }, {});
}

// Get location statistics
export function getLocationStats(members) {
  if (!members) return [];

  const grouped = groupByLocation(members);

  return Object.entries(grouped)
    .map(([location, items]) => ({
      location,
      count: items.length,
      city: items[0]?.locationDisplay,
      region: items[0]?.region,
      latitude: items[0]?.latitude,
      longitude: items[0]?.longitude,
      membershipBreakdown: {
        "Class A": items.filter((m) => m.membershipType === "Class A").length,
        "Class B": items.filter((m) => m.membershipType === "Class B").length,
        "Class C": items.filter((m) => m.membershipType === "Class C").length,
        Member: items.filter((m) => m.membershipType === "Member").length,
        "Non-Member": items.filter((m) => m.membershipType === "Non-Member").length
      }
    }))
    .sort((a, b) => b.count - a.count);
}

// Get top locations by member count
export function getTopLocations(members, limit = 10) {
  const stats = getLocationStats(members);
  return stats.slice(0, limit);
}

// Get membership type distribution
export function getMembershipDistribution(members) {
  if (!members) return [];

  const distribution = members.reduce((acc, member) => {
    const type = member.membershipType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format
  return Object.entries(distribution).map(([type, count]) => ({
    type,
    count
  }));
}

// Get members by region
export function groupByRegion(members) {
  if (!members) return {};

  return members.reduce((acc, member) => {
    const region = member.region;
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(member);
    return acc;
  }, {});
}

// Filter members by criteria
export function filterMembers(members, criteria) {
  if (!members) return [];

  return members.filter((member) => {
    if (criteria.location && member.location !== criteria.location) {
      return false;
    }
    if (criteria.membershipType && member.membershipType !== criteria.membershipType) {
      return false;
    }
    if (criteria.region && member.region !== criteria.region) {
      return false;
    }
    if (criteria.period && member.period !== criteria.period) {
      return false;
    }
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      return member.customer.toLowerCase().includes(term);
    }
    return true;
  });
}

// Prepare data for map markers
export function prepareMapMarkers(members) {
  if (!members) return [];

  const grouped = groupByLocation(members);

  return Object.entries(grouped).map(([location, items]) => ({
    position: [items[0].latitude, items[0].longitude],
    location: location,
    city: items[0].locationDisplay,
    region: items[0].region,
    count: items.length,
    members: items,
    popupContent: `
      <div>
        <h3 style="font-weight: bold; margin-bottom: 8px;">${items[0].locationDisplay}</h3>
        <p style="margin-bottom: 4px;">Total Members: ${items.length}</p>
        <p style="font-size: 12px; color: #666;">${location}</p>
      </div>
    `
  }));
}

// Export data to CSV
export function exportToCSV(members, filename = "members-export.csv") {
  if (!members || members.length === 0) {
    console.error("No data to export");
    return;
  }

  const headers = [
    "Period",
    "Customer",
    "Location",
    "City",
    "Region",
    "Membership Type",
    "Latitude",
    "Longitude"
  ];
  const rows = members.map((m) => [
    m.period,
    m.customer,
    m.location,
    m.locationDisplay,
    m.region,
    m.membershipType,
    m.latitude,
    m.longitude
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
    "\n"
  );

  const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
