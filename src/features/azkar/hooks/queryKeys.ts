export const azkarKeys = {
  all: ['azkar'] as const,
  categories: () => [...azkarKeys.all, 'categories'] as const,
  category: (id: string) => [...azkarKeys.all, 'category', id] as const,
  subcategories: (categoryId: string) => [...azkarKeys.all, 'subcategories', categoryId] as const,
  subcategory: (id: string) => [...azkarKeys.all, 'subcategory', id] as const,
  dhikrs: (subcategoryId: string) => [...azkarKeys.all, 'dhikrs', subcategoryId] as const,
  dhikr: (id: string) => [...azkarKeys.all, 'dhikr', id] as const,
  search: (query: string) => [...azkarKeys.all, 'search', query] as const,
};
