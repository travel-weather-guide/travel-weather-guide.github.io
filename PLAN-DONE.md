# 완료된 플랜

---

## Phase 1: 기반 구축 (MVP) (2026-04-02 완료)

- [x] **1.1 프로젝트 세팅** — Next.js 16.2.2, Tailwind 4.2.2, Noto Sans KR
- [x] **1.2 타입 정의** — 핵심 타입 6개 정의
- [x] **1.3 데이터 파이프라인** — 5개국 14개 지역 데이터 파이프라인
- [x] **1.4 레이아웃** — Header/Footer/반응형 네비게이션
- [x] **1.5 홈페이지** — 월 선택 + 추천 카드
- [x] **1.6 국가 목록** — 대륙 필터
- [x] **1.7 국가 상세** — 기본정보 + 날씨 테이블 + 지역 목록
- [x] **1.8 지역 상세** — 날씨 + 적합도 + 코멘트

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 2026-04-02 | Phase 1 시작 |
| 2026-04-02 | Step 1.1 완료 — Next.js 16.2.2, Tailwind 4.2.2, Noto Sans KR |
| 2026-04-02 | Step 1.2 완료 — 핵심 타입 6개 정의 |
| 2026-04-02 | Step 1.3 완료 — 5개국 14개 지역 데이터 파이프라인 |
| 2026-04-02 | Step 1.4 완료 — Header/Footer/반응형 네비게이션 |
| 2026-04-02 | Step 1.5 완료 — 홈페이지 (월 선택 + 추천 카드) |
| 2026-04-02 | Step 1.6 완료 — 국가 목록 (대륙 필터) |
| 2026-04-02 | Step 1.7 완료 — 국가 상세 (기본정보 + 날씨 테이블 + 지역 목록) |
| 2026-04-02 | Step 1.8 완료 — 지역 상세 (날씨 + 적합도 + 코멘트) |

---

## 날씨 차트 + 페이지 구조 재설계 (2026-04-04 완료)

- [x] 차트 라이브러리 선정 및 설치 — Recharts
- [x] 기온+강수량 복합 차트 (WeatherChart) 구현
- [x] 데이터 재구조화 — daily/[month].json → daily/[regionId]/all.json
- [x] DailyCalendar, YearComparison 컴포넌트 추출
- [x] RegionTabs 구현 (월별 개요 / 일별 캘린더 / 여행 가이드)
- [x] 지역 상세 페이지 재작성 (서버 컴포넌트 + SSG)
- [x] 국가 상세 페이지 간소화 (차트/테이블 제거, RegionList 강화)
- [x] /month/[month] 삭제 + 리다이렉트
- [x] CLAUDE.md 페이지 구조/차트/변경 로그 갱신

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | Recharts 설치, WeatherChart 구현 |
| 04-04 | 페이지 구조 재설계 플랜 수립 및 승인 |
| 04-04 | daily 데이터 지역별 분할, 컴포넌트 추출, RegionTabs 구현, 페이지 재작성, /month 삭제 완료 |

---

## 세계지도 (2026-04-04 완료)

- [x] leaflet@^1.9, react-leaflet@^5, @types/leaflet, world-atlas, topojson-client 설치
- [x] TopoJSON → GeoJSON 변환 유틸 + 국가 slug↔ISO 매핑 테이블
- [x] WorldMap 컴포넌트 (dynamic import, ssr: false, Leaflet CSS 내부 import)
- [x] /map 페이지 (기본 뷰포트: 세계 전체)
- [x] 국가 경계 렌더링 + 데이터 있는 국가만 클릭 가능 / 없는 국가 회색
- [x] 지역 CircleMarker + 이름 툴팁
- [x] 타일 로딩 상태 (CSS 배경색)
- [x] 모바일 동작 확인 (Leaflet 네이티브 터치)

### 연기 항목
- 월 선택 UI + 추천도 색상 매핑 (Phase 2 "월 선택 필터"와 통합)
- 호버 시 기온/강수량 팝업 (월 선택과 함께)

