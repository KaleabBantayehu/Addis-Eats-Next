# Addis Eats Data Fetching, State Management & Caching

This document details every data source, rendering boundary, cache policy, and synchronization strategy used throughout the Addis Eats application.

---

## 1. Data Fetching & Query Strategy Matrix

| Data / Interaction | Execution Environment | Query Key / Source | Seed & Refresh Policy | Architectural Rationale |
|---|---|---|---|---|
| **Dish Catalog (`/menu`)** | Server Component | `getDishes()` in `src/app/menu/getDishes.js` | Reads current catalog visibility and availability flags; search endpoint is no-store. | Hidden dishes are omitted; finished-today and disabled dishes remain visible with an unavailable badge. |
| **Dish Detail (`/menu/[id]`)** | Static Site Generation (SSG) | Static dish catalog keyed by `params.id` | Pre-rendered at build time via `generateStaticParams()`; unknown IDs call `notFound()`. | Zero runtime database query; served instantly from CDN edge nodes. |
| **Live Menu Search** | Client SWR Query | `/api/dishes?search=${debounced}&page=${page}` (disabled when empty) | Seeded with server `initialData`; debounced by 300ms; `keepPreviousData: true`; 60s deduping. | Minimizes keystroke network spam while maintaining seamless list transitions without layout flash. |
| **Search Pagination** | Client SWR Query | Same API key with page counter | 6 items per page; previous page retained during page navigation. | Prevents empty flicker during page changes. |
| **Client Shopping Cart** | Client External Store | `localStorage` (`addis_eats_cart`) | Subscribed via custom store; synchronized across browser tabs via `window.addEventListener("storage")`. | Cart is private to user's device and requires zero server round-trips until checkout. |
| **Customer Orders (`/orders`)** | Server Component | `getOrdersByOwner(session.id)` | Server-rendered on demand (`force-dynamic`); rows are scoped to the verified user and protected by RLS. | Orders and line-item snapshots persist in Supabase; totals and prices are resolved from the available dish catalog inside the `place_order` database function. |
| **Favorites (`/favorites`, menu, dish detail)** | Server Component + Server Action | `getFavoriteIdsForUser(session.id)` and `setFavoriteAction(dishId, isFavorite)` in `src/lib/favorites.js` | Reads and writes use the verified Supabase Auth session and `auth.uid()`-scoped RLS policies. | Favorites persist in the Supabase `favorites` table and are isolated by account. |
| **Order Details (`/orders/[id]`)** | Hybrid Server + Client | `getOrderById(id)` seeded into `OrderStatusClient` | Server seeds `initialOrder`; client SWR polls `/api/orders/${id}` every 5s (`refreshInterval: 5000`). | Immediate initial paint without spinner; live status updates during food prep. |
| **Live Map & SSE Tracking (`/track/[id]`)** | Hybrid Server + Client SSE | `/api/orders/[id]/stream` via `EventSource` | Server pre-seeds courier/delivery coordinates; client consumes live SSE stream updates. `useEffect` closes connection on unmount or `delivered` status. | Unidirectional real-time courier telemetry without WebSocket connection overhead or polling churn. |
| **Kitchen Dashboard (`/kitchen`)** | Server Component | `getAllOrders()` from `src/lib/orders.js` | Reads paginated live Supabase orders with nested order items; route is on-demand. | Staff/admin status changes use the `advance_order_status` RPC and enforce valid transitions in the database. |
| **Admin Dashboard (`/dashboard`)** | Server Component | `getAllOrders()` from `src/lib/orders.js` | Reads paginated Supabase orders and line-item snapshots on demand. | Computes delivered revenue, order counts, area trends, and top-selling dishes from persisted records. |
| **Order History CSV Export** | Client-side Generator | In-memory order record via `src/lib/csv.js` | Triggered on demand by user click; generates RFC 4180 CSV blob and revokes object URL immediately. | Pure client-side operation with zero server compute overhead or storage footprint. |

---

## 2. API Endpoints & Response Contracts

### `GET /api/dishes`
- **Query Params**: `search` (string), `page` (number), `category` (string)
- **Response**:
  ```json
  {
    "dishes": [...],
    "total": 12,
    "page": 1,
    "pageCount": 2,
    "hasMore": true
  }
  ```
- **Caching**: `Cache-Control: private, no-store`

### `POST /api/orders`
- **Authentication**: Required (verified Supabase Auth session)
- **Body**: `{ items: [{ id, quantity }], area, phone, notes }`
- **Security Logic**: Client payloads contain no trusted prices. The server validates dish availability and the `place_order` database function resolves each current price from `public.dishes`, calculates line totals and the order total, then atomically inserts the order and its line items. The function assigns `owner_id` from `auth.uid()`.
- **Response**: `{ success: true, orderId: "1", total: 420 }`

### `GET /api/orders/[id]`
- **Authentication**: Required (`session` cookie)
- **Authorization**: Scoped to `order.ownerId === session.id` (or `role === "staff"`)
- **Response**: `{ id: "1", status: "preparing", total: 420, createdAt: "..." }`
- **Caching**: `Cache-Control: private, no-store`

### `GET /api/orders/[id]/stream` (Server-Sent Events)
- **Authentication**: Required (`session` cookie)
- **Authorization**: Scoped to owner or staff
- **Headers**:
  - `Content-Type: text/event-stream; charset=utf-8`
  - `Cache-Control: no-cache, no-transform`
  - `Connection: keep-alive`
- **Framing**: `data: {"id":"uuid","status":"ready","courierLocation":[...],"etaMinutes":15}\n\n`
- **Stream Termination**: Stream automatically closes when order status reaches `delivered` or client disconnects.

---

## 3. Formatting & Internationalization Standards (`src/lib/format.js`)

To prevent client/server hydration mismatches across different operating systems and browser locales:
- **Currency (`etb`)**: Explicitly configured with `new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 0 })`.
- **Date & Time (`when`)**: Explicitly pinned to Ethiopia's timezone: `new Intl.DateTimeFormat("en-ET", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Addis_Ababa" })`.
- **Relative Time (`relative`)**: Configured with `new Intl.RelativeTimeFormat("en", { numeric: "auto" })`.
