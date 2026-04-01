'use client';

import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { href: '/', label: '홈' },
  { href: '/country', label: '국가 목록' },
  { href: '/map', label: '지도' },
  { href: '/compare', label: '비교' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="text-lg font-bold text-sky-600">
          Travel Weather
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-sky-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="메뉴 열기"
        >
          <span
            className={`block h-0.5 w-5 bg-gray-600 transition-transform ${isOpen ? 'translate-y-1.5 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 bg-gray-600 transition-opacity ${isOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 bg-gray-600 transition-transform ${isOpen ? '-translate-y-1.5 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <nav className="border-t border-border bg-white px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm font-medium text-gray-600 hover:text-sky-600"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
