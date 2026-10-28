import { router } from 'expo-router';

import { CreateWirdModal } from '@/features/wird/components/CreateWirdModal';
import { useWirdMutations } from '@/features/wird/hooks/useWirds';
import type { WirdDraft } from '@/features/wird/types';

export default function CreateWirdRoute() {
  const { create } = useWirdMutations();

  const handleSubmit = (draft: WirdDraft) => {
    create.mutate(draft);
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  return (
    <CreateWirdModal
      visible={true}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
}
