import Link from 'next/link';

interface DestinationCardProps {
  regionId: string;
  countryId: string;
  regionName: string;
  rating: number;
  reason: string;
  tempHigh?: number;
  tempLow?: number;
  weatherSummary?: string;
}

const ratingLabels: Record<number, { text: string; color: string }> = {
  5: { text: '최적', color: 'bg-green-100 text-green-700' },
  4: { text: '좋음', color: 'bg-sky-100 text-sky-700' },
  3: { text: '보통', color: 'bg-yellow-100 text-yellow-700' },
  2: { text: '비추', color: 'bg-orange-100 text-orange-700' },
  1: { text: '부적합', color: 'bg-red-100 text-red-700' },
};

export default function DestinationCard({
  regionId,
  countryId,
  regionName,
  rating,
  reason,
  tempHigh,
  tempLow,
  weatherSummary,
}: DestinationCardProps) {
  const r = ratingLabels[rating] ?? ratingLabels[3];

  return (
    <Link
      href={`/country/${countryId}/${regionId}`}
      className="block rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900">{regionName}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.color}`}>
          {r.text}
        </span>
      </div>

      {tempHigh != null && tempLow != null && (
        <p className="mt-2 text-2xl font-bold text-gray-800">
          {tempLow}° <span className="text-sm font-normal text-gray-400">~</span> {tempHigh}°
        </p>
      )}

      {weatherSummary && (
        <p className="mt-1 text-xs text-gray-500">{weatherSummary}</p>
      )}

      <p className="mt-2 text-sm text-gray-600">{reason}</p>
    </Link>
  );
}
