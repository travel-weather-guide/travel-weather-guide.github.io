export interface MonthlyData {
  month: number;
  tempHigh: number;
  tempLow: number;
  rainfall: number;
  rainyDays: number;
  humidity: number;
  sunshineHours: number;
  seaTemp?: number;
  weatherSummary: string | { ko: string; en: string; ja?: string; zh?: string };
}
