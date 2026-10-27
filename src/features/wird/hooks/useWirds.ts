import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { wirdRepository } from '@/features/wird/services/wird.repository';
import type { WirdDraft } from '@/features/wird/types';

export const wirdKeys = {
  all: ['wirds'] as const,
  detail: (id: string) => [...wirdKeys.all, id] as const,
};

export function useWirds() {
  return useQuery({
    queryKey: wirdKeys.all,
    queryFn: () => wirdRepository.list(),
  });
}

export function useWird(id: string) {
  return useQuery({
    queryKey: wirdKeys.detail(id),
    queryFn: () => wirdRepository.get(id),
    enabled: Boolean(id),
  });
}

export function useWirdMutations() {
  const client = useQueryClient();
  const invalidate = () => client.invalidateQueries({ queryKey: wirdKeys.all });

  const create = useMutation({
    mutationFn: (draft: WirdDraft) => wirdRepository.create(draft),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<WirdDraft & { currentCount: number }>;
    }) => wirdRepository.update(id, patch),
    onSuccess: invalidate,
  });
  const increment = useMutation({
    mutationFn: (id: string) => wirdRepository.increment(id),
    onSuccess: invalidate,
  });
  const reset = useMutation({
    mutationFn: (id: string) => wirdRepository.reset(id),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => wirdRepository.remove(id),
    onSuccess: invalidate,
  });

  return { create, update, increment, reset, remove };
}
