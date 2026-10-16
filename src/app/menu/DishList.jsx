import DishCard from "./DishCard";

function makeId(category) {
  return category ? category.toLowerCase().replaceAll(" ", "-") : "dishes";
}

export default function DishList({
  dishes = [],
  category = "Dishes",
  prioritizeFirstImage = false,
  favoriteIds = [],
  showFavorite = false,
}) {
  if (!dishes.length) {
    return (
      <div className="my-8 rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-foreground-muted">No dishes found in this category.</p>
      </div>
    );
  }

  return (
    <section id={makeId(category)} className="scroll-mt-6">
      <h2 className="mb-4 text-2xl font-bold tracking-tight capitalize text-foreground md:mb-6">
        {category}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 sm:gap-5">
        {dishes.map((dish, index) => (
          <DishCard
            key={dish.id}
            dish={dish}
            rating={dish.rating}
            fetchPriorityHigh={prioritizeFirstImage && index === 0}
            imageSizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) 31vw, (max-width: 1279px) 36vw, 27vw"
            isFavorite={favoriteIds.includes(String(dish.id))}
            showFavorite={showFavorite}
          />
        ))}
      </div>
    </section>
  );
}
