import { useLocalSearchParams } from 'expo-router';

import { DhikrReadScreen } from '@/features/azkar/components/DhikrReadScreen';

export default function DhikrReadingRoute() {
  const { dhikrId, subcategoryId } = useLocalSearchParams<{
    dhikrId: string;
    subcategoryId?: string;
  }>();

  return (
    <DhikrReadScreen
      dhikrId={dhikrId ?? '0'}
      subcategoryId={subcategoryId}
    />
  );
}
