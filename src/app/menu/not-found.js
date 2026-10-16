import Link from "next/link";

export default function MenuNotFound() {
  return (
    <div className="rounded-xl border border-border bg-surface p-8 text-center shadow-card">
      <h2 className="mb-3 text-2xl font-bold text-primary">Dish Not Found</h2>
      <p className="mb-6 text-foreground-muted">The dish you requested could not be found on our menu.</p>
      <Link
        href="/menu"
        className="inline-block rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-hover"
      >
        Return to Menu
      </Link>
    </div>
  );
}
