"use client";

import { useState } from "react";
import Link from "next/link";
import { handleSignOut } from "./actions/auth";
export default function Navbar({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-200 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-orange-600"
          onClick={closeMenu}
        >
          Addis Eats
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 font-medium md:flex">
          <Link
            href="/"
            className="text-orange-600 font-bold hover:text-green-600"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="text-orange-600 font-bold hover:text-green-600"
          >
            Menu
          </Link>
          <Link
            href="/cart"
            className="text-orange-600 font-bold hover:text-green-600"
          >
            Cart
          </Link>
              {session ?
              <>
                <Link href="/checkout" className="text-orange-600 font-bold hover:text-green-600">
                  Checkout
                </Link>

                <Link href="/orders" className="text-orange-600 font-bold hover:text-orange-600">
                  Orders
                </Link>

                {session.role === "staff" && 
                <Link href="/kitchen" className="text-orange-600 font-bold hover:text-orange-700">
                  Kitchen
                </Link>}

                <form action={handleSignOut}>
                  <button 
                  type="submit"
                  className="text-orange-600 font-bold transition">
                    Sign Out
                  </button>
                </form>

              </> : 
                <Link href="/signin" className="text-orange-600 font-bold hover:text-orange-700">
                  Sign In
                </Link>
              }
        </nav>

        {/* Hamburger Toggle Button (Mobile Only) */}
        <button
          onClick={toggleMenu}
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="rounded-lg p-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              // Cross icon (Close)
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger lines (Open)
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav className="border-t border-orange-100 bg-white px-6 py-4 shadow-inner md:hidden">
          <div className="flex flex-col gap-4 font-medium">
            <Link
              href="/"
              onClick={closeMenu}
              className="inline-block rounded-lg bg-orange-600 py-2.5 text-center font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Home
            </Link>
            <Link
              href="/menu"
              onClick={closeMenu}
              className="inline-block rounded-lg bg-orange-600 py-2.5 text-center font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Menu
            </Link>
            <Link
              href="/cart"
              onClick={closeMenu}
              className="inline-block rounded-lg bg-orange-600 py-2.5 text-center font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Cart
            </Link>
            {session ? 
            <>
            <Link 
                href="/checkout"               
                onClick={closeMenu}
                className="inline-block rounded-lg bg-orange-600 py-2.5 text-center font-semibold text-white transition-colors hover:bg-orange-700"
            >
                  Checkout
            </Link>

            <Link 
                href="/orders" 
                onClick={closeMenu}
                className="inline-block rounded-lg bg-orange-600 py-2.5 text-center font-semibold text-white transition-colors hover:bg-orange-700"
            >
                  Orders
            </Link>

            <form action={handleSignOut}>
              <button 
                type="submit"
                className="inline-block rounded-lg bg-orange-600 py-2.5 text-center font-semibold text-white transition-colors hover:bg-orange-700"
                >
                Sign Out
              </button>
            </form>
            
            {session.role === "staff" && 
              <Link 
                  href="/kitchen" 
                  onClick={closeMenu}
                  className="inline-block rounded-lg bg-orange-600 py-2.5 text-center font-semibold text-white transition-colors hover:bg-orange-700"
              >
                    Kitchen
              </Link>}
            </>
            : 
              <Link 
                href="/signin" 
                onClick={closeMenu}
                className="inline-block rounded-lg bg-orange-600 py-2.5 text-center font-semibold text-white transition-colors hover:bg-orange-700"
            >
                  Sign In
            </Link>}
          </div>
        </nav>
      )}
    </header>
  );
}