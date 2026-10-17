import Link from "next/link";
import { redirect } from "next/navigation";
import { addDishAction, updateDishFlagsAction } from "@/app/actions/menu";
import { getDishesForManagement } from "@/app/menu/getDishes";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Menu Management",
  description: "Manage the Addis Eats dish catalog and availability.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

const flags = [
  ["is_hidden", "Hidden from customers"],
  ["finished_today", "Finished for today"],
  ["is_available", "Available to order"],
];

export default async function DishManagementPage({ searchParams }) {
  const session = await getSession();
  if (!session || (session.role !== "staff" && session.role !== "admin")) {
    redirect("/");
  }

  const [dishes, params] = await Promise.all([
    getDishesForManagement(),
    searchParams,
  ]);

  return (
    <main className="page-shell space-y-8 py-8 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link href={session.role === "admin" ? "/dashboard" : "/kitchen"} className="text-sm font-semibold text-secondary hover:underline">
            Back to {session.role === "admin" ? "dashboard" : "kitchen"}
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Menu Management</h1>
          <p className="mt-2 text-foreground-muted">Add dishes and update customer visibility and availability.</p>
        </div>
        <Link href="/kitchen" className="app-control inline-flex min-h-12 items-center rounded-lg border border-secondary px-4 font-semibold text-secondary hover:bg-surface-muted">
          Kitchen orders
        </Link>
      </header>

      {params?.success === "created" && (
        <p role="status" className="rounded-lg border border-secondary/30 bg-surface-muted p-3">Dish added to the catalog.</p>
      )}
      {params?.success === "updated" && (
        <p role="status" className="rounded-lg border border-secondary/30 bg-surface-muted p-3">Dish settings updated.</p>
      )}
      {params?.error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {params.error === "invalid"
            ? "Check the dish details and try again."
            : "The dish could not be saved. Please try again."}
        </p>
      )}

      <section className="app-card p-5 sm:p-7" aria-labelledby="add-dish-heading">
        <h2 id="add-dish-heading" className="mb-5 text-xl font-bold">Add a dish</h2>
        <form action={addDishAction} className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">
            Dish name
            <input name="name" required minLength={2} maxLength={100} className="min-h-12 w-full rounded-lg border border-border bg-surface px-3" />
          </label>
          <label className="space-y-1 text-sm font-medium">
            Category
            <input name="category" required maxLength={60} className="min-h-12 w-full rounded-lg border border-border bg-surface px-3" />
          </label>
          <label className="space-y-1 text-sm font-medium">
            Price (ETB)
            <input name="price" type="number" min="0.01" max="1000000" step="0.01" required className="min-h-12 w-full rounded-lg border border-border bg-surface px-3" />
          </label>
          <label className="space-y-1 text-sm font-medium">
            Image URL
            <input name="image_url" type="text" placeholder="https://... or /images/..." className="min-h-12 w-full rounded-lg border border-border bg-surface px-3" />
          </label>
          <label className="space-y-1 text-sm font-medium sm:col-span-2">
            Description
            <textarea name="description" required maxLength={1000} rows={3} className="w-full rounded-lg border border-border bg-surface px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm font-medium sm:col-span-2">
            Ingredients (comma-separated)
            <input name="ingredients" maxLength={1000} className="min-h-12 w-full rounded-lg border border-border bg-surface px-3" />
          </label>
          <button type="submit" className="app-control min-h-12 rounded-lg bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover sm:col-span-2 sm:justify-self-start">
            Add dish
          </button>
        </form>
      </section>

      <section className="space-y-4" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className="text-xl font-bold">Dish catalog</h2>
        {dishes.length === 0 ? (
          <p className="app-card p-6 text-foreground-muted">There are no dishes in the catalog yet.</p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {dishes.map((dish) => (
              <li key={dish.id} className="app-card space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{dish.name}</h3>
                    <p className="text-sm text-foreground-muted">{dish.category} · {dish.price} ETB</p>
                  </div>
                  <span className="text-sm font-semibold">{dish.isHidden ? "Hidden" : "Visible"}</span>
                </div>
                <p className="line-clamp-2 text-sm text-foreground-muted">{dish.description}</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {flags.map(([field, label]) => {
                    const checked =
                      field === "is_hidden"
                        ? dish.isHidden
                        : field === "finished_today"
                          ? dish.finishedToday
                          : dish.available;
                    return (
                      <form key={field} action={updateDishFlagsAction}>
                        <input type="hidden" name="dishId" value={dish.id} />
                        <input type="hidden" name="field" value={field} />
                        <input type="hidden" name="value" value={String(!checked)} />
                        <button
                          type="submit"
                          aria-pressed={checked}
                          className={`app-control min-h-12 w-full rounded-lg border px-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-secondary ${checked ? "border-secondary bg-secondary/10 text-secondary" : "border-border text-foreground-muted hover:bg-surface-muted"}`}
                        >
                          {checked ? "✓ " : ""}{label}
                        </button>
                      </form>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
