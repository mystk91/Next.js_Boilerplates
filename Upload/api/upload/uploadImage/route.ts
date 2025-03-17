import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileTypes = [".jpg", ".jpeg", ".png", ".svg", ".webp"];
    const file = formData.get("file") as File;
    const type = fileTypes.some((type) =>
      file.name.toLowerCase().endsWith(type)
    );
    if (!type) throw new Error(`Invalid file type`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(`./public/uploads/images/${file.name}`, buffer);

    revalidatePath("/");

    return NextResponse.json({ status: "success" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}
