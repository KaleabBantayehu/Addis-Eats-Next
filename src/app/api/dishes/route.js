import { NextResponse } from "next/server";
import { getDishes } from "../../menu/getDishes";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = 6;
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const dishes = await getDishes();

    const filtered = dishes.filter((dish) =>
      [dish.name, dish.category, dish.description].some((value) =>
        value.toLowerCase().includes(search),
      ),
    );

    const total = filtered.length;
    const pageCount = Math.max(1, Math.ceil(total / limit));
    const resolvedPage = Math.min(page, pageCount);
    const start = (resolvedPage - 1) * limit;
    const paginatedDishes = filtered.slice(start, start + limit);

    return NextResponse.json(
      {
        dishes: paginatedDishes,
        hasMore: start + limit < total,
        total,
        page: resolvedPage,
        pageCount,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Dish search failed:", error);
    return NextResponse.json(
      { error: { code: "CATALOG_UNAVAILABLE", message: "The menu is temporarily unavailable." } },
      { status: 503 },
    );
  }
}
