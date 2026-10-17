import "server-only";
import { createClient } from "@/lib/supabase/server";

function normalizeDish(dish) {
  const imageUrl =
    (typeof dish.image_url === "string" && dish.image_url.trim() && dish.image_url) ||
    (typeof dish.image === "string" && dish.image.trim() && dish.image) ||
    null;

  return {
    id: Number(dish.id),
    name: dish.name,
    description: dish.description,
    price: Number(dish.price),
    category: dish.category,
    image_url: imageUrl,
    ingredients: Array.isArray(dish.ingredients) ? dish.ingredients : [],
    is_available: dish.is_available,
    is_hidden: dish.is_hidden,
    finished_today: dish.finished_today,
    available: dish.is_available !== false,
    orderable: dish.is_available !== false && dish.finished_today !== true,
    finishedToday: dish.finished_today === true,
    isHidden: dish.is_hidden === true,
  };
}

export async function getDishes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
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
    .select("*")
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
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Could not load dishes for management:", error);
    throw new Error("Dish management is temporarily unavailable.");
  }

  return (data ?? []).map(normalizeDish);
}
