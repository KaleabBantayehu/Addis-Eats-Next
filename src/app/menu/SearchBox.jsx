"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useDebounce } from "@/lib/useDebounce";
import { fetcher } from "@/lib/fetcher";
import DishCard from "./DishCard";

export default function SearchBox({
  initialValue = "",
  initialPage = 1,
  initialData,
  favoriteIds = [],
  showFavorite = false,
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialValue);
  const [page, setPage] = useState(initialPage);
  const debouncedSearch = useDebounce(search.trim(), 300);
  const query = debouncedSearch
    ? `/api/dishes?${new URLSearchParams({
        search: debouncedSearch,
        page: String(page),
      })}`
    : null;
  const { data, error, isLoading } = useSWR(query, fetcher, {
    fallbackData: initialData,
    keepPreviousData: true,
    dedupingInterval: 60000,
  });

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  return (
    <div className="app-card mx-auto w-full space-y-3 p-3 sm:p-4">
      <label htmlFor="menu-search-input" className="sr-only">
        Search menu items
      </label>
      <div className="flex w-full items-center gap-2">
        <input
          id="menu-search-input"
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search menu..."
          className="min-h-12 w-full rounded-lg border border-border bg-surface px-4 py-2 font-medium text-foreground placeholder:text-foreground-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPage(1);
              if (initialValue) router.replace("/menu", { scroll: false });
            }}
            aria-label="Clear menu search"
            className="flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-border px-4 py-2 font-bold text-foreground transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            Clear
          </button>
        )}
      </div>
      {debouncedSearch && (
        <section aria-live="polite" aria-busy={isLoading}>
          <h2 className="mb-4 text-2xl font-bold text-foreground">Search Results</h2>
          {error ? (
            <p role="alert" className="text-red-700">Could not load menu search results.</p>
          ) : data?.dishes?.length ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.dishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    rating={dish.rating}
                    imageSizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) 30vw, (max-width: 1279px) 24vw, 25vw"
                    isFavorite={favoriteIds.includes(String(dish.id))}
                    showFavorite={showFavorite}
                  />
                ))}
              </div>
              {data.pageCount > 1 && (
                <nav aria-label="Search result pages" className="flex items-center justify-center gap-4 py-4">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                    className="flex min-h-12 min-w-12 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 font-bold text-foreground transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="py-2 font-bold text-foreground" aria-current="page">
                    Page {data.page} of {data.pageCount}
                  </span>
                  <button
                    type="button"
                    disabled={page >= data.pageCount}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    className="flex min-h-12 min-w-12 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 font-bold text-foreground transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          ) : isLoading ? (
            <p className="text-foreground-muted">Searching the menu…</p>
          ) : (
            <p className="text-foreground-muted">No dishes match “{debouncedSearch}”.</p>
          )}
        </section>
      )}
      {!debouncedSearch && initialValue && (
        <p className="text-sm text-foreground-muted">Clear the search to return to the full menu.</p>
      )}
    </div>
  );
}
