import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '국가별 여행 날씨 · 월간날씨 — Travel Weather by Country',
  description: '세계지도에서 여행지를 탐색하고 국가별 월간날씨와 과거 기후 데이터를 확인하세요. 43개국 114개 도시의 월별 기온·강수량·여행 적기 정보. Explore monthly weather & climate data by country.',
  alternates: { canonical: '/country' },
};

export default function CountryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
