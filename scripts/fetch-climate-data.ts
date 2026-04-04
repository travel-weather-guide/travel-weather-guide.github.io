/**
 * Open-Meteo Historical API에서 기후 데이터 수집
 * 최근 10년(2015~2024) 일별 데이터를 가져와 월별 평균 계산
 */

import type { MonthlyData } from '../src/types';
import type { RegionDef } from './regions';

const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';
const MARINE_BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const START_DATE = '2020-01-01';
const END_DATE = '2024-12-31';

interface DailyResponse {
  daily: {
    time: string[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_sum: (number | null)[];
    relative_humidity_2m_mean?: (number | null)[];
    sunshine_duration?: (number | null)[];
  };
}

interface MarineResponse {
  daily: {
    time: string[];
    sea_surface_temperature_max?: (number | null)[];
  };
}

export async function fetchClimateData(region: RegionDef): Promise<MonthlyData[]> {
  const params = new URLSearchParams({
    latitude: String(region.latitude),
    longitude: String(region.longitude),
    start_date: START_DATE,
    end_date: END_DATE,
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean,sunshine_duration',
    timezone: 'auto',
  });

  const url = `${BASE_URL}?${params}`;
  console.log(`  Fetching climate data for ${region.name.en}...`);

  let res: Response | undefined;
  for (let attempt = 0; attempt < 5; attempt++) {
    res = await fetch(url);
    if (res.ok) break;
    if (res.status === 429) {
      const wait = (attempt + 1) * 10000;
      console.log(`    Rate limited, waiting ${wait / 1000}s...`);
      await new Promise((r) => setTimeout(r, wait));
    } else {
      throw new Error(`Open-Meteo API error: ${res.status} ${res.statusText}`);
    }
  }
  if (!res || !res.ok) {
    throw new Error(`Open-Meteo API failed after retries`);
  }

  const data: DailyResponse = await res.json();

  // API 호출 간 딜레이 (rate limit 방지)
  await new Promise((r) => setTimeout(r, 500));

  // 해안 지역이면 해수온 데이터도 수집
  const seaTempData = region.isCoastal ? await fetchSeaTemp(region.latitude, region.longitude) : null;

  return aggregateMonthly(data, seaTempData);
}

async function fetchSeaTemp(lat: number, lon: number): Promise<Record<number, number>> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    start_date: START_DATE,
    end_date: END_DATE,
    daily: 'sea_surface_temperature_max',
    timezone: 'auto',
  });

  const url = `${MARINE_BASE_URL}?${params}`;
  console.log(`  Fetching sea temperature data...`);

  let res: Response | undefined;
  for (let attempt = 0; attempt < 5; attempt++) {
    res = await fetch(url);
    if (res.ok) break;
    if (res.status === 429) {
      const wait = (attempt + 1) * 10000;
      console.log(`    Rate limited (marine), waiting ${wait / 1000}s...`);
      await new Promise((r) => setTimeout(r, wait));
    } else {
      console.warn(`    Marine API error: ${res.status} ${res.statusText}, skipping sea temp`);
      return {};
    }
  }
  if (!res || !res.ok) {
    console.warn(`    Marine API failed after retries, skipping sea temp`);
    return {};
  }

  const data: MarineResponse = await res.json();
  const seaTemps = data.daily.sea_surface_temperature_max;
  if (!seaTemps) return {};

  const monthlySeaTemp: Record<number, number[]> = {};
  for (let m = 1; m <= 12; m++) monthlySeaTemp[m] = [];

  data.daily.time.forEach((date: string, i: number) => {
    const month = parseInt(date.substring(5, 7));
    const temp = seaTemps[i];
    if (temp != null) monthlySeaTemp[month].push(temp);
  });

  const result: Record<number, number> = {};
  for (let m = 1; m <= 12; m++) {
    const arr = monthlySeaTemp[m];
    result[m] = arr.length > 0 ? Math.round(avg(arr) * 10) / 10 : 0;
  }
  return result;
}

function aggregateMonthly(data: DailyResponse, seaTempData: Record<number, number> | null): MonthlyData[] {
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, relative_humidity_2m_mean, sunshine_duration } = data.daily;

  // 월별 누적 데이터
  const months: Record<number, {
    tempHighs: number[];
    tempLows: number[];
    rainfall: number[];
    rainyDays: number[];
    humidity: number[];
    sunshine: number[];
  }> = {};

  for (let m = 1; m <= 12; m++) {
    months[m] = { tempHighs: [], tempLows: [], rainfall: [], rainyDays: [], humidity: [], sunshine: [] };
  }

  // 연도별 월별 강수일수 추적
  const yearMonthRainyDays: Record<string, number> = {};

  for (let i = 0; i < time.length; i++) {
    const month = parseInt(time[i].substring(5, 7));
    const yearMonth = time[i].substring(0, 7);
    const m = months[month];

    if (temperature_2m_max[i] != null) m.tempHighs.push(temperature_2m_max[i]!);
    if (temperature_2m_min[i] != null) m.tempLows.push(temperature_2m_min[i]!);

    const rain = precipitation_sum[i] ?? 0;
    m.rainfall.push(rain);
    if (rain >= 1.0) {
      yearMonthRainyDays[yearMonth] = (yearMonthRainyDays[yearMonth] ?? 0) + 1;
    }

    if (relative_humidity_2m_mean?.[i] != null) m.humidity.push(relative_humidity_2m_mean[i]!);
    if (sunshine_duration?.[i] != null) m.sunshine.push(sunshine_duration[i]! / 3600); // 초 → 시간
  }

  // 월별 강수일수 평균 계산
  for (let m = 1; m <= 12; m++) {
    const key = String(m).padStart(2, '0');
    const matching = Object.entries(yearMonthRainyDays)
      .filter(([ym]) => ym.endsWith(`-${key}`))
      .map(([, v]) => v);
    months[m].rainyDays = matching;
  }

  return Array.from({ length: 12 }, (_, i) => {
    const m = months[i + 1];
    const totalRainByMonth = groupByYearMonth(m.rainfall, i + 1);

    return {
      month: i + 1,
      tempHigh: round(avg(m.tempHighs)),
      tempLow: round(avg(m.tempLows)),
      rainfall: round(avg(totalRainByMonth)),
      rainyDays: round(avg(m.rainyDays)),
      humidity: round(avg(m.humidity)),
      sunshineHours: round(avg(m.sunshine)),
      seaTemp: seaTempData ? seaTempData[i + 1] : undefined,
      weatherSummary: '',
    };
  });
}

/** 일별 강수량을 연도별 월합계로 그룹핑 후 배열로 반환 */
function groupByYearMonth(dailyValues: number[], _month: number): number[] {
  // dailyValues는 해당 월의 모든 연도 일별 데이터가 순서대로 들어있음
  // 대략 5년 x 28~31일
  // 한 달 단위로 합산
  const chunkSize = Math.floor(dailyValues.length / 5);
  if (chunkSize === 0) return [0];

  const sums: number[] = [];
  for (let i = 0; i < dailyValues.length; i += chunkSize) {
    const chunk = dailyValues.slice(i, i + chunkSize);
    sums.push(chunk.reduce((a, b) => a + b, 0));
  }
  return sums;
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
