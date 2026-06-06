/**
 * Server-only theme curation data.
 *
 * Theme pages (/theme/[theme]) rank destinations deterministically from our own
 * monthly climate dataset (Open-Meteo Historical). No subjective scoring, no
 * external claims — the climate numbers ARE the source.
 *
 * Used by the server components in src/app/theme/[theme] and
 * src/app/[locale]/theme/[theme]. Never imported by client code.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Country, Region, MonthlyData } from '@/types';
import { getAllCountryIds } from './data-server';

const DATA_DIR = join(process.cwd(), 'src/data');

export type Loc = 'ko' | 'en' | 'ja' | 'zh';
export type LStr = { ko: string; en: string; ja: string; zh: string };
type Name = { ko: string; en: string; ja?: string; zh?: string };

export const THEME_SLUGS = [
  'dry-season',
  'low-humidity',
  'cool-summer',
  'warm-winter',
  'warm-sea',
] as const;
export type ThemeSlug = (typeof THEME_SLUGS)[number];

export function isThemeSlug(s: string): s is ThemeSlug {
  return (THEME_SLUGS as readonly string[]).includes(s);
}

/** Short localized theme names — used for cross-links, breadcrumbs, nav. */
export const THEME_NAMES: Record<ThemeSlug, { ko: string; en: string; ja: string; zh: string }> = {
  'dry-season': { ko: '비 안 오는 여행지', en: 'Driest Destinations', ja: '雨が少ない旅行先', zh: '少雨目的地' },
  'low-humidity': { ko: '습도 낮은 여행지', en: 'Low-Humidity Destinations', ja: '湿度が低い旅行先', zh: '低湿度目的地' },
  'cool-summer': { ko: '여름 시원한 여행지', en: 'Cool-Summer Escapes', ja: '夏が涼しい旅行先', zh: '清凉避暑目的地' },
  'warm-winter': { ko: '겨울 따뜻한 여행지', en: 'Warm Winter Escapes', ja: '冬が暖かい旅行先', zh: '温暖过冬目的地' },
  'warm-sea': { ko: '따뜻한 바다·물놀이', en: 'Warm-Sea Beaches', ja: '暖かい海・水遊び', zh: '温暖海水目的地' },
};

/** One ranked destination row. Values are raw climate numbers for the table. */
export interface ThemeRow {
  regionId: string;
  countryId: string;
  regionName: Name;
  countryName: Name;
  continent: string;
  /** Months (1-12) most relevant to this theme for this destination. */
  bestMonths: number[];
  /** Raw stats shown in the comparison table; keys depend on the theme. */
  stat: {
    tempHigh?: number;
    tempLow?: number;
    rainfall?: number;
    rainyDays?: number;
    humidity?: number;
    seaTemp?: number;
    sunshineHours?: number;
  };
}

/** A comparison-table column: header + how to render a row's value. */
export interface ThemeColumn {
  key: string;
  label: LStr;
  /** Returns the display string (already includes units). */
  format: (row: ThemeRow, locale: Loc) => string;
}

/** Localized "days" unit. */
function days(n: number, locale: Loc, perMonth = false): string {
  const u = locale === 'ko' ? '일' : locale === 'ja' ? '日' : locale === 'zh' ? '天' : 'd';
  const per = perMonth ? (locale === 'en' ? '/mo' : `/${locale === 'ja' || locale === 'zh' ? '月' : '월'}`) : '';
  return `${n}${u}${per}`;
}

export interface ThemeDef {
  slug: ThemeSlug;
  /** Korean primary keyword reflected in the H1/title (source: SEO research). */
  columns: ThemeColumn[];
  /** Build & sort the ranked rows from all regions. */
  rank: (regions: LoadedRegion[]) => ThemeRow[];
  /** How many rows to show. */
  limit: number;
}

interface LoadedRegion {
  region: Region;
  country: Country;
}

// ── helpers ──────────────────────────────────────────────────────────────────

let _cache: LoadedRegion[] | null = null;

function loadAllRegions(): LoadedRegion[] {
  if (_cache) return _cache;
  const out: LoadedRegion[] = [];
  for (const id of getAllCountryIds()) {
    try {
      const country = JSON.parse(
        readFileSync(join(DATA_DIR, 'countries', `${id}.json`), 'utf-8'),
      ) as Country;
      for (const region of country.regions) {
        if (region.monthlyData?.length === 12) out.push({ region, country });
      }
    } catch {
      /* skip unreadable country */
    }
  }
  _cache = out;
  return out;
}

const md = (lr: LoadedRegion, month: number): MonthlyData =>
  lr.region.monthlyData.find((m) => m.month === month)!;

const avg = (nums: number[]) => nums.reduce((a, b) => a + b, 0) / nums.length;
const round = (n: number) => Math.round(n * 10) / 10;
const round0 = (n: number) => Math.round(n);

function baseRow(lr: LoadedRegion, bestMonths: number[], stat: ThemeRow['stat']): ThemeRow {
  return {
    regionId: lr.region.id,
    countryId: lr.country.id,
    regionName: lr.region.name,
    countryName: lr.country.name,
    continent: lr.country.continent,
    bestMonths,
    stat,
  };
}

