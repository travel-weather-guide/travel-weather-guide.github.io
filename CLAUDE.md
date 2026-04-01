# Travel Weather - 전세계 여행용 날씨 가이드

---

## CLAUDE.md 자동 갱신 규칙 (필수)

이 문서는 프로젝트의 **단일 진실 소스(Single Source of Truth)**다.

**Claude는 다음 상황에서 반드시 이 파일을 즉시 갱신해야 한다:**
- 기술 스택·라이브러리·API 선택이 변경되거나 새로 확정될 때
- 디자인 가이드라인 (색상, 폰트, 레이아웃, 컴포넌트 패턴)이 변경될 때
- 페이지 구조·라우팅이 변경될 때
- 데이터 스키마가 변경될 때
- 개발 컨벤션이 추가·변경될 때
- 도메인 방향성 (기능 우선순위, 타겟 유저 등)이 달라질 때

**갱신 방법**: 변경된 섹션을 현실에 맞게 직접 수정. 히스토리는 "결정 변경 로그" 섹션에 한 줄 추가.

---

## 프로젝트 개요

여행자를 위한 전세계 날씨 정보 웹사이트. 단순 날씨 정보가 아닌, **"이 시기에 이 나라/지역을 여행하면 어떤가?"**에 대한 실질적 가이드를 제공하는 것이 핵심 목표.

---

## 기획 비전

### 타겟 유저
- 해외여행을 계획 중인 여행자
- "몇 월에 어디 가면 좋을까?" 고민하는 사람
- 특정 목적지의 월별 기후를 비교하고 싶은 사람

### 핵심 가치
1. **여행 중심 날씨 정보** - 기상청 데이터가 아닌, 여행자 관점의 날씨 해석
2. **월별 추천** - "이번 달에 가기 좋은 곳" 즉시 제공
3. **실용적 코멘트** - 우기/건기, 축제, 비수기 할인 등 여행에 영향을 주는 정보

---

## 확정된 기술 스택

### 프레임워크 & 언어
- **Frontend**: Next.js 16+ (App Router) + TypeScript (strict 모드)
- **스타일링**: Tailwind CSS v4

### 데이터 전략: 빌드 타임 정적 JSON (런타임 API 호출 없음)
모든 기후 데이터는 빌드 스크립트로 사전 생성 → `src/data/` 에 저장 → Next.js SSG로 빌드

| 데이터 종류 | 소스 | 비고 |
|---|---|---|
| 기온 / 강수량 / 습도 / 일조시간 | **Open-Meteo Historical API** | API키 불필요, CC-BY 4.0, 비상업적 무료 |
| 바다 수온 | **Open-Meteo Marine API** | 동일 조건 |
| 자외선 지수 | **Visual Crossing** (무료 1,000건/일) | API키 필요 (무료 가입) |
| 국가 기본정보 (통화·언어·시차·좌표) | **REST Countries API v3.1** | API키 불필요 |
| 한국 여권 비자 정보 | **Passport Index 데이터셋 CSV** | MIT, 정적 파일로 보관 |

### 지도
- **라이브러리**: Leaflet.js + react-leaflet (BSD 2-clause, 100% 무료)
- **타일**: OpenFreeMap (사용량 제한 없음, API키 불필요)
- **국가 경계 GeoJSON**: Natural Earth 110m (56KB, 퍼블릭 도메인)
- **Next.js 주의**: `dynamic()` 으로 SSR 비활성화 필수 (`window` 객체 필요)

### 아이콘
- **날씨 아이콘**: Meteocons by Bas Milius (MIT, 애니메이션 SVG)

### 차트
- **미정** (Recharts 또는 Chart.js 검토 예정)

### 배포
- **Cloudflare Pages** (무료, 대역폭 무제한, 상업화 제한 없음)
- Vercel 대비 선택 이유: 대역폭 무제한 + 향후 수익화 시 제약 없음

### 주의사항
- Open-Meteo 무료 플랜은 **비상업적 이용만** 허용. 광고·구독 수익 추가 시 유료 전환 필요 (월 15유로~)

---

## 플래닝 (구현 단계)

