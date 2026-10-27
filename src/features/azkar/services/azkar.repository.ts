import { apiRequest } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { Category, Dhikr, Subcategory } from '@/features/azkar/types';
import type {
  ApiCategory,
  ApiDhikr,
  ApiSubcategory,
  DhikrDetailResponse,
  PaginatedResponse,
  SingleResponse,
} from '@/features/azkar/types/api';

const PER_PAGE = 20;

function mapCategory(item: ApiCategory): Category {
  return {
    id: String(item.id),
    title: item.title,
    subtitle: item.description ?? '',
    kind: 'azkar',
    icon: 'spa',
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
  getCategory(categoryId: string): Promise<Category | undefined>;
  getSubcategories(categoryId: string): Promise<Subcategory[]>;
  getSubcategory(subcategoryId: string): Promise<Subcategory | undefined>;
  getDhikrs(subcategoryId: string): Promise<Dhikr[]>;
  getDhikr(dhikrId: string): Promise<Dhikr | undefined>;
  searchSubcategories(query: string): Promise<Subcategory[]>;
}

export const azkarRepository: AzkarRepository = {
  async getCategories() {
    const response = await apiRequest<PaginatedResponse<ApiCategory>>(endpoints.categories, {
      query: { page: 1, per_page: PER_PAGE },
    });
    return response.data.map(mapCategory);
  },

  async getCategory(categoryId) {
    const response = await apiRequest<SingleResponse<ApiCategory>>(endpoints.category(categoryId));
    return response.data ? mapCategory(response.data) : undefined;
  },

  async getSubcategories(categoryId) {
    const response = await apiRequest<PaginatedResponse<ApiSubcategory>>(
      endpoints.subcategories(categoryId),
      { query: { page: 1, per_page: PER_PAGE } },
    );
    return response.data.map(mapSubcategory);
  },

  async getSubcategory(subcategoryId) {
    const response = await apiRequest<SingleResponse<ApiSubcategory>>(
      endpoints.subcategory(subcategoryId),
    );
    return response.data ? mapSubcategory(response.data) : undefined;
  },

  async getDhikrs(subcategoryId) {
    const response = await apiRequest<PaginatedResponse<ApiDhikr>>(endpoints.dhikrs(subcategoryId), {
      query: { page: 1, per_page: PER_PAGE },
    });
    return response.data.map(mapDhikr);
  },

  async getDhikr(dhikrId) {
    const response = await apiRequest<DhikrDetailResponse>(endpoints.dhikr(dhikrId));
    return response.data ? mapDhikr(response.data) : undefined;
  },

  async searchSubcategories(query) {
    const q = query.trim();
    if (!q) return [];

    const categoriesResponse = await apiRequest<PaginatedResponse<ApiCategory>>(endpoints.categories, {
      query: { page: 1, per_page: PER_PAGE },
    });

    const all: Subcategory[] = [];
    for (const category of categoriesResponse.data) {
      const subcategoriesResponse = await apiRequest<PaginatedResponse<ApiSubcategory>>(
        endpoints.subcategories(category.id),
        { query: { page: 1, per_page: PER_PAGE } },
      );
      all.push(...subcategoriesResponse.data.map(mapSubcategory));
    }

    return all.filter((item) => item.title.includes(q) || item.meta.includes(q));
  },
};
