import { apiRequest } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { Category, Dhikr, Subcategory } from '@/features/azkar/types';
import type {
  ApiCategory,
  ApiDhikr,
  ApiSubcategory,
  DhikrDetailResponse,
  PaginatedResponse,
} from '@/features/azkar/types/api';

const PER_PAGE = 20;

async function getAllPages<T>(path: string): Promise<T[]> {
  const firstPage = await apiRequest<PaginatedResponse<T>>(path, {
    query: { page: 1, per_page: PER_PAGE },
  });
  if (firstPage.meta.last_page <= 1) return firstPage.data;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.meta.last_page - 1 }, (_, index) =>
      apiRequest<PaginatedResponse<T>>(path, {
        query: { page: index + 2, per_page: PER_PAGE },
      }),
    ),
  );
  return [firstPage.data, ...remainingPages.map((page) => page.data)].flat();
}

function mapCategory(item: ApiCategory): Category {
  return {
    id: String(item.id),
    title: item.title,
    subtitle: item.description ?? '',
    kind: 'azkar',
    icon: 'spa',
    iconUrl: item.icon_url ?? undefined,
    accent: 'gold',
  };
}

function mapSubcategory(item: ApiSubcategory): Subcategory {
  return {
    id: String(item.id),
    categoryId: String(item.category_id),
    title: item.title,
    itemCount: item.dhikrs_count ?? 0,
    meta: item.description ?? '',
    icon: 'spa',
    iconUrl: item.icon_url ?? undefined,
    iconTone: 'teal',
  };
}

function mapDhikr(item: ApiDhikr): Dhikr {
  return {
    id: String(item.id),
    subcategoryId: String(item.subcategory_id),
    title: item.title,
    arabicText: item.text,
    targetCount: item.repetition_target ?? 1,
    description: item.description ?? undefined,
    source: item.source ?? undefined,
    virtue: item.virtue ?? undefined,
    explanation: item.explanation ?? undefined,
    badge: item.source ?? 'ذكر',
    audioLabel: item.audio_url ? 'التلاوة الصوتية متاحة لهذا الذكر' : undefined,
    audioUrl: item.audio_url ?? undefined,
    iconUrl: item.icon_url ?? undefined,
  };
}

export interface AzkarRepository {
  getCategories(): Promise<Category[]>;
  getSubcategories(categoryId: string): Promise<Subcategory[]>;
  getDhikrs(subcategoryId: string): Promise<Dhikr[]>;
  getDhikr(dhikrId: string): Promise<Dhikr | undefined>;
  searchSubcategories(query: string): Promise<Subcategory[]>;
}

export const azkarRepository: AzkarRepository = {
  async getCategories() {
    const categories = await getAllPages<ApiCategory>(endpoints.categories);
    return categories.map(mapCategory);
  },

  async getSubcategories(categoryId) {
    const subcategories = await getAllPages<ApiSubcategory>(endpoints.subcategories(categoryId));
    return subcategories.map(mapSubcategory);
  },

  async getDhikrs(subcategoryId) {
    const dhikrs = await getAllPages<ApiDhikr>(endpoints.dhikrs(subcategoryId));
    return dhikrs.map(mapDhikr);
  },

  async getDhikr(dhikrId) {
    const response = await apiRequest<DhikrDetailResponse>(endpoints.dhikr(dhikrId));
    return response.data ? mapDhikr(response.data) : undefined;
  },

  async searchSubcategories(query) {
    const q = query.trim();
    if (!q) return [];

    const categories = await getAllPages<ApiCategory>(endpoints.categories);

    const groups = await Promise.all(categories.map((category) =>
      getAllPages<ApiSubcategory>(endpoints.subcategories(category.id)),
    ));
    const all: Subcategory[] = groups.flatMap((items) => items.map(mapSubcategory));

    return all.filter((item) => item.title.includes(q) || item.meta.includes(q));
  },
};
