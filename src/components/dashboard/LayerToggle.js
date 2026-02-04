"use client";

const LayerToggle = ({activeLayer, onLayerChange, viewMode, onViewModeChange}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-600 mb-3">View Mode</h2>
        <div className="space-y-1">
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
        <h2 className="text-sm font-semibold text-slate-600 mb-3">Map Layer</h2>

        <div className="space-y-2">
          <label
            className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
              activeLayer === "heatmap"
                ? "bg-blue-50 border-2 border-blue-500"
                : "hover:bg-slate-50 border-2 border-transparent"
            }`}
          >
            <input
              type="radio"
              name="layer"
              value="heatmap"
              checked={activeLayer === "heatmap"}
              onChange={(e) => onLayerChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-slate-800 font-medium">Presence Heatmap</span>
              <p className="text-xs text-slate-500 mt-0.5">Heat by member count</p>
            </div>
          </label>

          <label
            className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
              activeLayer === "bubbles"
                ? "bg-blue-50 border-2 border-blue-500"
                : "hover:bg-slate-50 border-2 border-transparent"
            }`}
          >
            <input
              type="radio"
              name="layer"
              value="bubbles"
              checked={activeLayer === "bubbles"}
              onChange={(e) => onLayerChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-slate-800 font-medium">Member Bubbles</span>
              <p className="text-xs text-slate-500 mt-0.5">Bubble size = unique members</p>
            </div>
          </label>

          <label
            className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
              activeLayer === "trace-asn"
                ? "bg-blue-50 border-2 border-blue-500"
                : "hover:bg-slate-50 border-2 border-transparent"
            }`}
          >
            <input
              type="radio"
              name="layer"
              value="trace-asn"
              checked={activeLayer === "trace-asn"}
              onChange={(e) => onLayerChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
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
