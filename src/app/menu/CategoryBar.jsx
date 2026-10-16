import Link from "next/link";

export function FilterShell({ categories, selectedCategory, children }) {
  return (
    <div>
      <nav aria-label="Menu categories" className="mb-5 flex gap-2 overflow-x-auto pb-2 md:mb-8 md:flex-wrap md:overflow-visible">
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
              className={`flex min-h-12 shrink-0 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${
                category === selectedCategory
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-foreground-muted hover:bg-surface"
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
