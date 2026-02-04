import {NextResponse} from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const processedDir = path.join(process.cwd(), "src", "data", "processed");
    const latestPath = path.join(processedDir, "members-latest.json");
    const facilitiesPath = path.join(processedDir, "facilities.json");

    const [memberContent, facilityContent] = await Promise.all([
      fs.readFile(latestPath, "utf-8"),
      fs.readFile(facilitiesPath, "utf-8").catch(() => "[]")
    ]);

    const memberData = JSON.parse(memberContent);
    const facilityData = JSON.parse(facilityContent);

    return NextResponse.json({
      ...memberData,
      facilities: facilityData
    });
  } catch (error) {
    return NextResponse.json({error: "No data available"}, {status: 404});
  }
}
