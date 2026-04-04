'use client';

import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false });

export interface CountryMarker {
  id: string;
  name: string;
  flag: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  countries: CountryMarker[];
  countryNames: Record<string, string>;
  focusFilter?: string;
  boundPoints: [number, number][];
}

export default function MapView({ countries, countryNames, focusFilter, boundPoints }: MapViewProps) {
  return <WorldMap countries={countries} countryNames={countryNames} focusFilter={focusFilter} boundPoints={boundPoints} />;
}
