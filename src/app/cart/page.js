
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
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-3 text-4xl font-bold text-gray-900">
          Your Cart
        </h1>

        <p className="mb-8 text-gray-600">
          Review your selected dishes before checkout.
        </p>

        <CartView />
      </main>
    </CartProvider>
  );
}