### 핵심 결정
- react-leaflet v5 (React 19), world-atlas TopoJSON (~25KB gzip), CircleMarker, MapView 래퍼 (Next.js 16 ssr:false 제약 대응)

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 2026-04-04 | 패키지 설치 (leaflet, react-leaflet@5, world-atlas, topojson-client) |
| 2026-04-04 | countryMapping.ts 생성 (slug↔ISO numeric 매핑) |
| 2026-04-04 | WorldMap.tsx 생성 (GeoJSON 국가 경계 + CircleMarker 지역 표시) |
| 2026-04-04 | MapView.tsx 래퍼 생성 (Next.js 16 Server Component에서 ssr:false 불가 대응) |
| 2026-04-04 | /map/page.tsx 생성 + 빌드 성공 확인 |

---

## 월별 추천 페이지 (2026-04-04 완료)

- [x] regions.ts에 category 필드 추가 (beach/city/culture 등 실제 분류)
- [x] generate-data.ts 추천 로직 개선 (임계값 기반 + reason 구체화)
- [x] avoidList reason에 날씨 구체 사유 포함 (강수량·기온 등)
- [x] 데이터 부족 시 fallback UI (추천 0건일 때 빈 느낌 방지)
- [x] 홈페이지 UI에 카테고리 표시 추가
- [x] 빌드 + 화면 확인

### 핵심 결정
- 추천: rating>=4 (임계값), 비추천: rating<=2. TOP N 고정 순위 방식 폐기
- 카테고리: regions.ts에 직접 매핑 (guessCategory 제거)
- reason: 기온·강수량·일조량 기반 구체적 문장 자동 생성
- hiddenGems: 14개 지역에서 무의미, 지역 50개 이상 시 재도입 예정

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | regions.ts에 14개 지역 category 필드 추가 (beach/city/culture/mountain/adventure) |
| 04-04 | generate-data.ts: guessCategory 제거, regionDef.category 직접 사용 |
| 04-04 | 추천 로직 임계값 기반으로 전환 (rating>=4 추천, <=2 비추천) |
| 04-04 | generateRecommendReason/generateAvoidReason 함수 추가 |
| 04-04 | 빌드 스크립트 실행, 12개월 추천 JSON 재생성 확인 |
| 04-04 | DestinationCard에 category prop + 카테고리 라벨 표시 추가 |
| 04-04 | 홈페이지에 빈 상태 fallback UI 추가 |
| 04-04 | 빌드 성공 확인 |

---

## 지도-국가목록 페이지 병합 (2026-04-04 완료)

- [x] /country 페이지 좌우 분할 (좌: 지도, 우: 카드 리스트)
- [x] 상단 검색바 (국가/도시명 한영 검색 → 드롭다운 결과 → 바로 이동)
- [x] /map 라우트 → /country로 리다이렉트
- [x] Header 네비 정리 ("국가 목록" + "지도" → "국가")
- [x] 모바일 대응 (lg 이하: 지도 400px + 리스트 상하 배치)
- [x] 빌드 성공 확인

### 추가 작업
- 지도 경계선 제거, 국가명·도시명 상시 표시, 데이터 국가 영역 자동 줌
- 대륙 필터 선택 시 지도 해당 영역으로 flyToBounds (maxZoom: 5)
- SearchBar 공통 컴포넌트 추출 (홈 + /country 공유)
- DestinationCard에 국기 표시 추가
- 비교 페이지(/compare) 네비에서 제거

### 핵심 결정
- URL: /country가 메인, /map은 리다이렉트
- 좌우 분할 (lg), 모바일은 상하 배치
- 검색은 SearchBar 공통 컴포넌트로 홈·국가 페이지 공유

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | /country 페이지 재작성 (좌: 지도, 우: 대륙필터+카드리스트, 상단: 검색바) |
| 04-04 | 검색: 국가명(ko/en) + 지역명(ko/en) 실시간 필터, 드롭다운으로 바로 이동 |
| 04-04 | /map → /country 리다이렉트 |
| 04-04 | 지도 경계선 제거, 국가명·도시명 permanent 라벨, FitBounds 자동 줌 |
| 04-04 | 대륙 필터 → flyToBounds (maxZoom: 5) |
| 04-04 | SearchBar 공통 컴포넌트 추출, 홈페이지에도 적용 |
| 04-04 | DestinationCard에 국기, 비교 네비 제거 |

---

## 경쟁력 분석 및 전략 수립 (2026-04-04 완료)

