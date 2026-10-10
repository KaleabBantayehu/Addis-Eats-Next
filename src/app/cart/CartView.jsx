
"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartView() {
  const {
    items,
    ready,
    addItem,
    removeItem,
    clearCart,
  } = useCart();

  const total = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  if (!ready) {
    return (
      <p className="text-gray-600">
        Restoring your cart...
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <h2 className="mb-3 text-2xl font-bold">
          Your cart is empty
        </h2>

        <p className="mb-6 text-gray-600">
          Discover your next favorite Ethiopian dish!
        </p>

        <Link
          href="/menu"
          className="inline-block rounded-lg bg-orange-600 px-6 py-3 text-white hover:bg-orange-700"
        >
          Explore Our Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                {item.name}
              </h2>

              <p className="mt-2 text-orange-600">
                {item.price} ETB each
              </p>

              <p className="mt-2 font-semibold">
                Subtotal:{" "}
                {item.price * item.quantity} ETB
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
              >
                Remove
              </button>

              <button
                type="button"
                onClick={() => addItem(item)}
                className="rounded-lg bg-orange-100 px-3 py-2 text-orange-700 hover:bg-orange-200"
              >
                + Add One
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-700">
            Quantity: {item.quantity}
          </p>
        </article>
      ))}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex justify-between text-xl font-bold">
          <span>Order Total</span>
          <span className="text-orange-600">
            {total} ETB
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/checkout"
            className="rounded-lg bg-orange-600 px-6 py-3 text-white hover:bg-orange-700"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/menu"
            className="rounded-lg border border-orange-600 px-6 py-3 text-slate-900 hover:bg-orange-50"
          >
            Continue Shopping
          </Link>

          <button
            type="button"
            onClick={clearCart}
            className="rounded-lg px-4 py-3 text-red-600 hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}