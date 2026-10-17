import { getSession } from "@/lib/session";
import { getOrderById } from "@/lib/orders";
import { notFound, redirect } from "next/navigation";
import TrackingClient from "./TrackingClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Track Order ${id}`,
    description: "Real-time delivery map and live tracking status.",
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function TrackOrderPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/signin?next=${encodeURIComponent(`/track/${id}`)}`);
  }

  const order = await getOrderById(id);

  if (!order || (order.ownerId !== session.id && session.role !== "staff" && session.role !== "admin")) {
    notFound();
  }

  // Pre-seed initial order data on the server
  const initialData = {
    id: order.id,
    status: order.status,
    total: order.total,
    area: order.area || "Addis Ababa",
    items: order.items || [],
    createdAt: order.createdAt,
    updatedAt: order.updatedAt || order.createdAt,
    courierLocation: [9.0200, 38.7600],
    deliveryLocation: [8.9950, 38.7890],
    etaMinutes: order.status === "delivered" ? 0 : 25,
  };

  return (
    <main className="page-shell py-7 sm:py-9">
      <TrackingClient orderId={id} initialData={initialData} />
    </main>
  );
}
