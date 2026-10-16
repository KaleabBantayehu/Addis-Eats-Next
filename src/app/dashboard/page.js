import Link from "next/link";
import { getOrders } from "@/data/orders";
import RevenueChart from "./RevenueChart";
import OrdersLineChart from "./OrdersLineChart";
import OrderTable from "../orders/OrderTable";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const sort = params?.sort ?? "id";
  const dir = params?.dir ?? "asc";
  const page = Number(params?.page ?? 1);
  const pageSize = 5;
  const session = await getSession();

  if(!session || session.role !== "admin") {
    redirect("/");
  }
  const rawOrders = await getOrders();

  // 1. Server Aggregation: Revenue by Area (Bar Chart)
  const areas = ["Bole", "Kazanchis", "Megenagna", "Piassa", "CMC"];
  const byArea = areas.map((area) => ({
    area,
    revenue: rawOrders
      .filter((o) => o.area === area)
      .reduce((sum, o) => sum + o.total, 0),
  }));

  // 2. Server Aggregation: Orders over Time (Line Chart)
  const timeMap = rawOrders.reduce((acc, order) => {
    const dateLabel = new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!acc[dateLabel]) {
      acc[dateLabel] = { date: dateLabel, orders: 0 };
    }
    acc[dateLabel].orders += 1;
    return acc;
  }, {});
  const byTime = Object.values(timeMap);

  // 3. Sorting logic
  const sortedOrders = [...rawOrders].sort((a, b) => {
    let aVal = a[sort];
    let bVal = b[sort];
    if (typeof aVal === "number") {
      return dir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return dir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // 4. Pagination slicing
  const totalPages = Math.ceil(sortedOrders.length / pageSize);
  const pagedOrders = sortedOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="page-shell space-y-7 py-8 sm:py-10 lg:space-y-9">
      <header className="flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Addis Eats Dashboard</h1>
        <p className="mt-2 text-foreground-muted">
          Real-time order insights, revenue analysis, and transaction logs.
        </p>
        </div>
        <p className="text-sm text-foreground-muted">Page {page} of {totalPages || 1}</p>
      </header>

      {/* Chart Section */}
      <div className="grid gap-4 xl:grid-cols-2 xl:gap-5">
        <RevenueChart data={byArea} />
        <OrdersLineChart data={byTime} />
      </div>

      {/* Order Table & Paging Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Order Records</h2>
          <span className="text-sm text-foreground-muted">
            Page {page} of {totalPages}
          </span>
        </div>

        <OrderTable orders={pagedOrders} currentSort={sort} currentDir={dir} />

        {/* URL-driven Pagination Links */}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2 pt-2">
            {page > 1 && (
              <Link
                href={`/dashboard?page=${page - 1}&sort=${sort}&dir=${dir}`}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-muted"
              >
                ← Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/dashboard?page=${page + 1}&sort=${sort}&dir=${dir}`}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-muted"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
