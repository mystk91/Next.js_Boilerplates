import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: NextRequest) {
  try {
    const DEFAULT_PAGE_SIZE = 12;
    const DEFAULT_SORT = "newest";

    const body = await req.json();
    //let page = Number(searchParams.get("page")) || 1;
    const sort = body.sort || DEFAULT_SORT;
    //Page size and page size validation
    let pageSize = DEFAULT_PAGE_SIZE; //Items that will appear on each page

    //Retreiving item from DB
    const filePath = path.join(process.cwd(), "data/wallpapers.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    let wallpapers = JSON.parse(fileContent);

    //Sorting our items by the "sort" type
    switch (sort) {
      case `popular`:
        wallpapers.sort(function (
          a: { viewCount: number },
          b: { viewCount: number }
        ) {
          return b.viewCount - a.viewCount;
        });
        break;
      case `oldest`:
        wallpapers.sort(function (
          a: { dateCreated: Date },
          b: { dateCreated: Date }
        ) {
          return (
            new Date(a.dateCreated).getTime() -
            new Date(b.dateCreated).getTime()
          );
        });
        break;
      case `best`:
        wallpapers = wallpapers.filter((wallpaper: any) => {
          return wallpaper.viewCount > 9999;
        });
        wallpapers.sort(function (
          a: { rating: number },
          b: { rating: number }
        ) {
          return b.rating - a.rating;
        });
        break;
      default: // Sorts by newest by default
        wallpapers.sort(function (
          a: { dateCreated: Date },
          b: { dateCreated: Date }
        ) {
          return (
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime()
          );
        });
    }

    let lastIndex = 0;
    if (body.lastItem) {
      for (let i = 0; i < wallpapers.length; i++) {
        if (wallpapers[i].fileName === body.lastItem.fileName) {
          lastIndex = i + 1;
          break;
        }
      }
    }

    const returnedWallpapers = wallpapers.slice(
      lastIndex,
      lastIndex + pageSize
    );
    const response = {
      items: returnedWallpapers,
      lastItem: returnedWallpapers[returnedWallpapers.length - 1],
      sort: sort,
    };

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json({ errors: "Couldn't complete the request" });
  }
}
