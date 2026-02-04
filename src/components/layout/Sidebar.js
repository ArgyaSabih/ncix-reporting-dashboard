"use client";

import Link from "next/link";
import LayerToggle from "../dashboard/LayerToggle";

const Sidebar = ({activeLayer, onLayerChange, viewMode, onViewModeChange}) => {
  return (
    <div
      className="w-64 flex flex-col border border-slate-300 p-5 rounded-md bg-white"
      style={{minHeight: "600px"}}
    >
      <LayerToggle
        activeLayer={activeLayer}
        onLayerChange={onLayerChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      <div className="mt-auto">
        <Link href="/upload">
          <button className="w-full h-11 bg-[#AC0505] hover:bg-[#8B0404] text-white font-medium flex justify-center cursor-pointer items-center rounded transition-colors">
            Upload Data
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
