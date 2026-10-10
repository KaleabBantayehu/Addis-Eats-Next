import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="mb-4 text-7xl font-bold text-orange-600">
                404
            </h1>

            <h2 className="mb-4 text-2xl font-semibold">
                Page Not Found
            </h2>
            <p className="mb-8 text-gray-600">
                Sorry, we couldn&apos;t find what you&apos;re looking for.
            </p>
            <Link href="/" 
            className="rounded-lg bg-orange-600 px-6 py-3 text-white hover:bg-orange-700">
                Return Home
            </Link>
        </main>
    );
}