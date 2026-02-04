import {NextResponse} from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const processedDir = path.join(process.cwd(), "src", "data", "processed");
    const latestPath = path.join(processedDir, "members-latest.json");

    const content = await fs.readFile(latestPath, "utf-8");
    const data = JSON.parse(content);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({error: "No data available"}, {status: 404});
  }
}
