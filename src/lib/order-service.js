import { getDishes } from "../app/menu/getDishes";
import { createOrder } from "./orders";

export async function createOrderFromInput(
  input,
  ownerId
) {
  const dishes = await getDishes();
  const lineItems = [];

  for (const requestedItem of input.items) {
    const dish = dishes.find(
      (dish) =>
        String(dish.id) ===
        requestedItem.id
    );

    if (!dish) {
      return {
        ok: false,

        fieldErrors: {
          items: [
            `Dish ${requestedItem.id} does not exist.`,
          ],
        },
      };
    }

    lineItems.push({
      id: String(dish.id),
      name: dish.name,
      price: dish.price,
      quantity: requestedItem.quantity,
    });
  }

  const total = lineItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const order = createOrder({
    ownerId,

    name: input.name,
    phone: input.phone,
    area: input.area,
    notes: input.notes,

    items: lineItems,

    total,
  });

  return {
    ok: true,
    order,
  };
}
