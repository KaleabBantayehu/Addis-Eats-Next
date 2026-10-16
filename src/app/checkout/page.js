import CheckoutForm from "./CheckoutForm";
import { CartProvider } from "../cart/CartProvider";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import CheckoutSummary from "./CheckoutSummary";

export const metadata = {
  title: "Checkout",
  description: "Complete your food order delivery address and payment details.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/checkout");
  }

  return (
    <CartProvider>
      <main className="page-shell py-8 sm:py-10">
        <header className="mb-7 sm:mb-9">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Checkout
          </h1>
          <p className="text-foreground-muted">
            Enter your delivery information
            and place your order.
          </p>
        </header>
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.8fr)] lg:gap-8">
          <section className="app-card p-5 sm:p-8" aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="mb-6 text-xl font-bold">Delivery details</h2>
            <CheckoutForm />
          </section>
          <aside className="app-card p-5 sm:p-6 lg:sticky lg:top-24">
            <CheckoutSummary />
          </aside>
        </div>
      </main>
    </CartProvider>
  );
}
