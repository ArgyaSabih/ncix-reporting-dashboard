import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Validasi Kolom File CSV
const REQUIRED_COLUMNS = [
  "PERIOD",
  "CUSTOMER",
  "LOCATION_DC",
  "MEMBERSHIP_NCIX",
];

function validateCSVHeaders(headers) {
  const missingColumns = REQUIRED_COLUMNS.filter(
    (col) => !headers.includes(col),
  );

  if (missingColumns.length > 0) {
    throw new Error(`❌ Kolom yang hilang: ${missingColumns.join(", ")}`);
  }

  return true;
}

// Import locations
const LOCATION_COORDINATES = {
  "JAKARTA KARET TENGSIN": {
    city: "Jakarta",
    region: "DKI Jakarta",
    lat: -6.1944,
    lng: 106.8229,
  },
  "JAKARTA JATINEGARA": {
    city: "Jakarta",
    region: "DKI Jakarta",
    lat: -6.2146,
    lng: 106.8707,
  },
  "JAKARTA MERUYA": {
    city: "Jakarta",
    region: "DKI Jakarta",
    lat: -6.1951,
    lng: 106.7328,
  },
  "SURABAYA GUBENG": {
    city: "Surabaya",
    region: "Jawa Timur",
    lat: -7.2651,
    lng: 112.7524,
  },
  "SURABAYA KEBALEN": {
    city: "Surabaya",
    region: "Jawa Timur",
    lat: -7.2775,
    lng: 112.7391,
  },
  "BANDUNG LEMBONG": {
    city: "Bandung",
    region: "Jawa Barat",
    lat: -6.9175,
    lng: 107.6191,
  },
  "SEMARANG CANDI": {
    city: "Semarang",
    region: "Jawa Tengah",
    lat: -7.0051,
    lng: 110.4381,
  },
  "YOGYAKARTA KOTABARU": {
    city: "Yogyakarta",
    region: "DI Yogyakarta",
    lat: -7.7956,
    lng: 110.3695,
  },
  "MEDAN CENTRUM": {
    city: "Medan",
    region: "Sumatera Utara",
    lat: 3.5952,
    lng: 98.6722,
  },
  "PALEMBANG TALANG KALAPA": {
    city: "Palembang",
    region: "Sumatera Selatan",
    lat: -2.9761,
    lng: 104.7754,
  },
  "PEKANBARU CENTRUM": {
    city: "Pekanbaru",
    region: "Riau",
    lat: 0.5071,
    lng: 101.4478,
  },
  "LAMPUNG TANJUNG KARANG": {
    city: "Bandar Lampung",
    region: "Lampung",
    lat: -5.4291,
    lng: 105.2619,
  },
  "DENPASAR KALIASEM": {
    city: "Denpasar",
    region: "Bali",
    lat: -8.6705,
    lng: 115.2126,
  },
  "MAKASSAR MATOANGIN": {
    city: "Makassar",
    region: "Sulawesi Selatan",
    lat: -5.1477,
    lng: 119.4327,
  },
  "MANADO PANIKI": {
    city: "Manado",
    region: "Sulawesi Utara",
    lat: 1.4748,
    lng: 124.8421,
  },
  "BALIKPAPAN BATUAMPAR": {
    city: "Balikpapan",
    region: "Kalimantan Timur",
    lat: -1.2379,
    lng: 116.8529,
  },
  "BANJARMASIN ULIN": {
    city: "Banjarmasin",
    region: "Kalimantan Selatan",
    lat: -3.3194,
    lng: 114.5906,
  },
  "PONTIANAK CENTRUM": {
    city: "Pontianak",
    region: "Kalimantan Barat",
    lat: -0.0263,
    lng: 109.3425,
  },
  "BATAM CENTRE": {
    city: "Batam",
    region: "Kepulauan Riau",
    lat: 1.1303,
    lng: 104.0533,
  },
  "ACEH CENTRUM": {
    city: "Banda Aceh",
    region: "Aceh",
    lat: 5.5577,
    lng: 95.3222,
  },
  MALANG: { city: "Malang", region: "Jawa Timur", lat: -7.9666, lng: 112.6326 },
  CIREBON: {
    city: "Cirebon",
    region: "Jawa Barat",
    lat: -6.7063,
    lng: 108.557,
  },
  "PUGERAN YOGYAKARTA": {
    city: "Yogyakarta",
    region: "DI Yogyakarta",
    lat: -7.7956,
    lng: 110.3695,
  },
  "BATAM CENTRE LT 4": {
    city: "Batam",
    region: "Kepulauan Riau",
    lat: 1.1303,
    lng: 104.0533,
  },
  "BATAM BUKITDANGAS": {
    city: "Batam",
    region: "Kepulauan Riau",
    lat: 1.1303,
    lng: 104.0533,
  },
  "SEMARANG BANYUMANIK": {
    city: "Semarang",
    region: "Jawa Tengah",
    lat: -7.0051,
    lng: 110.4381,
  },
};

