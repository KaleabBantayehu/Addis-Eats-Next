import { dishes } from "../../../menu/dishes";

export async function GET(request, { params }) {
  const { id } = await params;

  const dish = dishes.find(
    (dish) => String(dish.id) === id
  );

  if (!dish) {
    return Response.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Dish not found.",
        },
      },
      {
        status: 404,
      }
    );
  }

  return Response.json({
    data: dish,
  });
}