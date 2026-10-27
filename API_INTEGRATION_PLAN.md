# API Integration Plan — Sakinah App

Base URL: `https://athkar-be.ofx-qrcode.com` (from `EXPO_PUBLIC_API_BASE_URL`, with a hard fallback so a missing env var can never produce a relative URL / HTML response).

All requests log to the console: `[API] → METHOD url`, `[API] ← status`, full JSON response on success, and `[API] Request failed …` on error.

## 1. HTTP client — `src/api/client.ts`

- Real `fetch` wrapper: `apiRequest<T>(path, { method, body, query, auth })`.
- Injects `Authorization: Bearer <guest_token>` from AsyncStorage by default (skipped automatically when no token is stored yet).
- Sends `Accept: application/json` (so Laravel returns JSON errors, not HTML).
- Non-JSON guard: if the response is not JSON, throw a clear error instead of a cryptic `SyntaxError`.

## 2. Endpoints — `src/api/endpoints.ts`

```
guestIdentities  POST /api/v1/guest/identities
categories       GET  /api/v1/categories?page=1&per_page=20
category(id)     GET  /api/v1/categories/{id}
subcategories(id) GET /api/v1/categories/{id}/subcategories?page=1&per_page=20
subcategory(id)  GET  /api/v1/subcategories/{id}
dhikrs(id)       GET  /api/v1/subcategories/{id}/dhikrs?page=1&per_page=20
dhikr(id)        GET  /api/v1/dhikrs/{id}
prayerTimes      GET  /api/v1/prayer-times
```

## 3. Guest identity flow (first thing on app open)

- `ensureGuestIdentity()`: read `@sakinah:identity_id` + `@sakinah:guest_token` from AsyncStorage.
  - Both present → reuse, **no request**.
  - Missing → `POST /api/v1/guest/identities`, store both keys, return identity.
- `IdentityProvider` runs `ensureGuestIdentity()` once on mount and exposes `{ identity, ready, error }`.

## 4. Prayer times (location first)

- Location is requested as the first thing on app open (root layout) and again (cached 1h) before the prayer-times request.
- `GET /api/v1/prayer-times?latitude=&longitude=&date=YYYY-MM-DD&timezone=&calculation_method=5&school=0`.
- Device timezone via `Intl` (`Africa/Cairo` fallback). City/country via `reverseGeocodeAsync`.
- Map `timings` → existing `PrayerDay` UI shape (prayers + night: midnight / last third).

## 5. Azkar hierarchy

- `AzkarRepository` calls the real endpoints and maps API fields to the existing UI types:
  `title/description/icon_url` → `Category`; `dhikrs_count` → `itemCount`; `text` → `arabicText`; `repetition_target` → `targetCount`; numeric ids → string ids.

## 6. UI wiring (minimal)

- Screens keep their current layout; only real API ids are passed through the routes (no more mock slugs such as `morning-1`).

## 7. Not in scope yet

- Personal wird APIs (to be provided).
