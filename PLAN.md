# Travel Weather - 구현 플랜

> 이 파일은 Claude Code가 참조하는 구현 계획서입니다.
> 각 스텝을 순서대로 진행하며, 완료 시 `[x]`로 체크합니다.
> CLAUDE.md가 프로젝트의 단일 진실 소스이며, 이 플랜은 실행 순서를 정의합니다.

---

## Phase 1: 기반 구축 (MVP)

### Step 1.1: 프로젝트 초기화

- [ ] Next.js 15+ 프로젝트 생성 (App Router, TypeScript strict, `src/` 디렉토리)
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-npm
  ```
- [ ] Tailwind CSS v4 설정 확인 및 조정
- [ ] `tsconfig.json` strict 모드 활성화 확인
- [ ] Prettier 설치 및 `.prettierrc` 설정
- [ ] 디렉토리 구조 생성
  ```
  src/
  ├── app/                    # Next.js App Router 페이지
  ├── components/             # 재사용 컴포넌트
  │   ├── layout/             # Header, Footer, Navigation
  │   ├── weather/            # 날씨 관련 컴포넌트
  │   ├── country/            # 국가/지역 관련 컴포넌트
  │   └── common/             # 공통 UI 컴포넌트
  ├── data/                   # 정적 JSON 데이터
  ├── types/                  # TypeScript 타입 정의
  ├── utils/                  # 유틸리티 함수
  └── styles/                 # 글로벌 스타일
  scripts/                    # 데이터 생성 스크립트
  public/
  └── icons/                  # 날씨 아이콘 (Meteocons)
  ```
- [ ] 한글 폰트 설정 (Pretendard 또는 Noto Sans KR) - `next/font` 사용
- [ ] 기본 레이아웃 (`src/app/layout.tsx`) - Header, Footer 포함
- [ ] 글로벌 CSS 변수 정의 (색상 팔레트: 하늘색/코랄 계열)

**완료 기준**: `npm run dev`로 빈 페이지가 정상 렌더링, 폰트 적용 확인

---

### Step 1.2: TypeScript 타입 정의

- [ ] `src/types/country.ts` - Country, Region 인터페이스
- [ ] `src/types/weather.ts` - MonthlyData 인터페이스
- [ ] `src/types/travel.ts` - TravelComment, MonthlyRecommendation, RecommendedDestination 인터페이스
- [ ] `src/types/index.ts` - 모든 타입 re-export
- [ ] Continent 타입 정의 (`"asia" | "europe" | "north-america" | "south-america" | "africa" | "oceania"`)

**참조**: CLAUDE.md "데이터 구조 (초안)" 섹션의 인터페이스를 그대로 사용

**완료 기준**: 모든 타입이 정의되고 `tsc --noEmit` 통과

---

### Step 1.3: 초기 데이터 입력 (주요 20~30개국)

#### Step 1.3.1: 데이터 수집 스크립트 작성

- [ ] `scripts/fetch-climate-data.ts` - Open-Meteo Historical API에서 기후 데이터 수집
  - 입력: 지역별 위도/경도 목록
  - 출력: 월별 평균 기온, 강수량, 습도, 일조시간
  - 최근 10년 데이터의 월별 평균으로 계산
- [ ] `scripts/fetch-sea-temp.ts` - Open-Meteo Marine API에서 바다 수온 수집 (해안 지역만)
- [ ] `scripts/fetch-country-info.ts` - REST Countries API에서 국가 기본정보 수집
- [ ] `scripts/generate-data.ts` - 위 스크립트들을 통합 실행하여 최종 JSON 생성
- [ ] `scripts/regions.ts` - 수집 대상 국가/지역 목록 정의 (좌표 포함)

#### Step 1.3.2: 대상 국가/지역 목록 (20~30개국, 60~90개 지역)

아시아:
- 일본 (도쿄, 오사카, 오키나와, 홋카이도)
- 태국 (방콕, 치앙마이, 푸켓)
- 베트남 (하노이, 호치민, 다낭)
- 인도네시아 (발리, 자카르타)
- 필리핀 (마닐라, 세부, 보라카이)
- 말레이시아 (쿠알라룸푸르, 코타키나발루)
- 싱가포르
- 대만 (타이베이)
- 몽골 (울란바토르)

유럽:
- 프랑스 (파리, 니스)
- 이탈리아 (로마, 밀라노, 베네치아)
- 스페인 (마드리드, 바르셀로나)
- 영국 (런던)
- 그리스 (아테네, 산토리니)
- 터키 (이스탄불, 카파도키아)
- 크로아티아 (두브로브니크)
- 스위스 (취리히, 인터라켄)
- 포르투갈 (리스본)
- 체코 (프라하)

북미:
- 미국 (뉴욕, LA, 하와이)
- 캐나다 (밴쿠버, 토론토)
- 멕시코 (칸쿤)

남미:
- 브라질 (리우데자네이루)
- 페루 (리마, 쿠스코)

오세아니아:
- 호주 (시드니, 멜버른)
- 뉴질랜드 (오클랜드, 퀸스타운)

아프리카:
- 모로코 (마라케시)
- 남아공 (케이프타운)
- 탄자니아 (잔지바르)

#### Step 1.3.3: 데이터 파일 생성

- [ ] `src/data/countries/` - 국가별 JSON 파일 (예: `japan.json`, `thailand.json`)
- [ ] `src/data/countries.json` - 전체 국가 목록 (요약 정보)
- [ ] `src/data/monthly-recommendations/` - 월별 추천 JSON (1~12월)

#### Step 1.3.4: 여행 코멘트 데이터 작성

- [ ] `src/data/travel-comments/` - 국가별 여행 코멘트 JSON
  - 각 지역 x 12개월 = 여행 적합도, 한줄 요약, 특이사항, 주의사항, 팁
  - Claude에게 지역/월별 코멘트 생성 요청하여 JSON으로 저장
- [ ] `src/data/monthly-recommendations/` - 월별 추천 목적지 JSON
  - 각 월별 베스트 목적지, 숨은 보석, 피해야 할 곳

**완료 기준**: `src/data/` 아래에 모든 국가의 기후 데이터 + 여행 코멘트 JSON 파일 존재

---

### Step 1.4: 공통 레이아웃 & 네비게이션

- [ ] `src/components/layout/Header.tsx` - 로고, 네비게이션 (홈, 국가 목록, 지도, 비교)
- [ ] `src/components/layout/Footer.tsx` - 저작권, 데이터 출처 크레딧 (Open-Meteo CC-BY)
- [ ] `src/components/layout/Navigation.tsx` - 모바일 햄버거 메뉴 포함
- [ ] `src/app/layout.tsx` 업데이트 - Header/Footer 적용, 메타데이터 기본값
- [ ] 반응형 네비게이션 (모바일: 햄버거, 데스크톱: 가로 메뉴)

**완료 기준**: 모든 페이지에서 Header/Footer 표시, 모바일에서 햄버거 메뉴 동작

---

### Step 1.5: 홈페이지 구현

- [ ] `src/app/page.tsx` - 홈페이지
  - 히어로 섹션: "여행하기 좋은 날씨, 한눈에" 타이틀
  - 월 선택 바: 1~12월 탭/버튼 (현재 월 기본 선택)
  - 이번 달 추천 목적지 카드 그리드 (TOP 10)
  - 카테고리별 추천 (해변/도시/산/문화)
- [ ] `src/components/common/MonthSelector.tsx` - 월 선택 UI 컴포넌트
- [ ] `src/components/common/DestinationCard.tsx` - 목적지 카드 (이미지 없이 날씨 아이콘 + 기온 + 한줄 요약)
- [ ] `src/utils/data.ts` - JSON 데이터 로드 유틸리티 함수

**완료 기준**: 홈페이지에서 월 선택 시 해당 월 추천 목적지 카드가 표시됨

---

### Step 1.6: 국가 목록 페이지

- [ ] `src/app/country/page.tsx` - 국가 목록
  - 대륙별 필터 탭 (전체/아시아/유럽/북미/남미/오세아니아/아프리카)
  - 국가 카드 그리드 (국기 이모지 + 국가명 + 대표 지역 수 + 현재 월 기온)
  - 국가 클릭 시 `/country/[countryId]`로 이동
- [ ] `src/components/country/CountryCard.tsx` - 국가 카드 컴포넌트
- [ ] `src/components/common/ContinentFilter.tsx` - 대륙 필터 컴포넌트

**완료 기준**: 대륙별 필터로 국가 목록 표시, 국가 클릭 시 상세 페이지 이동

---

### Step 1.7: 국가 상세 페이지

- [ ] `src/app/country/[countryId]/page.tsx` - 국가 상세
  - 국가 기본정보 (수도, 통화, 언어, 시차, 비자)
  - 월별 날씨 테이블 (12개월 x 기온/강수량/습도 등)
  - "베스트 시즌" 하이라이트 배지
  - 하위 지역 목록 (카드)
  - 월별 여행 코멘트 타임라인
- [ ] `src/components/weather/WeatherTable.tsx` - 월별 날씨 테이블
- [ ] `src/components/weather/BestSeasonBadge.tsx` - 베스트 시즌 표시
- [ ] `src/components/country/RegionList.tsx` - 지역 목록
- [ ] `src/components/travel/CommentTimeline.tsx` - 월별 코멘트 타임라인
- [ ] `generateStaticParams` 구현 - 모든 국가 정적 빌드

**완료 기준**: `/country/japan` 접속 시 일본의 기본정보, 날씨 테이블, 지역 목록 표시

---

### Step 1.8: 지역 상세 페이지

- [ ] `src/app/country/[countryId]/[regionId]/page.tsx` - 지역 상세
  - 지역 기본정보 (기후 타입, 좌표)
  - 12개월 날씨 데이터 상세 표시
  - 월별 여행 적합도 시각화 (1~5점 바 또는 색상)
  - 월별 여행 코멘트 전체 (팁, 주의사항, 이벤트 등)
  - "여행하기 좋은 시기" 요약
- [ ] `src/components/weather/WeatherDetail.tsx` - 상세 날씨 정보
- [ ] `src/components/travel/TravelRating.tsx` - 여행 적합도 표시
- [ ] `src/components/travel/TravelTips.tsx` - 팁/주의사항 섹션
- [ ] `generateStaticParams` 구현 - 모든 지역 정적 빌드

**완료 기준**: `/country/japan/tokyo` 접속 시 도쿄의 12개월 날씨 + 여행 코멘트 표시

---

## Phase 2: 핵심 기능 완성

### Step 2.1: 차트 라이브러리 선정 및 날씨 차트

- [ ] 차트 라이브러리 선정 (Recharts vs Chart.js 비교 후 결정)
- [ ] `src/components/weather/TemperatureChart.tsx` - 기온 라인 차트 (최고/최저)
- [ ] `src/components/weather/RainfallChart.tsx` - 강수량 바 차트
- [ ] `src/components/weather/CombinedChart.tsx` - 기온 + 강수량 복합 차트
- [ ] 국가 상세 페이지에 차트 추가
- [ ] 지역 상세 페이지에 차트 추가

**완료 기준**: 국가/지역 페이지에서 기온·강수량 차트가 렌더링됨
**CLAUDE.md 갱신**: 차트 라이브러리 확정 시 "미정" → 확정 라이브러리로 변경

---

### Step 2.2: 인터랙티브 세계지도

- [ ] `npm install leaflet react-leaflet` + `@types/leaflet`
- [ ] Natural Earth 110m GeoJSON 다운로드 → `public/geo/countries-110m.json`
- [ ] `src/components/map/WorldMap.tsx` - Leaflet 지도 컴포넌트
  - OpenFreeMap 타일 사용
  - GeoJSON으로 국가 경계 표시
  - 국가 클릭 시 `/country/[countryId]` 이동
  - 호버 시 국가명 + 현재 월 기온/강수량 툴팁
- [ ] `src/components/map/MapLegend.tsx` - 범례 (추천도 색상)
- [ ] `src/components/map/MonthMapFilter.tsx` - 지도 위 월 선택
- [ ] `src/app/map/page.tsx` - 지도 페이지
  - `dynamic()` SSR 비활성화 필수
  - 월 선택 시 국가별 추천도 색상 변경 (초록=최적 ~ 빨강=비추천)

**완료 기준**: `/map`에서 세계지도 표시, 국가 클릭 이동, 월 선택 시 색상 변경

---

### Step 2.3: 월별 추천 페이지

- [ ] `src/app/month/[month]/page.tsx` - 월별 추천
  - URL 예: `/month/7` (7월)
  - 베스트 목적지 TOP 10 카드 그리드
  - 카테고리별 추천 (해변/산/도시/문화/어드벤처/스키)
  - 숨은 보석 섹션
  - 피해야 할 곳 섹션 (이유 포함)
- [ ] `src/components/common/CategoryTabs.tsx` - 카테고리 탭
- [ ] `src/components/travel/AvoidList.tsx` - 비추천 목적지 리스트
- [ ] `generateStaticParams` - 1~12월 정적 빌드

**완료 기준**: `/month/7` 접속 시 7월 추천/비추천 목적지 표시

---

### Step 2.4: 검색 기능

- [ ] `src/app/search/page.tsx` - 검색 결과 페이지
- [ ] `src/components/common/SearchBar.tsx` - 검색 입력 (Header에 포함)
  - 국가명/지역명 한국어+영어 검색
  - 실시간 자동완성 (클라이언트 사이드, 정적 데이터 기반)
  - 디바운스 적용
- [ ] `src/utils/search.ts` - 검색 유틸리티 (fuzzy search)
- [ ] 검색 인덱스 데이터 생성 (`src/data/search-index.json`)

**완료 기준**: Header 검색바에서 "도쿄" 입력 시 자동완성 + 결과 페이지 이동

---

### Step 2.5: 목적지 비교 기능

- [ ] `src/app/compare/page.tsx` - 비교 페이지
  - 최대 3개 목적지 선택 UI
  - 나란히 월별 데이터 비교 테이블
  - 차트 오버레이 비교 (기온, 강수량)
  - URL 쿼리로 비교 상태 공유 (예: `/compare?r=tokyo,bali,paris`)
- [ ] `src/components/compare/CompareSelector.tsx` - 목적지 선택
- [ ] `src/components/compare/CompareTable.tsx` - 비교 테이블
- [ ] `src/components/compare/CompareChart.tsx` - 비교 차트

**완료 기준**: 3개 목적지 선택 후 기온/강수량 비교 테이블+차트 표시

---

### Step 2.6: 여행 코멘트 시스템 강화

- [ ] 각 코멘트에 아이콘 매핑 (Meteocons 활용)
- [ ] `src/components/travel/EventBadge.tsx` - 축제/이벤트 배지
- [ ] `src/components/travel/ClothingAdvice.tsx` - 옷차림 추천 시각화
- [ ] `src/components/travel/CrowdIndicator.tsx` - 관광객 밀집도 표시
- [ ] `src/components/travel/PriceIndicator.tsx` - 물가 수준 표시

**완료 기준**: 지역 상세 페이지에서 코멘트가 아이콘, 배지 등과 함께 풍부하게 표시

---

## Phase 3: 고도화

### Step 3.1: 여행 테마별 추천

- [ ] `src/data/themes.json` - 테마 정의 (beach, mountain, city, culture, adventure, ski)
- [ ] `src/app/theme/[theme]/page.tsx` - 테마별 추천 페이지
- [ ] `src/components/theme/ThemeCard.tsx` - 테마 카드
- [ ] 각 테마별 추천 목적지 데이터 작성
- [ ] 홈페이지에 테마 바로가기 섹션 추가

**완료 기준**: `/theme/beach` 접속 시 해변 여행 추천 목적지 표시

---

### Step 3.2: SEO 최적화

- [ ] 모든 페이지에 `generateMetadata` 구현
  - 국가/지역 페이지: 동적 title, description, og:image
  - 월별 페이지: "n월 여행 추천 목적지" 메타데이터
- [ ] `src/app/sitemap.ts` - 동적 사이트맵 생성
- [ ] `src/app/robots.ts` - robots.txt
- [ ] JSON-LD 구조화 데이터 (TravelAction, Place)
- [ ] `src/app/opengraph-image.tsx` - 동적 OG 이미지 생성

**완료 기준**: 각 페이지가 고유한 메타데이터를 가지고, 사이트맵이 모든 페이지를 포함

---

### Step 3.3: 반응형 최적화

- [ ] 모든 컴포넌트 모바일 퍼스트 리뷰
- [ ] 터치 친화적 인터랙션 (스와이프, 탭)
- [ ] 월 선택 바 모바일 최적화 (가로 스크롤)
- [ ] 차트 모바일 최적화 (크기, 터치 줌)
- [ ] 테이블 모바일 최적화 (가로 스크롤 또는 카드 뷰 전환)
- [ ] 지도 모바일 최적화 (핀치 줌, 터치 이벤트)

**완료 기준**: 모바일(375px)에서 모든 페이지가 자연스럽게 표시되고 인터랙션 가능

---

### Step 3.4: 다국어 지원 (한국어/영어)

- [ ] i18n 라이브러리 선정 (next-intl 또는 next-i18next)
- [ ] `src/messages/ko.json`, `src/messages/en.json` - 번역 파일
- [ ] 라우팅 변경 (`/ko/country/japan`, `/en/country/japan`)
- [ ] 언어 전환 UI (Header에 한/EN 토글)
- [ ] 데이터의 `name.ko`, `name.en` 필드 활용

**완료 기준**: 한/영 전환 시 모든 UI 텍스트 및 국가/지역명 번역됨

---

## Phase 4: 확장 기능

### Step 4.1: 비자 정보 통합

- [ ] Passport Index CSV 다운로드 → `src/data/visa.json` 변환 스크립트
- [ ] `src/components/country/VisaInfo.tsx` - 비자 정보 표시
- [ ] 국가 상세 페이지에 비자 섹션 추가
- [ ] 국가 목록에 무비자/비자 필터 추가

---

### Step 4.2: 베스트 시즌 캘린더

- [ ] `src/components/common/SeasonCalendar.tsx` - 12개월 캘린더 뷰
- [ ] 각 목적지의 베스트 시즌을 색상으로 표시
- [ ] 홈페이지 또는 별도 페이지에 배치

---

### Step 4.3: 짐 싸기 체크리스트

- [ ] `src/data/packing.json` - 기후별 짐 싸기 아이템
- [ ] `src/components/travel/PackingChecklist.tsx` - 체크리스트 UI
- [ ] 지역 + 월 조합으로 자동 추천

---

### Step 4.4: Cloudflare Pages 배포

- [ ] `next.config.ts` 에 Cloudflare Pages 호환 설정
- [ ] `@cloudflare/next-on-pages` 패키지 설치 및 설정
- [ ] `wrangler.toml` 설정
- [ ] 빌드 & 배포 테스트
- [ ] 커스텀 도메인 연결 (있다면)

**완료 기준**: Cloudflare Pages에서 사이트 정상 접속

---

### Step 4.5: PWA 지원

- [ ] `next-pwa` 또는 수동 서비스 워커 설정
- [ ] `public/manifest.json` - PWA 매니페스트
- [ ] 오프라인 캐시 전략 (정적 데이터 우선)
- [ ] 앱 아이콘 생성

---

## 구현 원칙

1. **정적 우선**: 모든 페이지는 SSG로 빌드. 런타임 API 호출 없음.
2. **데이터 파이프라인**: `scripts/` → `src/data/` → Next.js SSG
3. **점진적 구현**: 각 Step 완료 후 `npm run build` 통과 확인
4. **CLAUDE.md 동기화**: 기술 결정 변경 시 반드시 CLAUDE.md 갱신
5. **커밋 단위**: 각 Step 또는 의미 있는 하위 단위로 커밋

---

## 현재 진행 상태

**현재 단계**: Phase 1 시작 전 (프로젝트 초기 상태 - CLAUDE.md, LICENSE, README만 존재)
**다음 작업**: Step 1.1 프로젝트 초기화
