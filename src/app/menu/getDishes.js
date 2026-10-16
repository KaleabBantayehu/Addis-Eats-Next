import "server-only";
import { createClient } from "@/lib/supabase/server";

const DISH_COLUMNS =
  "id, name, description, price, category, image, ingredients";

function normalizeDish(dish) {
  return {
    ...dish,
    id: Number(dish.id),
    price: Number(dish.price),
    ingredients: Array.isArray(dish.ingredients) ? dish.ingredients : [],
  };
}

export async function getDishes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dishes")
    .select(DISH_COLUMNS)
    .eq("is_available", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Could not load the dish catalog from Supabase:", error);
    throw new Error("The menu is temporarily unavailable.");
  }

  return (data ?? []).map(normalizeDish);
}

export async function getDishById(id) {
  const dishId = Number(id);
  if (!Number.isInteger(dishId) || dishId < 1) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dishes")
    .select(DISH_COLUMNS)
    .eq("id", dishId)
    .eq("is_available", true)
    .maybeSingle();

  if (error) {
    console.error("Could not load a dish from Supabase:", error);
    throw new Error("This dish is temporarily unavailable.");
  }

  return data ? normalizeDish(data) : null;
}
