
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
      className="flex min-h-12 min-w-12 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Add to Cart
    </button>
  );
}