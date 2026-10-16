"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function OrderStatusClient({ id, initialOrder }) {
  const { data: order, error } = useSWR(
    `/api/orders/${id}`,
    fetcher,
    {
      fallbackData: initialOrder,
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  if (error) return <div role="alert" className="page-shell py-12 text-red-700 dark:text-red-300">Failed to update order status.</div>;

  return (
    <main className="page-shell max-w-3xl py-10 sm:py-14">
    <div className="app-card p-6 sm:p-9">
      <p className="text-sm font-semibold text-secondary">Order status</p>
      <h1 className="mt-2 text-3xl font-bold">Order #{order.id}</h1>
      <div className="my-6 grid gap-4 rounded-xl bg-surface-muted p-5 sm:grid-cols-2 lg:grid-cols-3">
        <p className="text-foreground-muted">Status <span className="mt-1 block font-semibold capitalize text-foreground">{order.status.replaceAll("-", " ")}</span></p>
        <p className="text-foreground-muted">Total <span className="price-number mt-1 block font-semibold text-foreground">{order.total} ETB</span></p>
        <p className="text-foreground-muted">Placed <span className="mt-1 block font-semibold text-foreground">{new Date(order.createdAt).toLocaleString("en-ET", { dateStyle: "medium", timeStyle: "short" })}</span></p>
      </div>
      <div className="pt-2">
        <Link
          href={`/track/${order.id}`}
          className="flex min-h-12 min-w-12 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          View Live Delivery Map & Tracking →
        </Link>
      </div>
      <p className="mt-5 text-xs text-foreground-muted">Polling updates every 5 seconds...</p>
    </div>
    </main>
  );
}
