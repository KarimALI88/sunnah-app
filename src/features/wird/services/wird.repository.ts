import { seedWirds } from '@/features/wird/data/wird.mock';
import type { WirdDraft, WirdItem } from '@/features/wird/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/storage';

export interface WirdRepository {
  list(): Promise<WirdItem[]>;
  get(id: string): Promise<WirdItem | undefined>;
  create(draft: WirdDraft): Promise<WirdItem>;
  update(id: string, patch: Partial<WirdDraft & { currentCount: number }>): Promise<WirdItem>;
  increment(id: string): Promise<WirdItem>;
  reset(id: string): Promise<WirdItem>;
  remove(id: string): Promise<void>;
}

async function readAll(): Promise<WirdItem[]> {
  const saved = await storage.getItem<WirdItem[]>(STORAGE_KEYS.wirds);
  if (saved && saved.length) return saved;
  await storage.setItem(STORAGE_KEYS.wirds, seedWirds);
  return seedWirds;
}

async function writeAll(items: WirdItem[]): Promise<void> {
  await storage.setItem(STORAGE_KEYS.wirds, items);
}

export const wirdRepository: WirdRepository = {
  async list() {
    return readAll();
  },
  async get(id) {
    const items = await readAll();
    return items.find((item) => item.id === id);
  },
  async create(draft) {
    const items = await readAll();
    const now = new Date().toISOString();
    const item: WirdItem = {
      id: `wird-${Date.now()}`,
      title: draft.title.trim(),
      targetCount: draft.targetCount,
      currentCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    await writeAll([item, ...items]);
    return item;
  },
  async update(id, patch) {
    const items = await readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Wird not found');
    const next = {
      ...items[index],
      ...patch,
      title: patch.title?.trim() ?? items[index].title,
      updatedAt: new Date().toISOString(),
    };
    items[index] = next;
    await writeAll(items);
    return next;
  },
  async increment(id) {
    const items = await readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Wird not found');
    items[index] = {
      ...items[index],
      currentCount: items[index].currentCount + 1,
      updatedAt: new Date().toISOString(),
    };
    await writeAll(items);
    return items[index];
  },
  async reset(id) {
    return this.update(id, { currentCount: 0 });
  },
  async remove(id) {
    const items = await readAll();
    await writeAll(items.filter((item) => item.id !== id));
  },
};
