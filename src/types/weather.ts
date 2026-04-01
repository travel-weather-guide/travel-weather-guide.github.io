export interface MonthlyData {
  month: number;
  tempHigh: number;
  tempLow: number;
  rainfall: number;
  rainyDays: number;
  humidity: number;
  sunshineHours: number;
  uvIndex: number;
  seaTemp?: number;
  weatherSummary: string;
}
