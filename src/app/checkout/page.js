import CheckoutForm from "./CheckoutForm";
import { CartProvider } from "../cart/CartProvider";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

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
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-xl border border-orange-100 bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-4xl font-bold">
            Checkout
          </h1>

          <p className="mb-8 text-gray-600">
            Enter your delivery information
            and place your order.
          </p>

          <CheckoutForm />
        </div>
      </main>
    </CartProvider>
  );
}