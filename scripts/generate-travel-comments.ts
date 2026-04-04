/**
 * Travel Weather 추천점수 시스템
 *
 * Rating은 순수 날씨 데이터 기반 평가. 문화적 시즌 보정 없음.
 * events/highlights는 정보 제공 목적으로만 사용되며 rating에 영향을 주지 않음.
 *
 * ## 카테고리 (7종)
 * - beach: 해변/리조트/수상 — 기온 25~32°C 최적, 해수온·일조 중시
 * - city: 도시 관광/쇼핑 — 기온 15~26°C 최적, 쾌적 기온·습도 중시
 * - culture: 문화/역사 체험 — 기온 12~28°C (넓은 허용), 비·기온 moderate
 * - mountain: 산악/트레킹/고원 — 기온 8~22°C 최적, 비↓↓(최우선)·일조↑
 * - ski: 겨울 스포츠 — 기온 -10~2°C (추울수록↑), 저온·비↓·일조↑
 * - adventure: 야외 액티비티 — 기온 18~30°C 최적, 비↓·일조↑·쾌적
 * - nature: 자연 탐험(오로라/사막/사파리) — 광범위
 *
 * ## 점수 구성 (100점 만점)
 *            temp  rain  rainDays  sunshine  humidity  penalty
 * beach:      20    20      10       15        10       25
 * city:       25    20      10       10        15       20
 * culture:    20    20      10       10        15       25
 * mountain:   15    25      15       20        10       15
 * ski:        25    20      10       20        10       15
 * adventure:  20    25      10       20        10       15
 * nature:     15    20      15       15        10       25
 *
 * 각 지표는 구간별 선형(piecewise linear) 연속 함수로 계산.
 * penalty는 만점에서 시작해 극한 조건(고온/저온/고습+고온/폭우)이 있으면 차감.
 *
 * ## Rating 변환
 * ≥80=5, ≥60=4, ≥45=3, ≥30=2, <30=1
 */

import type { TravelComment, MonthlyData } from '../src/types';
import { seasonOverrides, type SeasonOverride } from './regions';

interface CategoryWeights {
  temp: number;
  rain: number;
  rainDays: number;
  sunshine: number;
  humidity: number;
  penalty: number;
}

function getCategoryWeights(category: string): CategoryWeights {
  const table: Record<string, CategoryWeights> = {
    beach:     { temp: 20, rain: 20, rainDays: 10, sunshine: 15, humidity: 10, penalty: 25 },
    city:      { temp: 25, rain: 20, rainDays: 10, sunshine: 10, humidity: 15, penalty: 20 },
    culture:   { temp: 20, rain: 20, rainDays: 10, sunshine: 10, humidity: 15, penalty: 25 },
    mountain:  { temp: 15, rain: 25, rainDays: 15, sunshine: 20, humidity: 10, penalty: 15 },
    ski:       { temp: 25, rain: 20, rainDays: 10, sunshine: 20, humidity: 10, penalty: 15 },
    adventure: { temp: 20, rain: 25, rainDays: 10, sunshine: 20, humidity: 10, penalty: 15 },
    nature:    { temp: 15, rain: 20, rainDays: 15, sunshine: 15, humidity: 10, penalty: 25 },
  };
  return table[category] ?? table.city;
}

// --- 개별 지표 점수 함수 (구간별 선형 연속) ---

function tempScore(avgTemp: number, category: string, maxPoints: number): number {
  const ranges: Record<string, [number, number, number, number]> = {
    beach:     [25, 32, 15, 40],
    city:      [15, 26, 3, 35],
    culture:   [12, 28, 0, 35],
    mountain:  [8, 22, -5, 30],
    ski:       [-10, 2, -20, 8],
    adventure: [18, 30, 5, 38],
    nature:    [5, 30, -15, 40],
  };

  const [optLow, optHigh, absLow, absHigh] = ranges[category] ?? ranges.city;

  if (avgTemp >= optLow && avgTemp <= optHigh) return maxPoints;
  if (avgTemp < absLow || avgTemp > absHigh) return 0;

  if (avgTemp < optLow) {
    return maxPoints * (avgTemp - absLow) / (optLow - absLow);
  }
  return maxPoints * (absHigh - avgTemp) / (absHigh - optHigh);
}

function rainScore(rainfall: number, maxPoints: number): number {
  if (rainfall <= 30) return maxPoints;
  if (rainfall >= 300) return 0;
  return maxPoints * (300 - rainfall) / 270;
}

function rainDaysScore(rainyDays: number, maxPoints: number): number {
  if (rainyDays <= 3) return maxPoints;
  if (rainyDays >= 20) return 0;
  return maxPoints * (20 - rainyDays) / 17;
}

function sunScore(hours: number, maxPoints: number): number {
  if (hours >= 10) return maxPoints;
  if (hours <= 2) return 0;
  return maxPoints * (hours - 2) / 8;
}

