---
name: translate
description: 다국어 번역 워크플로우 — Google Translate 1차 번역 + 검증 + 보정
---

# /translate

travel-comments + monthly-recommendations의 한국어 텍스트를 영어/일본어/중국어로 번역하고, 오역을 보정한다.

## 워크플로우

### 1단계: 1차 번역 (파이썬, 무료)
```bash
python3 scripts/translate-travel-comments.py
```
Google Translate로 자동 번역. 3~5분 소요. 이미 번역된 항목은 자동 스킵.

### 2단계: 검증 리포트 생성 (파이썬, 1초)
```bash
python3 scripts/translate-travel-comments.py --review
```
의심스러운 번역만 `scripts/translation-review.json`으로 추출.

### 3단계: 보정
`scripts/translation-review.json`을 읽고 의심 항목을 해당 JSON 파일에서 직접 수정.

보정 규칙:
- **소수 숫자 변형**: "월 16.4일" → "약 16일" / "16.4 days". 소수를 날짜로 분리하면 안 됨
- **한글 잔존 / 번역 안 됨**: 해당 텍스트를 직접 번역하여 교체
- **일본어 음차 의심**: 한국어를 카타카나 음차한 것을 의미에 맞는 일본어로 교체
- **과도하게 김**: 간결하게 수정

`where` 필드로 파일/위치 특정, `lang` 키의 값을 Edit으로 수정.

### 4단계: 정리
보정 완료 후 `scripts/translation-review.json` 삭제.

## 옵션

- `--only <countryId>`: 특정 국가만 번역 (예: `--only japan`)
- `--dry-run`: 실제 저장 안 하고 미리보기
- `--review`: 번역 품질 검증만 수행
