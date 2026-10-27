import { router } from 'expo-router';

import { CreateWirdModal } from '@/features/wird/components/CreateWirdModal';
import { useWirdMutations } from '@/features/wird/hooks/useWirds';
import type { WirdDraft } from '@/features/wird/types';

export default function CreateWirdRoute() {
  const { create } = useWirdMutations();

  const handleSubmit = (draft: WirdDraft) => {
    create.mutate(draft);
    router.back();
  };

  return (
    <CreateWirdModal
      visible={true}
      onClose={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
