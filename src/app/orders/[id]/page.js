import OrderStatusClient from "./OrderStatusClient";
import { getSession } from "@/lib/session";
import { getOrderById } from "@/lib/orders";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: `Order ${id}`,
    description: "Track the live status of your Addis Eats order.",
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function OrderPage({ params }) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect(`/signin?next=${encodeURIComponent(`/orders/${id}`)}`);
  }

  const order = await getOrderById(id);

  if (!order || order.ownerId !== session.id) {
    notFound();
  }

  const initialOrder = {
    id: order.id,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
  };

  return <OrderStatusClient id={id} initialOrder={initialOrder} />;
}