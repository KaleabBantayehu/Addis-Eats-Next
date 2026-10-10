import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/orders";
import { updateOrderStatusAction } from "@/app/actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kitchen Dashboard",
  description: "Internal order management dashboard for kitchen staff.",
  // Prevent search engines from indexing or following links on this private route
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function KitchenPage() {
  const session = await getSession();

  // Role checked server-side
  if (!session || session.role !== "staff") {
    redirect("/");
  }

  const orders = getAllOrders();

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600">Kitchen Display</h1>
      <p className="text-gray-600 mt-2">Active orders queued for cooking.</p>
      {orders.length === 0 ? (
        <p className="mt-6 text-gray-700">No orders have been placed yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-lg border bg-white p-4">
              <h2 className="font-bold">Order #{order.id}</h2>
              <p>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p>
              <p className="capitalize">Status: {order.status.replaceAll("-", " ")}</p>
              {order.status !== "cancelled" && order.status !== "delivered" && (
                <form action={updateOrderStatusAction} className="mt-3 flex flex-wrap gap-2">
                  <input type="hidden" name="orderId" value={order.id} />
                  <button
                    className="rounded bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                    name="status"
                    type="submit"
                    value={{
                      placed: "preparing",
                      preparing: "out-for-delivery",
                      "out-for-delivery": "delivered",
                    }[order.status]}
                  >
                    Mark {{
                      placed: "preparing",
                      preparing: "out-for-delivery",
                      "out-for-delivery": "delivered",
                    }[order.status].replaceAll("-", " ")}
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}