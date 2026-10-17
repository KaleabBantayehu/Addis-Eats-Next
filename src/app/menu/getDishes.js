import "server-only";
import { createClient } from "@/lib/supabase/server";

const DISH_COLUMNS =
  "id, name, description, price, category, image_url, ingredients, is_available, is_hidden, finished_today";

function normalizeDish(dish) {
  return {
    ...dish,
    id: Number(dish.id),
    price: Number(dish.price),
    image: dish.image_url || dish.image || "",
    imageUrl: dish.image_url || dish.image || "",
    available: dish.is_available !== false,
    orderable: dish.is_available !== false && dish.finished_today !== true,
    finishedToday: dish.finished_today === true,
    isHidden: dish.is_hidden === true,
    ingredients: Array.isArray(dish.ingredients) ? dish.ingredients : [],
  };
}

export async function getDishes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dishes")
    .select(DISH_COLUMNS)
    .eq("is_hidden", false)
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
    .eq("is_hidden", false)
    .maybeSingle();

  if (error) {
    console.error("Could not load a dish from Supabase:", error);
    throw new Error("This dish is temporarily unavailable.");
  }

  return data ? normalizeDish(data) : null;
}

export async function getDishesForManagement() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dishes")
    .select(DISH_COLUMNS)
    .order("id", { ascending: true });

  if (error) {
    console.error("Could not load dishes for management:", error);
    throw new Error("Dish management is temporarily unavailable.");
  }

  return (data ?? []).map(normalizeDish);
}