- [x] 현재 구현 상태 감사 — 실제 사용자 관점에서 어떤 경험을 제공하는지 정리
- [x] 경쟁 서비스 분석 — 기존 여행 날씨 서비스 대비 차별점과 약점 파악
- [x] 핵심 사용자 시나리오 정의 — 누가, 언제, 왜 이 사이트에 오는가
- [x] 차별화 전략 도출 — 경쟁에서 이길 수 있는 구체적 포지셔닝
- [x] 액션 플랜 정리 — PLAN.md에 반영할 구체적 다음 단계 목록

### 핵심 발견
- 치명적 문제: 여행 코멘트 품질(도쿄 3월 벚꽃=1점), 데이터 5개국 부족, SEO 전무
- 강점: 일별 캘린더 데이터 깊이, 3탭 구조, 한국어 여행 날씨 전문 사이트 부재(시장 기회)
- 차별화: "한국 여행자 특화 + 데이터 깊이"
- 확장 병목: import 하드코딩(국가 추가 시 7+파일 수동 수정)

### 액션 플랜 (PLAN.md 반영 완료)
1. SEO 메타데이터 + 홈 SSR 전환
2. 여행 코멘트 품질 전면 교정
3. import 하드코딩 → 동적 구조 전환
4. 데이터 확장 15개국 40지역
5. 빈 데이터 필드 채우기
6. 이미지 추가

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | Phase 시작 |
| 04-04 | 3개 병렬 에이전트로 현재 상태 감사 + 경쟁 분석 + 시나리오 분석 완료 |
| 04-04 | 치명적 문제 3가지 + 차별화 전략 + 6단계 액션 플랜 도출 |

---

## 여행 코멘트 품질 교정 + 빈 데이터 필드 (2026-04-04 완료)

### 1. 카테고리 체계 정의
- [x] 전세계 여행지를 커버하는 카테고리 목록 확정 + 각 카테고리의 정의/기준 문서화 (7종: beach/city/culture/mountain/ski/adventure/nature)
- [x] 카테고리별 점수 가중치 설계 (기온/강수/일조/습도/페널티 항목별 비중, 100점 만점)
- [x] regions.ts의 category 필드 검증 + 필요시 수정 (14개 지역 전부 확인)
- [x] peakTourismMonths 필드 추가 (지역별 관광 성수기)

### 2. 점수 엔진 재설계
- [x] calculateScore를 카테고리별 분기로 재작성
- [x] 연속 점수 함수 도입 (3단계 계단 → 구간별 선형)
- [x] 극한 기온 감점(penalty) 도입 (>42°C: -80%, >38°C: -50%, >35°C: -20%)
- [x] 습도 점수 반영
- [ ] 해변 카테고리: 해수온(seaTemp) 점수 반영 (데이터 수집만, 점수 미반영 — 지역 확장 후 재검토)
- [x] peakMonths 하드코딩 → peakTourismMonths 지역별 참조

### 3. 코멘트 콘텐츠 + 빈 데이터
- [x] highlights 생성 로직 개선
- [x] cautions 임계값 현실화
- [x] events 생성 로직 (seasonOverrides 연동 완료)
- [x] seasonOverrides 26개 데이터 추가
- [x] visaInfo 5개국 데이터 추가
- [x] seasonOverrides import 버그 수정 (require → import)
- [x] uvIndex — 무료 API 제공 불가 → 필드 전체 제거
- [x] seaTemp — Marine API 연동 완료 (오키나와 7월 30.5°C 등 정상 수집)

### 4. 검증
- [x] 데이터 재생성 (5개국 14개 지역 성공)
- [x] 기후 유형 spot check — 도쿄 봄★4/여름★3, 방콕 건기★5/우기★3, 홋카이도 여름★5/겨울★2~3 확인
- [x] "특별한 장점 없음" 비율 0% 확인
- [x] 빌드 확인 (26/26 pages)

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | Phase 시작, 자동생성 로직 분석 완료 |
| 04-04 | highlights/cautions/events 로직 개선, seasonOverrides+visaInfo 데이터 추가 |
| 04-04 | uvIndex(Open-Meteo)+seaTemp(Marine API) 수집 코드 추가 |
| 04-04 | 전세계 적합성 검증 → 점수 엔진 구조적 결함 발견, 재설계 결정 |
| 04-04 | 7카테고리 점수 엔진 완성, seaTemp 연동, uvIndex 제거, 데이터 재생성, spot check 통과 |

