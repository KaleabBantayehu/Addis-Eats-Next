import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/orders";
import { updateOrderStatusAction } from "@/app/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Kitchen Dashboard",
  description: "Internal order management dashboard for kitchen staff.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function KitchenPage() {
  const session = await getSession();
  // Role checked server-side
  if (!session || (session.role !== "staff" && session.role !== "admin")) redirect("/");
  const orders = await getAllOrders();
  const activeOrders = orders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status),
  );

  return (
    <main className="page-shell py-8 sm:py-10">
      <header className="mb-7 border-b border-border pb-6">
        <p className="text-sm font-semibold text-secondary">Restaurant operations</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Kitchen Display</h1>
        <p className="mt-2 text-foreground-muted">Active orders queued for cooking.</p>
      </header>
      {activeOrders.length === 0 ? (
        <p className="app-card p-8 text-center text-foreground-muted">No active orders are waiting in the kitchen.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeOrders.map((order) => (
            <li key={order.id} className="app-card flex flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold">Order <span className="price-number">#{order.id}</span></h2>
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold capitalize text-foreground-muted">{order.status.replaceAll("-", " ")}</span>
              </div>
              <ul className="my-5 space-y-2 border-y border-border py-4 text-sm">
                {order.items.map((item, index) => <li key={`${item.id}-${index}`} className="flex justify-between gap-3"><span>{item.name}</span><span className="shrink-0 font-semibold">× {item.quantity}</span></li>)}
              </ul>
              {order.status !== "cancelled" && order.status !== "delivered" && (
                <form action={updateOrderStatusAction} className="mt-auto flex flex-wrap gap-2">
                  <input type="hidden" name="orderId" value={order.id} />
                  <button
                    className="app-control flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold capitalize text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                    name="status"
                    type="submit"
                    value={{ pending: "preparing", preparing: "ready", ready: "delivered" }[order.status]}
                  >
                    Mark {{ pending: "preparing", preparing: "ready", ready: "delivered" }[order.status]}
                  </button>
                </form>
              )}
              {!["cancelled", "delivered"].includes(order.status) && (
                <form action={updateOrderStatusAction} className="mt-2">
                  <input type="hidden" name="orderId" value={order.id} />
                  <button
                    className="app-control flex min-h-12 w-full items-center justify-center rounded-lg border border-red-300 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-red-300 dark:hover:bg-red-950"
                    name="status"
                    type="submit"
                    value="cancelled"
                  >
                    Cancel order
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link href="/dashboard/menu" className="app-control inline-flex min-h-12 items-center rounded-lg border border-secondary px-4 font-semibold text-secondary hover:bg-surface-muted">
        Manage menu
      </Link>
    </main>
  );
}
