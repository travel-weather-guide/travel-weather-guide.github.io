import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '국가별 여행 날씨 — Travel Weather by Country',
  description: '세계지도에서 여행지를 탐색하고 국가별 월별 날씨, 여행 적합도를 확인하세요. Explore travel destinations on the world map — monthly weather and best time to visit by country.',
  alternates: { canonical: '/country' },
};

export default function CountryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
