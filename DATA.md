# Addis Eats Data Fetching, State Management & Caching

This document details every data source, rendering boundary, cache policy, and synchronization strategy used throughout the Addis Eats application.

---

## 1. Data Fetching & Query Strategy Matrix

| Data / Interaction | Execution Environment | Query Key / Source | Seed & Refresh Policy | Architectural Rationale |
|---|---|---|---|---|
| **Dish Catalog (`/menu`)** | Server Component | `getDishes()` in `src/lib/dishes.js` | Server-rendered at request time; revalidates every 60s (`revalidate = 60`). | Fast first paint (FCP), fully indexable for search engines without waiting for client JS. |
| **Dish Detail (`/menu/[id]`)** | Static Site Generation (SSG) | Static dish catalog keyed by `params.id` | Pre-rendered at build time via `generateStaticParams()`; unknown IDs call `notFound()`. | Zero runtime database query; served instantly from CDN edge nodes. |
| **Live Menu Search** | Client SWR Query | `/api/dishes?search=${debounced}&page=${page}` (disabled when empty) | Seeded with server `initialData`; debounced by 300ms; `keepPreviousData: true`; 60s deduping. | Minimizes keystroke network spam while maintaining seamless list transitions without layout flash. |
| **Search Pagination** | Client SWR Query | Same API key with page counter | 6 items per page; previous page retained during page navigation. | Prevents empty flicker during page changes. |
| **Client Shopping Cart** | Client External Store | `localStorage` (`addis_eats_cart`) | Subscribed via custom store; synchronized across browser tabs via `window.addEventListener("storage")`. | Cart is private to user's device and requires zero server round-trips until checkout. |
| **Customer Orders (`/orders`)** | Server Component | `getOrdersByOwner(session.id)` | Server-rendered on demand (`force-dynamic`); never trusts query parameters. | Enforces strict data isolation: customers only receive orders linked to their signed session. |
| **Favorites (`/favorites`, menu, dish detail)** | Server Component + Server Action | `getFavoriteIdsForUser(session.id)` and `setFavoriteAction(dishId, isFavorite)` in `src/lib/favorites.js` | Reads and writes are scoped from the verified server session. The in-memory user-keyed store survives refreshes within one running process. | Uses the app's existing process-local storage approach; no database or competing auth system is introduced. |
| **Order Details (`/orders/[id]`)** | Hybrid Server + Client | `getOrderById(id)` seeded into `OrderStatusClient` | Server seeds `initialOrder`; client SWR polls `/api/orders/${id}` every 5s (`refreshInterval: 5000`). | Immediate initial paint without spinner; live status updates during food prep. |
| **Live Map & SSE Tracking (`/track/[id]`)** | Hybrid Server + Client SSE | `/api/orders/[id]/stream` via `EventSource` | Server pre-seeds courier/delivery coordinates; client consumes live SSE stream updates. `useEffect` closes connection on unmount or `delivered` status. | Unidirectional real-time courier telemetry without WebSocket connection overhead or polling churn. |
| **Kitchen Dashboard (`/kitchen`)** | Server Component | `getAllOrders()` from `src/lib/orders.js` | Server-rendered on demand (`force-dynamic`); role restricted to `staff`. | Kitchen staff immediately see latest incoming orders with server-validated state transitions. |
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
- **Caching**: `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`

### `POST /api/orders`
- **Authentication**: Required (`session` cookie)
- **Body**: `{ items: [{ id, quantity }], area, phone, notes }`
- **Security Logic**: Item prices are resolved strictly from the authoritative server catalog (`src/lib/dishes.js`), ignoring any prices supplied in client payloads. The order `ownerId` is stamped directly from `session.id`.
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
- **Framing**: `data: {"id":"1","status":"out-for-delivery","courierLocation":[...],"etaMinutes":15}\n\n`
- **Stream Termination**: Stream automatically closes when order status reaches `delivered` or client disconnects.

---

## 3. Formatting & Internationalization Standards (`src/lib/format.js`)

To prevent client/server hydration mismatches across different operating systems and browser locales:
- **Currency (`etb`)**: Explicitly configured with `new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 0 })`.
- **Date & Time (`when`)**: Explicitly pinned to Ethiopia's timezone: `new Intl.DateTimeFormat("en-ET", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Addis_Ababa" })`.
- **Relative Time (`relative`)**: Configured with `new Intl.RelativeTimeFormat("en", { numeric: "auto" })`.
