import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Sans_JP, Noto_Sans_SC } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://travel-weather-guide.github.io'),
  title: {
    default: 'Travel Weather - 여행하기 좋은 날씨, 한눈에',
    template: '%s | Travel Weather',
  },
  description: '전세계 여행지의 월별 날씨와 여행 적합도를 한눈에 확인하세요. 월별 추천 여행지, 기온·강수량, 베스트 시즌 정보. Best time to visit — monthly weather guide for travelers.',
  keywords: ['여행 날씨', '여행 적기', '월별 날씨', 'best time to visit', 'travel weather', '旅行天気', '旅行天气'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon.ico' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'Travel Weather',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${notoSansJP.variable} ${notoSansSC.variable} h-full antialiased`}>
      <head>
        <meta name="google-site-verification" content="Mudh050dbsNy8pzORbZVipbjCxy32V4Jxrg9capWvB4" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
        <link rel="preconnect" href="https://flagcdn.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
