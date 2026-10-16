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
  if (!session) redirect("/signin?next=/orders");
  // Always scope to session.id, NEVER an ID from request params
  const orders = getOrdersByOwner(session.id);

  return (
    <main className="page-shell py-8 sm:py-10">
      <header className="mb-7 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your Orders</h1><p className="mt-2 text-foreground-muted">Review and track your Addis Eats orders.</p></div>
        <Link href="/menu" className="app-control inline-flex min-h-12 items-center justify-center rounded-lg border border-secondary px-4 font-semibold text-secondary hover:bg-surface-muted">Browse menu</Link>
      </header>
      {orders.length === 0 ? (
        <div className="app-card p-8 text-center sm:p-12">
          <p className="mb-2 font-semibold">No orders placed yet.</p>
          <p className="mb-6 text-sm text-foreground-muted">Explore our fresh Ethiopian dishes and start your first order!</p>
          <Link href="/menu" className="app-control inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary-hover">Explore Menu</Link>
        </div>
      ) : (
        <ul className="grid gap-4 xl:grid-cols-2">
          {orders.map((order) => (
            <li key={order.id} className="app-card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Order</p><h2 className="mt-1 text-xl font-bold">#{order.id}</h2></div>
                <span className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${order.status === "delivered" ? "bg-secondary/10 text-secondary" : order.status === "out-for-delivery" ? "bg-accent/20 text-accent-foreground dark:text-accent" : order.status === "cancelled" ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200" : "bg-surface-muted text-foreground-muted"}`}>{order.status.replaceAll("-", " ")}</span>
              </div>
              <p className="mt-3 text-xs text-foreground-muted">Placed {new Date(order.createdAt).toLocaleString("en-ET", { dateStyle: "medium", timeStyle: "short" })}</p>
              <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-foreground-muted">{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p>
              <div className="mt-4 flex items-center justify-between gap-4"><span className="text-sm text-foreground-muted">Total</span><span className="price-number text-lg font-bold">{order.total} ETB</span></div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link className="app-control inline-flex min-h-12 items-center justify-center rounded-lg border border-secondary px-3.5 font-semibold text-secondary transition hover:bg-secondary/10" href={`/orders/${order.id}`}>Order details</Link>
                <Link className="app-control inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-3.5 font-semibold text-primary-foreground transition hover:bg-primary-hover" href={`/track/${order.id}`}>Live Map Tracker</Link>
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <form action={cancelOrder} className="inline">
                    <input type="hidden" name="orderId" value={order.id} />
                    <button className="app-control inline-flex min-h-12 items-center justify-center rounded-lg px-3.5 font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-red-300 dark:hover:bg-red-950" type="submit">Cancel order</button>
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
