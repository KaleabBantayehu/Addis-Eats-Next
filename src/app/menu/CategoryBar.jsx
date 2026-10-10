import Link from "next/link";

export function FilterShell({ categories, selectedCategory, children }) {
  return (
    <div>
      <nav aria-label="Menu categories" className="mb-4 flex flex-wrap gap-3 md:mb-8">
        {categories.map((category) => {
          const href =
            category === "All"
              ? "/menu"
              : `/menu?category=${encodeURIComponent(category)}`;

          return (
            <Link
              key={category}
              href={href}
              aria-current={category === selectedCategory ? "page" : undefined}
              className={`rounded-full px-5 py-2 font-medium transition-colors ${
                category === selectedCategory
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              {category}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-10">{children}</div>
    </div>
  );
}