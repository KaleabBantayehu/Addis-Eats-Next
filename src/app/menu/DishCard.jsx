import Image from "next/image";
import Link from "next/link";

export default function DishCard({ dish, rating, priority = false }) {
  const isAvailable = dish.available !== false;

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm transition-all hover:shadow-md">
      <div>
        {/* Image & Category Badge */}
        <div className="relative h-48 w-full overflow-hidden bg-orange-50">
          <Link href={`/menu/${dish.id}`}>
            {dish.image ? (
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={50}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-medium text-orange-600">
                No Image Available
              </div>
            )}
            {dish.category && (
              <span className="absolute top-3 left-3 rounded-full bg-orange-700 px-3 py-1 text-xs font-bold text-white shadow-sm">
                {dish.category}
              </span>
            )}
          </Link>
        </div>

        {/* Content Details */}
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-orange-800 uppercase">
              {dish.category || "General"}
            </span>

            {rating != null && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-800">
                <svg
                  className="h-4 w-4 fill-current text-amber-600"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </span>
            )}
          </div>

          <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors hover:text-orange-700">
            <Link href={`/menu/${dish.id}`}>{dish.name}</Link>
          </h3>

          <p className="line-clamp-2 text-sm font-medium text-gray-700">
            {dish.description}
          </p>
        </div>
      </div>

      {/* Footer / Action Controls */}
      <div className="p-5 pt-0">
        <div className="mb-3 flex items-center justify-between border-t border-gray-200 pt-4">
          <div>
            <span className="block text-xs font-bold text-gray-700">Price</span>
            <span className="text-lg font-extrabold text-orange-700">
              {dish.price} ETB
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/menu/${dish.id}`}
              className="rounded-lg border border-orange-700 px-3 py-2 text-xs font-bold text-gray-900 transition-colors hover:bg-orange-50"
            >
              View
            </Link>

            <button
              type="button"
              data-cart-item
              data-cart-id={String(dish.id)}
              data-cart-name={dish.name}
              data-cart-price={dish.price}
              disabled={!isAvailable}
              className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <p className="min-h-[1.25rem] text-right text-xs font-bold text-gray-800" role="status">
          {!isAvailable ? (
            <span className="text-red-700">Currently unavailable</span>
          ) : null}
        </p>
      </div>
    </article>
  );
}