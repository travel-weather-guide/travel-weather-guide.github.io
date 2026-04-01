const ratingConfig: Record<number, { label: string; color: string }> = {
  5: { label: '최적', color: 'bg-green-500' },
  4: { label: '좋음', color: 'bg-sky-500' },
  3: { label: '보통', color: 'bg-yellow-400' },
  2: { label: '비추', color: 'bg-orange-400' },
  1: { label: '부적합', color: 'bg-red-400' },
};

interface TravelRatingProps {
  month: number;
  rating: number;
  summary: string;
}

export default function TravelRating({ month, rating, summary }: TravelRatingProps) {
  const config = ratingConfig[rating] ?? ratingConfig[3];

  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-sm font-medium text-gray-700">{month}월</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-3 w-6 rounded-sm ${n <= rating ? config.color : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-500">{config.label}</span>
      <span className="text-sm text-gray-600">{summary}</span>
    </div>
  );
}
