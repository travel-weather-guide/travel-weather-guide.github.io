'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Locale = 'ko' | 'en' | 'ja' | 'zh';

const SUPPORTED_LOCALES: Locale[] = ['ko', 'en', 'ja', 'zh'];
const STORAGE_KEY = 'preferred-locale';
const DEFAULT_LOCALE: Locale = 'ko';

function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  const candidates =
    navigator.languages?.length > 0
      ? Array.from(navigator.languages)
      : navigator.language
        ? [navigator.language]
        : [];

  for (const lang of candidates) {
    const lower = lang.toLowerCase();
    if (lower.startsWith('ko')) return 'ko';
    if (lower.startsWith('ja')) return 'ja';
    if (lower.startsWith('zh')) return 'zh';
  }

  return 'en';
}

function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (SUPPORTED_LOCALES as string[]).includes(stored)) {
    return stored as Locale;
  }

  return detectBrowserLocale();
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
});

export function LocaleProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  useEffect(() => {
    if (initialLocale) {
      document.documentElement.lang = initialLocale;
      return;
    }
    const initial = resolveInitialLocale();
    // 정적 export라 서버는 기본 로케일로 렌더 → 클라이언트 마운트 후 저장된 로케일로 동기화.
    // 초기값을 localStorage로 바로 잡으면 하이드레이션 불일치가 나므로 effect가 올바른 패턴.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(initial);
    document.documentElement.lang = initial;
  }, [initialLocale]);

  function setLocale(next: Locale) {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
    document.documentElement.lang = next;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
