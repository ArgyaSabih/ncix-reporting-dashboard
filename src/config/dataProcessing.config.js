/**
 * Configuration for NCIX Data Processing
 * Customize these values according to your needs
 */

module.exports = {
  // Directory paths
  paths: {
    raw: "./src/data/raw",
    processed: "./src/data/processed"
  },

  // Location coordinate mappings
  // Format: 'LOCATION_NAME': { lat: number, lng: number, city: string, region: string }
  locations: {
    // Jakarta
    "JAKARTA MERUYA": {lat: -6.1916, lng: 106.7285, city: "Jakarta", region: "DKI Jakarta"},
    "JAKARTA JATINEGARA": {lat: -6.215, lng: 106.8708, city: "Jakarta", region: "DKI Jakarta"},
    "JAKARTA KARET TENGSIN": {lat: -6.1977, lng: 106.8186, city: "Jakarta", region: "DKI Jakarta"},

    // Surabaya
    "SURABAYA KEBALEN": {lat: -7.2575, lng: 112.7521, city: "Surabaya", region: "Jawa Timur"},
    "SURABAYA GUBENG": {lat: -7.265, lng: 112.752, city: "Surabaya", region: "Jawa Timur"},

    // Bandung
    "BANDUNG LEMBONG": {lat: -6.9175, lng: 107.6191, city: "Bandung", region: "Jawa Barat"},

    // Kalimantan
    "BALIKPAPAN BATUAMPAR": {lat: -1.2379, lng: 116.8529, city: "Balikpapan", region: "Kalimantan Timur"},
    "BALIKPAPAN SEPAKU": {lat: -1.1393, lng: 116.889, city: "Balikpapan", region: "Kalimantan Timur"},
    "BANJARMASIN ULIN": {lat: -3.3186, lng: 114.59, city: "Banjarmasin", region: "Kalimantan Selatan"},
    "PONTIANAK CENTRUM": {lat: -0.0263, lng: 109.3425, city: "Pontianak", region: "Kalimantan Barat"},

    // Semarang
    "SEMARANG CANDI": {lat: -7.0051, lng: 110.4381, city: "Semarang", region: "Jawa Tengah"},
    "SEMARANG BANYUMANIK": {lat: -7.052, lng: 110.438, city: "Semarang", region: "Jawa Tengah"},

    // Yogyakarta
    "YOGYAKARTA KOTABARU": {lat: -7.7956, lng: 110.3695, city: "Yogyakarta", region: "DI Yogyakarta"},
    "PUGERAN YOGYAKARTA": {lat: -7.7956, lng: 110.3695, city: "Yogyakarta", region: "DI Yogyakarta"},

    // Denpasar
    "DENPASAR KALIASEM": {lat: -8.655, lng: 115.2185, city: "Denpasar", region: "Bali"},

    // Lampung
    "LAMPUNG TANJUNG KARANG": {lat: -5.4292, lng: 105.2625, city: "Bandar Lampung", region: "Lampung"},

    // Palembang
    "PALEMBANG TALANG KALAPA": {lat: -2.9761, lng: 104.7754, city: "Palembang", region: "Sumatera Selatan"},

    // Manado
    "MANADO PANIKI": {lat: 1.4748, lng: 124.8421, city: "Manado", region: "Sulawesi Utara"},

    // Pekanbaru
    "PEKANBARU CENTRUM": {lat: 0.5071, lng: 101.4478, city: "Pekanbaru", region: "Riau"},

    // Makassar
    "MAKASSAR MATOANGIN": {lat: -5.1477, lng: 119.4327, city: "Makassar", region: "Sulawesi Selatan"},

    // Malang
    MALANG: {lat: -7.9666, lng: 112.6326, city: "Malang", region: "Jawa Timur"},

    // Medan
    MEDAN: {lat: 3.5952, lng: 98.6722, city: "Medan", region: "Sumatera Utara"},

    // Batam
    BATAM: {lat: 1.1303, lng: 104.053, city: "Batam", region: "Kepulauan Riau"},

    // Aceh
    ACEH: {lat: 5.5483, lng: 95.3238, city: "Banda Aceh", region: "Aceh"},

    // Cirebon
    CIREBON: {lat: -6.7063, lng: 108.5571, city: "Cirebon", region: "Jawa Barat"}
  },

  // Membership type classifications
  // The system will check for these keywords in the MEMBERSHIP_NCIX column
  membershipTypes: {
    "Class A": ["class a", "membership class a"],
    "Class B": ["class b", "membership class b"],
    "Class C": ["class c", "membership class c"],
    Member: ["member"],
    "Non-Member": ["", null, undefined]
  },

  // CSV column mapping
  // Map your CSV column names to internal field names
  csvColumns: {
    period: "PERIOD",
    customer: "CUSTOMER",
    location: "LOCATION_DC",
    membership: "MEMBERSHIP_NCIX"
  },

  // Processing options
  options: {
    // Skip validation errors
    skipInvalidRows: true,

    // Log warnings for unknown locations
    logUnknownLocations: true,

    // Generate timestamp in filename
    useTimestamp: true,

    // Keep historical versions
    keepHistoricalVersions: true,

    // Maximum file retention (in days)
    maxFileRetention: 90
  },

  // Output format options
  output: {
    // Include metadata in output
    includeMetadata: true,

    // Include location list in output
    includeLocationList: true,

    // Pretty print JSON (set to 0 or null for minified)
    jsonIndent: 2,

    // Default export filename pattern
    filenamePattern: "members-{date}.json",
    latestFilename: "members-latest.json",
    facilitiesFilename: "facilities.json"
  },

  // Statistics to calculate
  statistics: {
    // Calculate members per location
    membersByLocation: true,

    // Calculate membership type distribution
    membershipDistribution: true,

    // Calculate regional distribution
    regionalDistribution: true,

    // Track processing metrics
    processingMetrics: true
  }
};
