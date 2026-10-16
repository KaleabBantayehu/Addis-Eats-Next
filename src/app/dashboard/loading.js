export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8 animate-pulse">
      <div className="h-8 w-64 rounded bg-surface-muted" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-80 rounded-xl bg-surface-muted" />
        <div className="h-80 rounded-xl bg-surface-muted" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}