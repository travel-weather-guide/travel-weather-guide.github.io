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

function generateSummary(d: MonthlyData, rating: 1 | 2 | 3 | 4 | 5): { ko: string; en: string; ja: string; zh: string } {
  const avgTemp = (d.tempHigh + d.tempLow) / 2;

  if (rating >= 4) {
    if (d.rainfall < 50) return { ko: '맑고 건조한 날씨, 여행 최적기', en: 'Clear and dry, best time to visit', ja: '晴天で乾燥、旅行のベストシーズン', zh: '晴朗干燥，最佳旅行时节' };
    if (avgTemp >= 20 && avgTemp <= 28) return { ko: '쾌적한 기온, 여행하기 좋은 시기', en: 'Pleasant temperatures, great time to travel', ja: '快適な気温、旅行に最適な時期', zh: '气温宜人，适合旅行' };
    return { ko: '날씨가 좋아 여행하기 적합한 시기', en: 'Good weather, suitable for travel', ja: '天気が良く旅行に適した時期', zh: '天气良好，适合旅行' };
  }
  if (rating === 3) {
    if (d.rainfall > 150) return { ko: '비가 잦지만 여행 가능한 시기', en: 'Frequent rain but still possible to travel', ja: '雨が多いが旅行は可能な時期', zh: '雨水较多但仍可旅行' };
    if (avgTemp > 30) return { ko: '더운 날씨, 실내 활동 병행 권장', en: 'Hot weather, indoor activities recommended', ja: '暑い天気、屋内活動の併用を推奨', zh: '天气炎热，建议搭配室内活动' };
    if (avgTemp < 10) return { ko: '쌀쌀한 날씨, 방한 준비 필요', en: 'Chilly weather, warm clothing needed', ja: '肌寒い天気、防寒準備が必要', zh: '天气微凉，需准备保暖衣物' };
    return { ko: '보통의 날씨, 여행 가능', en: 'Average weather, travel is possible', ja: '普通の天気、旅行は可能', zh: '天气一般，可以旅行' };
  }
  if (rating === 2) {
    if (d.rainfall > 200) return { ko: '우기로 비가 많은 시기', en: 'Rainy season with heavy rainfall', ja: '雨季で雨が多い時期', zh: '雨季降水量大' };
    if (avgTemp > 35) return { ko: '극심한 더위, 여행 비추천', en: 'Extreme heat, not recommended', ja: '猛暑のため旅行は非推奨', zh: '酷热难耐，不推荐旅行' };
    if (avgTemp < 5) return { ko: '매우 추운 시기, 방한 필수', en: 'Very cold, warm gear essential', ja: '非常に寒い時期、防寒必須', zh: '非常寒冷，必须做好保暖' };
    return { ko: '날씨가 좋지 않아 비추천', en: 'Poor weather, not recommended', ja: '天候が悪く非推奨', zh: '天气不佳，不推荐' };
  }
  // rating 1
  if (d.rainfall > 300) return { ko: '폭우 시즌, 여행 피하는 것이 좋음', en: 'Heavy rain season, best to avoid', ja: '豪雨シーズン、避けるのが無難', zh: '暴雨季节，建议避开' };
  if (avgTemp > 38) return { ko: '극한의 더위, 여행 자제 권장', en: 'Extreme heat, travel discouraged', ja: '極端な暑さ、旅行は控えた方が良い', zh: '极端高温，建议避免旅行' };
  if (avgTemp < -5) return { ko: '혹한기, 여행 자제 권장', en: 'Freezing cold, travel discouraged', ja: '極寒期、旅行は控えた方が良い', zh: '严寒时期，建议避免旅行' };
  return { ko: '여행에 부적합한 시기', en: 'Not suitable for travel', ja: '旅行に不向きな時期', zh: '不适合旅行의시기' };
}

