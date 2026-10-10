
"use client";

import Link from "next/link";
import { useCart } from "../cart/CartProvider";

export default function CheckoutSummary() {
  const { items, ready } = useCart();

  const total = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  if (!ready) {
    return (
      <p className="text-gray-600">
        Preparing your order...
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-orange-50 p-6 text-center">
        <h2 className="mb-3 text-xl font-bold">
          No dishes to check out
        </h2>

        <p className="mb-5 text-gray-600">
          Your cart is currently empty.
        </p>

        <Link
          href="/menu"
          className="inline-block rounded-lg bg-orange-600 px-5 py-3 text-white"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold">
        Order Summary
      </h2>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-4 py-4"
          >
            <div>
              <h3 className="font-semibold">
                {item.name}
              </h3>

              <p className="text-sm text-gray-700">
                Quantity: {item.quantity}
              </p>
            </div>

            <p className="font-semibold">
              {item.price * item.quantity} ETB
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between border-t border-gray-200 pt-5 text-xl font-bold">
        <span>Total</span>

        <span className="text-orange-600">
          {total} ETB
        </span>
      </div>

      <p className="mt-6 text-sm text-gray-700">
        This is an order preview. Payment and order
        submission are not implemented yet.
      </p>

      <Link
        href="/cart"
        className="mt-6 inline-block rounded-lg border border-orange-600 px-5 py-3 text-slate-900 hover:bg-orange-50"
      >
        Edit Your Cart
      </Link>
    </section>
  );
}