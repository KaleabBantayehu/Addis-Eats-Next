# Addis Eats Server / Client Boundaries

| Module | Boundary | Reason |
|---|---|---|
| `src/app/layout.js` | Server | Owns the document, metadata, and Restaurant JSON-LD. |
| `src/app/page.js`, `src/app/not-found.js` | Server | Public static content. |
| `src/app/menu/page.js` | Server | Reads the public catalog, builds structured data, and renders the initial menu/search results. |
| `src/app/menu/CategoryBar.jsx` | Server | Renders category navigation with `next/link`; it does not need client state. |
| `src/app/menu/DishList.jsx`, `DishCard.jsx` | Server-rendered | Render catalog content and image metadata; cart clicks are handled by the parent client boundary. |
| `src/app/menu/SearchBox.jsx` | Client | Owns the input, 300 ms debounce, pagination state, and seeded SWR search results. |
| `src/app/menu/MenuCartActions.jsx` | Client | Provides the cart interaction boundary around server-rendered dish cards. |
| `src/app/menu/[id]/page.js` | Server | Generates static detail pages, metadata, and per-dish structured data. |
| `src/app/cart/CartProvider.jsx`, `CartView.jsx` | Client | Synchronize browser-local cart data and provide interactive controls. |
| `src/app/cart/page.js` | Server | Static page shell for the cart UI. |
| `src/app/checkout/page.js` | Server | Verifies the session before rendering the checkout form. |
| `src/app/checkout/CheckoutForm.jsx` | Client | Reads the browser cart and submits the `placeOrder` Server Action. |
| `src/app/orders/page.js`, `src/app/orders/[id]/page.js` | Server | Verify the session, scope the order to its owner, and seed the first status view. |
| `src/app/orders/[id]/OrderStatusClient.jsx` | Client | Polls the owner-protected status API using SWR. |
| `src/app/kitchen/page.js` | Server | Verifies the staff role and renders current order data. |
| `src/app/actions.js` | Server Actions | Re-checks authentication, ownership, staff role, and status transitions at mutation time. |
| `src/app/api/**/route.js` | Route Handlers | Server-side validation, signed-session checks, owner scoping, and cache headers. |
| `src/lib/session.js`, `session-token.js`, `session-profiles.js` | Server | Cookie access, HMAC verification, and trusted user-role lookup. |
| `src/lib/orders.js`, `order-service.js`, `schema.js` | Server | Demo persistence, server-authoritative prices, and shared validation. |

The client search receives server-rendered fallback data as a serializable prop.
Neither the browser nor request parameters choose an order's owner. The cart is
browser-local; the order store is process-local and is not durable in a serverless
deployment.
