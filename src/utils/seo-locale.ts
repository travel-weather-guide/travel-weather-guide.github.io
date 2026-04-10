import type { Locale } from '@/contexts/LocaleContext';

export const LOCALES_FOR_SEO: Locale[] = ['en', 'ja', 'zh'];

export const SEO: Record<string, Record<string, string>> = {
  weather: { ko: '날씨', en: 'Weather', ja: '天気', zh: '天气' },
  monthlyWeather: { ko: '월간날씨', en: 'Monthly Weather', ja: '月間天気', zh: '月度天气' },
  travelGuide: { ko: '여행 가이드', en: 'Travel Guide', ja: '旅行ガイド', zh: '旅行指南' },
  bestTime: { ko: '여행 적기', en: 'Best Time to Visit', ja: 'ベストシーズン', zh: '最佳旅行时间' },
  historical: { ko: '과거 기후 데이터 기반', en: 'Based on historical climate data.', ja: '過去の気候データに基づく', zh: '基于历史气候数据' },
  avgTemp: { ko: '평균 기온', en: 'Average temperature', ja: '平均気温', zh: '平均气温' },
  rainfall: { ko: '강수량', en: 'rainfall', ja: '降水量', zh: '降水量' },
  recommended: { ko: '여행 추천 목적지', en: 'Best Travel Destinations', ja: 'おすすめ旅行先', zh: '推荐旅行目的地' },
  goodPlaces: { ko: '날씨 좋은 여행지 추천', en: 'Best weather destinations', ja: '天気の良い旅行先おすすめ', zh: '天气好的旅行目的地推荐' },
  avoid: { ko: '피해야 할 곳', en: 'places to avoid', ja: '避けるべき場所', zh: '应避免的地方' },
  regions: { ko: '개 지역', en: 'regions', ja: '地域', zh: '个地区' },
  pastWeather: { ko: '과거날씨', en: 'Past Weather', ja: '過去の天気', zh: '历史天气' },
  monthlyWeatherAlt: { ko: '월별날씨', en: 'Weather by Month', ja: '月別天気', zh: '逐月天气' },
};

export const MONTH_NAMES: Record<Locale, string[]> = {
  ko: ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  en: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ja: ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  zh: ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
};

export function seo(key: string, locale: Locale): string {
  return SEO[key]?.[locale] ?? SEO[key]?.en ?? '';
}

export function monthName(m: number, locale: Locale): string {
  return MONTH_NAMES[locale]?.[m] ?? MONTH_NAMES.en[m];
}

export function localName(name: { ko: string; en: string; ja?: string; zh?: string }, locale: Locale): string {
  return (name as Record<string, string>)[locale] ?? name.en;
}

export function hreflangAlternates(path: string) {
  return {
    canonical: path,
    languages: {
      'ko': path,
      'en-US': `/en${path}`,
      'ja': `/ja${path}`,
      'zh': `/zh${path}`,
    },
  };
}

export function localeHreflangAlternates(path: string, locale: Locale) {
  const koPath = path.replace(`/${locale}`, '');
  return {
    canonical: `/${locale}${koPath}`,
    languages: {
      'ko': koPath,
      'en-US': `/en${koPath}`,
      'ja': `/ja${koPath}`,
      'zh': `/zh${koPath}`,
    },
  };
}
