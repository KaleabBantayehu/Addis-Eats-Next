# Product

<!-- impeccable:product-schema 1 -->

> Product facts in this note reflect the deployed application and its current repository documentation.

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
- The dish catalog, favorites, and orders are backed by Supabase. Customers authenticate with Supabase Auth; new accounts receive the customer role.
- Favorites and orders are stored in Supabase and scoped to the signed-in account with Row Level Security.
- Checkout accepts dish IDs and quantities only; the server and database resolve available dish prices before persisting order totals and line-item snapshots.

## Brand Commitments

- Product name: Addis Eats.
- Keep the existing food photography and the established visual system in the app.

## Evidence on Hand

- The production application is deployed at [https://addis-eats-next-psi.vercel.app/](https://addis-eats-next-psi.vercel.app/).
- The source repository is [KaleabBantayehu/Addis-Eats-Next](https://github.com/KaleabBantayehu/Addis-Eats-Next).
- Authentication and data boundaries are documented in `AUTH.md` and `DATA.md`.
- Field performance data is not available in the repository; local Lighthouse measurements are documented in `PERF.md`.

## Product Principles

- Keep customer data scoped to the authenticated account on the server.
- Keep browsing, cart, ordering, and tracking workflows intact when adding features.
- Describe database-backed behavior and remaining integrations accurately.

## Accessibility & Inclusion

- The user-provided UI requirements call for mobile-first responsiveness, light and dark themes, visible keyboard focus, and touch targets of at least 48 pixels.
