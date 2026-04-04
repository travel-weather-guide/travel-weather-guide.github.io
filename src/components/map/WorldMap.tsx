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
import type { CountryMarker } from './MapView';

interface WorldMapProps {
  countries: CountryMarker[];
  countryNames: Record<string, string>;
  focusFilter?: string;
  boundPoints: [number, number][];
}

const DATA_FILL = { fillColor: '#0ea5e9', fillOpacity: 0.25, color: 'transparent', weight: 0 };
const DATA_HOVER = { fillColor: '#0ea5e9', fillOpacity: 0.45, color: 'transparent', weight: 0 };
const NO_DATA_FILL = { fillColor: 'transparent', fillOpacity: 0, color: 'transparent', weight: 0 };

function FitBounds({ boundPoints, focusFilter }: { boundPoints: [number, number][]; focusFilter?: string }) {
  const map = useMap();
  useEffect(() => {
    map.setView([25, 20], 2);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (!focusFilter || focusFilter === 'all') {
      map.flyTo([25, 20], 2, { duration: 0.8 });
      return;
    }
    if (boundPoints.length === 0) return;
    const bounds = L.latLngBounds(boundPoints);
    const pad = focusFilter === 'asia' ? 0.1 : 0.3;
    map.flyToBounds(bounds.pad(pad), { duration: 0.8, maxZoom: 5 });
  }, [map, boundPoints, focusFilter]);
  return null;
}

const isAll = (f?: string) => !f || f === 'all';

export default function WorldMap({ countries, countryNames, focusFilter, boundPoints }: WorldMapProps) {
  const router = useRouter();
  const [mapReady, setMapReady] = useState(false);

  const geoData = useMemo(() => {
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
      layer.on({
        mouseover: (e: LeafletMouseEvent) => { e.target.setStyle(DATA_HOVER); },
        mouseout: (e: LeafletMouseEvent) => { e.target.setStyle(DATA_FILL); },
        click: () => { router.push(`/country/${slug}`); },
      });
    }
  }

  return (
    <div className="relative h-full w-full" style={{ minHeight: '280px' }}>
      <style>{`
        .map-country-label {
          background: rgba(255,255,255,0.85) !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          padding: 1px 6px !important;
          border-radius: 4px !important;
          font-size: 10px !important;
          font-weight: 600 !important;
        }
      `}</style>

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

        <FitBounds boundPoints={boundPoints} focusFilter={focusFilter} />
        <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />

        {countries.map((c) => (
          <CircleMarker
            key={c.id}
            center={[c.latitude, c.longitude]}
            radius={6}
            pathOptions={{
              fillColor: '#f97316',
              fillOpacity: 0.8,
              color: '#fff',
              weight: 2,
            }}
            eventHandlers={{
              click: () => { router.push(`/country/${c.id}`); },
            }}
          >
            {!isAll(focusFilter) && (
              <Tooltip direction="top" offset={[0, -8]} permanent className="map-country-label">
                <span className="text-xs font-medium">{c.name}</span>
              </Tooltip>
            )}
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
