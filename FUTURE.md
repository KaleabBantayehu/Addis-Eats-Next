# Addis Eats — Future Roadmap & Scoping Decisions (MoSCoW)

This document records the product scoping decisions for the Addis Eats Next.js application, adhering to the MoSCoW prioritization framework and the capstone discipline: *start no new features past the halfway point*. Unbuilt ideas and lower-priority capabilities were deliberately cut and scheduled for post-capstone milestones rather than omitted through oversight.

---

## 1. MoSCoW Prioritization Summary

### Must Have (Delivered in Production)
- [x] **Full-Stack Menu & Ordering**: SSR menu catalog with debounced client SWR search, static dish detail pre-rendering (`generateStaticParams`), and dynamic OpenGraph social card previews.
- [x] **Client-Side Cart**: Hydration-safe external store backed by `localStorage` with cross-tab broadcast synchronization.
- [x] **Tamper-Proof Authentication**: HMAC-SHA-256 signed session cookies containing minimal user IDs, server-side role resolution (Customer vs. Staff), and strict open redirect protection.
- [x] **Double-Submit Prevention & Hardened Forms**: React 19 `useActionState` pending locks, numeric phone inputs (`inputMode="numeric"`, `type="tel"`), and standard autocomplete attributes.
- [x] **Real-Time Delivery Tracking**: Dynamic Leaflet delivery map (`ssr: false`), Server-Sent Events (SSE) streaming updates (`/api/orders/[id]/stream`), and accessible text fallback.
- [x] **Data Export**: RFC 4180-compliant client-side CSV generator with automatic memory cleanup (`URL.revokeObjectURL`).
- [x] **Accessibility & Mobile Touch**: 100% keyboard navigable (`Tab`, `Enter`, `Escape`), high-contrast focus rings, and strict `44×44px` minimum touch targets.

### Should Have (Delivered in Hardening)
- [x] High-contrast visible focus indicators across all controls.
- [x] Accessible text mirrors for map markers and live ETA updates.
- [x] Expressive empty, loading, and error states across `/orders`, `/cart`, `/kitchen`, and `/menu`.
- [x] Explicit SEO discovery files (`/sitemap.xml`, `/robots.txt`) and `metadataBase` resolution.

### Could Have (Deliberately Cut & Scheduled for Future Iterations)
The following features were evaluated and deliberately cut to maintain architectural integrity, test coverage, and deployment stability:

---

## 2. Deferred Capabilities & Future Architectural Enhancements

### 1. Persistent Database Layer (PostgreSQL + Prisma / Drizzle)
- **Current State**: Uses an in-memory process-local store (`src/lib/orders.js`).
- **Deferred Feature**: Replace memory storage with a managed relational database (e.g., Supabase / Neon PostgreSQL) using Prisma ORM or Drizzle.
- **Rationale for Cutting**: Adding a database during the final sprint introduces migration risks, connection pooling overhead in serverless environments, and credentials management that distracts from verifying client accessibility, security refutations, and frontend performance.
- **Target Milestone**: v1.1.0

### 2. Live Payment Gateway Integration (TeleBirr & Chapa)
- **Current State**: Orders are placed with simulated TeleBirr mobile numbers.
- **Deferred Feature**: Direct API integration with Ethio Telecom TeleBirr SuperApp API and Chapa payment checkout webhooks.
- **Rationale for Cutting**: Production payment gateways require merchant credentials, TLS webhook callbacks, and sandbox testing keys that cannot be safely exposed in a demo classroom deployment.
- **Target Milestone**: v1.2.0

### 3. Native Driver GPS Telemetry
- **Current State**: Courier coordinates are simulated server-side along route vectors via Server-Sent Events.
- **Deferred Feature**: Dedicated driver PWA with `navigator.geolocation.watchPosition` streaming live latitude/longitude to an event broker.
- **Rationale for Cutting**: Scope exceeds single-user frontend capstone; simulated SSE accurately exercises the Leaflet map bounds and client streaming consumer.
- **Target Milestone**: v1.3.0

### 4. Web Push Notifications
- **Current State**: Order status updates stream via open SSE connections in the active browser tab.
- **Deferred Feature**: Browser Web Push API (Service Worker + VAPID keys) notifying customers when their food is preparing or delivered even if the browser tab is closed.
- **Rationale for Cutting**: Service worker registration and offline caching lifecycle add deployment complexity with minimal benefit for desktop/demo evaluation.
- **Target Milestone**: v1.4.0

### 5. Multi-Language Localization (Amharic & English)
- **Current State**: English UI with Ethiopian currency (`ETB`) and Addis Ababa timezone (`Africa/Addis_Ababa`) formatted via `Intl`.
- **Deferred Feature**: Full internationalization (`next-intl`) with Amharic (`am-ET`) script (Fidel) and English (`en-ET`) toggle.
- **Rationale for Cutting**: Menu catalog translation and bidirectional layout testing require substantial copywriting and font subsetting.
- **Target Milestone**: v1.5.0

### 6. Customer Dish Reviews & Photo Uploads
- **Current State**: Curated dish reviews and ratings embedded in static catalog fixtures.
- **Deferred Feature**: User-submitted reviews with image uploads stored on AWS S3 / Cloudflare R2 and moderation workflow in the kitchen dashboard.
- **Rationale for Cutting**: Requires authenticated multipart upload pipelines, image transformation, and anti-abuse moderation.
- **Target Milestone**: v2.0.0
