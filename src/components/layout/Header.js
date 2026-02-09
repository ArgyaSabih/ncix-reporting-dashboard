"use client";

import {useMemberData} from "@/src/utils";
import {
  usePeriodFilter,
  formatPeriod,
  filterMembersByPeriod,
  extractUniquePeriods
} from "@/src/context/PeriodFilterContext";

const Header = () => {
  const {data, loading} = useMemberData();
  const {selectedPeriod, setSelectedPeriod} = usePeriodFilter();

  // Extract all unique periods from data
  const allPeriods = extractUniquePeriods(data?.members);

  // Filter members by selected period
  const filteredMembers = filterMembersByPeriod(data?.members, selectedPeriod);

  const totalMembers = filteredMembers?.length || 0;

  // Count unique cities based on filtered members
  const uniqueCities = filteredMembers ? new Set(filteredMembers.map((m) => m.locationDisplay)).size : 0;

  return (
    <div className="w-full bg-[#AC0505] h-20 flex-shrink-0 flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl font-bold mb-2">NeuCentriX • Membership & Presence Dashboard</h1>
      <div className="flex justify-center gap-12 text-sm items-center">
        <div className="flex items-center gap-2">
          <span className="font-normal">Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white/20 text-white border border-white/30 rounded px-2 py-0.5 text-sm font-semibold cursor-pointer hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="all" className="text-slate-800">
              All Periods
            </option>
            {allPeriods.map((period) => (
              <option key={period} value={period} className="text-slate-800">
                {formatPeriod(period)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="font-normal">Total Customers: </span>
          <span className="font-semibold">{loading ? "..." : totalMembers}</span>
        </div>
        <div>
          <span className="font-normal">Cities Covered: </span>
          <span className="font-semibold">{loading ? "..." : `${uniqueCities}`}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
