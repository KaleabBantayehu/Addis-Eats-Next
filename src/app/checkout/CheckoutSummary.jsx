
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
      <p className="text-foreground-muted">
        Preparing your order...
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-surface-muted p-6 text-center">
        <h2 className="mb-3 text-xl font-bold">
          No dishes to check out
        </h2>

        <p className="mb-5 text-foreground-muted">
          Your cart is currently empty.
        </p>

        <Link
          href="/menu"
          className="inline-block rounded-lg bg-primary px-5 py-3 text-white"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-5 text-xl font-bold">
        Order Summary
      </h2>

      <div className="divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.id}
          className="flex justify-between gap-4 border-b border-border py-4 last:border-0"
          >
            <div>
              <h3 className="font-semibold">
                {item.name}
              </h3>

              <p className="text-sm text-foreground-muted">
                Quantity: {item.quantity}
              </p>
            </div>

            <p className="font-semibold">
              {item.price * item.quantity} ETB
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between border-t border-border pt-5 text-xl font-bold">
        <span>Total</span>

        <span className="price-number text-primary">
          {total} ETB
        </span>
      </div>

      <p className="mt-6 text-sm text-foreground-muted">
        This is an order preview. Payment and order
        submission are not implemented yet.
      </p>

      <Link
        href="/cart"
        className="app-control mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-secondary px-5 font-semibold text-secondary hover:bg-surface-muted"
      >
        Edit Your Cart
      </Link>
    </section>
  );
}