---

## SEO (2026-04-04 완료)

- [x] /country/[countryId] — generateMetadata (국가명 + 지역수 + 기본정보)
- [x] /country/[countryId]/[regionId] — generateMetadata (지역명 + 기후 요약 + 베스트 시즌)
- [x] 홈페이지 SSR 전환 — 서버 컴포넌트 래퍼 + 클라이언트 인터랙션 분리, metadata export
- [x] /country 페이지 metadata — country/layout.tsx에 정적 metadata export
- [x] sitemap.ts — 전체 국가/지역 URL 자동 생성 (21개 엔트리)
- [x] robots.ts — 기본 크롤링 허용 + sitemap 경로
- [x] metadataBase 설정 + title template 패턴 도입
- [x] OG 완성 (locale, siteName, type) + Twitter Card
- [x] canonical URL (alternates) 전 페이지 적용
- [x] /country 페이지 서버/클라이언트 분리 + h1 추가
- [x] JSON-LD 구조화 데이터 (WebSite, BreadcrumbList, Place)
- [x] sitemap lastModified 추가
- [x] title 서픽스 불일치 통일 (template 자동 적용)
- [x] 최종 빌드 확인 (26/26 페이지)

### 핵심 결정
- metadataBase: https://travel-weather.pages.dev
- title template: `%s | Travel Weather`
- 홈+/country: 서버 컴포넌트로 전환, 인터랙션은 클라이언트 컴포넌트 분리
- JSON-LD: WebSite(홈), BreadcrumbList(국가+지역), Place(지역)

### 연기 항목
- favicon / apple-touch-icon (이미지 Phase에서 처리)
- 커스텀 404 페이지
- OG 이미지 동적 생성 (next/og)

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | Phase 시작 |
| 04-04 | 1차: generateMetadata(국가+지역), sitemap+robots, 홈 SSR 전환 |
| 04-04 | 2차: metadataBase, title template, canonical, /country SSR 전환, JSON-LD |
| 04-04 | 최종 빌드 성공 — 전 페이지 Static/SSG 확인 |

---

## import 하드코딩 → 동적 구조 전환 (2026-04-04 완료)

- [x] `countries.json`에 `isoNumeric` 필드 추가 (5개국)
- [x] `countryMapping.ts` → `countries.json` 기반 동적 생성으로 교체
- [x] `sitemap.ts` → `getAllCountryIds()` + `getCountry()` 동적 로딩으로 교체
- [x] `country/page.tsx` → 동적 로딩으로 교체
- [x] 빌드 확인

### 핵심 결정
- 국가 추가 시 `countries.json` + `countries/{id}.json` 2파일만 추가하면 sitemap/지도/국가목록 자동 반영
- `isoNumeric` (ISO 3166-1 숫자코드)을 `countries.json` 인덱스에서 관리 → 세계지도 클릭 연동 단일 소스

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | countries.json isoNumeric 추가, countryMapping.ts 동적 생성 전환 |
| 04-04 | sitemap.ts / country/page.tsx 정적 import 제거, 빌드 성공 확인 |

---

## 데이터 확장 15개국 40지역 (2026-04-04 완료)

- [x] 10개국 26개 지역 추가 + seasonOverrides + visaInfo
- [x] isoNumeric 필드 추가 (CountryDef 인터페이스 + 15개국 값)
- [x] 10개국 항목 countries.json 추가 (id, name, continent, regionCount, isoNumeric)
- [x] 데이터 생성 스크립트 실행 (15개국 40개 지역)
- [x] generate-data.ts에 isoNumeric 출력 추가
- [x] spot check — 지역별 점수 정상 범위 확인
- [x] [countryId]/page.tsx — fs 기반 동적 로딩 전환
- [x] [countryId]/[regionId]/page.tsx — fs 기반 동적 로딩 전환
- [x] 빌드 성공 확인 (62/62 페이지)

### 추가 작업
- 국가/지역 상세 페이지 하드코딩 import → fs 동적 로딩 완전 전환 (이전 Phase 누락분)

