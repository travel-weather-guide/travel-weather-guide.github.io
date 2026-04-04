# 추천 여행지 Rating 기준

## Rating 체계

| Rating | 라벨 | 기준 |
|--------|------|------|
| 5 | 최적 | 성수기. 관광객이 가장 많이 찾는 시기, 최적의 기후·이벤트 조건 |
| 4 | 좋음 | 숄더시즌 포함. 관광하기 좋지만 최적은 아님 |
| 3 | 보통 | 갈 수는 있지만 특별히 추천하진 않음 |
| 2 | 비추 | 비수기. 날씨·조건이 안 좋음 (극한은 아님) |
| 1 | 부적합 | 극심한 폭염/태풍/폐업 등으로 피해야 할 시기 |

## Rating 도출 방법

각 지역별로 아래 절차를 거쳐 12개월 rating을 도출한다:

1. **웹 검색** — `"[지역명] best time to visit"`, `"[지역명] peak season"` 등으로 최소 2-3개 출처 확인
2. **출처 종합** — 여러 레퍼런스가 일관되게 말하는 성수기/비수기 패턴 추출
3. **Rating 매핑** — 출처들의 공통 권장 사항을 1-5 스케일로 매핑

### Rating 결정 시 고려 요소

| 요소 | 설명 | 예시 |
|------|------|------|
| 기후 | 기온, 강수량, 습도, 일조시간 | 방콕 4월 40°C → rating 2 |
| 자연재해 | 태풍, 몬순, 홍수, 산불 | 마닐라 9월 태풍 → rating 1 |
| 대기질 | 연무, 스모그 | 치앙마이 3-4월 산불연무 → rating 1-2 |
| 인프라 | 시설 폐업, 페리 감편 | 산토리니 겨울 폐업 → rating 2 |
| 극심한 혼잡 | 관광 질 저하 수준의 과밀 | 아말피 7-8월 → rating 2 |
| 관광 적합성 | 해당 지역 본연의 매력을 즐길 수 있는 정도 | 카파도키아 겨울 열기구 결항 → rating 1 |

### Rating에 반영하지 않는 것

- 항공권/숙박 가격 (가성비는 별도 정보)
- 주관적 선호 (더위를 좋아하는 사람 등)
- 특정 이벤트의 개인적 관심도

## 월별 추천 생성 로직

`scripts/generate-recommendations.py`에서 자동 생성:

- **bestDestinations**: 해당 월 rating 5인 지역
- **hiddenGems**: rating 4인 지역 중 유명 관광지 제외 (최대 5개)
- **avoidList**: rating 1-2인 지역 (사유 포함)

## 주요 출처

### Asia
- [Lonely Planet](https://www.lonelyplanet.com) — 각 도시별 "Best time to visit" 가이드
- [Japan Highlights](https://www.japanhighlights.com) — 일본 지역별 시즌 가이드
- [Visit Okinawa Japan](https://visitokinawajapan.com) — 오키나와 공식 관광 가이드
- [Phuket 101](https://www.phuket101.net) — 푸켓 월별 날씨·시즌
- [Vietnam Airlines](https://www.vietnamairlines.com) — 베트남 지역별 여행 적기
- [Guide to the Philippines](https://guidetothephilippines.ph) — 필리핀 건기/우기 가이드
- [Bali.com](https://bali.com) — 발리 시즌별 가이드
- [China Highlights](https://www.chinahighlights.com) — 대만 날씨·시즌

### Europe
- [Rick Steves](https://www.ricksteves.com) — 유럽 각 도시별 "Best time to go"
- [U.S. News Travel](https://travel.usnews.com) — 도시별 "When To Visit" 가이드
- [Climates to Travel](https://www.climatestotravel.com) — 도시별 기후 데이터
- [Responsible Travel](https://www.responsiblevacation.com) — 카파도키아 시즌 가이드
- [Santorini View](https://www.santorini-view.com) — 산토리니 시즌별 가이드
- [Visit London](https://www.visitlondon.com) — 런던 공식 관광 가이드

### Americas & Oceania
- [Hawaii Guide](https://www.hawaii-guide.com) — 하와이 시즌별 가이드
- [The Points Guy](https://thepointsguy.com) — 하와이 여행 적기
- [Tourism Australia](https://www.australia.com) — 호주 공식 날씨 가이드

## 갱신 방법

1. `scripts/generate-recommendations.py`의 `RATINGS` 딕셔너리 수정
2. 필요 시 `BEST_NOTES`, `AVOID_NOTES` 업데이트
3. `python3 scripts/generate-recommendations.py` 실행
4. 변경된 JSON 파일 커밋
