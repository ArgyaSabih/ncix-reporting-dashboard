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
    // If no city selected, show overall summary
    if (!selectedCity) {
      const totalMembers = data.members.length;
      const breakdown = {
        "Class A": data.members.filter((m) => m.membershipType === "Class A").length,
        "Class B": data.members.filter((m) => m.membershipType === "Class B").length,
        "Class C": data.members.filter((m) => m.membershipType === "Class C").length,
        "Non-Member": data.members.filter((m) => m.membershipType === "Non-Member").length
      };

      const topMember =
        breakdown["Class A"] >= breakdown["Class B"] && breakdown["Class A"] >= breakdown["Class C"]
          ? "Member Class A"
          : breakdown["Class B"] >= breakdown["Class C"]
            ? "Member Class B"
            : "Member Class C";

      return (
        <div className="flex-1 border border-slate-300 p-6 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Overall Summary</h2>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌍</span>
            <span className="text-xl font-semibold text-slate-800">All Cities</span>
          </div>
          <div className="overflow-y-auto max-h-44 pr-1">
            <div className="space-y-3 text-slate-700">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-medium">Total Customers:</span>
                <span className="font-bold">{totalMembers}</span>
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

            <div className="mt-6 py-4 border-t-2 border-slate-300">
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Top Member:</span>
                <span className="font-bold text-slate-800">{topMember}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Get membership breakdown for selected city
    const cityMembers = data.members.filter((m) => m.locationDisplay === selectedCity.city);
    const breakdown = {
      "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
      "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
      "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length,
      "Non-Member": cityMembers.filter((m) => m.membershipType === "Non-Member").length
    };

    // Check if no members in this city
    const hasNoMembers =
      breakdown["Class A"] === 0 && breakdown["Class B"] === 0 && breakdown["Class C"] === 0;

    if (hasNoMembers) {
      return (
        <div className="flex-1 border border-slate-300 p-6 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">City Summary</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📍</span>
            <span className="text-xl font-semibold text-slate-800 uppercase">{selectedCity.city}</span>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-4xl mb-3">😔</span>
            <p className="text-slate-700 text-center font-medium">No member in this city</p>
            <p className="text-slate-600 text-sm mt-1">Only Non-Members: {breakdown["Non-Member"]}</p>
          </div>
        </div>
      );
    }

    const topMember =
      breakdown["Class A"] >= breakdown["Class B"] && breakdown["Class A"] >= breakdown["Class C"]
        ? "Member Class A"
        : breakdown["Class B"] >= breakdown["Class C"]
          ? "Member Class B"
          : "Member Class C";

    return (
      <div className="flex-1 border border-slate-300 p-6 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">City Summary</h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📍</span>
          <span className="text-xl font-semibold text-slate-800 uppercase">{selectedCity.city}</span>
        </div>
        <div className="overflow-y-auto max-h-44 pr-1">
          <div className="space-y-3 text-slate-700">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Total Customers:</span>
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

          <div className="mt-6 py-4 border-t-2 border-slate-300">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Top Member:</span>
              <span className="font-bold text-slate-800">{topMember}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NETWORK VIEW - Customer/ASN Summary
  if (viewMode === "network") {
    // Group by customer for all cases
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

    // Priority 1: If customer is selected, show customer detail
    const customerToShow = selectedCustomer ? customers.find((c) => c.customer === selectedCustomer) : null;

    // Show customer detail if selected
    if (customerToShow) {
      const citiesList = Array.from(customerToShow.cities);

      return (
        <div className="flex-1 border border-slate-300 p-6 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Network Summary</h2>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌐</span>
            <span className="text-xl font-semibold text-slate-800">{customerToShow.customer}</span>
          </div>

          <div className="space-y-3 overflow-y-auto pb-4 max-h-44 pr-1 text-slate-700">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Cities Present:</span>
              <span className="font-bold">{citiesList.length}</span>
            </div>
            <div className="py-2 border-b border-slate-200">
              <span className="font-medium">Locations:</span>
              <p className="text-sm text-slate-600 mt-1">{citiesList.join(", ")}</p>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Total Presence:</span>
              <span className="font-bold">
                {citiesList.length}/{totalCities} cities
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Priority 2: If city is selected (but no customer), show city-specific network info
    if (selectedCity) {
      const cityMembers = data.members.filter((m) => m.locationDisplay === selectedCity.city);
      const uniqueCustomers = [...new Set(cityMembers.map((m) => m.customer))];
      const breakdown = {
        "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
        "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
        "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length,
        "Non-Member": cityMembers.filter((m) => m.membershipType === "Non-Member").length
      };

      return (
        <div className="flex-1 border border-slate-300 p-6 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Network Summary</h2>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📍</span>
            <span className="text-xl font-semibold text-slate-800 uppercase">{selectedCity.city}</span>
          </div>

          <div className="space-y-3 overflow-y-auto pb-4 max-h-44 pr-1 text-slate-700">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Total Companies:</span>
              <span className="font-bold">{uniqueCustomers.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Total Connections:</span>
              <span className="font-bold">{cityMembers.length}</span>
            </div>
            <div className="py-2 border-b border-slate-200">
              <span className="font-medium">Membership Breakdown:</span>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Class A:</span>
                  <span>{breakdown["Class A"]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Class B:</span>
                  <span>{breakdown["Class B"]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Class C:</span>
                  <span>{breakdown["Class C"]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Priority 3: Overall network summary when no city/customer selected
    if (true) {
      const totalCustomers = customers.length;
      const avgCitiesPerCustomer = (
        customers.reduce((sum, c) => sum + c.cities.size, 0) / totalCustomers
      ).toFixed(1);
      const multiCityCustomers = customers.filter((c) => c.cities.size > 1).length;

      return (
        <div className="flex-1 border border-slate-300 p-6 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Network Summary</h2>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌐</span>
            <span className="text-xl font-semibold text-slate-800">Overall Network</span>
          </div>

          <div className="space-y-3 overflow-y-auto pb-4 max-h-44 pr-1 text-slate-700">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Total Companies:</span>
              <span className="font-bold">{totalCustomers}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Multi-City Companies:</span>
              <span className="font-bold">{multiCityCustomers}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Avg Cities/Company:</span>
              <span className="font-bold">{avgCitiesPerCustomer}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Top Company:</span>
              <span className="font-bold">{customers[0]?.customer || "N/A"}</span>
            </div>
          </div>
        </div>
      );
    }
  }

  // EXCHANGE VIEW - NCIX Summary
  if (viewMode === "exchange") {
    // If city is selected, show city-specific exchange info
    if (selectedCity) {
      const cityMembers = data.members.filter((m) => m.locationDisplay === selectedCity.city);
      const totalMembers = cityMembers.length;

      const breakdown = {
        "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
        "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
        "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length,
        "Non-Member": cityMembers.filter((m) => m.membershipType === "Non-Member").length
      };

      const uniqueCustomers = [...new Set(cityMembers.map((m) => m.customer))].length;

      return (
        <div className="flex-1 border border-slate-300 p-6 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Exchange Summary</h2>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📍</span>
            <span className="text-xl font-semibold text-slate-800 uppercase">{selectedCity.city}</span>
          </div>

          <div className="overflow-y-auto max-h-44 pr-1">
            <div className="space-y-3 text-slate-700">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-medium">Total Customers:</span>
                <span className="font-bold">{totalMembers}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="font-medium">Unique Customers:</span>
                <span className="font-bold">{uniqueCustomers}</span>
              </div>
              <div className="py-2 border-b border-slate-200">
                <span className="font-medium">Membership Mix:</span>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Member Class A:</span>
                    <span>
                      {totalMembers > 0 ? ((breakdown["Class A"] / totalMembers) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Class B:</span>
                    <span>
                      {totalMembers > 0 ? ((breakdown["Class B"] / totalMembers) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Class C:</span>
                    <span>
                      {totalMembers > 0 ? ((breakdown["Class C"] / totalMembers) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Non Member:</span>
                    <span>
                      {totalMembers > 0 ? ((breakdown["Non-Member"] / totalMembers) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default: Overall NCIX summary
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

        <div className="overflow-y-auto max-h-44 pr-1">
          <div className="space-y-3 text-slate-700">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium">Total Customers:</span>
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

          <div className="mt-6 py-4 border-t-2 border-slate-300">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Top City:</span>
              <span className="font-bold text-slate-800">{topCity?.city || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CitySummary;
