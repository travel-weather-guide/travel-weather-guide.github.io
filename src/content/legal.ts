/**
 * Editorial content for trust / legal pages (/legal/[doc]).
 *
 * These pages exist for transparency and E-E-A-T trust signals, and to satisfy
 * the prerequisites ad networks (e.g. Google AdSense) require before approval.
 *
 * Content reflects the site's ACTUAL current behavior: static export, no
 * server-side data collection, no analytics, no first-party cookies. Only
 * browser localStorage (language preference + recently-viewed list) is used,
 * and it never leaves the device.
 *
 * ⚠️ CONTACT_EMAIL is a placeholder — replace with a real address before relying
 *    on these pages for AdSense submission. Publishing a contact route without a
 *    working address can fail review.
 */
import type { Locale } from '@/contexts/LocaleContext';

/** TODO(owner): replace with a real, monitored contact address. */
export const CONTACT_EMAIL = 'your-email@example.com';

/** Last updated — bump when content materially changes. */
export const LEGAL_EFFECTIVE_DATE = '2026-06-07';

export const LEGAL_DOCS = ['privacy', 'about', 'contact'] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];

export function isLegalDoc(s: string): s is LegalDoc {
  return (LEGAL_DOCS as readonly string[]).includes(s);
}

type LStr = Record<Locale, string>;
interface Section {
  heading: LStr;
  body: Record<Locale, string[]>;
}
export interface DocContent {
  slug: LegalDoc;
  title: LStr;
  metaDescription: LStr;
  intro: Record<Locale, string[]>;
  sections: Section[];
}

export const LEGAL_NAMES: Record<LegalDoc, LStr> = {
  privacy: { ko: '개인정보처리방침', en: 'Privacy Policy', ja: 'プライバシーポリシー', zh: '隐私政策' },
  about: { ko: '사이트 소개', en: 'About', ja: 'サイトについて', zh: '关于本站' },
  contact: { ko: '문의', en: 'Contact', ja: 'お問い合わせ', zh: '联系我们' },
};

