'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection } from 'geojson';
import type { Layer, LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
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
  focusFilter?: string;
}

const DATA_FILL = { fillColor: '#0ea5e9', fillOpacity: 0.25, color: 'transparent', weight: 0 };
const DATA_HOVER = { fillColor: '#0ea5e9', fillOpacity: 0.45, color: 'transparent', weight: 0 };
const NO_DATA_FILL = { fillColor: 'transparent', fillOpacity: 0, color: 'transparent', weight: 0 };

function FitBounds({ regions, focusFilter }: { regions: RegionMarker[]; focusFilter?: string }) {
  const map = useMap();
  useEffect(() => {
    if (regions.length === 0) return;
    const bounds = L.latLngBounds(regions.map((r) => [r.latitude, r.longitude]));
    map.fitBounds(bounds.pad(0.3));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (regions.length === 0) return;
    const bounds = L.latLngBounds(regions.map((r) => [r.latitude, r.longitude]));
    map.flyToBounds(bounds.pad(0.3), { duration: 0.8, maxZoom: 5 });
  }, [map, regions, focusFilter]);
  return null;
}

export default function WorldMap({ regions, countryNames, focusFilter }: WorldMapProps) {
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
        permanent: true,
        direction: 'center',
        className: 'map-country-label',
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
      <style>{`
        .map-country-label {
          background: none !important;
          border: none !important;
          box-shadow: none !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          color: #0369a1 !important;
          text-shadow: 0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff;
        }
        .map-region-label {
          background: rgba(255,255,255,0.85) !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          padding: 1px 6px !important;
          border-radius: 4px !important;
          font-size: 10px !important;
        }
      `}</style>
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

        <FitBounds regions={regions} focusFilter={focusFilter} />
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
            <Tooltip direction="top" offset={[0, -8]} permanent className="map-region-label">
              <span className="text-xs font-medium">{region.name}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
