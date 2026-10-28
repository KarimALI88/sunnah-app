import { useLocalSearchParams } from 'expo-router';

import { DhikrReadScreen } from '@/features/azkar/components/DhikrReadScreen';

export default function SubcategoryReadingRoute() {
  const { subcategoryId, categoryId, subcategoryTitle } = useLocalSearchParams<{ subcategoryId: string; categoryId?: string; subcategoryTitle?: string }>();

  return <DhikrReadScreen dhikrId="0" subcategoryId={subcategoryId} categoryId={categoryId} subcategoryTitle={subcategoryTitle} />;
}
