/**
 * Server-only data-fetching utilities.
 * Shared across all route pages to avoid duplication.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Country, TravelComment, MonthlyRecommendation } from '@/types';

const DATA_DIR = join(process.cwd(), 'src/data');

export type DailyDataMap = Record<number, { years: Record<string, Array<{ day: number; tempHigh: number; tempLow: number; rainfall: number; humidity: number }>> }>;

export interface RegionInfo {
  countryId: string;
  countryName: { ko: string; en: string; ja?: string; zh?: string };
  regionName: { ko: string; en: string; ja?: string; zh?: string };
}

export function getCountry(countryId: string): Country | null {
  try {
    const raw = readFileSync(join(DATA_DIR, 'countries', `${countryId}.json`), 'utf-8');
    return JSON.parse(raw) as Country;
  } catch {
    return null;
  }
}

export function getComments(countryId: string): TravelComment[] {
  try {
    const raw = readFileSync(join(DATA_DIR, 'travel-comments', `${countryId}.json`), 'utf-8');
    return JSON.parse(raw) as TravelComment[];
  } catch {
    return [];
  }
}

export function getDailyData(regionId: string): DailyDataMap {
  const path = join(DATA_DIR, 'daily', regionId, 'all.json');
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as DailyDataMap;
  } catch {
    return {};
  }
}

export function getAllCountryIds(): string[] {
  const summaries = JSON.parse(readFileSync(join(DATA_DIR, 'countries.json'), 'utf-8'));
  return summaries.map((c: { id: string }) => c.id);
}

export function getAllRegionParams() {
  const params: { countryId: string; regionId: string }[] = [];
  for (const countryId of getAllCountryIds()) {
    const country = getCountry(countryId);
    if (!country) continue;
    for (const region of country.regions) {
      params.push({ countryId, regionId: region.id });
    }
  }
  return params;
}

export function getAllMonthlyRegionParams() {
  const params: { countryId: string; regionId: string; month: string }[] = [];
  for (const countryId of getAllCountryIds()) {
    const country = getCountry(countryId);
    if (!country) continue;
    for (const region of country.regions) {
      for (let m = 1; m <= 12; m++) {
        params.push({ countryId, regionId: region.id, month: String(m) });
      }
    }
  }
  return params;
}

export function getRecommendation(month: number): MonthlyRecommendation | null {
  try {
    return JSON.parse(readFileSync(join(DATA_DIR, 'monthly-recommendations', `${month}.json`), 'utf-8'));
  } catch {
    return null;
  }
}

export function buildRegionLookup(): Record<string, RegionInfo> {
  const lookup: Record<string, RegionInfo> = {};
  for (const countryId of getAllCountryIds()) {
    try {
      const country = JSON.parse(readFileSync(join(DATA_DIR, 'countries', `${countryId}.json`), 'utf-8')) as Country;
      for (const region of country.regions) {
        lookup[region.id] = {
          countryId: country.id,
          countryName: country.name as RegionInfo['countryName'],
          regionName: region.name as RegionInfo['regionName'],
        };
      }
    } catch { /* skip */ }
  }
  return lookup;
}