export const LEGAL_CONTENT: Record<LegalDoc, DocContent> = {
  privacy: {
    slug: 'privacy',
    title: LEGAL_NAMES.privacy,
    metaDescription: {
      ko: 'Travel Weather 개인정보처리방침 — 수집하는 정보, 브라우저 저장소 사용, 제3자 서비스에 대한 안내.',
      en: 'Travel Weather Privacy Policy — what we collect, how browser storage is used, and third-party services.',
      ja: 'Travel Weather プライバシーポリシー — 収集する情報、ブラウザストレージの利用、第三者サービスについて。',
      zh: 'Travel Weather 隐私政策 — 我们收集的信息、浏览器存储的使用以及第三方服务说明。',
    },
    intro: {
      ko: [
        'Travel Weather(이하 "본 사이트")는 이용자의 개인정보를 소중히 여깁니다. 본 사이트는 별도의 서버 없이 정적 페이지로 제공되며, 회원가입이나 로그인 기능이 없습니다.',
      ],
      en: [
        'Travel Weather ("the Site") respects your privacy. The Site is served as static pages without a backend server, and has no sign-up or login.',
      ],
      ja: [
        'Travel Weather（以下「本サイト」）は利用者のプライバシーを尊重します。本サイトはサーバーを持たない静的ページとして提供され、会員登録やログイン機能はありません。',
      ],
      zh: [
        'Travel Weather（以下简称「本站」）尊重您的隐私。本站以静态页面形式提供，没有后端服务器，也没有注册或登录功能。',
      ],
    },
    sections: [
      {
        heading: { ko: '수집하는 정보', en: 'Information We Collect', ja: '収集する情報', zh: '我们收集的信息' },
        body: {
          ko: [
            '본 사이트는 이름, 이메일, 위치 등 어떠한 개인정보도 서버에서 수집하거나 저장하지 않습니다.',
            '다만 이용 편의를 위해 브라우저의 로컬 저장소(localStorage)에 다음 정보를 저장합니다: 선택한 언어 설정, 최근 살펴본 지역 목록. 이 정보는 이용자의 기기에만 저장되며 외부로 전송되지 않습니다. 브라우저 설정에서 언제든 삭제할 수 있습니다.',
          ],
          en: [
            'The Site does not collect or store any personal data such as your name, email, or location on any server.',
            'For convenience, your browser stores the following in localStorage: your selected language and your recently-viewed destinations. This stays on your device, is never transmitted anywhere, and can be cleared anytime via your browser settings.',
          ],
          ja: [
            '本サイトは氏名・メール・位置情報など、いかなる個人情報もサーバーで収集・保存しません。',
            '利便性のため、ブラウザのローカルストレージ（localStorage）に「選択した言語設定」と「最近見た地域の一覧」を保存します。これは端末内にのみ保存され、外部に送信されません。ブラウザ設定からいつでも削除できます。',
          ],
          zh: [
            '本站不会在任何服务器上收集或存储您的姓名、邮箱、位置等任何个人信息。',
            '为方便使用，浏览器会在 localStorage 中保存：您选择的语言以及最近浏览的目的地列表。这些数据仅保存在您的设备上，不会被传输到任何地方，您可随时通过浏览器设置清除。',
          ],
        },
      },
      {
        heading: { ko: '쿠키', en: 'Cookies', ja: 'クッキー', zh: 'Cookie' },
        body: {
          ko: ['본 사이트는 자체적인 추적 쿠키나 분석 도구(예: Google Analytics)를 사용하지 않습니다.'],
          en: ['The Site does not use its own tracking cookies or analytics tools (such as Google Analytics).'],
          ja: ['本サイトは独自のトラッキングクッキーや分析ツール（Google Analyticsなど）を使用していません。'],
          zh: ['本站不使用自有的跟踪 Cookie 或分析工具（如 Google Analytics）。'],
        },
      },
      {
        heading: { ko: '제3자 서비스 및 외부 콘텐츠', en: 'Third-Party Services & External Content', ja: '第三者サービスと外部コンテンツ', zh: '第三方服务与外部内容' },
        body: {
          ko: [
            '본 사이트는 기후 데이터를 Open-Meteo에서, 국가 기본 정보를 REST Countries에서 받아오며, 국기 이미지를 외부 CDN에서 불러옵니다. 이들 서비스는 콘텐츠 제공 목적으로만 사용됩니다.',
            '현재 본 사이트에는 광고가 게재되어 있지 않습니다. 향후 광고가 도입될 경우 Google 등 제3자 광고 사업자가 쿠키를 사용할 수 있으며, 그 시점에 본 방침을 업데이트하여 명확히 고지하겠습니다.',
          ],
          en: [
            'The Site fetches climate data from Open-Meteo, country facts from REST Countries, and flag images from an external CDN. These are used solely to provide content.',
            'The Site currently displays no advertising. If advertising is introduced later, third-party ad vendors such as Google may use cookies; this policy will be updated to disclose that clearly at that time.',
          ],
          ja: [
            '本サイトは気候データをOpen-Meteoから、国の基本情報をREST Countriesから取得し、国旗画像を外部CDNから読み込みます。これらはコンテンツ提供のみに使用されます。',
            '現在、本サイトに広告は掲載されていません。今後広告を導入する場合、Googleなどの第三者広告事業者がクッキーを使用する可能性があり、その際は本方針を更新して明確にお知らせします。',
          ],
          zh: [
            '本站从 Open-Meteo 获取气候数据，从 REST Countries 获取国家基本信息，并从外部 CDN 加载国旗图片。这些仅用于提供内容。',
            '本站目前不展示任何广告。若日后引入广告，Google 等第三方广告服务商可能会使用 Cookie；届时我们将更新本政策并予以明确说明。',
          ],
        },
      },
      {
        heading: { ko: '방침 변경 및 문의', en: 'Changes & Contact', ja: '方針の変更とお問い合わせ', zh: '政策变更与联系' },
        body: {
          ko: [
            '본 방침은 필요 시 개정될 수 있으며, 변경 시 본 페이지에 시행일과 함께 게시합니다.',
            `개인정보 관련 문의는 ${CONTACT_EMAIL} 로 연락해 주세요.`,
          ],
          en: [
            'This policy may be revised; changes will be posted on this page with an effective date.',
            `For privacy inquiries, contact ${CONTACT_EMAIL}.`,
          ],
          ja: [
            '本方針は必要に応じて改定されることがあり、変更時は施行日とともに本ページに掲載します。',
            `プライバシーに関するお問い合わせは ${CONTACT_EMAIL} までご連絡ください。`,
          ],
          zh: [
            '本政策可能会修订，变更时将连同生效日期发布于本页面。',
            `如有隐私相关问题，请联系 ${CONTACT_EMAIL}。`,
          ],
        },
      },
    ],
  },

  about: {
    slug: 'about',
    title: LEGAL_NAMES.about,
    metaDescription: {
      ko: 'Travel Weather 소개 — 여행자를 위한 전세계 월별 날씨·여행 적기 가이드. 데이터 출처와 운영 철학.',
      en: 'About Travel Weather — a worldwide monthly weather and best-time-to-visit guide for travelers. Our data sources and approach.',
      ja: 'Travel Weatherについて — 旅行者のための世界各地の月別天気・ベストシーズンガイド。データ出典と運営方針。',
      zh: '关于 Travel Weather — 为旅行者打造的全球逐月天气与最佳旅行时间指南。数据来源与运营理念。',
    },
    intro: {
      ko: [
        'Travel Weather는 "몇 월에 어디로 가면 좋을까?"라는 여행자의 고민에 답하기 위해 만든 날씨·여행 적기 가이드입니다. 단순한 기상 정보가 아니라, 여행자 관점에서 각 목적지의 월별 날씨를 해석해 보여줍니다.',
      ],
      en: [
        'Travel Weather is a weather and best-time-to-visit guide built to answer one traveler question: "Which month should I go where?" Rather than raw forecasts, it interprets each destination\'s monthly climate from a traveler\'s point of view.',
      ],
      ja: [
        'Travel Weatherは「何月にどこへ行けばいい？」という旅行者の悩みに答えるために作られた、天気・ベストシーズンガイドです。単なる気象情報ではなく、旅行者の視点で各目的地の月別の天気を読み解いて示します。',
      ],
      zh: [
        'Travel Weather 是一个为回答旅行者「几月去哪里好？」而打造的天气与最佳旅行时间指南。它不是单纯的天气预报，而是从旅行者的角度解读各目的地的逐月气候。',
      ],
    },
    sections: [
      {
        heading: { ko: '무엇을 제공하나요', en: 'What We Provide', ja: '提供する内容', zh: '我们提供什么' },
        body: {
          ko: [
            '전세계 주요 여행지의 월별 기온·강수량·습도·일조시간·바다 수온 데이터, 그리고 "비 안 오는 여행지", "겨울 따뜻한 곳", "여름 시원한 곳" 같은 테마별 큐레이션을 제공합니다.',
          ],
          en: [
            'Monthly temperature, rainfall, humidity, sunshine, and sea-temperature data for major destinations worldwide, plus themed curations such as driest destinations, warm winter escapes, and cool-summer getaways.',
          ],
          ja: [
            '世界の主要旅行先の月別気温・降水量・湿度・日照時間・海水温データに加え、「雨が少ない旅行先」「冬が暖かい場所」「夏が涼しい場所」といったテーマ別キュレーションを提供します。',
          ],
          zh: [
            '提供全球主要目的地的逐月气温、降水量、湿度、日照与海水温度数据，以及「少雨目的地」「温暖过冬」「清凉避暑」等主题精选。',
          ],
        },
      },
      {
        heading: { ko: '데이터 출처', en: 'Data Sources', ja: 'データ出典', zh: '数据来源' },
        body: {
          ko: [
            '기후 데이터는 Open-Meteo의 과거 기후 데이터(CC BY 4.0)를, 국가 기본 정보는 REST Countries를 사용합니다.',
            '표시되는 수치는 과거 평년값을 기반으로 한 것으로 실시간 예보가 아닙니다. 실제 날씨는 해마다 다를 수 있으니 참고용으로 활용해 주세요.',
          ],
          en: [
            'Climate figures come from Open-Meteo historical data (CC BY 4.0); country facts come from REST Countries.',
            'The numbers are based on historical averages, not real-time forecasts. Actual weather varies year to year, so please use them as a reference.',
          ],
          ja: [
            '気候データはOpen-Meteoの過去の気候データ（CC BY 4.0）を、国の基本情報はREST Countriesを使用しています。',
            '表示される数値は過去の平年値に基づくもので、リアルタイムの予報ではありません。実際の天気は年によって異なるため、参考としてご利用ください。',
          ],
          zh: [
            '气候数据来自 Open-Meteo 历史数据（CC BY 4.0），国家基本信息来自 REST Countries。',
            '所示数值基于历史平均值，并非实时预报。实际天气逐年不同，请作为参考使用。',
          ],
        },
      },
    ],
  },

  contact: {
    slug: 'contact',
    title: LEGAL_NAMES.contact,
    metaDescription: {
      ko: 'Travel Weather 문의 — 데이터 오류 제보, 제안, 협업 문의 안내.',
      en: 'Contact Travel Weather — report data errors, send suggestions, or reach out about collaboration.',
      ja: 'Travel Weather お問い合わせ — データの誤り報告、ご提案、協業のお問い合わせ。',
      zh: '联系 Travel Weather — 报告数据错误、提出建议或洽谈合作。',
    },
    intro: {
      ko: [
        '본 사이트에 대한 의견, 데이터 오류 제보, 제안은 언제든 환영합니다.',
      ],
      en: [
        'Feedback, data-error reports, and suggestions about the Site are always welcome.',
      ],
      ja: [
        '本サイトへのご意見、データの誤りのご報告、ご提案はいつでも歓迎します。',
      ],
      zh: [
        '欢迎随时对本站提出意见、报告数据错误或提供建议。',
      ],
    },
    sections: [
      {
        heading: { ko: '연락 방법', en: 'How to Reach Us', ja: '連絡方法', zh: '联系方式' },
        body: {
          ko: [
            `이메일: ${CONTACT_EMAIL}`,
            '특정 도시의 날씨 수치가 실제와 크게 다르다고 느끼시면 도시명과 함께 알려 주세요. 데이터 출처를 다시 확인하겠습니다.',
          ],
          en: [
            `Email: ${CONTACT_EMAIL}`,
            "If a city's figures seem far off from reality, let us know the city name and we'll re-check the data source.",
          ],
          ja: [
            `メール: ${CONTACT_EMAIL}`,
            '特定の都市の数値が実際と大きく異なると感じた場合は、都市名とともにお知らせください。データ出典を再確認します。',
          ],
          zh: [
            `邮箱：${CONTACT_EMAIL}`,
            '如果您觉得某城市的数值与实际差距较大，请告知城市名称，我们将重新核对数据来源。',
          ],
        },
      },
    ],
  },
};
