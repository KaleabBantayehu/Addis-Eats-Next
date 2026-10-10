# Addis Eats Authentication and Authorization

## Session

Sign-in verifies one of the local demo accounts in `src/lib/session.js`. It issues
a seven-day `session` cookie containing an HMAC-SHA-256-signed, base64url token.
The signed claims contain only a user ID and expiry; role, name, and email are
resolved from the server-owned profiles in `src/lib/session-profiles.js`.
Invalid, expired, edited, and unknown-user tokens are rejected.

The cookie uses `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` in production.
Set a unique random `SESSION_SECRET` of at least 32 characters in every deployed
environment. Production startup intentionally fails closed if it is absent.
The local development fallback secret is not safe for deployment.

The demo passwords are test fixtures, stored as plain text in source. Do not
reuse them or this demo credential store in a real service.

## Route and action checks

| Route / operation | First check | Server-side check | What the check proves |
|---|---|---|---|
| `/menu` and `/menu/[id]` | None | Public menu data | Menu and dishes remain public and indexable. |
| `/cart` | None | Cart is local browser storage | No customer order data is exposed by the cart page. |
| `/checkout` | `src/proxy.js` verifies the signed cookie | `src/app/checkout/page.js` calls `getSession()` | A valid signed-in session exists before the form renders. |
| `placeOrder` | Server Action validates session | `src/app/actions.js` binds owner ID from the verified session | An unsigned/guest request cannot create an order or select its owner. |
| `POST /api/orders` | API verifies session | Validates input and binds owner ID from the session | Direct HTTP order writes require a valid account. |
| `/orders` | Proxy verifies signed cookie | Page queries `getOrdersByOwner(session.id)` | Each customer sees only orders belonging to their session. |
| `/orders/[id]` | Proxy verifies signed cookie | Page compares order owner to `session.id` | Guessing another customer's order ID returns not found. |
| `GET /api/orders/[id]` | API verifies signed cookie | Owner check; returns only status/total/timestamps | Polling cannot expose another customer's order details. |
| `cancelOrder` | Action verifies signed-in session | Checks order ownership and refuses delivered/cancelled orders | A forged form cannot cancel another account's or a closed order. |
| `/kitchen` | Proxy verifies signed cookie and staff role | Page independently checks the role | A customer cannot load the staff dashboard. |
| `updateOrderStatusAction` | Action independently verifies staff role | Checks order and enforces the next legal status transition | Calling the action directly cannot bypass the kitchen UI or role check. |
| `/signin`, `/signout` | Public entry pages | Sign-in sanitizes `next`; sign-out clears the cookie server-side | External redirects are rejected and sign-out invalidates the session. |

## Required attack checks

Run these against the production build with the browser's Network/Application
panels or the commands in `README.md`; check status codes and redirects rather
than only the rendered UI.

1. **Unauthenticated write:** `POST /api/orders` without a cookie returns `401`.
   `placeOrder` independently returns an error when submitted without a session.
2. **Cross-account order lookup/cancellation:** place an order as account one,
   sign out, sign in as account two, then open `/orders/<first-order-id>` and
   `GET /api/orders/<first-order-id>`. The page returns not found and the API
   returns `404`; the cancellation action checks the same owner ID before it
   changes anything.
3. **Forged identity/role:** edit the `session` cookie to a JSON object or alter
   a valid token's payload to claim another ID or `staff`. The proxy and server
   reject the unsigned/tampered cookie; `/kitchen` never grants access.
4. **Open redirect:** `/signin?next=https://example.com` and
   `/signin?next=%2F%5C%5Cexample.com` fall back to `/`; sign-in never redirects
   off-site.

The unit tests in `tests/session-token.test.mjs` cover valid signatures,
tampering, expiry, malformed input, and unknown identities. Run `npm test`.

## Important persistence limitation

`src/lib/orders.js` uses a process-local in-memory store. It is suitable for a
single local production server and this classroom exercise, but orders disappear
on restart and do not reliably persist across serverless functions, replicas,
or deployment previews. A public deployment needs a persistent database before
its order workflow can be considered production-ready.
