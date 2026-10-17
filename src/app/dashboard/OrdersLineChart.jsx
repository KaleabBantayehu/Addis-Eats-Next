"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function OrdersLineChart({ data }) {
  return (
    <div className="app-card min-w-0 space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Orders over Time</h2>
        <p className="text-sm text-foreground-muted">Daily order count, last 30 days</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="var(--foreground-muted)" fontSize={12} />
            <YAxis allowDecimals={false} stroke="var(--foreground-muted)" fontSize={12} />
            <Tooltip
              formatter={(value) => [`${value} orders`, "Total Orders"]}
              contentStyle={{
                backgroundColor: "var(--surface-raised)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="var(--secondary)"
              strokeWidth={3}
              dot={{ fill: "var(--accent)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible Table Fallback for Screen Readers & Keyboard Users */}
      <div className="border-t border-border pt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          Data Summary (Accessible Table)
        </h3>
        <table className="w-full text-left text-xs text-foreground-muted">
          <caption className="sr-only">
            Daily order numbers for the last 30 days
          </caption>
          <thead>
            <tr className="border-b border-border text-foreground">
              <th scope="col" className="py-2 font-semibold">
                Date
              </th>
              <th scope="col" className="py-2 text-right font-semibold">
                Orders
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.date} className="border-b border-border">
                <td className="py-1.5">{row.date}</td>
                <td className="py-1.5 text-right font-mono font-medium">
                  {row.orders}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
