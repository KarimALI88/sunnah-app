import { useLocalSearchParams } from 'expo-router';

import { DhikrReadScreen } from '@/features/azkar/components/DhikrReadScreen';

export default function SubcategoryReadingRoute() {
  const { subcategoryId } = useLocalSearchParams<{ subcategoryId: string }>();

  return <DhikrReadScreen dhikrId="0" subcategoryId={subcategoryId} />;
}
