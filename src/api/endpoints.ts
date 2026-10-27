/**
 * Real backend endpoint paths (v1).
 * Path builders return a string ready to be passed to `apiRequest`.
 */
export const endpoints = {
  guestIdentities: '/api/v1/guest/identities',
  categories: '/api/v1/categories',
  category: (categoryId: number | string) => `/api/v1/categories/${categoryId}`,
  subcategories: (categoryId: number | string) => `/api/v1/categories/${categoryId}/subcategories`,
  subcategory: (subcategoryId: number | string) => `/api/v1/subcategories/${subcategoryId}`,
  dhikrs: (subcategoryId: number | string) => `/api/v1/subcategories/${subcategoryId}/dhikrs`,
  dhikr: (dhikrId: number | string) => `/api/v1/dhikrs/${dhikrId}`,
  prayerTimes: '/api/v1/prayer-times',
} as const;
