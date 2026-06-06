# Travel Weather - 구현 플랜

> 각 항목은 제목 없이 한 줄로만 작성한다. 부가 정보 없음.
> 구체적 구현 계획은 `/start-phase`로 시작한 뒤 PLAN-CURRENT.md에서 진행.
> 완료 내용은 PLAN-DONE.md에서 관리한다.
> 설명에는 구현 방법이 아니라 생각해야 할 문제를 적는다.
> CLAUDE.md가 프로젝트의 단일 진실 소스.
> `/start-phase` 시 가장 상단의 플랜부터 실행
> `/complete-phase` 시 진행 중 플랜 내용 제거

---

## SEO 후속 — 모니터링 → GATE-2 noindex + 기계적 reason 재작성 (진행 중)

> 선행: SEO 콘텐츠 최적화 Deploy 1 구현 완료 (PLAN-DONE.md 2026-06-07). 테마 5종·신뢰 페이지·역링크 배포 코드 준비됨.
> 상세 합의 플랜: `.omc/plans/seo-content-optimization-plan.md`

- 배포 전 GSC 베이스라인(노출/색인 수) 기록 후 배포 → 4~8주 GSC 노출 모니터링으로 콘텐츠 효과 vs 도메인 권위를 어떻게 분리 측정할 것인가 (성공 임계: 주간 노출 ≥ 50)
- [GATE-2] 모니터링 결과로 noindex go/no-go: 노출 상승이면 rating<4 city×month(~3,044p) noindex 보수적 진행, 노출 0이면 권위 문제라 보류 — 커버리지 신호 손실과 어떻게 저울질할 것인가
- 기존 monthly-recommendations의 기계적 수치 나열 reason 583개를 블로거톤으로 바꾸려다 발견: bestDestinations 583개 중 82개가 "추천(rating 4~5)인데 실제론 나쁜 달"(치앙마이 3·4월 연무, 뉴델리 5월 45°C, 마닐라 4월 40°C 등). 점수 엔진이 순수 기후로만 평점→스모그·극한더위 미반영. reason 말투 교체 전에 점수 엔진에 스모그/극한더위 페널티를 넣어 이 82개를 베스트에서 강등/제외해야 추천↔코멘트 모순이 해소됨 (라이브 추천 변경=판단 필요, 별도 진행)
- 도메인 권위가 진짜 병목일 경우: 커스텀 도메인 전환·백링크 유도를 어떻게 할 것인가 (github.io 한계)
- AdSense 진행 시: Open-Meteo 상업 플랜(€15/mo) 전환 + CONTACT_EMAIL 실주소 입력을 어떻게 처리할 것인가
