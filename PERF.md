# Addis Eats Performance Budget and Audit

## Targets from the Day 45 brief

| Metric | Target |
|---|---:|
| Mobile, throttled LCP | < 2.5 s |
| CLS | < 0.1 |
| First Load JS for `/menu` | < 120 kB |
| Largest optimized image | < 150 kB |
| Lighthouse performance | ≥ 90 |

## Results

| Metric | Before | After | Evidence |
|---|---:|---:|---|
| Mobile throttled LCP | Not recorded | Not recorded | No verifiable Lighthouse baseline/report was present in the project; the previous document's values did not include a saved report and could not be independently reproduced. |
| CLS | Not recorded | Not recorded | Needs a Lighthouse trace from the deployed preview. |
| First Load JS, `/menu` | Not recorded | Not recorded | Record the value reported by the deployed Lighthouse/Next build for the submitted commit. |
| Largest optimized image | Not recorded | Not recorded | Inspect the actual optimized image response in the deployed Network panel; source bytes alone are not the delivered image size. |
| Lighthouse performance | Not recorded | Not recorded | Needs a Lighthouse run against the production preview URL. |

Numbers are deliberately left unclaimed until there is reproducible evidence;
localhost and unverified historical estimates are not deployment audit results.
The project has no configured deployed preview URL, so the production-preview
Lighthouse requirement remains to be completed.

## Implemented optimizations

- Dish cards use `next/image`, responsive `sizes`, and `quality={50}` so public
  image responses can be resized and encoded for the requesting device.
- Only images in the first catalog section receive image priority. The social
  preview image is generated at 1200×630 and uses the dish image with its name
  and price.
- The bundled Geist typeface is loaded locally with `next/font/local` and `display: swap`, avoiding a
  runtime Google Fonts request and reducing font-related layout movement.
- The menu and dish catalog are server-rendered; menu catalog data is revalidated
  after 60 seconds. The client search bundle is isolated to `SearchBox`, debounces
  requests by 300 ms, seeds its first results from server props, and retains the
  previous results between queries.
- Order status HTML is seeded by the server; the client refreshes its
  owner-protected response every five seconds. The JSON-LD data is emitted as
  non-blocking inline structured data rather than a third-party script request.

## Reproducible measurement

1. Configure `NEXT_PUBLIC_SITE_URL` and `SESSION_SECRET` for the deployed preview.
2. Build and start the production app (not `next dev`), then run Lighthouse from
   Chrome DevTools on `/` and `/menu` with a mobile profile, Fast 3G, and 4× CPU
   slowdown. Save the Lighthouse JSON/HTML report with the project submission.
3. Record the `Performance`, `LCP`, `CLS`, and `/menu` JavaScript values above.
4. In Network, filter `Img`, hard-reload `/menu`, and record the largest delivered
   optimized-image response's transferred bytes.
5. Compare the measurements to a report captured from the same routes and
   conditions before applying the optimizations. Do not substitute screenshots
   or source-image sizes for the actual network/audit values.
