/**
 * 기후 데이터 기반으로 여행 코멘트를 규칙 기반 자동 생성
 */

import type { TravelComment, MonthlyData } from '../src/types';

export function generateTravelComments(
  regionId: string,
  monthlyData: MonthlyData[]
): TravelComment[] {
  // 연간 최적 월 판단용 점수 계산
  const scores = monthlyData.map((d) => calculateScore(d));
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const range = maxScore - minScore || 1;

  return monthlyData.map((data, i) => {
    const normalized = ((scores[i] - minScore) / range) * 4 + 1;
    const rating = Math.round(Math.min(5, Math.max(1, normalized))) as 1 | 2 | 3 | 4 | 5;

    return {
      regionId,
      month: data.month,
      rating,
      summary: generateSummary(data, rating),
      highlights: generateHighlights(data, rating),
      cautions: generateCautions(data),
      events: [],
      tips: generateTips(data),
      clothingAdvice: generateClothingAdvice(data),
      crowdLevel: getCrowdLevel(data.month, rating),
      priceLevel: getPriceLevel(data.month, rating),
    };
  });
}

function calculateScore(d: MonthlyData): number {
  let score = 0;

  // 기온 쾌적도 (20~28도가 최적)
  const avgTemp = (d.tempHigh + d.tempLow) / 2;
  if (avgTemp >= 18 && avgTemp <= 28) score += 30;
  else if (avgTemp >= 10 && avgTemp <= 35) score += 15;
  else score += 0;

  // 강수량 (적을수록 좋음)
  if (d.rainfall < 50) score += 30;
  else if (d.rainfall < 100) score += 20;
  else if (d.rainfall < 200) score += 10;
  else score += 0;

  // 강수일수
  if (d.rainyDays < 5) score += 20;
  else if (d.rainyDays < 10) score += 15;
  else if (d.rainyDays < 15) score += 5;
  else score += 0;

  // 일조시간
  if (d.sunshineHours > 8) score += 20;
  else if (d.sunshineHours > 5) score += 10;
  else score += 0;

  return score;
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

function generateHighlights(d: MonthlyData, rating: 1 | 2 | 3 | 4 | 5): string[] {
  const highlights: string[] = [];
  if (rating >= 4) {
    if (d.sunshineHours > 8) highlights.push('일조시간이 길어 야외 활동에 최적');
    if (d.rainfall < 50) highlights.push('강수량이 적어 맑은 날이 많음');
    if (d.tempHigh >= 20 && d.tempHigh <= 30) highlights.push('쾌적한 기온');
  }
  if (d.humidity < 60) highlights.push('습도가 낮아 쾌적함');
  if (highlights.length === 0) highlights.push('특별한 장점 없음');
  return highlights;
}

function generateCautions(d: MonthlyData): string[] {
  const cautions: string[] = [];
  if (d.tempHigh > 35) cautions.push('폭염 주의, 충분한 수분 섭취 필수');
  if (d.tempLow < 0) cautions.push('영하의 기온, 동파 및 미끄러움 주의');
  if (d.rainfall > 200) cautions.push('강수량이 많아 우산 필수, 야외 일정 유동적으로');
  if (d.rainyDays > 15) cautions.push('비 오는 날이 많아 실내 대안 준비 권장');
  if (d.humidity > 80) cautions.push('높은 습도, 체감 온도 상승에 주의');
  if (d.uvIndex > 8) cautions.push('자외선 지수가 높아 선크림 필수');
  return cautions;
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

function getCrowdLevel(month: number, rating: 1 | 2 | 3 | 4 | 5): 'low' | 'medium' | 'high' {
  // 성수기(7~8월, 12~1월) + 높은 평점 → 혼잡
  const peakMonths = [1, 7, 8, 12];
  if (peakMonths.includes(month) && rating >= 4) return 'high';
  if (rating >= 4) return 'medium';
  return 'low';
}

function getPriceLevel(month: number, rating: 1 | 2 | 3 | 4 | 5): 'low' | 'medium' | 'high' {
  const peakMonths = [1, 7, 8, 12];
  if (peakMonths.includes(month) && rating >= 4) return 'high';
  if (rating <= 2) return 'low';
  return 'medium';
}
