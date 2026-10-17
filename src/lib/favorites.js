import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getFavoriteIdsForUser(userId) {
  if (typeof userId !== "string" || !userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("dish_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Could not load the user's favorite dishes:", error);
    throw new Error("Your favorites are temporarily unavailable.");
  }

  return (data ?? []).map(({ dish_id: dishId }) => String(dishId));
}

export async function setFavoriteForUser(userId, dishId, isFavorite) {
  const supabase = await createClient();

  if (isFavorite) {
    const { error } = await supabase
      .from("favorites")
      .upsert(
        { user_id: userId, dish_id: Number(dishId) },
        { onConflict: "user_id,dish_id", ignoreDuplicates: true },
      );

    if (error) {
      console.error("Could not save the user's favorite dish:", error);
      throw new Error("This dish could not be saved to your favorites.");
    }

    return;
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("dish_id", Number(dishId));

  if (error) {
    console.error("Could not remove the user's favorite dish:", error);
    throw new Error("This dish could not be removed from your favorites.");
  }
}