const KO_SUMMER = [6, 7, 8];
const KO_WINTER = [12, 1, 2];

// ── localized column headers ──────────────────────────────────────────────────

const COL = {
  destination: { ko: '여행지', en: 'Destination', ja: '旅行先', zh: '目的地' },
  annualRain: { ko: '연간 강수량', en: 'Annual rainfall', ja: '年間降水量', zh: '年降水量' },
  rainyDays: { ko: '연 강수일수', en: 'Rainy days/yr', ja: '年間降水日数', zh: '年降水天数' },
  driestMonths: { ko: '가장 건조한 달', en: 'Driest months', ja: '最も乾燥する月', zh: '最干燥月份' },
  avgHumidity: { ko: '연평균 습도', en: 'Avg humidity', ja: '年間平均湿度', zh: '年平均湿度' },
  summerHigh: { ko: '여름(6~8월) 최고기온', en: 'Summer high (Jun–Aug)', ja: '夏(6~8月)最高気温', zh: '夏季(6~8月)最高温' },
  summerLow: { ko: '여름 최저기온', en: 'Summer low', ja: '夏の最低気温', zh: '夏季最低温' },
  winterHigh: { ko: '겨울(12~2월) 최고기온', en: 'Winter high (Dec–Feb)', ja: '冬(12~2月)最高気温', zh: '冬季(12~2月)最高温' },
  winterLow: { ko: '겨울 최저기온', en: 'Winter low', ja: '冬の最低気温', zh: '冬季最低温' },
  bestMonth: { ko: '추천 시기', en: 'Best month', ja: 'おすすめ時期', zh: '推荐时期' },
  seaTemp: { ko: '바다 수온', en: 'Sea temp', ja: '海水温', zh: '海水温度' },
} as const;

function monthsLabel(months: number[], locale: Loc): string {
  if (locale === 'en') {
    const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m) => names[m]).join(', ');
  }
  const sep = locale === 'zh' || locale === 'ja' ? '月' : '월';
  return months.map((m) => `${m}${sep}`).join(', ');
}

// ── theme definitions ──────────────────────────────────────────────────────────

