
import CartView from "./CartView";
import { CartProvider } from "./CartProvider";

export const metadata = {
  title: "Your Cart",
  description: "Review your selected items and proceed to checkout on Addis Eats.",
  robots: { index: false, follow: false, nocache: true },
};

export default function CartPage() {
  return (
    <CartProvider>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="mb-3 text-4xl font-bold text-foreground">
          Your Cart
        </h1>

        <p className="mb-8 text-foreground-muted">
          Review your selected dishes before checkout.
        </p>

        <CartView />
      </main>
    </CartProvider>
  );
}
