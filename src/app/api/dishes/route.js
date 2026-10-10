import { NextResponse } from "next/server";
import { dishes } from "../../menu/dishes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = 6;
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const filtered = dishes.filter((dish) =>
    [dish.name, dish.category, dish.description].some((value) =>
      value.toLowerCase().includes(search)
    )
  );

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const resolvedPage = Math.min(page, pageCount);
  const start = (resolvedPage - 1) * limit;
  const paginatedDishes = filtered.slice(start, start + limit);
  const hasMore = start + limit < total;

  return NextResponse.json(
    {
      dishes: paginatedDishes,
      hasMore,
      total,
      page: resolvedPage,
      pageCount,
    },
    {
      headers: {
        // Enables bfcache and browser caching for repeat visits
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}