/**
 * 데이터 파이프라인 통합 실행
 * Open-Meteo + REST Countries → src/data/에 JSON 출력
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { countries, visaInfo } from './regions';
import { fetchClimateData } from './fetch-climate-data';
import { fetchCountryInfo } from './fetch-country-info';
import { generateTravelComments } from './generate-travel-comments';
import type { Country, MonthlyRecommendation } from '../src/types';

const DATA_DIR = join(__dirname, '..', 'src', 'data');
const COUNTRIES_DIR = join(DATA_DIR, 'countries');
const COMMENTS_DIR = join(DATA_DIR, 'travel-comments');
const RECOMMENDATIONS_DIR = join(DATA_DIR, 'monthly-recommendations');

function ensureDirs() {
  for (const dir of [DATA_DIR, COUNTRIES_DIR, COMMENTS_DIR, RECOMMENDATIONS_DIR]) {
    mkdirSync(dir, { recursive: true });
  }
}

function writeJSON(path: string, data: unknown) {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✓ ${path}`);
}

/** API 요청 간 딜레이 (rate limit 방지) */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function main() {
  console.log('=== Travel Weather 데이터 생성 시작 ===\n');
  ensureDirs();

  const countrySummaries: Array<{
    id: string;
    name: { ko: string; en: string };
    continent: string;
    regionCount: number;
  }> = [];

  // 월별 추천 집계용
  const monthlyScores: Record<number, Array<{ regionId: string; countryId: string; regionName: { ko: string; en: string }; score: number; category: string; tempHigh: number; tempLow: number; rainfall: number; sunshineHours: number }>> = {};
  for (let m = 1; m <= 12; m++) monthlyScores[m] = [];

  for (const countryDef of countries) {
    console.log(`\n[${countryDef.name.ko}] 처리 중...`);

    // 국가 기본정보
    const info = await fetchCountryInfo(countryDef.countryCode);
    await delay(300);

    // 지역별 기후 데이터
    const regions = [];
    const allComments = [];

    for (const regionDef of countryDef.regions) {
      const monthlyData = await fetchClimateData(regionDef);
      await delay(3000); // Open-Meteo rate limit 대비

      // weatherSummary 채우기
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

      // 여행 코멘트 생성
      const comments = generateTravelComments(
        regionDef.id,
        monthlyData,
        regionDef.category ?? 'city',
        regionDef.peakTourismMonths ?? []
      );
      allComments.push(...comments);

      // 월별 추천 집계
      for (const c of comments) {
        const md = monthlyData[c.month - 1];
        monthlyScores[c.month].push({
          regionId: regionDef.id,
          countryId: countryDef.id,
          regionName: regionDef.name,
          score: c.rating,
          category: regionDef.category,
          tempHigh: md.tempHigh,
          tempLow: md.tempLow,
          rainfall: md.rainfall,
          sunshineHours: md.sunshineHours,
        });
      }
    }

    // 국가 JSON 저장
    const country: Country = {
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

    writeJSON(join(COUNTRIES_DIR, `${countryDef.id}.json`), country);
    writeJSON(join(COMMENTS_DIR, `${countryDef.id}.json`), allComments);

    countrySummaries.push({
      id: countryDef.id,
      name: countryDef.name,
      continent: countryDef.continent,
      regionCount: regions.length,
    });
  }

  // 전체 국가 목록
  writeJSON(join(DATA_DIR, 'countries.json'), countrySummaries);

  // 월별 추천
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

  console.log(`\n=== 완료: ${countrySummaries.length}개국, ${countrySummaries.reduce((a, c) => a + c.regionCount, 0)}개 지역 ===`);
}

function generateRecommendReason(s: { regionName: { ko: string }; tempHigh: number; tempLow: number; rainfall: number; sunshineHours: number }): string {
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

function generateAvoidReason(s: { regionName: { ko: string }; tempHigh: number; tempLow: number; rainfall: number; sunshineHours: number }): string {
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
