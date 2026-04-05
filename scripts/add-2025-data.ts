/**
 * 2025년 일별 날씨 데이터를 Open-Meteo에서 가져와
 * src/data/daily/[regionId]/all.json 에 병합한다.
 *
 * Usage:
 *   npx tsx scripts/add-2025-data.ts
 *   npx tsx scripts/add-2025-data.ts --only tokyo,osaka
 */

import * as fs from 'fs';
import * as path from 'path';
import { countries } from './regions';
import type { RegionDef } from './regions';

const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';
const START_DATE = '2025-01-01';
const END_DATE = '2025-12-31';
const DELAY_MS = 500;

interface DailyResponse {
  daily: {
    time: string[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_sum: (number | null)[];
    relative_humidity_2m_mean: (number | null)[];
  };
}

interface DailyCalendarEntry {
  day: number;
  tempHigh: number;
  tempLow: number;
  rainfall: number;
  humidity: number;
}

type DailyCalendarData = Record<string, { years: Record<string, DailyCalendarEntry[]> }>;

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

async function fetch2025Data(region: RegionDef): Promise<DailyResponse> {
  const params = new URLSearchParams({
    latitude: String(region.latitude),
    longitude: String(region.longitude),
    start_date: START_DATE,
    end_date: END_DATE,
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean',
    timezone: 'auto',
  });

  const url = `${BASE_URL}?${params}`;

  let res: Response | undefined;
  for (let attempt = 0; attempt < 8; attempt++) {
    res = await fetch(url);
    if (res.ok) break;
    if (res.status === 429) {
      const wait = Math.min(120_000, 15_000 * Math.pow(2, Math.min(attempt, 3)));
      console.log(`    Rate limited, waiting ${Math.round(wait / 1000)}s... (attempt ${attempt + 1}/8)`);
      await new Promise((r) => setTimeout(r, wait));
    } else {
      throw new Error(`Open-Meteo API error: ${res.status} ${res.statusText}`);
    }
  }
  if (!res || !res.ok) {
    throw new Error(`Open-Meteo API failed after retries for ${region.id}`);
  }

  return res.json() as Promise<DailyResponse>;
}

function extract2025Entries(data: DailyResponse): Record<number, DailyCalendarEntry[]> {
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, relative_humidity_2m_mean } = data.daily;

  const byMonth: Record<number, DailyCalendarEntry[]> = {};
  for (let m = 1; m <= 12; m++) byMonth[m] = [];

  for (let i = 0; i < time.length; i++) {
    const date = time[i];
    const year = parseInt(date.substring(0, 4));
    if (year !== 2025) continue;

    const month = parseInt(date.substring(5, 7));
    const day = parseInt(date.substring(8, 10));

    byMonth[month].push({
      day,
      tempHigh: round(temperature_2m_max[i] ?? 0),
      tempLow: round(temperature_2m_min[i] ?? 0),
      rainfall: round(precipitation_sum[i] ?? 0),
      humidity: round(relative_humidity_2m_mean[i] ?? 0),
    });
  }

  return byMonth;
}

function getDailyFilePath(regionId: string): string {
  return path.join('/Users/hh/Desktop/dev/travel-weather/src/data/daily', regionId, 'all.json');
}

async function processRegion(region: RegionDef): Promise<void> {
  console.log(`[${region.id}] Fetching 2025 data for ${region.name.en}...`);

  const filePath = getDailyFilePath(region.id);
  if (!fs.existsSync(filePath)) {
    console.log(`  Skipping — file not found: ${filePath}`);
    return;
  }

  let existing: DailyCalendarData;
  try {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as DailyCalendarData;
  } catch (e) {
    console.error(`  Failed to parse ${filePath}:`, e);
    return;
  }

  let apiData: DailyResponse;
  try {
    apiData = await fetch2025Data(region);
  } catch (e) {
    console.error(`  API fetch failed:`, e);
    return;
  }

  const byMonth = extract2025Entries(apiData);

  for (let m = 1; m <= 12; m++) {
    const key = String(m);
    if (!existing[key]) {
      existing[key] = { years: {} };
    }
    if (!existing[key].years) {
      existing[key].years = {};
    }
    const entries = byMonth[m];
    if (entries && entries.length > 0) {
      existing[key].years['2025'] = entries;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(existing));
  console.log(`  Done — merged 2025 data into ${filePath}`);
}

async function main(): Promise<void> {
  // Parse --only flag
  const onlyArg = process.argv.find((a) => a.startsWith('--only='))?.replace('--only=', '')
    ?? (() => {
      const idx = process.argv.indexOf('--only');
      return idx !== -1 ? process.argv[idx + 1] : undefined;
    })();

  const onlySet = onlyArg ? new Set(onlyArg.split(',').map((s) => s.trim())) : null;

  const allRegions: RegionDef[] = countries.flatMap((c) => c.regions);
  const regions = onlySet ? allRegions.filter((r) => onlySet.has(r.id)) : allRegions;

  if (onlySet) {
    console.log(`Running for regions: ${[...onlySet].join(', ')}`);
  } else {
    console.log(`Running for all ${regions.length} regions`);
  }

  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    console.log(`\n[${i + 1}/${regions.length}] ${region.id}`);
    await processRegion(region);
    if (i < regions.length - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log('\nAll done.');
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
