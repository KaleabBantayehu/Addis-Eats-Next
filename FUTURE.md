# Addis Eats — Future Roadmap & Scoping Decisions (MoSCoW)

This document records the product scoping decisions for the deployed Addis Eats application using the MoSCoW prioritization framework. Unbuilt ideas and lower-priority capabilities are scheduled for future milestones.

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

### 1. Additional Database Capabilities
- **Current State**: Favorites and orders persist in Supabase; order pricing is validated against the database catalog.
- **Deferred Feature**: Add payment processing and operational reporting on top of the persistent order model.
- **Rationale for Deferral**: Payment gateways require merchant credentials, TLS webhook callbacks, and sandbox testing before they can be enabled.
- **Target Milestone**: v1.2.0

### 2. Live Payment Gateway Integration (TeleBirr & Chapa)
- **Current State**: Orders are placed with simulated TeleBirr mobile numbers.
- **Deferred Feature**: Direct API integration with Ethio Telecom TeleBirr SuperApp API and Chapa payment checkout webhooks.
- **Rationale for Deferral**: Production payment gateways require merchant credentials, TLS webhook callbacks, and sandbox testing before integration.
- **Target Milestone**: v1.2.0

### 3. Native Driver GPS Telemetry
- **Current State**: Courier coordinates are simulated server-side along route vectors via Server-Sent Events.
- **Deferred Feature**: Dedicated driver PWA with `navigator.geolocation.watchPosition` streaming live latitude/longitude to an event broker.
- **Rationale for Deferral**: A driver application and event broker are additional services beyond the current simulated SSE tracking workflow.
- **Target Milestone**: v1.3.0

### 4. Web Push Notifications
- **Current State**: Order status updates stream via open SSE connections in the active browser tab.
- **Deferred Feature**: Browser Web Push API (Service Worker + VAPID keys) notifying customers when their food is preparing or delivered even if the browser tab is closed.
- **Rationale for Deferral**: Service worker registration and offline caching add operational complexity; current status updates are delivered while the browser tab is active.
- **Target Milestone**: v1.4.0

### 5. Multi-Language Localization (Amharic & English)
- **Current State**: English UI with Ethiopian currency (`ETB`) and Addis Ababa timezone (`Africa/Addis_Ababa`) formatted via `Intl`.
- **Deferred Feature**: Full internationalization (`next-intl`) with Amharic (`am-ET`) script (Fidel) and English (`en-ET`) toggle.
- **Rationale for Cutting**: Menu catalog translation and bidirectional layout testing require substantial copywriting and font subsetting.
- **Target Milestone**: v1.5.0

### 6. Customer Dish Reviews & Photo Uploads
- **Current State**: Customer-submitted reviews and photo uploads are not currently supported.
- **Deferred Feature**: User-submitted reviews with image uploads stored on AWS S3 / Cloudflare R2 and moderation workflow in the kitchen dashboard.
- **Rationale for Cutting**: Requires authenticated multipart upload pipelines, image transformation, and anti-abuse moderation.
- **Target Milestone**: v2.0.0
