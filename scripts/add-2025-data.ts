/**
 * 특정 연도의 일별 날씨 데이터를 Open-Meteo에서 가져와
 * src/data/daily/[regionId]/all.json 에 병합한다.
 *
 * Usage:
 *   npx tsx scripts/add-2025-data.ts --year 2026 --months 1-3
 *   npx tsx scripts/add-2025-data.ts --year 2025
 *   npx tsx scripts/add-2025-data.ts --year 2026 --months 1-3 --only tokyo,osaka
 */

import * as fs from 'fs';
import * as path from 'path';
import { countries } from './regions';
import type { RegionDef } from './regions';

const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';
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

async function fetchYearData(region: RegionDef, startDate: string, endDate: string): Promise<DailyResponse> {
  const params = new URLSearchParams({
    latitude: String(region.latitude),
    longitude: String(region.longitude),
    start_date: startDate,
    end_date: endDate,
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

function extractEntries(data: DailyResponse, year: number, months: number[]): Record<number, DailyCalendarEntry[]> {
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, relative_humidity_2m_mean } = data.daily;

  const monthSet = new Set(months);
  const byMonth: Record<number, DailyCalendarEntry[]> = {};
  for (const m of months) byMonth[m] = [];

  for (let i = 0; i < time.length; i++) {
    const date = time[i];
    const y = parseInt(date.substring(0, 4));
    if (y !== year) continue;

    const month = parseInt(date.substring(5, 7));
    if (!monthSet.has(month)) continue;

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

async function processRegion(region: RegionDef, year: number, months: number[], startDate: string, endDate: string): Promise<void> {
  console.log(`[${region.id}] Fetching ${year} data (months ${months[0]}-${months[months.length - 1]}) for ${region.name.en}...`);

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
    apiData = await fetchYearData(region, startDate, endDate);
  } catch (e) {
    console.error(`  API fetch failed:`, e);
    return;
  }

  const byMonth = extractEntries(apiData, year, months);
  const yearStr = String(year);

  for (const m of months) {
    const key = String(m);
    if (!existing[key]) {
      existing[key] = { years: {} };
    }
    if (!existing[key].years) {
      existing[key].years = {};
    }
    const entries = byMonth[m];
    if (entries && entries.length > 0) {
      existing[key].years[yearStr] = entries;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(existing));
  console.log(`  Done — merged ${year} data into ${filePath}`);
}

function parseArg(name: string): string | undefined {
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`))?.replace(`--${name}=`, '');
  if (eq) return eq;
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

function parseMonths(monthsArg: string | undefined): number[] {
  if (!monthsArg) return Array.from({ length: 12 }, (_, i) => i + 1);

  const months: number[] = [];
  for (const part of monthsArg.split(',')) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let m = start; m <= end; m++) months.push(m);
    } else {
      months.push(Number(part));
    }
  }
  return months.sort((a, b) => a - b);
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

async function main(): Promise<void> {
  const yearArg = parseArg('year');
  if (!yearArg) {
    console.error('Error: --year is required (e.g. --year 2026)');
    process.exit(1);
  }
  const year = Number(yearArg);

  const months = parseMonths(parseArg('months'));
  const onlyArg = parseArg('only');
  const onlySet = onlyArg ? new Set(onlyArg.split(',').map((s) => s.trim())) : null;

  const startDate = `${year}-${String(months[0]).padStart(2, '0')}-01`;
  const lastMonth = months[months.length - 1];
  const endDate = `${year}-${String(lastMonth).padStart(2, '0')}-${lastDayOfMonth(year, lastMonth)}`;

  console.log(`Year: ${year}, Months: ${months[0]}-${lastMonth}, Range: ${startDate} ~ ${endDate}`);

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
    await processRegion(region, year, months, startDate, endDate);
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