function humidityScore(humidity: number, maxPoints: number): number {
  if (humidity <= 50) return maxPoints;
  if (humidity >= 90) return 0;
  return maxPoints * (90 - humidity) / 40;
}

function penaltyScore(d: MonthlyData, category: string, maxPoints: number): number {
  let penalty = 0;
  const avgTemp = (d.tempHigh + d.tempLow) / 2;

  // 극한 고온 — 스키 제외 모든 카테고리
  if (category !== 'ski') {
    if (d.tempHigh > 42) penalty += maxPoints * 0.8;
    else if (d.tempHigh > 38) penalty += maxPoints * 0.5;
    else if (d.tempHigh > 35) penalty += maxPoints * 0.2;
  }

  // 극한 저온 — 스키/nature 제외
  if (category !== 'ski' && category !== 'nature') {
    if (avgTemp < -15) penalty += maxPoints * 0.6;
    else if (avgTemp < -5) penalty += maxPoints * 0.3;
  }

  // 습도 + 고온 콤보 (체감온도 상승)
  if (d.humidity > 80 && avgTemp > 30) {
    penalty += maxPoints * 0.4; // 극한 (방콕 우기, 싱가포르 등)
  } else if (d.humidity >= 75 && avgTemp >= 25) {
    penalty += maxPoints * 0.25; // 무더운 여름 (도쿄 7~8월 등)
  }

  // 극한 강수 (홍수/태풍급)
  if (d.rainfall > 400) penalty += maxPoints * 0.3;

  return Math.max(0, maxPoints - penalty);
}

// --- 총점 계산 ---

function calculateScore(d: MonthlyData, category: string): number {
  const weights = getCategoryWeights(category);
  const avgTemp = (d.tempHigh + d.tempLow) / 2;

  const score =
    tempScore(avgTemp, category, weights.temp) +
    rainScore(d.rainfall, weights.rain) +
    rainDaysScore(d.rainyDays, weights.rainDays) +
    sunScore(d.sunshineHours, weights.sunshine) +
    humidityScore(d.humidity, weights.humidity) +
    penaltyScore(d, category, weights.penalty);

  return Math.round(score * 10) / 10;
}

function scoreToRating(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 45) return 3;
  if (score >= 30) return 2;
  return 1;
}

export function generateTravelComments(
  regionId: string,
  monthlyData: MonthlyData[],
  category: string,
  peakTourismMonths: number[]
): TravelComment[] {
  return monthlyData.map((data) => {
    const score = calculateScore(data, category);
    const rating = scoreToRating(score);

    return {
      regionId,
      month: data.month,
      rating,
      summary: generateSummary(data, rating),
      highlights: generateHighlights(data, rating, regionId, data.month, seasonOverrides),
      cautions: generateCautions(data),
      events: generateEvents(regionId, data.month, seasonOverrides),
      tips: generateTips(data),
      clothingAdvice: generateClothingAdvice(data),
      crowdLevel: getCrowdLevel(data.month, rating, peakTourismMonths),
      priceLevel: getPriceLevel(data.month, rating, peakTourismMonths),
    };
  });
}

function generateSummary(d: MonthlyData, rating: 1 | 2 | 3 | 4 | 5): string {
  const avgTemp = (d.tempHigh + d.tempLow) / 2;

  if (rating >= 4) {
    if (d.rainfall < 50) return '맑고 건조한 날씨, 여행 최적기';
    if (avgTemp >= 20 && avgTemp <= 28) return '쾌적한 기온, 여행하기 좋은 시기';
    return '날씨가 좋아 여행하기 적합한 시기';
  }
  if (rating === 3) {
    if (d.rainfall > 150) return '비가 잦지만 여행 가능한 시기';
    if (avgTemp > 30) return '더운 날씨, 실내 활동 병행 권장';
    if (avgTemp < 10) return '쌀쌀한 날씨, 방한 준비 필요';
    return '보통의 날씨, 여행 가능';
  }
  if (rating === 2) {
    if (d.rainfall > 200) return '우기로 비가 많은 시기';
    if (avgTemp > 35) return '극심한 더위, 여행 비추천';
    if (avgTemp < 5) return '매우 추운 시기, 방한 필수';
    return '날씨가 좋지 않아 비추천';
  }
  // rating 1
  if (d.rainfall > 300) return '폭우 시즌, 여행 피하는 것이 좋음';
  if (avgTemp > 38) return '극한의 더위, 여행 자제 권장';
  if (avgTemp < -5) return '혹한기, 여행 자제 권장';
  return '여행에 부적합한 시기';
}

