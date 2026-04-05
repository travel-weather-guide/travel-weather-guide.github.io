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
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-base font-semibold text-gray-900">{summary}</p>

      {/* Clothing */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t(messages.travel.clothing, locale)}</p>
        <p className="mt-1 text-sm text-gray-700">{clothingAdvice}</p>
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{t(messages.travel.highlights, locale)}</p>
          <ul className="mt-1 space-y-1">
            {highlights.map((h, i) => (
              <li key={i} className="text-sm text-gray-700">
                <span className="text-emerald-500 mr-1">✦</span>{h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cautions */}
      {cautions.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{t(messages.travel.cautions, locale)}</p>
          <ul className="mt-1 space-y-1">
            {cautions.map((c, i) => (
              <li key={i} className="text-sm text-gray-700">
                <span className="text-orange-500 mr-1">▲</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">{t(messages.travel.tips, locale)}</p>
          <ul className="mt-1 space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm text-gray-700">
                <span className="text-sky-500 mr-1">→</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Crowd / Price */}
      <div className="rounded-xl bg-slate-50 p-3 flex gap-6 text-sm text-gray-500">
        <span>{t(messages.crowd.label, locale)}: {t(messages.crowd[comment.crowdLevel], locale)}</span>
        <span>{t(messages.price.label, locale)}: {t(messages.price[comment.priceLevel], locale)}</span>
      </div>
    </div>
  );
}