function generateHighlights(
  d: MonthlyData,
  rating: 1 | 2 | 3 | 4 | 5,
  regionId: string,
  month: number,
  seasonOverrides: SeasonOverride[]
): { ko: string[]; en: string[]; ja: string[]; zh: string[] } {
  const ko: string[] = [];
  const en: string[] = [];
  const ja: string[] = [];
  const zh: string[] = [];

  // 문화적 시즌 이벤트
  const override = seasonOverrides.find(
    (s) => s.regionId === regionId && s.months.includes(month)
  );
  if (override) {
    const h = override.highlight;
    if (typeof h === 'string') {
      ko.push(h); en.push(h); ja.push(h); zh.push(h);
    } else {
      ko.push((h as { ko: string; en: string; ja?: string; zh?: string }).ko);
      en.push((h as { ko: string; en: string; ja?: string; zh?: string }).en);
      ja.push((h as { ko: string; en: string; ja?: string; zh?: string }).ja ?? (h as { ko: string; en: string; ja?: string; zh?: string }).en);
      zh.push((h as { ko: string; en: string; ja?: string; zh?: string }).zh ?? (h as { ko: string; en: string; ja?: string; zh?: string }).en);
    }
  }

  // 날씨 기반 (rating 무관)
  const avgTemp = (d.tempHigh + d.tempLow) / 2;
  if (d.sunshineHours > 8) {
    ko.push('일조시간이 길어 야외 활동에 좋음');
    en.push('Long sunshine hours, great for outdoor activities');
    ja.push('日照時間が長く、アウトドアに最適');
    zh.push('日照时间长，适合户外活动');
  }
  if (d.rainfall < 50) {
    ko.push('강수량이 적어 맑은 날이 많음');
    en.push('Low rainfall with many clear days');
    ja.push('降水量が少なく晴れの日が多い');
    zh.push('降水量少，晴天较多');
  }
  if (avgTemp >= 18 && avgTemp <= 28) {
    ko.push('쾌적한 기온');
    en.push('Pleasant temperatures');
    ja.push('快適な気温');
    zh.push('气温宜人');
  }
  if (d.humidity < 60) {
    ko.push('습도가 낮아 쾌적함');
    en.push('Low humidity, comfortable');
    ja.push('湿度が低く快適');
    zh.push('湿度低，体感舒适');
  }
  if (avgTemp >= 28) {
    ko.push('따뜻한 날씨로 해변 활동에 적합');
    en.push('Warm weather, perfect for beach activities');
    ja.push('暖かく、ビーチアクティビティに最適');
    zh.push('天气温暖，适合海滩活动');
  }
  if (avgTemp < 5) {
    ko.push('겨울 스포츠에 적합한 시기');
    en.push('Great time for winter sports');
    ja.push('ウィンタースポーツに最適な時期');
    zh.push('适合冬季运动的时节');
  }

  // 비수기 장점
  if (rating <= 2) {
    ko.push('비수기로 관광객이 적어 여유로움');
    en.push('Off-season with fewer tourists');
    ja.push('オフシーズンで観光客が少なくゆったり');
    zh.push('淡季游客少，更加悠闲');

    ko.push('비수기 할인을 활용할 수 있는 시기');
    en.push('Off-season discounts available');
    ja.push('オフシーズン割引が利用できる時期');
    zh.push('可享受淡季折扣');
  }

  // 최소 1개 보장
  if (ko.length === 0) {
    ko.push('현지 일상을 경험하기 좋은 시기');
    en.push('Good time to experience local daily life');
    ja.push('現地の日常を体験するのに良い時期');
    zh.push('体验当地生活的好时机');
  }

  return { ko, en, ja, zh };
}

