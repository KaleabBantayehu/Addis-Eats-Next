"use server";

import { revalidatePath } from "next/cache";
import { setFavoriteForUser } from "@/lib/favorites";
import { getSession } from "@/lib/session";

export async function setFavoriteAction(rawDishId, isFavorite) {
  const session = await getSession();

  if (!session) {
    return { ok: false, code: "UNAUTHENTICATED" };
  }

  if (typeof isFavorite !== "boolean") {
    return { ok: false, code: "INVALID_REQUEST" };
  }

  const dishId = Number(rawDishId);
  if (!Number.isSafeInteger(dishId) || dishId < 1) {
    return { ok: false, code: "INVALID_REQUEST" };
  }

  await setFavoriteForUser(session.id, dishId, isFavorite);
  revalidatePath("/favorites");
  revalidatePath("/menu");
  revalidatePath(`/menu/${dishId}`);

  return { ok: true, isFavorite };
}