### Phase 1: 기반 구축 (MVP)
1. **프로젝트 세팅** - Next.js + Tailwind 초기화
2. **데이터 구조 설계** - 국가/지역/월별 날씨 JSON 스키마
3. **핵심 페이지 구현**
   - 홈페이지 (월별 추천 목적지)
   - 국가 목록 페이지
   - 국가 상세 페이지 (월별 날씨 테이블)
   - 지역 상세 페이지
4. **초기 데이터 입력** - 주요 여행국 20~30개국 데이터

### Phase 2: 핵심 기능 완성
5. **인터랙티브 세계지도** - 클릭하면 해당 국가 페이지로 이동
6. **월 선택 필터** - 특정 월 선택 시 추천 목적지 하이라이트
7. **여행 코멘트 시스템** - 월별 특이사항, 팁, 주의사항
8. **검색 기능** - 국가/지역명 검색
9. **비교 기능** - 2~3개 목적지 날씨 나란히 비교

### Phase 3: 고도화
10. **여행 테마별 추천** - 해변, 트레킹, 도시관광, 스키 등
11. **다국어 지원** - 한국어/영어
12. **반응형 완전 최적화** - 모바일 우선
13. **SEO 최적화** - 각 국가/지역 페이지 메타데이터
14. **실시간 날씨 API 연동** (선택) - 현재 날씨 보조 표시

### Phase 4: 확장
15. **사용자 리뷰/후기** - "n월에 다녀왔어요" 경험담
16. **항공권 가격 트렌드 연동** (선택)
17. **여행 체크리스트** - 기후 기반 짐 싸기 가이드
18. **PWA 지원** - 오프라인에서도 기본 정보 조회

---

## 핵심 기능 상세

### 1. 월별 날씨 정보 (국가/지역별)
각 지역의 12개월 데이터:
- **평균 기온** (최고/최저, °C)
- **강수량** (mm)
- **강수일수** (일)
- **습도** (%)
- **일조시간** (시간)
- **자외선 지수**
- **바다 수온** (해안 지역)
- **날씨 요약** (맑음/흐림/우기 등 한줄 요약)

### 2. 여행 코멘트 시스템
각 국가/지역의 월별 여행 코멘트:
- **여행 적합도 점수** (1~5, 또는 "최적/좋음/보통/비추천")
- **한줄 요약** - "건기 시작, 가장 여행하기 좋은 시기"
- **특이사항** - 축제, 공휴일, 성수기/비수기, 라마단 등
- **주의사항** - 태풍 시즌, 극심한 더위, 혹한기 등
- **여행 팁** - 옷차림, 준비물, 예약 팁
- **물가 트렌드** - 성수기 가격 상승 여부

### 3. 월별 추천 시스템
"n월에 여행하기 좋은 곳" 추천:
- **베스트 목적지 TOP 10** - 해당 월 최적 여행지
- **카테고리별 추천** - 해변/산/도시/문화 등
- **숨은 보석** - 덜 알려진 추천지
- **피해야 할 곳** - 해당 월에 비추천인 목적지 (우기, 극한 날씨 등)

### 4. 국가/지역 상세 페이지
- 12개월 날씨 차트 (기온, 강수량 그래프)
- 월별 여행 코멘트 타임라인
- "베스트 시즌" 하이라이트
- 주요 도시/지역 하위 페이지
- 기본 국가 정보 (비자, 시차, 통화, 언어 등)

### 5. 인터랙티브 세계지도
- 세계지도에서 국가 클릭 → 상세 페이지
- 월 선택 시 지도에 색상으로 추천도 표시 (초록=최적, 빨강=비추천)
- 호버 시 해당 월 기온/강수량 미리보기

### 6. 목적지 비교 기능
- 최대 3개 목적지 선택
- 나란히 월별 데이터 비교 테이블
- 차트 오버레이 비교

---

## 추가하면 좋을 기능 목록

### 높은 우선순위
- [ ] **베스트 시즌 캘린더** - 12개월 캘린더 뷰에서 각 목적지의 베스트 시즌 한눈에 보기
- [ ] **여행 스타일 매칭** - "나는 더위를 싫어해요" 같은 선호도 입력 → 맞춤 추천
- [ ] **비자 정보 통합** - 한국 여권 기준 무비자/비자 필요 여부
- [ ] **직항 정보** - 한국에서 직항 가능한 목적지 필터
- [ ] **예산별 추천** - 저예산/중간/럭셔리 여행 목적지 분류
- [ ] **항공권 최저가 + 날씨 매칭** - 항공사 API 연동, 날씨 적합도와 가격을 조합해 "지금 가기 좋고 저렴한 곳" 추천

