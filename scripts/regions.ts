import type { Continent } from '../src/types';

export interface RegionDef {
  id: string;
  name: { ko: string; en: string };
  latitude: number;
  longitude: number;
  climateType: string;
  isCoastal: boolean;
  category: 'beach' | 'mountain' | 'city' | 'culture' | 'adventure' | 'ski';
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
      { id: 'tokyo', name: { ko: '도쿄', en: 'Tokyo' }, latitude: 35.6762, longitude: 139.6503, climateType: '온대 습윤', isCoastal: true, category: 'city' },
      { id: 'osaka', name: { ko: '오사카', en: 'Osaka' }, latitude: 34.6937, longitude: 135.5023, climateType: '온대 습윤', isCoastal: true, category: 'culture' },
      { id: 'okinawa', name: { ko: '오키나와', en: 'Okinawa' }, latitude: 26.3344, longitude: 127.8056, climateType: '아열대', isCoastal: true, category: 'beach' },
      { id: 'hokkaido', name: { ko: '홋카이도', en: 'Hokkaido' }, latitude: 43.0642, longitude: 141.3469, climateType: '냉대 습윤', isCoastal: true, category: 'adventure' },
    ],
  },
  {
    id: 'thailand',
    name: { ko: '태국', en: 'Thailand' },
    continent: 'asia',
    countryCode: 'TH',
    regions: [
      { id: 'bangkok', name: { ko: '방콕', en: 'Bangkok' }, latitude: 13.7563, longitude: 100.5018, climateType: '열대 사바나', isCoastal: false, category: 'culture' },
      { id: 'chiang-mai', name: { ko: '치앙마이', en: 'Chiang Mai' }, latitude: 18.7883, longitude: 98.9853, climateType: '열대 사바나', isCoastal: false, category: 'mountain' },
      { id: 'phuket', name: { ko: '푸켓', en: 'Phuket' }, latitude: 7.8804, longitude: 98.3923, climateType: '열대 몬순', isCoastal: true, category: 'beach' },
    ],
  },
  {
    id: 'france',
    name: { ko: '프랑스', en: 'France' },
    continent: 'europe',
    countryCode: 'FR',
    regions: [
      { id: 'paris', name: { ko: '파리', en: 'Paris' }, latitude: 48.8566, longitude: 2.3522, climateType: '서안 해양성', isCoastal: false, category: 'culture' },
      { id: 'nice', name: { ko: '니스', en: 'Nice' }, latitude: 43.7102, longitude: 7.2620, climateType: '지중해성', isCoastal: true, category: 'beach' },
    ],
  },
  {
    id: 'usa',
    name: { ko: '미국', en: 'United States' },
    continent: 'north-america',
    countryCode: 'US',
    regions: [
      { id: 'new-york', name: { ko: '뉴욕', en: 'New York' }, latitude: 40.7128, longitude: -74.0060, climateType: '온대 습윤', isCoastal: true, category: 'city' },
      { id: 'los-angeles', name: { ko: '로스앤젤레스', en: 'Los Angeles' }, latitude: 34.0522, longitude: -118.2437, climateType: '지중해성', isCoastal: true, category: 'city' },
      { id: 'hawaii', name: { ko: '하와이', en: 'Hawaii' }, latitude: 21.3069, longitude: -157.8583, climateType: '열대', isCoastal: true, category: 'beach' },
    ],
  },
  {
    id: 'australia',
    name: { ko: '호주', en: 'Australia' },
    continent: 'oceania',
    countryCode: 'AU',
    regions: [
      { id: 'sydney', name: { ko: '시드니', en: 'Sydney' }, latitude: -33.8688, longitude: 151.2093, climateType: '온대 습윤', isCoastal: true, category: 'city' },
      { id: 'melbourne', name: { ko: '멜버른', en: 'Melbourne' }, latitude: -37.8136, longitude: 144.9631, climateType: '온대 해양성', isCoastal: true, category: 'culture' },
    ],
  },
];
