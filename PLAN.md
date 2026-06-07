# Travel Weather - 구현 플랜

> 각 항목은 제목 없이 한 줄로만 작성한다. 부가 정보 없음.
> 구체적 구현 계획은 `/start-phase`로 시작한 뒤 PLAN-CURRENT.md에서 진행.
> 완료 내용은 PLAN-DONE.md에서 관리한다.
> 설명에는 구현 방법이 아니라 생각해야 할 문제를 적는다.
> CLAUDE.md가 프로젝트의 단일 진실 소스.
> `/start-phase` 시 가장 상단의 플랜부터 실행
> `/complete-phase` 시 진행 중 플랜 내용 제거

---

## SEO 후속 — GSC 모니터링 → GATE-2 noindex (사용자·시간 의존)

> 선행 완료: Deploy 1(테마·신뢰페이지·역링크) + 점수엔진 정합성·reason 재작성·전수 데이터 감사 (PLAN-DONE.md 2026-06-07 2건).
> 상세 합의 플랜: `.omc/plans/seo-content-optimization-plan.md`

- 배포 전 GSC 베이스라인(노출/색인 수) 기록 후 배포 → 4~8주 노출 모니터링으로 콘텐츠 효과 vs 도메인 권위를 분리 측정 (성공 임계: 주간 노출 ≥ 50)
- [GATE-2] 모니터링 결과로 noindex go/no-go: 노출 상승이면 rating<4 city×month(~3,044p) noindex 보수적 진행, 노출 0이면 권위 문제라 보류 — 커버리지 신호 손실과의 저울질
- 도메인 권위가 진짜 병목일 경우: 커스텀 도메인 전환·백링크 유도 (github.io 한계)
- AdSense 진행 시: Open-Meteo 상업 플랜(€15/mo) 전환 처리
