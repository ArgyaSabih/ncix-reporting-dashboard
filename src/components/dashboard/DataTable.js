"use client";

import { useState } from "react";
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
  const [membershipFilter, setMembershipFilter] = useState("All");
  const [prevCityId, setPrevCityId] = useState(selectedCity?.city);
  const itemsPerPage = 15;

  if (selectedCity?.city !== prevCityId) {
    setPrevCityId(selectedCity?.city);
    setFacilityPage(0);
    setNetworkPage(0);
    setExchangePage(0);
  }

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
    let filteredMembers = selectedCity
      ? data.members.filter((m) => m.locationDisplay === selectedCity.city)
      : data.members;

    // Filter by membership
    if (membershipFilter !== "All") {
      filteredMembers = filteredMembers.filter(
        (m) => m.membershipType === membershipFilter,
      );
    }

    const startIdx = facilityPage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedMembers = filteredMembers.slice(startIdx, endIdx);
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    // Title by filter
    let titleText = selectedCity
      ? `Members in ${selectedCity.city}`
      : "All Members";
    if (membershipFilter !== "All") {
      titleText += ` - ${membershipFilter}`;
    }

    return (
      <div
        key={selectedCity?.city}
        className="flex-1 border border-slate-300 p-4 rounded-md bg-white flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">{titleText}</h2>
          <select
            value={membershipFilter}
            onChange={(e) => {
              setMembershipFilter(e.target.value);
              setFacilityPage(0); // Reset ke halaman 1
            }}
            className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-700 hover:border-slate-400 cursor-pointer"
          >
            <option value="All">All Classes</option>
            <option value="Class A">Class A</option>
            <option value="Class B">Class B</option>
            <option value="Class C">Class C</option>
            <option value="Non-Member">Non-Member</option>
          </select>
        </div>

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
            Showing {startIdx + 1} - {Math.min(endIdx, filteredMembers.length)}{" "}
            of {filteredMembers.length}
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
    // If city is selected, show customers in that city
    if (selectedCity) {
      const cityMembers = data.members.filter(
        (m) => m.locationDisplay === selectedCity.city,
      );
      const customerGroups = {};
      cityMembers.forEach((member) => {
        if (!customerGroups[member.customer]) {
          customerGroups[member.customer] = {
            customer: member.customer,
            memberships: [],
            count: 0,
          };
        }
        customerGroups[member.customer].memberships.push(member.membershipType);
        customerGroups[member.customer].count++;
      });

      const customers = Object.values(customerGroups).sort(
        (a, b) => b.count - a.count,
      );

      const startIdx = networkPage * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const paginatedCustomers = customers.slice(startIdx, endIdx);
      const totalPages = Math.ceil(customers.length / itemsPerPage);

      return (
        <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Companies in {selectedCity.city}
          </h2>

          <div className="flex-1 overflow-auto" style={{ maxHeight: "300px" }}>
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0">
                <tr className="bg-slate-200 border-b border-slate-300">
                  <th className="text-center p-2 font-semibold text-slate-700 border-r border-slate-300">
                    Company
                  </th>
                  <th className="text-center p-2 font-semibold text-slate-700 border-r border-slate-300">
                    Connections
                  </th>
                  <th className="text-center p-2 font-semibold text-slate-700">
                    Memberships
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((customer, index) => (
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
                      {customer.count}
                    </td>
                    <td className="p-2 text-slate-700 text-xs">
                      {[...new Set(customer.memberships)].join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-slate-500">
                Showing {startIdx + 1} - {Math.min(endIdx, customers.length)} of{" "}
                {customers.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setNetworkPage(Math.max(0, networkPage - 1))}
                  disabled={networkPage === 0}
                  className="px-3 py-1 bg-slate-200 cursor-pointer text-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-slate-600">
                  {networkPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setNetworkPage(Math.min(totalPages - 1, networkPage + 1))
                  }
                  disabled={networkPage === totalPages - 1}
                  className="px-3 py-1 bg-slate-200 cursor-pointer text-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default: Group by customer (overall view)
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
          Company Network
        </h2>

        <div className="flex-1 overflow-auto" style={{ maxHeight: "300px" }}>
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-slate-200 border-b border-slate-300">
                <th className="text-center p-2 font-semibold text-slate-700 border-r border-slate-300">
                  Company
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
                  className="border-b border-slate-200 cursor-pointer hover:bg-blue-50"
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

  // EXCHANGE VIEW - All members overview dengan pagination
  if (viewMode === "exchange") {
    // Filter berdasarkan membership
    let filteredAllMembers = data.members;
    if (membershipFilter !== "All") {
      filteredAllMembers = data.members.filter(
        (m) => m.membershipType === membershipFilter,
      );
    }

    const startIdx = exchangePage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedMembers = filteredAllMembers.slice(startIdx, endIdx);
    const totalPages = Math.ceil(filteredAllMembers.length / itemsPerPage);

    // Tentukan title berdasarkan filter
    const titleText =
      membershipFilter === "All"
        ? "All Customers"
        : `All ${membershipFilter} Customers`;

    return (
      <div className="flex-1 border border-slate-300 p-4 rounded-md bg-white flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">{titleText}</h2>
          <select
            value={membershipFilter}
            onChange={(e) => {
              setMembershipFilter(e.target.value);
              setExchangePage(0); // Reset ke halaman 1
            }}
            className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-700 hover:border-slate-400 cursor-pointer"
          >
            <option value="All">All Classes</option>
            <option value="Class A">Class A</option>
            <option value="Class B">Class B</option>
            <option value="Class C">Class C</option>
            <option value="Non-Member">Non-Member</option>
          </select>
        </div>

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
            Showing {startIdx + 1} -{" "}
            {Math.min(endIdx, filteredAllMembers.length)} of{" "}
            {filteredAllMembers.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setExchangePage(Math.max(0, exchangePage - 1))}
              disabled={exchangePage === 0}
              className="px-3 py-1 bg-slate-200 text-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-slate-600">
              {exchangePage + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setExchangePage(Math.min(totalPages - 1, exchangePage + 1))
              }
              disabled={exchangePage === totalPages - 1}
              className="px-3 py-1 bg-slate-200 text-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DataTable;
