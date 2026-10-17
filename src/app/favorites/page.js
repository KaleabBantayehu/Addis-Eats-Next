import Link from "next/link";
import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getFavoriteIdsForUser } from "@/lib/favorites";
import { getDishes } from "@/app/menu/getDishes";
import DishCard from "@/app/menu/DishCard";
import MenuCartActions from "@/app/menu/MenuCartActions";

export const metadata = {
  title: "Your Favorites",
  description: "Your saved Addis Eats dishes.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/favorites");
  }

  const [favoriteIds, dishes] = await Promise.all([
    getFavoriteIdsForUser(session.id),
    getDishes(),
  ]);
  const favoriteDishes = favoriteIds
    .map((id) => dishes.find((dish) => String(dish.id) === id))
    .filter(Boolean);

  return (
    <main className="page-shell py-8 sm:py-10">
      <header className="mb-7 border-b border-border pb-6 sm:mb-9 sm:pb-7">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your Favorites</h1>
        <p className="mt-2 max-w-2xl text-foreground-muted">
          Dishes you saved for another time.
        </p>
      </header>

      {favoriteDishes.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-border bg-surface-muted px-5 py-12 text-center sm:px-8 sm:py-16">
          <Heart aria-hidden="true" className="mx-auto mb-4 h-9 w-9 text-secondary" strokeWidth={1.8} />
          <h2 className="text-xl font-bold">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md leading-6 text-foreground-muted">
            Save dishes from the menu and they will be waiting here for you.
          </p>
          <Link
            href="/menu"
            className="app-control mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            Explore the menu
          </Link>
        </section>
      ) : (
        <MenuCartActions>
          <section aria-label="Saved dishes" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
            {favoriteDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                showFavorite
                isFavorite
                imageSizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1279px) 47vw, 31vw"
              />
            ))}
          </section>
        </MenuCartActions>
      )}
    </main>
  );
}
