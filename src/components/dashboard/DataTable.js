"use client";

import { useState, useEffect } from "react";
import { useMemberData } from "@/src/utils";

const DataTable = ({
  viewMode,
  selectedCity,
  selectedCustomer,
  onCustomerClick,
}) => {
  const { data, loading } = useMemberData();
  const [facilityPage, setFacilityPage] = useState(0);
  const [networkPage, setNetworkPage] = useState(0);
  const [exchangePage, setExchangePage] = useState(0);
  const itemsPerPage = 15;

  if (loading || !data) {
    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Data Table</h2>
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  // FACILITY VIEW - Members in selected city
  if (viewMode === "facility") {
    const filteredMembers = selectedCity
      ? data.members.filter((m) => m.locationDisplay === selectedCity.city)
      : data.members;

    const startIdx = facilityPage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedMembers = filteredMembers.slice(startIdx, endIdx);
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white flex flex-col">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          {selectedCity ? `Members in ${selectedCity.city}` : "All Members"}
        </h2>

        <div className="flex-1 overflow-auto" style={{ maxHeight: "300px" }}>
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-slate-200 border-b border-slate-300">
                <th className="text-center p-2 font-semibold text-slate-700 border-r border-slate-300">
                  Customer
                </th>
                <th className="text-center p-2 font-semibold text-slate-700 border-r border-slate-300">
                  Location
                </th>
                <th className="text-center p-2 font-semibold text-slate-700">
                  Membership
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className="border-b border-slate-200 hover:bg-blue-50 cursor-pointer"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f8f8f8" : "white",
                  }}
                  onClick={() =>
                    onCustomerClick && onCustomerClick(member.customer)
                  }
                >
                  <td className="p-2 text-slate-800 border-r border-slate-200">
                    {member.customer}
                  </td>
                  <td className="p-2 text-slate-600 border-r border-slate-200">
                    {member.locationDisplay}
                  </td>
                  <td className="p-2 text-slate-700">
                    {member.membershipType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-500">
            Showing {startIdx + 1} - {Math.min(endIdx, filteredMembers.length)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFacilityPage(Math.max(0, facilityPage - 1))}
              disabled={facilityPage === 0}
              className="px-3 py-1 bg-slate-200 text-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-slate-600">
              {facilityPage + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setFacilityPage(Math.min(totalPages - 1, facilityPage + 1))
              }
              disabled={facilityPage === totalPages - 1}
              className="px-3 py-1 bg-slate-200 text-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // NETWORK VIEW - Customer locations table
  if (viewMode === "network") {
    // Group by customer
    const customerGroups = {};
    data.members.forEach((member) => {
      if (!customerGroups[member.customer]) {
        customerGroups[member.customer] = {
          customer: member.customer,
          cities: new Set(),
          memberships: [],
        };
      }
      customerGroups[member.customer].cities.add(member.locationDisplay);
      customerGroups[member.customer].memberships.push(member.membershipType);
    });

    const customers = Object.values(customerGroups)
      .map((c) => ({
        ...c,
        cityCount: c.cities.size,
        citiesList: Array.from(c.cities),
      }))
      .sort((a, b) => b.cityCount - a.cityCount);

    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white flex flex-col">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Customer Network
        </h2>

        <div className="flex-1 overflow-auto" style={{ maxHeight: "300px" }}>
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-slate-200 border-b border-slate-300">
                <th className="text-center p-2 font-semibold text-slate-700 border-r border-slate-300">
                  Customer
                </th>
                <th className="text-center p-2 font-semibold text-slate-700 border-r border-slate-300">
                  Cities
                </th>
                <th className="text-center p-2 font-semibold text-slate-700">
                  Locations
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 15).map((customer, index) => (
                <tr
                  key={customer.customer}
                  className="border-b border-slate-200 hover:bg-blue-50 cursor-pointer"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f8f8f8" : "white",
                  }}
                  onClick={() =>
                    onCustomerClick && onCustomerClick(customer.customer)
                  }
                >
                  <td className="p-2 text-slate-800 border-r border-slate-200 font-medium">
                    {customer.customer}
                  </td>
                  <td className="p-2 text-slate-600 border-r border-slate-200 text-center">
                    {customer.cityCount}
                  </td>
                  <td className="p-2 text-slate-700 text-xs">
                    {customer.citiesList.slice(0, 3).join(", ")}
                    {customer.citiesList.length > 3 ? "..." : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // EXCHANGE VIEW - All members overview
  if (viewMode === "exchange") {
    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white flex flex-col">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          All NCIX Members
        </h2>

        <div className="flex-1 overflow-auto" style={{ maxHeight: "300px" }}>
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-slate-200 border-b border-slate-300">
                <th className="text-center p-2 font-semibold text-slate-700 border-r border-slate-300">
                  Customer
                </th>
                <th className="text-center p-2 font-semibold text-slate-700 border-r border-slate-300">
                  Location
                </th>
                <th className="text-center p-2 font-semibold text-slate-700">
                  Membership
                </th>
              </tr>
            </thead>
            <tbody>
              {data.members.slice(0, 20).map((member, index) => (
                <tr
                  key={member.id}
                  className="border-b border-slate-200 hover:bg-blue-50"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f8f8f8" : "white",
                  }}
                >
                  <td className="p-2 text-slate-800 border-r border-slate-200">
                    {member.customer}
                  </td>
                  <td className="p-2 text-slate-600 border-r border-slate-200">
                    {member.locationDisplay}
                  </td>
                  <td className="p-2 text-slate-700">
                    {member.membershipType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.members.length > 20 && (
            <p className="text-xs text-slate-500 text-center py-2">
              Showing 20 of {data.members.length} results
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default DataTable;
