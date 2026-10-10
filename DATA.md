# Addis Eats Data Fetching and Caching

| Data / interaction | Where it runs | Query key / source | Seed and refresh rule | Reason |
|---|---|---|---|---|
| Public dish catalog and `/menu` first render | Server Component | `getDishes()` from the static dish catalog | HTML is rendered with dishes on the first response; the menu route revalidates every 60 seconds when cached. | Public, stable data belongs on the server for indexing and quick first paint. |
| Dish detail `/menu/[id]` | Server Component | Static dish catalog keyed by route `id` | `generateStaticParams()` pre-renders the 12 known dishes; unknown IDs call `notFound()`. | The catalog is known at build time and each dish needs crawlable HTML. |
| Live menu search | Client SWR query | `/api/dishes?search=${debouncedTerm}&page=${page}`; `null` while the search is empty | The server-rendered search term and results are passed as `fallbackData`; typing is debounced by 300 ms; `keepPreviousData` is enabled; API catalog responses can be cached for 60 seconds in the browser. | Search is user-triggered, so the client fetches once after typing pauses instead of requesting every keystroke. |
| Search page changes | Client SWR query | Same key, with the updated `page` | Six dishes per page; the previous page stays visible until the next page arrives. | Avoids clearing the result list while paging. |
| Customer order history | Server Component | `getOrdersByOwner(session.id)` | Read fresh on each request; never takes an owner ID from the URL. | Owner scoping is authorization, not just a presentation filter. |
| Initial order status | Server Component | `getOrderById(id)` plus an owner comparison | The verified order status, ID, and total are rendered into the HTML and passed to the client. | The first paint is useful without waiting for a client request. |
| Live order status | Client SWR query | `/api/orders/${id}` | `fallbackData` uses the server-seeded order; polls every 5 seconds and revalidates on focus; response is private and `no-store`. | Status changes during preparation/delivery, and polling is scoped to the authenticated owner. |
| Cart | Client external store | `localStorage` key from `CART_STORAGE_KEY` | Hydration-safe snapshot; same-tab updates notify subscribers and browser `storage` events synchronize other tabs. | The cart is explicitly browser-local and does not include private server data. |
| New/cancelled/staff-updated orders | Server Actions or Route Handler | Process-local `globalThis.__addisEatsOrders` store | Mutations revalidate `/orders`, `/kitchen`, and the affected status page where applicable. | The store is only a single-process classroom/demo backing store. It loses state on restart and is not durable on serverless deployments. |

## API response behavior

- `GET /api/dishes?search=<text>&page=<n>` filters name, category, and description;
  it returns six records plus `total`, `page`, `pageCount`, and `hasMore`.
- `GET /api/orders/[id]` requires a signed session and owner match; it returns only
  `id`, `status`, `total`, and `createdAt`, with `Cache-Control: private, no-store`.
- `POST /api/orders` requires a signed session; the order service resolves prices
  from the server catalog and assigns the owner from the session, never the body.
