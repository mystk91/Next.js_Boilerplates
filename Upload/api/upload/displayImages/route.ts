import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";

export async function GET(req: NextRequest) {
  try {
    const files = await fs.readdir("./public/uploads/images");
    const fileTypes = [".jpg", ".jpeg", ".png", ".svg", ".webp"];
    const images = files
      .filter((file) => fileTypes.some((type) => file.endsWith(type)))
      .map((file) => `/uploads/images/${file}`);

    return NextResponse.json({ status: "success", images: images });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}
