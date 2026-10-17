import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllOrders } from "@/lib/orders";
import { getSession } from "@/lib/session";
import RevenueChart from "./RevenueChart";
import OrdersLineChart from "./OrdersLineChart";
import OrderTable from "../orders/OrderTable";

export const metadata = {
  title: "Admin Dashboard",
  description: "Live Addis Eats order and revenue analytics.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;
const CANCELLED = "cancelled";

function localDateKey(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateLabel(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage({ searchParams }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/");

  const [params, orders] = await Promise.all([
    searchParams,
    getAllOrders(),
  ]);
  const requestedPage = Number(params?.page ?? 1);
  const sortOptions = new Set(["id", "customerName", "area", "total", "status"]);
  const sort = sortOptions.has(params?.sort) ? params.sort : "id";
  const dir = params?.dir === "desc" ? "desc" : "asc";
  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const dashboardOrders = orders.map((order) => ({
    ...order,
    customerName: order.name,
    status: order.status.replaceAll("-", " "),
  }));
  const revenueOrders = orders.filter((order) => order.status === "delivered");
  const salesOrders = orders.filter((order) => order.status !== CANCELLED);
  const totalRevenue = revenueOrders.reduce((total, order) => total + order.total, 0);
  const byAreaMap = new Map();
  for (const order of revenueOrders) {
    byAreaMap.set(order.area, (byAreaMap.get(order.area) ?? 0) + order.total);
  }
  const byArea = [...byAreaMap]
    .map(([area, revenue]) => ({ area, revenue }))
    .sort((left, right) => right.revenue - left.revenue);

  const today = new Date();
  const dailyCounts = new Map();
  for (let daysAgo = 29; daysAgo >= 0; daysAgo -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    const key = localDateKey(date);
    dailyCounts.set(key, 0);
  }
  for (const order of orders) {
    const key = localDateKey(order.createdAt);
    if (dailyCounts.has(key)) dailyCounts.set(key, dailyCounts.get(key) + 1);
  }
  const byTime = [...dailyCounts].map(([key, count]) => ({
    date: dateLabel(key),
    orders: count,
  }));

  const topDishesMap = new Map();
  for (const order of salesOrders) {
    for (const item of order.items) {
      const dish = topDishesMap.get(item.name) ?? { name: item.name, quantity: 0 };
      dish.quantity += item.quantity;
      topDishesMap.set(item.name, dish);
    }
  }
  const topDishes = [...topDishesMap.values()]
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, 5);

  const sortedOrders = [...dashboardOrders].sort((left, right) => {
    const comparison = typeof left[sort] === "number"
      ? left[sort] - right[sort]
      : String(left[sort]).localeCompare(String(right[sort]));
    return dir === "asc" ? comparison : -comparison;
  });
  const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);
  const resolvedPage = Math.min(page, Math.max(totalPages, 1));
  const pagedOrders = sortedOrders.slice(
    (resolvedPage - 1) * PAGE_SIZE,
    resolvedPage * PAGE_SIZE,
  );

  return (
    <main className="page-shell space-y-7 py-8 sm:py-10 lg:space-y-9">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Addis Eats Dashboard</h1>
          <p className="mt-2 text-foreground-muted">Live order insights, revenue analysis, and transaction logs.</p>
        </div>
        <Link href="/dashboard/menu" className="app-control inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary-hover">
          Manage menu
        </Link>
      </header>

      <section aria-label="Order analytics" className="grid gap-4 sm:grid-cols-3">
        <article className="app-card p-5">
          <p className="text-sm font-medium text-foreground-muted">Revenue (delivered orders)</p>
          <p className="mt-2 text-2xl font-bold">{totalRevenue.toLocaleString("en-ET")} ETB</p>
        </article>
        <article className="app-card p-5">
          <p className="text-sm font-medium text-foreground-muted">Total orders</p>
          <p className="mt-2 text-2xl font-bold">{orders.length}</p>
        </article>
        <article className="app-card p-5">
          <p className="text-sm font-medium text-foreground-muted">Active orders</p>
          <p className="mt-2 text-2xl font-bold">
            {orders.filter((order) => !["delivered", CANCELLED].includes(order.status)).length}
          </p>
        </article>
      </section>

      <div className="grid gap-4 xl:grid-cols-2 xl:gap-5">
        <RevenueChart data={byArea} />
        <OrdersLineChart data={byTime} />
      </div>

      <section className="app-card p-5 sm:p-6" aria-labelledby="top-dishes">
        <h2 id="top-dishes" className="mb-4 text-lg font-bold">Top-selling dishes</h2>
        {topDishes.length ? (
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {topDishes.map((dish, index) => (
              <li key={dish.name} className="rounded-lg bg-surface-muted p-3">
                <p className="text-sm font-semibold">{index + 1}. {dish.name}</p>
                <p className="mt-1 text-sm text-foreground-muted">{dish.quantity} sold</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-foreground-muted">No completed or active orders to summarize yet.</p>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-foreground">Order Records</h2>
          <span className="text-sm text-foreground-muted">Page {resolvedPage} of {totalPages || 1}</span>
        </div>
        <OrderTable orders={pagedOrders} currentSort={sort} currentDir={dir} />
        {totalPages > 1 && (
          <nav aria-label="Order record pages" className="flex justify-end gap-2 pt-2">
            {resolvedPage > 1 && (
              <Link href={`/dashboard?page=${resolvedPage - 1}&sort=${sort}&dir=${dir}`} className="app-control inline-flex min-h-12 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground-muted hover:bg-surface-muted">
                Previous
              </Link>
            )}
            {resolvedPage < totalPages && (
              <Link href={`/dashboard?page=${resolvedPage + 1}&sort=${sort}&dir=${dir}`} className="app-control inline-flex min-h-12 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground-muted hover:bg-surface-muted">
                Next
              </Link>
            )}
          </nav>
        )}
      </section>
    </main>
  );
}
