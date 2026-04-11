# 현재 진행 중인 플랜

> 시작: 2026-04-12
> 항목: 현재 모든 도시들 26년도 데이터 추가 (파이썬 스크립트 이용해서 날씨 가져오기)

---

## 목표
112개 전체 지역에 대해 2026년 일별 날씨 데이터를 Open-Meteo API로 가져와 `src/data/daily/[regionId]/all.json`에 병합

## 체크리스트
- [x] `add-2025-data.ts`를 년도/월 파라미터 입력받도록 수정
- [x] `fetch-climate-data.ts` 날짜 범위 파라미터화 (`setDateRange` 함수)
- [x] `generate-data.ts`에 `--start-date`/`--end-date` 인자 추가
- [x] 통합 파이프라인 `scripts/pipeline.ts` 생성
- [x] 전체 112개 지역 대상 2026년 1~3월 데이터 fetch 실행
- [x] 빌드 성공 확인 (`npm run build`)

## 진행 로그
| 시간 | 작업 내용 |
|------|----------|
| 04-12 | add-2025-data.ts --year/--months 파라미터 추가 |
| 04-12 | fetch-climate-data.ts setDateRange() 파라미터화 |
| 04-12 | generate-data.ts --start-date/--end-date 인자 추가 |
| 04-12 | scripts/pipeline.ts 통합 파이프라인 생성 |
| 04-12 | 112개 전체 지역 2026년 1~3월 데이터 추가 완료 |
| 04-12 | npm run build 성공 확인 |
