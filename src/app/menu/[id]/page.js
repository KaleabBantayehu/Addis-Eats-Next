import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDishById } from "../getDishes";
import { CheckCircle2,  ArrowLeft }  from "lucide-react";
import { getSession } from "@/lib/session";
import { getFavoriteIdsForUser } from "@/lib/favorites";
import { FavoriteButton } from "../DishCard";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDishById(id);
  if (!dish) return { title: "Dish not found" };

  const description = `${dish.name} ${dish.price} ETB. ${dish.description}`;
  const siteUrl = getSiteUrl();
  const pageUrl = new URL(`/menu/${dish.id}`, siteUrl).toString();
  const imageUrl = dish.image_url;

  return {
    title: dish.name,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: dish.name,
      description,
      type: "website",
      url: pageUrl,
      ...(imageUrl && {
        images: [{
          url: new URL(imageUrl, siteUrl).toString(),
          alt: `${dish.name} - ${dish.price} ETB`,
        }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: dish.name,
      description,
      ...(imageUrl && {
        images: [new URL(imageUrl, siteUrl).toString()],
      }),
    },
  };
}



export default async function DishDetailPage({ params }) {
  const { id } = await params;

  const dish = await getDishById(id);
  if (!dish) notFound();

  const session = await getSession();
  const favoriteIds = session ? await getFavoriteIdsForUser(session.id) : [];
  const ingredients = dish.ingredients;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    ...(dish.image_url && {
      image: new URL(dish.image_url, getSiteUrl()).toString(),
    }),
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
    },
  };

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
         <ArrowLeft className="h-5 w-5" />
         Back to Menu
      </Link>

      <article className="grid items-start gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-muted shadow-card lg:aspect-[1.05/1]">
            {dish.image_url ? (
              <Image
                src={dish.image_url}
                alt={dish.name}
                fill
                unoptimized={/^https?:\/\//i.test(dish.image_url)}
                preload
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
              />
            ) : null}
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

            {dish.finishedToday || !dish.available ? (
              <p className="mb-4 inline-flex rounded-full bg-surface-muted px-3 py-1.5 text-sm font-semibold text-foreground-muted">
                {dish.finishedToday ? "Finished for today" : "Currently unavailable"}
              </p>
            ) : null}

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