function generateCautions(d: MonthlyData): { ko: string[]; en: string[]; ja: string[]; zh: string[] } {
  const ko: string[] = [];
  const en: string[] = [];
  const ja: string[] = [];
  const zh: string[] = [];

  if (d.tempHigh > 33) {
    const v = d.tempHigh.toFixed(0);
    ko.push(`평균 최고기온 ${v}°C로 더위에 주의`);
    en.push(`Avg. high of ${v}°C — beware of heat`);
    ja.push(`最高気温${v}°C、暑さに注意`);
    zh.push(`平均最高温${v}°C，注意防暑`);
  }
  if (d.tempLow < 0) {
    const v = d.tempLow.toFixed(0);
    ko.push(`평균 최저기온 ${v}°C로 방한 대비 필요`);
    en.push(`Avg. low of ${v}°C — cold-weather gear needed`);
    ja.push(`最低気温${v}°C、防寒対策が必要`);
    zh.push(`平均最低温${v}°C，需注意保暖`);
  }
  if (d.rainfall > 150) {
    const v = d.rainfall.toFixed(0);
    ko.push(`월 강수량 ${v}mm로 우기에 해당`);
    en.push(`Monthly rainfall of ${v}mm — rainy season`);
    ja.push(`月間降水量${v}mmで雨季に該当`);
    zh.push(`月降水量${v}mm，属雨季`);
  } else if (d.rainfall > 100) {
    const v = d.rainfall.toFixed(0);
    ko.push(`강수량이 ${v}mm로 우산 필수`);
    en.push(`Rainfall of ${v}mm — umbrella essential`);
    ja.push(`降水量${v}mm、傘が必須`);
    zh.push(`降水量${v}mm，务必带伞`);
  }
  if (d.rainyDays > 15) {
    ko.push(`월 ${d.rainyDays}일 비가 와 야외 일정에 유의`);
    en.push(`Rain on ${d.rainyDays} days — plan outdoor activities carefully`);
    ja.push(`月${d.rainyDays}日雨が降り、屋外活動に注意`);
    zh.push(`月有${d.rainyDays}天降雨，注意户外行程`);
  } else if (d.rainyDays > 10) {
    ko.push(`비 오는 날이 ${d.rainyDays}일로 실내 대안 준비 권장`);
    en.push(`${d.rainyDays} rainy days — have indoor alternatives ready`);
    ja.push(`雨の日が${d.rainyDays}日、屋内の代替案を準備推奨`);
    zh.push(`有${d.rainyDays}天降雨，建议准备室内备选`);
  }
  if (d.humidity > 80) {
    const v = d.humidity.toFixed(0);
    ko.push(`습도 ${v}%로 불쾌지수 높음`);
    en.push(`Humidity at ${v}% — high discomfort index`);
    ja.push(`湿度${v}%で不快指数が高い`);
    zh.push(`湿度${v}%，体感闷热`);
  } else if (d.humidity > 70) {
    const v = d.humidity.toFixed(0);
    ko.push(`습도가 ${v}%로 다소 높음`);
    en.push(`Humidity at ${v}% — somewhat high`);
    ja.push(`湿度${v}%でやや高め`);
    zh.push(`湿度${v}%，略偏高`);
  }
  if (d.sunshineHours < 4) {
    ko.push('일조시간이 짧아 흐린 날이 많음');
    en.push('Short sunshine hours with many overcast days');
    ja.push('日照時間が短く曇りの日が多い');
    zh.push('日照时间短，多阴天');
  }

  return { ko, en, ja, zh };
}

function generateEvents(
  regionId: string,
  month: number,
  seasonOverrides: SeasonOverride[]
): { ko: string[]; en: string[]; ja: string[]; zh: string[] } {
  const override = seasonOverrides.find(
    (s) => s.regionId === regionId && s.months.includes(month)
  );
  if (!override?.events) return { ko: [], en: [], ja: [], zh: [] };
  const ev = override.events;
  if (Array.isArray(ev) && ev.length > 0 && typeof ev[0] === 'string') {
    // Legacy string[] — wrap as Korean only for now
    return { ko: ev as string[], en: ev as string[], ja: ev as string[], zh: ev as string[] };
  }
  return ev as unknown as { ko: string[]; en: string[]; ja: string[]; zh: string[] };
}

