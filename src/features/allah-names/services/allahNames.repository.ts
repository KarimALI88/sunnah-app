import { allahNames } from '@/features/allah-names/data/allahNames.mock';
import type { AllahName } from '@/features/allah-names/types';

export interface AllahNamesRepository {
  list(): Promise<AllahName[]>;
  get(id: string): Promise<AllahName | undefined>;
  search(query: string): Promise<AllahName[]>;
}

export const allahNamesRepository: AllahNamesRepository = {
  async list() {
    return allahNames;
  },
  async get(id) {
    return allahNames.find((item) => item.id === id);
  },
  async search(query) {
    const q = query.trim();
    if (!q) return allahNames;
    return allahNames.filter(
      (item) => item.arabic.includes(q) || item.meaning.includes(q) || String(item.number).includes(q),
    );
  },
};