function parseCSV(csvContent) {
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(",").map((v) => v.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    data.push(row);
  }

  return data;
}

function normalizeLocation(location) {
  if (!location) return null;

  const normalized = location.toUpperCase().trim();

  if (LOCATION_COORDINATES[normalized]) {
    return normalized;
  }

  for (const key in LOCATION_COORDINATES) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return key;
    }
  }

  return null;
}

function classifyMembership(membershipText) {
  if (!membershipText) return "Non-Member";

  const text = membershipText.toLowerCase();

  if (text.includes("class a")) return "Class A";
  if (text.includes("class b")) return "Class B";
  if (text.includes("class c")) return "Class C";

  return "Member";
}

function processCSVData(rawData) {
  const processedData = [];
  const statistics = {
    total: rawData.length,
    processed: 0,
    skipped: 0,
    membersByLocation: {},
    membershipTypes: {
      "Class A": 0,
      "Class B": 0,
      "Class C": 0,
      Member: 0,
      "Non-Member": 0,
    },
  };

  rawData.forEach((row, index) => {
    if (!row.CUSTOMER || !row.LOCATION_DC) {
      statistics.skipped++;
      return;
    }

    const normalizedLocation = normalizeLocation(row.LOCATION_DC);

    if (!normalizedLocation) {
      console.warn(
        `Unknown location "${row.LOCATION_DC}" for customer ${row.CUSTOMER}`,
      );
      statistics.skipped++;
      return;
    }

    const coordinates = LOCATION_COORDINATES[normalizedLocation];
    const membershipType = classifyMembership(row.MEMBERSHIP_NCIX);

    const processedRow = {
      id: index + 1,
      period: row.PERIOD,
      customer: row.CUSTOMER,
      location: normalizedLocation,
      locationDisplay: coordinates.city,
      region: coordinates.region,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      membershipType: membershipType,
      membershipRaw: row.MEMBERSHIP_NCIX || "",
    };

    processedData.push(processedRow);
    statistics.processed++;

    if (!statistics.membersByLocation[normalizedLocation]) {
      statistics.membersByLocation[normalizedLocation] = 0;
    }
    statistics.membersByLocation[normalizedLocation]++;
    statistics.membershipTypes[membershipType]++;
  });

  return {
    data: processedData,
    statistics,
  };
}

export async function POST(request) {
  try {
    console.log("📁 Upload request received");

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are allowed" },
        { status: 400 },
      );
    }

    console.log("📄 Processing file:", file.name);

    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const csvContent = buffer.toString("utf-8");

    console.log("📊 Parsing CSV data...");

    // Parse and process CSV
    const rawData = parseCSV(csvContent);
    console.log(`✓ Parsed ${rawData.length} rows`);

    // ✅ VALIDASI KOLOM CSV (Penting!)
    const headers = csvContent
      .trim()
      .split("\n")[0]
      .split(",")
      .map((h) => h.trim());
    validateCSVHeaders(headers);
    console.log(`✓ Validasi kolom: ${headers.join(", ")}`);

    const { data: processedData, statistics } = processCSVData(rawData);
    console.log(
      `✓ Processed ${statistics.processed} records, skipped ${statistics.skipped}`,
    );

    // Create output
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .split("T")[0];
    const output = {
      metadata: {
        processedAt: new Date().toISOString(),
        sourceFile: file.name,
        totalRecords: processedData.length,
        statistics,
      },
      locations: Object.keys(LOCATION_COORDINATES).map((key) => ({
        name: key,
        ...LOCATION_COORDINATES[key],
      })),
      members: processedData,
    };

    // Save files
    const outputDir = path.join(process.cwd(), "src", "data", "processed");
    await fs.mkdir(outputDir, { recursive: true });

    const outputFileName = `members-${timestamp}.json`;
    const outputPath = path.join(outputDir, outputFileName);
    const latestPath = path.join(outputDir, "members-latest.json");

    await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf-8");
    await fs.writeFile(latestPath, JSON.stringify(output, null, 2), "utf-8");

    console.log(`✓ Saved to ${outputFileName} and members-latest.json`);

    return NextResponse.json({
      success: true,
      message: "Data processed successfully",
      statistics: statistics,
      outputFile: outputFileName,
    });
  } catch (error) {
    console.error("❌ Error processing upload:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process file" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const processedDir = path.join(process.cwd(), "src", "data", "processed");

    // Check if latest file exists
    const latestPath = path.join(processedDir, "members-latest.json");

    try {
      const content = await fs.readFile(latestPath, "utf-8");
      const data = JSON.parse(content);

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "No processed data available yet",
      });
    }
  } catch (error) {
    console.error("Error reading processed data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to read data" },
      { status: 500 },
    );
  }
}