export const THEMES: Record<ThemeSlug, ThemeDef> = {
  // 비 안 오는 / 우기 피하는 해외여행지 — 연간 강수량 적은 순
  'dry-season': {
    slug: 'dry-season',
    limit: 14,
    columns: [
      { key: 'annualRain', label: COL.annualRain, format: (r) => `${r.stat.rainfall}mm` },
      { key: 'rainyDays', label: COL.rainyDays, format: (r, l) => days(r.stat.rainyDays!, l) },
    ],
    rank: (regions) => {
      const rows = regions.map((lr) => {
        const annualRain = round0(lr.region.monthlyData.reduce((s, m) => s + m.rainfall, 0));
        const annualRainyDays = round0(lr.region.monthlyData.reduce((s, m) => s + m.rainyDays, 0));
        const driest = [...lr.region.monthlyData]
          .sort((a, b) => a.rainfall - b.rainfall)
          .slice(0, 3)
          .map((m) => m.month)
          .sort((a, b) => a - b);
        return baseRow(lr, driest, { rainfall: annualRain, rainyDays: annualRainyDays });
      });
      return rows.sort((a, b) => a.stat.rainfall! - b.stat.rainfall!).slice(0, 14);
    },
  },

  // 습도 낮은 해외여행지 — 연평균 습도 낮은 순
  'low-humidity': {
    slug: 'low-humidity',
    limit: 14,
    columns: [
      { key: 'avgHumidity', label: COL.avgHumidity, format: (r) => `${r.stat.humidity}%` },
      { key: 'annualRain', label: COL.annualRain, format: (r) => `${r.stat.rainfall}mm` },
    ],
    rank: (regions) => {
      const rows = regions.map((lr) => {
        const h = round0(avg(lr.region.monthlyData.map((m) => m.humidity)));
        const annualRain = round0(lr.region.monthlyData.reduce((s, m) => s + m.rainfall, 0));
        const driest = [...lr.region.monthlyData]
          .sort((a, b) => a.humidity - b.humidity)
          .slice(0, 3)
          .map((m) => m.month)
          .sort((a, b) => a - b);
        return baseRow(lr, driest, { humidity: h, rainfall: annualRain });
      });
      return rows.sort((a, b) => a.stat.humidity! - b.stat.humidity!).slice(0, 14);
    },
  },

  // 여름 시원한 / 더위 피하는 여행지 — 한국 여름(6~8월) 최고기온 낮은 순 (단, 너무 춥지 않게)
  'cool-summer': {
    slug: 'cool-summer',
    limit: 14,
    columns: [
      { key: 'summerHigh', label: COL.summerHigh, format: (r) => `${r.stat.tempHigh}°C` },
      { key: 'summerLow', label: COL.summerLow, format: (r) => `${r.stat.tempLow}°C` },
    ],
    rank: (regions) => {
      const rows = regions
        // 열대권(|위도|<23.5) 고지대 이상치 제외 — "발리 18°C" 같은 오해 방지.
        // 시원한 여름 = 온대·한대 여행지에 한정한다.
        .filter((lr) => Math.abs(lr.region.latitude) >= 23.5)
        .map((lr) => {
          const high = round(avg(KO_SUMMER.map((m) => md(lr, m).tempHigh)));
          const low = round(avg(KO_SUMMER.map((m) => md(lr, m).tempLow)));
          return { row: baseRow(lr, KO_SUMMER, { tempHigh: high, tempLow: low }), high };
        })
        // 여름 여행지로서 의미 있는 범위: 10°C 이상 25°C 이하 (혹한 제외, 더운 곳 제외)
        .filter((x) => x.high >= 10 && x.high <= 25)
        .sort((a, b) => a.high - b.high)
        .slice(0, 14)
        .map((x) => x.row);
      return rows;
    },
  },

  // 겨울 따뜻한 해외여행 — 한국 겨울(12~2월) 따뜻한 순 (적당히 따뜻, 혹서 제외)
  'warm-winter': {
    slug: 'warm-winter',
    limit: 14,
    columns: [
      { key: 'winterHigh', label: COL.winterHigh, format: (r) => `${r.stat.tempHigh}°C` },
      { key: 'winterLow', label: COL.winterLow, format: (r) => `${r.stat.tempLow}°C` },
    ],
    rank: (regions) => {
      const rows = regions
        .map((lr) => {
          const high = round(avg(KO_WINTER.map((m) => md(lr, m).tempHigh)));
          const low = round(avg(KO_WINTER.map((m) => md(lr, m).tempLow)));
          return { row: baseRow(lr, KO_WINTER, { tempHigh: high, tempLow: low }), high };
        })
        // 겨울 피한지로 의미 있는 범위: 최고 20°C 이상 34°C 이하 (혹서 제외)
        .filter((x) => x.high >= 20 && x.high <= 34)
        .sort((a, b) => b.high - a.high)
        .slice(0, 14)
        .map((x) => x.row);
      return rows;
    },
  },

  // 따뜻한 바다·물놀이 여행지 — 쾌적 수온(26~30.5°C) 달 중 비 적고 더위 심하지 않은 달 기준.
  // 보유 데이터(수온·강수일·기온)로만 판정 — 산호/투명도 등 주관 평가는 하지 않는다.
  'warm-sea': {
    slug: 'warm-sea',
    limit: 14,
    columns: [
      { key: 'seaTemp', label: COL.seaTemp, format: (r) => `${r.stat.seaTemp}°C` },
      { key: 'rainyDays', label: COL.rainyDays, format: (r, l) => days(r.stat.rainyDays!, l, true) },
    ],
    rank: (regions) => {
      const rows = regions
        .map((lr) => {
          // 쾌적 수온대 26~30.5°C (33°C 페르시아만 등 과열 제외)
          const warm = lr.region.monthlyData.filter(
            (m) => m.seaTemp != null && m.seaTemp >= 26 && m.seaTemp <= 30.5,
          );
          if (warm.length === 0) return null;
          // 쾌적 수온 달 중 강수일 가장 적은 달 = 물놀이 베스트 시기
          const best = [...warm].sort((a, b) => a.rainyDays - b.rainyDays)[0];
          // 폭염 해안(체감 부적합) 제외: 베스트 달 최고기온 33°C 이하
          if (best.tempHigh > 33) return null;
          return {
            row: baseRow(lr, [best.month], {
              seaTemp: round(best.seaTemp!),
              rainyDays: round(best.rainyDays),
              tempHigh: round(best.tempHigh),
            }),
            sea: best.seaTemp!,
            rain: best.rainyDays,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
        // 비 적은 순(맑고 잔잔한 바다) → 수온 높은 순
        .sort((a, b) => a.rain - b.rain || b.sea - a.sea)
        .slice(0, 14)
        .map((x) => x.row);
      return rows;
    },
  },
};

/** Compute the ranked rows for a theme. */
export function getThemeRanking(slug: ThemeSlug): ThemeRow[] {
  return THEMES[slug].rank(loadAllRegions());
}

/** Localized "best months" string for a row (e.g. "3월, 4월, 5월" / "Mar, Apr, May"). */
export function bestMonthsLabel(row: ThemeRow, locale: Loc): string {
  return monthsLabel(row.bestMonths, locale);
}

// ── prose content loader (src/data/theme-content/{slug}.json) ───────────────────

export interface ThemeContent {
  slug: ThemeSlug;
  title: LStr;
  h1: LStr;
  metaDescription: LStr;
  intro: { ko: string[]; en: string[]; ja: string[]; zh: string[] };
  tableCaption: LStr;
  faq: { q: LStr; a: LStr }[];
  citations: { label: LStr; url: string }[];
  dataNote: LStr;
}

export function getThemeContent(slug: ThemeSlug): ThemeContent {
  const raw = readFileSync(join(DATA_DIR, 'theme-content', `${slug}.json`), 'utf-8');
  return JSON.parse(raw) as ThemeContent;
}
