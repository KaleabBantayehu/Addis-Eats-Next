export const CART_STORAGE_KEY = "addis-eats-cart";

export function addCartItem(items, dish) {
  const existingItem = items.find((item) => item.id === dish.id);

  if (existingItem) {
    return items.map((item) =>
      item.id === dish.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...items, { ...dish, quantity: 1 }];
}