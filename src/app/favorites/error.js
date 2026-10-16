"use client";

export default function FavoritesError({ reset }) {
  return (
    <main className="page-shell py-12 sm:py-16">
      <section role="alert" className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 text-center shadow-card sm:p-9">
        <h1 className="text-2xl font-bold">Favorites could not load</h1>
        <p className="mt-2 text-foreground-muted">Please try again in a moment.</p>
        <button
          type="button"
          onClick={reset}
          className="app-control mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
