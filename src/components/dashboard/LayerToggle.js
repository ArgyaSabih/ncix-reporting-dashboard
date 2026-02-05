"use client";

const LayerToggle = ({activeLayers, onLayerToggle, viewMode, onViewModeChange}) => {
  return (
    <div className="space-y-1">
      <div>
        <h2 className="text-sm font-semibold text-slate-600 mb-3">View Mode</h2>
        <div>
          <label
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${viewMode === "facility" ? "bg-blue-50 border border-blue-300" : "hover:bg-slate-50"}`}
          >
            <input
              type="radio"
              name="viewMode"
              value="facility"
              checked={viewMode === "facility"}
              onChange={(e) => onViewModeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Facility View</span>
          </label>
          <label
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${viewMode === "network" ? "bg-blue-50 border border-blue-300" : "hover:bg-slate-50"}`}
          >
            <input
              type="radio"
              name="viewMode"
              value="network"
              checked={viewMode === "network"}
              onChange={(e) => onViewModeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Network View</span>
          </label>
          <label
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${viewMode === "exchange" ? "bg-blue-50 border border-blue-300" : "hover:bg-slate-50"}`}
          >
            <input
              type="radio"
              name="viewMode"
              value="exchange"
              checked={viewMode === "exchange"}
              onChange={(e) => onViewModeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Exchange View</span>
          </label>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-600 mb-3">Map Layers</h2>

        <div className="space-y-2">
          <label
            className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
              activeLayers.includes("heatmap")
                ? "bg-blue-50 border-2 border-blue-500"
                : "hover:bg-slate-50 border-2 border-transparent"
            }`}
          >
            <input
              type="checkbox"
              checked={activeLayers.includes("heatmap")}
              onChange={() => onLayerToggle("heatmap")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <div className="flex-1">
              <span className="text-slate-800 font-medium">Presence Heatmap</span>
              <p className="text-xs text-slate-500 mt-0.5">Heat by member count</p>
            </div>
          </label>

          <label
            className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
              activeLayers.includes("bubbles")
                ? "bg-blue-50 border-2 border-blue-500"
                : "hover:bg-slate-50 border-2 border-transparent"
            }`}
          >
            <input
              type="checkbox"
              checked={activeLayers.includes("bubbles")}
              onChange={() => onLayerToggle("bubbles")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <div className="flex-1">
              <span className="text-slate-800 font-medium">Presence Bubbles</span>
              <p className="text-xs text-slate-500 mt-0.5">Bubble size by member count</p>
            </div>
          </label>

          <label
            className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
              activeLayers.includes("trace-asn")
                ? "bg-blue-50 border-2 border-blue-500"
                : "hover:bg-slate-50 border-2 border-transparent"
            }`}
          >
            <input
              type="checkbox"
              checked={activeLayers.includes("trace-asn")}
              onChange={() => onLayerToggle("trace-asn")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <div className="flex-1">
              <span className="text-slate-800 font-medium">Trace ASN</span>
              <p className="text-xs text-slate-500 mt-0.5">Network topology</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LayerToggle;
