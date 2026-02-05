"use client";

import {useMemberData} from "@/src/utils";

const Header = () => {
  const {data, loading} = useMemberData();

  const totalMembers = data?.metadata?.totalRecords || 0;
  const period = data?.members?.[0]?.period || "Q4 - 2024";

  // Count unique cities
  const uniqueCities = data?.members ? new Set(data.members.map((m) => m.locationDisplay)).size : 0;
  const totalCities = 12; // Total cities target

  return (
    <div className="w-full bg-[#AC0505] h-20 flex-shrink-0 flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl font-bold mb-2">NeuCentriX • Membership & Presence Dashboard</h1>
      <div className="flex justify-center gap-12 text-sm">
        <div>
          <span className="font-normal">Period: </span>
          <span className="font-semibold">{period}</span>
        </div>
        <div>
          <span className="font-normal">Total Members: </span>
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
