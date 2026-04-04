#!/usr/bin/env python3
"""
기후 데이터 + 자연재해 기반 월별 추천 데이터 생성 스크립트.

점수 산출 기준:
  1. 기후 점수 (0-100): 기온, 강수량, 강수일수, 습도, 일조시간
  2. 자연재해 감점: 태풍, 홍수 시즌

Rating 매핑:
  80-100 → 5 (최적)
  65-79  → 4 (좋음)
  50-64  → 3 (보통)
  35-49  → 2 (비추)
  0-34   → 1 (부적합)
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data"
RECOMMENDATIONS_DIR = DATA / "monthly-recommendations"

# ============================================================
# 1. 자연재해 감점 데이터 (region, month) → penalty
# ============================================================
# 태풍 위험도 (기상청·PAGASA·JMA 데이터 기반)
TYPHOON_PENALTY = {
    # Japan — 태풍 시즌 7-10월
    ("okinawa", 6): 10, ("okinawa", 7): 25, ("okinawa", 8): 30,
    ("okinawa", 9): 30, ("okinawa", 10): 15,
    ("tokyo", 9): 10, ("tokyo", 10): 5,
    ("osaka", 9): 15, ("osaka", 10): 5,
    # Taiwan — 태풍 시즌 7-10월
    ("taipei", 7): 20, ("taipei", 8): 30, ("taipei", 9): 25, ("taipei", 10): 10,
    ("kaohsiung", 7): 20, ("kaohsiung", 8): 30, ("kaohsiung", 9): 25, ("kaohsiung", 10): 10,
    # Philippines — 태풍 시즌 6-12월 (절정 8-10월)
    ("manila", 6): 15, ("manila", 7): 25, ("manila", 8): 30,
    ("manila", 9): 35, ("manila", 10): 25, ("manila", 11): 10,
    ("boracay", 7): 15, ("boracay", 8): 25, ("boracay", 9): 30, ("boracay", 10): 15,
    ("cebu", 7): 10, ("cebu", 8): 20, ("cebu", 9): 25, ("cebu", 10): 10,
    # Vietnam — 태풍 시즌 (다낭 9-11월)
    ("da-nang", 9): 25, ("da-nang", 10): 35, ("da-nang", 11): 20,
    ("hanoi", 8): 10, ("hanoi", 9): 10,
}

# 홍수 위험도
FLOOD_PENALTY = {
    # Jakarta — 매년 1-2월 대규모 도시 침수
    ("jakarta", 1): 30, ("jakarta", 2): 25, ("jakarta", 3): 10,
    # Bangkok — 9-10월 침수 위험
    ("bangkok", 9): 15, ("bangkok", 10): 10,
    # Venice — 11-1월 아쿠아 알타
    ("venice", 11): 25, ("venice", 12): 15, ("venice", 1): 10,
}

# ============================================================
# 2. 카테고리
# ============================================================
CATEGORIES = {
    "tokyo": "city", "osaka": "culture", "okinawa": "beach", "hokkaido": "adventure",
    "bangkok": "culture", "chiang-mai": "culture", "phuket": "beach",
    "paris": "city", "nice": "beach",
    "new-york": "city", "los-angeles": "city", "hawaii": "beach",
    "sydney": "city", "melbourne": "culture",
    "hanoi": "culture", "ho-chi-minh": "city", "da-nang": "beach",
    "manila": "city", "boracay": "beach", "cebu": "beach",
    "singapore": "city",
    "bali": "beach", "lombok": "beach", "jakarta": "city",
    "taipei": "city", "kaohsiung": "city",
    "madrid": "city", "barcelona": "city", "seville": "culture",
    "rome": "culture", "venice": "culture", "amalfi": "beach",
    "london": "city", "edinburgh": "culture",
    "istanbul": "culture", "cappadocia": "adventure", "antalya": "beach",
    "athens": "culture", "santorini": "beach", "mykonos": "beach",
}

POPULAR = {
    "tokyo", "osaka", "bangkok", "paris", "new-york", "london",
    "rome", "bali", "barcelona", "santorini", "hawaii",
    "phuket", "istanbul", "venice",
}

# ============================================================
# 3. 점수 산출 함수
# ============================================================
def calc_temp_score(high, low):
    """기온 점수 (0-30). 평균 20-26°C가 최적."""
    avg = (high + low) / 2
    if 20 <= avg <= 26:
        return 30
    elif 17 <= avg < 20 or 26 < avg <= 29:
        return 24
    elif 14 <= avg < 17 or 29 < avg <= 32:
        return 18
    elif 10 <= avg < 14 or 32 < avg <= 35:
        return 12
    elif 5 <= avg < 10 or 35 < avg <= 38:
        return 6
    else:  # <5 or >38
        return 0


def calc_rainfall_score(mm):
    """강수량 점수 (0-25). 낮을수록 좋음."""
    if mm < 30:
        return 25
    elif mm < 60:
        return 20
    elif mm < 100:
        return 15
    elif mm < 150:
        return 10
    elif mm < 250:
        return 5
    else:
        return 0


def calc_rainydays_score(days):
    """강수일수 점수 (0-15)."""
    if days < 5:
        return 15
    elif days < 8:
        return 12
    elif days < 12:
        return 8
    elif days < 16:
        return 4
    else:
        return 0


def calc_humidity_score(pct):
    """습도 점수 (0-15). 낮을수록 쾌적."""
    if pct < 55:
        return 15
    elif pct < 65:
        return 12
    elif pct < 75:
        return 8
    elif pct < 85:
        return 4
    else:
        return 0


def calc_sunshine_score(hours):
    """일조시간 점수 (0-15). 길수록 좋음."""
    if hours >= 10:
        return 15
    elif hours >= 8:
        return 12
    elif hours >= 6:
        return 8
    elif hours >= 4:
        return 4
    else:
        return 0


def calc_score(region_id, month, weather):
    """총 점수 산출 (0-100). 기후 점수 - 자연재해 감점."""
    climate = (
        calc_temp_score(weather["tempHigh"], weather["tempLow"])
        + calc_rainfall_score(weather["rainfall"])
        + calc_rainydays_score(weather["rainyDays"])
        + calc_humidity_score(weather["humidity"])
        + calc_sunshine_score(weather["sunshineHours"])
    )
    penalty = (
        TYPHOON_PENALTY.get((region_id, month), 0)
        + FLOOD_PENALTY.get((region_id, month), 0)
    )
    return max(0, climate - penalty)


def score_to_rating(score):
    """점수 → 1-5 rating."""
    if score >= 80:
        return 5
    elif score >= 65:
        return 4
    elif score >= 50:
        return 3
    elif score >= 35:
        return 2
    else:
        return 1


RATING_LABELS = {5: "최적", 4: "좋음", 3: "보통", 2: "비추", 1: "부적합"}

# ============================================================
# 4. 사유 생성
# ============================================================
# ============================================================
# 한줄 코멘트 (40지역 × 12개월)
# ============================================================
COMMENTS = {
    # ── Tokyo ──
    ("tokyo", 1): "겨울 일루미네이션과 맑은 후지산 전망이 매력인 시기",
    ("tokyo", 2): "아직 쌀쌀하지만 매화가 피기 시작하는 초봄",
    ("tokyo", 3): "벚꽃 시즌 시작, 우에노·메구로 벚꽃 명소 인파",
    ("tokyo", 4): "벚꽃(사쿠라) 만개, 일본 여행의 최고 시기",
    ("tokyo", 5): "신록의 계절, 쾌적한 기온으로 산책하기 좋은 시기",
    ("tokyo", 6): "장마(쯔유) 시즌, 비가 잦고 습도가 높아지는 시기",
    ("tokyo", 7): "무더위와 높은 습도, 불꽃축제가 열리는 여름",
    ("tokyo", 8): "한여름 폭염, 에어컨 없이는 힘든 시기",
    ("tokyo", 9): "잔여 더위와 태풍 가능성이 있는 초가을",
    ("tokyo", 10): "단풍이 물드는 가을, 맑고 쾌적한 날씨",
    ("tokyo", 11): "단풍 절정, 가을 축제와 일루미네이션 시작",
    ("tokyo", 12): "쌀쌀한 겨울이지만 연말 분위기와 일루미네이션",
    # ── Osaka ──
    ("osaka", 1): "겨울이지만 오사카성 일루미네이션과 저렴한 항공권",
    ("osaka", 2): "추운 겨울, 실내 먹거리 투어에 좋은 시기",
    ("osaka", 3): "벚꽃 시작, 오사카성과 조폐국 벚꽃 명소",
    ("osaka", 4): "벚꽃 만개, 조폐국 벚꽃 통로가 절정인 시기",
    ("osaka", 5): "쾌적한 봄 날씨, 관광하기 좋은 시기",
    ("osaka", 6): "장마 시즌 시작, 높은 습도와 잦은 비",
    ("osaka", 7): "35°C 이상 폭염, 무더위가 기승을 부리는 시기",
    ("osaka", 8): "폭염 지속, 야외 활동이 힘든 한여름",
    ("osaka", 9): "태풍 리스크와 잔여 더위가 남은 시기",
    ("osaka", 10): "단풍 시즌 시작, 미노오 폭포와 교토 근교 단풍",
    ("osaka", 11): "단풍 절정, 가을 미식의 계절",
    ("osaka", 12): "쌀쌀하지만 연말 일루미네이션과 겨울 먹거리",
    # ── Okinawa ──
    ("okinawa", 1): "비교적 따뜻한 겨울, 고래 관찰 시즌",
    ("okinawa", 2): "겨울이지만 15°C 이상, 고래 관찰 피크",
    ("okinawa", 3): "일본 최초 해수욕장 개장, 봄 바다의 시작",
    ("okinawa", 4): "해변 시즌 본격 개막, 성수기 전 여유로운 바다",
    ("okinawa", 5): "장마 직전, 해변은 좋지만 비 올 확률 증가",
    ("okinawa", 6): "장마(쯔유) 시즌, 폭우가 잦은 시기",
    ("okinawa", 7): "태풍 시즌 시작, 항공편 결항 가능성 높음",
    ("okinawa", 8): "태풍 절정기, 여행 일정이 틀어질 위험 큼",
    ("okinawa", 9): "태풍 리스크 여전, 바다도 파도가 높은 시기",
    ("okinawa", 10): "태풍 시즌 마무리, 따뜻한 바다가 돌아오는 시기",
    ("okinawa", 11): "쾌적한 기온, 다이빙·스노클링 즐기기 좋은 시기",
    ("okinawa", 12): "겨울이지만 온화, 관광객 적어 여유로운 시기",
    # ── Hokkaido ──
    ("hokkaido", 1): "파우더 스노우 스키의 천국, 니세코·루스쓰 최적기",
    ("hokkaido", 2): "삿포로 눈축제와 최고의 스키 시즌",
    ("hokkaido", 3): "아직 눈이 남아있는 초봄, 스키 시즌 막바지",
    ("hokkaido", 4): "눈 녹는 진흙 시즌, 여행에 애매한 시기",
    ("hokkaido", 5): "봄꽃이 피기 시작하지만 아직 쌀쌀한 시기",
    ("hokkaido", 6): "초여름 시작, 라벤더 밭이 색을 입히는 시기",
    ("hokkaido", 7): "라벤더 만개, 25°C의 시원한 여름 피서지",
    ("hokkaido", 8): "여름 피서 시즌, 자연과 해산물의 천국",
    ("hokkaido", 9): "가을 시작, 단풍과 수확의 계절",
    ("hokkaido", 10): "단풍 절정이지만 급격히 추워지는 시기",
    ("hokkaido", 11): "초겨울, 첫 눈이 내리지만 스키장은 아직",
    ("hokkaido", 12): "스키 시즌 개막, 겨울왕국의 시작",
    # ── Bangkok ──
    ("bangkok", 1): "건기 한가운데, 선선한 바람이 부는 여행 최적기",
    ("bangkok", 2): "건기 지속, 기온이 조금씩 오르기 시작",
    ("bangkok", 3): "더위가 시작되는 과도기, 오후 폭염 주의",
    ("bangkok", 4): "송크란(물축제)이 있지만 40°C 극심한 더위",
    ("bangkok", 5): "우기 시작, 매일 오후 스콜이 쏟아지는 시기",
    ("bangkok", 6): "본격 우기, 오후마다 집중 호우",
    ("bangkok", 7): "우기 지속, 도로 침수가 빈번한 시기",
    ("bangkok", 8): "우기와 높은 습도, 야외 관광이 힘든 시기",
    ("bangkok", 9): "우기 절정, 방콕 침수 위험이 가장 높은 시기",
    ("bangkok", 10): "우기 막바지, 비가 줄어들기 시작",
    ("bangkok", 11): "건기 시작, 러이끄라통 축제의 낭만",
    ("bangkok", 12): "건기의 선선한 바람, 연말 분위기의 여행 최적기",
    # ── Chiang Mai ──
    ("chiang-mai", 1): "건기의 서늘한 날씨, 트레킹과 사원 투어 최적기",
    ("chiang-mai", 2): "건기 지속, 쾌적하지만 연무 시작될 수 있는 시기",
    ("chiang-mai", 3): "산불 연무(스모그) 시작, 대기질 급격히 악화",
    ("chiang-mai", 4): "산불 연무 절정, 세계 최악 수준의 대기질",
    ("chiang-mai", 5): "연무 끝자락과 우기 시작이 겹치는 시기",
    ("chiang-mai", 6): "우기이지만 공기가 맑아지고 녹음이 짙어지는 시기",
    ("chiang-mai", 7): "우기 지속, 짧은 오후 소나기 후 맑은 하늘",
    ("chiang-mai", 8): "우기, 산길이 미끄럽고 트레킹 주의",
    ("chiang-mai", 9): "우기 절정, 강우량이 가장 많은 시기",
    ("chiang-mai", 10): "우기 마무리, 논 풍경이 아름다운 시기",
    ("chiang-mai", 11): "이펑 축제, 건기 시작과 함께 환상적인 밤하늘",
    ("chiang-mai", 12): "건기, 서늘하고 맑은 날씨로 트레킹 최적기",
    # ── Phuket ──
    ("phuket", 1): "건기 절정, 맑고 잔잔한 안다만 바다의 최적기",
    ("phuket", 2): "건기 지속, 다이빙과 스노클링 최고 시야",
    ("phuket", 3): "건기이지만 더위가 서서히 올라오는 시기",
    ("phuket", 4): "건기 막바지, 아직 해변을 즐기기 좋은 시기",
    ("phuket", 5): "우기 시작, 파도가 높아지고 해수욕 주의",
    ("phuket", 6): "우기 본격화, 2~3m 파도로 해수욕 위험",
    ("phuket", 7): "우기, 비와 거친 파도가 지속되는 시기",
    ("phuket", 8): "우기 지속, 다이빙 시야가 떨어지는 시기",
    ("phuket", 9): "우기 절정, 가장 비가 많은 시기",
    ("phuket", 10): "우기 끝자락, 비가 줄어들기 시작",
    ("phuket", 11): "건기 시작, 바다가 잔잔해지는 시기",
    ("phuket", 12): "건기 피크, 크리스마스 분위기의 해변 휴양",
    # ── Paris ──
    ("paris", 1): "겨울 한가운데, 관광객 적고 항공권 저렴한 비수기",
    ("paris", 2): "아직 쌀쌀한 겨울, 미술관 투어에 좋은 시기",
    ("paris", 3): "봄기운이 시작, 카페 테라스가 열리기 시작",
    ("paris", 4): "봄 한가운데, 튈르리 정원 꽃과 야외 마르셰",
    ("paris", 5): "장미 만개, 파리 여행의 가장 완벽한 시기",
    ("paris", 6): "긴 일조시간, 센강 산책과 야외 카페의 매력",
    ("paris", 7): "여름 성수기, 바스티유 데이(7/14) 축제",
    ("paris", 8): "여름 피크, 파리지앵은 떠나고 관광객이 채우는 시기",
    ("paris", 9): "관광객 줄고 날씨 쾌적, 가을 파리의 진수",
    ("paris", 10): "가을빛 파리, 뤽상부르 공원 단풍",
    ("paris", 11): "쌀쌀해지고 해가 짧아지는 초겨울",
    ("paris", 12): "크리스마스 마켓과 일루미네이션의 연말 분위기",
    # ── Nice ──
    ("nice", 1): "겨울이지만 온화한 지중해, 해변은 부적합",
    ("nice", 2): "니스 카니발 시즌, 축제 분위기의 겨울",
    ("nice", 3): "봄 시작, 지중해 해안 산책이 쾌적해지는 시기",
    ("nice", 4): "따뜻해지는 봄, 해변 시즌 직전의 여유",
    ("nice", 5): "지중해 해변 시즌 시작, 쾌적한 기온",
    ("nice", 6): "본격 해변 시즌, 따뜻한 바다와 긴 해",
    ("nice", 7): "여름 성수기, 코트다쥐르 해변 만석",
    ("nice", 8): "여름 피크, 해변 혼잡하지만 바다 최고",
    ("nice", 9): "바다 여전히 따뜻(23~25°C), 관광객 줄어든 최적기",
    ("nice", 10): "지중해 황금빛 가을, 온화한 바다",
    ("nice", 11): "가을 끝자락, 해변 시즌 마무리",
    ("nice", 12): "겨울이지만 온화, 크리스마스 마켓",
    # ── New York ──
    ("new-york", 1): "영하의 혹한과 폭설, 브로드웨이와 실내 관광 위주",
    ("new-york", 2): "가장 추운 시기, 밸런타인 분위기의 도시",
    ("new-york", 3): "아직 쌀쌀하지만 봄기운이 느껴지는 시기",
    ("new-york", 4): "센트럴파크에 봄꽃이 피는 시기",
    ("new-york", 5): "센트럴파크 녹음, 뉴욕 여행의 가장 좋은 시기",
    ("new-york", 6): "따뜻한 초여름, 야외 이벤트와 공원 콘서트",
    ("new-york", 7): "폭염과 높은 습도, 에어컨 없이 힘든 시기",
    ("new-york", 8): "무더위 지속, 실외 관광이 힘든 한여름",
    ("new-york", 9): "더위가 물러간 쾌적한 가을의 시작",
    ("new-york", 10): "센트럴파크 단풍 절정, 할로윈의 도시",
    ("new-york", 11): "추워지지만 추수감사절·홀리데이 시즌 시작",
    ("new-york", 12): "록펠러 트리, 홀리데이 쇼핑의 연말 분위기",
    # ── Los Angeles ──
    ("los-angeles", 1): "온화한 겨울, 15°C 전후의 쾌적한 날씨",
    ("los-angeles", 2): "겨울비가 가끔 오지만 대체로 맑은 날씨",
    ("los-angeles", 3): "봄 시작, 야생화가 피는 슈퍼블룸 시즌",
    ("los-angeles", 4): "봄 야생화와 쾌적한 기온, 하이킹 최적기",
    ("los-angeles", 5): "해변 시즌 시작 전 쾌적한 날씨",
    ("los-angeles", 6): "June Gloom(해안 안개), 오전 흐리고 오후 맑음",
    ("los-angeles", 7): "여름 해변 시즌, 산타모니카·베니스 비치",
    ("los-angeles", 8): "여름 피크, 더위지만 해변은 최고",
    ("los-angeles", 9): "여름 인파 줄고, 따뜻한 가을 해변",
    ("los-angeles", 10): "인디언 서머, 맑고 따뜻한 최적기",
    ("los-angeles", 11): "가을 끝자락, 여전히 쾌적한 날씨",
    ("los-angeles", 12): "온화한 겨울, 연말 분위기의 할리우드",
    # ── Hawaii ──
    ("hawaii", 1): "우기이지만 따뜻, 고래 관찰 시즌",
    ("hawaii", 2): "고래 관찰 피크, 서핑 빅웨이브 시즌",
    ("hawaii", 3): "우기 끝자락, 점차 맑아지는 시기",
    ("hawaii", 4): "건기 시작, 맑은 하늘과 쾌적한 기온",
    ("hawaii", 5): "건기, 스노클링과 하이킹 최적기",
    ("hawaii", 6): "건기 절정, 완벽한 해변과 맑은 바다",
    ("hawaii", 7): "여름 피크 시즌, 가족 관광객 많은 시기",
    ("hawaii", 8): "여름 성수기, 서핑·다이빙 최적",
    ("hawaii", 9): "건기 막바지, 관광객 적고 가성비 최고",
    ("hawaii", 10): "날씨 좋고 관광객 적은 황금 시기",
    ("hawaii", 11): "우기 시작, 간간이 소나기가 오는 시기",
    ("hawaii", 12): "홀리데이 피크, 고래 관찰 시즌 시작",
    # ── Sydney ──
    ("sydney", 1): "한여름 성수기, 본다이 비치와 야외 축제",
    ("sydney", 2): "여름 지속, 시드니 마디그라 축제",
    ("sydney", 3): "가을 시작, 아직 해변을 즐길 수 있는 시기",
    ("sydney", 4): "가을 단풍, 쾌적한 기온의 시드니",
    ("sydney", 5): "가을 끝자락, 선선해지는 시기",
    ("sydney", 6): "겨울 시작, 야외 활동이 줄어드는 시기",
    ("sydney", 7): "겨울 한가운데, 비비드 시드니 축제",
    ("sydney", 8): "겨울 끝자락, 봄이 오기 전 가장 추운 시기",
    ("sydney", 9): "봄 시작, 꽃이 피고 기온이 올라가는 시기",
    ("sydney", 10): "봄 한가운데, 야외 활동 최적기",
    ("sydney", 11): "봄 끝자락, 여름 직전의 쾌적한 시기",
    ("sydney", 12): "여름 시작, NYE 불꽃축제와 해변 시즌",
    # ── Melbourne ──
    ("melbourne", 1): "한여름, 호주 오픈 테니스 시즌",
    ("melbourne", 2): "여름 지속, 해변과 야외 바 시즌",
    ("melbourne", 3): "가을 시작, F1 그랑프리 개최",
    ("melbourne", 4): "가을, 멜버른의 카페 문화를 즐기기 좋은 시기",
    ("melbourne", 5): "쌀쌀해지는 초겨울, 실내 문화 활동 위주",
    ("melbourne", 6): "겨울, 비가 잦고 바람 강한 시기",
    ("melbourne", 7): "겨울 한가운데, 춥지만 겨울 나이트마켓",
    ("melbourne", 8): "겨울 끝자락, 아직 추운 시기",
    ("melbourne", 9): "봄 시작, 꽃축제가 열리는 시기",
    ("melbourne", 10): "봄, 정원과 공원이 아름다운 시기",
    ("melbourne", 11): "멜버른 컵 시즌, 봄 이벤트 풍성",
    ("melbourne", 12): "여름 시작, 크리스마스와 야외 문화",
    # ── Hanoi ──
    ("hanoi", 1): "겨울 안개와 보슬비, 쌀쌀하고 흐린 날이 많은 시기",
    ("hanoi", 2): "아직 쌀쌀하지만 봄기운이 시작되는 시기",
    ("hanoi", 3): "봄꽃이 피고 기온이 올라가는 시기",
    ("hanoi", 4): "따뜻한 봄, 하롱베이 크루즈 좋은 시기",
    ("hanoi", 5): "폭염 시작, 35°C 이상 고온다습한 시기",
    ("hanoi", 6): "우기와 극심한 더위가 겹치는 최악의 시기",
    ("hanoi", 7): "우기 절정, 폭우와 폭염이 동시에",
    ("hanoi", 8): "우기 지속, 태풍 영향 가능",
    ("hanoi", 9): "우기 끝자락, 비가 줄어들기 시작",
    ("hanoi", 10): "건기 시작, 25°C의 가장 쾌적한 시기",
    ("hanoi", 11): "건기, 선선하고 맑은 하노이 여행 최적기",
    ("hanoi", 12): "건기 지속, 쌀쌀하지만 맑은 겨울",
    # ── Ho Chi Minh ──
    ("ho-chi-minh", 1): "건기 한가운데, 맑고 쾌적한 여행 최적기",
    ("ho-chi-minh", 2): "건기 절정, 가장 건조한 달",
    ("ho-chi-minh", 3): "건기 지속, 더위가 올라오지만 아직 쾌적",
    ("ho-chi-minh", 4): "더위 본격화, 건기 막바지",
    ("ho-chi-minh", 5): "우기 시작, 매일 오후 스콜이 쏟아짐",
    ("ho-chi-minh", 6): "우기, 오후 집중 호우와 도로 침수",
    ("ho-chi-minh", 7): "우기 지속, 높은 습도",
    ("ho-chi-minh", 8): "우기, 비와 습도가 극심한 시기",
    ("ho-chi-minh", 9): "우기 절정, 침수 빈번",
    ("ho-chi-minh", 10): "우기 끝자락, 비가 줄어들기 시작",
    ("ho-chi-minh", 11): "우기 마무리, 건기로 전환 중",
    ("ho-chi-minh", 12): "건기 시작, 선선한 바람이 부는 여행 적기",
    # ── Da Nang ──
    ("da-nang", 1): "비가 줄지만 아직 흐린 날이 많은 시기",
    ("da-nang", 2): "건기 시작, 날씨가 좋아지는 시기",
    ("da-nang", 3): "건기, 해변 시즌 시작",
    ("da-nang", 4): "건기 절정, 완벽한 해변과 바나힐 관광",
    ("da-nang", 5): "건기 지속, 해변과 마블마운틴 관광 최적기",
    ("da-nang", 6): "더워지지만 아직 해변 즐기기 좋은 시기",
    ("da-nang", 7): "고온이지만 해변 성수기",
    ("da-nang", 8): "태풍 시즌 시작, 비가 잦아지는 시기",
    ("da-nang", 9): "태풍 접근, 폭우가 빈번한 시기",
    ("da-nang", 10): "태풍·폭우 절정, 홍수 위험 가장 높은 시기",
    ("da-nang", 11): "태풍 지속, 해수욕 불가능",
    ("da-nang", 12): "우기 끝자락, 점차 날씨 회복 중",
    # ── Manila ──
    ("manila", 1): "건기 한가운데, 맑고 선선한 관광 최적기",
    ("manila", 2): "건기 절정, 쾌적한 날씨와 축제 시즌",
    ("manila", 3): "건기 지속, 더위가 올라오기 시작",
    ("manila", 4): "극심한 더위, 40°C에 달하는 폭염",
    ("manila", 5): "우기 시작, 폭우와 더위가 동시에",
    ("manila", 6): "몬순 시작, 폭우와 침수 빈번",
    ("manila", 7): "태풍 시즌, 극심한 폭우와 홍수",
    ("manila", 8): "태풍 절정기, 가장 위험한 시기",
    ("manila", 9): "초대형 태풍 빈발, 여행 피해야 할 시기",
    ("manila", 10): "태풍 시즌 끝자락, 비 여전히 많음",
    ("manila", 11): "건기 시작, 날씨 회복 중",
    ("manila", 12): "건기, 크리스마스 축제 분위기의 활기찬 마닐라",
    # ── Boracay ──
    ("boracay", 1): "건기 절정, 투명한 바다와 화이트비치 최적기",
    ("boracay", 2): "건기, 맑은 바다에서 아일랜드 호핑",
    ("boracay", 3): "건기 지속, 해변 컨디션 최고",
    ("boracay", 4): "건기 끝자락, 여전히 해변 좋은 시기",
    ("boracay", 5): "우기 시작 전, 해변 막바지 즐기기",
    ("boracay", 6): "우기(하바갓), 거친 바다와 해수욕 제한",
    ("boracay", 7): "우기, 파도 높고 투어 취소 빈번",
    ("boracay", 8): "우기 지속, 해변 활동 어려운 시기",
    ("boracay", 9): "우기 절정, 페리 결항도 잦은 시기",
    ("boracay", 10): "우기 끝자락, 아직 바다가 거친 시기",
    ("boracay", 11): "건기 시작, 바다가 잔잔해지는 시기",
    ("boracay", 12): "건기, 화이트비치가 빛나는 크리스마스 시즌",
    # ── Cebu ──
    ("cebu", 1): "건기, 맑은 바다에서 고래상어 투어 최적기",
    ("cebu", 2): "건기 절정, 시누록 축제와 다이빙 시즌",
    ("cebu", 3): "건기 지속, 해양 액티비티 최적",
    ("cebu", 4): "건기 끝자락, 아직 해변 좋은 시기",
    ("cebu", 5): "우기 시작, 비가 늘어나는 과도기",
    ("cebu", 6): "우기 본격화, 다이빙 시야 저하",
    ("cebu", 7): "우기 지속, 태풍 영향 가능",
    ("cebu", 8): "우기, 해양 활동 제한되는 시기",
    ("cebu", 9): "태풍 시즌, 비가 가장 많은 시기",
    ("cebu", 10): "우기 끝자락, 비 줄어들기 시작",
    ("cebu", 11): "건기 시작, 다이빙 시야 회복",
    ("cebu", 12): "건기, 크리스마스 분위기의 세부",
    # ── Singapore ──
    ("singapore", 1): "북동 몬순, 비가 가장 많은 시기",
    ("singapore", 2): "몬순 끝자락, 비가 줄어들기 시작",
    ("singapore", 3): "비교적 건조한 시기, 가든스바이더베이 관광",
    ("singapore", 4): "건조한 시기, 야외 관광하기 좋은 시기",
    ("singapore", 5): "과도기, 간간이 소나기",
    ("singapore", 6): "남서 몬순, 간간이 비 오지만 관광 가능",
    ("singapore", 7): "세일 시즌(GSS), 쇼핑하기 좋은 시기",
    ("singapore", 8): "국경일 시즌, 축제 분위기",
    ("singapore", 9): "헤이즈(인니 산불 연무) 가능성 있는 시기",
    ("singapore", 10): "과도기, 비가 늘어나기 시작",
    ("singapore", 11): "북동 몬순 시작, 비 많아지는 시기",
    ("singapore", 12): "몬순 피크, 크리스마스 일루미네이션",
    # ── Bali ──
    ("bali", 1): "우기 한가운데, 매일 폭우와 높은 습도",
    ("bali", 2): "우기 절정, 도로 침수 빈번",
    ("bali", 3): "우기 끝자락, 비가 줄어들기 시작",
    ("bali", 4): "건기 시작, 녹음 짙은 우붓과 맑은 하늘",
    ("bali", 5): "건기, 서핑과 사원 투어 최적기",
    ("bali", 6): "건기 절정, 선선하고 맑은 발리 여행 최적기",
    ("bali", 7): "건기, 성수기라 관광객 많지만 날씨 최고",
    ("bali", 8): "건기, 우붓 예술축제와 해변 시즌",
    ("bali", 9): "건기 막바지, 관광객 줄고 쾌적",
    ("bali", 10): "건기 끝자락, 간간이 소나기 시작",
    ("bali", 11): "우기 시작, 오후 스콜이 잦아지는 시기",
    ("bali", 12): "우기, 연말 성수기라 비에도 관광객 많은 시기",
    # ── Lombok ──
    ("lombok", 1): "우기, 린자니산 트레킹 위험한 시기",
    ("lombok", 2): "우기 절정, 산사태 위험",
    ("lombok", 3): "우기 끝자락, 비 줄어들기 시작",
    ("lombok", 4): "건기 시작, 길리섬 다이빙 시야 회복",
    ("lombok", 5): "건기, 린자니산 트레킹 최적기",
    ("lombok", 6): "건기 절정, 맑은 바다와 길리섬 다이빙",
    ("lombok", 7): "건기, 서핑과 스노클링 최적 컨디션",
    ("lombok", 8): "건기 지속, 해양 액티비티 최고",
    ("lombok", 9): "건기 끝자락, 아직 좋은 컨디션",
    ("lombok", 10): "과도기, 비가 조금씩 시작",
    ("lombok", 11): "우기 시작, 야외 활동 제한",
    ("lombok", 12): "우기, 해양 활동 어려운 시기",
    # ── Jakarta ──
    ("jakarta", 1): "우기 절정, 심각한 도시 침수가 매년 반복",
    ("jakarta", 2): "우기, 홍수와 교통 마비 빈번",
    ("jakarta", 3): "우기 끝자락, 비 줄어들지만 습도 높음",
    ("jakarta", 4): "과도기, 비가 줄고 야외 관광 가능해지는 시기",
    ("jakarta", 5): "건기 시작, 도시 관광 쾌적해지는 시기",
    ("jakarta", 6): "건기, 맑은 날씨의 도시 관광",
    ("jakarta", 7): "건기 절정, 가장 쾌적한 시기",
    ("jakarta", 8): "건기, 독립기념일(8/17) 행사 시즌",
    ("jakarta", 9): "건기 끝자락, 아직 쾌적",
    ("jakarta", 10): "과도기, 비가 조금씩 시작",
    ("jakarta", 11): "우기 시작, 도로 침수 주의",
    ("jakarta", 12): "우기, 침수 위험 증가하는 시기",
    # ── Taipei ──
    ("taipei", 1): "겨울, 안개와 비 잦고 10°C까지 떨어지는 추위",
    ("taipei", 2): "설 연휴(춘절) 시즌, 쌀쌀하지만 축제 분위기",
    ("taipei", 3): "봄 시작, 양명산 벚꽃과 꽃축제",
    ("taipei", 4): "따뜻한 봄, 야시장 투어와 산책 최적기",
    ("taipei", 5): "매화우(장마) 직전, 더위가 시작되는 시기",
    ("taipei", 6): "장마 시작, 폭우가 잦은 시기",
    ("taipei", 7): "태풍 시즌과 극심한 고온다습",
    ("taipei", 8): "태풍 시즌 절정, 35°C 폭염",
    ("taipei", 9): "태풍 리스크 지속, 비 잦은 시기",
    ("taipei", 10): "건기 시작, 가을 단풍과 쾌적한 날씨",
    ("taipei", 11): "건기, 20°C의 쾌적한 가을 관광 최적기",
    ("taipei", 12): "건기 지속, 쌀쌀하지만 야시장과 온천 매력",
    # ── Kaohsiung ──
    ("kaohsiung", 1): "건기, 따뜻한 남부 날씨로 여행 적기",
    ("kaohsiung", 2): "건기, 봄 축제와 꽃시장",
    ("kaohsiung", 3): "건기 지속, 쾌적한 남부 관광",
    ("kaohsiung", 4): "더워지기 시작하지만 아직 쾌적",
    ("kaohsiung", 5): "우기 시작, 비가 늘어나는 시기",
    ("kaohsiung", 6): "우기와 태풍 시즌, 폭우 빈발",
    ("kaohsiung", 7): "태풍+우기, 극심한 더위",
    ("kaohsiung", 8): "태풍 시즌 절정, 폭염과 폭우",
    ("kaohsiung", 9): "태풍 끝자락, 비 줄어들기 시작",
    ("kaohsiung", 10): "건기 시작, 쾌적한 가을 남부",
    ("kaohsiung", 11): "건기, 따뜻하고 쾌적한 여행 최적기",
    ("kaohsiung", 12): "건기, 크리스마스 야시장과 따뜻한 겨울",
    # ── Madrid ──
    ("madrid", 1): "추운 겨울, 프라도 미술관 등 실내 관광 위주",
    ("madrid", 2): "아직 추운 겨울, 카니발 축제",
    ("madrid", 3): "봄 시작, 레티로 공원에 꽃이 피는 시기",
    ("madrid", 4): "봄 한가운데, 야외 테라스 카페 시즌",
    ("madrid", 5): "봄꽃 만개, 산 이시드로 축제의 최적기",
    ("madrid", 6): "더워지기 시작, 밤 산책이 매력인 시기",
    ("madrid", 7): "40°C 넘는 극심한 폭염, 낮에는 야외 불가",
    ("madrid", 8): "폭염 지속, 현지인도 도시를 떠나는 시기",
    ("madrid", 9): "폭염이 물러간 쾌적한 가을 시작",
    ("madrid", 10): "완벽한 가을 날씨, 미식 시즌",
    ("madrid", 11): "쌀쌀해지는 초겨울, 관광객 줄어드는 시기",
    ("madrid", 12): "추운 겨울, 크리스마스 마켓과 연말 분위기",
    # ── Barcelona ──
    ("barcelona", 1): "겨울, 10°C 이하로 한산한 비수기",
    ("barcelona", 2): "겨울이지만 온화, 관광객 적은 시기",
    ("barcelona", 3): "봄 시작, 산책과 가우디 건축 투어 좋은 시기",
    ("barcelona", 4): "따뜻한 봄, 람블라스 거리 산책 최적기",
    ("barcelona", 5): "지중해 봄, 해변 시즌 시작",
    ("barcelona", 6): "본격 해변 시즌, 따뜻한 바다(22°C)",
    ("barcelona", 7): "비치 피크 시즌, 바르셀로네타 해변 만석",
    ("barcelona", 8): "여름 성수기, 그라시아 축제",
    ("barcelona", 9): "관광객 줄고 바다 여전히 따뜻한 최적기",
    ("barcelona", 10): "가을의 바르셀로나, 쾌적한 산책 날씨",
    ("barcelona", 11): "쌀쌀해지는 초겨울, 비수기 시작",
    ("barcelona", 12): "겨울, 크리스마스 마켓과 해산물 시즌",
    # ── Seville ──
    ("seville", 1): "겨울, 비 잦지만 오렌지 나무가 아름다운 시기",
    ("seville", 2): "겨울 끝자락, 봄 축제 준비 시즌",
    ("seville", 3): "봄 시작, 세마나 산타(성주간) 축제",
    ("seville", 4): "페리아 축제, 오렌지 꽃 향기의 세비야 최적기",
    ("seville", 5): "봄 끝자락, 아직 폭염 전의 쾌적한 시기",
    ("seville", 6): "더위 시작, 35°C 넘기 시작",
    ("seville", 7): "45°C까지 오르는 유럽 최악의 폭염",
    ("seville", 8): "폭염 지속, 야외 활동 사실상 불가",
    ("seville", 9): "폭염 물러가지만 아직 30°C대",
    ("seville", 10): "선선한 가을, 플라멩코와 타파스의 계절",
    ("seville", 11): "가을 끝자락, 관광하기 좋은 시기",
    ("seville", 12): "겨울, 크리스마스 마켓과 오렌지 수확",
    # ── Rome ──
    ("rome", 1): "겨울 비, 콜로세움 줄이 짧은 비수기",
    ("rome", 2): "겨울 끝자락, 카니발과 저렴한 항공권",
    ("rome", 3): "봄 시작, 로마 유적지 산책 좋은 시기",
    ("rome", 4): "부활절 시즌, 봄꽃과 20°C의 완벽한 기온",
    ("rome", 5): "로마 봄의 절정, 관광 최적기",
    ("rome", 6): "초여름, 긴 해와 야외 다이닝의 매력",
    ("rome", 7): "35°C 이상 더위, 혼잡하지만 관광은 가능",
    ("rome", 8): "폭염 지속, 현지인은 떠나고 관광객이 채우는 시기",
    ("rome", 9): "관광객 줄고 25°C의 완벽한 가을",
    ("rome", 10): "가을 미식 시즌, 포도 수확과 와인 축제",
    ("rome", 11): "쌀쌀해지지만 관광객 적어 여유로운 시기",
    ("rome", 12): "겨울 비, 크리스마스의 바티칸",
    # ── Venice ──
    ("venice", 1): "겨울 추위, 안개와 아쿠아 알타(침수) 위험",
    ("venice", 2): "베네치아 카니발 시즌, 추위에도 축제 분위기",
    ("venice", 3): "봄 시작, 카니발 후 관광객 줄어드는 시기",
    ("venice", 4): "봄 한가운데, 곤돌라 타기 좋은 시기",
    ("venice", 5): "비엔날레 시작, 20°C의 완벽한 운하 산책",
    ("venice", 6): "초여름, 따뜻하고 긴 해의 베네치아",
    ("venice", 7): "여름 더위, 운하 냄새와 관광객 혼잡",
    ("venice", 8): "더위와 혼잡, 운하 악취 주의",
    ("venice", 9): "베네치아 영화제, 가을의 낭만",
    ("venice", 10): "가을, 아쿠아 알타 시작될 수 있는 시기",
    ("venice", 11): "아쿠아 알타(침수) 최빈 시즌, 산마르코 광장 잠김",
    ("venice", 12): "겨울, 안개와 침수 위험 지속",
    # ── Amalfi ──
    ("amalfi", 1): "겨울, 대부분의 호텔·식당 폐업",
    ("amalfi", 2): "겨울, 폐업 지속과 해안도로 위험",
    ("amalfi", 3): "봄 시작, 일부 시설 오픈 시작",
    ("amalfi", 4): "봄꽃 만개, 레몬 과수원이 아름다운 시기",
    ("amalfi", 5): "레몬 시즌, 해안 절경과 따뜻한 바다",
    ("amalfi", 6): "여름 시작, 해변과 리모첼로의 계절",
    ("amalfi", 7): "극심한 혼잡, 예약 없이는 못 가는 시기",
    ("amalfi", 8): "가장 혼잡한 시기, 인파와 더위",
    ("amalfi", 9): "관광객 줄고 바다 여전히 따뜻한 최적기",
    ("amalfi", 10): "가을, 레몬 수확과 여유로운 해안",
    ("amalfi", 11): "비수기 시작, 시설 폐업 시작",
    ("amalfi", 12): "겨울, 대부분 폐업",
    # ── London ──
    ("london", 1): "어두운 겨울, 뮤지컬과 실내 관광 위주",
    ("london", 2): "겨울 끝자락, 아직 춥고 비 잦은 시기",
    ("london", 3): "봄 시작, 공원에 꽃이 피기 시작",
    ("london", 4): "봄, 하이드파크와 리젠트파크 꽃 만발",
    ("london", 5): "봄 끝자락, 긴 일조시간과 공원 산책",
    ("london", 6): "여름 시작, 밤 10시까지 밝은 긴 해",
    ("london", 7): "여름 성수기, 윔블던과 야외 축제",
    ("london", 8): "여름 피크, 노팅힐 카니발",
    ("london", 9): "여름 끝자락, 쾌적한 초가을",
    ("london", 10): "가을 단풍, 쌀쌀해지는 시기",
    ("london", 11): "초겨울, 16시면 어두워지는 짧은 해",
    ("london", 12): "크리스마스 마켓, 연말 분위기이지만 추움",
    # ── Edinburgh ──
    ("edinburgh", 1): "혹한과 어둠, 일조시간 7시간의 깊은 겨울",
    ("edinburgh", 2): "아직 추운 겨울, 위스키 투어에 적합",
    ("edinburgh", 3): "봄 시작, 서서히 길어지는 해",
    ("edinburgh", 4): "봄, 아서스시트 하이킹 시작",
    ("edinburgh", 5): "봄 끝자락, 축제 시즌 직전",
    ("edinburgh", 6): "스코틀랜드 여름 시작, 밤 11시까지 밝은 백야",
    ("edinburgh", 7): "에든버러 여름, 야외 하이킹 최적기",
    ("edinburgh", 8): "에든버러 프린지 페스티벌, 세계 최대 공연 축제",
    ("edinburgh", 9): "프린지 후 여유로운 가을, 하이랜드 단풍",
    ("edinburgh", 10): "가을 단풍, 쌀쌀해지는 시기",
    ("edinburgh", 11): "초겨울, 어둡고 비 잦은 시기",
    ("edinburgh", 12): "호그마니(새해 축제), 추위 속 연말 분위기",
    # ── Istanbul ──
    ("istanbul", 1): "겨울 비, 보스포루스 강풍이 부는 시기",
    ("istanbul", 2): "겨울 끝자락, 터키식 차 한잔의 여유",
    ("istanbul", 3): "봄 시작, 튤립이 피기 시작하는 시기",
    ("istanbul", 4): "튤립 축제, 봄꽃과 온화한 날씨",
    ("istanbul", 5): "봄 절정, 보스포루스 크루즈 최적기",
    ("istanbul", 6): "여름 시작, 야외 레스토랑과 루프탑 시즌",
    ("istanbul", 7): "여름 더위, 그랜드바자르와 실내 관광",
    ("istanbul", 8): "더위 지속, 아이스크림(돈두르마)의 계절",
    ("istanbul", 9): "더위 물러간 쾌적한 가을 시작",
    ("istanbul", 10): "황금빛 가을, 보스포루스의 가장 아름다운 시기",
    ("istanbul", 11): "쌀쌀해지고 비 시작, 하맘(터키 목욕) 시즌",
    ("istanbul", 12): "겨울, 비 잦지만 따뜻한 터키 음식의 매력",
    # ── Cappadocia ──
    ("cappadocia", 1): "폭설로 열기구 대부분 결항, 겨울왕국 풍경",
    ("cappadocia", 2): "겨울, 열기구 결항 빈번하지만 설경이 환상적",
    ("cappadocia", 3): "봄 시작, 열기구 비행 재개되는 시기",
    ("cappadocia", 4): "야생화 만개, 열기구 최적 조건의 시작",
    ("cappadocia", 5): "열기구 완벽, 봄꽃과 쾌적한 기온",
    ("cappadocia", 6): "따뜻한 초여름, 하이킹과 열기구",
    ("cappadocia", 7): "40°C 폭염, 열기구 조건 악화",
    ("cappadocia", 8): "폭염 지속, 야외 활동 힘든 시기",
    ("cappadocia", 9): "더위 물러간 가을, 열기구 최적 시즌 재개",
    ("cappadocia", 10): "가을 단풍과 열기구, 카파도키아 최고의 시기",
    ("cappadocia", 11): "쌀쌀해지는 늦가을, 열기구 아직 가능",
    ("cappadocia", 12): "폭설과 혹한, 열기구 결항 빈번",
    # ── Antalya ──
    ("antalya", 1): "겨울 비, 해변 부적합하지만 유적지 관광 가능",
    ("antalya", 2): "겨울 끝자락, 아직 해변 시즌 아님",
    ("antalya", 3): "봄 시작, 해안 산책이 쾌적해지는 시기",
    ("antalya", 4): "따뜻해지는 봄, 수영 시작 가능한 시기",
    ("antalya", 5): "해변 시즌 시작, 수온 22°C",
    ("antalya", 6): "본격 해변 시즌, 수온 25°C",
    ("antalya", 7): "비치 피크 시즌, 수온 27°C의 뜨거운 여름",
    ("antalya", 8): "수온 최고(29°C), 지중해 해변의 절정",
    ("antalya", 9): "바다 따뜻하고 관광객 줄어든 최적기",
    ("antalya", 10): "지중해 가을, 수온 23°C로 아직 해수욕 가능",
    ("antalya", 11): "해변 시즌 마무리, 쌀쌀해지는 시기",
    ("antalya", 12): "겨울 비, 해변 부적합",
    # ── Athens ──
    ("athens", 1): "겨울 비, 파르테논은 한산하고 입장 편한 시기",
    ("athens", 2): "겨울 끝자락, 카니발 시즌",
    ("athens", 3): "봄 시작, 유적지 산책 쾌적해지는 시기",
    ("athens", 4): "부활절 축제, 봄꽃과 쾌적한 유적지 관광",
    ("athens", 5): "관광 시즌 시작, 폭염 전 쾌적한 25°C",
    ("athens", 6): "더워지기 시작, 에게해 섬 투어 시즌",
    ("athens", 7): "38°C+ 극심한 폭염, 아크로폴리스 정오 폐쇄",
    ("athens", 8): "폭염 지속, 40°C 이상 빈번하고 산불 위험",
    ("athens", 9): "더위 물러간 가을, 파르테논 쾌적 관광",
    ("athens", 10): "완벽한 가을 날씨, 유적지 관광 최적기",
    ("athens", 11): "쌀쌀해지지만 관광객 적어 여유로운 시기",
    ("athens", 12): "겨울, 비 잦지만 크리스마스 분위기",
    # ── Santorini ──
    ("santorini", 1): "비수기, 대부분 숙소·식당 폐업",
    ("santorini", 2): "겨울, 폐업 지속과 페리 감편",
    ("santorini", 3): "시설 서서히 오픈, 아직 불완전",
    ("santorini", 4): "봄, 관광객 적고 석양이 아름다운 시기",
    ("santorini", 5): "성수기 전 여유, 완벽한 날씨와 석양",
    ("santorini", 6): "여름 시작, 에게해 최고의 석양",
    ("santorini", 7): "성수기, 오이아 석양 명소 극심한 인파",
    ("santorini", 8): "절대 피크, 300만 관광객의 극심한 혼잡",
    ("santorini", 9): "성수기 후 여유, 따뜻한 바다와 와인 수확",
    ("santorini", 10): "가을, 관광객 줄고 아직 따뜻한 시기",
    ("santorini", 11): "비수기 시작, 시설 폐업 시작",
    ("santorini", 12): "겨울, 대부분 폐업",
    # ── Mykonos ──
    ("mykonos", 1): "비수기, 대부분 숙소·식당 폐업",
    ("mykonos", 2): "겨울, 폐업 지속",
    ("mykonos", 3): "시설 서서히 오픈, 아직 불완전",
    ("mykonos", 4): "봄, 해변 산책과 여유로운 시기",
    ("mykonos", 5): "파티 시즌 시작, 완벽한 해변 날씨",
    ("mykonos", 6): "여름 시작, 해변과 나이트라이프 최적",
    ("mykonos", 7): "파티 피크, 비치클럽 만석",
    ("mykonos", 8): "절대 피크, 나이트라이프 최고조",
    ("mykonos", 9): "성수기 후 여유, 따뜻한 바다와 파티",
    ("mykonos", 10): "가을, 수영 가능한 바다(23°C)와 여유",
    ("mykonos", 11): "비수기 시작, 시설 폐업 시작",
    ("mykonos", 12): "겨울, 대부분 폐업",
}


def generate_reason(weather, score, rating, region_id, month):
    """한줄 코멘트 반환. COMMENTS에 있으면 사용, 없으면 자동 생성."""
    key = (region_id, month)
    if key in COMMENTS:
        return COMMENTS[key]
    parts = []
    avg = (weather["tempHigh"] + weather["tempLow"]) / 2

    # 기온
    if avg >= 20 and avg <= 26:
        parts.append(f"쾌적한 기온({avg:.0f}°C)")
    elif avg >= 14 and avg < 20:
        parts.append(f"선선한 날씨({avg:.0f}°C)")
    elif avg > 26 and avg <= 32:
        parts.append(f"따뜻한 날씨({avg:.0f}°C)")
    elif avg > 35:
        parts.append(f"극심한 더위({weather['tempHigh']:.0f}°C)")
    elif avg < 5:
        parts.append(f"혹한({avg:.0f}°C)")
    elif avg < 10:
        parts.append(f"추운 날씨({avg:.0f}°C)")

    # 강수
    if weather["rainfall"] < 30:
        parts.append("비 거의 없음")
    elif weather["rainfall"] < 60:
        parts.append("강수 적음")
    elif weather["rainfall"] >= 200:
        parts.append(f"강수량 {weather['rainfall']:.0f}mm 우기")
    elif weather["rainfall"] >= 150:
        parts.append(f"강수량 {weather['rainfall']:.0f}mm")

    # 일조
    if weather["sunshineHours"] >= 10:
        parts.append("풍부한 일조량")
    elif weather["sunshineHours"] < 4:
        parts.append("짧은 일조시간")

    # 습도
    if weather["humidity"] >= 85:
        parts.append("높은 습도")

    # 자연재해
    key_t = (region_id, month)
    tp = TYPHOON_PENALTY.get(key_t, 0)
    fp = FLOOD_PENALTY.get(key_t, 0)
    if tp >= 25:
        parts.append("태풍 고위험")
    elif tp >= 10:
        parts.append("태풍 주의")
    if fp >= 20:
        parts.append("홍수 위험")

    return ", ".join(parts) if parts else RATING_LABELS[rating]


# ============================================================
# 5. 데이터 로드 & 생성
# ============================================================
def load_all_data():
    countries_index = json.loads((DATA / "countries.json").read_text())
    region_weather = {}
    region_country = {}
    for entry in countries_index:
        cid = entry["id"]
        cdata = json.loads((DATA / "countries" / f"{cid}.json").read_text())
        for r in cdata["regions"]:
            region_weather[r["id"]] = r["monthlyData"]
            region_country[r["id"]] = cid
    return region_weather, region_country


def generate_all():
    weather_data, region_country = load_all_data()

    # 모든 지역의 12개월 점수/rating 계산
    all_ratings = {}  # regionId → [rating1..12]
    all_scores = {}   # regionId → [score1..12]

    for rid, monthly in weather_data.items():
        scores = []
        ratings = []
        for w in monthly:
            s = calc_score(rid, w["month"], w)
            r = score_to_rating(s)
            scores.append(s)
            ratings.append(r)
        all_scores[rid] = scores
        all_ratings[rid] = ratings

    # 점수 분포 출력
    print("[점수 분포]")
    all_s = [s for ss in all_scores.values() for s in ss]
    for label, lo, hi in [("5(최적)", 80, 100), ("4(좋음)", 65, 79),
                           ("3(보통)", 50, 64), ("2(비추)", 35, 49), ("1(부적합)", 0, 34)]:
        cnt = sum(1 for s in all_s if lo <= s <= hi)
        print(f"  Rating {label}: {cnt}개 ({cnt*100//len(all_s)}%)")
    print()

    # monthly-recommendations 생성
    print("[monthly-recommendations 생성]")
    for month in range(1, 13):
        mi = month - 1
        best, gems, avoid = [], [], []

        for rid in weather_data:
            rating = all_ratings[rid][mi]
            score = all_scores[rid][mi]
            w = weather_data[rid][mi]
            cat = CATEGORIES.get(rid, "city")
            reason = generate_reason(w, score, rating, rid, month)

            if rating == 5:
                best.append({"regionId": rid, "category": cat, "reason": reason, "rating": 5})
            elif rating == 4 and rid not in POPULAR:
                gems.append({"regionId": rid, "category": cat, "reason": reason, "rating": 4})

            if rating <= 2:
                avoid.append({"regionId": rid, "reason": reason})

        best.sort(key=lambda x: x["regionId"])
        gems.sort(key=lambda x: x["regionId"])
        avoid.sort(key=lambda x: x["regionId"])
        gems = gems[:5]

        rec = {"month": month, "bestDestinations": best, "hiddenGems": gems, "avoidList": avoid}
        out = RECOMMENDATIONS_DIR / f"{month}.json"
        out.write_text(json.dumps(rec, ensure_ascii=False, indent=2) + "\n")
        print(f"  Month {month:2d}: best={len(best):2d}  gems={len(gems)}  avoid={len(avoid):2d}")

    # travel-comments 업데이트
    print()
    print("[travel-comments 업데이트]")
    comments_dir = DATA / "travel-comments"
    if not comments_dir.exists():
        print("  디렉토리 없음, 스킵")
        return all_ratings

    updated = 0
    for fpath in sorted(comments_dir.glob("*.json")):
        comments = json.loads(fpath.read_text())
        changed = False
        for entry in comments:
            rid, month = entry["regionId"], entry["month"]
            if rid not in all_ratings:
                continue
            new_rating = all_ratings[rid][month - 1]
            w = weather_data[rid][month - 1]
            score = all_scores[rid][month - 1]

            new_summary = generate_reason(w, score, new_rating, rid, month)

            if entry.get("rating") != new_rating or entry.get("summary") != new_summary:
                entry["rating"] = new_rating
                entry["summary"] = new_summary
                changed = True
                updated += 1

            if new_rating == 5 and rid in POPULAR:
                entry["crowdLevel"] = "high"
            elif new_rating == 5:
                entry["crowdLevel"] = "medium"
            elif new_rating <= 2:
                entry["crowdLevel"] = "low"

            if new_rating == 5 and rid in POPULAR:
                entry["priceLevel"] = "high"
            elif new_rating <= 2:
                entry["priceLevel"] = "low"

        if changed:
            fpath.write_text(json.dumps(comments, ensure_ascii=False, indent=2) + "\n")

    print(f"  {updated}개 rating 업데이트")

    # 전체 rating 테이블 출력
    print()
    print("[전체 Rating 테이블]")
    print(f"{'지역':15s} " + " ".join(f"{m:2d}월" for m in range(1, 13)))
    for rid in sorted(all_ratings.keys()):
        row = " ".join(f"  {r}" for r in all_ratings[rid])
        print(f"{rid:15s} {row}")

    return all_ratings


if __name__ == "__main__":
    print("=== 기후+자연재해 기반 추천 데이터 생성 ===\n")
    generate_all()
    print("\n완료!")
