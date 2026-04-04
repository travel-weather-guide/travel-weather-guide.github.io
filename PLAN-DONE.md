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
