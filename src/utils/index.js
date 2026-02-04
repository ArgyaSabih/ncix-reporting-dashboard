/**
 * Data Processing Utilities - Index
 * Central export for all data processing functions
 */

// Export location coordinates (no Node.js dependencies, safe for client components)
export {LOCATION_COORDINATES} from "../constants/locations";

// Export custom hooks
export {
  useMemberData,
  useFacilityData,
  groupByLocation,
  getLocationStats,
  getTopLocations,
  getMembershipDistribution,
  groupByRegion,
  filterMembers,
  prepareMapMarkers,
  exportToCSV
} from "../hooks/useDataHooks";

// Export configuration
export {default as dataProcessingConfig} from "../config/dataProcessing.config";
