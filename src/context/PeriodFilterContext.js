"use client";

import {createContext, useContext, useState, useMemo} from "react";

const PeriodFilterContext = createContext(null);

export function PeriodFilterProvider({children, allPeriods = []}) {
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const value = useMemo(
    () => ({
      selectedPeriod,
      setSelectedPeriod,
      allPeriods
    }),
    [selectedPeriod, allPeriods]
  );

  return <PeriodFilterContext.Provider value={value}>{children}</PeriodFilterContext.Provider>;
}

export function usePeriodFilter() {
  const context = useContext(PeriodFilterContext);
  if (!context) {
    throw new Error("usePeriodFilter must be used within a PeriodFilterProvider");
  }
  return context;
}

/**
 * Helper function to format period string for display
 * @param {string} period - Period in YYYYMM format (e.g., "202512")
 * @returns {string} - Formatted period (e.g., "Dec 2025")
 */
export function formatPeriod(period) {
  if (!period || period === "all") return "All Periods";

  const year = period.substring(0, 4);
  const month = parseInt(period.substring(4, 6), 10);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return `${monthNames[month - 1]} ${year}`;
}

/**
 * Helper function to filter members by period
 * @param {Array} members - Array of member objects
 * @param {string} selectedPeriod - Selected period ("all" or YYYYMM format)
 * @returns {Array} - Filtered members array
 */
export function filterMembersByPeriod(members, selectedPeriod) {
  if (!members) return [];

  // For "all" period, deduplicate by (customer, location) and keep only the newest period
  if (selectedPeriod === "all") {
    const groupedMembers = new Map();

    members.forEach((member) => {
      const key = `${member.customer}|${member.location}`;
      const existing = groupedMembers.get(key);

      // If no existing entry or current member has a newer period, update the map
      if (!existing || member.period > existing.period) {
        groupedMembers.set(key, member);
      }
    });

    return Array.from(groupedMembers.values());
  }

  return members.filter((member) => member.period === selectedPeriod);
}

/**
 * Helper function to extract unique periods from members
 * @param {Array} members - Array of member objects
 * @returns {Array} - Sorted array of unique periods (newest first)
 */
export function extractUniquePeriods(members) {
  if (!members) return [];

  const periods = [...new Set(members.map((m) => m.period))];
  return periods.sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)
}
