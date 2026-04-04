import type { Continent } from '../src/types';

export interface RegionDef {
  id: string;
  name: { ko: string; en: string };
  latitude: number;
  longitude: number;
  climateType: string;
  isCoastal: boolean;
  category: 'beach' | 'mountain' | 'city' | 'culture' | 'adventure' | 'ski';
  peakTourismMonths: number[];
}

export interface CountryDef {
  id: string;
  name: { ko: string; en: string };
  continent: Continent;
  countryCode: string; // ISO 3166-1 alpha-2
  regions: RegionDef[];
}

export const countries: CountryDef[] = [
  {
    id: 'japan',
    name: { ko: '일본', en: 'Japan' },
    continent: 'asia',
    countryCode: 'JP',
    regions: [
      { id: 'tokyo', name: { ko: '도쿄', en: 'Tokyo' }, latitude: 35.6762, longitude: 139.6503, climateType: '온대 습윤', isCoastal: true, category: 'city', peakTourismMonths: [3, 4, 10, 11] },
      { id: 'osaka', name: { ko: '오사카', en: 'Osaka' }, latitude: 34.6937, longitude: 135.5023, climateType: '온대 습윤', isCoastal: true, category: 'culture', peakTourismMonths: [3, 4, 10, 11] },
      { id: 'okinawa', name: { ko: '오키나와', en: 'Okinawa' }, latitude: 26.3344, longitude: 127.8056, climateType: '아열대', isCoastal: true, category: 'beach', peakTourismMonths: [7, 8, 3, 4] },
      { id: 'hokkaido', name: { ko: '홋카이도', en: 'Hokkaido' }, latitude: 43.0642, longitude: 141.3469, climateType: '냉대 습윤', isCoastal: true, category: 'adventure', peakTourismMonths: [2, 7, 8] },
    ],
  },
  {
    id: 'thailand',
    name: { ko: '태국', en: 'Thailand' },
    continent: 'asia',
    countryCode: 'TH',
    regions: [
      { id: 'bangkok', name: { ko: '방콕', en: 'Bangkok' }, latitude: 13.7563, longitude: 100.5018, climateType: '열대 사바나', isCoastal: false, category: 'culture', peakTourismMonths: [11, 12, 1, 2] },
      { id: 'chiang-mai', name: { ko: '치앙마이', en: 'Chiang Mai' }, latitude: 18.7883, longitude: 98.9853, climateType: '열대 사바나', isCoastal: false, category: 'mountain', peakTourismMonths: [11, 12, 1, 2] },
      { id: 'phuket', name: { ko: '푸켓', en: 'Phuket' }, latitude: 7.8804, longitude: 98.3923, climateType: '열대 몬순', isCoastal: true, category: 'beach', peakTourismMonths: [11, 12, 1, 2, 3] },
    ],
  },
  {
    id: 'france',
    name: { ko: '프랑스', en: 'France' },
    continent: 'europe',
    countryCode: 'FR',
    regions: [
      { id: 'paris', name: { ko: '파리', en: 'Paris' }, latitude: 48.8566, longitude: 2.3522, climateType: '서안 해양성', isCoastal: false, category: 'culture', peakTourismMonths: [4, 5, 6, 9, 10] },
      { id: 'nice', name: { ko: '니스', en: 'Nice' }, latitude: 43.7102, longitude: 7.2620, climateType: '지중해성', isCoastal: true, category: 'beach', peakTourismMonths: [6, 7, 8] },
    ],
  },
  {
    id: 'usa',
    name: { ko: '미국', en: 'United States' },
    continent: 'north-america',
    countryCode: 'US',
    regions: [
      { id: 'new-york', name: { ko: '뉴욕', en: 'New York' }, latitude: 40.7128, longitude: -74.0060, climateType: '온대 습윤', isCoastal: true, category: 'city', peakTourismMonths: [4, 5, 10, 11, 12] },
      { id: 'los-angeles', name: { ko: '로스앤젤레스', en: 'Los Angeles' }, latitude: 34.0522, longitude: -118.2437, climateType: '지중해성', isCoastal: true, category: 'city', peakTourismMonths: [6, 7, 8] },
      { id: 'hawaii', name: { ko: '하와이', en: 'Hawaii' }, latitude: 21.3069, longitude: -157.8583, climateType: '열대', isCoastal: true, category: 'beach', peakTourismMonths: [12, 1, 2, 6, 7, 8] },
    ],
  },
  {
    id: 'australia',
    name: { ko: '호주', en: 'Australia' },
    continent: 'oceania',
    countryCode: 'AU',
    regions: [
      { id: 'sydney', name: { ko: '시드니', en: 'Sydney' }, latitude: -33.8688, longitude: 151.2093, climateType: '온대 습윤', isCoastal: true, category: 'city', peakTourismMonths: [12, 1, 2, 3] },
      { id: 'melbourne', name: { ko: '멜버른', en: 'Melbourne' }, latitude: -37.8136, longitude: 144.9631, climateType: '온대 해양성', isCoastal: true, category: 'culture', peakTourismMonths: [1, 2, 3, 11] },
    ],
  },
];

