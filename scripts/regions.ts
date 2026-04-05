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
  isoNumeric: string;  // ISO 3166-1 numeric
  regions: RegionDef[];
}

export const countries: CountryDef[] = [
  {
    id: 'japan',
    name: { ko: '일본', en: 'Japan' },
    continent: 'asia',
    countryCode: 'JP',
    isoNumeric: '392',
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
    isoNumeric: '764',
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
    isoNumeric: '250',
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
    isoNumeric: '840',
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
    isoNumeric: '036',
    regions: [
      { id: 'sydney', name: { ko: '시드니', en: 'Sydney' }, latitude: -33.8688, longitude: 151.2093, climateType: '온대 습윤', isCoastal: true, category: 'city', peakTourismMonths: [12, 1, 2, 3] },
      { id: 'melbourne', name: { ko: '멜버른', en: 'Melbourne' }, latitude: -37.8136, longitude: 144.9631, climateType: '온대 해양성', isCoastal: true, category: 'culture', peakTourismMonths: [1, 2, 3, 11] },
    ],
  },
  // 베트남
  {
    id: 'vietnam',
    name: { ko: '베트남', en: 'Vietnam' },
    continent: 'asia',
    countryCode: 'VN',
    isoNumeric: '704',
    regions: [
      { id: 'hanoi', name: { ko: '하노이', en: 'Hanoi' }, latitude: 21.0285, longitude: 105.8542, climateType: '아열대 몬순', isCoastal: false, category: 'city', peakTourismMonths: [10, 11, 12, 1, 2] },
      { id: 'ho-chi-minh', name: { ko: '호치민', en: 'Ho Chi Minh' }, latitude: 10.8231, longitude: 106.6297, climateType: '열대 몬순', isCoastal: false, category: 'city', peakTourismMonths: [12, 1, 2, 3] },
      { id: 'da-nang', name: { ko: '다낭', en: 'Da Nang' }, latitude: 16.0544, longitude: 108.2022, climateType: '열대 몬순', isCoastal: true, category: 'beach', peakTourismMonths: [3, 4, 5, 6, 7, 8] },
    ],
  },
  // 필리핀
  {
    id: 'philippines',
    name: { ko: '필리핀', en: 'Philippines' },
    continent: 'asia',
    countryCode: 'PH',
    isoNumeric: '608',
    regions: [
      { id: 'manila', name: { ko: '마닐라', en: 'Manila' }, latitude: 14.5995, longitude: 120.9842, climateType: '열대 몬순', isCoastal: true, category: 'city', peakTourismMonths: [12, 1, 2, 3] },
      { id: 'boracay', name: { ko: '보라카이', en: 'Boracay' }, latitude: 11.9674, longitude: 121.9248, climateType: '열대 몬순', isCoastal: true, category: 'beach', peakTourismMonths: [11, 12, 1, 2, 3, 4] },
      { id: 'cebu', name: { ko: '세부', en: 'Cebu' }, latitude: 10.3157, longitude: 123.8854, climateType: '열대 몬순', isCoastal: true, category: 'beach', peakTourismMonths: [12, 1, 2, 3] },
    ],
  },
  // 싱가포르
  {
    id: 'singapore',
    name: { ko: '싱가포르', en: 'Singapore' },
    continent: 'asia',
    countryCode: 'SG',
    isoNumeric: '702',
    regions: [
      { id: 'singapore', name: { ko: '싱가포르', en: 'Singapore' }, latitude: 1.3521, longitude: 103.8198, climateType: '열대 우림', isCoastal: true, category: 'city', peakTourismMonths: [6, 7, 8, 12, 1] },
    ],
  },
  // 인도네시아
  {
    id: 'indonesia',
    name: { ko: '인도네시아', en: 'Indonesia' },
    continent: 'asia',
    countryCode: 'ID',
    isoNumeric: '360',
    regions: [
      { id: 'bali', name: { ko: '발리', en: 'Bali' }, latitude: -8.3405, longitude: 115.0920, climateType: '열대 몬순', isCoastal: true, category: 'beach', peakTourismMonths: [7, 8, 6, 9] },
      { id: 'lombok', name: { ko: '롬복', en: 'Lombok' }, latitude: -8.6500, longitude: 116.3240, climateType: '열대 몬순', isCoastal: true, category: 'beach', peakTourismMonths: [7, 8, 6, 9] },
      { id: 'jakarta', name: { ko: '자카르타', en: 'Jakarta' }, latitude: -6.2088, longitude: 106.8456, climateType: '열대 몬순', isCoastal: true, category: 'city', peakTourismMonths: [7, 8, 6, 9] },
    ],
  },
  // 대만
  {
    id: 'taiwan',
    name: { ko: '대만', en: 'Taiwan' },
    continent: 'asia',
    countryCode: 'TW',
    isoNumeric: '158',
    regions: [
      { id: 'taipei', name: { ko: '타이베이', en: 'Taipei' }, latitude: 25.0330, longitude: 121.5654, climateType: '아열대 습윤', isCoastal: false, category: 'city', peakTourismMonths: [3, 4, 10, 11] },
      { id: 'kaohsiung', name: { ko: '가오슝', en: 'Kaohsiung' }, latitude: 22.6273, longitude: 120.3014, climateType: '열대 몬순', isCoastal: true, category: 'city', peakTourismMonths: [10, 11, 12, 1, 2, 3] },
    ],
  },
  // 스페인
  {
    id: 'spain',
    name: { ko: '스페인', en: 'Spain' },
    continent: 'europe',
    countryCode: 'ES',
    isoNumeric: '724',
    regions: [
      { id: 'madrid', name: { ko: '마드리드', en: 'Madrid' }, latitude: 40.4168, longitude: -3.7038, climateType: '반건조 대륙성', isCoastal: false, category: 'city', peakTourismMonths: [4, 5, 9, 10] },
      { id: 'barcelona', name: { ko: '바르셀로나', en: 'Barcelona' }, latitude: 41.3851, longitude: 2.1734, climateType: '지중해성', isCoastal: true, category: 'beach', peakTourismMonths: [6, 7, 8, 9] },
      { id: 'seville', name: { ko: '세비야', en: 'Seville' }, latitude: 37.3891, longitude: -5.9845, climateType: '지중해성 반건조', isCoastal: false, category: 'culture', peakTourismMonths: [3, 4, 5, 10] },
    ],
  },
  // 이탈리아
  {
    id: 'italy',
    name: { ko: '이탈리아', en: 'Italy' },
    continent: 'europe',
    countryCode: 'IT',
    isoNumeric: '380',
    regions: [
      { id: 'rome', name: { ko: '로마', en: 'Rome' }, latitude: 41.9028, longitude: 12.4964, climateType: '지중해성', isCoastal: false, category: 'culture', peakTourismMonths: [4, 5, 6, 9, 10] },
      { id: 'venice', name: { ko: '베네치아', en: 'Venice' }, latitude: 45.4408, longitude: 12.3155, climateType: '온대 습윤', isCoastal: true, category: 'culture', peakTourismMonths: [4, 5, 6, 9, 10] },
      { id: 'amalfi', name: { ko: '아말피', en: 'Amalfi' }, latitude: 40.6340, longitude: 14.6027, climateType: '지중해성', isCoastal: true, category: 'beach', peakTourismMonths: [6, 7, 8, 9] },
    ],
  },
  // 영국
  {
    id: 'uk',
    name: { ko: '영국', en: 'United Kingdom' },
    continent: 'europe',
    countryCode: 'GB',
    isoNumeric: '826',
    regions: [
      { id: 'london', name: { ko: '런던', en: 'London' }, latitude: 51.5074, longitude: -0.1278, climateType: '서안 해양성', isCoastal: false, category: 'city', peakTourismMonths: [6, 7, 8, 4, 5] },
      { id: 'edinburgh', name: { ko: '에든버러', en: 'Edinburgh' }, latitude: 55.9533, longitude: -3.1883, climateType: '서안 해양성', isCoastal: false, category: 'culture', peakTourismMonths: [7, 8] },
    ],
  },
  // 터키
  {
    id: 'turkey',
    name: { ko: '터키', en: 'Turkey' },
    continent: 'europe',
    countryCode: 'TR',
    isoNumeric: '792',
    regions: [
      { id: 'istanbul', name: { ko: '이스탄불', en: 'Istanbul' }, latitude: 41.0082, longitude: 28.9784, climateType: '지중해성', isCoastal: true, category: 'culture', peakTourismMonths: [4, 5, 9, 10] },
      { id: 'cappadocia', name: { ko: '카파도키아', en: 'Cappadocia' }, latitude: 38.6431, longitude: 34.8289, climateType: '반건조 대륙성', isCoastal: false, category: 'adventure', peakTourismMonths: [4, 5, 9, 10] },
      { id: 'antalya', name: { ko: '안탈리아', en: 'Antalya' }, latitude: 36.8969, longitude: 30.7133, climateType: '지중해성', isCoastal: true, category: 'beach', peakTourismMonths: [6, 7, 8, 9] },
    ],
  },
  // 그리스
  {
    id: 'greece',
    name: { ko: '그리스', en: 'Greece' },
    continent: 'europe',
    countryCode: 'GR',
    isoNumeric: '300',
    regions: [
      { id: 'athens', name: { ko: '아테네', en: 'Athens' }, latitude: 37.9838, longitude: 23.7275, climateType: '지중해성', isCoastal: false, category: 'culture', peakTourismMonths: [4, 5, 9, 10] },
      { id: 'santorini', name: { ko: '산토리니', en: 'Santorini' }, latitude: 36.3932, longitude: 25.4615, climateType: '지중해성', isCoastal: true, category: 'beach', peakTourismMonths: [6, 7, 8, 9] },
      { id: 'mykonos', name: { ko: '미코노스', en: 'Mykonos' }, latitude: 37.4467, longitude: 25.3289, climateType: '지중해성', isCoastal: true, category: 'beach', peakTourismMonths: [6, 7, 8] },
    ],
  },
  // 중국
  {
    id: 'china',
    name: { ko: '중국', en: 'China' },
    continent: 'asia',
    countryCode: 'CN',
    isoNumeric: '156',
    regions: [
      { id: 'beijing', name: { ko: '베이징', en: 'Beijing' }, latitude: 39.9042, longitude: 116.4074, climateType: '온대 대륙성', isCoastal: false, category: 'culture', peakTourismMonths: [4, 5, 9, 10] },
      { id: 'shanghai', name: { ko: '상하이', en: 'Shanghai' }, latitude: 31.2304, longitude: 121.4737, climateType: '아열대 습윤', isCoastal: true, category: 'city', peakTourismMonths: [4, 5, 10, 11] },
      { id: 'qingdao', name: { ko: '칭다오', en: 'Qingdao' }, latitude: 36.0671, longitude: 120.3826, climateType: '온대 습윤', isCoastal: true, category: 'city', peakTourismMonths: [7, 8, 9] },
    ],
  },
  // 홍콩
  {
    id: 'hong-kong',
    name: { ko: '홍콩', en: 'Hong Kong' },
    continent: 'asia',
    countryCode: 'HK',
    isoNumeric: '344',
    regions: [
      { id: 'hong-kong', name: { ko: '홍콩', en: 'Hong Kong' }, latitude: 22.3193, longitude: 114.1694, climateType: '아열대 습윤', isCoastal: true, category: 'city', peakTourismMonths: [10, 11, 12, 3, 4] },
    ],
  },
  // 괌
  {
    id: 'guam',
    name: { ko: '괌', en: 'Guam' },
    continent: 'oceania',
    countryCode: 'GU',
    isoNumeric: '316',
    regions: [
      { id: 'guam', name: { ko: '괌', en: 'Guam' }, latitude: 13.4443, longitude: 144.7937, climateType: '열대 해양성', isCoastal: true, category: 'beach', peakTourismMonths: [1, 2, 3, 12] },
    ],
  },
  // 말레이시아
  {
    id: 'malaysia',
    name: { ko: '말레이시아', en: 'Malaysia' },
    continent: 'asia',
    countryCode: 'MY',
    isoNumeric: '458',
    regions: [
      { id: 'kuala-lumpur', name: { ko: '쿠알라룸푸르', en: 'Kuala Lumpur' }, latitude: 3.1390, longitude: 101.6869, climateType: '열대 우림', isCoastal: false, category: 'city', peakTourismMonths: [6, 7, 8, 12] },
      { id: 'kota-kinabalu', name: { ko: '코타키나발루', en: 'Kota Kinabalu' }, latitude: 5.9804, longitude: 116.0735, climateType: '열대 우림', isCoastal: true, category: 'beach', peakTourismMonths: [1, 2, 3, 4, 5] },
      { id: 'langkawi', name: { ko: '랑카위', en: 'Langkawi' }, latitude: 6.3500, longitude: 99.8000, climateType: '열대 몬순', isCoastal: true, category: 'beach', peakTourismMonths: [11, 12, 1, 2, 3] },
    ],
  },
  // 캄보디아
  {
    id: 'cambodia',
    name: { ko: '캄보디아', en: 'Cambodia' },
    continent: 'asia',
    countryCode: 'KH',
    isoNumeric: '116',
    regions: [
      { id: 'siem-reap', name: { ko: '시엠립', en: 'Siem Reap' }, latitude: 13.3671, longitude: 103.8448, climateType: '열대 몬순', isCoastal: false, category: 'culture', peakTourismMonths: [11, 12, 1, 2, 3] },
      { id: 'phnom-penh', name: { ko: '프놈펜', en: 'Phnom Penh' }, latitude: 11.5564, longitude: 104.9282, climateType: '열대 몬순', isCoastal: false, category: 'city', peakTourismMonths: [11, 12, 1, 2] },
    ],
  },
  // 몰디브
  {
    id: 'maldives',
    name: { ko: '몰디브', en: 'Maldives' },
    continent: 'asia',
    countryCode: 'MV',
    isoNumeric: '462',
    regions: [
      { id: 'male', name: { ko: '말레', en: 'Malé' }, latitude: 4.1755, longitude: 73.5093, climateType: '열대 해양성', isCoastal: true, category: 'beach', peakTourismMonths: [1, 2, 3, 4, 12] },
    ],
  },
  // 몽골
  {
    id: 'mongolia',
    name: { ko: '몽골', en: 'Mongolia' },
    continent: 'asia',
    countryCode: 'MN',
    isoNumeric: '496',
    regions: [
      { id: 'ulaanbaatar', name: { ko: '울란바토르', en: 'Ulaanbaatar' }, latitude: 47.8864, longitude: 106.9057, climateType: '냉대 대륙성', isCoastal: false, category: 'adventure', peakTourismMonths: [7, 8] },
    ],
  },
  // 라오스
  {
    id: 'laos',
    name: { ko: '라오스', en: 'Laos' },
    continent: 'asia',
    countryCode: 'LA',
    isoNumeric: '418',
    regions: [
      { id: 'luang-prabang', name: { ko: '루앙프라방', en: 'Luang Prabang' }, latitude: 19.8853, longitude: 102.1347, climateType: '열대 사바나', isCoastal: false, category: 'culture', peakTourismMonths: [11, 12, 1, 2, 3] },
      { id: 'vientiane', name: { ko: '비엔티안', en: 'Vientiane' }, latitude: 17.9757, longitude: 102.6331, climateType: '열대 사바나', isCoastal: false, category: 'culture', peakTourismMonths: [11, 12, 1, 2] },
    ],
  },
  // 스위스
  {
    id: 'switzerland',
    name: { ko: '스위스', en: 'Switzerland' },
    continent: 'europe',
    countryCode: 'CH',
    isoNumeric: '756',
    regions: [
      { id: 'zurich', name: { ko: '취리히', en: 'Zurich' }, latitude: 47.3769, longitude: 8.5417, climateType: '서안 해양성', isCoastal: false, category: 'city', peakTourismMonths: [6, 7, 8, 12] },
      { id: 'interlaken', name: { ko: '인터라켄', en: 'Interlaken' }, latitude: 46.6863, longitude: 7.8632, climateType: '산악 기후', isCoastal: false, category: 'adventure', peakTourismMonths: [6, 7, 8, 12, 1, 2] },
    ],
  },
  // 체코
  {
    id: 'czech',
    name: { ko: '체코', en: 'Czech Republic' },
    continent: 'europe',
    countryCode: 'CZ',
    isoNumeric: '203',
    regions: [
      { id: 'prague', name: { ko: '프라하', en: 'Prague' }, latitude: 50.0755, longitude: 14.4378, climateType: '온대 대륙성', isCoastal: false, category: 'culture', peakTourismMonths: [4, 5, 6, 9, 10, 12] },
    ],
  },
  // 크로아티아
  {
    id: 'croatia',
    name: { ko: '크로아티아', en: 'Croatia' },
    continent: 'europe',
    countryCode: 'HR',
    isoNumeric: '191',
    regions: [
      { id: 'dubrovnik', name: { ko: '두브로브니크', en: 'Dubrovnik' }, latitude: 42.6507, longitude: 18.0944, climateType: '지중해성', isCoastal: true, category: 'culture', peakTourismMonths: [5, 6, 7, 8, 9] },
      { id: 'split', name: { ko: '스플리트', en: 'Split' }, latitude: 43.5081, longitude: 16.4402, climateType: '지중해성', isCoastal: true, category: 'beach', peakTourismMonths: [6, 7, 8, 9] },
    ],
  },
  // UAE
  {
    id: 'uae',
    name: { ko: 'UAE', en: 'United Arab Emirates' },
    continent: 'asia',
    countryCode: 'AE',
    isoNumeric: '784',
    regions: [
      { id: 'dubai', name: { ko: '두바이', en: 'Dubai' }, latitude: 25.2048, longitude: 55.2708, climateType: '사막 건조', isCoastal: true, category: 'city', peakTourismMonths: [11, 12, 1, 2, 3] },
      { id: 'abu-dhabi', name: { ko: '아부다비', en: 'Abu Dhabi' }, latitude: 24.4539, longitude: 54.3773, climateType: '사막 건조', isCoastal: true, category: 'culture', peakTourismMonths: [11, 12, 1, 2, 3] },
    ],
  },
  // 뉴질랜드
  {
    id: 'new-zealand',
    name: { ko: '뉴질랜드', en: 'New Zealand' },
    continent: 'oceania',
    countryCode: 'NZ',
    isoNumeric: '554',
    regions: [
      { id: 'auckland', name: { ko: '오클랜드', en: 'Auckland' }, latitude: -36.8485, longitude: 174.7633, climateType: '온대 해양성', isCoastal: true, category: 'city', peakTourismMonths: [12, 1, 2, 3] },
      { id: 'queenstown', name: { ko: '퀸스타운', en: 'Queenstown' }, latitude: -45.0312, longitude: 168.6626, climateType: '산악 해양성', isCoastal: false, category: 'adventure', peakTourismMonths: [12, 1, 2, 6, 7, 8] },
    ],
  },
  // 독일
  {
    id: 'germany',
    name: { ko: '독일', en: 'Germany' },
    continent: 'europe',
    countryCode: 'DE',
    isoNumeric: '276',
    regions: [
      { id: 'berlin', name: { ko: '베를린', en: 'Berlin' }, latitude: 52.5200, longitude: 13.4050, climateType: '온대 대륙성', isCoastal: false, category: 'city', peakTourismMonths: [5, 6, 7, 8, 9, 12] },
      { id: 'munich', name: { ko: '뮌헨', en: 'Munich' }, latitude: 48.1351, longitude: 11.5820, climateType: '온대 대륙성', isCoastal: false, category: 'culture', peakTourismMonths: [6, 7, 8, 9, 10, 12] },
    ],
  },
  // 포르투갈
  {
    id: 'portugal',
    name: { ko: '포르투갈', en: 'Portugal' },
    continent: 'europe',
    countryCode: 'PT',
    isoNumeric: '620',
    regions: [
      { id: 'lisbon', name: { ko: '리스본', en: 'Lisbon' }, latitude: 38.7223, longitude: -9.1393, climateType: '지중해성', isCoastal: true, category: 'city', peakTourismMonths: [4, 5, 6, 9, 10] },
      { id: 'porto', name: { ko: '포르투', en: 'Porto' }, latitude: 41.1579, longitude: -8.6291, climateType: '서안 해양성', isCoastal: true, category: 'culture', peakTourismMonths: [6, 7, 8, 9] },
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

  // 베트남
  { regionId: 'hanoi', months: [1, 2], ratingBonus: 1, highlight: '설날(뗏) 축제 시즌', events: ['뗏(구정) 연휴 (1~2월)', '하노이 꽃 축제'] },
  { regionId: 'hanoi', months: [10, 11], ratingBonus: 1, highlight: '선선하고 건조한 최적 관광시즌', events: ['하노이 구시가 가을 여행 적기'] },
  { regionId: 'ho-chi-minh', months: [12, 1, 2], ratingBonus: 1, highlight: '건기, 야외 활동 최적', events: ['뗏(구정) 연휴 (1~2월)'] },
  { regionId: 'da-nang', months: [3, 4, 5], ratingBonus: 1, highlight: '맑고 따뜻한 해변 시즌', events: ['다낭 국제 불꽃놀이 (4~6월)'] },
  { regionId: 'da-nang', months: [6, 7, 8], ratingBonus: 1, highlight: '해변 성수기', events: ['다낭 국제 불꽃놀이 대회 결선'] },

  // 필리핀
  { regionId: 'boracay', months: [11, 12, 1, 2], ratingBonus: 1, highlight: '건기 해변, 맑고 파도 잔잔', events: ['보라카이 아리아 다이빙 페스티벌'] },
  { regionId: 'cebu', months: [12, 1], ratingBonus: 1, highlight: '시눌로그 축제 시즌', events: ['시눌로그 축제 (1월 셋째 주 일요일)'] },
  { regionId: 'manila', months: [12, 1, 2], ratingBonus: 1, highlight: '선선한 건기', events: ['마닐라 국제 영화제 (1월)'] },

  // 싱가포르
  { regionId: 'singapore', months: [1, 2], ratingBonus: 1, highlight: '중국 설날 치나타운 장식', events: ['중국 설날 (1~2월)', '싱가포르 리버 홍바오'] },
  { regionId: 'singapore', months: [7], ratingBonus: 1, highlight: '싱가포르 국경일 퍼레이드 시즌', events: ['싱가포르 내셔널 데이 (8월 9일)', '그레이트 싱가포르 세일'] },

  // 인도네시아
  { regionId: 'bali', months: [6, 7, 8, 9], ratingBonus: 1, highlight: '건기 성수기, 다이빙/서핑 최적', events: ['발리 아츠 페스티벌 (6~7월)', '우붓 음식 축제'] },
  { regionId: 'bali', months: [3, 4], ratingBonus: 1, highlight: '냐피(발리 새해) 전후', events: ['냐피 — 발리 침묵의 날 (3~4월)'] },
  { regionId: 'lombok', months: [7, 8], ratingBonus: 1, highlight: '맑은 건기, 린자니 화산 트레킹', events: ['린자니 트레킹 최적기'] },

  // 대만
  { regionId: 'taipei', months: [3, 4], ratingBonus: 1, highlight: '봄꽃과 청명한 날씨', events: ['타이완 등불 축제 (2월)', '벚꽃 시즌 (3월)'] },
  { regionId: 'taipei', months: [10, 11], ratingBonus: 1, highlight: '맑고 선선한 가을', events: ['타이완 국경일 (10월 10일)'] },
  { regionId: 'kaohsiung', months: [1, 2], ratingBonus: 1, highlight: '건기 따뜻한 겨울', events: ['타이완 등불 축제 (2월)'] },

  // 스페인
  { regionId: 'madrid', months: [4, 5], ratingBonus: 1, highlight: '이사벨라 봄 축제 시즌', events: ['산 이시드로 축제 (5월)', '레알 마드리드 홈 경기 시즌'] },
  { regionId: 'barcelona', months: [6, 7, 8], ratingBonus: 1, highlight: '해변+도시 성수기', events: ['성 후안 축제 (6월 23일)', '그라시아 지구 축제 (8월)'] },
  { regionId: 'seville', months: [4], ratingBonus: 2, highlight: '세비야 4월 축제(페리아)', events: ['세마나 산타 (3~4월)', '세비야 페리아 데 아브릴 (4월)'] },
  { regionId: 'seville', months: [3], ratingBonus: 1, highlight: '플라멩코 축제 시즌', events: ['세마나 산타 (성주간)'] },

  // 이탈리아
  { regionId: 'rome', months: [4, 5], ratingBonus: 1, highlight: '온화한 봄, 관광 적기', events: ['부활절 연휴 (3~4월)', '로마 생일 (4월 21일)'] },
  { regionId: 'rome', months: [9, 10], ratingBonus: 1, highlight: '가을 로마, 관광객 감소 쾌적', events: ['로마 영화제 (10월)'] },
  { regionId: 'venice', months: [2], ratingBonus: 1, highlight: '베네치아 카니발', events: ['베네치아 카니발 (2월)'] },
  { regionId: 'venice', months: [4, 5, 9, 10], ratingBonus: 1, highlight: '수상도시 봄·가을 황금기', events: ['베네치아 비엔날레 (홀수 해)', '베네치아 영화제 (8월 말~9월)'] },
  { regionId: 'amalfi', months: [5, 6, 9, 10], ratingBonus: 1, highlight: '지중해 절경 + 쾌적한 기온', events: ['아말피 레가타 (6월)', '포지타노 해변 성수기'] },

  // 영국
  { regionId: 'london', months: [6, 7, 8], ratingBonus: 1, highlight: '런던 여름 성수기', events: ['윔블던 (6~7월)', '노팅힐 카니발 (8월)', '프롬스 음악 축제 (7~9월)'] },
  { regionId: 'london', months: [12], ratingBonus: 1, highlight: '크리스마스 마켓과 일루미네이션', events: ['옥스퍼드 스트리트 크리스마스 조명', '하이드파크 윈터 원더랜드'] },
  { regionId: 'edinburgh', months: [8], ratingBonus: 2, highlight: '에든버러 프린지 + 밀리터리 타투', events: ['에든버러 프린지 페스티벌 (8월)', '로얄 마일 퍼포머'] },
  { regionId: 'edinburgh', months: [12, 1], ratingBonus: 1, highlight: '호그마네(스코틀랜드 새해) 축제', events: ['호그마네 (12월 31일~1월 1일)'] },

  // 터키
  { regionId: 'istanbul', months: [4, 5], ratingBonus: 1, highlight: '봄 이스탄불, 쾌적한 날씨', events: ['이스탄불 튤립 축제 (4월)', '이스탄불 영화제 (4월)'] },
  { regionId: 'istanbul', months: [9, 10], ratingBonus: 1, highlight: '가을 이스탄불, 붐비지 않는 여행', events: ['이스탄불 재즈 페스티벌 (7월)', '보스포러스 마라톤 (11월)'] },
  { regionId: 'cappadocia', months: [4, 5, 9, 10], ratingBonus: 1, highlight: '열기구 비행 최적 시즌', events: ['카파도키아 열기구 시즌 (봄·가을)'] },
  { regionId: 'antalya', months: [5, 6, 9, 10], ratingBonus: 1, highlight: '지중해 해변 최적기', events: ['안탈리아 영화제 (10월)'] },
  { regionId: 'antalya', months: [7, 8], ratingBonus: 0, highlight: '성수기 해변 (매우 더움)', events: ['안탈리아 해변 성수기'] },

  // 그리스
  { regionId: 'athens', months: [4, 5], ratingBonus: 1, highlight: '봄 아테네, 유적지 관광 최적', events: ['그리스 독립기념일 (3월 25일)', '부활절 연휴'] },
  { regionId: 'athens', months: [9, 10], ratingBonus: 1, highlight: '가을 아테네, 선선하고 쾌적', events: ['아테네 국제 마라톤 (11월)'] },
  { regionId: 'santorini', months: [5, 6, 9, 10], ratingBonus: 1, highlight: '일몰 + 에게해 황금기', events: ['산토리니 재즈 페스티벌 (7월)'] },
  { regionId: 'santorini', months: [7, 8], ratingBonus: 0, highlight: '성수기 (매우 붐빔)', events: ['산토리니 성수기 — 예약 필수'] },
  { regionId: 'mykonos', months: [6, 7, 8], ratingBonus: 1, highlight: '파티·해변 성수기', events: ['미코노스 여름 성수기 (6~8월)'] },

  // 중국
  { regionId: 'beijing', months: [4, 5], ratingBonus: 1, highlight: '봄 베이징, 황사 지나고 쾌적한 관광 적기', events: ['천안문 광장 봄 여행 시즌', '베이징 국제 마라톤 (4월)'] },
  { regionId: 'beijing', months: [9, 10], ratingBonus: 1, highlight: '가을 단풍과 맑은 하늘의 베이징', events: ['국경절 황금연휴 (10월 1~7일)', '만리장성 단풍 트레킹'] },
  { regionId: 'shanghai', months: [4, 5], ratingBonus: 1, highlight: '봄 상하이, 꽃과 함께하는 와이탄 산책', events: ['상하이 국제 영화제 (6월)', '봄 꽃 시즌'] },
  { regionId: 'shanghai', months: [10, 11], ratingBonus: 1, highlight: '쾌적한 가을, 외탄 야경이 가장 아름다운 시기', events: ['국경절 황금연휴 (10월)', '상하이 재즈 페스티벌'] },
  { regionId: 'qingdao', months: [7, 8], ratingBonus: 1, highlight: '칭다오 맥주 축제 시즌, 해변 성수기', events: ['칭다오 국제 맥주 축제 (8월)', '해수욕 성수기'] },
  { regionId: 'qingdao', months: [9], ratingBonus: 1, highlight: '맑고 선선한 가을 해변', events: ['칭다오 국제 범선 페스티벌 (9월)'] },

  // 홍콩
  { regionId: 'hong-kong', months: [10, 11], ratingBonus: 1, highlight: '가을 선선한 날씨, 홍콩 최고 여행 시기', events: ['홍콩 와인 앤 다인 페스티벌 (10~11월)', '홍콩 럭비 세번스 (11월)'] },
  { regionId: 'hong-kong', months: [1, 2], ratingBonus: 1, highlight: '홍콩 구정 연휴, 빅토리아 항구 불꽃놀이', events: ['중국 설날 퍼레이드 (1~2월)', '빅토리아 항구 불꽃놀이'] },
  { regionId: 'hong-kong', months: [6], ratingBonus: 0, highlight: '드래곤보트 레이스 시즌', events: ['드래곤 보트 페스티벌 (6월)'] },

  // 괌
  { regionId: 'guam', months: [1, 2, 3], ratingBonus: 1, highlight: '건기 해변 최성수기, 맑고 파도 잔잔', events: ['괌 리베라타 (7월)', '건기 다이빙 시즌'] },
  { regionId: 'guam', months: [12], ratingBonus: 1, highlight: '크리스마스 시즌, 쾌적한 해변', events: ['크리스마스·신년 연휴'] },

  // 말레이시아
  { regionId: 'kota-kinabalu', months: [1, 2, 3, 4, 5], ratingBonus: 1, highlight: '건기 코타키나발루, 스노클링·다이빙 최적', events: ['말레이시아 국경일 (8월 31일)', '건기 다이빙 시즌'] },
  { regionId: 'langkawi', months: [11, 12, 1, 2, 3], ratingBonus: 1, highlight: '건기 랑카위, 에메랄드빛 해변 절정기', events: ['랑카위 국제 해양 항공쇼 (격년)', '건기 해변 시즌'] },
  { regionId: 'kuala-lumpur', months: [6, 7, 8], ratingBonus: 0, highlight: '쇼핑몰 투어와 야경의 도시', events: ['말레이시아 그랑프리 (10월)', 'KL 타워 국제 점프'] },
  { regionId: 'kuala-lumpur', months: [12], ratingBonus: 1, highlight: '크리스마스·신년 일루미네이션', events: ['부킷 빈탕 크리스마스 장식', '신년 카운트다운'] },

  // 캄보디아
  { regionId: 'siem-reap', months: [11, 12, 1, 2], ratingBonus: 1, highlight: '앙코르와트 건기 최적 시즌, 아침 안개가 아름다운 시기', events: ['캄보디아 물 축제 (11월)', '앙코르 와트 마라톤 (12월)'] },
  { regionId: 'siem-reap', months: [3], ratingBonus: 0, highlight: '더워지기 전 마지막 건기 여행', events: ['크메르 설날 (4월 중순)'] },
  { regionId: 'phnom-penh', months: [11, 12, 1, 2], ratingBonus: 1, highlight: '건기 프놈펜, 역사 유적 관광 적기', events: ['캄보디아 물 축제 (11월)', '독립기념일 (11월 9일)'] },

  // 몰디브
  { regionId: 'male', months: [1, 2, 3, 4], ratingBonus: 1, highlight: '건기 몰디브, 맑은 바다와 완벽한 산호초', events: ['건기 스노클링·다이빙 시즌', '몰디브 서핑 시즌 (3~10월)'] },
  { regionId: 'male', months: [12], ratingBonus: 1, highlight: '크리스마스·신년 시즌 리조트 성수기', events: ['신년 카운트다운 리조트 파티'] },

  // 몽골
  { regionId: 'ulaanbaatar', months: [7], ratingBonus: 2, highlight: '나담 축제 — 몽골 전통 유목민 경기 대축제', events: ['나담 축제 (7월 11~13일)', '전통 씨름·활쏘기·경마'] },
  { regionId: 'ulaanbaatar', months: [8], ratingBonus: 1, highlight: '초원 트레킹과 게르 캠프 최적 시즌', events: ['초원 게르 캠프 시즌', '테를지 국립공원 트레킹'] },

  // 라오스
  { regionId: 'luang-prabang', months: [11, 12, 1, 2], ratingBonus: 1, highlight: '건기 루앙프라방, 탁발 공양 의식이 가장 아름다운 시기', events: ['라오스 국경일 (12월 2일)', '탁발 공양 시즌'] },
  { regionId: 'luang-prabang', months: [4], ratingBonus: 1, highlight: '라오스 설날 분피마이 물 축제', events: ['분피마이 — 라오스 새해 (4월 13~15일)'] },
  { regionId: 'vientiane', months: [11, 12, 1, 2], ratingBonus: 1, highlight: '건기 비엔티안, 탓루앙 축제 전후 여행 적기', events: ['탓루앙 축제 (11월 보름)', '라오스 국경일 (12월 2일)'] },
  { regionId: 'vientiane', months: [4], ratingBonus: 1, highlight: '라오스 새해 물 축제', events: ['분피마이 — 라오스 새해 (4월)'] },

  // 스위스
  { regionId: 'zurich', months: [6, 7, 8], ratingBonus: 1, highlight: '알프스 하이킹과 호수 수영의 계절', events: ['취리히 스트리트 퍼레이드 (8월)', '취리히 오픈에어 영화제 (7~8월)'] },
  { regionId: 'zurich', months: [12], ratingBonus: 1, highlight: '크리스마스 마켓, 유럽 최고 수준', events: ['취리히 크리스마스 마켓 (12월)', '실베스터 신년 행사'] },
  { regionId: 'interlaken', months: [6, 7, 8], ratingBonus: 1, highlight: '융프라우 하이킹과 패러글라이딩 성수기', events: ['인터라켄 하이킹 시즌', '융프라우 마라톤 (9월)'] },
  { regionId: 'interlaken', months: [12, 1, 2], ratingBonus: 1, highlight: '알프스 스키 시즌, 눈 덮인 동화 같은 풍경', events: ['스위스 스키 시즌 (12~3월)', '인터라켄 크리스마스 마켓'] },

  // 체코
  { regionId: 'prague', months: [4, 5], ratingBonus: 1, highlight: '봄 프라하, 꽃과 함께하는 구시가지 산책', events: ['프라하 이스터 마켓 (4월)', '프라하 스프링 뮤직 페스티벌 (5~6월)'] },
  { regionId: 'prague', months: [9, 10], ratingBonus: 1, highlight: '황금빛 가을 프라하, 관광객 줄어 여유로운 시기', events: ['프라하 재즈 페스티벌 (10월)', '체코 와인 시즌'] },
  { regionId: 'prague', months: [12], ratingBonus: 1, highlight: '유럽 최고 크리스마스 마켓 중 하나', events: ['프라하 크리스마스 마켓 (12월)', '신년 불꽃놀이 (1월 1일)'] },

  // 크로아티아
  { regionId: 'dubrovnik', months: [5, 6, 9], ratingBonus: 1, highlight: '성수기 전후 여유로운 두브로브니크', events: ['두브로브니크 여름 페스티벌 (7~8월)', '게임 오브 스론즈 투어'] },
  { regionId: 'dubrovnik', months: [7, 8], ratingBonus: 0, highlight: '아드리아해 성수기 (매우 붐빔)', events: ['두브로브니크 여름 페스티벌 (7~8월)'] },
  { regionId: 'split', months: [6, 7, 8, 9], ratingBonus: 1, highlight: '달마티아 해변 성수기', events: ['울트라 유럽 뮤직 페스티벌 (7월)', '스플리트 여름 축제'] },

  // UAE
  { regionId: 'dubai', months: [11, 12, 1, 2, 3], ratingBonus: 1, highlight: '두바이 관광 황금 시즌, 야외 활동 최적', events: ['두바이 쇼핑 페스티벌 (1~2월)', '두바이 엑스포·이벤트 시즌'] },
  { regionId: 'dubai', months: [1], ratingBonus: 1, highlight: '두바이 쇼핑 페스티벌 최성수기', events: ['두바이 쇼핑 페스티벌 (1월)', '두바이 마라톤 (1월)'] },
  { regionId: 'abu-dhabi', months: [11, 12, 1, 2, 3], ratingBonus: 1, highlight: '아부다비 쾌적한 겨울 시즌', events: ['아부다비 F1 그랑프리 (11월)', '아부다비 아트 페어'] },

  // 뉴질랜드 (남반구 — 계절 역전)
  { regionId: 'auckland', months: [12, 1, 2, 3], ratingBonus: 1, highlight: '뉴질랜드 여름, 해변과 하이킹 최적기', events: ['오클랜드 하버브리지 클라임 (연중)', '뉴질랜드 오픈 (1월)'] },
  { regionId: 'queenstown', months: [12, 1, 2], ratingBonus: 1, highlight: '남반구 여름, 번지점프·래프팅 성수기', events: ['퀸스타운 와인 앤 푸드 페스티벌 (1월)', '서머 어드벤처 시즌'] },
  { regionId: 'queenstown', months: [6, 7, 8], ratingBonus: 1, highlight: '남반구 겨울, 스키 리조트 성수기', events: ['코로넷피크·리마커블스 스키 시즌', '퀸스타운 윈터 페스티벌 (6월)'] },

  // 독일
  { regionId: 'berlin', months: [5, 6, 7, 8], ratingBonus: 1, highlight: '베를린 여름 축제와 야외 문화의 계절', events: ['베를린 국제 영화제 (2월)', '베를린 마라톤 (9월)', '크리스토퍼 스트리트 데이 (7월)'] },
  { regionId: 'berlin', months: [12], ratingBonus: 1, highlight: '베를린 크리스마스 마켓, 브란덴부르크 문 일루미네이션', events: ['베를린 크리스마스 마켓 (12월)', '실베스터 신년 파티'] },
  { regionId: 'munich', months: [9, 10], ratingBonus: 2, highlight: '옥토버페스트 — 세계 최대 맥주 축제', events: ['옥토버페스트 (9월 말~10월 초)', '바이에른 전통 복장 퍼레이드'] },
  { regionId: 'munich', months: [12], ratingBonus: 1, highlight: '마리엔 광장 크리스마스 마켓, 유럽 최고 수준', events: ['뮌헨 크리스마스 마켓 (12월)', '레지덴츠 앞 시장'] },

  // 포르투갈
  { regionId: 'lisbon', months: [4, 5, 6], ratingBonus: 1, highlight: '봄 리스본, 산투 안토니우 축제와 파두의 계절', events: ['산투 안토니우 축제 (6월 13일)', '리스본 서머 파티 시즌'] },
  { regionId: 'lisbon', months: [9, 10], ratingBonus: 1, highlight: '가을 리스본, 황금빛 빛과 와인 수확철', events: ['리스본 국제 영화제 (11월)', '포르투갈 와인 수확 시즌 (9월)'] },
  { regionId: 'porto', months: [6], ratingBonus: 1, highlight: '상 주앙 축제 — 포르투 최대 여름 축제', events: ['상 주앙 축제 (6월 23~24일)', '도우루 강변 파티'] },
  { regionId: 'porto', months: [7, 8, 9], ratingBonus: 1, highlight: '도우루 강변 와이너리와 해변 성수기', events: ['포르투 와인 투어 성수기', '도우루 와인 수확 (9월)'] },
];

export const visaInfo: Record<string, string> = {
  japan: '무비자 90일',
  thailand: '무비자 90일',
  france: '무비자 90일 (쉥겐 지역)',
  usa: 'ESTA 필요 (전자여행허가, 90일)',
  australia: 'ETA 필요 (전자여행허가, 90일)',
  vietnam: '무비자 45일',
  philippines: '무비자 30일',
  singapore: '무비자 30일',
  indonesia: '무비자 30일 (VoA 가능)',
  taiwan: '무비자 90일',
  spain: '무비자 90일 (쉥겐 지역)',
  italy: '무비자 90일 (쉥겐 지역)',
  uk: '무비자 6개월 (ETA 필요)',
  turkey: '무비자 90일',
  greece: '무비자 90일 (쉥겐 지역)',
  china: '무비자 15일',
  'hong-kong': '무비자 90일',
  guam: '무비자 45일 (괌-CNMI VWP)',
  malaysia: '무비자 90일',
  cambodia: 'e-비자 또는 도착비자 (30일)',
  maldives: '도착비자 30일 (무료)',
  mongolia: '무비자 30일',
  laos: '도착비자 30일',
  switzerland: '무비자 90일 (쉥겐 지역)',
  czech: '무비자 90일 (쉥겐 지역)',
  croatia: '무비자 90일 (쉥겐 지역)',
  uae: '무비자 30일',
  'new-zealand': 'NZeTA 필요 (90일)',
  germany: '무비자 90일 (쉥겐 지역)',
  portugal: '무비자 90일 (쉥겐 지역)',
};
