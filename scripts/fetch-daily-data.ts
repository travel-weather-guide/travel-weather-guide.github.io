/**
 * 최근 3년(2022~2024) 일별 날씨 데이터를 지역별로 한 번에 수집 후 월별로 분할 저장
 * API 호출: 지역 수(14) x 1회 = 14회
 * 출력: src/data/daily/[month].json
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { countries } from './regions';

const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';
const DAILY_DIR = join(__dirname, '..', 'src', 'data', 'daily');

interface DailyEntry {
  day: number;
  tempHigh: number;
  tempLow: number;
  rainfall: number;
  humidity: number;
}

interface RegionDailyData {
  regionId: string;
  regionName: { ko: string; en: string };
  countryId: string;
  countryName: { ko: string; en: string };
  years: Record<number, DailyEntry[]>;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

async function fetchAllDaily(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    start_date: '2022-01-01',
    end_date: '2024-12-31',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean',
    timezone: 'auto',
  });

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`${BASE_URL}?${params}`);
    if (res.ok) return res.json();
    if (res.status === 429) {
      const wait = (attempt + 1) * 10000;
      console.log(`    Rate limited, waiting ${wait / 1000}s...`);
      await delay(wait);
    } else {
      throw new Error(`API error: ${res.status}`);
    }
  }
  throw new Error('Failed after retries');
}

async function main() {
  console.log('=== 일별 날씨 데이터 수집 시작 ===\n');
  mkdirSync(DAILY_DIR, { recursive: true });

  // month -> regionId -> RegionDailyData
  const monthlyData: Record<number, RegionDailyData[]> = {};
  for (let m = 1; m <= 12; m++) monthlyData[m] = [];

  for (const country of countries) {
    for (const region of country.regions) {
      console.log(`[${region.name.ko}] 전체 일별 데이터 수집...`);

      const data = await fetchAllDaily(region.latitude, region.longitude);
      const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, relative_humidity_2m_mean } = data.daily;

      // 월별로 분할
      const byYearMonth: Record<string, DailyEntry[]> = {};

      for (let i = 0; i < time.length; i++) {
        const date = time[i] as string;
        const year = parseInt(date.substring(0, 4));
        const month = parseInt(date.substring(5, 7));
        const day = parseInt(date.substring(8, 10));
        const key = `${year}-${month}`;

        if (!byYearMonth[key]) byYearMonth[key] = [];
        byYearMonth[key].push({
          day,
          tempHigh: round(temperature_2m_max[i] ?? 0),
          tempLow: round(temperature_2m_min[i] ?? 0),
          rainfall: round(precipitation_sum[i] ?? 0),
          humidity: round(relative_humidity_2m_mean?.[i] ?? 0),
        });
      }

      // 월별 파일에 추가
      for (let m = 1; m <= 12; m++) {
        const regionEntry: RegionDailyData = {
          regionId: region.id,
          regionName: region.name,
          countryId: country.id,
          countryName: country.name,
          years: {},
        };

        for (const year of [2022, 2023, 2024]) {
          const key = `${year}-${m}`;
          regionEntry.years[year] = byYearMonth[key] ?? [];
        }

        monthlyData[m].push(regionEntry);
      }

      await delay(3000);
    }
  }

  // 월별 파일 저장
  for (let m = 1; m <= 12; m++) {
    const path = join(DAILY_DIR, `${m}.json`);
    writeFileSync(path, JSON.stringify({ month: m, regions: monthlyData[m] }), 'utf-8');
    console.log(`✓ ${m}월 (${monthlyData[m].length}개 지역)`);
  }

  console.log('\n=== 완료 ===');
}

main().catch(console.error);