### 핵심 결정
- 신규 26지역 daily 데이터 미생성 (파이프라인 개선 Phase로 이관)
- regions.ts가 모든 국가 메타데이터의 단일 소스

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | Phase 시작 |
| 04-04 | regions.ts 10개국 26지역 + seasonOverrides + visaInfo 추가 |
| 04-04 | countries.json 10개국 추가 |
| 04-04 | 데이터 생성 (15개국 40지역 성공) |
| 04-04 | isoNumeric 누락 수정 (CountryDef + generate-data.ts 타입) |
| 04-04 | [countryId]/page.tsx, [regionId]/page.tsx 하드코딩 import → fs 동적 로딩 전환 |
| 04-04 | 빌드 성공 62/62 페이지 (26→62) |

---

## 추천 여행지 로직 개선 + 홈/지도 UIUX (2026-04-04 완료)

- [x] 40개 지역 × 12개월 성수기 데이터 정의 (기후+자연재해 기반 scoring)
- [x] 월별 추천 JSON 재생성 + travel-comments rating 업데이트
- [x] 점수 알고리즘 유틸 추출 (utils/scoring.ts)
- [x] 웹 리서치 기반 rating 검증 (Lonely Planet, Rick Steves 등)
- [x] 480개 지역/월 한줄 코멘트 작성 (scripts/generate-recommendations.py COMMENTS dict)
- [x] 추천 시스템 제거 — HomeContent, DestinationCard, monthly-recommendations 삭제
- [x] 홈페이지 → 국가 탐색 직접 진입 (CountryExplorer)
- [x] /map 페이지 삭제
- [x] 지도 마커: 지역 40개 → 국가 15개 (주황 원+이름 유지)
- [x] 지도 높이 축소 (280px/400px 고정)
- [x] 대륙 필터 포커싱 개선 (지역 좌표 기반 bounds)
- [x] 일별 캘린더 → 기본 탭으로 변경
- [x] 캘린더에 한줄 코멘트 + rating 뱃지 표시
- [x] 헤더 네비게이션 제거 (로고만)
- [x] 최저기온 색상 파란색 → 진회색
- [x] Rating 기준 문서화 (docs/RECOMMENDATION-CRITERIA.md)

### 핵심 결정
- 추천 시스템 폐기: 순수 기후 알고리즘으로는 실제 성수기 재현 불가, 웹 리서치 기반도 주관적 → 홈에서 추천 UI 자체를 제거하고 국가 직접 탐색으로 전환
- Rating: 기후 데이터(기온/강수/습도/일조) + 자연재해(태풍/홍수) 감점 알고리즘
- 한줄 코멘트: 480개 수동 작성 (벚꽃, 축제, 연무 등 지역 특성 반영)

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | 초기 generate-recommendations.py 작성, 월별 추천 재생성 |
| 04-04 | 웹 리서치 기반 rating 전면 재검증 (3개 병렬 에이전트, 15개국) |
| 04-04 | 순수 기후 기반 알고리즘으로 전환, 자연재해 감점 추가 |
| 04-04 | 추천 시스템 제거, 홈→국가탐색 직접 진입 |
| 04-04 | 지도 국가 단위 마커, 높이 축소, 포커싱 개선 |
| 04-04 | 캘린더 기본 탭, 한줄 코멘트 480개 작성, UI 개선 |

---

## 데이터 파이프라인 개선 (2026-04-04 완료)

- [x] `generate-data.ts`에 daily 데이터 생성 로직 통합 (기후 API 응답 하나로 monthly + daily 추출)
- [x] daily 데이터를 현행 포맷(`daily/[regionId]/all.json`)으로 출력하도록 통합
- [x] npm scripts 등록 (`npm run generate-data`)
- [x] CLI 인자 파싱 (`--only japan,thailand` 형태로 특정 국가만 지정)
- [x] 지정된 국가만 API 호출 + JSON 재생성, 나머지는 스킵
- [x] countries.json(전체 인덱스)과 monthly-recommendations는 항상 전체 디스크 기준 재생성
- [x] 불필요해진 개별 스크립트 정리 (`fetch-daily-data.ts`, `reorganize-daily-data.ts`, `combine-daily-data.ts`)
- [x] 빌드 테스트 (`npm run build` 정상 확인)
- [ ] 40지역 전체 daily 데이터 생성 실행 (API 일일 한도 소진으로 연기 → 별도 플랜 항목)

