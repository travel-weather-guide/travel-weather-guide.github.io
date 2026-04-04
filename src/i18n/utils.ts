import type { Locale } from '@/contexts/LocaleContext';

/**
 * Look up a translation key from a messages object for the given locale.
 * Falls back to 'en', then 'ko' if the key is missing for the requested locale.
 */
export function t(
  messages: Partial<Record<Locale, string>>,
  locale: Locale,
): string {
  return messages[locale] ?? messages['en'] ?? messages['ko'] ?? '';
}

interface LocalizedName {
  ko: string;
  en: string;
  ja?: string;
  zh?: string;
}

/**
 * Return the name for the given locale, falling back to 'en' then 'ko'.
 */
export function getLocalizedName(nameObj: LocalizedName, locale: Locale): string {
  return nameObj[locale] ?? nameObj['en'] ?? nameObj['ko'];
}
