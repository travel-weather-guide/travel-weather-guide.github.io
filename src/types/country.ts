export type Continent =
  | 'asia'
  | 'europe'
  | 'north-america'
  | 'south-america'
  | 'africa'
  | 'oceania';

export interface Country {
  id: string;
  name: { ko: string; en: string; ja?: string; zh?: string };
  continent: Continent;
  capital: string;
  currency: string;
  language: string;
  timezone: string;
  visaInfo: string;
  imageUrl?: string;
  regions: Region[];
}

export interface Region {
  id: string;
  name: { ko: string; en: string; ja?: string; zh?: string };
  countryId: string;
  latitude: number;
  longitude: number;
  climateType: string | { ko: string; en: string; ja?: string; zh?: string };
  monthlyData: import('./weather').MonthlyData[];
}
