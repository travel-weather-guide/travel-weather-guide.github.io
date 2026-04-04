export type { Continent, Country, Region } from './country';
export type { MonthlyData } from './weather';
export type {
  TravelComment,
  MonthlyRecommendation,
  RecommendedDestination,
} from './travel';

export type LocalizedString =
  | string
  | { ko: string; en: string; ja?: string; zh?: string };

export type LocalizedStringArray =
  | string[]
  | { ko: string[]; en: string[]; ja?: string[]; zh?: string[] };
