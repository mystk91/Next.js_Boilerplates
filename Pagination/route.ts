import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(req: NextRequest) {
  try {
    const DEFAULT_PAGE_SIZE = 12;
    const DEFAULT_SORT = "newest";
    const searchParams = req.nextUrl.searchParams;
    let page = Number(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || DEFAULT_SORT;
    //Page size and page size validation
    let pageSize = Number(searchParams.get("pagesize")) || DEFAULT_PAGE_SIZE; //Items that will appear on each page
    if (pageSize < DEFAULT_PAGE_SIZE) {
      pageSize = DEFAULT_PAGE_SIZE;
    } else if (pageSize > 64) {
      pageSize = 64;
    }

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
    const numPages = Math.ceil(wallpapers.length / pageSize);
    //Setting page to be a valid number between 1 and numPages
    if (page > numPages) {
      page = numPages;
    } else if (page < 1) {
      page = 1;
    }

    const returnedWallpapers = wallpapers.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );
    const response = {
      items: returnedWallpapers,
      page: page,
      numPages: numPages,
      pageSize: pageSize,
      sort: sort,
    };

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json({ errors: "Couldn't complete the request" });
  }
}
