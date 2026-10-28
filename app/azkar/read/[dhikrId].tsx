import { useLocalSearchParams } from 'expo-router';

import { DhikrReadScreen } from '@/features/azkar/components/DhikrReadScreen';

export default function DhikrReadingRoute() {
  const { dhikrId, subcategoryId, categoryId, subcategoryTitle } = useLocalSearchParams<{
    dhikrId: string;
    subcategoryId?: string;
    categoryId?: string;
    subcategoryTitle?: string;
  }>();

  return (
    <DhikrReadScreen
      dhikrId={dhikrId ?? '0'}
      subcategoryId={subcategoryId}
      categoryId={categoryId}
      subcategoryTitle={subcategoryTitle}
    />
  );
}