export interface SeasonOverride {
  regionId: string;
  months: number[];      // 적용 월
  ratingBonus: number;   // rating에 더할 보정값 (-2 ~ +2)
  highlight: string;     // highlights에 추가할 문구
  events: string[];      // events 배열에 추가할 항목
}

export const seasonOverrides: SeasonOverride[] = [
  // 일본
  { regionId: 'tokyo', months: [3, 4], ratingBonus: 2, highlight: '벚꽃(사쿠라) 시즌으로 일본 최고의 여행 시기', events: ['벚꽃 시즌 (3월 말~4월 초)', '우에노 공원 벚꽃 축제'] },
  { regionId: 'tokyo', months: [11, 12], ratingBonus: 1, highlight: '단풍과 일루미네이션의 계절', events: ['단풍 시즌 (11~12월)', '도쿄 크리스마스 일루미네이션'] },
  { regionId: 'tokyo', months: [7], ratingBonus: 0, highlight: '여름 불꽃놀이(하나비) 시즌', events: ['스미다강 불꽃놀이 (7월)', '여름 마츠리'] },

  { regionId: 'osaka', months: [3, 4], ratingBonus: 2, highlight: '오사카성 벚꽃이 만개하는 시기', events: ['벚꽃 시즌', '조폐국 벚꽃 통로 개방'] },
  { regionId: 'osaka', months: [11], ratingBonus: 1, highlight: '단풍 명소가 많은 가을', events: ['단풍 시즌', '미노오 폭포 단풍'] },

  { regionId: 'okinawa', months: [3, 4, 5], ratingBonus: 1, highlight: '해수욕 시즌 시작, 본토보다 일찍 따뜻해짐', events: ['해변 개장 (3~4월)'] },
  { regionId: 'okinawa', months: [7, 8], ratingBonus: 0, highlight: '성수기이나 태풍 가능성 있음', events: ['에이사 축제 (8월)', '태풍 시즌'] },

  { regionId: 'hokkaido', months: [2], ratingBonus: 2, highlight: '삿포로 눈축제와 겨울 스포츠의 계절', events: ['삿포로 눈축제 (2월 초)', '스키/스노보드 시즌'] },
  { regionId: 'hokkaido', months: [7, 8], ratingBonus: 1, highlight: '라벤더 만개, 본토보다 시원한 피서지', events: ['후라노 라벤더 축제 (7월)', '홋카이도 여름 피서'] },

  // 태국
  { regionId: 'bangkok', months: [11, 12, 1, 2], ratingBonus: 1, highlight: '건기로 쾌적한 관광 시기', events: ['로이끄라통 (11월)', '송크란 대비 건기 여행'] },
  { regionId: 'bangkok', months: [4], ratingBonus: 1, highlight: '송크란(태국 새해) 물 축제', events: ['송크란 축제 (4월 13~15일)'] },

  { regionId: 'chiang-mai', months: [11, 12, 1, 2], ratingBonus: 1, highlight: '건기에 선선한 날씨, 최적의 트레킹 시즌', events: ['이펭/로이끄라통 (11월)', '치앙마이 플라워 페스티벌 (2월)'] },
  { regionId: 'chiang-mai', months: [4], ratingBonus: 1, highlight: '태국에서 가장 뜨거운 송크란 축제', events: ['송크란 축제 (4월)'] },

  { regionId: 'phuket', months: [11, 12, 1, 2, 3], ratingBonus: 1, highlight: '건기 해변 시즌, 다이빙에 최적', events: ['건기 시즌', '푸켓 킹스컵 레가타 (12월)'] },

  // 프랑스
  { regionId: 'paris', months: [4, 5, 6], ratingBonus: 1, highlight: '봄꽃과 야외 카페의 계절', events: ['뮤지엄 나이트 (5월)', '프렌치 오픈 테니스 (5~6월)'] },
  { regionId: 'paris', months: [9, 10], ratingBonus: 1, highlight: '가을 파리의 정취, 관광객 감소기', events: ['유럽 문화유산의 날 (9월)', '포도 수확제 (10월)'] },
  { regionId: 'paris', months: [12], ratingBonus: 1, highlight: '크리스마스 마켓과 일루미네이션', events: ['샹젤리제 크리스마스 마켓', '파리 크리스마스 일루미네이션'] },

  { regionId: 'nice', months: [2], ratingBonus: 1, highlight: '니스 카니발 시즌', events: ['니스 카니발 (2월)', '레몬 페스티벌 (망통)'] },
  { regionId: 'nice', months: [6, 7, 8], ratingBonus: 1, highlight: '코트다쥐르 해변 성수기', events: ['칸 영화제 (5월, 인근)', '재즈 페스티벌 (7월)'] },

  // 미국
  { regionId: 'new-york', months: [4, 5], ratingBonus: 1, highlight: '센트럴파크 봄꽃, 쾌적한 날씨', events: ['센트럴파크 벚꽃 (4월)', '메트로폴리탄 미술관 갈라 (5월)'] },
  { regionId: 'new-york', months: [10, 11], ratingBonus: 1, highlight: '가을 단풍과 할로윈/추수감사절', events: ['할로윈 퍼레이드 (10월)', '메이시스 추수감사절 퍼레이드 (11월)'] },
  { regionId: 'new-york', months: [12], ratingBonus: 1, highlight: '록펠러 크리스마스 트리와 홀리데이 시즌', events: ['록펠러 센터 트리 점등', '타임스퀘어 새해 카운트다운'] },

  { regionId: 'los-angeles', months: [2, 3], ratingBonus: 0, highlight: '아카데미 시상식 시즌', events: ['아카데미 시상식 (2~3월)'] },
  { regionId: 'los-angeles', months: [6, 7, 8], ratingBonus: 0, highlight: '해변 성수기, 서핑에 최적', events: ['US 오픈 서핑 (7~8월)'] },

  { regionId: 'hawaii', months: [12, 1, 2], ratingBonus: 0, highlight: '고래 관찰 시즌', events: ['고래 관찰 시즌', '하와이안 문화 축제'] },
  { regionId: 'hawaii', months: [6, 7, 8], ratingBonus: 0, highlight: '건기 해변 최적기', events: ['킹 카메하메하 데이 (6월)'] },

  // 호주 (남반구 — 계절 역전)
  { regionId: 'sydney', months: [12, 1, 2], ratingBonus: 1, highlight: '호주의 여름, 해변과 야외 활동 최적', events: ['시드니 새해 불꽃놀이 (12월 31일)', '호주 데이 (1월 26일)'] },
  { regionId: 'sydney', months: [3, 4], ratingBonus: 1, highlight: '가을 시작, 쾌적한 날씨', events: ['시드니 마디그라 (2~3월)', '시드니 로열 이스터 쇼 (3~4월)'] },

  { regionId: 'melbourne', months: [12, 1, 2, 3], ratingBonus: 1, highlight: '호주의 여름, 다양한 페스티벌', events: ['호주 오픈 테니스 (1월)', '멜버른 컵 (11월, 인근)'] },
  { regionId: 'melbourne', months: [3, 4], ratingBonus: 1, highlight: '가을 단풍과 와이너리 시즌', events: ['멜버른 푸드 앤 와인 페스티벌 (3월)'] },
];

export const visaInfo: Record<string, string> = {
  japan: '무비자 90일',
  thailand: '무비자 90일',
  france: '무비자 90일 (쉥겐 지역)',
  usa: 'ESTA 필요 (전자여행허가, 90일)',
  australia: 'ETA 필요 (전자여행허가, 90일)',
};
