"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function MenuError({ error, reset }) {
    useEffect(() => {
        console.error("Menu error:", error);
    }, [error]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="mb-4 text-4xl font-bold text-red-600">Something went wrong!</h1>

            <p className="mb-6 text-gray-600">We couldn&apos;t load the menu right now.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => reset()}
                className="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700">Try Again</button>

                <Link href="/"
                className="rounded-lg bg-gray-800 px-6 py-3 text-white hover:bg-gray-900">Go Home</Link>
            </div>
        </main>
    );
}