### 핵심 결정
- 기후 API 응답 하나로 monthly 집계 + daily 캘린더 동시 추출 (API 호출 절반 절감)
- `--only` 모드에서도 인덱스/추천은 디스크 전체 파일 기준으로 재생성 (정합성 보장)
- 리트라이: 8회, 지수 백오프 (15s~120s)
- CountryCard에 15개국 국기 이모지 추가

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 | Phase 시작, 기존 스크립트 구조 분석 |
| 04-04 | generate-data.ts 통합 (climate+daily+comments+recommendations) |
| 04-04 | --only 옵션 구현, rebuildIndexAndRecommendations 디스크 기반 재생성 |
| 04-04 | fetchClimateAndDailyData 통합 함수 (단일 API 호출로 monthly+daily 추출) |
| 04-04 | 리트라이 로직 강화 (8회, 지수 백오프) |
| 04-04 | 구 스크립트 3개 삭제, npm script 등록, 빌드 통과 |
| 04-04 | CountryCard 국기 이모지 15개국 추가 |

---

## 이미지 + 브랜딩 (2026-04-05 완료)

- [x] favicon 제작 및 적용 (SVG + ICO + apple-touch-icon)
- [x] 기본 OG 이미지 제작 (사이트 전체용 1200×630)
- [x] layout.tsx에 OG 이미지 메타데이터 연결
- [x] 국가/지역별 OG 이미지 전략 결정 및 구현 (빌드타임 생성, 대륙별 그라데이션)
- [x] 국가/지역 대표 이미지 소싱 전략 결정 (Unsplash URL 외부 참조)
- [x] 국가/지역 대표 이미지 적용 (카드 커버, 상세 페이지 히어로 배너)
- [x] 커스텀 404 페이지 (not-found.tsx)
- [x] 빌드 확인 및 메타데이터 검증

### 핵심 결정
- favicon: 태양+구름 SVG (sky-600), sharp로 ICO/apple-touch-icon 변환
- OG 이미지: 빌드타임 생성 (sharp SVG→PNG), 대륙별 그라데이션 (asia=sky, europe=indigo, north-america=emerald, oceania=teal)
- 국가 대표 이미지: Unsplash URL 외부 참조 (next/image 자동 최적화)
- 404: 심플 안내 ("길을 잃으셨나요?") + 홈/탐색 링크

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-04 23:43 | favicon.svg, not-found.tsx, layout.tsx 메타데이터 |
| 04-04 23:44 | sharp 설치, generate-images.ts, OG 이미지 16장 생성 |
| 04-04 23:45 | Unsplash imageUrl 15개국 추가, CountryCard 이미지 카드, 국가 상세 히어로 배너 |
| 04-04 23:46 | 빌드 성공 (61페이지) |

---

## 자동 다국어 지원 — 영어, 일본어, 중국어 (2026-04-05 완료)

### 인프라
- [x] 로케일 Context + Provider 생성 (`src/contexts/LocaleContext.tsx`)
- [x] 브라우저 언어 자동 감지 + localStorage 저장 로직
- [x] UI 번역 사전 파일 (`src/i18n/messages.ts` — 4개 언어 정적 문자열)

### UI 번역
- [x] 컴포넌트 한국어 하드코딩 → 번역 키 전환 (18개 컴포넌트)
- [x] 페이지 서버/클라이언트 분리 (fs + useLocale 공존 문제 해결)
- [x] layout.tsx 동적 lang 속성 + 로케일별 폰트 로딩 (Noto Sans JP, SC)

### 데이터 다국어화
- [x] 데이터 스키마에 `ja`, `zh` 필드 추가 (types 수정 완료)
- [x] countries/regions name에 `ja`, `zh` 값 추가 (JSON 데이터)
- [x] 여행 코멘트 다국어 데이터 생성 (travel-comments — en/ja/zh)
- [x] 월별 추천 다국어 데이터 생성 (monthly-recommendations — en/ja/zh)
- [x] 날씨 요약(weatherSummary) 다국어 매핑
- [x] 기후 유형(climateType) 다국어 매핑
- [x] 데이터 로딩 유틸(`src/utils/data.ts`) 로케일 파라미터 지원

### 언어 전환 UI
- [x] 헤더에 언어 선택 드롭다운 (🌐 아이콘 + 4개 언어)

