# Addis Eats Performance Audit

## Scope and method

This report records Lighthouse lab results captured before and after the Day 49 changes. These are local measurements, not field-user data. The application was built for production and served at `http://localhost:3010` with Chrome Headless 155.0.8059.40, Lighthouse 12.8.2, Node 22.15.0, and Windows 11 Pro.

Lighthouse used mobile emulation at 412 × 823 CSS pixels, DPR 1.75, Android 11 Moto G Power (2022), simulated 150 ms RTT, 1638.4 Kbps throughput, and 4× CPU slowdown. Routes with three runs report the median; routes with one run are directional only. Results vary from run to run.

Authenticated Favorites measurements used a temporary test account cookie. `/checkout` and `/orders` redirected to sign-in in these unauthenticated lab runs. `/track/[id]` was not measured because a valid order was not available. Lighthouse lab runs do not provide Interaction to Next Paint (INP), and no CrUX field data was available.

## Results

| Route | Runs | Before: score / LCP / CLS / TBT | After: score / LCP / CLS / TBT |
|---|---:|---:|---:|
| `/` | 2 / 3 | 81 / 3.76 s / 0 / 580 ms | 73 / 4.01 s / 0 / 486 ms |
| `/menu` | 3 / 3 | 79 / 3.81 s / 0 / 353 ms | 78 / 3.47 s / 0 / 542 ms |
| `/menu/1` | 3 / 3 | 86 / 3.08 s / 0 / 278 ms | 79 / 3.37 s / 0 / 516 ms |
| `/cart` | 3 / 3 | 86 / 2.96 s / 0 / 320 ms | 84 / 2.96 s / 0 / 358 ms |
| `/checkout` (redirects to sign-in) | 1 / 1 | 88 / 2.94 s / 0 / 265 ms | 80 / 3.21 s / 0 / 442 ms |
| `/orders` (redirects to sign-in) | 1 / 1 | 88 / 2.98 s / 0 / 242 ms | 80 / 3.06 s / 0 / 462 ms |
| `/favorites` (signed in, new route) | — / 3 | — | 79 / 3.10 s / 0 / 479 ms |

Metrics are Lighthouse Performance score / Largest Contentful Paint / Cumulative Layout Shift / Total Blocking Time. The before home sample had two completed runs; most other before/after page comparisons have three. The single-run protected-route comparisons should not be treated as stable estimates.

The outcome is mixed. The menu LCP median improved by about 338 ms while its TBT increased by about 190 ms. Home TBT fell by about 94 ms while its LCP increased by about 252 ms and the score fell. Dish detail and cart also regressed in score and TBT. CLS remained zero in these samples. The current change set therefore does not meet a broad performance-improvement claim; the reported numbers identify follow-up work.

## Changes retained

- Manrope uses `next/font/google`, so it is fetched and served as a local build asset rather than requested from Google at runtime.
- Existing `next/image` usage and fixed image dimensions/aspect ratios are retained. The home hero and detail image, plus the first menu image, are marked for early loading; remaining menu and search results stay lazy-loaded.
- The Leaflet map remains dynamically imported without server rendering. Existing server-sent-event and CSV object-URL cleanup remains in place.
- Favorites cards render as Server Components. Favorite controls use Server Actions and avoid hydrating a separate client component for every dish.

## Next optimization pass

Investigate the high and variable TBT on menu, dish detail, and Favorites under CPU throttling. Capture browser traces to attribute main-thread work before adding more code splitting. Recheck hero image transfer size and LCP phases, especially on home. Repeat protected-route measurements with an authenticated browser session and include a real order tracking page when one is available. Keep repeated runs and compare medians.

## Reproduce

```powershell
npm run build
$env:SESSION_SECRET = 'a temporary local test secret of at least 32 characters'
npm run start -- --port 3010
```

Run Lighthouse against the routes above with the mobile settings listed in the method section. Use a disposable local secret only; do not place real credentials in commands, reports, or screenshots.
