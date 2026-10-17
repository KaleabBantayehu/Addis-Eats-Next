import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getDishes } from "./menu/getDishes";
import DishCard from "./menu/DishCard";
import MenuCartActions from "./menu/MenuCartActions";

const socialImage =
  "https://addis-eats-next-psi.vercel.app/images/hero.png";
const homeDescription =
  "Order authentic Ethiopian dishes, freshly prepared and delivered across Addis Ababa.";

export const metadata = {
  title: "Addis Eats - Authentic Ethiopian Food Delivery",
  description: homeDescription,
  openGraph: {
    title: "Addis Eats - Authentic Ethiopian Food Delivery",
    description: homeDescription,
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
    title: "Addis Eats - Authentic Ethiopian Food Delivery",
    description: homeDescription,
    images: [socialImage],
  },
};

export default async function HomePage() {
  const dishes = await getDishes();
  const categories = [...new Set(dishes.map((dish) => dish.category))];
  const featuredDishes = dishes.slice(0, 4);

  return (
    <main className="pb-16">
      <section className="page-shell grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-16">
        <div className="order-2 flex flex-col items-start lg:order-1">
          <h1 className="mb-5 max-w-xl text-balance text-4xl font-bold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.5rem]">
            Welcome to Addis Eats
          </h1>
          <p className="mb-8 max-w-lg text-base leading-7 text-foreground-muted sm:text-lg">
            Discover delicious Ethiopian dishes delivered to your doorstep.
          </p>
          <Link
            href="/menu"
            className="app-control inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-card transition hover:bg-primary-hover hover:shadow-elevated"
          >
            Explore Our Menu <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <div className="order-1 relative min-h-[14rem] overflow-hidden rounded-2xl bg-surface-warm shadow-elevated min-[375px]:min-h-[17rem] sm:min-h-[25rem] lg:order-2 lg:min-h-[31rem]">
          <Image
            src="/images/hero.png"
            alt="A traditional Ethiopian platter served on injera"
            fill
            preload
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-surface-warm py-10 sm:py-14" aria-labelledby="discover-heading">
        <div className="page-shell">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 id="discover-heading" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Explore the menu
              </h2>
              <p className="mt-2 text-foreground-muted">Choose a category or browse all dishes.</p>
            </div>
            <Link href="/menu" className="hidden min-h-12 items-center gap-1 rounded-lg px-3 font-semibold text-secondary hover:bg-surface sm:inline-flex">
              Full menu <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <nav aria-label="Dish categories" className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/menu?category=${encodeURIComponent(category)}`}
                className="inline-flex min-h-12 shrink-0 items-center rounded-full bg-surface px-5 text-sm font-semibold capitalize text-foreground shadow-card transition hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </Link>
            ))}
          </nav>

          <MenuCartActions>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {featuredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  imageSizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1279px) 48vw, 24vw"
                />
              ))}
            </div>
          </MenuCartActions>
          <Link href="/menu" className="app-control mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-secondary bg-surface px-5 font-semibold text-secondary sm:hidden">
            View the full menu <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