### 중간 우선순위
- [ ] **축제/이벤트 캘린더** - 전세계 주요 축제 일정과 연동
- [ ] **일출/일몰 시간** - 여행 사진 촬영 계획용
- [ ] **시차 계산기** - 한국 기준 시차 표시
- [ ] **짐 싸기 체크리스트** - 기후 기반 자동 생성
- [ ] **여행 보험 추천** - 지역별 건강/안전 위험도 기반
- [ ] **현지 교통 정보** - 기후에 따른 교통 영향 (몬순 시즌 도로 상황 등)
- [ ] **음식/식문화 가이드** - 계절 음식, 과일 시즌 등

### 낮은 우선순위 (장기)
- [ ] **AI 여행 상담** - 챗봇으로 맞춤 여행지 추천
- [ ] **여행 플래너 연동** - 구글 캘린더/노션 내보내기
- [ ] **커뮤니티 기능** - 여행 후기, 사진 공유
- [ ] **알림 서비스** - "관심 목적지 베스트 시즌 알림"
- [ ] **오프라인 가이드 다운로드** - PDF 여행 가이드 생성
- [ ] **환율 정보** - 실시간 환율 + 물가 비교
- [ ] **건강 정보** - 예방접종, 말라리아 위험 지역 등
- [ ] **사진 갤러리** - 월별 풍경 사진으로 분위기 전달

---

## 데이터 구조 (초안)

```typescript
// 국가
interface Country {
  id: string;              // "japan", "thailand"
  name: { ko: string; en: string };
  continent: Continent;
  capital: string;
  currency: string;
  language: string;
  timezone: string;
  visaInfo: string;        // 한국 여권 기준
  regions: Region[];
}

// 지역
interface Region {
  id: string;              // "tokyo", "chiang-mai"
  name: { ko: string; en: string };
  countryId: string;
  latitude: number;
  longitude: number;
  climateType: string;     // "열대", "온대", "건조" 등
  monthlyData: MonthlyData[];
}

// 월별 날씨 데이터
interface MonthlyData {
  month: number;           // 1~12
  tempHigh: number;        // 평균 최고기온 (°C)
  tempLow: number;         // 평균 최저기온 (°C)
  rainfall: number;        // 강수량 (mm)
  rainyDays: number;       // 강수일수
  humidity: number;        // 습도 (%)
  sunshineHours: number;   // 일조시간
  uvIndex: number;         // 자외선 지수 (1~11+)
  seaTemp?: number;        // 바다 수온 (해안 지역)
  weatherSummary: string;  // "맑고 건조", "우기", "쾌청" 등
}

// 여행 코멘트
interface TravelComment {
  regionId: string;
  month: number;
  rating: 1 | 2 | 3 | 4 | 5;       // 여행 적합도
  summary: string;                    // 한줄 요약
  highlights: string[];               // 좋은 점
  cautions: string[];                 // 주의사항
  events: string[];                   // 축제/이벤트
  tips: string[];                     // 여행 팁
  clothingAdvice: string;             // 옷차림 추천
  crowdLevel: "low" | "medium" | "high";  // 관광객 밀집도
  priceLevel: "low" | "medium" | "high";  // 물가/성수기 수준
}

// 월별 추천
interface MonthlyRecommendation {
  month: number;
  bestDestinations: RecommendedDestination[];
  hiddenGems: RecommendedDestination[];
  avoidList: { regionId: string; reason: string }[];
}

interface RecommendedDestination {
  regionId: string;
  category: "beach" | "mountain" | "city" | "culture" | "adventure" | "ski";
  reason: string;
  rating: number;
}
```

---

## 페이지 구조

