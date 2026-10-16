"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatETB = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(value);

export default function RevenueChart({ data }) {
  return (
    <div className="app-card min-w-0 p-4 sm:p-6">
      <h2 className="mb-1 text-lg font-bold text-foreground">
        Revenue by Neighbourhood
      </h2>
      <p className="mb-4 text-sm text-foreground-muted">
        Total sales split across delivery areas in ETB
      </p>

      {/* Fixed height container prevents ResponsiveContainer height collapse */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="area" stroke="var(--foreground-muted)" fontSize={12} />
            <YAxis
              tickFormatter={formatETB}
              width={90}
              stroke="var(--foreground-muted)"
              fontSize={12}
            />
            <Tooltip
              formatter={(value) => [formatETB(value), "Revenue"]}
              contentStyle={{
                backgroundColor: "var(--surface-raised)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="revenue" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
