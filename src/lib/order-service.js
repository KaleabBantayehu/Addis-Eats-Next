import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "./orders";

export async function createOrderFromInput(input, ownerId) {
  const quantitiesByDish = new Map();

  for (const item of input.items) {
    const quantity = (quantitiesByDish.get(item.id) ?? 0) + item.quantity;
    if (quantity > 20) {
      return {
        ok: false,
        fieldErrors: {
          items: [`Maximum quantity for dish ${item.id} is 20.`],
        },
      };
    }
    quantitiesByDish.set(item.id, quantity);
  }

  const dishIds = [...quantitiesByDish.keys()];
  const supabase = await createClient();
  const { data: dishes, error: dishesError } = await supabase
    .from("dishes")
    .select("id, name, price")
    .eq("is_available", true)
    .in("id", dishIds.map(Number));

  if (dishesError) {
    console.error("Could not validate the requested dishes:", dishesError);
    throw new Error("The menu is temporarily unavailable. Please try again.");
  }

  const dishesById = new Map(
    (dishes ?? []).map((dish) => [String(dish.id), dish]),
  );
  const lineItems = [];

  for (const [dishId, quantity] of quantitiesByDish) {
    const dish = dishesById.get(dishId);
    if (!dish) {
      return {
        ok: false,
        fieldErrors: {
          items: [`Dish ${dishId} is unavailable. Please update your cart.`],
        },
      };
    }

    const price = Number(dish.price);
    if (!Number.isFinite(price) || price < 0) {
      console.error(`Dish ${dishId} has an invalid catalog price.`);
      throw new Error("The menu contains an invalid price.");
    }

    lineItems.push({
      id: dishId,
      name: dish.name,
      price,
      quantity,
      lineTotal: price * quantity,
    });
  }

  const { data: orderId, error: orderError } = await supabase.rpc(
    "place_order",
    {
      p_name: input.name,
      p_phone: input.phone,
      p_area: input.area,
      p_notes: input.notes ?? "",
      p_items: lineItems.map(({ id, quantity }) => ({ id, quantity })),
    },
  );

  if (orderError) {
    console.error("Could not place the order:", orderError);
    throw new Error("Your order could not be placed. Please try again.");
  }

  const order = await getOrderById(orderId);
  if (!order || order.ownerId !== ownerId) {
    console.error("The placed order could not be read back from Supabase.");
    throw new Error("Your order was placed, but could not be loaded.");
  }

  return { ok: true, order };
}
