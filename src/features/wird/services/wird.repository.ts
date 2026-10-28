import { apiRequest } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type {
  PersonalWirdApiItem,
  PersonalWirdListResponse,
  PersonalWirdResponse,
  WirdDraft,
  WirdItem,
} from '@/features/wird/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalWirdProgress {
  counts: Record<string, number>;
  removedIds: string[];
}

const emptyProgress: LocalWirdProgress = { counts: {}, removedIds: [] };

async function readProgress(): Promise<LocalWirdProgress> {
  return (await storage.getItem<LocalWirdProgress>(STORAGE_KEYS.wirdProgress)) ?? emptyProgress;
}

async function writeProgress(progress: LocalWirdProgress): Promise<void> {
  await storage.setItem(STORAGE_KEYS.wirdProgress, progress);
}

async function request<T>(path: string, options: Parameters<typeof apiRequest<T>>[1] = {}): Promise<T> {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.guestToken);
  if (!token) throw new Error('Guest identity is not available. Please try again.');

  return apiRequest<T>(path, {
    ...options,
    auth: false,
    headers: { 'X-Guest-Token': token, ...options.headers },
  });
}

function toItem(item: PersonalWirdApiItem, currentCount = item.current_count): WirdItem {
  return {
    id: String(item.id),
    title: item.text,
    targetCount: item.target_count,
    currentCount,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export interface WirdRepository {
  list(): Promise<WirdItem[]>;
  get(id: string): Promise<WirdItem | undefined>;
  create(draft: WirdDraft): Promise<WirdItem>;
  update(id: string, patch: Partial<WirdDraft & { currentCount: number }>): Promise<WirdItem>;
  increment(item: WirdItem): Promise<WirdItem>;
  reset(item: WirdItem): Promise<WirdItem>;
  remove(id: string): Promise<void>;
}

export const wirdRepository: WirdRepository = {
  async list() {
    const progress = await readProgress();
    const response = await request<PersonalWirdListResponse>(endpoints.personalWirds, {
      query: { page: 1, per_page: 20 },
    });
    return response.data
      .filter((item) => !progress.removedIds.includes(String(item.id)))
      .map((item) => toItem(item, progress.counts[String(item.id)] ?? item.current_count));
  },

  async get(id) {
    const response = await request<PersonalWirdResponse>(endpoints.personalWird(id));
    const progress = await readProgress();
    return toItem(response.data, progress.counts[id] ?? response.data.current_count);
  },

  async create(draft) {
    const response = await request<PersonalWirdResponse>(endpoints.personalWirds, {
      method: 'POST',
      body: { text: draft.title.trim(), target_count: draft.targetCount },
    });
    const progress = await readProgress();
    progress.removedIds = progress.removedIds.filter((id) => id !== String(response.data.id));
    delete progress.counts[String(response.data.id)];
    await writeProgress(progress);
    return toItem(response.data);
  },

  async update(id, patch) {
    const response = await request<PersonalWirdResponse>(endpoints.personalWird(id), {
      method: 'PUT',
      body: {
        text: patch.title?.trim(),
        target_count: patch.targetCount,
      },
    });
    const progress = await readProgress();
    if (patch.currentCount !== undefined) {
      progress.counts[id] = patch.currentCount;
      await writeProgress(progress);
    }
    return toItem(response.data, progress.counts[id] ?? response.data.current_count);
  },

  async increment(item) {
    const id = item.id;
    const progress = await readProgress();
    const currentCount = (progress.counts[id] ?? item.currentCount) + 1;
    progress.counts[id] = currentCount;
    await writeProgress(progress);
    return { ...item, currentCount, updatedAt: new Date().toISOString() };
  },

  async reset(item) {
    const id = item.id;
    const progress = await readProgress();
    progress.counts[id] = 0;
    await writeProgress(progress);
    return { ...item, currentCount: 0, updatedAt: new Date().toISOString() };
  },

  async remove(id) {
    const progress = await readProgress();
    if (!progress.removedIds.includes(id)) progress.removedIds.push(id);
    delete progress.counts[id];
    await writeProgress(progress);
  },
};
