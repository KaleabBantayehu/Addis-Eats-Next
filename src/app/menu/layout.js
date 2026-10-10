
import Link from "next/link";
import { dishes } from "./dishes";

export default function MenuLayout({
  children,
}) {
  const categories = [
    ...new Set(
      dishes.map((dish) => dish.category)
    ),
  ];

  return (
    <div className=" grid gap-12 md:grid-cols-[220px_1fr] ">
      <aside className="hidden mt-10 h-fit rounded-xl border border-orange-100 bg-red-900 p-5 md:top-6 md:block">
        <h2 className="mb-4 text-lg font-bold text-3xl font-bold text-yellow-400">
          Categories
        </h2>

        <nav className="flex flex-col gap-2">
          <Link
            href="/menu"
            className="rounded-lg px-3 py-2 text-xl font-bold text-yellow-400 hover:bg-orange-100 hover:text-orange-700"
          >
            All Dishes
          </Link>

          {categories.map((category) => (
            <Link
              key={category}
              href={`/menu?category=${encodeURIComponent(category)}`}
              className="rounded-lg px-3 text-xl font-bold text-yellow-400 py-2 hover:bg-orange-100 hover:text-orange-700"
            >
              {category}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="min-w-0">
        {children}
      </section>
    </div>
  );
}