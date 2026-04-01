import type { TravelComment } from '@/types';

interface TravelTipsProps {
  comment: TravelComment;
}

export default function TravelTips({ comment }: TravelTipsProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4">
      <p className="font-semibold text-gray-900">{comment.summary}</p>

      {/* 옷차림 */}
      <div>
        <p className="text-xs font-medium text-gray-500">옷차림</p>
        <p className="text-sm text-gray-700">{comment.clothingAdvice}</p>
      </div>

      {/* 좋은 점 */}
      {comment.highlights.length > 0 && (
        <div>
          <p className="text-xs font-medium text-green-600">좋은 점</p>
          <ul className="mt-1 space-y-1">
            {comment.highlights.map((h, i) => (
              <li key={i} className="text-sm text-gray-700">+ {h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 주의사항 */}
      {comment.cautions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-orange-600">주의사항</p>
          <ul className="mt-1 space-y-1">
            {comment.cautions.map((c, i) => (
              <li key={i} className="text-sm text-gray-700">! {c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 팁 */}
      {comment.tips.length > 0 && (
        <div>
          <p className="text-xs font-medium text-sky-600">여행 팁</p>
          <ul className="mt-1 space-y-1">
            {comment.tips.map((t, i) => (
              <li key={i} className="text-sm text-gray-700">- {t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 밀집도 / 물가 */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span>관광객: {{ low: '한산', medium: '보통', high: '혼잡' }[comment.crowdLevel]}</span>
        <span>물가: {{ low: '저렴', medium: '보통', high: '비쌈' }[comment.priceLevel]}</span>
      </div>
    </div>
  );
}
