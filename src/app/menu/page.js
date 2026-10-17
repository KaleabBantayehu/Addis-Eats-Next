import Link from "next/link";
import { getDishes } from "./getDishes";
import DishList from "./DishList";
import { FilterShell } from "./CategoryBar";
import SearchBox from "./SearchBox";
import MenuCartActions from "./MenuCartActions";
import { getSession } from "@/lib/session";
import { getFavoriteIdsForUser } from "@/lib/favorites";

const socialImage =
  "https://addis-eats-next-psi.vercel.app/images/hero.png";
const menuDescription =
  "Browse authentic Ethiopian dishes, kitfo, tibs, pizzas, and drinks prepared fresh and delivered across Addis Ababa.";

export const metadata = {
  title: "Addis Eats Menu - Authentic Ethiopian Food Delivery",
  description: menuDescription,
  openGraph: {
    title: "Addis Eats Menu - Authentic Ethiopian Food Delivery",
    description: menuDescription,
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Addis Eats - Authentic Ethiopian Food Delivery",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats Menu - Authentic Ethiopian Food Delivery",
    description: menuDescription,
    images: [socialImage],
  },
};

export const revalidate = 60;

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const dishes = await getDishes();
  const session = await getSession();
  const favoriteIds = session ? await getFavoriteIdsForUser(session.id) : [];
  const dishCategories = [...new Set(dishes.map((dish) => dish.category))];
  const categories = ["All", ...dishCategories];
  const searchTerm = (params?.search || "").trim();
  const requestedCategory = params?.category;
  const selectedCategory =
    !searchTerm && dishCategories.includes(requestedCategory)
      ? requestedCategory
      : "All";
  const matchingDishes = searchTerm
    ? dishes.filter((dish) =>
        [dish.name, dish.category, dish.description].some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];
  const requestedPage = Number.parseInt(params?.page || "1", 10);
  const totalPages = Math.max(1, Math.ceil(matchingDishes.length / 6));
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const pageDishes = matchingDishes.slice((page - 1) * 6, page * 6);
  const initialSearchData = {
    dishes: pageDishes,
    hasMore: page < totalPages,
    total: matchingDishes.length,
    page,
    pageCount: totalPages,
  };
  const visibleCategories =
    selectedCategory === "All" ? dishCategories : [selectedCategory];
  
  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Addis Eats Main Menu",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Dishes",
        hasMenuItem: dishes.map((dish) => ({
          "@type": "MenuItem",
          name: dish.name,
          description: dish.description,
          offers: {
            "@type": "Offer",
            price: dish.price,
            priceCurrency: "ETB",
          },
        })),
      },
    ],
  };

  return (
    <main className="grid min-w-0 gap-6 py-1 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(menuJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <aside className="app-card sticky top-24 hidden h-fit p-4 md:block">
        <h2 className="mb-4 px-3 text-lg font-bold tracking-tight text-foreground">Categories</h2>
        <nav aria-label="Menu categories" className="flex flex-col gap-1">
          {categories.map((category) => {
            const href = category === "All" ? "/menu" : `/menu?category=${encodeURIComponent(category)}`;
            const selected = category === selectedCategory;
            return <Link key={category} href={href} aria-current={selected ? "page" : undefined} className={`flex min-h-12 items-center rounded-lg px-3 py-2 text-sm font-semibold capitalize transition-colors ${selected ? "bg-primary text-primary-foreground" : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"}`}>{category === "All" ? "All Dishes" : category}</Link>;
          })}
        </nav>
      </aside>
      <div className="min-w-0">
      <header className="mb-6 border-b border-border pb-6 sm:mb-8 sm:pb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Menu</h1>
        <p className="max-w-2xl text-sm leading-6 text-foreground-muted sm:text-base">
        Discover delicious Ethiopian dishes.
        </p>
      </header>

      <section className="mb-6 min-h-[50px] md:mb-8" aria-label="Search dishes">
        <SearchBox
          initialValue={searchTerm}
          initialPage={page}
          initialData={initialSearchData}
          favoriteIds={favoriteIds}
          showFavorite={Boolean(session)}
        />
      </section>

      {!session ? (
        <p className="mb-6 text-sm text-foreground-muted">
          <Link href="/signin?next=%2Ffavorites" className="font-semibold text-secondary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
            Sign in
          </Link>{" "}
          to save dishes to your favorites.
        </p>
      ) : null}

      <MenuCartActions>
        <FilterShell categories={categories} selectedCategory={selectedCategory}>
          {!searchTerm && (
            visibleCategories.map((category, index) => {
              const categoryDishes = dishes.filter(
                (dish) => dish.category === category
              );

              return (
                <DishList
                  key={category}
                  category={category}
                  dishes={categoryDishes}
                  prioritizeFirstImage={index === 0}
                  favoriteIds={favoriteIds}
                  showFavorite={Boolean(session)}
                />
              );
            })
          )}
        </FilterShell>
      </MenuCartActions>
      </div>
    </main>
  );
}
