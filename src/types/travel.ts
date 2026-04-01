export interface TravelComment {
  regionId: string;
  month: number;
  rating: 1 | 2 | 3 | 4 | 5;
  summary: string;
  highlights: string[];
  cautions: string[];
  events: string[];
  tips: string[];
  clothingAdvice: string;
  crowdLevel: 'low' | 'medium' | 'high';
  priceLevel: 'low' | 'medium' | 'high';
}

export interface MonthlyRecommendation {
  month: number;
  bestDestinations: RecommendedDestination[];
  hiddenGems: RecommendedDestination[];
  avoidList: { regionId: string; reason: string }[];
}

export interface RecommendedDestination {
  regionId: string;
  category: 'beach' | 'mountain' | 'city' | 'culture' | 'adventure' | 'ski';
  reason: string;
  rating: number;
}
