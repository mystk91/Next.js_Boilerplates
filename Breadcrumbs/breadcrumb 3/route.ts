import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const breadcrumbMap: { [key: string]: string } = {
      dictionary: "Das Dictionary",
      "big-words": "Fancy Words",
      expedite: "Expedite (Quicken)",
    };
    const body = await req.json();
    const pathSegments: [] = body.path;
    let res: any = {};
    pathSegments.forEach((path) => {
      res[path] = breadcrumbMap[path] || "";
    });
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ errors: "Couldn't complete the request" });
  }
}
