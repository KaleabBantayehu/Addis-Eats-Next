"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
} from "react";
import { addCartItem, CART_STORAGE_KEY } from "./cartStorage";

const CartContext = createContext(null);
const CART_CHANGE_EVENT = "addis-eats-cart-change";
const noopSubscribe = () => () => {};

function subscribeToCart(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(CART_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CART_CHANGE_EVENT, callback);
  };
}

function getCartSnapshot() {
  try {
    return localStorage.getItem(CART_STORAGE_KEY) || "[]";
  } catch (error) {
    console.error("Could not restore cart:", error);
    return "[]";
  }
}

function writeCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

export function CartProvider({ children }) {
  const snapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => "[]",
  );
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  let items = [];

  try {
    const storedItems = JSON.parse(snapshot);
    items = Array.isArray(storedItems) ? storedItems : [];
  } catch (error) {
    console.error("Could not parse saved cart:", error);
  }

  function addItem(dish) {
    writeCart(addCartItem(items, dish));
  }

  function removeItem(id) {
    writeCart(items.filter((item) => item.id !== id));
  }

  function clearCart() {
    writeCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        ready,
        addItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}