import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://travel-weather.pages.dev'),
  title: {
    default: 'Travel Weather - 여행하기 좋은 날씨, 한눈에',
    template: '%s | Travel Weather',
  },
  description: '전세계 여행지의 월별 날씨와 여행 적합도를 한눈에 확인하세요. 월별 추천 여행지, 기온·강수량, 베스트 시즌 정보.',
  openGraph: {
    siteName: 'Travel Weather',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
