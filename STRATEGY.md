# Addis Eats Rendering Strategy

Rendering markers below should be refreshed from the latest `npm run build`;
`/menu` reads request search parameters and may therefore be rendered dynamically
even though its public catalog data uses a 60-second revalidation interval.

| Route | Intended rendering | Reason |
|---|---|---|
| `/` | Static | Public landing page; no request-specific data. |
| `/_not-found` | Static | Shared not-found screen. |
| `/menu` | Dynamic server render (catalog data revalidation: 60 s) | Supports server-seeded search parameters and renders public menu data. |
| `/menu/[id]` | Static generation | The 12 public dish IDs are known at build time. Unknown IDs call `notFound()`. |
| `/menu/opengraph-image` | Generated image | Share card for the public menu. |
| `/menu/[id]/opengraph-image` | Generated image | Dish photo, title, and price for a share card. |
| `/cart` | Static shell | Cart contents are browser-local. |
| `/checkout` | Dynamic | Reads the signed session and submits a protected Server Action. |
| `/orders` | Dynamic | Reads a session and queries only that owner's orders. |
| `/orders/[id]` | Dynamic | Verifies ownership and seeds a private live-status view. |
| `/kitchen` | Dynamic | Requires a valid staff session. |
| `/signin`, `/signout` | Dynamic | Session state and cookie mutation are request-specific. |
| `/api/dishes`, `/api/dishes/[id]` | Route Handlers | Public, server-side catalog APIs. |
| `/api/orders`, `/api/orders/[id]` | Route Handlers | Protected write and owner-scoped live status APIs. |
| `/sitemap.xml`, `/robots.txt` | Generated metadata routes | Include public catalog pages and exclude private routes. |

Run `npm run build` to see the actual Next.js route markers for this checkout.
