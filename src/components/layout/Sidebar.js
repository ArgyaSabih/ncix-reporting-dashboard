"use client";

import Link from "next/link";
import LayerToggle from "../dashboard/LayerToggle";

const Sidebar = ({activeLayers, onLayerToggle, viewMode, onViewModeChange}) => {
  return (
    <div className="w-64 flex-shrink-0 flex flex-col border border-slate-300 p-5 rounded-md bg-white h-full overflow-auto">
      <LayerToggle
        activeLayers={activeLayers}
        onLayerToggle={onLayerToggle}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      <div className="mt-auto">
        <Link href="/upload">
          <button className="w-full p-2 bg-[#AC0505] hover:bg-[#8B0404] text-white font-medium flex justify-center cursor-pointer items-center rounded-md transition-colors">
            Upload Data
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
