/**
 * 데이터 파이프라인 통합 실행
 * Open-Meteo + REST Countries → src/data/에 JSON 출력
 *
 * Usage:
 *   npx tsx scripts/generate-data.ts                       # 전체 생성
 *   npx tsx scripts/generate-data.ts --only japan,thailand  # 특정 국가만
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { countries, visaInfo, countryImageUrls } from './regions';
import { fetchClimateAndDailyData, setDateRange } from './fetch-climate-data';
import { fetchCountryInfo } from './fetch-country-info';
import { generateTravelComments } from './generate-travel-comments';
import type { Country, MonthlyRecommendation, TravelComment } from '../src/types';

const DATA_DIR = join(__dirname, '..', 'src', 'data');
const COUNTRIES_DIR = join(DATA_DIR, 'countries');
const COMMENTS_DIR = join(DATA_DIR, 'travel-comments');
const RECOMMENDATIONS_DIR = join(DATA_DIR, 'monthly-recommendations');
const DAILY_DIR = join(DATA_DIR, 'daily');

function ensureDirs() {
  for (const dir of [DATA_DIR, COUNTRIES_DIR, COMMENTS_DIR, RECOMMENDATIONS_DIR, DAILY_DIR]) {
    mkdirSync(dir, { recursive: true });
  }
}

function writeJSON(path: string, data: unknown) {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✓ ${path}`);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function generateWeatherSummary(d: { tempHigh: number; tempLow: number; rainfall: number; humidity: number }): string {
  const avgTemp = (d.tempHigh + d.tempLow) / 2;
  if (d.rainfall > 200) return '우기';
  if (d.rainfall > 100 && d.humidity > 70) return '습하고 비 잦음';
  if (avgTemp > 30 && d.rainfall < 50) return '맑고 더움';
  if (avgTemp > 25 && d.rainfall < 100) return '따뜻하고 쾌청';
  if (avgTemp >= 20 && d.rainfall < 80) return '쾌청';
  if (avgTemp >= 15) return '온화';
  if (avgTemp >= 5) return '쌀쌀';
  if (avgTemp >= 0) return '추움';
  return '혹한';
}

// --- --only 파싱 ---

function parseOnlyArg(): Set<string> | null {
  const idx = process.argv.indexOf('--only');
  if (idx === -1 || idx + 1 >= process.argv.length) return null;
  const ids = process.argv[idx + 1].split(',').map((s) => s.trim()).filter(Boolean);
  return new Set(ids);
}

// --- 디스크에서 인덱스/추천 재생성 ---

function rebuildIndexAndRecommendations() {
  console.log('\n[인덱스 + 월별 추천 재생성]');

  const countrySummaries: Array<{
    id: string;
    name: { ko: string; en: string };
    continent: string;
    regionCount: number;
    isoNumeric: string;
    imageUrl?: string;
  }> = [];

  const monthlyScores: Record<
    number,
    Array<{
      regionId: string;
      countryId: string;
      regionName: { ko: string; en: string };
      score: number;
      category: string;
      tempHigh: number;
      tempLow: number;
      rainfall: number;
      sunshineHours: number;
    }>
  > = {};
  for (let m = 1; m <= 12; m++) monthlyScores[m] = [];

  for (const countryDef of countries) {
    const countryPath = join(COUNTRIES_DIR, `${countryDef.id}.json`);
    const commentsPath = join(COMMENTS_DIR, `${countryDef.id}.json`);
    if (!existsSync(countryPath)) continue;

    const country: Country = JSON.parse(readFileSync(countryPath, 'utf-8'));
    const summary: typeof countrySummaries[number] = {
      id: country.id,
      name: country.name,
      continent: country.continent,
      regionCount: country.regions.length,
      isoNumeric: countryDef.isoNumeric,
    };
    if (countryImageUrls[country.id]) {
      summary.imageUrl = countryImageUrls[country.id];
    }
    countrySummaries.push(summary);

    if (existsSync(commentsPath)) {
      const comments: TravelComment[] = JSON.parse(readFileSync(commentsPath, 'utf-8'));
      for (const c of comments) {
        const region = country.regions.find((r) => r.id === c.regionId);
        if (!region) continue;
        const md = region.monthlyData[c.month - 1];
        const regionDef = countryDef.regions.find((r) => r.id === c.regionId);
        monthlyScores[c.month].push({
          regionId: c.regionId,
          countryId: country.id,
          regionName: region.name,
          score: c.rating,
          category: regionDef?.category ?? 'city',
          tempHigh: md.tempHigh,
          tempLow: md.tempLow,
          rainfall: md.rainfall,
          sunshineHours: md.sunshineHours,
        });
      }
    }
  }

  writeJSON(join(DATA_DIR, 'countries.json'), countrySummaries);

  for (let m = 1; m <= 12; m++) {
    const sorted = monthlyScores[m].sort((a, b) => b.score - a.score);
    const recommended = sorted.filter((s) => s.score >= 4);
    const avoided = sorted.filter((s) => s.score <= 2);
    const recommendation: MonthlyRecommendation = {
      month: m,
      bestDestinations: recommended.map((s) => ({
        regionId: s.regionId,
        category: s.category as 'beach' | 'city' | 'mountain' | 'culture' | 'adventure' | 'ski',
        reason: generateRecommendReason(s),
        rating: s.score,
      })),
      hiddenGems: [],
      avoidList: avoided.map((s) => ({
        regionId: s.regionId,
        reason: generateAvoidReason(s),
      })),
    };
    writeJSON(join(RECOMMENDATIONS_DIR, `${m}.json`), recommendation);
  }

  console.log(`  → ${countrySummaries.length}개국 인덱스 + 12개월 추천 재생성 완료`);
}

// --- main ---

function parseStringArg(name: string): string | undefined {
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`))?.replace(`--${name}=`, '');
  if (eq) return eq;
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

async function main() {
  const sd = parseStringArg('start-date');
  const ed = parseStringArg('end-date');
  if (sd && ed) {
    setDateRange(sd, ed);
    console.log(`날짜 범위 변경: ${sd} ~ ${ed}\n`);
  }

  const onlySet = parseOnlyArg();
  const targetCountries = onlySet ? countries.filter((c) => onlySet.has(c.id)) : countries;

  if (onlySet) {
    const found = targetCountries.map((c) => c.id);
    const notFound = [...onlySet].filter((id) => !found.includes(id));
    if (notFound.length) console.warn(`⚠ 알 수 없는 국가 ID: ${notFound.join(', ')}`);
    console.log(`=== 선택 생성: ${found.join(', ')} (${found.length}개국) ===\n`);
  } else {
    console.log('=== Travel Weather 데이터 전체 생성 시작 ===\n');
  }

  ensureDirs();

  for (const countryDef of targetCountries) {
    console.log(`\n[${countryDef.name.ko}] 처리 중...`);

    // 국가 기본정보
    const info = await fetchCountryInfo(countryDef.countryCode);
    await delay(300);

    const regions = [];
    const allComments = [];

    for (const regionDef of countryDef.regions) {
      // 1) 기후 + Daily 데이터 (단일 API 호출)
      const { monthly: monthlyData, daily: dailyData } = await fetchClimateAndDailyData(regionDef);
      await delay(3000);

      for (const d of monthlyData) {
        d.weatherSummary = generateWeatherSummary(d);
      }

      regions.push({
        id: regionDef.id,
        name: regionDef.name,
        countryId: countryDef.id,
        latitude: regionDef.latitude,
        longitude: regionDef.longitude,
        climateType: regionDef.climateType,
        monthlyData,
      });

      // 2) 여행 코멘트
      const comments = generateTravelComments(
        regionDef.id,
        monthlyData,
        regionDef.category ?? 'city',
        regionDef.peakTourismMonths ?? [],
      );
      allComments.push(...comments);

      // 3) Daily 데이터 저장
      const regionDailyDir = join(DAILY_DIR, regionDef.id);
      mkdirSync(regionDailyDir, { recursive: true });
      writeFileSync(join(regionDailyDir, 'all.json'), JSON.stringify(dailyData));
      console.log(`  ✓ daily/${regionDef.id}/all.json`);
    }

    // 국가 JSON 저장
    const country: Country & { imageUrl?: string } = {
      id: countryDef.id,
      name: countryDef.name,
      continent: countryDef.continent,
      capital: info.capital,
      currency: info.currency,
      language: info.language,
      timezone: info.timezone,
      visaInfo: visaInfo[countryDef.id] || '',
      regions,
    };
    if (countryImageUrls[countryDef.id]) {
      country.imageUrl = countryImageUrls[countryDef.id];
    }

    writeJSON(join(COUNTRIES_DIR, `${countryDef.id}.json`), country);
    writeJSON(join(COMMENTS_DIR, `${countryDef.id}.json`), allComments);
  }

  // 인덱스 + 추천: 항상 전체 디스크 기준으로 재생성
  rebuildIndexAndRecommendations();

  const total = targetCountries.reduce((a, c) => a + c.regions.length, 0);
  console.log(`\n=== 완료: ${targetCountries.length}개국, ${total}개 지역 ===`);
}

function generateRecommendReason(s: {
  regionName: { ko: string };
  tempHigh: number;
  tempLow: number;
  rainfall: number;
  sunshineHours: number;
}): string {
  const parts: string[] = [];
  const avgTemp = (s.tempHigh + s.tempLow) / 2;

  if (avgTemp >= 20 && avgTemp <= 28) parts.push(`평균 ${Math.round(avgTemp)}°C의 쾌적한 기온`);
  else if (avgTemp >= 15) parts.push(`평균 ${Math.round(avgTemp)}°C의 온화한 날씨`);
  else parts.push(`평균 ${Math.round(avgTemp)}°C`);

  if (s.rainfall < 50) parts.push('비가 거의 없는 맑은 날씨');
  else if (s.rainfall < 100) parts.push('강수량 적음');

  if (s.sunshineHours > 8) parts.push('풍부한 일조량');

  return parts.join(', ');
}

function generateAvoidReason(s: {
  regionName: { ko: string };
  tempHigh: number;
  tempLow: number;
  rainfall: number;
  sunshineHours: number;
}): string {
  const parts: string[] = [];
  const avgTemp = (s.tempHigh + s.tempLow) / 2;

  if (s.rainfall > 200) parts.push(`강수량 ${Math.round(s.rainfall)}mm의 우기`);
  else if (s.rainfall > 100) parts.push(`잦은 비(${Math.round(s.rainfall)}mm)`);

  if (avgTemp > 35) parts.push('극심한 더위');
  else if (avgTemp < 5) parts.push(`평균 ${Math.round(avgTemp)}°C의 혹한`);
  else if (avgTemp < 10) parts.push(`평균 ${Math.round(avgTemp)}°C의 추위`);

  if (s.sunshineHours < 4) parts.push('일조량 부족');

  if (parts.length === 0) parts.push('여행에 적합하지 않은 날씨');

  return parts.join(', ');
}

main().catch(console.error);
