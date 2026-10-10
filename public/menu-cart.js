document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("[data-cart-item]");
  if (!button || button.disabled) return;

  const storageKey = "addis-eats-cart";

  try {
    const storedItems = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const items = Array.isArray(storedItems) ? storedItems : [];
    const existingItem = items.find((item) => item.id === button.dataset.cartId);
    const nextItems = existingItem
      ? items.map((item) =>
          item.id === button.dataset.cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [
          ...items,
          {
            id: button.dataset.cartId,
            name: button.dataset.cartName,
            price: Number(button.dataset.cartPrice),
            quantity: 1,
          },
        ];

    localStorage.setItem(storageKey, JSON.stringify(nextItems));
  } catch (error) {
    console.error("Could not update cart:", error);
  }
});