export default function FavoritesLoading() {
  return (
    <main className="page-shell py-8 sm:py-10" aria-busy="true" aria-label="Loading favorites">
      <div className="mb-8 border-b border-border pb-6">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-surface-muted" />
        <div className="mt-3 h-5 w-72 max-w-full animate-pulse rounded bg-surface-muted" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="app-card overflow-hidden">
            <div className="aspect-[16/10] animate-pulse bg-surface-muted" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 animate-pulse rounded bg-surface-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-surface-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
