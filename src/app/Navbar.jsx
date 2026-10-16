"use client";

import { useState } from "react";
import Link from "next/link";
import { handleSignOut } from "./actions/auth";
import ThemeToggle from "./ThemeToggle";
import { Heart } from "lucide-react";
export default function Navbar({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-border bg-surface/95 shadow-card backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="rounded-lg text-xl font-extrabold tracking-tight text-primary sm:text-2xl"
          onClick={closeMenu}
        >
          Addis Eats
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 font-medium lg:flex lg:gap-1 xl:gap-2">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted hover:text-secondary"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted hover:text-secondary"
          >
            Menu
          </Link>
          <Link
            href="/cart"
            className="inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted hover:text-secondary"
          >
            Cart
          </Link>
          {session ? (
            <Link
              href="/favorites"
              aria-label="Favorites"
              title="Favorites"
              className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-muted hover:text-secondary"
            >
              <Heart aria-hidden="true" className="h-5 w-5" />
            </Link>
          ) : null}
              {session ?
              <>
                <Link href="/checkout" className="inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted hover:text-secondary">
                  Checkout
                </Link>

                <Link href="/orders" className="inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted hover:text-secondary">
                  Orders
                </Link>

                {session.role === "staff" && 
                <Link href="/kitchen" className="inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted hover:text-secondary">
                  Kitchen
                </Link>}
                
                {session.role === "admin" && 
                <Link href="/dashboard" className="inline-flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted hover:text-secondary">
                Dasboard
                </Link> }

                <form action={handleSignOut}>
                  <button 
                  type="submit"
                  className="app-control px-3 text-sm text-primary font-semibold transition hover:text-secondary">
                    Sign Out
                  </button>
                </form>

              </> : 
                <Link href="/signin" className="app-control inline-flex items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                  Sign In
                </Link>
              }
        </nav>

        <ThemeToggle />

        {/* Hamburger Toggle Button (Mobile Only) */}
        <button
          onClick={toggleMenu}
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="flex min-h-12 min-w-12 items-center justify-center rounded-lg p-2 text-foreground-muted hover:bg-surface-muted hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-secondary lg:hidden"
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
        <nav className="border-t border-border bg-surface px-4 py-4 shadow-inner sm:px-6 lg:hidden">
          <div className="flex flex-col gap-2 font-medium">
            <Link
              href="/"
              onClick={closeMenu}
              className="app-control inline-flex w-full items-center justify-center rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Home
            </Link>
            <Link
              href="/menu"
              onClick={closeMenu}
              className="app-control inline-flex w-full items-center justify-center rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Menu
            </Link>
            <Link
              href="/cart"
              onClick={closeMenu}
              className="app-control inline-flex w-full items-center justify-center rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Cart
            </Link>
            {session ? (
              <Link
                href="/favorites"
                onClick={closeMenu}
                className="app-control inline-flex w-full items-center justify-center gap-2 rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Heart aria-hidden="true" className="h-4 w-4" />
                Favorites
              </Link>
            ) : null}
            {session ? 
            <>
            <Link 
                href="/checkout"               
                onClick={closeMenu}
                className="app-control inline-flex w-full items-center justify-center rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
                  Checkout
            </Link>

            <Link 
                href="/orders" 
                onClick={closeMenu}
                className="app-control inline-flex w-full items-center justify-center rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
                  Orders
            </Link>

            <form action={handleSignOut}>
              <button 
                type="submit"
                className="app-control inline-flex w-full items-center justify-center rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                Sign Out
              </button>
            </form>
            
            {session.role === "staff" && 
              <Link 
                  href="/kitchen" 
                  onClick={closeMenu}
                  className="app-control inline-flex w-full items-center justify-center rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                    Kitchen
              </Link>}

              {session.role === "admin" && 
                <Link 
                href="/dashboard" 
                onClick={closeMenu}
                className="app-control inline-flex w-full items-center justify-center rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                Dasboard
                </Link> 
                
              }
            </>
            : 
              <Link 
                href="/signin" 
                onClick={closeMenu}
                className="app-control inline-flex w-full items-center justify-center rounded-lg bg-surface-muted px-4 py-3 text-center font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
                  Sign In
            </Link>}
          </div>
        </nav>
      )}
    </header>
  );
}
