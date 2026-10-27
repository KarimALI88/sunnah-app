export type ContentKind = 'azkar' | 'dua' | 'ruqyah' | 'quran' | 'allah-names';

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  kind: ContentKind;
  icon: string;
  accent: 'gold' | 'teal';
}

export interface Subcategory {
  id: string;
  categoryId: string;
  title: string;
  itemCount: number;
  meta: string;
  icon: string;
  iconTone: 'gold' | 'teal' | 'slate';
  progressPercent?: number;
}

export interface Dhikr {
  id: string;
  subcategoryId: string;
  title: string;
  arabicText: string;
  targetCount: number;
  description?: string;
  source?: string;
  virtue?: string;
  explanation?: string;
  badge: string;
  audioLabel?: string;
  audioUrl?: string;
  iconUrl?: string;
}
