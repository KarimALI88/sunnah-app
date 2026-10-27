import { LoadingState } from '@/components/feedback/LoadingState';
import { AzkarCategoriesScreen } from '@/features/azkar/components/AzkarCategoriesScreen';
import { useCategories } from '@/features/azkar/hooks/useAzkar';

export default function TabCategoriesScreen() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) return <LoadingState />;

  // The backend returns the real categories; render the first one's sections.
  return <AzkarCategoriesScreen categoryId={categories?.[0]?.id ?? ''} />;
}
