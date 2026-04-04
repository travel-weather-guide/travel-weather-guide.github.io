'use client';

import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false });

interface RegionMarker {
  id: string;
  name: string;
  countryId: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  regions: RegionMarker[];
  countryNames: Record<string, string>;
  focusFilter?: string;
}

export default function MapView({ regions, countryNames, focusFilter }: MapViewProps) {
  return <WorldMap regions={regions} countryNames={countryNames} focusFilter={focusFilter} />;
}
