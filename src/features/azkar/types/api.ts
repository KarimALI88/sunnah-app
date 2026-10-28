/** Backend (Laravel-style) response shapes for the Azkar endpoints. */

export interface ApiCategory {
  id: number;
  title: string;
  description: string | null;
  icon_url: string | null;
  sort_order: number;
}

export interface ApiSubcategory {
  id: number;
  category_id: number;
  title: string;
  description: string | null;
  icon_url: string | null;
  sort_order: number;
  dhikrs_count: number;
}

export interface ApiDhikr {
  id: number;
  subcategory_id: number;
  title: string;
  text: string;
  description: string | null;
  source: string | null;
  virtue: string | null;
  explanation: string | null;
  repetition_target: number;
  sort_order: number;
  icon_url: string | null;
  audio_url: string | null;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface DhikrDetailResponse {
  data: ApiDhikr;
  meta: {
    previous_dhikr_id: number | null;
    next_dhikr_id: number | null;
  };
}
