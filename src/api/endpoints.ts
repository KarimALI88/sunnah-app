/**
 * Real backend endpoint paths (v1).
 * Path builders return a string ready to be passed to `apiRequest`.
 */
export const endpoints = {
  guestIdentities: '/api/v1/guest/identities',
  categories: '/api/v1/categories',
  subcategories: (categoryId: number | string) => `/api/v1/categories/${categoryId}/subcategories`,
  dhikrs: (subcategoryId: number | string) => `/api/v1/subcategories/${subcategoryId}/dhikrs`,
  dhikr: (dhikrId: number | string) => `/api/v1/dhikrs/${dhikrId}`,
  prayerTimes: '/api/v1/prayer-times',
  personalWirds: '/api/v1/guest/personal-wirds',
  personalWird: (id: number | string) => `/api/v1/guest/personal-wirds/${id}`,
} as const;
