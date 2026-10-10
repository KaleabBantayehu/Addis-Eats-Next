import DishCard from "./DishCard";

function makeId(category) {
  return category ? category.toLowerCase().replaceAll(" ", "-") : "dishes";
}

export default function DishList({
  dishes = [],
  category = "Dishes",
  prioritizeFirstImage = false,
}) {
  if (!dishes.length) {
    return (
      <div className="my-8 rounded-lg border border-dashed border-gray-200 p-8 text-center">
        <p className="text-gray-700">No dishes found in this category.</p>
      </div>
    );
  }

  return (
    <section id={makeId(category)} className="scroll-mt-6">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 md:mb-6">
        {category}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish, index) => (
          <DishCard
            key={dish.id}
            dish={dish}
            rating={dish.rating}
            // Prioritize only the top 2 visible cards in the primary section
            priority={prioritizeFirstImage && index < 2}
          />
        ))}
      </div>
    </section>
  );
}