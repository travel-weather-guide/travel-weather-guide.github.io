/**
 * i18n translation dictionary for Travel Weather
 * Covers all hardcoded Korean strings found across components and pages.
 *
 * Namespaces:
 *   common      — shared UI chrome (search, buttons, labels)
 *   months      — month names 1–12
 *   weekdays    — calendar day-of-week headers
 *   continents  — continent filter labels
 *   ratings     — travel suitability rating labels (1–5)
 *   crowd       — crowdLevel values
 *   price       — priceLevel values
 *   weather     — weather table/chart headers, tooltip labels, summary labels
 *   calendar    — DailyCalendar legend and info-bar labels
 *   region      — RegionTabs tab names and in-tab labels
 *   travel      — TravelTips section headings
 *   country     — CountryDetail info-card labels
 *   home        — home page hero text
 *   countryList — country list page heading/subheading
 *   notFound    — 404 page strings
 *   map         — WorldMap loading indicator
 *   search      — SearchBar result-type labels and messages
 */

export const messages = {
  // ─── Common ──────────────────────────────────────────────────────────────────
  common: {
    regions: {
      ko: '개 지역',
      en: ' regions',
      ja: '地域',
      zh: '个地区',
    },
    country: {
      ko: '국가',
      en: 'Country',
      ja: '国',
      zh: '国家',
    },
    city: {
      ko: '도시',
      en: 'City',
      ja: '都市',
      zh: '城市',
    },
    noResults: {
      ko: '검색 결과가 없습니다',
      en: 'No results found',
      ja: '検索結果がありません',
      zh: '没有找到结果',
    },
    bestSeason: {
      ko: '베스트 시즌',
      en: 'Best Season',
      ja: 'ベストシーズン',
      zh: '最佳季节',
    },
    noData: {
      ko: '해당 기간의 데이터가 없습니다.',
      en: 'No data available for this period.',
      ja: 'この期間のデータがありません。',
      zh: '此时间段没有数据。',
    },
  },

  // ─── Months ──────────────────────────────────────────────────────────────────
  months: {
    1: { ko: '1월', en: 'January', ja: '1月', zh: '1月' },
    2: { ko: '2월', en: 'February', ja: '2月', zh: '2月' },
    3: { ko: '3월', en: 'March', ja: '3月', zh: '3月' },
    4: { ko: '4월', en: 'April', ja: '4月', zh: '4月' },
    5: { ko: '5월', en: 'May', ja: '5月', zh: '5月' },
    6: { ko: '6월', en: 'June', ja: '6月', zh: '6月' },
    7: { ko: '7월', en: 'July', ja: '7月', zh: '7月' },
    8: { ko: '8월', en: 'August', ja: '8月', zh: '8月' },
    9: { ko: '9월', en: 'September', ja: '9月', zh: '9月' },
    10: { ko: '10월', en: 'October', ja: '10月', zh: '10月' },
    11: { ko: '11월', en: 'November', ja: '11月', zh: '11月' },
    12: { ko: '12월', en: 'December', ja: '12月', zh: '12月' },
  },

  // ─── Weekdays (Sunday-first, used in DailyCalendar) ──────────────────────────
  weekdays: {
    sun: { ko: '일', en: 'Sun', ja: '日', zh: '日' },
    mon: { ko: '월', en: 'Mon', ja: '月', zh: '一' },
    tue: { ko: '화', en: 'Tue', ja: '火', zh: '二' },
    wed: { ko: '수', en: 'Wed', ja: '水', zh: '三' },
    thu: { ko: '목', en: 'Thu', ja: '木', zh: '四' },
    fri: { ko: '금', en: 'Fri', ja: '金', zh: '五' },
    sat: { ko: '토', en: 'Sat', ja: '土', zh: '六' },
  },

  // ─── Continents ──────────────────────────────────────────────────────────────
  continents: {
    all: { ko: '전체', en: 'All', ja: 'すべて', zh: '全部' },
    asia: { ko: '아시아', en: 'Asia', ja: 'アジア', zh: '亚洲' },
    europe: { ko: '유럽', en: 'Europe', ja: 'ヨーロッパ', zh: '欧洲' },
    'north-america': { ko: '북미', en: 'North America', ja: '北米', zh: '北美' },
    'south-america': { ko: '남미', en: 'South America', ja: '南米', zh: '南美' },
    oceania: { ko: '오세아니아', en: 'Oceania', ja: 'オセアニア', zh: '大洋洲' },
    africa: { ko: '아프리카', en: 'Africa', ja: 'アフリカ', zh: '非洲' },
  },

  // ─── Travel Ratings ──────────────────────────────────────────────────────────
  ratings: {
    5: { ko: '최적', en: 'Best', ja: '最適', zh: '最佳' },
    4: { ko: '좋음', en: 'Good', ja: '良い', zh: '良好' },
    3: { ko: '보통', en: 'Fair', ja: '普通', zh: '一般' },
    2: { ko: '비추', en: 'Poor', ja: '非推奨', zh: '不推荐' },
    1: { ko: '부적합', en: 'Bad', ja: '不適', zh: '不适合' },
  },

  // ─── Crowd Level ─────────────────────────────────────────────────────────────
  crowd: {
    label: { ko: '관광객', en: 'Tourists', ja: '観光客', zh: '游客' },
    low: { ko: '한산', en: 'Quiet', ja: '閑散', zh: '清淡' },
    medium: { ko: '보통', en: 'Moderate', ja: '普通', zh: '一般' },
    high: { ko: '혼잡', en: 'Busy', ja: '混雑', zh: '拥挤' },
  },

  // ─── Price Level ─────────────────────────────────────────────────────────────
  price: {
    label: { ko: '물가', en: 'Prices', ja: '物価', zh: '物价' },
    low: { ko: '저렴', en: 'Budget', ja: '安め', zh: '便宜' },
    medium: { ko: '보통', en: 'Mid-range', ja: '普通', zh: '中等' },
    high: { ko: '비쌈', en: 'Expensive', ja: '高め', zh: '昂贵' },
  },

  // ─── Weather (table headers, chart labels, tooltip) ──────────────────────────
  weather: {
    // WeatherTable column headers
    tableMonth: { ko: '월', en: 'Month', ja: '月', zh: '月份' },
    tableTempHigh: { ko: '최고°C', en: 'High°C', ja: '最高°C', zh: '最高°C' },
    tableTempLow: { ko: '최저°C', en: 'Low°C', ja: '最低°C', zh: '最低°C' },
    tableRainfall: { ko: '강수mm', en: 'Rain(mm)', ja: '降水mm', zh: '降水mm' },
    tableRainyDays: { ko: '강수일', en: 'Rain Days', ja: '降水日', zh: '降水日' },
    tableHumidity: { ko: '습도%', en: 'Humidity%', ja: '湿度%', zh: '湿度%' },
    tableSunshine: { ko: '일조h', en: 'Sun(h)', ja: '日照h', zh: '日照h' },
    tableSummary: { ko: '요약', en: 'Summary', ja: '概要', zh: '概要' },

    // WeatherChart legend / tooltip names
    chartTempHigh: { ko: '최고기온', en: 'High Temp', ja: '最高気温', zh: '最高气温' },
    chartTempLow: { ko: '최저기온', en: 'Low Temp', ja: '最低気温', zh: '最低气温' },
    chartRainfall: { ko: '강수량', en: 'Rainfall', ja: '降水量', zh: '降水量' },

    // CustomTooltip labels (WeatherChart)
    tooltipTempHigh: { ko: '최고', en: 'High', ja: '最高', zh: '最高' },
    tooltipTempLow: { ko: '최저', en: 'Low', ja: '最低', zh: '最低' },
    tooltipRainfall: { ko: '강수량', en: 'Rainfall', ja: '降水量', zh: '降水量' },

    // YearComparison table headers
    yearCompYear: { ko: '연도', en: 'Year', ja: '年', zh: '年份' },
    yearCompAvgHigh: { ko: '평균 최고', en: 'Avg High', ja: '平均最高', zh: '平均最高' },
    yearCompAvgLow: { ko: '평균 최저', en: 'Avg Low', ja: '平均最低', zh: '平均最低' },
    yearCompRainfall: { ko: '강수량', en: 'Rainfall', ja: '降水量', zh: '降水量' },
    yearCompRainyDays: { ko: '강수일', en: 'Rain Days', ja: '降水日', zh: '降水日' },
    yearCompHumidity: { ko: '습도', en: 'Humidity', ja: '湿度', zh: '湿度' },
  },

  // ─── Calendar ────────────────────────────────────────────────────────────────
  calendar: {
    // Hover info-bar labels (DailyCalendar)
    hoverHint: { ko: '날짜에 마우스를 올려보세요', en: 'Hover over a date', ja: '日付にマウスを合わせてください', zh: '将鼠标悬停在日期上' },
    infoTempHigh: { ko: '최고', en: 'High', ja: '最高', zh: '最高' },
    infoTempLow: { ko: '최저', en: 'Low', ja: '最低', zh: '最低' },
    infoRainfall: { ko: '강수', en: 'Rain', ja: '降水', zh: '降水' },
    infoHumidity: { ko: '습도', en: 'Humidity', ja: '湿度', zh: '湿度' },

    // Legend labels
    legendTitle: { ko: '배경색 = 평균기온', en: 'Background = Avg Temp', ja: '背景色 = 平均気温', zh: '背景色 = 平均气温' },
    legendHot: { ko: '더움 25°+', en: 'Hot 25°+', ja: '暑い 25°+', zh: '炎热 25°+' },
    legendWarm: { ko: '온화 15~25°', en: 'Warm 15–25°', ja: '温暖 15~25°', zh: '温暖 15~25°' },
    legendCool: { ko: '선선 5~15°', en: 'Cool 5–15°', ja: '涼しい 5~15°', zh: '凉爽 5~15°' },
    legendCold: { ko: '추움 5°↓', en: 'Cold 5°↓', ja: '寒い 5°↓', zh: '寒冷 5°↓' },

    // Monthly summary strip at bottom of calendar
    summaryAvgTemp: { ko: '평균 기온', en: 'Avg Temp', ja: '平均気温', zh: '平均气温' },
    summaryRainfall: { ko: '강수', en: 'Rainfall', ja: '降水', zh: '降水' },
    summaryHighLow: { ko: '최고 / 최저', en: 'High / Low', ja: '最高 / 最低', zh: '最高 / 最低' },

    // Year comparison section title inside CalendarTab
    yearComparison: { ko: '연도별 비교', en: 'Year Comparison', ja: '年別比較', zh: '年度对比' },

    // Rainy days count suffix (e.g. "5일" / "5 days")
    rainyDays: { ko: '일', en: ' days', ja: '日', zh: '天' },
  },

  // ─── Region Tabs ─────────────────────────────────────────────────────────────
  region: {
    tabCalendar: { ko: '일별 캘린더', en: 'Daily Calendar', ja: '日別カレンダー', zh: '日历' },
    tabOverview: { ko: '월별 개요', en: 'Monthly Overview', ja: '月別概要', zh: '月度概览' },
    tabGuide: { ko: '여행 가이드', en: 'Travel Guide', ja: '旅行ガイド', zh: '旅行指南' },

    // OverviewTab section heading
    monthlyRating: { ko: '월별 여행 적합도', en: 'Monthly Travel Rating', ja: '月別旅行適合度', zh: '月度旅行适宜度' },

    // GuideTab — no comment placeholder
    noGuide: {
      // e.g. "4월 여행 정보가 아직 없습니다."
      ko: '월 여행 정보가 아직 없습니다.',
      en: ' — travel info not yet available.',
      ja: '月の旅行情報はまだありません。',
      zh: '月旅行信息尚未提供。',
    },
  },

  // ─── Travel Tips ─────────────────────────────────────────────────────────────
  travel: {
    clothing: { ko: '옷차림', en: 'What to Wear', ja: '服装', zh: '穿着建议' },
    highlights: { ko: '좋은 점', en: 'Highlights', ja: '良い点', zh: '亮点' },
    cautions: { ko: '주의사항', en: 'Cautions', ja: '注意事項', zh: '注意事项' },
    tips: { ko: '여행 팁', en: 'Travel Tips', ja: '旅行のヒント', zh: '旅行贴士' },
  },

  // ─── Country Detail Page ─────────────────────────────────────────────────────
  country: {
    capital: { ko: '수도', en: 'Capital', ja: '首都', zh: '首都' },
    currency: { ko: '통화', en: 'Currency', ja: '通貨', zh: '货币' },
    language: { ko: '언어', en: 'Language', ja: '言語', zh: '语言' },
    timezone: { ko: '시간대', en: 'Time Zone', ja: 'タイムゾーン', zh: '时区' },
    regionsSection: {
      // e.g. "지역 (5)"
      ko: '지역',
      en: 'Regions',
      ja: '地域',
      zh: '地区',
    },
  },

  // ─── Country List Page ───────────────────────────────────────────────────────
  countryList: {
    heading: { ko: '국가별 여행 날씨', en: 'Travel Weather by Country', ja: '国別旅行天気', zh: '按国家查看旅行天气' },
    subheading: {
      ko: '세계지도에서 여행지를 탐색하고 국가별 날씨를 확인하세요',
      en: 'Explore destinations on the world map and check the weather by country',
      ja: '世界地図で旅行先を探して、国別の天気を確認しましょう',
      zh: '在世界地图上探索目的地，查看各国天气',
    },
  },

  // ─── Home Page ───────────────────────────────────────────────────────────────
  home: {
    hero: {
      ko: '여행하기 좋은 날씨, 한눈에',
      en: 'Perfect Travel Weather at a Glance',
      ja: '旅行に最適な天気を一目で',
      zh: '一目了然的旅行天气',
    },
    subhero: {
      ko: '세계지도에서 여행지를 탐색하고 국가별 날씨를 확인하세요',
      en: 'Explore destinations on the world map and check the weather by country',
      ja: '世界地図で旅行先を探して、国別の天気を確認しましょう',
      zh: '在世界地图上探索目的地，查看各国天气',
    },
    metaDescription: {
      ko: '전세계 여행지의 월별 날씨와 여행 적합도를 한눈에 확인하세요. 국가별 기온·강수량, 베스트 시즌 정보.',
      en: 'Check monthly weather and travel suitability for destinations worldwide. Temperature, rainfall, and best season info by country.',
      ja: '世界中の旅行先の月別天気と旅行適合度を一目で確認。国別の気温・降水量・ベストシーズン情報。',
      zh: '一目了然地查看全球旅行目的地的月度天气和旅行适宜度。各国气温、降水量及最佳旅行季节信息。',
    },
  },

  // ─── 404 Not Found ───────────────────────────────────────────────────────────
  notFound: {
    heading: { ko: '길을 잃으셨나요?', en: 'Lost Your Way?', ja: '迷子になりましたか？', zh: '迷路了吗？' },
    body: {
      ko: '요청하신 페이지를 찾을 수 없어요. 주소를 다시 확인하거나 아래 링크를 이용해 주세요.',
      en: "The page you requested could not be found. Please check the URL or use one of the links below.",
      ja: 'お探しのページが見つかりませんでした。URLをご確認いただくか、以下のリンクをご利用ください。',
      zh: '找不到您请求的页面。请检查地址或使用下面的链接。',
    },
    goHome: { ko: '홈으로', en: 'Go Home', ja: 'ホームへ', zh: '返回首页' },
    exploreCountries: { ko: '국가 탐색', en: 'Explore Countries', ja: '国を探す', zh: '探索国家' },
  },

  // ─── Map ─────────────────────────────────────────────────────────────────────
  map: {
    loading: { ko: '지도를 불러오는 중...', en: 'Loading map…', ja: '地図を読み込み中…', zh: '正在加载地图…' },
  },

  // ─── Search Bar ──────────────────────────────────────────────────────────────
  search: {
    placeholder: {
      ko: '국가 또는 도시 검색 (예: 도쿄, Japan, 태국)',
      en: 'Search country or city (e.g. Tokyo, Japan, Thailand)',
      ja: '国や都市を検索（例：東京、Japan、タイ）',
      zh: '搜索国家或城市（例：东京、Japan、泰国）',
    },
    typeCountry: { ko: '국가', en: 'Country', ja: '国', zh: '国家' },
    typeCity: { ko: '도시', en: 'City', ja: '都市', zh: '城市' },
    regionCount: {
      // Used as suffix: "5개 지역"
      ko: '개 지역',
      en: ' regions',
      ja: '地域',
      zh: '个地区',
    },
    noResults: {
      ko: '검색 결과가 없습니다',
      en: 'No results found',
      ja: '検索結果がありません',
      zh: '没有找到结果',
    },
  },

  // ─── CountryCard ─────────────────────────────────────────────────────────────
  countryCard: {
    // alt text for country representative image
    imageAlt: {
      // suffix: "{country name} 대표 이미지"
      ko: '대표 이미지',
      en: 'representative image',
      ja: '代表画像',
      zh: '代表图片',
    },
    regionCount: {
      // suffix after number: "개 지역"
      ko: '개 지역',
      en: ' regions',
      ja: '地域',
      zh: '个地区',
    },
  },

  // ─── RegionList (on CountryDetail) ───────────────────────────────────────────
  regionList: {
    // rating badge suffix: "{month}월 {ratingLabel}"
    monthSuffix: { ko: '월', en: '', ja: '月', zh: '月' },
  },

  // ─── Header ──────────────────────────────────────────────────────────────────
  header: {
    siteTitle: { ko: 'Travel Weather', en: 'Travel Weather', ja: 'Travel Weather', zh: 'Travel Weather' },
  },

  // ─── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    weatherData: { ko: '날씨 데이터 제공', en: 'Weather data by', ja: '気象データ提供', zh: '天气数据来源' },
    countryData: { ko: '국가 데이터 제공', en: 'Country data by', ja: '国データ提供', zh: '国家数据来源' },
    copyright: { ko: '© {year} Travel Weather', en: '© {year} Travel Weather', ja: '© {year} Travel Weather', zh: '© {year} Travel Weather' },
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type Lang = 'ko' | 'en' | 'ja' | 'zh';

/** Extract the union of leaf message objects (those with ko/en/ja/zh keys). */
type LeafMessage = { readonly ko: string; readonly en: string; readonly ja: string; readonly zh: string };

/**
 * t(message, lang) — extract a single translated string from a leaf message object.
 *
 * Usage:
 *   import { messages, t } from '@/i18n/messages';
 *   t(messages.ratings[5], 'en')  // => "Best"
 *   t(messages.continents.asia, 'ja')  // => "アジア"
 */
export function t(msg: LeafMessage, lang: Lang): string {
  return msg[lang];
}

/**
 * createT(lang) — returns a bound translator for a fixed language.
 *
 * Usage:
 *   const tr = createT('en');
 *   tr(messages.notFound.heading)  // => "Lost Your Way?"
 */
export function createT(lang: Lang): (msg: LeafMessage) => string {
  return (msg) => msg[lang];
}
