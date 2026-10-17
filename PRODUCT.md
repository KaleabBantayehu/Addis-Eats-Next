# Product

<!-- impeccable:product-schema 1 -->

> Product facts in this note are inferred from the user-provided Day 49 brief and existing application documentation because no separate product brief was supplied.

## Platform

web

## Users

- Customers in Addis Ababa browsing dishes, placing delivery orders, and following their orders.
- Restaurant staff handling kitchen order updates.
- Administrators reviewing the application dashboard.

## Product Purpose

Addis Eats lets customers browse Ethiopian and other menu dishes, manage a cart, place authenticated delivery orders, and follow order progress.

## Capabilities and Constraints

- The application includes a menu, dish details, cart, checkout, sign-in, order history, staff kitchen views, dashboard, and delivery tracking.
- The dish catalog and demo user accounts are local fixtures.
- Favorites and orders are stored in Supabase and scoped to the signed-in account with Row Level Security.
- Checkout accepts dish IDs and quantities only; the server and database resolve available dish prices before persisting order totals and line-item snapshots.

## Brand Commitments

- Product name: Addis Eats.
- Keep the existing food photography and the established visual system in the app.

## Evidence on Hand

- Menu and demo user fixtures are in `src/app/menu/dishes.js` and `src/lib/session-profiles.js`.
- Authentication and data boundaries are documented in `AUTH.md` and `DATA.md`.
- No production database, persistent order store, or field performance data is available in the repository.

## Product Principles

- Keep customer data scoped to the authenticated account on the server.
- Keep browsing, cart, ordering, and tracking workflows intact when adding features.
- Describe the limits of demo credentials and database persistence accurately.

## Accessibility & Inclusion

- The user-provided UI requirements call for mobile-first responsiveness, light and dark themes, visible keyboard focus, and touch targets of at least 48 pixels.