function generateHighlights(
  d: MonthlyData,
  rating: 1 | 2 | 3 | 4 | 5,
  regionId: string,
  month: number,
  seasonOverrides: SeasonOverride[]
): string[] {
  const highlights: string[] = [];

  // 문화적 시즌 이벤트
  const override = seasonOverrides.find(
    (s) => s.regionId === regionId && s.months.includes(month)
  );
  if (override) {
    highlights.push(override.highlight);
  }

  // 날씨 기반 (rating 무관)
  const avgTemp = (d.tempHigh + d.tempLow) / 2;
  if (d.sunshineHours > 8) highlights.push('일조시간이 길어 야외 활동에 좋음');
  if (d.rainfall < 50) highlights.push('강수량이 적어 맑은 날이 많음');
  if (avgTemp >= 18 && avgTemp <= 28) highlights.push('쾌적한 기온');
  if (d.humidity < 60) highlights.push('습도가 낮아 쾌적함');
  if (avgTemp >= 28) highlights.push('따뜻한 날씨로 해변 활동에 적합');
  if (avgTemp < 5) highlights.push('겨울 스포츠에 적합한 시기');

  // 비수기 장점
  if (rating <= 2) {
    highlights.push('비수기로 관광객이 적어 여유로움');
    highlights.push('비수기 할인을 활용할 수 있는 시기');
  }

  // 최소 1개 보장
  if (highlights.length === 0) highlights.push('현지 일상을 경험하기 좋은 시기');

  return highlights;
}

function generateCautions(d: MonthlyData): string[] {
  const cautions: string[] = [];

  if (d.tempHigh > 33) cautions.push(`평균 최고기온 ${d.tempHigh.toFixed(0)}°C로 더위에 주의`);
  if (d.tempLow < 0) cautions.push(`평균 최저기온 ${d.tempLow.toFixed(0)}°C로 방한 대비 필요`);
  if (d.rainfall > 150) cautions.push(`월 강수량 ${d.rainfall.toFixed(0)}mm로 우기에 해당`);
  else if (d.rainfall > 100) cautions.push(`강수량이 ${d.rainfall.toFixed(0)}mm로 우산 필수`);
  if (d.rainyDays > 15) cautions.push(`월 ${d.rainyDays}일 비가 와 야외 일정에 유의`);
  else if (d.rainyDays > 10) cautions.push(`비 오는 날이 ${d.rainyDays}일로 실내 대안 준비 권장`);
  if (d.humidity > 80) cautions.push(`습도 ${d.humidity.toFixed(0)}%로 불쾌지수 높음`);
  else if (d.humidity > 70) cautions.push(`습도가 ${d.humidity.toFixed(0)}%로 다소 높음`);
  if (d.sunshineHours < 4) cautions.push('일조시간이 짧아 흐린 날이 많음');

  return cautions;
}

function generateEvents(
  regionId: string,
  month: number,
  seasonOverrides: SeasonOverride[]
): string[] {
  const override = seasonOverrides.find(
    (s) => s.regionId === regionId && s.months.includes(month)
  );
  return override?.events ?? [];
}

function generateTips(d: MonthlyData): string[] {
  const tips: string[] = [];
  const avgTemp = (d.tempHigh + d.tempLow) / 2;

  if (d.rainfall > 100) tips.push('접이식 우산이나 우비 챙기기');
  if (avgTemp > 30) tips.push('냉방이 잘 되는 숙소 선택 권장');
  if (avgTemp < 5) tips.push('보온 용품과 핫팩 준비');
  if (d.sunshineHours > 8) tips.push('선글라스와 모자 챙기기');

  return tips;
}

function generateClothingAdvice(d: MonthlyData): string {
  const avgTemp = (d.tempHigh + d.tempLow) / 2;

  if (avgTemp >= 30) return '반팔, 반바지, 가벼운 원피스. 통풍 잘 되는 소재 추천';
  if (avgTemp >= 25) return '반팔, 얇은 긴바지. 자외선 차단 필수';
  if (avgTemp >= 20) return '얇은 긴팔, 가디건. 아침저녁 쌀쌀할 수 있음';
  if (avgTemp >= 15) return '긴팔, 가벼운 재킷. 레이어드 추천';
  if (avgTemp >= 10) return '재킷, 니트, 긴바지. 아우터 필수';
  if (avgTemp >= 5) return '코트, 목도리, 장갑. 보온 레이어 필요';
  if (avgTemp >= 0) return '패딩, 두꺼운 코트, 방한용품 필수';
  return '방한복, 패딩, 핫팩. 극한 방한 준비 필수';
}

function getCrowdLevel(month: number, rating: 1 | 2 | 3 | 4 | 5, peakMonths: number[]): 'low' | 'medium' | 'high' {
  if (peakMonths.includes(month) && rating >= 4) return 'high';
  if (peakMonths.includes(month) || rating >= 4) return 'medium';
  return 'low';
}

function getPriceLevel(month: number, rating: 1 | 2 | 3 | 4 | 5, peakMonths: number[]): 'low' | 'medium' | 'high' {
  if (peakMonths.includes(month) && rating >= 4) return 'high';
  if (peakMonths.includes(month)) return 'medium';
  if (rating <= 2) return 'low';
  return 'medium';
}
