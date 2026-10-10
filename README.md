# Addis Eats

Addis Eats is a Next.js App Router project for browsing Ethiopian dishes,
building a browser-local cart, placing orders, and tracking order status. It
demonstrates signed sessions, role and ownership checks, server-seeded SWR
queries, optimized dish images, per-route metadata, social previews, and sitemap
generation.

> **Classroom/demo scope:** Accounts are hard-coded fixtures and orders use a
> process-local in-memory store. Do not deploy this as a real ordering service:
> demo passwords are not production credentials, and order data is not durable
> across restarts, serverless functions, or replicas.

## Run locally

Requires Node.js 20.9 or newer.

```powershell
npm install
Copy-Item .env.example .env.local
```

For local development, the example values work. `SESSION_SECRET` is required in
production and must be replaced with a unique random value of at least 32
characters. Set `NEXT_PUBLIC_SITE_URL` to the absolute origin without a trailing
slash before deploying so the social image, sitemap, robots file, and structured
data use the real public origin.

```powershell
npm run dev
```

Open `http://localhost:3000`.

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Customer | `kaleabbantayehu@gmail.com` | `guest123` |
| Customer | `ermiyasDereje@gmail.com` | `ermi123` |
| Kitchen staff | `addisEats@gmail.com` | `addis@password` |

Use **Sign Out** before switching accounts. The email comparison is
case-insensitive. These public sample credentials must not be used outside the
demo.

## Checks

```powershell
npm test
npm run lint
npm run build
npm run start
```

`npm test` checks the signed-token verifier. After starting the production server,
verify `/sitemap.xml`, `/robots.txt`, `/menu`, and the metadata source. In a
browser session:

1. Submit a valid search term and watch the Network panel: a request to
   `/api/dishes?search=...&page=1` should fire once after typing pauses for 300 ms,
   not once per key.
2. Sign in as a customer and place an order. `/orders` should show it immediately;
   its detail page renders the status from the server, then polls every five
   seconds.
3. Open the same order ID while signed out (redirect to sign-in), then as the
   other customer (not found). `GET /api/orders/<id>` is also owner-scoped.
4. Try `POST /api/orders` without a cookie (401), alter the `session` cookie (it
   must not authenticate), and open `/kitchen` as a customer (redirect to `/`).
5. Sign in with the staff fixture and advance a test order through `preparing`,
   `out-for-delivery`, and `delivered`; direct action calls enforce the staff role
   and legal status transitions.
6. Test `/signin?next=https://example.com`; successful sign-in must land on `/`,
   not the external host.

## Routes and rendering

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/menu`, `/menu/[id]` | Public searchable catalog and static dish details |
| `/cart` | Browser-local cart |
| `/checkout` | Signed-in order form |
| `/orders`, `/orders/[id]` | Session-scoped history and server-seeded status polling |
| `/kitchen` | Staff-only order dashboard |
| `/signin`, `/signout` | Sign-in and cookie-clearing sign-out |
| `/api/dishes`, `/api/dishes/[id]` | Public dish endpoints |
| `/api/orders` | Signed-in order creation endpoint |
| `/api/orders/[id]` | Owner-scoped, non-cacheable status endpoint |
| `/sitemap.xml`, `/robots.txt` | Generated discovery metadata |

The `/menu` route revalidates its catalog data after 60 seconds. Dish detail pages
are statically generated from the known catalog. Private order and kitchen routes
are rendered dynamically and excluded from search indexing.

## API notes

- `GET /api/dishes?search=<term>&page=<n>` searches names, categories, and
  descriptions; returns six dishes plus `total`, `page`, `pageCount`, and
  `hasMore`.
- `POST /api/orders` requires the signed `session` cookie and validates the
  payload. Prices and owner IDs are always resolved server-side.
- `GET /api/orders/[id]` requires the order's owner and only returns status,
  total, ID, and creation time.
- Order creation rejects unauthenticated requests with `401`, malformed JSON
  with `400`, and invalid orders with `422`.

## Evidence and deployment

- [AUTH.md](./AUTH.md) documents the route/action checks and attack tests.
- [DATA.md](./DATA.md) documents the server/client query keys, cache behavior,
  and initial SWR data.
- [PERF.md](./PERF.md) records the performance budget and how to reproduce the
  Lighthouse measurement.
- [STRATEGY.md](./STRATEGY.md) and [BOUNDARY.md](./BOUNDARY.md) describe the
  actual rendering modes and component boundaries.

No deployed preview URL is configured in this workspace. Before presenting,
deploy from the production branch with a persistent order database, set
`SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL` in the deployment environment, then
replace the local Lighthouse result in `PERF.md` with a report from that deployed
preview. A local build cannot prove a deployment, third-party social-card fetch,
or serverless order persistence.
