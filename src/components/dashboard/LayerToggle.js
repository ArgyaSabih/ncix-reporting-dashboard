const LayerToggle = () => {
  return (
    <>
      <h2 className="text-sm font-semibold text-slate-500 uppercase mb-1">
        View Mode
      </h2>

      <div>
        <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
          <input
            type="radio"
            name="view"
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700">Facility View</span>
        </label>

        <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
          <input
            type="radio"
            name="view"
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700">Network View</span>
        </label>

        <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
          <input
            type="radio"
            name="view"
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700">Exchange View</span>
        </label>
      </div>

      <h2 className="text-sm font-semibold text-slate-500 uppercase mb-1">
        Map Layer
      </h2>

      <div>
        <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
          <input
            type="radio"
            name="view"
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700">Customer Heatmap</span>
        </label>

        <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
          <input
            type="radio"
            name="view"
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700">Member Bubbles</span>
        </label>

        <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
          <input
            type="radio"
            name="view"
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700">Trace ASN</span>
        </label>
      </div>
    </>
  );
};

export default LayerToggle;
