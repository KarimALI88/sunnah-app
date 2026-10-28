# Backend integration

Base URL: `EXPO_PUBLIC_API_BASE_URL` (fallback: `https://athkar-be.ofx-qrcode.com`).

## Guest identity

`IdentityProvider` calls `ensureGuestIdentity()` once when the app opens, before rendering API-backed screens. The service reuses both `@sakinah:identity_id` and `@sakinah:guest_token` when present; if either is missing it sends an unauthenticated `POST /api/v1/guest/identities`, validates the response, and stores both values in AsyncStorage. Authenticated requests attach the stored bearer token. Request logging does not print response bodies or credentials.

## Prayer times and location

The app checks foreground location permission on launch. Before reading a cached position or requesting a fresh one, the location service checks permission again. The prayer-times repository requests:

`GET /api/v1/prayer-times?latitude=...&longitude=...&date=YYYY-MM-DD&timezone=...&calculation_method=5&school=0`

When permission or location is unavailable, the request fails instead of showing prayer times for a hard-coded city. Coordinates are cached for one hour; city/country labels are reverse-geocoded where available.

## Dhikr content

- Categories: `GET /api/v1/categories?page=1&per_page=20`
- Subcategories: `GET /api/v1/categories/{categoryId}/subcategories?page=1&per_page=20`
- Dhikrs: `GET /api/v1/subcategories/{subcategoryId}/dhikrs?page=1&per_page=20`
- Single dhikr: `GET /api/v1/dhikrs/{dhikrId}`

The category, subcategory, and dhikr list repositories follow `meta.last_page` so all results are available when a collection spans multiple pages. Response fields map to the existing UI models. Reading routes pass real category/subcategory IDs and subcategory titles through Expo Router; the reader advances through the selected subcategory's API-ordered dhikr list and uses each `repetition_target`.

## Personal wird

- List: `GET /api/v1/guest/personal-wirds?page=1&per_page=20`
- Show: `GET /api/v1/guest/personal-wirds/{id}`
- Create: `POST /api/v1/guest/personal-wirds` with `text` and `target_count`
- Update: `PUT /api/v1/guest/personal-wirds/{id}` with `text` and `target_count`
- These guest endpoints use `X-Guest-Token` from the stored guest identity.
- The API contract provided so far does not include count/reset or delete endpoints. Counter progress and dismissed items therefore remain device-local; they are not synced to the backend.
