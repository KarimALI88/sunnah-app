import { useQuery } from '@tanstack/react-query';

import { allahNamesRepository } from '@/features/allah-names/services/allahNames.repository';

export const allahNameKeys = {
  all: ['allah-names'] as const,
  search: (q: string) => [...allahNameKeys.all, 'search', q] as const,
  detail: (id: string) => [...allahNameKeys.all, id] as const,
};

export function useAllahNames(query = '') {
  return useQuery({
    queryKey: allahNameKeys.search(query),
    queryFn: () => allahNamesRepository.search(query),
  });
}

export function useAllahName(id: string) {
  return useQuery({
    queryKey: allahNameKeys.detail(id),
    queryFn: () => allahNamesRepository.get(id),
    enabled: Boolean(id),
  });
}
