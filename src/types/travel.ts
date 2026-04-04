import type { LocalizedString, LocalizedStringArray } from './index';

export interface TravelComment {
  regionId: string;
  month: number;
  rating: 1 | 2 | 3 | 4 | 5;
  summary: LocalizedString;
  highlights: LocalizedStringArray;
  cautions: LocalizedStringArray;
  events: LocalizedStringArray;
  tips: LocalizedStringArray;
  clothingAdvice: LocalizedString;
  crowdLevel: 'low' | 'medium' | 'high';
  priceLevel: 'low' | 'medium' | 'high';
}

export interface MonthlyRecommendation {
  month: number;
  bestDestinations: RecommendedDestination[];
  hiddenGems: RecommendedDestination[];
  avoidList: { regionId: string; reason: LocalizedString }[];
}

export interface RecommendedDestination {
  regionId: string;
  category: 'beach' | 'mountain' | 'city' | 'culture' | 'adventure' | 'ski';
  reason: LocalizedString;
  rating: number;
}
