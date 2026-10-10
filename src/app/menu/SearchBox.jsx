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
    <div className="mx-auto w-full space-y-3 p-0 md:p-4">
      <label htmlFor="menu-search-input" className="sr-only">
        Search menu items
      </label>
      <div className="flex w-full gap-2">
        <input
          id="menu-search-input"
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search menu..."
          className="w-full rounded-lg border border-gray-400 bg-white px-4 py-2 font-medium text-gray-900 placeholder:text-gray-700 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
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
            className="rounded-lg border border-gray-400 px-4 py-2 font-bold text-gray-900 hover:bg-gray-100"
          >
            Clear
          </button>
        )}
      </div>
      {debouncedSearch && (
        <section aria-live="polite" aria-busy={isLoading}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Search Results</h2>
          {error ? (
            <p role="alert" className="text-red-700">Could not load menu search results.</p>
          ) : data?.dishes?.length ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.dishes.map((dish, index) => (
                  <DishCard key={dish.id} dish={dish} rating={dish.rating} priority={index < 2} />
                ))}
              </div>
              {data.pageCount > 1 && (
                <nav aria-label="Search result pages" className="flex justify-center gap-4 py-4">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                    className="rounded-md border border-gray-400 bg-white px-4 py-2 font-bold text-gray-900 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="py-2 font-bold text-gray-900" aria-current="page">
                    Page {data.page} of {data.pageCount}
                  </span>
                  <button
                    type="button"
                    disabled={page >= data.pageCount}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    className="rounded-md border border-gray-400 bg-white px-4 py-2 font-bold text-gray-900 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          ) : isLoading ? (
            <p className="text-gray-700">Searching the menu…</p>
          ) : (
            <p className="text-gray-700">No dishes match “{debouncedSearch}”.</p>
          )}
        </section>
      )}
      {!debouncedSearch && initialValue && (
        <p className="text-sm text-gray-600">Clear the search to return to the full menu.</p>
      )}
    </div>
  );
}