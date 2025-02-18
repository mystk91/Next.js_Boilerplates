import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { query: string } }
) {
  try {
    const suggestions = [
      { label: "Hawaii", href: "/search?q=Hawaii" },
      { label: "Hawaii Volcano", href: "/search?q=Hawaii+Volcano" },
      { label: "Hawaii Surfing", href: "/search?q=Hawaii+Surfing" },
      { label: "Hawaiian Food", href: "/search?q=Hawaii+Food" },
      { label: "Alaska", href: "/search?q=Alaska" },
      { label: "Alaska Cruises", href: "/search?q=Alaska+Cruises" },
      { label: "Alaskan Wildlife", href: "/search?q=Alaskan+Wildlife" },
      { label: "Applesauce", href: "/search?q=Applesauce" },
      { label: "Apple Cider", href: "/search?q=Apple+Cider" },
      { label: "Apple Juice", href: "/search?q=Apple+Juice" },
      {
        label: "Apple Orchards Near Me",
        href: "/search?q=Apple+Orchards+Near+Me",
      },
      { label: "North Pole", href: "/search?q=North+Pole" },
      { label: "Northern Lights", href: "/search?q=Northern+Lights" },
      { label: "North Carolina", href: "/search?q=North+Carolina" },
    ];

    const results: { label: string; href: string }[] = [];
    let maxSuggestions = 5;
    for (const suggestion of suggestions) {
      if (
        suggestion.label.toLowerCase().startsWith(params.query.toLowerCase())
      ) {
        results.push(suggestion);
        maxSuggestions--;
        if (maxSuggestions === 0) {
          break;
        }
      }
    }
    const response = {
      suggestions: results,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ errors: "Couldn't complete the request" });
  }
}
