import Link from 'next/link';
import type { Region } from '@/types';

interface RegionListProps {
  countryId: string;
  regions: Region[];
}

export default function RegionList({ countryId, regions }: RegionListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {regions.map((region) => {
        const currentMonth = new Date().getMonth(); // 0-based
        const data = region.monthlyData[currentMonth];
        return (
          <Link
            key={region.id}
            href={`/country/${countryId}/${region.id}`}
            className="rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
          >
            <h3 className="font-semibold text-gray-900">{region.name.ko}</h3>
            <p className="text-sm text-gray-500">{region.climateType}</p>
            {data && (
              <p className="mt-2 text-sm text-gray-600">
                현재 {data.tempLow}°~{data.tempHigh}° · {data.weatherSummary}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
