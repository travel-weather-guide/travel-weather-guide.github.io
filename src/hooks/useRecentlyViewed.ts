'use client';

import { useEffect, useState, useCallback } from 'react';

export interface RecentRegion {
  countryId: string;
  regionId: string;
  countryName: { ko: string; en: string; ja?: string; zh?: string };
  regionName: { ko: string; en: string; ja?: string; zh?: string };
  visitedAt: number;
}

const STORAGE_KEY = 'tw-recently-viewed';
const MAX_ITEMS = 5;

function load(): RecentRegion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: RecentRegion[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* quota exceeded, ignore */ }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentRegion[]>([]);

  useEffect(() => {
    setItems(load());
  }, []);

  const record = useCallback((entry: Omit<RecentRegion, 'visitedAt'>) => {
    const current = load().filter((r) => r.regionId !== entry.regionId);
    const updated = [{ ...entry, visitedAt: Date.now() }, ...current].slice(0, MAX_ITEMS);
    save(updated);
    setItems(updated);
  }, []);

  return { items, record };
}