### 마무리
- [x] 빌드 테스트 및 누락 번역 검증 (tsc 0 에러, 61/61 페이지 빌드 성공)

### 접근 방식
- URL/라우팅 변경 없음 — 동일 경로, 브라우저 언어 자동 감지 + 수동 전환
- 언어 선호 localStorage에 저장, React Context로 전파
- 데이터 JSON 자체에 4개 언어 내장 → 로케일 키로 접근

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 2026-04-05 | 플랜 시작, 프로젝트 i18n 현황 분석 완료 |
| 2026-04-05 | 접근 방식 변경: URL 분리 → 동일 엔드포인트 + 데이터 내장 다국어 |
| 2026-04-05 | 인프라 완료: LocaleContext, Providers, messages.ts, i18n/utils.ts |
| 2026-04-05 | 컴포넌트 18개 + 페이지 5개 번역 전환 완료, 언어 선택 UI 추가 |
| 2026-04-05 | 페이지 서버/클라이언트 분리로 빌드 에러 해결 (61페이지 빌드 성공) |
| 2026-04-05 | 데이터 다국어화 완료: 15개 국가 + 15개 코멘트 + 12개 추천 파일 번역 |
| 2026-04-05 | 폰트(Noto Sans JP/SC) + 동적 lang 속성 추가 |
| 2026-04-05 | climateType/MONTH_LABELS/"일" 접미사 등 누락 한국어 수정, 최종 빌드 성공 |

---

## 사용자 유입, 경쟁사이트 관련 분석, 가장 최적의 도메인 이름 선정 (2026-04-05 완료)

### 분석
- [x] 경쟁사이트 조사 — Holiday-Weather, WeatherSpark, ClimatesToTravel 등 9개 분석
- [x] 사용자 유입 경로 분석 — SEO 키워드, 검색 의도, 채널별 잠재력
- [x] 차별화 포인트 정리 — 경쟁사 대비 강점/약점, 39개 지역 데이터 한계 확인
- [x] 도메인 후보 리스트업 — monthwise.com 1순위 등 5개 후보
- [x] 도메인 가용성 확인 — .com 중심 TLD 검토
- [x] 최종 도메인 추천안 제시 — monthwise.com > bestweather.com > wheretotravel.com

### 구현: SEO 인프라
- [x] GitHub Pages 배포 설정 — output: 'export', trailingSlash, images.unoptimized
- [x] generateMetadata 구현 — 국가/지역 페이지별 고유 title, description
- [x] canonical URL 수정 — 전역 / 제거, 페이지별 개별 설정
- [x] hreflang 태그 — 스킵 (라우트 기반 i18n 없이는 적용 불가)
- [x] OG 이미지 연결 — 16개 국가별 OG 이미지를 각 페이지에 연결
- [x] structured data 보강 — FAQPage, Country, ItemList 스키마 추가
- [x] sitemap 점검 — trailing slash 통일, best-in 12개 페이지 포함

### 구현: 유입 확대
- [x] /best-in/[month] 12개 페이지 — 월별 추천/숨은보석/비추 목록
- [x] 최근 본 목적지 — localStorage 기반, 홈 페이지 표시

### 추가 작업
- 이중 언어 메타 설명 (Korean + English keywords)
- 국기 이미지 (flagcdn.com) 적용 — CountryCard, best-in, 홈 추천
- FLAG_EMOJI → flagUrl 공유 유틸 추출
- preconnect/dns-prefetch 설정
- 파비콘 리뉴얼 (비행기 + 태양)

### 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-05 | 경쟁사 9개 분석, SEO/유입 분석, 도메인 5개 후보 선정 완료 |
| 04-05 | 기능 제안 10개 → 냉정 검토 후 5개로 축소 (데이터 39개 지역 한계 반영) |
| 04-05 | SEO 인프라: next.config(export), generateMetadata, canonical, OG, FAQ스키마 |
| 04-05 | /best-in/[month] 12개 페이지 생성 (73페이지 빌드 성공) |
| 04-05 | 최근 본 목적지 (localStorage + 홈페이지 표시) 구현 |
| 04-05 | 배포 최적화: 이중언어 메타, Country/ItemList 스키마, sitemap trailing slash |
| 04-05 | 국기 이미지 전환, 파비콘 리뉴얼 |
