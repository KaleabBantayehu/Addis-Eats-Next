import { getDishes } from "./getDishes";
import DishList from "./DishList";
import { FilterShell } from "./CategoryBar";
import SearchBox from "./SearchBox";
import MenuCartActions from "./MenuCartActions";

export const metadata = {
  title: "Menu",
  description:
      "Browse our full menu of authentic Ethiopian dishes, kitfo, tibs, pizzas, and combos available for fast delivery in Addis Ababa.",
  openGraph: {
      title: "Addis Eats Menu",
      description:
        "Browse our full menu of authentic Ethiopian dishes, kitfo, tibs, pizzas, and combos.",
      type: "website",
  },
};

export const revalidate = 60;

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const dishes = await getDishes();
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
    <main className="p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(menuJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <h1 className="mb-3 text-4xl font-bold text-gray-900">Our Menu</h1>
      <p className="mb-8 text-gray-700">
        Discover delicious Ethiopian dishes.
      </p>

      <section className="mb-4 min-h-[50px] md:mb-10">
        <SearchBox
          initialValue={searchTerm}
          initialPage={page}
          initialData={initialSearchData}
        />
      </section>

      <hr className="my-4 border-gray-200 md:my-8" />

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
                />
              );
            })
          )}
        </FilterShell>
      </MenuCartActions>
    </main>
  );
}