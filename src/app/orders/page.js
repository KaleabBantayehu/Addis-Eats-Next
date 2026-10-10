import Link from "next/link";
import { getSession } from "@/lib/session";
import { getOrdersByOwner } from "@/lib/orders";
import { cancelOrder } from "@/app/actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your Orders",
  description: "Review and track your Addis Eats orders.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/orders");
  }

  // Always scope to session.id, NEVER an ID from request params
  const orders = getOrdersByOwner(session.id);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-700">No orders found for your account.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded-lg bg-white shadow-sm">
              <span className="font-bold">Order #{order.id}</span>
              <p>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p>
              <p className="capitalize">Status: {order.status.replaceAll("-", " ")}</p>
              <p>Total: {order.total} ETB</p>
              <div className="mt-3 flex gap-4">
                <Link className="font-medium text-orange-700 underline" href={`/orders/${order.id}`}>
                  Track order
                </Link>
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <form action={cancelOrder}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <button className="font-medium text-red-700 underline" type="submit">
                      Cancel order
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}