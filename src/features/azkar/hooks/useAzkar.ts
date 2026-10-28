import { useQuery } from '@tanstack/react-query';

import { azkarRepository } from '@/features/azkar/services/azkar.repository';

import { azkarKeys } from './queryKeys';

export function useCategories() {
  return useQuery({
    queryKey: azkarKeys.categories(),
    queryFn: () => azkarRepository.getCategories(),
  });
}

export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: azkarKeys.subcategories(categoryId),
    queryFn: () => azkarRepository.getSubcategories(categoryId),
    enabled: Boolean(categoryId),
  });
}

export function useDhikrs(subcategoryId: string) {
  return useQuery({
    queryKey: azkarKeys.dhikrs(subcategoryId),
    queryFn: () => azkarRepository.getDhikrs(subcategoryId),
    enabled: Boolean(subcategoryId),
  });
}

export function useDhikr(dhikrId: string) {
  return useQuery({
    queryKey: azkarKeys.dhikr(dhikrId),
    queryFn: () => azkarRepository.getDhikr(dhikrId),
    enabled: Boolean(dhikrId),
  });
}

export function useSearchSubcategories(query: string) {
  return useQuery({
    queryKey: azkarKeys.search(query),
    queryFn: () => azkarRepository.searchSubcategories(query),
  });
}
