import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "node:fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const wallpapersPath = path.join(
      process.cwd(),
      "public/images//wallpapers"
    );
    const files = await fs.readdir(wallpapersPath);
    const file = files[Math.floor(Math.random() * files.length)];
    return NextResponse.json({
      status: "success",
      url: `/images/wallpapers/${file}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}
