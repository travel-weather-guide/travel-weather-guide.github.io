# Travel Weather - 구현 플랜

> 각 항목은 제목 없이 한 줄로만 작성한다. 부가 정보 없음.
> 구체적 구현 계획은 `/start-phase`로 시작한 뒤 PLAN-CURRENT.md에서 진행.
> 완료 내용은 PLAN-DONE.md에서 관리한다.
> 설명에는 구현 방법이 아니라 생각해야 할 문제를 적는다.
> CLAUDE.md가 프로젝트의 단일 진실 소스.
> `/start-phase` 시 가장 상단의 플랜부터 실행

---

- SEO — generateMetadata 전 동적 페이지 적용, 홈 SSR 전환, sitemap, 구조화 데이터
- 여행 코멘트 품질 교정 — 문화적 시즌 오버라이드, events/highlights 채우기, 자동생성 로직 개선
- import 하드코딩 → 동적 구조 전환 — 국가 추가 시 7+파일 수동 수정 병목 해소
- 데이터 확장 15개국 40지역 — 베트남, 필리핀, 스페인, 이탈리아, 싱가포르, 발리, 영국, 대만, 터키 등
- 빈 데이터 필드 채우기 — uvIndex(Visual Crossing), seaTemp(Marine API), visaInfo(Passport Index), events
- 이미지 — 국가/지역별 대표 이미지, 여행 사이트에 사진 0장은 치명적
- 다국어 — 정적 데이터(JSON)의 다국어 구조, URL 전략
- PWA — 오프라인 캐시 범위, 데이터 업데이트 전략
- 항공권 최저가 + 날씨 매칭 — API 비용, 가격 데이터 신선도, 추천 로직
