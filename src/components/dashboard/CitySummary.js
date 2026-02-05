"use client";

import {useMemberData, getLocationStats} from "@/src/utils";

const CitySummary = ({viewMode, selectedCity, selectedCustomer}) => {
  const {data, loading} = useMemberData();

  if (loading || !data) {
    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Summary</h2>
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const locationStats = getLocationStats(data.members);
  const totalCities = 19; // Total possible cities

  // FACILITY VIEW - City Summary
  if (viewMode === "facility") {
    const cityToShow = selectedCity || locationStats[0];

    if (!cityToShow) {
      return (
        <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">City Summary</h2>
          <p className="text-slate-500">Click a city on the map</p>
        </div>
      );
    }

    // Get membership breakdown
    const cityMembers = data.members.filter((m) => m.locationDisplay === cityToShow.city);
    const breakdown = {
      "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
      "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
      "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length,
      "Non-Member": cityMembers.filter((m) => m.membershipType === "Non-Member").length
    };

    const topTier =
      breakdown["Class A"] >= breakdown["Class B"] && breakdown["Class A"] >= breakdown["Class C"]
        ? "Member Class A"
        : breakdown["Class B"] >= breakdown["Class C"]
          ? "Member Class B"
          : "Member Class C";

    return (
      <div className="flex-1 border  border-slate-300 p-6 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">City Summary</h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📍</span>
          <span className="text-xl font-semibold text-slate-800 uppercase">{cityToShow.city}</span>
        </div>

        <div className="space-y-3 text-slate-700">
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-medium">Total Members:</span>
            <span className="font-bold">{cityMembers.length}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-medium">Member Class A:</span>
            <span className="font-bold">{breakdown["Class A"]}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-medium">Member Class B:</span>
            <span className="font-bold">{breakdown["Class B"]}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-medium">Member Class C:</span>
            <span className="font-bold">{breakdown["Class C"]}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-medium">Non Member:</span>
            <span className="font-bold">{breakdown["Non-Member"]}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t-2 border-slate-300">
          <div className="flex justify-between">
            <span className="font-medium text-slate-700">Top Tier:</span>
            <span className="font-bold text-slate-800">{topTier}</span>
          </div>
        </div>
      </div>
    );
  }

  // NETWORK VIEW - Customer/ASN Summary
  if (viewMode === "network") {
    // Group by customer
    const customerGroups = {};
    data.members.forEach((member) => {
      if (!customerGroups[member.customer]) {
        customerGroups[member.customer] = {
          customer: member.customer,
          cities: new Set(),
          count: 0
        };
      }
      customerGroups[member.customer].cities.add(member.locationDisplay);
      customerGroups[member.customer].count++;
    });

    const customers = Object.values(customerGroups).sort((a, b) => b.cities.size - a.cities.size);
    const customerToShow = selectedCustomer
      ? customers.find((c) => c.customer === selectedCustomer)
      : customers[0];

    if (!customerToShow) {
      return (
        <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Network Summary</h2>
          <p className="text-slate-500">No data available</p>
        </div>
      );
    }

    const citiesList = Array.from(customerToShow.cities);

    return (
      <div className="flex-1 border border-slate-300 p-6 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Network Summary</h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🌐</span>
          <span className="text-xl font-semibold text-slate-800">{customerToShow.customer}</span>
        </div>

        <div className="space-y-3 text-slate-700">
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-medium">Cities Present:</span>
            <span className="font-bold">{citiesList.length}</span>
          </div>
          <div className="py-2 border-b border-slate-200">
            <span className="font-medium">Locations:</span>
            <p className="text-sm text-slate-600 mt-1">{citiesList.join(", ")}</p>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-medium">Total Presence Score:</span>
            <span className="font-bold">
              {citiesList.length}/{totalCities} cities
            </span>
          </div>
        </div>
      </div>
    );
  }

  // EXCHANGE VIEW - NCIX Summary
  if (viewMode === "exchange") {
    const uniqueCities = new Set(data.members.map((m) => m.locationDisplay)).size;
    const totalMembers = data.members.length;

    const breakdown = {
      "Class A": data.members.filter((m) => m.membershipType === "Class A").length,
      "Class B": data.members.filter((m) => m.membershipType === "Class B").length,
      "Class C": data.members.filter((m) => m.membershipType === "Class C").length,
      "Non-Member": data.members.filter((m) => m.membershipType === "Non-Member").length
    };

    // Find top city
    const topCity = locationStats[0];

    return (
      <div className="flex-1 border border-slate-300 p-6 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Exchange Summary</h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🏢</span>
          <span className="text-xl font-semibold text-slate-800">NCIX – neuCentrIX</span>
        </div>

        <div className="space-y-3 text-slate-700">
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-medium">Total Members:</span>
            <span className="font-bold">{totalMembers}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="font-medium">Cities Covered:</span>
            <span className="font-bold">{uniqueCities}</span>
          </div>
          <div className="py-2 border-b border-slate-200">
            <span className="font-medium">Membership Mix:</span>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Member Class A:</span>
                <span>{((breakdown["Class A"] / totalMembers) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Member Class B:</span>
                <span>{((breakdown["Class B"] / totalMembers) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Member Class C:</span>
                <span>{((breakdown["Class C"] / totalMembers) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Non Member:</span>
                <span>{((breakdown["Non-Member"] / totalMembers) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t-2 border-slate-300">
          <div className="flex justify-between">
            <span className="font-medium text-slate-700">Top City:</span>
            <span className="font-bold text-slate-800">{topCity?.city || "N/A"}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CitySummary;
