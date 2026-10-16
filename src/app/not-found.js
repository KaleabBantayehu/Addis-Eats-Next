import Link from "next/link";

export default function NotFound() {
    return (
        <main className="page-shell flex min-h-[65svh] flex-col items-center justify-center py-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-secondary">Addis Eats</p>
            <h1 className="mb-4 text-7xl font-bold text-primary">
                404
            </h1>

            <h2 className="mb-4 text-2xl font-semibold">
                Page Not Found
            </h2>
            <p className="mb-8 text-foreground-muted">
                Sorry, we couldn&apos;t find what you&apos;re looking for.
            </p>
            <Link href="/" 
            className="app-control inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-card hover:bg-primary-hover">
                Return Home
            </Link>
        </main>
    );
}
