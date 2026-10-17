import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { setFavoriteAction } from "@/app/actions/favorites";

export function FavoriteButton({ dishId, dishName, isFavorite }) {
  const action = setFavoriteAction.bind(null, String(dishId), !isFavorite);

  return (
    <form action={action} className="absolute right-3 top-3 z-10">
      <button
        type="submit"
        aria-label={`${isFavorite ? "Remove" : "Add"} ${dishName} ${isFavorite ? "from" : "to"} favorites`}
        aria-pressed={isFavorite}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-secondary shadow-card transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
      >
        <Heart aria-hidden="true" className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} strokeWidth={2} />
      </button>
    </form>
  );
}

export default function DishCard({
  dish,
  rating,
  fetchPriorityHigh = false,
  imageSizes = "(max-width: 639px) calc(100vw - 2rem), (max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) 31vw, (max-width: 1279px) 36vw, 27vw",
  showFavorite = false,
  isFavorite = false,
}) {
  const isAvailable = dish.orderable !== false && dish.available !== false;
  const imageUrl = dish.image_url;

  return (
    <article className="app-card group flex h-full flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
      <div>
        {/* Image & Category Badge */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
          <Link
            href={`/menu/${dish.id}`}
            className="block h-full w-full rounded-t-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-inset"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={dish.name}
                fill
                unoptimized={/^https?:\/\//i.test(imageUrl)}
                preload={fetchPriorityHigh}
                loading={fetchPriorityHigh ? "eager" : undefined}
                fetchPriority={fetchPriorityHigh ? "high" : undefined}
                sizes={imageSizes}
                quality={50}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-medium text-primary">
                No Image Available
              </div>
            )}
            {dish.category && (
              <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-card">
                {dish.category}
              </span>
            )}
            {(dish.finishedToday || !dish.available) && (
              <span className="absolute bottom-3 left-3 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-foreground shadow-card">
                {dish.finishedToday ? "Finished for today" : "Currently unavailable"}
              </span>
            )}
          </Link>
          {showFavorite ? (
            <FavoriteButton dishId={dish.id} dishName={dish.name} isFavorite={isFavorite} />
          ) : null}
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-secondary uppercase">
              {dish.category || "General"}
            </span>

            {rating != null && (
              <span className="flex items-center gap-1 text-xs font-bold text-accent-foreground">
                <svg
                  className="h-4 w-4 fill-current text-accent"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </span>
            )}
          </div>

          <h3 className="mb-2 text-xl font-semibold text-foreground transition-colors hover:text-primary-hover">
            <Link
              href={`/menu/${dish.id}`}
              className="rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              {dish.name}
            </Link>
          </h3>

          <p className="line-clamp-2 text-sm leading-6 text-foreground-muted">
            {dish.description}
          </p>
        </div>
      </div>

      {/* Footer / Action Controls */}
      <div className="mt-auto p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div>
            <span className="block text-xs font-bold text-foreground-muted">Price</span>
            <span className="price-number text-lg font-extrabold text-foreground">
              {dish.price} ETB
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/menu/${dish.id}`}
              className="flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-secondary px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
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
              className="flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <p className="min-h-[1.25rem] text-right text-xs font-bold text-foreground" role="status">
          {!isAvailable ? (
            <span className="text-red-700 dark:text-red-300">
              {dish.finishedToday ? "Finished for today" : "Currently unavailable"}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
}
