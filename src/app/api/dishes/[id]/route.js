import { getDishById } from "../../../menu/getDishes";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const dish = await getDishById(id);

    if (!dish) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Dish not found." } },
        { status: 404 },
      );
    }

    return Response.json({ data: dish });
  } catch (error) {
    console.error("Dish lookup failed:", error);
    return Response.json(
      { error: { code: "CATALOG_UNAVAILABLE", message: "The menu is temporarily unavailable." } },
      { status: 503 },
    );
  }
}
