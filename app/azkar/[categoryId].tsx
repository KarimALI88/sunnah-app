import { useLocalSearchParams } from 'expo-router';

import { AzkarCategoriesScreen } from '@/features/azkar/components/AzkarCategoriesScreen';

export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  return <AzkarCategoriesScreen categoryId={categoryId ?? 'azkar'} />;
}
