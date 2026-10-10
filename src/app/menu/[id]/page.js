import Link from "next/link";
import { notFound } from "next/navigation";
import { dishes } from "../dishes";
import { CheckCircle2 }  from "lucide-react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = dishes.find((item) => String(item.id) === id);
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
        alt: `${dish.name} — ${dish.price} ETB`,
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

export function generateStaticParams() {
  return dishes.map((dish) => ({
    id: String(dish.id),
  }));
}

export default async function DishDetailPage({ params }) {
  const { id } = await params;

  // 1. Fetch/Find the dish FIRST
  const dish = dishes.find((item) => String(item.id) === id);
  const ingredients = dish.ingredients;

  if (!dish) {
    notFound();
  }

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
    <main>
      {/* Structured Data for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Link
        href="/menu"
        className="mb-6 inline-block text-slate-900 hover:underline"
      >
        ← Back to Menu
      </Link>

      <article className="rounded-xl border border-orange-100 bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
          {dish.category}
        </p>

        <h1 className="mb-4 text-4xl font-bold">{dish.name}</h1>

        <p className="mb-6 text-[#121c2a]">{dish.description}</p>

        <p className="text-2xl font-bold text-orange-600">{dish.price} ETB</p>

        <ul className="m-5 p-5 max-w-md">
          {ingredients.map((ingredient) => (<li key={ingredient} className="odd:bg-orange-100 text-red-900 font-semibold text-center flex items-center gap-10"><CheckCircle2 className="w-5 h-5 text-emeraled-500 shrink-0 "/> <span>{ingredient}</span> </li> ))}

        </ul>
      </article>
    </main>
  );
}