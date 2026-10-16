import Link from "next/link";

const formatETB = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(value);

export default function OrderTable({ orders, currentSort, currentDir }) {
  // Generates URL toggle links for headers
  const getSortLink = (field) => {
    const isSameField = currentSort === field;
    const nextDir = isSameField && currentDir === "asc" ? "desc" : "asc";
    return `/dashboard?sort=${field}&dir=${nextDir}`;
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-muted/50 p-8 text-center">
        <p className="text-base font-semibold text-foreground">No orders yet</p>
        <p className="mt-1 text-sm text-foreground-muted">
          Browse the menu to place your first food order.
        </p>
        <Link
          href="/menu"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          View Menu
        </Link>
      </div>
    );
  }

  return (
    <>
    <ul className="space-y-3 md:hidden" aria-label="Order records">
      {orders.map((o) => (
        <li key={o.id} className="app-card p-4">
          <div className="flex items-start justify-between gap-3"><span className="font-semibold text-foreground">Order #{o.id}</span><span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-foreground">{o.status}</span></div>
          <p className="mt-3 text-sm text-foreground-muted">{o.customerName} · {o.area}</p>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3"><span className="font-semibold text-foreground">{formatETB(o.total)}</span><Link className="app-control inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold text-secondary hover:bg-surface-muted" href={getSortLink("total")}>Sort by total {currentSort === "total" ? (currentDir === "asc" ? "↑" : "↓") : ""}</Link></div>
        </li>
      ))}
    </ul>
    <div className="app-card hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm text-foreground-muted">
        <caption className="sr-only">
          Customer order records, sorted by active column headers
        </caption>
        <thead className="bg-surface-muted/50 text-xs uppercase tracking-wider text-foreground-muted border-b border-border">
          <tr>
            <th scope="col" className="px-6 py-3 font-semibold">
              Order ID
            </th>
            <th scope="col" className="px-6 py-3 font-semibold">
              Customer
            </th>
            <th scope="col" className="px-6 py-3 font-semibold">
              Area
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-semibold cursor-pointer hover:text-primary-hover"
              aria-sort={
                currentSort === "total"
                  ? currentDir === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <Link href={getSortLink("total")} className="flex items-center gap-1">
                Total
                {currentSort === "total" && (currentDir === "asc" ? " ↑" : " ↓")}
              </Link>
            </th>
            <th scope="col" className="px-6 py-3 font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-surface-muted/30 transition-colors">
              <td className="px-6 py-4 font-mono font-medium text-foreground">
                {o.id}
              </td>
              <td className="px-6 py-4 text-foreground font-medium">
                {o.customerName}
              </td>
              <td className="px-6 py-4">{o.area}</td>
              <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                {formatETB(o.total)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    o.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : o.status === "Preparing"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
