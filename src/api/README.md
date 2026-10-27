# API layer

Version 1 of the app uses **mock repositories** in `src/features/*/services`.

This folder is ready for the real HTTP client:

1. Set `EXPO_PUBLIC_API_BASE_URL` in `.env`.
2. Implement `apiClient.request` in `client.ts`.
3. Replace mock repository implementations without changing screens or feature hooks.

Do not invent live endpoints until the backend contract is provided.
