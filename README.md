# Addis Eats — Full-Stack Ethiopian Food Delivery

Addis Eats is a production-hardened Next.js 16 App Router application for discovering Ethiopian culinary dishes, managing an interactive shopping cart, placing authenticated orders, and tracking couriers in real-time on an interactive map.

---

## 1. Live Deployment & Verification Links

- **Live Production URL**: `https://addis-eats-capstone.vercel.app` *(or your imported Vercel URL)*
- **GitHub Repository**: `https://github.com/kaleabbantayehu/addis-eats`
- **Sitemap**: `/sitemap.xml`
- **Robots**: `/robots.txt`

---

## 2. Quickstart & Clone Test (Clean Setup from Scratch)

Tested with Node.js `v20.9.0` or newer and `npm 10+`:

```bash
# 1. Clone repository
git clone https://github.com/kaleabbantayehu/addis-eats.git
cd addis-eats

# 2. Install dependencies cleanly
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Run automated checks & production build
npm run lint
npm run build

# 5. Start production server
npm run start
```
Visit `http://localhost:3000` to interact with the production build locally.

---

## 3. Environment Variables Reference

Defined in `.env.example`:

| Variable | Environment | Description | Example Value |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project origin; omit `/rest/v1`. | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase publishable/anon key; database access is limited by RLS. | Copy from Supabase project API settings. |
| `NEXT_PUBLIC_SITE_URL` | Public (optional) | Canonical origin for metadata, sitemaps, and robots. Defaults to `http://localhost:3000`. | `http://localhost:3000` |
| `PORT` | Local runtime (optional) | Next.js HTTP port. Defaults to `3000`. | `3000` |

Keep these values in the project-root `.env.local`; it is ignored by Git. Never expose a Supabase service-role/secret key in browser code or a `NEXT_PUBLIC_` variable.

## Favorites and Orders

Signed-in users can save dishes from menu cards, search results, and dish detail pages, then manage them at `/favorites`. Favorites and orders are stored in Supabase and scoped to the authenticated account by Row Level Security. Apply the migrations in `supabase/migrations/` to the matching project schema before using these features. Checkout sends only dish IDs and quantities; the server and `place_order` database function resolve prices from the available dishes catalog and persist order items and totals.

Staff and administrators can manage the menu at `/dashboard/menu`; the admin dashboard and kitchen queue read persistent orders and line items from Supabase. Apply `202610170001_menu_management_order_statuses.sql` after the favorites/orders migration to add dish visibility and daily availability flags and enable the `pending` → `preparing` → `ready` → `delivered` order flow.

Dish detail social cards use each record's `image_url`; the site-wide card uses the food photo at `public/images/hero.png`. Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin so generated metadata uses absolute production URLs; otherwise production defaults to the deployed Addis Eats origin and development to localhost.

---

## 4. Accounts & Roles

New accounts are created through Supabase Auth and receive the `customer` role by default. Assign `staff` or `admin` through a trusted database/admin operation; public sign-up never accepts a role. See [AUTH.md](./AUTH.md) and run the profile security migration in `supabase/migrations/` against the matching schema before enabling profile updates.

---

## 5. Verification and Performance

- `npm run lint` runs ESLint.
- `npm run build` runs the production build and Next.js type checks.
- This project does not currently define an automated unit or integration test script.
- Favorites require sign-in and are isolated by account on the server. Storage limits are described in [AUTH.md](./AUTH.md) and [DATA.md](./DATA.md).
- Reproducible Lighthouse conditions and measured results are documented in [PERF.md](./PERF.md). Lighthouse lab runs do not provide field INP.

---
## 6. Architecture & Documentation Directory

- [AUTH.md](./AUTH.md): Supabase Auth sessions, Proxy refresh, role handling, and authorization boundaries.
- [DATA.md](./DATA.md): Data fetching strategies, Server-Sent Events (SSE) telemetry contracts, and SWR caching keys.
- [PERF.md](./PERF.md): Performance budget before/after metrics, image optimization, and Lighthouse reproduction guide.
- [FUTURE.md](./FUTURE.md): MoSCoW scoping log, cut features, and architectural roadmap for v1.1+.
- [PRESENTATION.md](./PRESENTATION.md): 8-minute capstone presentation outline and code walkthrough cues.
- [STRATEGY.md](./STRATEGY.md) & [BOUNDARY.md](./BOUNDARY.md): Server Component vs. Client Component boundary decisions.
