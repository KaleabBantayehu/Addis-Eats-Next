# Addis Eats - Full-Stack Ethiopian Food Delivery

Addis Eats is a Next.js 16 App Router application for discovering Ethiopian culinary dishes, managing an interactive shopping cart, placing authenticated orders, and tracking deliveries.

---

## 1. Live Deployment & Verification Links

- **Live application**: [https://addis-eats-next-psi.vercel.app/](https://addis-eats-next-psi.vercel.app/)
- **GitHub repository**: [KaleabBantayehu/Addis-Eats-Next](https://github.com/KaleabBantayehu/Addis-Eats-Next)
- **Sitemap**: [https://addis-eats-next-psi.vercel.app/sitemap.xml](https://addis-eats-next-psi.vercel.app/sitemap.xml)
- **Robots**: [https://addis-eats-next-psi.vercel.app/robots.txt](https://addis-eats-next-psi.vercel.app/robots.txt)

---

## 2. Local Development

Use Node.js `20.9.0` or newer and npm `10` or newer:

```bash
# Clone the repository
git clone https://github.com/KaleabBantayehu/Addis-Eats-Next.git
cd Addis-Eats-Next

# Install dependencies
npm install

# Configure local environment variables
cp .env.example .env.local

# Run checks and create a production build
npm run lint
npm run build

# Start the production build locally
npm run start
```
The local production build is available at `http://localhost:3000`. The deployed application is available at [https://addis-eats-next-psi.vercel.app/](https://addis-eats-next-psi.vercel.app/).

---

## 3. Environment Variables Reference

Set local values in `.env.local`. The public-prefixed variables are supported; where noted, the server also accepts non-prefixed aliases.

| Variable | Environment | Description | Example Value |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL` | Public URL | Supabase project origin; omit `/rest/v1`. | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY`, or `SUPABASE_ANON_KEY` | Public key | Supabase publishable/anon key; database access is limited by RLS. | Copy from Supabase project API settings. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical origin for metadata, sitemap, and robots. Set to the production URL in deployment; local development defaults to `http://localhost:3000`. | `https://addis-eats-next-psi.vercel.app` |
| `PORT` | Local runtime (optional) | Next.js HTTP port. Defaults to `3000`. | `3000` |

Keep local values in the project-root `.env.local`; it is ignored by Git. Never expose a Supabase service-role/secret key in browser code or a `NEXT_PUBLIC_` variable.

## Favorites and Orders

Signed-in users can save dishes from menu cards, search results, and dish detail pages, then manage them at `/favorites`. Favorites and orders are stored in Supabase and scoped to the authenticated account by Row Level Security. Apply the migrations in `supabase/migrations/` to the matching project schema before using these features. Checkout sends only dish IDs and quantities; the server and `place_order` database function resolve prices from the available dishes catalog and persist order items and totals.

Staff and administrators can manage the menu at `/dashboard/menu`; the admin dashboard and kitchen queue read persistent orders and line items from Supabase. Apply `202610170001_menu_management_order_statuses.sql` after the favorites/orders migration to add dish visibility and daily availability flags and enable the `pending` → `preparing` → `ready` → `delivered` order flow.

Dish detail social cards use each record's `image_url`; the site-wide card uses the food photo at `public/images/hero.png`. Metadata, sitemap, and robots URLs use `https://addis-eats-next-psi.vercel.app` as the production origin unless `NEXT_PUBLIC_SITE_URL` or the Vercel production URL is configured.

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
