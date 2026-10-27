import type { WirdItem } from '@/features/wird/types';

export const seedWirds: WirdItem[] = [
  {
    id: 'wird-1',
    title: 'أستغفر الله وأتوب إليه',
    targetCount: 100,
    currentCount: 70,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wird-2',
    title: 'سبحان الله وبحمده',
    targetCount: 33,
    currentCount: 33,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
