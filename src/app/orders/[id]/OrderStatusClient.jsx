"use client";

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

  if (error) return <div className="text-red-600">Failed to update order status.</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 space-y-4">
      <h2 className="text-2xl font-bold">Order #{order.id}</h2>
      <p className="text-gray-700">
        Status: <span className="font-semibold text-orange-600">{order.status}</span>
      </p>
      <p className="text-gray-700">Total: {order.total} ETB</p>
      <p className="text-xs text-gray-600">Polling updates every 5 seconds...</p>
    </div>
  );
}