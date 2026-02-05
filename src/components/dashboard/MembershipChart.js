"use client";

import {useMemberData, getMembershipDistribution, getLocationStats} from "@/src/utils";

const MembershipChart = ({viewMode, selectedCity, selectedCustomer}) => {
  const {data, loading} = useMemberData();

  if (loading || !data) {
    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Analytics</h2>
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const membershipColors = {
    "Class A": "#3b82f6",
    "Class B": "#10b981",
    "Class C": "#f59e0b",
    "Non-Member": "#6b7280"
  };

  // FACILITY VIEW - City Membership Mix
  if (viewMode === "facility") {
    const cityMembers = selectedCity
      ? data.members.filter((m) => m.locationDisplay === selectedCity.city)
      : data.members;

    const total = cityMembers.length;
    const breakdown = {
      "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
      "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
      "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length,
      "Non-Member": cityMembers.filter((m) => m.membershipType === "Non-Member").length
    };

    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          {selectedCity ? `Membership Mix - ${selectedCity.city}` : "Overall Membership Mix"}
        </h2>
        <div className="overflow-auto max-h-56 pr-1">
          <div className="space-y-4">
            {Object.entries(breakdown).map(([type, count]) => {
              const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{backgroundColor: membershipColors[type]}}
                      ></div>
                      <span className="font-medium text-slate-700">{type}</span>
                    </div>
                    <span className="font-bold text-slate-800">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: membershipColors[type]
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pb-2 pt-4 border-t border-slate-200">
            <div className="text-center p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-slate-600 mb-1">Total Members</p>
              <p className="text-2xl font-bold text-blue-600">{total}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NETWORK VIEW - Customer presence chart
  if (viewMode === "network") {
    // If city is selected, show customers in that city
    if (selectedCity) {
      const cityMembers = data.members.filter((m) => m.locationDisplay === selectedCity.city);
      const customerGroups = {};
      cityMembers.forEach((member) => {
        if (!customerGroups[member.customer]) {
          customerGroups[member.customer] = {
            customer: member.customer,
            count: 0
          };
        }
        customerGroups[member.customer].count++;
      });

      const customers = Object.values(customerGroups)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      const maxCount = customers[0]?.count || 1;

      return (
        <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Top Customers in {selectedCity.city}</h2>

          <div className="space-y-3 overflow-y-auto max-h-56 pr-1 pb-4">
            {customers.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No customers in this city</p>
            ) : (
              customers.map((customer, index) => (
                <div key={customer.customer} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-700 truncate" style={{maxWidth: "150px"}}>
                      {customer.customer}
                    </span>
                    <span className="font-bold text-slate-800">{customer.count} connections</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(customer.count / maxCount) * 100}%`,
                        backgroundColor: `hsl(${260 - index * 20}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    // Default: Group by customer and count cities (overall view)
    const customerGroups = {};
    data.members.forEach((member) => {
      if (!customerGroups[member.customer]) {
        customerGroups[member.customer] = {
          customer: member.customer,
          cities: new Set()
        };
      }
      customerGroups[member.customer].cities.add(member.locationDisplay);
    });

    const customers = Object.values(customerGroups)
      .map((c) => ({...c, cityCount: c.cities.size}))
      .sort((a, b) => b.cityCount - a.cityCount)
      .slice(0, 8);

    const maxCities = Math.max(...customers.map((c) => c.cityCount));

    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Locations per Customer</h2>

        <div className="space-y-3 overflow-y-auto max-h-56 pr-1 pb-4">
          {customers.map((customer, index) => (
            <div key={customer.customer} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700 truncate" style={{maxWidth: "150px"}}>
                  {customer.customer}
                </span>
                <span className="font-bold text-slate-800">{customer.cityCount} cities</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(customer.cityCount / maxCities) * 100}%`,
                    backgroundColor: `hsl(${260 - index * 20}, 70%, 50%)`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // EXCHANGE VIEW - Overall membership distribution
  if (viewMode === "exchange") {
    // If city is selected, show membership breakdown for that city
    if (selectedCity) {
      const cityMembers = data.members.filter((m) => m.locationDisplay === selectedCity.city);
      const total = cityMembers.length;
      const breakdown = {
        "Class A": cityMembers.filter((m) => m.membershipType === "Class A").length,
        "Class B": cityMembers.filter((m) => m.membershipType === "Class B").length,
        "Class C": cityMembers.filter((m) => m.membershipType === "Class C").length,
        "Non-Member": cityMembers.filter((m) => m.membershipType === "Non-Member").length
      };

      return (
        <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Membership in {selectedCity.city}</h2>

          <div className="space-y-3 overflow-y-auto max-h-56 pr-1">
            <div className="space-y-4">
              {Object.entries(breakdown).map(([type, count]) => {
                const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{backgroundColor: membershipColors[type]}}
                        ></div>
                        <span className="font-medium text-slate-700">{type}</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: membershipColors[type]
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pb-2 pt-4 border-t border-slate-200">
              <div className="text-center p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-slate-600 mb-1">Total Members in City</p>
                <p className="text-2xl font-bold text-blue-600">{total}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default: Overall top cities view
    const locationStats = getLocationStats(data.members);
    const topCities = locationStats.slice(0, 5);
    const maxCount = topCities[0]?.count || 1;

    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Top Cities by Members</h2>

        <div className="space-y-3 overflow-y-auto max-h-56 pr-1">
          <div className="space-y-3 ">
            {topCities.map((city, index) => (
              <div key={city.location} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">{city.city}</span>
                  <span className="font-bold text-slate-800">{city.count}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(city.count / maxCount) * 100}%`,
                      backgroundColor: `hsl(${200 + index * 15}, 70%, 50%)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pb-2 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-slate-600 mb-1">Total Cities</p>
                <p className="text-xl font-bold text-blue-600">{locationStats.length}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-md">
                <p className="text-xs text-slate-600 mb-1">Total Members</p>
                <p className="text-xl font-bold text-green-600">{data.members.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MembershipChart;
