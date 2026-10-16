"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";

export default function CartView() {
  const { items, ready, addItem, removeItem, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!ready) return <p className="text-foreground-muted">Restoring your cart...</p>;

  if (items.length === 0) {
    return (
      <div className="app-card p-8 text-center sm:p-12">
        <h2 className="mb-3 text-2xl font-bold">Your cart is empty</h2>
        <p className="mb-6 text-foreground-muted">Discover your next favorite Ethiopian dish!</p>
        <Link href="/menu" className="app-control inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary-hover">
          Explore Our Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.8fr)] lg:gap-8">
      <section aria-label="Items in your cart" className="space-y-4">
        {items.map((item) => (
          <article key={item.id} className="app-card grid gap-4 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center sm:gap-5 sm:p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-muted sm:aspect-square">
              {item.image ? <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 100vw, 112px" className="object-cover" /> : null}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground sm:text-xl">{item.name}</h2>
                  <p className="mt-1 text-sm text-foreground-muted">{item.price} ETB each</p>
                </div>
                <p className="price-number text-lg font-bold text-foreground">{item.price * item.quantity} <span className="text-xs font-semibold">ETB</span></p>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-foreground-muted">Quantity: <span className="font-semibold text-foreground">{item.quantity}</span></p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => addItem(item)} className="app-control inline-flex min-h-12 items-center justify-center rounded-lg bg-surface-muted px-4 text-sm font-semibold text-foreground hover:bg-secondary/10">Add one</button>
                  <button type="button" onClick={() => removeItem(item.id)} className="app-control inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950" aria-label={`Remove ${item.name} from cart`}><Trash2 aria-hidden="true" className="h-4 w-4" /><span>Remove</span></button>
                </div>
              </div>
            </div>
          </article>
        ))}
        <Link href="/menu" className="inline-flex min-h-12 items-center gap-2 rounded-lg px-3 font-semibold text-secondary hover:bg-surface-muted">
          Continue shopping <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>

      <aside className="app-card p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <div className="my-5 space-y-3 border-y border-border py-5 text-sm">
          <div className="flex justify-between gap-4 text-foreground-muted"><span>Items</span><span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
          <div className="flex justify-between gap-4 font-semibold text-foreground"><span>Order total</span><span className="price-number">{total} ETB</span></div>
        </div>
        <Link href="/checkout" className="app-control inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition hover:bg-primary-hover">
          Proceed to Checkout <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <button type="button" onClick={clearCart} className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-lg px-4 font-semibold text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950">Clear Cart</button>
      </aside>
    </div>
  );
}
