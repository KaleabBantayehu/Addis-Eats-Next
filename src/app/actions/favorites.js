"use server";

import { revalidatePath } from "next/cache";
import { setFavoriteForUser } from "@/lib/favorites";
import { getSession } from "@/lib/session";
import { getDishById } from "@/app/menu/getDishes";

export async function setFavoriteAction(rawDishId, isFavorite) {
  const session = await getSession();

  if (!session) {
    return { ok: false, code: "UNAUTHENTICATED" };
  }

  if (typeof isFavorite !== "boolean") {
    return { ok: false, code: "INVALID_REQUEST" };
  }

  const dishId = String(rawDishId ?? "");
  const dish = await getDishById(dishId);

  if (!dish) {
    return { ok: false, code: "DISH_NOT_FOUND" };
  }

  setFavoriteForUser(session.id, dishId, isFavorite);
  revalidatePath("/favorites");
  revalidatePath("/menu");
  revalidatePath(`/menu/${dishId}`);

  return { ok: true, isFavorite };
}