function generateTips(d: MonthlyData): { ko: string[]; en: string[]; ja: string[]; zh: string[] } {
  const ko: string[] = [];
  const en: string[] = [];
  const ja: string[] = [];
  const zh: string[] = [];
  const avgTemp = (d.tempHigh + d.tempLow) / 2;

  if (d.rainfall > 100) {
    ko.push('접이식 우산이나 우비 챙기기');
    en.push('Bring a foldable umbrella or rain jacket');
    ja.push('折りたたみ傘やレインコートを持参');
    zh.push('携带折叠伞或雨衣');
  }
  if (avgTemp > 30) {
    ko.push('냉방이 잘 되는 숙소 선택 권장');
    en.push('Choose well air-conditioned accommodation');
    ja.push('冷房の効いた宿泊施設を推奨');
    zh.push('建议选择空调良好的住宿');
  }
  if (avgTemp < 5) {
    ko.push('보온 용품과 핫팩 준비');
    en.push('Prepare thermal gear and hand warmers');
    ja.push('防寒グッズとカイロを準備');
    zh.push('准备保暖用品和暖手宝');
  }
  if (d.sunshineHours > 8) {
    ko.push('선글라스와 모자 챙기기');
    en.push('Bring sunglasses and a hat');
    ja.push('サングラスと帽子を持参');
    zh.push('携带太阳镜和帽子');
  }

  return { ko, en, ja, zh };
}

function generateClothingAdvice(d: MonthlyData): { ko: string; en: string; ja: string; zh: string } {
  const avgTemp = (d.tempHigh + d.tempLow) / 2;

  if (avgTemp >= 30) return { ko: '반팔, 반바지, 가벼운 원피스. 통풍 잘 되는 소재 추천', en: 'T-shirts, shorts, light dresses. Breathable fabrics recommended', ja: '半袖、半ズボン、軽いワンピース。通気性の良い素材を推奨', zh: '短袖、短裤、轻薄连衣裙，建议透气面料' };
  if (avgTemp >= 25) return { ko: '반팔, 얇은 긴바지. 자외선 차단 필수', en: 'T-shirts, light pants. Sun protection essential', ja: '半袖、薄手の長ズボン。日焼け止め必須', zh: '短袖、薄长裤，防晒必备' };
  if (avgTemp >= 20) return { ko: '얇은 긴팔, 가디건. 아침저녁 쌀쌀할 수 있음', en: 'Light long sleeves, cardigan. Can be chilly morning & evening', ja: '薄手の長袖、カーディガン。朝晩は肌寒いことも', zh: '薄长袖、开衫，早晚可能微凉' };
  if (avgTemp >= 15) return { ko: '긴팔, 가벼운 재킷. 레이어드 추천', en: 'Long sleeves, light jacket. Layering recommended', ja: '長袖、軽いジャケット。レイヤードがおすすめ', zh: '长袖、轻薄外套，建议叠穿' };
  if (avgTemp >= 10) return { ko: '재킷, 니트, 긴바지. 아우터 필수', en: 'Jacket, knitwear, long pants. Outerwear essential', ja: 'ジャケット、ニット、長ズボン。アウター必須', zh: '夹克、针织衫、长裤，外套必备' };
  if (avgTemp >= 5)  return { ko: '코트, 목도리, 장갑. 보온 레이어 필요', en: 'Coat, scarf, gloves. Warm layers needed', ja: 'コート、マフラー、手袋。保温レイヤーが必要', zh: '大衣、围巾、手套，需要保暖层' };
  if (avgTemp >= 0)  return { ko: '패딩, 두꺼운 코트, 방한용품 필수', en: 'Padded jacket, thick coat, cold-weather gear essential', ja: 'ダウン、厚手のコート、防寒具必須', zh: '羽绒服、厚外套、防寒装备必备' };
  return { ko: '방한복, 패딩, 핫팩. 극한 방한 준비 필수', en: 'Winter gear, padded jacket, hand warmers. Extreme cold protection essential', ja: '防寒服、ダウン、カイロ。極寒対策必須', zh: '防寒服、羽绒服、暖手宝，极寒防护必备' };
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
