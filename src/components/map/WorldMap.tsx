'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection } from 'geojson';
import type { Layer, LeafletMouseEvent } from 'leaflet';
import worldData from 'world-atlas/countries-110m.json';
import { numericToCountrySlug } from '@/utils/countryMapping';

interface RegionMarker {
  id: string;
  name: string;
  countryId: string;
  latitude: number;
  longitude: number;
}

interface WorldMapProps {
  regions: RegionMarker[];
  countryNames: Record<string, string>;
}

const DATA_FILL = { fillColor: '#0ea5e9', fillOpacity: 0.35, color: '#0284c7', weight: 1.5 };
const DATA_HOVER = { fillColor: '#0ea5e9', fillOpacity: 0.55, color: '#0369a1', weight: 2 };
const NO_DATA_FILL = { fillColor: '#d1d5db', fillOpacity: 0.3, color: '#9ca3af', weight: 0.5 };

export default function WorldMap({ regions, countryNames }: WorldMapProps) {
  const router = useRouter();
  const [mapReady, setMapReady] = useState(false);

  const countries = useMemo(() => {
    const topology = worldData as unknown as Topology;
    return feature(
      topology,
      topology.objects.countries as GeometryCollection,
    ) as unknown as FeatureCollection;
  }, []);

  function hasData(feat: Feature): boolean {
    return feat.id != null && numericToCountrySlug[String(feat.id)] != null;
  }

  function style(feat: Feature | undefined) {
    if (!feat) return NO_DATA_FILL;
    return hasData(feat) ? DATA_FILL : NO_DATA_FILL;
  }

  function onEachFeature(feat: Feature, layer: Layer) {
    const slug = feat.id != null ? numericToCountrySlug[String(feat.id)] : undefined;

    if (slug) {
      layer.bindTooltip(countryNames[slug] ?? slug, {
        sticky: true,
        className: 'map-country-tooltip',
      });

      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          e.target.setStyle(DATA_HOVER);
        },
        mouseout: (e: LeafletMouseEvent) => {
          e.target.setStyle(DATA_FILL);
        },
        click: () => {
          router.push(`/country/${slug}`);
        },
      });
    }
  }

  return (
    <div className="relative h-full w-full" style={{ minHeight: '400px' }}>
      {/* 타일 로딩 전 배경 */}
      {!mapReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-sky-50">
          <p className="text-sm text-gray-400">지도를 불러오는 중...</p>
        </div>
      )}

      <MapContainer
        center={[20, 20]}
        zoom={2}
        minZoom={2}
        maxZoom={7}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: '#f0f9ff' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://openfreemap.org">OpenFreeMap</a>'
          url="https://tiles.openfreemap.org/styles/positron/{z}/{x}/{y}.png"
        />

        <GeoJSON data={countries} style={style} onEachFeature={onEachFeature} />

        {regions.map((region) => (
          <CircleMarker
            key={`${region.countryId}-${region.id}`}
            center={[region.latitude, region.longitude]}
            radius={6}
            pathOptions={{
              fillColor: '#f97316',
              fillOpacity: 0.8,
              color: '#fff',
              weight: 2,
            }}
            eventHandlers={{
              click: () => {
                router.push(`/country/${region.countryId}/${region.id}`);
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              <span className="text-xs font-medium">{region.name}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
