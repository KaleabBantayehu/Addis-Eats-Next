
export default function Loading() {
  return (
    <main className="min-h-screen bg-surface-muted px-6 py-12">
      <div className="mx-auto max-w-6xl animate-pulse">

        <div className="mb-4 h-10 w-48 rounded bg-surface-muted" />

        <div className="mb-10 h-5 w-80 max-w-full rounded bg-surface-muted" />

        <div className="mb-8 flex gap-3">
          <div className="h-10 w-20 rounded-full bg-surface-muted" />
          <div className="h-10 w-32 rounded-full bg-surface-muted" />
          <div className="h-10 w-28 rounded-full bg-surface-muted" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-surface p-6 shadow-card"
            >
              <div className="mb-4 h-6 w-32 rounded bg-surface-muted" />

              <div className="mb-2 h-4 w-full rounded bg-surface-muted" />

              <div className="mb-6 h-4 w-3/4 rounded bg-surface-muted" />

              <div className="h-10 w-28 rounded-lg bg-surface-muted" />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}