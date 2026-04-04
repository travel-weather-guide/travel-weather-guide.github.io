'use client';

import type { TravelComment } from '@/types';
import { resolveLocalizedString, resolveLocalizedStringArray } from '@/utils/data';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

interface TravelTipsProps {
  comment: TravelComment;
}

export default function TravelTips({ comment }: TravelTipsProps) {
  const { locale } = useLocale();

  const summary = resolveLocalizedString(comment.summary, locale);
  const clothingAdvice = resolveLocalizedString(comment.clothingAdvice, locale);
  const highlights = resolveLocalizedStringArray(comment.highlights, locale);
  const cautions = resolveLocalizedStringArray(comment.cautions, locale);
  const tips = resolveLocalizedStringArray(comment.tips, locale);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4">
      <p className="font-semibold text-gray-900">{summary}</p>

      {/* 옷차림 */}
      <div>
        <p className="text-xs font-medium text-gray-500">{t(messages.travel.clothing, locale)}</p>
        <p className="text-sm text-gray-700">{clothingAdvice}</p>
      </div>

      {/* 좋은 점 */}
      {highlights.length > 0 && (
        <div>
          <p className="text-xs font-medium text-green-600">{t(messages.travel.highlights, locale)}</p>
          <ul className="mt-1 space-y-1">
            {highlights.map((h, i) => (
              <li key={i} className="text-sm text-gray-700">+ {h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 주의사항 */}
      {cautions.length > 0 && (
        <div>
          <p className="text-xs font-medium text-orange-600">{t(messages.travel.cautions, locale)}</p>
          <ul className="mt-1 space-y-1">
            {cautions.map((c, i) => (
              <li key={i} className="text-sm text-gray-700">! {c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 팁 */}
      {tips.length > 0 && (
        <div>
          <p className="text-xs font-medium text-sky-600">{t(messages.travel.tips, locale)}</p>
          <ul className="mt-1 space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm text-gray-700">- {tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 밀집도 / 물가 */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span>{t(messages.crowd.label, locale)}: {t(messages.crowd[comment.crowdLevel], locale)}</span>
        <span>{t(messages.price.label, locale)}: {t(messages.price[comment.priceLevel], locale)}</span>
      </div>
    </div>
  );
}
