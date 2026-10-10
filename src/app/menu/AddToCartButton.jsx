
"use client";

import { useCart } from "../cart/CartProvider";

export default function AddToCartButton({
  dish,
  disabled = false,
}) {
  const { addItem, ready } = useCart();

  return (
    <button
      type="button"
      disabled={!ready || disabled}
      onClick={() => addItem(dish)}
      className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Add to Cart
    </button>
  );
}