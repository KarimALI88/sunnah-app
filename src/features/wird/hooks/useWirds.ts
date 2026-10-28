import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { wirdRepository } from '@/features/wird/services/wird.repository';
import type { WirdDraft, WirdItem } from '@/features/wird/types';
import { useIdentity } from '@/providers/IdentityProvider';

export const wirdKeys = {
  all: ['wirds'] as const,
  detail: (id: string) => [...wirdKeys.all, id] as const,
};

export function useWirds() {
  const { ready, identity } = useIdentity();
  return useQuery({
    queryKey: wirdKeys.all,
    queryFn: () => wirdRepository.list(),
    enabled: ready && Boolean(identity?.guest_token),
  });
}

export function useWird(id: string) {
  const { ready, identity } = useIdentity();
  return useQuery({
    queryKey: wirdKeys.detail(id),
    queryFn: () => wirdRepository.get(id),
    enabled: ready && Boolean(identity?.guest_token) && Boolean(id),
  });
}

export function useWirdMutations() {
  const client = useQueryClient();
  const invalidate = () => {
    void client.invalidateQueries({ queryKey: wirdKeys.all });
  };

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
    mutationFn: (item: WirdItem) => wirdRepository.increment(item),
    onSuccess: (updated) => {
      client.setQueryData<WirdItem[]>(wirdKeys.all, (items) =>
        items?.map((item) => item.id === updated.id ? updated : item),
      );
    },
  });
  const reset = useMutation({
    mutationFn: (item: WirdItem) => wirdRepository.reset(item),
    onSuccess: (updated) => {
      client.setQueryData<WirdItem[]>(wirdKeys.all, (items) =>
        items?.map((item) => item.id === updated.id ? updated : item),
      );
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => wirdRepository.remove(id),
    onSuccess: invalidate,
  });

  return { create, update, increment, reset, remove };
}
