"use client";

import dynamic from "next/dynamic";

const DynamicDeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center rounded-xl border border-border bg-surface-muted text-sm text-foreground-muted animate-pulse"
      style={{ height: "320px" }}
      aria-label="Loading delivery map"
    >
      <div className="flex flex-col items-center gap-2">
        <svg
          className="h-8 w-8 text-secondary animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span>Loading map view...</span>
      </div>
    </div>
  ),
});

export default function DeliveryMapWrapper(props) {
  return <DynamicDeliveryMap {...props} />;
}
