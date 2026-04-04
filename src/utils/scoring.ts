import type { MonthlyData } from '@/types';

/** 여행 적합도 점수를 0-100으로 산출 */
export function getWeatherScore(d: MonthlyData): number {
  const avgTemp = (d.tempHigh + d.tempLow) / 2;
  let score = 0;

  // 기온 (0-30점): 18-28°C가 가장 쾌적
  if (avgTemp >= 18 && avgTemp <= 28) score += 30;
  else if (avgTemp >= 10 && avgTemp <= 35) score += 15;

  // 강수량 (0-30점): 낮을수록 좋음
  if (d.rainfall < 50) score += 30;
  else if (d.rainfall < 100) score += 20;
  else if (d.rainfall < 150) score += 10;

  // 일조시간 (0-20점)
  if (d.sunshineHours > 8) score += 20;
  else if (d.sunshineHours > 5) score += 10;

  // 습도 (0-10점): 낮을수록 쾌적
  if (d.humidity < 60) score += 10;
  else if (d.humidity < 75) score += 5;

  // 강수일수 (0-10점)
  if (d.rainyDays < 5) score += 10;
  else if (d.rainyDays < 10) score += 5;

  return score;
}

/** 베스트 시즌 월 반환. ratings(리서치 기반)가 있으면 rating 5인 월 전부 반환. */
export function getBestMonths(data: MonthlyData[], count = 3, ratings?: number[]): number[] {
  if (ratings && ratings.length === 12) {
    const maxRating = Math.max(...ratings);
    return ratings
      .map((r, i) => ({ month: i + 1, score: r }))
      .filter((s) => s.score === maxRating)
      .map((s) => s.month);
  }
  return data
    .map((d) => ({ month: d.month, score: getWeatherScore(d) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.month);
}
