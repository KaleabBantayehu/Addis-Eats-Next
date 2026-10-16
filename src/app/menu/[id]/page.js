import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDishById } from "../getDishes";
import { CheckCircle2 }  from "lucide-react";
import { getSession } from "@/lib/session";
import { getFavoriteIdsForUser } from "@/lib/favorites";
import { FavoriteButton } from "../DishCard";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDishById(id);
  if (!dish) return { title: "Dish not found" };

  const description = `${dish.name} ${dish.price} ETB. ${dish.description}`;

  return {
    title: dish.name,
    description,
    openGraph: {
      title: dish.name,
      description,
      type: "website",
      images: [{
        url: `/menu/${id}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${dish.name} â€” ${dish.price} ETB`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: dish.name,
      description,
      images: [`/menu/${id}/opengraph-image`],
    },
  };
}



export default async function DishDetailPage({ params }) {
  const { id } = await params;

  const dish = await getDishById(id);
  if (!dish) notFound();

  const session = await getSession();
  const favoriteIds = session ? getFavoriteIdsForUser(session.id) : [];
  const ingredients = dish.ingredients;

  // 2. Define JSON-LD AFTER dish is guaranteed to exist
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${dish.image}`,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
    },
  };

  // 3. Return JSX with the <script> inside <main>
  return (
    <main className="page-shell py-6 sm:py-9">
      {/* Structured Data for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Link
        href="/menu"
        className="mb-5 inline-flex min-h-12 items-center rounded-lg px-3 py-2 font-semibold text-secondary transition-colors hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
      >
        â† Back to Menu
      </Link>

      <article className="grid items-start gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted shadow-card lg:aspect-[1.05/1]">
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              preload
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
            {session ? (
              <FavoriteButton
                dishId={dish.id}
                dishName={dish.name}
                isFavorite={favoriteIds.includes(String(dish.id))}
              />
            ) : null}
          </div>

          <div className="app-card p-5 sm:p-8 lg:sticky lg:top-24 lg:p-9">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary">
              {dish.category}
            </p>

            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">{dish.name}</h1>

            <p className="mb-6 leading-7 text-foreground-muted">{dish.description}</p>

            <p className="mb-7 text-3xl font-bold text-primary"><span className="price-number">{dish.price}</span> <span className="text-base font-semibold">ETB</span></p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">Ingredients</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {ingredients.map((ingredient) => (
                <li key={ingredient} className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2.5 text-sm font-medium text-foreground">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
      </article>
    </main>
  );
}
