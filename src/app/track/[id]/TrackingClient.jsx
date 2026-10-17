"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DeliveryMapWrapper from "./DeliveryMapWrapper";
import { etb, when, relative } from "@/lib/format";
import { toCsv, download } from "@/lib/csv";

export default function TrackingClient({ orderId, initialData }) {
  const [data, setData] = useState(initialData);
  const [connectionStatus, setConnectionStatus] = useState("connecting"); // connecting, live, closed, error
  const [eventsHistory, setEventsHistory] = useState([
    {
      timestamp: initialData?.updatedAt || new Date().toISOString(),
      status: initialData?.status || "placed",
      courierLocation: initialData?.courierLocation ? initialData.courierLocation.join(", ") : "Kitchen",
      etaMinutes: initialData?.etaMinutes ?? 25,
    },
  ]);

  useEffect(() => {
    const es = new EventSource(`/api/orders/${orderId}/stream`);

    es.onopen = () => {
      setConnectionStatus("live");
    };

    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData((prev) => ({ ...prev, ...parsed }));

        setEventsHistory((prev) => [
          {
            timestamp: parsed.updatedAt || new Date().toISOString(),
            status: parsed.status,
            courierLocation: parsed.courierLocation ? parsed.courierLocation.join(", ") : "N/A",
            etaMinutes: parsed.etaMinutes ?? 0,
          },
          ...prev,
        ]);

        if (parsed.status === "delivered" || parsed.status === "cancelled") {
          setConnectionStatus("closed");
          es.close();
        }
      } catch (err) {
        console.error("Error parsing SSE event:", err);
      }
    };

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) {
        setConnectionStatus("closed");
      } else {
        setConnectionStatus("reconnecting");
      }
    };

    return () => {
      if (es) {
        es.close();
      }
    };
  }, [orderId]);

  const handleExportCsv = () => {
    const rows = [
      ["Order ID", "Timestamp", "Status", "Area", "ETA (Minutes)", "Courier Coordinates", "Total (ETB)"],
      ...eventsHistory.map((evt) => [
        data.id,
        evt.timestamp,
        evt.status,
        data.area || "Addis Ababa",
        evt.etaMinutes,
        evt.courierLocation,
        data.total,
      ]),
    ];

    const csvContent = toCsv(rows);
    download(csvContent, `order-${orderId}-tracking.csv`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "border border-secondary/30 bg-secondary/10 text-secondary dark:bg-secondary/15";
      case "out-for-delivery":
      case "ready":
        return "border border-accent/40 bg-accent/15 text-accent-foreground dark:text-accent";
      case "preparing":
        return "border border-border bg-surface-muted text-foreground-muted";
      case "cancelled":
        return "border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200";
      default:
        return "border border-border bg-surface-muted text-foreground";
    }
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case "live":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent-foreground dark:text-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent"></span>
            Live Updates
          </span>
        );
      case "reconnecting":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent-foreground dark:text-accent">
            <span className="h-2 w-2 rounded-full bg-accent"></span>
            Reconnecting...
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-foreground-muted border border-border">
            <span className="h-2 w-2 rounded-full bg-foreground-muted/50"></span>
            Stream Finished
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
            <span className="h-2 w-2 animate-ping rounded-full bg-secondary"></span>
            Connecting...
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Live Delivery Tracking
            </h1>
            {getConnectionBadge()}
          </div>
          <p className="mt-1 text-sm text-foreground-muted">
            Order <span className="font-mono font-medium text-foreground">#{orderId}</span> · Placed on {when.format(new Date(data.createdAt))}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex min-h-12 min-w-12 items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground-muted shadow-card transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            <svg
              className="h-4 w-4 text-foreground-muted"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export History (CSV)
          </button>

          <Link
            href="/orders"
            className="flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            All Orders
          </Link>
        </div>
      </div>

      {/* Main Grid: Map & Order details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="app-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Courier Real-Time Location</h2>
              <span className="text-xs text-foreground-muted">Addis Ababa, Ethiopia</span>
            </div>
            <DeliveryMapWrapper
              courierLocation={data.courierLocation}
              deliveryLocation={data.deliveryLocation}
              area={data.area}
              status={data.status}
            />
          </div>

          {/* Screen Reader & Accessible Text Fallback */}
          <section
            aria-labelledby="delivery-status-heading"
            className="app-card p-5 sm:p-6"
          >
            <h2 id="delivery-status-heading" className="text-lg font-bold text-foreground mb-3">
              Delivery Details & Status (Text Summary)
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-surface-muted p-4">
                <dt className="text-foreground-muted font-medium">Current Status</dt>
                <dd className="mt-1 font-semibold capitalize text-foreground">
                  {data.status?.replaceAll("-", " ")}
                </dd>
              </div>

              <div className="rounded-lg bg-surface-muted p-4">
                <dt className="text-foreground-muted font-medium">Destination Neighborhood</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {data.area || "Addis Ababa"}
                </dd>
              </div>

              <div className="rounded-lg bg-surface-muted p-4">
                <dt className="text-foreground-muted font-medium">Estimated Arrival</dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {data.status === "delivered"
                    ? "Delivered"
                    : data.etaMinutes > 0
                    ? `${data.etaMinutes} minutes remaining (${relative.format(data.etaMinutes, "minute")})`
                    : "Arriving shortly"}
                </dd>
              </div>

              <div className="rounded-lg bg-surface-muted p-4">
                <dt className="text-foreground-muted font-medium">Courier Coordinates</dt>
                <dd className="mt-1 font-mono text-xs text-foreground">
                  {data.courierLocation
                    ? `${data.courierLocation[0]}° N, ${data.courierLocation[1]}° E`
                    : "Awaiting courier departure"}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Sidebar: Order Summary & Events Log */}
        <div className="space-y-6">
          <div className="app-card space-y-4 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-foreground-muted">Status</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getStatusBadge(data.status)}`}>
                {data.status?.replaceAll("-", " ")}
              </span>
            </div>

            <div className="border-b pb-3 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Items Ordered</span>
              <ul className="text-sm text-foreground-muted space-y-1">
                {data.items && data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.quantity} × {item.name}</span>
                      {item.price && <span className="font-mono text-foreground-muted">{etb.format(item.price * item.quantity)}</span>}
                    </li>
                  ))
                ) : (
                  <li>Standard Order Items</li>
                )}
              </ul>
            </div>

            <div className="flex justify-between items-center pt-1 font-semibold text-foreground">
              <span>Total Price:</span>
              <span className="text-lg font-bold text-primary">{etb.format(data.total || 0)}</span>
            </div>
          </div>

          {/* Activity Log */}
          <div className="app-card p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-muted mb-3">
              Live Stream Timeline
            </h2>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
              {eventsHistory.map((evt, i) => (
                <div key={i} className="rounded-lg bg-surface-muted p-3 space-y-1">
                  <div className="flex justify-between items-center text-foreground-muted">
                    <span className="font-mono">{when.format(new Date(evt.timestamp))}</span>
                    <span className="font-semibold capitalize text-primary">{evt.status}</span>
                  </div>
                  <div className="text-foreground-muted">
                    Location: <span className="font-mono text-[11px]">{evt.courierLocation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
