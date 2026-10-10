import Link from "next/link";

export default function MenuNotFound() {
  return (
    <div className="rounded-xl border border-orange-100 bg-white p-8 text-center shadow-sm">
      <h2 className="mb-3 text-2xl font-bold text-orange-600">Dish Not Found</h2>
      <p className="mb-6 text-gray-600">The dish you requested could not be found on our menu.</p>
      <Link
        href="/menu"
        className="inline-block rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
      >
        Return to Menu
      </Link>
    </div>
  );
}
