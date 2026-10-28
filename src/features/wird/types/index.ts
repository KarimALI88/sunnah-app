export interface WirdItem {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalWirdApiItem {
  id: number;
  text: string;
  target_count: number;
  current_count: number;
  created_at: string;
  updated_at: string;
}

export interface PersonalWirdListResponse {
  data: PersonalWirdApiItem[];
  links?: { next?: string | null };
  meta?: { last_page?: number };
}

export interface PersonalWirdResponse {
  data: PersonalWirdApiItem;
}

export interface WirdDraft {
  title: string;
  targetCount: number;
}