```
/                          → 홈 (이번 달 추천 + 월 선택)
/map                       → 인터랙티브 세계지도
/month/[month]             → 월별 추천 페이지 (예: /month/7)
/country                   → 국가 목록 (대륙별 필터)
/country/[countryId]       → 국가 상세 (예: /country/japan)
/country/[countryId]/[regionId]  → 지역 상세 (예: /country/japan/tokyo)
/compare                   → 목적지 비교
/theme/[theme]             → 테마별 추천 (예: /theme/beach)
/search                    → 검색 결과
```

---

## 디자인 가이드라인

- **톤**: 밝고 친근한 여행 분위기, 깔끔한 정보 전달
- **색상**: 하늘색/코랄 계열 메인, 날씨에 따른 동적 색상
- **폰트**: Noto Sans KR (next/font/google)
- **레이아웃**: 카드 기반 UI, 충분한 여백
- **차트**: 직관적인 기온/강수량 시각화 (라인+바 차트)
- **모바일**: 모바일 퍼스트, 터치 친화적

---

## 개발 컨벤션

- TypeScript strict 모드
- ESLint + Prettier
- 컴포넌트: `src/components/` (기능별 폴더)
- 데이터: `src/data/` (JSON, 빌드 스크립트로 생성)
- 데이터 생성 스크립트: `scripts/` (Node.js 또는 Python)
- 페이지: `src/app/` (Next.js App Router)
- 유틸: `src/utils/`
- 타입: `src/types/`
- 한국어 기본, 추후 i18n 확장 고려
- Leaflet 컴포넌트는 반드시 `dynamic(() => import(...), { ssr: false })` 사용

### 플랜 작성 원칙

- **프로토타입 우선.** 오버엔지니어링 금지. 최소한의 구현으로 동작을 먼저 확인하고 점진적으로 확장한다.
- **PLAN.md는 큰 틀만 잡는다.** 각 항목은 2~5줄로 목적과 범위를 알 수 있게 작성. 구체적인 구현 체크리스트는 PLAN-CURRENT.md에서 관리한다.
- 한 Step이 다른 Step의 병목이 되지 않게 순서를 조정한다.

### 플랜 관리 흐름

플랜 파일 3종:
- `PLAN.md` — 마스터 백로그 (전체 구현 계획)
- `PLAN-CURRENT.md` — 현재 진행 중인 항목 (체크리스트 + 진행 로그)
- `PLAN-DONE.md` — 완료된 항목 아카이브

```
/start-phase 2-1
  │  PLAN.md에서 해당 항목 추출
  │  → PLAN-CURRENT.md에 체크리스트 생성
  │  → PLAN.md에 (진행 중) 표시
  │
  ▼  구현 작업 진행
  │
  │  [자동] Stop 훅 — 매 턴 종료 시
  │  index.html 변경 감지 → PLAN-CURRENT.md 업데이트 알림
  │
  ▼  모든 체크리스트 완료
  │
/complete-phase
     PLAN-CURRENT.md → PLAN-DONE.md에 아카이빙
     → PLAN.md에 [x] 체크 + 완료 날짜
     → PLAN-CURRENT.md 초기화
```

### 훅

| 이벤트 | 대상 | 동작 |
|--------|------|------|
| `PostToolUse` | `Edit\|Write` | CLAUDE.md 동기화 알림 |
| `Stop` | 전체 | PLAN-CURRENT.md 진행 상황 업데이트 알림 |

---

## 결정 변경 로그

| 날짜 | 항목 | 변경 내용 |
|---|---|---|
| 2026-04-01 | 배포 플랫폼 | Vercel → Cloudflare Pages (대역폭 무제한, 상업화 제한 없음) |
| 2026-04-01 | 지도 라이브러리 | Leaflet 또는 Mapbox → Leaflet + react-leaflet 확정 |
| 2026-04-01 | 데이터 전략 | 런타임 API → 빌드 타임 정적 JSON 확정 |
| 2026-04-01 | 날씨 아이콘 | 미정 → Meteocons (Bas Milius, MIT) 확정 |
| 2026-04-01 | 날씨 데이터 소스 | 미정 → Open-Meteo + Visual Crossing 확정 |
| 2026-04-02 | Next.js 버전 | 15+ → 16+ (latest 기준 16.2.1) |
| 2026-04-02 | 폰트 | Pretendard 또는 Noto Sans KR → Noto Sans KR 확정 (next/font/google 지원) |
