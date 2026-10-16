"use client";

import {
  useActionState,
  useEffect,
  useRef,
} from "react";

import { placeOrder } from "../actions";

import { useCart } from "../cart/CartProvider";

const initialState = {
  success: false,
  message: "",
  fieldErrors: {},
  orderId: null,
};

export default function CheckoutForm() {
  const {
    items,
    ready,
    clearCart,
  } = useCart();

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    placeOrder,
    initialState
  );

  const clearedOrder =
    useRef(null);

  useEffect(() => {
    if (
      state.success &&
      state.orderId &&
      clearedOrder.current !==
        state.orderId
    ) {
      clearCart();

      clearedOrder.current =
        state.orderId;
    }
  }, [
    state.success,
    state.orderId,
    clearCart,
  ]);

  const orderItems = items.map(
    (item) => ({
      id: String(item.id),
      quantity: item.quantity,
    })
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(orderItems)}
      />

      <div>
        <label
          htmlFor="name"
          className="mb-2 block font-medium"
        >
          Full Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="min-h-12 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-base text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
        />

        {state.fieldErrors?.name && (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block font-medium"
        >
          Phone (TeleBirr / Ethiopian Mobile)
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="0911223344 or +251911223344"
          required
          className="min-h-12 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-base text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
        />

        {state.fieldErrors?.phone && (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.phone[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="area"
          className="mb-2 block font-medium"
        >
          Delivery Area
        </label>

        <input
          id="area"
          name="area"
          type="text"
          autoComplete="address-level2"
          placeholder="e.g. Bole, Kazanchis, Megenagna, Piassa, CMC"
          required
          className="min-h-12 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-base text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
        />

        {state.fieldErrors?.area && (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.area[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-2 block font-medium"
        >
          Delivery Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          rows="4"
          placeholder="e.g. Near Edna Mall, 2nd floor"
          className="min-h-28 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-base text-foreground transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
        />

        {state.fieldErrors?.notes && (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.notes[0]}
          </p>
        )}
      </div>

      {state.fieldErrors?.items && (
        <p className="text-sm text-red-600">
          {state.fieldErrors.items[0]}
        </p>
      )}

      <button
        type="submit"
        disabled={
          isPending ||
          !ready ||
          items.length === 0
        }
        className="flex min-h-12 min-w-12 items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending
          ? "Placing Order..."
          : "Place Order"}
      </button>

      {state.message && (
        <p
          aria-live="polite"
          className={
            state.success
              ? "text-green-700"
              : "text-red-600"
          }
        >
          {state.message}
        </p>
      )}

      {state.success &&
        state.orderId && (
          <p className="text-sm text-foreground-muted">
            Order ID: {state.orderId}
          </p>
        )}
    </form>
  );
}
