#!/usr/bin/env python3
"""
Comprehensive translation script: handles all travel comment files and monthly recommendations.
- Patches partially-translated files (japan, australia, taiwan, singapore)
- Translates Korean-only files (france, spain, italy, greece, turkey, usa)
- Translates monthly recommendation files
"""
import json
import os

COMMENTS_DIR = "/Users/hh/Desktop/dev/travel-weather/src/data/travel-comments"
RECS_DIR = "/Users/hh/Desktop/dev/travel-weather/src/data/monthly-recommendations"

# ============================================================
# PATCH TRANSLATIONS — for files already in multilingual format
# but with untranslated strings (en == ko)
# ============================================================

PATCH_SUMMARY = {
    # japan - okinawa
    "겨울이지만 15°C 이상, 고래 관찰 피크": {
        "en": "Above 15°C even in winter — peak humpback whale watching season",
        "ja": "冬でも15°C以上、ザトウクジラ観察のピーク",
        "zh": "冬季气温也在15°C以上，座头鲸观赏旺季",
    },
    "비교적 따뜻한 겨울, 고래 관찰 시즌": {
        "en": "Relatively mild winter with whale watching season",
        "ja": "比較的温暖な冬、クジラ観察シーズン",
        "zh": "冬季气候温和，正值观鲸季节",
    },
    "해수욕 시즌 시작, 본토보다 일찍 따뜻해짐": {
        "en": "Beach season opens earlier than mainland Japan",
        "ja": "海水浴シーズン開始、本土より早く暖かくなる",
        "zh": "海水浴季开始，比日本本土更早回暖",
    },
    "쾌적한 기온, 다이빙·스노클링 즐기기 좋은 시기": {
        "en": "Comfortable temperatures — great for diving and snorkeling",
        "ja": "快適な気温でダイビング・シュノーケリングに最適",
        "zh": "气温宜人，非常适合潜水和浮潜",
    },
    "장마 직전, 해변은 좋지만 비 올 확률 증가": {
        "en": "Just before rainy season — beaches are nice but rain chances rise",
        "ja": "梅雨直前、ビーチは良いが雨の確率が増える",
        "zh": "梅雨前夕，海滩不错但降雨概率上升",
    },
    "장마(쯔유) 시즌, 폭우가 잦은 시기": {
        "en": "Tsuyu rainy season — heavy downpours are frequent",
        "ja": "梅雨シーズン、大雨が多い時期",
        "zh": "梅雨季节，暴雨频繁",
    },
    "태풍 시즌 시작, 항공편 결항 가능성 높음": {
        "en": "Typhoon season begins — high risk of flight cancellations",
        "ja": "台風シーズン開始、航空便欠航の可能性が高まる",
        "zh": "台风季开始，航班取消风险较高",
    },
    "태풍 절정기, 여행 일정이 틀어질 위험 큼": {
        "en": "Peak typhoon period — high risk of disrupted travel plans",
        "ja": "台風最盛期、旅行日程が狂うリスクが高い",
        "zh": "台风最旺盛期，旅行计划被打乱的风险极高",
    },
    "태풍 리스크 여전, 바다도 파도가 높은 시기": {
        "en": "Typhoon risk persists — seas remain rough with high waves",
        "ja": "台風リスク継続、海も波が高い時期",
        "zh": "台风风险持续，海浪依然较高",
    },
    "태풍 시즌 마무리, 따뜻한 바다가 돌아오는 시기": {
        "en": "Typhoon season wrapping up — warm seas returning",
        "ja": "台風シーズン終盤、暖かい海が戻ってくる時期",
        "zh": "台风季尾声，温暖的海水重新回归",
    },
    "겨울이지만 온화, 관광객 적어 여유로운 시기": {
        "en": "Mild winter with fewer tourists — a relaxed time to visit",
        "ja": "温暖な冬、観光客が少なくゆったりと過ごせる時期",
        "zh": "冬季温和，游客较少，悠闲游览的好时机",
    },
    # japan - osaka
    "겨울이지만 오사카성 일루미네이션과 저렴한 항공권": {
        "en": "Winter, but Osaka Castle illuminations and cheap flights make it worthwhile",
        "ja": "冬でも大阪城イルミネーションとお得な航空券が魅力",
        "zh": "冬季的大阪城灯饰与便宜的机票让这个时节颇具吸引力",
    },
    "추운 겨울, 실내 먹거리 투어에 좋은 시기": {
        "en": "Cold winter — a great time for indoor food tours",
        "ja": "寒い冬、室内グルメツアーに最適な時期",
        "zh": "寒冬时节，非常适合室内美食之旅",
    },
    "벚꽃 시작, 오사카성과 조폐국 벚꽃 명소": {
        "en": "Cherry blossoms begin at Osaka Castle and the Mint Bureau's famed path",
        "ja": "桜開花、大阪城と造幣局の桜の名所へ",
        "zh": "樱花初开，大阪城与造币局樱花大道闻名遐迩",
    },
    "벚꽃 만개, 조폐국 벚꽃 통로가 절정인 시기": {
        "en": "Full bloom — the Mint Bureau cherry blossom corridor is at its peak",
        "ja": "桜満開、造幣局の桜の通り抜けが最盛期",
        "zh": "樱花满开，造币局樱花通道迎来最美时刻",
    },
    "쾌적한 봄 날씨, 관광하기 좋은 시기": {
        "en": "Pleasant spring weather — ideal for sightseeing",
        "ja": "過ごしやすい春の天気、観光に最適な時期",
        "zh": "春日气候宜人，非常适合观光游览",
    },
    "장마 시즌 시작, 높은 습도와 잦은 비": {
        "en": "Rainy season begins — high humidity and frequent rain",
        "ja": "梅雨シーズン開始、高湿度と雨が多くなる時期",
        "zh": "梅雨季开始，湿度高且雨水频繁",
    },
    "35°C 이상 폭염, 무더위가 기승을 부리는 시기": {
        "en": "Scorching heat above 35°C — the most sweltering time of year",
        "ja": "35°C以上の猛暑、うだるような暑さが続く時期",
        "zh": "气温超过35°C，酷暑难耐的时节",
    },
    "폭염 지속, 야외 활동이 힘든 한여름": {
        "en": "Heat wave continues — outdoor activities are challenging in midsummer",
        "ja": "猛暑続く、野外活動が辛い真夏",
        "zh": "酷热持续，盛夏户外活动十分艰难",
    },
    "태풍 리스크와 잔여 더위가 남은 시기": {
        "en": "Typhoon risk and lingering heat remain",
        "ja": "台風リスクと残暑が残る時期",
        "zh": "台风风险与余热并存的时节",
    },
    "단풍 시즌 시작, 미노오 폭포와 교토 근교 단풍": {
        "en": "Autumn foliage begins at Minoo Falls and around Kyoto",
        "ja": "紅葉シーズン開始、箕面の滝と京都近郊の紅葉",
        "zh": "红叶季开始，箕面瀑布与京都周边一片秋色",
    },
    "단풍 절정, 가을 미식의 계절": {
        "en": "Peak autumn foliage — the season of gourmet autumn cuisine",
        "ja": "紅葉最盛期、秋のグルメシーズン",
        "zh": "红叶盛极，正是品味秋季美食的时节",
    },
    "쌀쌀하지만 연말 일루미네이션과 겨울 먹거리": {
        "en": "Chilly but year-end illuminations and winter street food make it festive",
        "ja": "肌寒いが年末イルミネーションと冬のグルメが楽しめる",
        "zh": "天气转凉，但年末灯饰与冬日美食带来浓浓节日气氛",
    },
    # japan - hokkaido
    "파우더 스노우 스키의 천국, 니세코·루스쓰 최적기": {
        "en": "Powder snow paradise — peak season at Niseko and Rusutsu",
        "ja": "パウダースノースキーの天国、ニセコ・ルスツの最適期",
        "zh": "粉雪滑雪天堂，二世谷与留寿都的最佳时节",
    },
    "삿포로 눈축제와 최고의 스키 시즌": {
        "en": "Sapporo Snow Festival and the best ski season of the year",
        "ja": "さっぽろ雪まつりと最高のスキーシーズン",
        "zh": "札幌雪祭与一年中最棒的滑雪季",
    },
    "아직 눈이 남아있는 초봄, 스키 시즌 막바지": {
        "en": "Early spring with lingering snow — the final stretch of ski season",
        "ja": "雪が残る初春、スキーシーズンの終盤",
        "zh": "初春仍有积雪，滑雪季接近尾声",
    },
    "눈 녹는 진흙 시즌, 여행에 애매한 시기": {
        "en": "Snowmelt muddy season — an awkward time for travel",
        "ja": "雪解けの泥のシーズン、旅行には中途半端な時期",
        "zh": "融雪泥泞季，旅行体验较为尴尬",
    },
    "봄꽃이 피기 시작하지만 아직 쌀쌀한 시기": {
        "en": "Spring flowers begin to bloom, but it's still chilly",
        "ja": "春の花が咲き始めるが、まだ肌寒い時期",
        "zh": "春花开始绽放，但气温仍有些凉意",
    },
    "초여름 시작, 라벤더 밭이 색을 입히는 시기": {
        "en": "Early summer begins as lavender fields start to bloom with colour",
        "ja": "初夏の始まり、ラベンダー畑が色づき始める時期",
        "zh": "初夏来临，薰衣草田开始染上色彩",
    },
    "라벤더 만개, 25°C의 시원한 여름 피서지": {
        "en": "Lavender in full bloom — a cool summer retreat at 25°C",
        "ja": "ラベンダー満開、25°Cの涼しい夏の避暑地",
        "zh": "薰衣草盛开，25°C的清爽夏日避暑胜地",
    },
    "여름 피서 시즌, 자연과 해산물의 천국": {
        "en": "Summer retreat season — a paradise of nature and seafood",
        "ja": "夏の避暑シーズン、自然と海鮮の天国",
        "zh": "夏季避暑时节，大自然与海鲜的天堂",
    },
    "가을 시작, 단풍과 수확의 계절": {
        "en": "Autumn begins — season of foliage and harvest",
        "ja": "秋の始まり、紅葉と収穫の季節",
        "zh": "秋天到来，红叶与丰收的季节",
    },
    "단풍 절정이지만 급격히 추워지는 시기": {
        "en": "Peak autumn foliage but temperatures drop sharply",
        "ja": "紅葉最盛期だが急激に寒くなる時期",
        "zh": "红叶最盛，但气温急剧下降",
    },
    "초겨울, 첫 눈이 내리지만 스키장은 아직": {
        "en": "Early winter — first snowfall arrives but ski resorts aren't open yet",
        "ja": "初冬、初雪が降るがスキー場はまだオープン前",
        "zh": "初冬时节，第一场雪降临，但滑雪场尚未开放",
    },
    "스키 시즌 개막, 겨울왕국의 시작": {
        "en": "Ski season opens — the beginning of a winter wonderland",
        "ja": "スキーシーズン開幕、雪の王国の始まり",
        "zh": "滑雪季开幕，冰雪王国序幕拉开",
    },
    # japan - other
    "삿포로 눈축제와 겨울 스포츠의 계절": {
        "en": "Sapporo Snow Festival and the season of winter sports",
        "ja": "さっぽろ雪まつりと冬のスポーツシーズン",
        "zh": "札幌雪祭与冬季运动季",
    },
    "라벤더 만개, 본토보다 시원한 피서지": {
        "en": "Lavender in full bloom — a cooler escape than the mainland",
        "ja": "ラベンダー満開、本土より涼しい避暑地",
        "zh": "薰衣草盛开，比日本本土更凉爽的避暑胜地",
    },
    "단풍이 물드는 가을, 맑고 쾌적한 날씨": {
        "en": "Autumn colours arrive with clear, comfortable weather",
        "ja": "紅葉が色づく秋、晴れて過ごしやすい天気",
        "zh": "秋色渐浓，天气晴朗宜人",
    },
    "단풍 절정, 가을 축제와 일루미네이션 시작": {
        "en": "Peak foliage — autumn festivals and illuminations begin",
        "ja": "紅葉最盛期、秋祭りとイルミネーション開始",
        "zh": "红叶盛极，秋日祭典与灯饰亮相",
    },
    "쌀쌀한 겨울이지만 연말 분위기와 일루미네이션": {
        "en": "Chilly winter but the year-end atmosphere and illuminations are festive",
        "ja": "肌寒い冬だが年末ムードとイルミネーションが輝く",
        "zh": "冬日寒凉，却有浓厚年末氛围与璀璨灯饰",
    },
    "단풍 명소가 많은 가을": {
        "en": "Autumn with many famous foliage spots",
        "ja": "紅葉の名所が多い秋",
        "zh": "红叶名胜遍布的秋天",
    },
    "성수기이나 태풍 가능성 있음": {
        "en": "Peak season but with typhoon risk",
        "ja": "最盛期だが台風の可能性あり",
        "zh": "旺季，但存在台风风险",
    },
    "태풍 시즌": {
        "en": "Typhoon season",
        "ja": "台風シーズン",
        "zh": "台风季节",
    },
    "홋카이도 여름 피서": {
        "en": "Hokkaido summer escape",
        "ja": "北海道の夏の避暑",
        "zh": "北海道夏季避暑",
    },
    "일본 최초 해수욕장 개장, 봄 바다의 시작": {
        "en": "Japan's first beach opens for the season — spring at the sea begins",
        "ja": "日本初の海水浴場開設、春の海の始まり",
        "zh": "日本最早开放的海滨浴场，春日海洋序幕拉开",
    },
    "해변 시즌 본격 개막, 성수기 전 여유로운 바다": {
        "en": "Full beach season opens — a relaxed sea before the peak crowds",
        "ja": "ビーチシーズン本格開幕、ピーク前の穏やかな海",
        "zh": "海滩季正式开幕，旺季前享受宁静的大海",
    },
    "오사카성 벚꽃이 만개하는 시기": {
        "en": "Osaka Castle cherry blossoms reach full bloom",
        "ja": "大阪城の桜が満開になる時期",
        "zh": "大阪城樱花盛开的时节",
    },
}

PATCH_FIELDS = {
    # japan - okinawa fields
    "에이사 축제 (8월)": {
        "en": "Eisa Festival (August)",
        "ja": "エイサー祭り（8月）",
        "zh": "艾萨舞蹈节（8月）",
    },
    "해변 개장 (3~4월)": {
        "en": "Beach season opens (March–April)",
        "ja": "海水浴場オープン（3〜4月）",
        "zh": "海滩开放（3月至4月）",
    },
    "스키/스노보드 시즌": {
        "en": "Ski / snowboard season",
        "ja": "スキー・スノーボードシーズン",
        "zh": "滑雪/单板滑雪季节",
    },
    "삿포로 눈축제 (2월 초)": {
        "en": "Sapporo Snow Festival (early February)",
        "ja": "さっぽろ雪まつり（2月初旬）",
        "zh": "札幌雪祭（2月初）",
    },
    "후라노 라벤더 축제 (7월)": {
        "en": "Furano Lavender Festival (July)",
        "ja": "富良野ラベンダーフェスティバル（7月）",
        "zh": "富良野薰衣草节（7月）",
    },
    "벚꽃 시즌": {
        "en": "Cherry blossom season",
        "ja": "桜のシーズン",
        "zh": "樱花季节",
    },
    "조폐국 벚꽃 통로 개방": {
        "en": "Osaka Mint Bureau cherry blossom corridor opens",
        "ja": "造幣局の桜の通り抜け開放",
        "zh": "造币局樱花通道开放",
    },
    "미노오 폭포 단풍": {
        "en": "Minoo Falls autumn foliage",
        "ja": "箕面の滝の紅葉",
        "zh": "箕面瀑布红叶",
    },
    "방한복, 패딩, 핫팩. 극한 방한 준비 필수": {
        "en": "Thermal wear, down jacket, hand warmers — extreme cold protection essential",
        "ja": "防寒着、ダウンジャケット、ホッカイロ — 極寒対策は必須",
        "zh": "保暖内衣、羽绒服、暖宝宝，极寒防护必不可少",
    },
    "평균 최저기온 -10°C로 방한 대비 필요": {
        "en": "Average low of -10°C — proper cold-weather gear required",
        "ja": "平均最低気温-10°C、防寒対策が必要",
        "zh": "平均最低气温-10°C，需做好防寒准备",
    },
    "평균 최저기온 -8°C로 방한 대비 필요": {
        "en": "Average low of -8°C — warm clothing essential",
        "ja": "平均最低気温-8°C、防寒対策が必要",
        "zh": "平均最低气温-8°C，需备好保暖衣物",
    },
    "평균 최저기온 -7°C로 방한 대비 필요": {
        "en": "Average low of -7°C — warm clothing essential",
        "ja": "平均最低気温-7°C、防寒対策が必要",
        "zh": "平均最低气温-7°C，需备好保暖衣物",
    },
    "평균 최저기온 -4°C로 방한 대비 필요": {
        "en": "Average low of -4°C — warm clothing essential",
        "ja": "平均最低気温-4°C、防寒対策が必要",
        "zh": "平均最低气温-4°C，需备好保暖衣物",
    },
    "습도가 72%로 다소 높음": {
        "en": "Humidity at 72% — somewhat high",
        "ja": "湿度72%でやや高め",
        "zh": "湿度72%，稍显偏高",
    },
    # rainy day warnings (various counts)
    "비 오는 날이 12.8일로 실내 대안 준비 권장": {
        "en": "12.8 rainy days — have indoor alternatives ready",
        "ja": "雨の日が12.8日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约12.8天，建议准备室内备选方案",
    },
    "비 오는 날이 13.8일로 실내 대안 준비 권장": {
        "en": "13.8 rainy days — have indoor alternatives ready",
        "ja": "雨の日が13.8日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约13.8天，建议准备室内备选方案",
    },
    "비 오는 날이 14.8일로 실내 대안 준비 권장": {
        "en": "14.8 rainy days — have indoor alternatives ready",
        "ja": "雨の日が14.8日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约14.8天，建议准备室内备选方案",
    },
    "비 오는 날이 16.4일로 실내 대안 준비 권장": {
        "en": "16.4 rainy days — have indoor alternatives ready",
        "ja": "雨の日が16.4日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约16.4天，建议准备室内备选方案",
    },
    "월 16.4일 비가 와 야외 일정에 유의": {
        "en": "Rain on 16.4 days this month — take care with outdoor plans",
        "ja": "月16.4日雨が降るため、屋外の予定に注意",
        "zh": "本月约16.4天有雨，户外行程需多加注意",
    },
    "월 17.8일 비가 와 야외 일정에 유의": {
        "en": "Rain on 17.8 days this month — take care with outdoor plans",
        "ja": "月17.8日雨が降るため、屋外の予定に注意",
        "zh": "本月约17.8天有雨，户外行程需多加注意",
    },
    "월 21.4일 비가 와 야외 일정에 유의": {
        "en": "Rain on 21.4 days this month — take care with outdoor plans",
        "ja": "月21.4日雨が降るため、屋外の予定に注意",
        "zh": "本月约21.4天有雨，户外行程需多加注意",
    },
    "월 22일 비가 와 야외 일정에 유의": {
        "en": "Rain on 22 days this month — take care with outdoor plans",
        "ja": "月22日雨が降るため、屋外の予定に注意",
        "zh": "本月约22天有雨，户外行程需多加注意",
    },
    "월 23.4일 비가 와 야외 일정에 유의": {
        "en": "Rain on 23.4 days this month — take care with outdoor plans",
        "ja": "月23.4日雨が降るため、屋外の予定に注意",
        "zh": "本月约23.4天有雨，户外行程需多加注意",
    },
    "월 강수량 166mm로 우기에 해당": {
        "en": "166mm of rainfall this month — rainy season conditions",
        "ja": "月降水量166mmで雨季に該当",
        "zh": "本月降雨量166mm，属于雨季",
    },
    "월 강수량 176mm로 우기에 해당": {
        "en": "176mm of rainfall this month — rainy season conditions",
        "ja": "月降水量176mmで雨季に該当",
        "zh": "本月降雨量176mm，属于雨季",
    },
    "월 강수량 179mm로 우기에 해당": {
        "en": "179mm of rainfall this month — rainy season conditions",
        "ja": "月降水量179mmで雨季に該当",
        "zh": "本月降雨量179mm，属于雨季",
    },
    "월 강수량 218mm로 우기에 해당": {
        "en": "218mm of rainfall this month — rainy season conditions",
        "ja": "月降水量218mmで雨季に該当",
        "zh": "本月降雨量218mm，属于雨季",
    },
    "월 강수량 248mm로 우기에 해당": {
        "en": "248mm of rainfall this month — rainy season conditions",
        "ja": "月降水量248mmで雨季に該当",
        "zh": "本月降雨量248mm，属于雨季",
    },
    "월 강수량 261mm로 우기에 해당": {
        "en": "261mm of rainfall this month — rainy season conditions",
        "ja": "月降水量261mmで雨季に該当",
        "zh": "本月降雨量261mm，属于雨季",
    },
    "월 강수량 274mm로 우기에 해당": {
        "en": "274mm of rainfall this month — rainy season conditions",
        "ja": "月降水量274mmで雨季に該当",
        "zh": "本月降雨量274mm，属于雨季",
    },
    "월 강수량 357mm로 우기에 해당": {
        "en": "357mm of rainfall this month — rainy season conditions",
        "ja": "月降水量357mmで雨季に該当",
        "zh": "本月降雨量357mm，属于雨季",
    },
    "월 강수량 378mm로 우기에 해당": {
        "en": "378mm of rainfall this month — rainy season conditions",
        "ja": "月降水量378mmで雨季に該当",
        "zh": "本月降雨量378mm，属于雨季",
    },
    "강수량이 105mm로 우산 필수": {
        "en": "105mm rainfall — an umbrella is a must",
        "ja": "降水量105mmで傘は必須",
        "zh": "降雨量105mm，雨伞必备",
    },
    "강수량이 127mm로 우산 필수": {
        "en": "127mm rainfall — an umbrella is a must",
        "ja": "降水量127mmで傘は必須",
        "zh": "降雨量127mm，雨伞必备",
    },
    "강수량이 129mm로 우산 필수": {
        "en": "129mm rainfall — an umbrella is a must",
        "ja": "降水量129mmで傘は必須",
        "zh": "降雨量129mm，雨伞必备",
    },
    # singapore patch
    "북동 몬순 시작, 비 많아지는 시기": {
        "en": "Northeast monsoon begins — rainfall picks up noticeably",
        "ja": "北東モンスーン開始、雨が多くなる時期",
        "zh": "东北季风开始，降雨明显增多",
    },
    "몬순 피크, 크리스마스 일루미네이션": {
        "en": "Monsoon peak, but Christmas illuminations light up Orchard Road",
        "ja": "モンスーンピーク、クリスマスイルミネーションがオーチャードを彩る",
        "zh": "季风高峰期，乌节路圣诞灯饰璀璨夺目",
    },
    # australia patch summaries
    "여름 시작, 크리스마스와 야외 문화": {
        "en": "Summer begins — Christmas and outdoor festivals fill the calendar",
        "ja": "夏の始まり、クリスマスとアウトドアカルチャーの季節",
        "zh": "夏天开始，圣诞节与户外文化活动丰富多彩",
    },
    "봄 시작, 꽃축제가 열리는 시기": {
        "en": "Spring begins with flower festivals in bloom",
        "ja": "春の始まり、花まつりが開かれる時期",
        "zh": "春天开始，花卉节庆纷纷登场",
    },
    "봄, 정원과 공원이 아름다운 시기": {
        "en": "Spring — gardens and parks are at their most beautiful",
        "ja": "春、庭園や公園が美しい時期",
        "zh": "春日时节，花园与公园美不胜收",
    },
    "겨울 한가운데, 춥지만 겨울 나이트마켓": {
        "en": "Deep winter — cold, but winter night markets bring warmth",
        "ja": "真冬、寒いが冬のナイトマーケットが楽しい",
        "zh": "隆冬时节，虽然寒冷，但冬日夜市带来暖意",
    },
    "겨울 끝자락, 아직 추운 시기": {
        "en": "End of winter — still cold but spring is on the way",
        "ja": "冬の終わり、まだ寒いが春が近づく時期",
        "zh": "冬末时节，仍有寒意但春天将至",
    },
    "가을 단풍과 와이너리 시즌": {
        "en": "Autumn foliage and winery season",
        "ja": "秋の紅葉とワイナリーシーズン",
        "zh": "秋日红叶与葡萄酒庄季节",
    },
    "멜버른 컵 시즌, 봄 이벤트 풍성": {
        "en": "Melbourne Cup season — spring events are plentiful",
        "ja": "メルボルンカップシーズン、春のイベントが豊富",
        "zh": "墨尔本杯赛马季，春日活动丰富多彩",
    },
    # australia patch fields
    "강수량이 118mm로 우산 필수": {
        "en": "118mm rainfall — an umbrella is a must",
        "ja": "降水量118mmで傘は必須",
        "zh": "降雨量118mm，雨伞必备",
    },
    "호주 오픈 테니스 (1월)": {
        "en": "Australian Open Tennis (January)",
        "ja": "全豪オープンテニス（1月）",
        "zh": "澳大利亚网球公开赛（1月）",
    },
    "호주의 여름, 다양한 페스티벌": {
        "en": "Australian summer — diverse festivals across the country",
        "ja": "オーストラリアの夏、様々なフェスティバル",
        "zh": "澳大利亚的夏天，各类节庆活动丰富多彩",
    },
    "시드니 마디그라 (2~3월)": {
        "en": "Sydney Mardi Gras (February–March)",
        "ja": "シドニーマルディグラ（2〜3月）",
        "zh": "悉尼狂欢节（2至3月）",
    },
    "시드니 로열 이스터 쇼 (3~4월)": {
        "en": "Sydney Royal Easter Show (March–April)",
        "ja": "シドニーロイヤルイースターショー（3〜4月）",
        "zh": "悉尼皇家复活节展（3至4月）",
    },
    "멜버른 푸드 앤 와인 페스티벌 (3월)": {
        "en": "Melbourne Food and Wine Festival (March)",
        "ja": "メルボルンフード＆ワインフェスティバル（3月）",
        "zh": "墨尔本美食与葡萄酒节（3月）",
    },
    "멜버른 컵 (11월, 인근)": {
        "en": "Melbourne Cup (November, nearby)",
        "ja": "メルボルンカップ（11月、近隣）",
        "zh": "墨尔本杯赛马（11月，附近举行）",
    },
    "비 오는 날이 17일로 실내 대안 준비 권장": {
        "en": "17 rainy days — have indoor alternatives ready",
        "ja": "雨の日が17日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约17天，建议准备室内备选方案",
    },
    "월 17일 비가 와 야외 일정에 유의": {
        "en": "Rain on 17 days this month — take care with outdoor plans",
        "ja": "月17日雨が降るため、屋外の予定に注意",
        "zh": "本月约17天有雨，户外行程需多加注意",
    },
    # extra rainy day strings
    "비 오는 날이 13.8일로 실내 대안 준비 권장": {
        "en": "13.8 rainy days — have indoor alternatives ready",
        "ja": "雨の日が13.8日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约13.8天，建议准备室内备选方案",
    },
    "비 오는 날이 12.8일로 실내 대안 준비 권장": {
        "en": "12.8 rainy days — have indoor alternatives ready",
        "ja": "雨の日が12.8日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约12.8天，建议准备室内备선方案",
    },
    "강수량이 105mm로 우산 필수": {
        "en": "105mm rainfall — an umbrella is a must",
        "ja": "降水量105mmで傘は必須",
        "zh": "降雨量105mm，雨伞必备",
    },
    "강수량이 129mm로 우산 필수": {
        "en": "129mm rainfall — an umbrella is a must",
        "ja": "降水量129mmで傘は必須",
        "zh": "降雨量129mm，雨伞必备",
    },
    "습도가 72%로 다소 높음": {
        "en": "Humidity at 72% — somewhat high",
        "ja": "湿度72%でやや高め",
        "zh": "湿度72%，稍显偏高",
    },
    # taiwan patch fields
    "태풍 끝자락, 비 줄어들기 시작": {
        "en": "Tail end of typhoon season — rainfall begins to ease",
        "ja": "台風シーズンの終わり、雨が減り始める時期",
        "zh": "台风季尾声，降雨开始减少",
    },
    "태풍 시즌 절정, 폭염과 폭우": {
        "en": "Peak typhoon season — scorching heat and heavy downpours",
        "ja": "台風シーズン最盛期、猛暑と豪雨",
        "zh": "台风季高峰，酷暑与暴雨交加",
    },
    "태풍+우기, 극심한 더위": {
        "en": "Typhoon and rainy season combined with extreme heat",
        "ja": "台風＋雨季、極端な暑さ",
        "zh": "台风与雨季叠加，酷热难耐",
    },
    "건기 시작, 쾌적한 가을 남부": {
        "en": "Dry season begins — comfortable autumn in southern Taiwan",
        "ja": "乾季開始、過ごしやすい秋の南部",
        "zh": "乾季开始，南台湾秋日气候宜人",
    },
    "건기, 따뜻하고 쾌적한 여행 최적기": {
        "en": "Dry season — warm and comfortable, the best time to travel",
        "ja": "乾季、暖かく過ごしやすい旅行最適期",
        "zh": "乾季，温暖舒适，旅行的最佳时节",
    },
    "건기, 크리스마스 야시장과 따뜻한 겨울": {
        "en": "Dry season — Christmas night markets and mild winter weather",
        "ja": "乾季、クリスマスナイトマーケットと暖かい冬",
        "zh": "乾季，圣诞夜市与温暖冬日",
    },
    "타이완 국경일 (10월 10일)": {
        "en": "Taiwan National Day (October 10)",
        "ja": "台湾国慶節（10月10日）",
        "zh": "台湾国庆日（10月10日）",
    },
    "월 15.6일 비가 와 야외 일정에 유의": {
        "en": "Rain on 15.6 days this month — take care with outdoor plans",
        "ja": "月15.6日雨が降るため、屋外の予定に注意",
        "zh": "本月约15.6天有雨，户外行程需多加注意",
    },
    "월 15.8일 비가 와 야외 일정에 유의": {
        "en": "Rain on 15.8 days this month — take care with outdoor plans",
        "ja": "月15.8日雨が降るため、屋外の予定に注意",
        "zh": "本月约15.8天有雨，户外行程需多加注意",
    },
    "월 20.4일 비가 와 야외 일정에 유의": {
        "en": "Rain on 20.4 days this month — take care with outdoor plans",
        "ja": "月20.4日雨が降るため、屋外の予定に注意",
        "zh": "本月约20.4天有雨，户外行程需多加注意",
    },
    "월 20일 비가 와 야외 일정에 유의": {
        "en": "Rain on 20 days this month — take care with outdoor plans",
        "ja": "月20日雨が降るため、屋外の予定に注意",
        "zh": "本月约20天有雨，户外行程需多加注意",
    },
    "월 강수량 195mm로 우기에 해당": {
        "en": "195mm of rainfall this month — rainy season conditions",
        "ja": "月降水量195mmで雨季に該当",
        "zh": "本月降雨量195mm，属于雨季",
    },
    "월 강수량 225mm로 우기에 해당": {
        "en": "225mm of rainfall this month — rainy season conditions",
        "ja": "月降水量225mmで雨季に該当",
        "zh": "本月降雨量225mm，属于雨季",
    },
    "월 강수량 240mm로 우기에 해당": {
        "en": "240mm of rainfall this month — rainy season conditions",
        "ja": "月降水量240mmで雨季に該当",
        "zh": "本月降雨量240mm，属于雨季",
    },
    "월 강수량 385mm로 우기에 해당": {
        "en": "385mm of rainfall this month — rainy season conditions",
        "ja": "月降水量385mmで雨季に該当",
        "zh": "本月降雨量385mm，属于雨季",
    },
}


def patch_multilingual_file(country):
    """Patch a file that is already in multilingual format but has untranslated strings."""
    filepath = os.path.join(COMMENTS_DIR, f"{country}.json")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    patched = 0
    for entry in data:
        for field in ["summary", "clothingAdvice"]:
            val = entry.get(field)
            if isinstance(val, dict) and val.get("en") == val.get("ko") and val.get("ko"):
                ko = val["ko"]
                if ko in PATCH_SUMMARY:
                    t = PATCH_SUMMARY[ko]
                    entry[field]["en"] = t["en"]
                    entry[field]["ja"] = t["ja"]
                    entry[field]["zh"] = t["zh"]
                    patched += 1
                elif ko in PATCH_FIELDS:
                    t = PATCH_FIELDS[ko]
                    entry[field]["en"] = t["en"]
                    entry[field]["ja"] = t["ja"]
                    entry[field]["zh"] = t["zh"]
                    patched += 1
        for field in ["highlights", "cautions", "events", "tips"]:
            val = entry.get(field)
            if isinstance(val, dict):
                for lang in ["en", "ja", "zh"]:
                    ko_list = val.get("ko", [])
                    lang_list = val.get(lang, [])
                    new_list = []
                    for i, ko_item in enumerate(ko_list):
                        cur = lang_list[i] if i < len(lang_list) else ko_item
                        if cur == ko_item and ko_item:
                            t = PATCH_FIELDS.get(ko_item) or PATCH_SUMMARY.get(ko_item)
                            if t:
                                new_list.append(t[lang])
                                if lang == "en":
                                    patched += 1
                            else:
                                new_list.append(cur)
                        else:
                            new_list.append(cur)
                    val[lang] = new_list

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Patched {country}.json: {patched} strings updated")
    return data


# ============================================================
# NEW COUNTRY TRANSLATIONS
# ============================================================

NEW_SUMMARY = {
    # france - paris
    "겨울 한가운데, 관광객 적고 항공권 저렴한 비수기": {
        "en": "Deep winter low season — fewer tourists and cheaper flights",
        "ja": "真冬のオフシーズン、観光客が少なく航空券もお得",
        "zh": "隆冬淡季，游客稀少，机票价格实惠",
    },
    "아직 쌀쌀한 겨울, 미술관 투어에 좋은 시기": {
        "en": "Still chilly winter — a great time for museum tours",
        "ja": "まだ肌寒い冬、美術館めぐりに最適な時期",
        "zh": "冬意未消，非常适合美术馆之旅",
    },
    "봄기운이 시작, 카페 테라스가 열리기 시작": {
        "en": "Spring stirs — café terraces begin to open",
        "ja": "春の気配が漂い始め、カフェのテラスが開き始める",
        "zh": "春意渐浓，咖啡馆露台开始营业",
    },
    "봄 한가운데, 튈르리 정원 꽃과 야외 마르셰": {
        "en": "Spring in full swing — flowers in Tuileries Garden and outdoor markets",
        "ja": "春真っ盛り、チュイルリー庭園の花と野外マルシェ",
        "zh": "春意正浓，杜乐丽花园百花盛开，户外集市热闹非凡",
    },
    "장미 만개, 파리 여행의 가장 완벽한 시기": {
        "en": "Roses in bloom — the most perfect time to visit Paris",
        "ja": "バラが満開、パリ旅行で最も完璧な時期",
        "zh": "玫瑰盛开，游览巴黎最完美的时节",
    },
    "긴 일조시간, 센강 산책과 야외 카페의 매력": {
        "en": "Long sunny days — Seine riverside walks and outdoor cafés are irresistible",
        "ja": "長い日照時間、セーヌ川沿いの散歩と野外カフェの魅力",
        "zh": "日照时间长，塞纳河畔漫步与露天咖啡馆魅力十足",
    },
    "여름 성수기, 바스티유 데이(7/14) 축제": {
        "en": "Summer peak season with Bastille Day (July 14) celebrations",
        "ja": "夏のピークシーズン、パリ祭（7/14）のお祝い",
        "zh": "夏季旺季，巴士底日（7月14日）庆典热闹非凡",
    },
    "여름 피크, 파리지앵은 떠나고 관광객이 채우는 시기": {
        "en": "Summer peak — Parisians leave town as tourists fill the streets",
        "ja": "夏のピーク、パリジャンが去り観光客が街を埋める時期",
        "zh": "夏季高峰，巴黎人纷纷离城，游客填满街头",
    },
    "관광객 줄고 날씨 쾌적, 가을 파리의 진수": {
        "en": "Crowds thin out and weather is pleasant — the true essence of autumn Paris",
        "ja": "観光客が減り天気も快適、秋のパリの真髄",
        "zh": "游客减少，气候宜人，秋日巴黎的真正精髓",
    },
    "가을빛 파리, 뤽상부르 공원 단풍": {
        "en": "Autumn-tinted Paris — foliage colours fill Luxembourg Gardens",
        "ja": "秋色のパリ、リュクサンブール公園の紅葉",
        "zh": "秋色巴黎，卢森堡公园红叶如画",
    },
    "쌀쌀해지고 해가 짧아지는 초겨울": {
        "en": "Turning chilly with shorter days — early winter arrives",
        "ja": "肌寒くなり日が短くなる初冬",
        "zh": "天气渐凉，白昼变短，初冬来临",
    },
    "크리스마스 마켓과 일루미네이션의 연말 분위기": {
        "en": "Christmas markets and illuminations bring festive year-end atmosphere",
        "ja": "クリスマスマーケットとイルミネーションが年末の雰囲気を演出",
        "zh": "圣诞市集与灯饰营造浓厚的年末节日气氛",
    },
    # france - nice
    "겨울이지만 온화한 지중해, 해변은 부적합": {
        "en": "Mild Mediterranean winter — but beaches are off-season",
        "ja": "温暖な地中海の冬、ただしビーチには不向き",
        "zh": "地中海冬季温和，但海滩不适合游玩",
    },
    "니스 카니발 시즌, 축제 분위기의 겨울": {
        "en": "Nice Carnival season — winter full of festive energy",
        "ja": "ニースカーニバルシーズン、お祭り気分の冬",
        "zh": "尼斯嘉年华季，冬日充满节日气氛",
    },
    "봄 시작, 지중해 해안 산책이 쾌적해지는 시기": {
        "en": "Spring begins — Mediterranean coastal walks become pleasant",
        "ja": "春の始まり、地中海の海岸散歩が気持ちよくなる時期",
        "zh": "春天开始，地中海海岸漫步变得舒适宜人",
    },
    "따뜻해지는 봄, 해변 시즌 직전의 여유": {
        "en": "Warming spring — a relaxed moment just before beach season",
        "ja": "暖かくなる春、ビーチシーズン直前の穏やかな時期",
        "zh": "春意渐暖，海滩季前的从容时光",
    },
    "지중해 해변 시즌 시작, 쾌적한 기온": {
        "en": "Mediterranean beach season begins with comfortable temperatures",
        "ja": "地中海のビーチシーズン開始、快適な気温",
        "zh": "地中海海滩季开始，气温宜人",
    },
    "본격 해변 시즌, 따뜻한 바다와 긴 해": {
        "en": "Full beach season with warm sea and long daylight hours",
        "ja": "本格ビーチシーズン、温かい海と長い日照",
        "zh": "海滩季全面开启，海水温暖，日照时间长",
    },
    "여름 성수기, 코트다쥐르 해변 만석": {
        "en": "Summer peak — Côte d'Azur beaches are packed",
        "ja": "夏のピークシーズン、コート・ダジュールのビーチは満員",
        "zh": "夏季旺季，蔚蓝海岸海滩座无虚席",
    },
    "여름 피크, 해변 혼잡하지만 바다 최고": {
        "en": "Summer peak — beaches are crowded but the sea is superb",
        "ja": "夏のピーク、ビーチは混んでいるが海は最高",
        "zh": "夏季高峰，海滩拥挤但海水绝佳",
    },
    "바다 여전히 따뜻(23~25°C), 관광객 줄어든 최적기": {
        "en": "Sea still warm (23–25°C) with fewer tourists — the sweet spot",
        "ja": "海はまだ温かく（23〜25°C）、観光客が減った最適期",
        "zh": "海水依然温暖（23-25°C），游客减少，正是最佳时节",
    },
    "지중해 황금빛 가을, 온화한 바다": {
        "en": "Golden autumn on the Mediterranean with mild sea temperatures",
        "ja": "地中海の黄金の秋、穏やかな海",
        "zh": "地中海的金色秋天，海水温和宜人",
    },
    "가을 끝자락, 해변 시즌 마무리": {
        "en": "Late autumn — beach season comes to a close",
        "ja": "晩秋、ビーチシーズンの締めくくり",
        "zh": "秋末时节，海滩季渐近尾声",
    },
    "겨울이지만 온화, 크리스마스 마켓": {
        "en": "Mild winter with charming Christmas markets",
        "ja": "温暖な冬、クリスマスマーケットが楽しい",
        "zh": "冬季温和，圣诞市集魅力十足",
    },
    # spain - madrid
    "추운 겨울, 프라도 미술관 등 실내 관광 위주": {
        "en": "Cold winter — indoor sightseeing like the Prado Museum takes centre stage",
        "ja": "寒い冬、プラド美術館など室内観光がメイン",
        "zh": "寒冷的冬天，以普拉多美术馆等室内观光为主",
    },
    "아직 추운 겨울, 카니발 축제": {
        "en": "Still cold winter with carnival festivities",
        "ja": "まだ寒い冬、カーニバル祭りが開かれる",
        "zh": "冬寒未退，嘉年华节日热闹登场",
    },
    "봄 시작, 레티로 공원에 꽃이 피는 시기": {
        "en": "Spring begins — flowers bloom in Retiro Park",
        "ja": "春の始まり、レティーロ公園に花が咲く時期",
        "zh": "春天开始，雷提罗公园百花盛开",
    },
    "봄 한가운데, 야외 테라스 카페 시즌": {
        "en": "Spring in full swing — outdoor terrace café season begins",
        "ja": "春真っ盛り、野外テラスカフェのシーズン",
        "zh": "春意正浓，户外露台咖啡馆季节到来",
    },
    "봄꽃 만개, 산 이시드로 축제의 최적기": {
        "en": "Spring flowers in full bloom — perfect timing for San Isidro Festival",
        "ja": "春の花が満開、サン・イシドロ祭りの最適期",
        "zh": "春花盛开，圣伊西德罗节的最佳时节",
    },
    "더워지기 시작, 밤 산책이 매력인 시기": {
        "en": "Heat starts to build — evening strolls become the highlight",
        "ja": "暑くなり始め、夜の散歩が魅力的な時期",
        "zh": "天气渐热，夜间漫步成为最大亮点",
    },
    "40°C 넘는 극심한 폭염, 낮에는 야외 불가": {
        "en": "Extreme heat above 40°C — outdoor activity in the daytime is impossible",
        "ja": "40°C超えの猛暑、昼間の屋外活動は不可",
        "zh": "极端高温超过40°C，白天无法进行户外活动",
    },
    "폭염 지속, 현지인도 도시를 떠나는 시기": {
        "en": "Heat wave continues — even locals escape the city",
        "ja": "猛暑続く、地元の人も街を離れる時期",
        "zh": "酷暑持续，连当地人也纷纷离开城市",
    },
    "폭염이 물러간 쾌적한 가을 시작": {
        "en": "Heat retreats — a pleasant autumn begins",
        "ja": "猛暑が和らぎ、快適な秋の始まり",
        "zh": "酷热消退，舒适宜人的秋天开始",
    },
    "완벽한 가을 날씨, 미식 시즌": {
        "en": "Perfect autumn weather — gourmet season in full swing",
        "ja": "完璧な秋の天気、グルメシーズン",
        "zh": "秋日气候完美，美食季节到来",
    },
    "쌀쌀해지는 초겨울, 관광객 줄어드는 시기": {
        "en": "Turning chilly in early winter — tourist numbers begin to drop",
        "ja": "肌寒くなる初冬、観光客が減り始める時期",
        "zh": "初冬转凉，游客数量开始减少",
    },
    "추운 겨울, 크리스마스 마켓과 연말 분위기": {
        "en": "Cold winter with Christmas markets and year-end festivities",
        "ja": "寒い冬、クリスマスマーケットと年末の雰囲気",
        "zh": "寒冬时节，圣诞市集与年末节日气氛浓厚",
    },
    # spain - barcelona
    "겨울, 10°C 이하로 한산한 비수기": {
        "en": "Winter below 10°C — quiet low season",
        "ja": "冬、10°C以下で閑散としたオフシーズン",
        "zh": "冬季气温低于10°C，淡季游客稀少",
    },
    "겨울이지만 온화, 관광객 적은 시기": {
        "en": "Mild winter with fewer tourists",
        "ja": "温暖な冬、観光客が少ない時期",
        "zh": "冬季温和，游客较少",
    },
    "봄 시작, 산책과 가우디 건축 투어 좋은 시기": {
        "en": "Spring begins — perfect for strolling and Gaudí architecture tours",
        "ja": "春の始まり、散策やガウディ建築ツアーに最適",
        "zh": "春天开始，非常适合漫步和高迪建筑之旅",
    },
    "따뜻한 봄, 람블라스 거리 산책 최적기": {
        "en": "Warm spring — perfect for strolling Las Ramblas",
        "ja": "暖かい春、ランブラス通りの散策に最適",
        "zh": "温暖的春天，兰布拉斯大道漫步的最佳时节",
    },
    "지중해 봄, 해변 시즌 시작": {
        "en": "Mediterranean spring — beach season begins",
        "ja": "地中海の春、ビーチシーズンの始まり",
        "zh": "地中海春天，海滩季节开始",
    },
    "본격 해변 시즌, 따뜻한 바다(22°C)": {
        "en": "Full beach season with warm sea at 22°C",
        "ja": "本格ビーチシーズン、温かい海（22°C）",
        "zh": "海滩季全面开启，海水温度22°C",
    },
    "비치 피크 시즌, 바르셀로네타 해변 만석": {
        "en": "Peak beach season — Barceloneta beach is packed",
        "ja": "ビーチピークシーズン、バルセロネタビーチは満員",
        "zh": "海滩旺季高峰，巴塞罗内塔海滩座无虚席",
    },
    "여름 성수기, 그라시아 축제": {
        "en": "Summer peak season with the Gràcia Festival",
        "ja": "夏のピークシーズン、グラシア祭り",
        "zh": "夏季旺季，格拉西亚节庆热闹非凡",
    },
    "관광객 줄고 바다 여전히 따뜻한 최적기": {
        "en": "Fewer tourists with the sea still warm — the sweet spot",
        "ja": "観光客が減り、海がまだ温かい最適期",
        "zh": "游客减少，海水依然温暖，正是最佳时节",
    },
    "가을의 바르셀로나, 쾌적한 산책 날씨": {
        "en": "Autumn Barcelona with pleasant weather for walking",
        "ja": "秋のバルセロナ、快適な散歩日和",
        "zh": "秋日巴塞罗那，气候宜人适合散步",
    },
    "쌀쌀해지는 초겨울, 비수기 시작": {
        "en": "Early winter turning chilly — low season begins",
        "ja": "肌寒くなる初冬、オフシーズンの始まり",
        "zh": "初冬转凉，淡季开始",
    },
    "겨울, 크리스마스 마켓과 해산물 시즌": {
        "en": "Winter — Christmas markets and seafood season",
        "ja": "冬、クリスマスマーケットと海鮮シーズン",
        "zh": "冬季，圣诞市集与海鲜季节",
    },
    # spain - seville
    "겨울, 비 잦지만 오렌지 나무가 아름다운 시기": {
        "en": "Winter — frequent rain but the orange trees are beautiful",
        "ja": "冬、雨は多いがオレンジの木が美しい時期",
        "zh": "冬季多雨，但橙树风景如画",
    },
    "겨울 끝자락, 봄 축제 준비 시즌": {
        "en": "End of winter — preparations for spring festivals begin",
        "ja": "冬の終わり、春祭りの準備シーズン",
        "zh": "冬末时节，春日节庆准备季到来",
    },
    "봄 시작, 세마나 산타(성주간) 축제": {
        "en": "Spring begins with Semana Santa (Holy Week) processions",
        "ja": "春の始まり、セマナ・サンタ（聖週間）祭り",
        "zh": "春天开始，圣周（塞马纳圣达）游行盛大举行",
    },
    "페리아 축제, 오렌지 꽃 향기의 세비야 최적기": {
        "en": "Feria de Abril — Seville at its finest with orange blossom fragrance",
        "ja": "フェリア祭り、オレンジの花の香りに包まれたセビリャ最盛期",
        "zh": "四月节庆，橙花香气中的塞维利亚最美时节",
    },
    "봄 끝자락, 아직 폭염 전의 쾌적한 시기": {
        "en": "Late spring — still comfortable before the heat wave hits",
        "ja": "春の終わり、猛暑前のまだ快適な時期",
        "zh": "春末时节，酷暑来临前的舒适时光",
    },
    "더위 시작, 35°C 넘기 시작": {
        "en": "Heat begins to build — temperatures climb above 35°C",
        "ja": "暑さが始まり、35°Cを超え始める",
        "zh": "天气开始炎热，气温超过35°C",
    },
    "45°C까지 오르는 유럽 최악의 폭염": {
        "en": "Europe's most brutal heat wave — temperatures soar to 45°C",
        "ja": "ヨーロッパ最悪の猛暑、45°Cに達することも",
        "zh": "欧洲最酷烈的热浪，气温高达45°C",
    },
    "폭염 지속, 야외 활동 사실상 불가": {
        "en": "Heat wave continues — outdoor activity is practically impossible",
        "ja": "猛暑続く、屋外活動は事実上不可能",
        "zh": "酷暑持续，户外活动几乎无法进行",
    },
    "폭염 물러가지만 아직 30°C대": {
        "en": "Heat subsides but temperatures remain in the 30s",
        "ja": "猛暑が和らぐが、まだ30°C台",
        "zh": "酷热消退，但气温仍在30多度",
    },
    "선선한 가을, 플라멩코와 타파스의 계절": {
        "en": "Cool autumn — the season of flamenco and tapas",
        "ja": "涼しい秋、フラメンコとタパスの季節",
        "zh": "凉爽的秋天，弗拉明戈与塔帕斯的季节",
    },
    "가을 끝자락, 관광하기 좋은 시기": {
        "en": "Late autumn — still a good time for sightseeing",
        "ja": "晩秋、観光に適した時期",
        "zh": "秋末时节，依然是观光的好时机",
    },
    "겨울, 크리스마스 마켓과 오렌지 수확": {
        "en": "Winter — Christmas markets and orange harvest season",
        "ja": "冬、クリスマスマーケットとオレンジの収穫",
        "zh": "冬季，圣诞市集与橙子丰收季节",
    },
    # italy - rome
    "겨울 비, 콜로세움 줄이 짧은 비수기": {
        "en": "Winter rain — Colosseum queues are short in the off-season",
        "ja": "冬の雨、コロッセウムの行列が短いオフシーズン",
        "zh": "冬雨绵绵，淡季时斗兽场排队短暂",
    },
    "겨울 끝자락, 카니발과 저렴한 항공권": {
        "en": "End of winter — carnival season and cheap flights",
        "ja": "冬の終わり、カーニバルとお得な航空券",
        "zh": "冬末时节，嘉年华季与便宜机票",
    },
    "봄 시작, 로마 유적지 산책 좋은 시기": {
        "en": "Spring begins — pleasant for strolling Rome's ancient sites",
        "ja": "春の始まり、ローマの遺跡散策に最適な時期",
        "zh": "春天开始，漫步罗马古迹的好时节",
    },
    "부활절 시즌, 봄꽃과 20°C의 완벽한 기온": {
        "en": "Easter season — spring flowers and a perfect 20°C",
        "ja": "イースターシーズン、春の花と完璧な20°C",
        "zh": "复活节季节，春花盛开，气温完美的20°C",
    },
    "로마 봄의 절정, 관광 최적기": {
        "en": "Rome's spring at its peak — the best time for tourism",
        "ja": "ローマの春の絶頂期、観光の最適期",
        "zh": "罗马春天的巅峰，最佳旅游时节",
    },
    "초여름, 긴 해와 야외 다이닝의 매력": {
        "en": "Early summer with long daylight hours and irresistible outdoor dining",
        "ja": "初夏、長い日照と野外ダイニングの魅力",
        "zh": "初夏时节，日照时间长，户外用餐魅力无限",
    },
    "35°C 이상 더위, 혼잡하지만 관광은 가능": {
        "en": "Heat above 35°C — crowded, but sightseeing is still manageable",
        "ja": "35°C以上の暑さ、混雑しているが観光は可能",
        "zh": "气温超过35°C，人潮拥挤但仍可观光",
    },
    "폭염 지속, 현지인은 떠나고 관광객이 채우는 시기": {
        "en": "Heat wave continues — locals leave as tourists fill the city",
        "ja": "猛暑続く、地元の人が去り観光客が街を埋める時期",
        "zh": "酷暑持续，当地人离城，游客填满街头",
    },
    "관광객 줄고 25°C의 완벽한 가을": {
        "en": "Crowds thin out and a perfect 25°C autumn settles in",
        "ja": "観光客が減り、完璧な25°Cの秋",
        "zh": "游客减少，秋日气温完美的25°C",
    },
    "가을 미식 시즌, 포도 수확과 와인 축제": {
        "en": "Autumn gourmet season — grape harvest and wine festivals",
        "ja": "秋のグルメシーズン、ブドウの収穫とワイン祭り",
        "zh": "秋季美食季，葡萄采收与葡萄酒节庆",
    },
    "쌀쌀해지지만 관광객 적어 여유로운 시기": {
        "en": "Turning cooler but fewer tourists make for a relaxed visit",
        "ja": "肌寒くなるが観光客が少なくゆっくり過ごせる時期",
        "zh": "天气转凉，游客减少，悠闲观光的好时机",
    },
    "겨울 비, 크리스마스의 바티칸": {
        "en": "Winter rain — the Vatican in Christmas atmosphere",
        "ja": "冬の雨、クリスマスのバチカン",
        "zh": "冬雨中的梵蒂冈，圣诞气氛浓厚",
    },
    # italy - venice
    "겨울 추위, 안개와 아쿠아 알타(침수) 위험": {
        "en": "Winter cold with fog and risk of acqua alta (flooding)",
        "ja": "冬の寒さ、霧とアクア・アルタ（浸水）のリスク",
        "zh": "冬季寒冷，有雾，并存在高水位（aqua alta）洪涝风险",
    },
    "베네치아 카니발 시즌, 추위에도 축제 분위기": {
        "en": "Venice Carnival season — festive atmosphere despite the cold",
        "ja": "ヴェネツィア・カーニバルシーズン、寒さの中も祭りの雰囲気",
        "zh": "威尼斯狂欢节季，尽管寒冷却节日气氛浓厚",
    },
    "봄 시작, 카니발 후 관광객 줄어드는 시기": {
        "en": "Spring begins — tourist numbers drop after Carnival",
        "ja": "春の始まり、カーニバル後に観光客が減る時期",
        "zh": "春天开始，嘉年华后游客减少",
    },
    "봄 한가운데, 곤돌라 타기 좋은 시기": {
        "en": "Spring in full swing — ideal time for a gondola ride",
        "ja": "春真っ盛り、ゴンドラに乗るのに最適な時期",
        "zh": "春意正浓，乘坐贡多拉的绝佳时节",
    },
    "비엔날레 시작, 20°C의 완벽한 운하 산책": {
        "en": "Biennale begins — perfect canal walks at 20°C",
        "ja": "ビエンナーレ開始、完璧な20°Cの運河散策",
        "zh": "双年展开幕，20°C的完美运河漫步",
    },
    "초여름, 따뜻하고 긴 해의 베네치아": {
        "en": "Early summer — warm and long-day Venice",
        "ja": "初夏、暖かく日の長いヴェネツィア",
        "zh": "初夏时节，温暖且日照时间长的威尼斯",
    },
    "여름 더위, 운하 냄새와 관광객 혼잡": {
        "en": "Summer heat with canal odours and tourist crowds",
        "ja": "夏の暑さ、運河の臭いと観光客の混雑",
        "zh": "夏日酷热，运河气味与游客拥挤",
    },
    "더위와 혼잡, 운하 악취 주의": {
        "en": "Heat, crowds and canal odour — be prepared",
        "ja": "暑さと混雑、運河の悪臭に注意",
        "zh": "酷热、拥挤，注意运河异味",
    },
    "베네치아 영화제, 가을의 낭만": {
        "en": "Venice Film Festival — autumn romance on the canals",
        "ja": "ヴェネツィア国際映画祭、秋のロマンス",
        "zh": "威尼斯电影节，运河秋日浪漫",
    },
    "가을, 아쿠아 알타 시작될 수 있는 시기": {
        "en": "Autumn — acqua alta flooding may begin",
        "ja": "秋、アクア・アルタが始まる可能性がある時期",
        "zh": "秋天，高水位洪涝可能开始",
    },
    "아쿠아 알타(침수) 최빈 시즌, 산마르코 광장 잠김": {
        "en": "Peak acqua alta season — St. Mark's Square frequently submerged",
        "ja": "アクア・アルタ最多シーズン、サン・マルコ広場が水没することも",
        "zh": "高水位洪涝最频繁季节，圣马可广场常被淹没",
    },
    "겨울, 안개와 침수 위험 지속": {
        "en": "Winter — fog and flooding risk continue",
        "ja": "冬、霧と浸水リスクが続く",
        "zh": "冬季，雾气与洪涝风险持续",
    },
    # italy - amalfi
    "겨울, 대부분의 호텔·식당 폐업": {
        "en": "Winter — most hotels and restaurants are closed",
        "ja": "冬、ほとんどのホテル・レストランが閉業",
        "zh": "冬季，大多数酒店和餐厅停业",
    },
    "겨울, 폐업 지속과 해안도로 위험": {
        "en": "Winter — closures continue and coastal roads can be hazardous",
        "ja": "冬、閉業が続き海岸道路が危険な場合も",
        "zh": "冬季，停业持续，海岸公路可能存在危险",
    },
    "봄 시작, 일부 시설 오픈 시작": {
        "en": "Spring begins — some facilities start to reopen",
        "ja": "春の始まり、一部の施設がオープンし始める",
        "zh": "春天开始，部分设施开始重新营业",
    },
    "봄꽃 만개, 레몬 과수원이 아름다운 시기": {
        "en": "Spring flowers in full bloom — lemon orchards are beautiful",
        "ja": "春の花が満開、レモン農園が美しい時期",
        "zh": "春花盛开，柠檬果园美景如画",
    },
    "레몬 시즌, 해안 절경과 따뜻한 바다": {
        "en": "Lemon season with stunning coastal views and warm sea",
        "ja": "レモンシーズン、海岸の絶景と暖かい海",
        "zh": "柠檬季节，壮观的海岸景色与温暖的大海",
    },
    "여름 시작, 해변과 리모첼로의 계절": {
        "en": "Summer begins — season of beaches and limoncello",
        "ja": "夏の始まり、ビーチとリモンチェッロの季節",
        "zh": "夏天开始，海滩与柠檬酒的季节",
    },
    "극심한 혼잡, 예약 없이는 못 가는 시기": {
        "en": "Extreme crowds — impossible to visit without reservations",
        "ja": "極度の混雑、予約なしでは行けない時期",
        "zh": "极度拥挤，没有预订几乎无法到访",
    },
    "가장 혼잡한 시기, 인파와 더위": {
        "en": "The most crowded period — overwhelming heat and crowds",
        "ja": "最も混雑する時期、人波と暑さ",
        "zh": "最拥挤的时节，人潮与酷热并存",
    },
    "관광객 줄고 바다 여전히 따뜻한 최적기": {
        "en": "Fewer tourists with the sea still warm — the sweet spot",
        "ja": "観光客が減り、海がまだ温かい最適期",
        "zh": "游客减少，海水依然温暖，正是最佳时节",
    },
    "가을, 레몬 수확과 여유로운 해안": {
        "en": "Autumn — lemon harvest and a relaxed coastline",
        "ja": "秋、レモンの収穫と落ち着いた海岸",
        "zh": "秋天，柠檬采收与悠闲的海岸",
    },
    "비수기 시작, 시설 폐업 시작": {
        "en": "Low season begins — facilities start to close",
        "ja": "オフシーズン開始、施設が閉まり始める",
        "zh": "淡季开始，各设施陆续停业",
    },
    "겨울, 대부분 폐업": {
        "en": "Winter — most places are closed",
        "ja": "冬、ほとんどが閉業",
        "zh": "冬季，大多数地方停业",
    },
    # greece - athens
    "겨울 비, 파르테논은 한산하고 입장 편한 시기": {
        "en": "Winter rain — the Parthenon is quiet and easy to enter",
        "ja": "冬の雨、パルテノン神殿は閑散として入場しやすい時期",
        "zh": "冬雨时节，帕特农神庙人稀，入场方便",
    },
    "겨울 끝자락, 카니발 시즌": {
        "en": "End of winter — carnival season",
        "ja": "冬の終わり、カーニバルシーズン",
        "zh": "冬末时节，嘉年华季节",
    },
    "봄 시작, 유적지 산책 쾌적해지는 시기": {
        "en": "Spring begins — pleasant walks among the ancient ruins",
        "ja": "春の始まり、遺跡の散策が気持ちよくなる時期",
        "zh": "春天开始，在古遗址间漫步变得舒适宜人",
    },
    "부활절 축제, 봄꽃과 쾌적한 유적지 관광": {
        "en": "Easter celebrations with spring flowers and comfortable sightseeing",
        "ja": "イースターのお祝い、春の花と快適な遺跡観光",
        "zh": "复活节庆典，春花盛开，舒适的古迹游览",
    },
    "관광 시즌 시작, 폭염 전 쾌적한 25°C": {
        "en": "Tourism season opens — comfortable 25°C before the heat wave",
        "ja": "観光シーズン開始、猛暑前の快適な25°C",
        "zh": "旅游季开始，酷暑来临前舒适的25°C",
    },
    "더워지기 시작, 에게해 섬 투어 시즌": {
        "en": "Heat starts to build — Aegean island tour season begins",
        "ja": "暑くなり始め、エーゲ海の島ツアーシーズン",
        "zh": "天气开始炎热，爱琴海岛屿游览季节到来",
    },
    "38°C+ 극심한 폭염, 아크로폴리스 정오 폐쇄": {
        "en": "Extreme heat above 38°C — the Acropolis closes at midday",
        "ja": "38°C超えの猛暑、アクロポリスは正午に閉鎖",
        "zh": "极端高温超过38°C，雅典卫城中午关闭",
    },
    "폭염 지속, 40°C 이상 빈번하고 산불 위험": {
        "en": "Heat wave continues — temperatures above 40°C frequent with wildfire risk",
        "ja": "猛暑続く、40°C以上が頻繁で山火事の危険",
        "zh": "酷暑持续，频繁超过40°C，山火风险高",
    },
    "더위 물러간 가을, 파르테논 쾌적 관광": {
        "en": "Heat retreats — comfortable autumn sightseeing at the Parthenon",
        "ja": "暑さが和らいだ秋、パルテノン神殿を快適に観光",
        "zh": "酷热消退，秋日舒适游览帕特农神庙",
    },
    "완벽한 가을 날씨, 유적지 관광 최적기": {
        "en": "Perfect autumn weather — the best time to tour ancient sites",
        "ja": "完璧な秋の天気、遺跡観光の最適期",
        "zh": "秋日气候完美，游览古迹的最佳时节",
    },
    "쌀쌀해지지만 관광객 적어 여유로운 시기": {
        "en": "Turning cooler but fewer tourists make for a relaxed visit",
        "ja": "肌寒くなるが観光客が少なくゆっくり過ごせる時期",
        "zh": "天气转凉，游客减少，悠闲游览的好时机",
    },
    "겨울, 비 잦지만 크리스마스 분위기": {
        "en": "Winter — frequent rain but a lovely Christmas atmosphere",
        "ja": "冬、雨は多いがクリスマスの雰囲気",
        "zh": "冬季多雨，但圣诞气氛浓厚",
    },
    # greece - santorini
    "비수기, 대부분 숙소·식당 폐업": {
        "en": "Off-season — most accommodation and restaurants are closed",
        "ja": "オフシーズン、ほとんどの宿泊施設・レストランが閉業",
        "zh": "淡季，大多数住宿和餐厅停业",
    },
    "겨울, 폐업 지속과 페리 감편": {
        "en": "Winter — closures continue and ferry services are reduced",
        "ja": "冬、閉業が続きフェリーも減便",
        "zh": "冬季，停业持续，轮渡班次减少",
    },
    "시설 서서히 오픈, 아직 불완전": {
        "en": "Facilities gradually reopening — still not fully operational",
        "ja": "施設が徐々にオープン、まだ完全ではない",
        "zh": "设施逐渐重新开放，尚未完全运营",
    },
    "봄, 관광객 적고 석양이 아름다운 시기": {
        "en": "Spring — few tourists and breathtaking sunsets",
        "ja": "春、観光客が少なく夕日が美しい時期",
        "zh": "春天，游客稀少，落日美不胜收",
    },
    "성수기 전 여유, 완벽한 날씨와 석양": {
        "en": "Before peak season — perfect weather and stunning sunsets",
        "ja": "ピーク前の余裕、完璧な天気と夕日",
        "zh": "旺季前的悠闲时光，完美天气与壮观日落",
    },
    "여름 시작, 에게해 최고의 석양": {
        "en": "Summer begins — the finest Aegean sunsets",
        "ja": "夏の始まり、エーゲ海最高の夕日",
        "zh": "夏天开始，爱琴海最美的落日",
    },
    "성수기, 오이아 석양 명소 극심한 인파": {
        "en": "Peak season — enormous crowds at Oia's sunset viewpoint",
        "ja": "ピークシーズン、オイアの夕日スポットは激しい混雑",
        "zh": "旺季，伊亚落日观景点人山人海",
    },
    "절대 피크, 300만 관광객의 극심한 혼잡": {
        "en": "Absolute peak — 3 million tourists and extreme overcrowding",
        "ja": "絶対的なピーク、300万人の観光客で極度の混雑",
        "zh": "绝对高峰，300万游客造成极度拥挤",
    },
    "성수기 후 여유, 따뜻한 바다와 와인 수확": {
        "en": "Post-peak calm — warm sea and grape harvest season",
        "ja": "ピーク後の余裕、暖かい海とブドウの収穫",
        "zh": "旺季后的从容时光，温暖的大海与葡萄丰收",
    },
    "가을, 관광객 줄고 아직 따뜻한 시기": {
        "en": "Autumn — tourist numbers fall and it's still pleasantly warm",
        "ja": "秋、観光客が減り、まだ暖かい時期",
        "zh": "秋天，游客减少，气温依然温暖宜人",
    },
    "비수기 시작, 시설 폐업 시작": {
        "en": "Off-season begins — facilities start to close",
        "ja": "オフシーズン開始、施設が閉まり始める",
        "zh": "淡季开始，各设施陆续停业",
    },
    "겨울, 대부분 폐업": {
        "en": "Winter — most places are closed",
        "ja": "冬、ほとんどが閉業",
        "zh": "冬季，大多数地方停业",
    },
    # greece - mykonos
    "비수기, 대부분 숙소·식당 폐업": {
        "en": "Off-season — most accommodation and restaurants are closed",
        "ja": "オフシーズン、ほとんどの宿泊施設・レストランが閉業",
        "zh": "淡季，大多数住宿和餐厅停业",
    },
    "겨울, 폐업 지속": {
        "en": "Winter — closures continue",
        "ja": "冬、閉業が続く",
        "zh": "冬季，停业持续",
    },
    "봄, 해변 산책과 여유로운 시기": {
        "en": "Spring — beach strolls and a relaxed pace",
        "ja": "春、ビーチ散策と余裕のある時期",
        "zh": "春天，海滩漫步，节奏悠闲",
    },
    "파티 시즌 시작, 완벽한 해변 날씨": {
        "en": "Party season begins with perfect beach weather",
        "ja": "パーティーシーズン開始、完璧なビーチの天気",
        "zh": "派对季开始，海滩天气完美",
    },
    "여름 시작, 해변과 나이트라이프 최적": {
        "en": "Summer begins — beaches and nightlife at their best",
        "ja": "夏の始まり、ビーチとナイトライフが最適",
        "zh": "夏天开始，海滩与夜生活达到最佳状态",
    },
    "파티 피크, 비치클럽 만석": {
        "en": "Party peak — beach clubs are fully packed",
        "ja": "パーティーピーク、ビーチクラブは満席",
        "zh": "派对高峰，海滩俱乐部座无虚席",
    },
    "절대 피크, 나이트라이프 최고조": {
        "en": "Absolute peak — nightlife at its most intense",
        "ja": "絶対的なピーク、ナイトライフが最高潮",
        "zh": "绝对高峰，夜生活达到最高潮",
    },
    "성수기 후 여유, 따뜻한 바다와 파티": {
        "en": "Post-peak calm — warm sea and good parties",
        "ja": "ピーク後の余裕、暖かい海とパーティー",
        "zh": "旺季后的从容时光，温暖海水与精彩派对",
    },
    "가을, 수영 가능한 바다(23°C)와 여유": {
        "en": "Autumn — swimmable sea at 23°C and a relaxed vibe",
        "ja": "秋、泳げる海（23°C）と余裕のある雰囲気",
        "zh": "秋天，可以游泳的海水（23°C），轻松悠闲",
    },
    # turkey - istanbul
    "겨울 비, 보스포루스 강풍이 부는 시기": {
        "en": "Winter rain with strong Bosphorus winds",
        "ja": "冬の雨、ボスポラスに強風が吹く時期",
        "zh": "冬雨时节，博斯普鲁斯海峡强风肆虐",
    },
    "겨울 끝자락, 터키식 차 한잔의 여유": {
        "en": "End of winter — enjoy the slow pace with a glass of Turkish tea",
        "ja": "冬の終わり、トルコ茶を一杯の余裕",
        "zh": "冬末时节，品一杯土耳其茶，享受悠闲时光",
    },
    "봄 시작, 튤립이 피기 시작하는 시기": {
        "en": "Spring begins — tulips start to bloom",
        "ja": "春の始まり、チューリップが咲き始める時期",
        "zh": "春天开始，郁金香开始绽放",
    },
    "튤립 축제, 봄꽃과 온화한 날씨": {
        "en": "Tulip festival — spring flowers and mild weather",
        "ja": "チューリップ祭り、春の花と穏やかな天気",
        "zh": "郁金香节，春花盛开，天气温和",
    },
    "봄 절정, 보스포루스 크루즈 최적기": {
        "en": "Spring at its peak — perfect for a Bosphorus cruise",
        "ja": "春の絶頂、ボスポラスクルーズの最適期",
        "zh": "春天巅峰，博斯普鲁斯游船的最佳时节",
    },
    "여름 시작, 야외 레스토랑과 루프탑 시즌": {
        "en": "Summer begins — outdoor restaurants and rooftop season",
        "ja": "夏の始まり、野外レストランとルーフトップシーズン",
        "zh": "夏天开始，户外餐厅与屋顶露台季节到来",
    },
    "여름 더위, 그랜드바자르와 실내 관광": {
        "en": "Summer heat — Grand Bazaar and indoor sightseeing",
        "ja": "夏の暑さ、グランドバザールと室内観光",
        "zh": "夏日酷热，大巴扎与室内观光",
    },
    "더위 지속, 아이스크림(돈두르마)의 계절": {
        "en": "Heat continues — season of dondurma (Turkish ice cream)",
        "ja": "暑さ続く、アイスクリーム（ドンドゥルマ）の季節",
        "zh": "酷热持续，土耳其冰淇淋（dondurma）的季节",
    },
    "더위 물러간 쾌적한 가을 시작": {
        "en": "Heat retreats — a pleasant autumn begins",
        "ja": "暑さが和らぎ、快適な秋の始まり",
        "zh": "酷热消退，舒适宜人的秋天开始",
    },
    "황금빛 가을, 보스포루스의 가장 아름다운 시기": {
        "en": "Golden autumn — the most beautiful season on the Bosphorus",
        "ja": "黄金の秋、ボスポラスで最も美しい時期",
        "zh": "金色秋天，博斯普鲁斯最美丽的时节",
    },
    "쌀쌀해지고 비 시작, 하맘(터키 목욕) 시즌": {
        "en": "Cooling down with rain — perfect for a hamam (Turkish bath)",
        "ja": "肌寒くなり雨が始まる、ハマム（トルコ風呂）シーズン",
        "zh": "天气转凉开始下雨，正是土耳其浴（hamam）的好时节",
    },
    "겨울, 비 잦지만 따뜻한 터키 음식의 매력": {
        "en": "Winter — frequent rain but the warmth of Turkish food is irresistible",
        "ja": "冬、雨は多いがトルコ料理の温かさが魅力",
        "zh": "冬季多雨，但土耳其美食的温暖魅力无限",
    },
    # turkey - cappadocia
    "폭설로 열기구 대부분 결항, 겨울왕국 풍경": {
        "en": "Heavy snowfall grounds most balloons — but the winter wonderland scenery is magical",
        "ja": "大雪で気球はほぼ欠航、雪国の風景が幻想的",
        "zh": "大雪导致大多数热气球停飞，但冬日王国景色如梦似幻",
    },
    "겨울, 열기구 결항 빈번하지만 설경이 환상적": {
        "en": "Winter — balloon cancellations are frequent but the snow scenery is fantastic",
        "ja": "冬、気球の欠航が多いが雪景色が幻想的",
        "zh": "冬季，热气球常常取消，但雪景美不胜收",
    },
    "봄 시작, 열기구 비행 재개되는 시기": {
        "en": "Spring begins — balloon flights resume",
        "ja": "春の始まり、気球フライトが再開される時期",
        "zh": "春天开始，热气球飞行恢复",
    },
    "야생화 만개, 열기구 최적 조건의 시작": {
        "en": "Wild flowers in bloom — ideal balloon flying conditions begin",
        "ja": "野生の花が満開、気球フライトの最適条件が始まる",
        "zh": "野花盛开，热气球飞行的最佳条件开始",
    },
    "열기구 완벽, 봄꽃과 쾌적한 기온": {
        "en": "Perfect balloon conditions with spring flowers and comfortable temperatures",
        "ja": "気球フライト完璧、春の花と快適な気温",
        "zh": "热气球条件完美，春花盛开，气温宜人",
    },
    "따뜻한 초여름, 하이킹과 열기구": {
        "en": "Warm early summer — great for hiking and hot air ballooning",
        "ja": "温かい初夏、ハイキングと気球フライト",
        "zh": "温暖的初夏，非常适合徒步与热气球飞行",
    },
    "40°C 폭염, 열기구 조건 악화": {
        "en": "40°C heat wave — balloon flying conditions deteriorate",
        "ja": "40°Cの猛暑、気球フライトの条件が悪化",
        "zh": "40°C高温酷暑，热气球飞行条件变差",
    },
    "폭염 지속, 야외 활동 힘든 시기": {
        "en": "Heat wave continues — outdoor activities are challenging",
        "ja": "猛暑続く、野外活動が辛い時期",
        "zh": "酷暑持续，户外活动十分艰难",
    },
    "더위 물러간 가을, 열기구 최적 시즌 재개": {
        "en": "Heat retreats — the best balloon season resumes in autumn",
        "ja": "暑さが和らぐ秋、気球の最適シーズン再開",
        "zh": "酷热消退，秋季热气球最佳季节重新开始",
    },
    "가을 단풍과 열기구, 카파도키아 최고의 시기": {
        "en": "Autumn foliage and hot air balloons — Cappadocia at its finest",
        "ja": "秋の紅葉と気球、カッパドキアの最高の時期",
        "zh": "秋日红叶与热气球，卡帕多奇亚最美时节",
    },
    "쌀쌀해지는 늦가을, 열기구 아직 가능": {
        "en": "Cooling late autumn — balloon flights are still possible",
        "ja": "肌寒くなる晩秋、気球フライトはまだ可能",
        "zh": "晚秋转凉，热气球飞行仍然可以进行",
    },
    "폭설과 혹한, 열기구 결항 빈번": {
        "en": "Heavy snow and bitter cold — balloon cancellations are frequent",
        "ja": "大雪と極寒、気球の欠航が多い",
        "zh": "大雪严寒，热气球经常取消",
    },
    # turkey - antalya
    "겨울 비, 해변 부적합하지만 유적지 관광 가능": {
        "en": "Winter rain — beaches are unsuitable but ancient sites are still visitable",
        "ja": "冬の雨、ビーチには不向きだが遺跡観光は可能",
        "zh": "冬雨时节，不适合海滩但仍可参观古迹",
    },
    "겨울 끝자락, 아직 해변 시즌 아님": {
        "en": "End of winter — beach season hasn't started yet",
        "ja": "冬の終わり、まだビーチシーズンではない",
        "zh": "冬末时节，海滩季尚未开始",
    },
    "봄 시작, 해안 산책이 쾌적해지는 시기": {
        "en": "Spring begins — coastal walks become pleasant",
        "ja": "春の始まり、海岸の散歩が気持ちよくなる時期",
        "zh": "春天开始，海岸漫步变得舒适宜人",
    },
    "따뜻해지는 봄, 수영 시작 가능한 시기": {
        "en": "Warming spring — swimming becomes possible",
        "ja": "暖かくなる春、泳ぎ始められる時期",
        "zh": "春意渐暖，可以开始游泳",
    },
    "해변 시즌 시작, 수온 22°C": {
        "en": "Beach season begins — sea temperature 22°C",
        "ja": "ビーチシーズン開始、水温22°C",
        "zh": "海滩季开始，海水温度22°C",
    },
    "본격 해변 시즌, 수온 25°C": {
        "en": "Full beach season — sea temperature 25°C",
        "ja": "本格ビーチシーズン、水温25°C",
        "zh": "海滩季全面开启，海水温度25°C",
    },
    "비치 피크 시즌, 수온 27°C의 뜨거운 여름": {
        "en": "Peak beach season — hot summer with sea temperature at 27°C",
        "ja": "ビーチのピークシーズン、水温27°Cの暑い夏",
        "zh": "海滩旺季高峰，海水温度27°C的炎热夏季",
    },
    "수온 최고(29°C), 지중해 해변의 절정": {
        "en": "Sea temperature peaks at 29°C — Mediterranean beaches at their finest",
        "ja": "水温最高（29°C）、地中海ビーチの絶頂",
        "zh": "海水温度最高（29°C），地中海海滩的巅峰",
    },
    "바다 따뜻하고 관광객 줄어든 최적기": {
        "en": "Sea still warm with fewer tourists — the sweet spot",
        "ja": "海が温かく観光客が減った最適期",
        "zh": "海水温暖，游客减少，正是最佳时节",
    },
    "지중海 가을, 수온 23°C로 아직 해수욕 가능": {
        "en": "Mediterranean autumn — sea at 23°C, still swimmable",
        "ja": "地中海の秋、水温23°Cでまだ海水浴可能",
        "zh": "地中海秋天，海水温度23°C，仍可游泳",
    },
    "해변 시즌 마무리, 쌀쌀해지는 시기": {
        "en": "Beach season wraps up — temperatures start to cool",
        "ja": "ビーチシーズン終了、肌寒くなる時期",
        "zh": "海滩季结束，天气开始转凉",
    },
    "겨울 비, 해변 부적합": {
        "en": "Winter rain — beaches are unsuitable",
        "ja": "冬の雨、ビーチには不向き",
        "zh": "冬雨时节，不适合海滩活动",
    },
    # usa - new-york
    "영하의 혹한과 폭설, 브로드웨이와 실내 관광 위주": {
        "en": "Sub-zero cold and heavy snow — Broadway and indoor sightseeing take over",
        "ja": "氷点下の極寒と大雪、ブロードウェイと室内観光がメイン",
        "zh": "零度以下严寒与暴雪，百老汇与室内观光成为主角",
    },
    "가장 추운 시기, 밸런타인 분위기의 도시": {
        "en": "The coldest period — the city is draped in Valentine's atmosphere",
        "ja": "最も寒い時期、バレンタインの雰囲気に包まれる都市",
        "zh": "最寒冷的时节，城市笼罩在情人节的浪漫气氛中",
    },
    "아직 쌀쌀하지만 봄기운이 느껴지는 시기": {
        "en": "Still chilly but the first hints of spring are in the air",
        "ja": "まだ肌寒いが、春の気配を感じる時期",
        "zh": "仍有寒意，但已能感受到春天的气息",
    },
    "센트럴파크에 봄꽃이 피는 시기": {
        "en": "Spring flowers bloom in Central Park",
        "ja": "セントラルパークに春の花が咲く時期",
        "zh": "中央公园春花绽放的时节",
    },
    "센트럴파크 녹음, 뉴욕 여행의 가장 좋은 시기": {
        "en": "Central Park in full green — the best time to visit New York",
        "ja": "セントラルパークの新緑、ニューヨーク旅行に最高の時期",
        "zh": "中央公园绿意盎然，游览纽约的最佳时节",
    },
    "따뜻한 초여름, 야외 이벤트와 공원 콘서트": {
        "en": "Warm early summer with outdoor events and park concerts",
        "ja": "温かい初夏、野外イベントと公園でのコンサート",
        "zh": "温暖的初夏，户外活动与公园音乐会精彩不断",
    },
    "폭염과 높은 습도, 에어컨 없이 힘든 시기": {
        "en": "Heat wave and high humidity — air conditioning is non-negotiable",
        "ja": "猛暑と高湿度、エアコンなしでは辛い時期",
        "zh": "酷暑高湿，没有空调几乎难以忍受",
    },
    "무더위 지속, 실외 관광이 힘든 한여름": {
        "en": "Sweltering heat continues — outdoor sightseeing is tough in midsummer",
        "ja": "蒸し暑さ続く、屋外観光が辛い真夏",
        "zh": "酷热持续，盛夏户外观光十分艰难",
    },
    "더위가 물러간 쾌적한 가을의 시작": {
        "en": "Heat retreats — a pleasant autumn begins",
        "ja": "暑さが和らぎ、快適な秋の始まり",
        "zh": "酷热消退，舒适宜人的秋天开始",
    },
    "센트럴파크 단풍 절정, 할로윈의 도시": {
        "en": "Peak Central Park foliage and Halloween in the city",
        "ja": "セントラルパーク紅葉の絶頂、ハロウィンの街",
        "zh": "中央公园红叶盛极，万圣节装扮的城市",
    },
    "추워지지만 추수감사절·홀리데이 시즌 시작": {
        "en": "Turning cold but Thanksgiving and holiday season begin",
        "ja": "寒くなるが感謝祭・ホリデーシーズンが始まる",
        "zh": "天气转冷，但感恩节与节日季节拉开序幕",
    },
    "록펠러 트리, 홀리데이 쇼핑의 연말 분위기": {
        "en": "Rockefeller Tree, holiday shopping and year-end festive atmosphere",
        "ja": "ロックフェラーツリー、ホリデーショッピングの年末ムード",
        "zh": "洛克菲勒树点灯，节日购物与浓厚年末氛围",
    },
    # usa - los-angeles
    "온화한 겨울, 15°C 전후의 쾌적한 날씨": {
        "en": "Mild winter with comfortable temperatures around 15°C",
        "ja": "温暖な冬、15°C前後の快適な天気",
        "zh": "冬季温和，气温约15°C，舒适宜人",
    },
    "겨울비가 가끔 오지만 대체로 맑은 날씨": {
        "en": "Occasional winter rain but mostly sunny days",
        "ja": "冬の雨が時々降るが、概ね晴れた天気",
        "zh": "偶有冬雨，但整体以晴天为主",
    },
    "봄 시작, 야생화가 피는 슈퍼블룸 시즌": {
        "en": "Spring begins — superbloom season with wildflowers in bloom",
        "ja": "春の始まり、野生の花が咲くスーパーブルームシーズン",
        "zh": "春天开始，野花盛开的超级花海季节",
    },
    "봄 야생화와 쾌적한 기온, 하이킹 최적기": {
        "en": "Spring wildflowers and comfortable temperatures — perfect for hiking",
        "ja": "春の野生の花と快適な気温、ハイキングに最適",
        "zh": "春日野花与宜人气温，徒步的最佳时节",
    },
    "해변 시즌 시작 전 쾌적한 날씨": {
        "en": "Pleasant weather before beach season kicks off",
        "ja": "ビーチシーズン前の快適な天気",
        "zh": "海滩季开始前的宜人天气",
    },
    "June Gloom(해안 안개), 오전 흐리고 오후 맑음": {
        "en": "June Gloom (coastal fog) — overcast mornings clear up in the afternoon",
        "ja": "ジューン・グルーム（海岸霧）、午前中は曇りでも午後は晴れる",
        "zh": "六月阴霾（海岸雾气），上午阴云密布，下午转晴",
    },
    "여름 해변 시즌, 산타모니카·베니스 비치": {
        "en": "Summer beach season — Santa Monica and Venice Beach",
        "ja": "夏のビーチシーズン、サンタモニカ・ヴェニスビーチ",
        "zh": "夏季海滩季，圣塔莫尼卡与威尼斯海滩",
    },
    "여름 피크, 더위지만 해변은 최고": {
        "en": "Summer peak — hot weather but the beaches are superb",
        "ja": "夏のピーク、暑いがビーチは最高",
        "zh": "夏季高峰，天气炎热但海滩绝佳",
    },
    "여름 인파 줄고, 따뜻한 가을 해변": {
        "en": "Summer crowds thin out — warm autumn beaches",
        "ja": "夏の人出が減り、温かい秋のビーチ",
        "zh": "夏季人潮散去，温暖的秋日海滩",
    },
    "인디언 서머, 맑고 따뜻한 최적기": {
        "en": "Indian Summer — clear skies and warm temperatures at their best",
        "ja": "インディアンサマー、晴れて暖かい最適期",
        "zh": "印第安夏，晴朗温暖的最佳时节",
    },
    "가을 끝자락, 여전히 쾌적한 날씨": {
        "en": "Late autumn — still pleasantly comfortable weather",
        "ja": "晩秋、まだ快適な天気が続く",
        "zh": "秋末时节，天气依然宜人舒适",
    },
    "온화한 겨울, 연말 분위기의 할리우드": {
        "en": "Mild winter — Hollywood with a year-end festive atmosphere",
        "ja": "温暖な冬、年末ムードのハリウッド",
        "zh": "冬季温和，充满年末节日气氛的好莱坞",
    },
    # usa - hawaii
    "우기이지만 따뜻, 고래 관찰 시즌": {
        "en": "Rainy season but warm — humpback whale watching season",
        "ja": "雨季だが温暖、クジラ観察シーズン",
        "zh": "雨季但温暖，座头鲸观赏季节",
    },
    "고래 관찰 피크, 서핑 빅웨이브 시즌": {
        "en": "Peak whale watching and big wave surfing season",
        "ja": "クジラ観察のピーク、サーフィンのビッグウェーブシーズン",
        "zh": "观鲸高峰期，大浪冲浪季节",
    },
    "우기 끝자락, 점차 맑아지는 시기": {
        "en": "End of rainy season — skies gradually clearing",
        "ja": "雨季の終わり、徐々に晴れてくる時期",
        "zh": "雨季尾声，天空逐渐放晴",
    },
    "건기 시작, 맑은 하늘과 쾌적한 기온": {
        "en": "Dry season begins — clear skies and comfortable temperatures",
        "ja": "乾季開始、晴れた空と快適な気温",
        "zh": "乾季开始，晴空万里，气温宜人",
    },
    "건기, 스노클링과 하이킹 최적기": {
        "en": "Dry season — perfect for snorkeling and hiking",
        "ja": "乾季、シュノーケリングとハイキングの最適期",
        "zh": "乾季，浮潜与徒步的最佳时节",
    },
    "건기 절정, 완벽한 해변과 맑은 바다": {
        "en": "Peak dry season — perfect beaches and crystal-clear sea",
        "ja": "乾季の絶頂期、完璧なビーチと澄んだ海",
        "zh": "乾季高峰，完美的海滩与清澈的海水",
    },
    "여름 피크 시즌, 가족 관광객 많은 시기": {
        "en": "Summer peak season — many families visiting",
        "ja": "夏のピークシーズン、ファミリー観光客が多い時期",
        "zh": "夏季旺季高峰，家庭游客众多",
    },
    "여름 성수기, 서핑·다이빙 최적": {
        "en": "Summer high season — perfect for surfing and diving",
        "ja": "夏の繁忙期、サーフィン・ダイビングに最適",
        "zh": "夏季旺季，冲浪与潜水的最佳时节",
    },
    "건기 막바지, 관광객 적고 가성비 최고": {
        "en": "End of dry season — fewer tourists and the best value",
        "ja": "乾季の終わり、観光客が少なくコスパ最高",
        "zh": "乾季末期，游客较少，性价比最高",
    },
    "날씨 좋고 관광객 적은 황금 시기": {
        "en": "Good weather and fewer tourists — the golden period",
        "ja": "天気も良く観光客も少ない黄金の時期",
        "zh": "天气好且游客少，黄金旅游时期",
    },
    "우기 시작, 간간이 소나기가 오는 시기": {
        "en": "Rainy season begins — occasional showers start appearing",
        "ja": "雨季開始、時々にわか雨が降る時期",
        "zh": "雨季开始，偶有阵雨",
    },
    "홀리데이 피크, 고래 관찰 시즌 시작": {
        "en": "Holiday peak — whale watching season begins",
        "ja": "ホリデーピーク、クジラ観察シーズン開始",
        "zh": "节日高峰期，观鲸季节开始",
    },
}

NEW_FIELDS = {
    # shared fields
    "강수량이 적어 맑은 날이 많음": {
        "en": "Low rainfall with many sunny days",
        "ja": "降水量が少なく晴れの日が多い",
        "zh": "降雨量少，晴天居多",
    },
    "습도가 낮아 쾌적함": {
        "en": "Low humidity makes it comfortable",
        "ja": "湿度が低く過ごしやすい",
        "zh": "湿度低，舒适宜人",
    },
    "쾌적한 기온": {
        "en": "Pleasant temperatures",
        "ja": "過ごしやすい気温",
        "zh": "气温宜人",
    },
    "일조시간이 길어 야외 활동에 좋음": {
        "en": "Long sunshine hours — great for outdoor activities",
        "ja": "日照時間が長く屋外活動に最適",
        "zh": "日照时间长，非常适合户外活动",
    },
    "일조시간이 짧아 흐린 날이 많음": {
        "en": "Short sunshine hours with many overcast days",
        "ja": "日照時間が短く曇りの日が多い",
        "zh": "日照时间短，阴天较多",
    },
    "현지 일상을 경험하기 좋은 시기": {
        "en": "A great time to experience everyday local life",
        "ja": "現地の日常を体験するのに最適な時期",
        "zh": "体验当地日常生活的好时机",
    },
    "겨울 스포츠에 적합한 시기": {
        "en": "Suitable for winter sports",
        "ja": "ウィンタースポーツに適した時期",
        "zh": "适合冬季运动的时节",
    },
    "보온 용품과 핫팩 준비": {
        "en": "Prepare thermal wear and hand warmers",
        "ja": "防寒グッズとホッカイロを用意",
        "zh": "备好保暖物品和暖宝宝",
    },
    "선글라스와 모자 챙기기": {
        "en": "Bring sunglasses and a hat",
        "ja": "サングラスと帽子を忘れずに",
        "zh": "备好太阳镜和帽子",
    },
    "접이식 우산이나 우비 챙기기": {
        "en": "Bring a folding umbrella or rain jacket",
        "ja": "折りたたみ傘かレインコートを持参",
        "zh": "携带折叠伞或雨衣",
    },
    "반팔, 얇은 긴바지. 자외선 차단 필수": {
        "en": "Short sleeves and light long trousers — sun protection essential",
        "ja": "半袖と薄い長ズボン、日焼け止め必須",
        "zh": "短袖与轻薄长裤，防晒必不可少",
    },
    "얇은 긴팔, 가디건. 아침저녁 쌀쌀할 수 있음": {
        "en": "Light long sleeves and a cardigan — mornings and evenings can be chilly",
        "ja": "薄手の長袖とカーディガン、朝夕は肌寒いことも",
        "zh": "轻薄长袖与开衫，早晚可能较凉",
    },
    "긴팔, 가벼운 재킷. 레이어드 추천": {
        "en": "Long sleeves and a light jacket — layering recommended",
        "ja": "長袖と軽いジャケット、重ね着推奨",
        "zh": "长袖与轻薄夹克，建议叠搭穿着",
    },
    "재킷, 니트, 긴바지. 아우터 필수": {
        "en": "Jacket, knitwear and long trousers — an outer layer is essential",
        "ja": "ジャケット、ニット、長ズボン — アウター必須",
        "zh": "夹克、针织衫与长裤，外套必备",
    },
    "코트, 목도리, 장갑. 보온 레이어 필요": {
        "en": "Coat, scarf and gloves — warm layering needed",
        "ja": "コート、マフラー、手袋 — 防寒レイヤーが必要",
        "zh": "大衣、围巾和手套，需要保暖叠搭",
    },
    "패딩, 두꺼운 코트, 방한용품 필수": {
        "en": "Down jacket, thick coat and cold-weather essentials — a must",
        "ja": "ダウンジャケット、厚いコート、防寒グッズは必須",
        "zh": "羽绒服、厚实大衣及防寒用品，缺一不可",
    },
    "반팔, 반바지, 가벼운 원피스. 통풍 잘 되는 소재 추천": {
        "en": "T-shirts, shorts or a light dress — breathable fabrics recommended",
        "ja": "半袖・短パン・軽いワンピース、通気性の良い素材推奨",
        "zh": "短袖、短裤或轻薄连衣裙，推荐透气面料",
    },
    "냉방이 잘 되는 숙소 선택 권장": {
        "en": "Choose accommodation with good air conditioning",
        "ja": "冷房の効いた宿泊施設を選ぶことを推奨",
        "zh": "建议选择空调良好的住宿",
    },
    "따뜻한 날씨로 해변 활동에 적합": {
        "en": "Warm weather suitable for beach activities",
        "ja": "温暖な天気でビーチアクティビティに最適",
        "zh": "天气温暖，适合海滩活动",
    },
    # france fields
    "습도 82%로 불쾌지수 높음": {
        "en": "82% humidity — discomfort index is high",
        "ja": "湿度82%で不快指数が高い",
        "zh": "湿度82%，体感不适指数较高",
    },
    "습도 86%로 불쾌지수 높음": {
        "en": "86% humidity — discomfort index is high",
        "ja": "湿度86%で不快指数が高い",
        "zh": "湿度86%，体感不适指数较高",
    },
    "습도 88%로 불쾌지수 높음": {
        "en": "88% humidity — discomfort index is high",
        "ja": "湿度88%で不快指数が高い",
        "zh": "湿度88%，体感不适指数较高",
    },
    "습도가 71%로 다소 높음": {
        "en": "Humidity at 71% — somewhat high",
        "ja": "湿度71%でやや高め",
        "zh": "湿度71%，稍显偏高",
    },
    "습도가 73%로 다소 높음": {
        "en": "Humidity at 73% — somewhat high",
        "ja": "湿度73%でやや高め",
        "zh": "湿度73%，稍显偏高",
    },
    "습도가 74%로 다소 높음": {
        "en": "Humidity at 74% — somewhat high",
        "ja": "湿度74%でやや高め",
        "zh": "湿度74%，稍显偏高",
    },
    "습도가 75%로 다소 높음": {
        "en": "Humidity at 75% — somewhat high",
        "ja": "湿度75%でやや高め",
        "zh": "湿度75%，稍显偏高",
    },
    "습도가 80%로 다소 높음": {
        "en": "Humidity at 80% — somewhat high",
        "ja": "湿度80%でやや高め",
        "zh": "湿度80%，稍显偏高",
    },
    "비 오는 날이 10.2일로 실내 대안 준비 권장": {
        "en": "10.2 rainy days — have indoor alternatives ready",
        "ja": "雨の日が10.2日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约10.2天，建议准备室内备选方案",
    },
    "비 오는 날이 11.6일로 실내 대안 준비 권장": {
        "en": "11.6 rainy days — have indoor alternatives ready",
        "ja": "雨の日が11.6日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约11.6天，建议准备室内备选方案",
    },
    "비 오는 날이 11일로 실내 대안 준비 권장": {
        "en": "11 rainy days — have indoor alternatives ready",
        "ja": "雨の日が11日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约11天，建议准备室内备选方案",
    },
    "비 오는 날이 12일로 실내 대안 준비 권장": {
        "en": "12 rainy days — have indoor alternatives ready",
        "ja": "雨の日が12日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约12天，建议准备室内备选方案",
    },
    "비 오는 날이 13.4일로 실내 대안 준비 권장": {
        "en": "13.4 rainy days — have indoor alternatives ready",
        "ja": "雨の日が13.4日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约13.4天，建议准备室内备选方案",
    },
    "비 오는 날이 14.4일로 실내 대안 준비 권장": {
        "en": "14.4 rainy days — have indoor alternatives ready",
        "ja": "雨の日が14.4日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约14.4天，建议准备室内备선方案",
    },
    "비 오는 날이 15일로 실내 대안 준비 권장": {
        "en": "15 rainy days — have indoor alternatives ready",
        "ja": "雨の日が15日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约15天，建议准备室内备选方案",
    },
    "가을 파리의 정취, 관광객 감소기": {
        "en": "Autumn Paris ambience — tourist numbers declining",
        "ja": "秋のパリの情緒、観光客が減少する時期",
        "zh": "秋日巴黎的韵味，游客减少期",
    },
    "봄꽃과 야외 카페의 계절": {
        "en": "Season of spring flowers and outdoor cafés",
        "ja": "春の花と野外カフェの季節",
        "zh": "春花盛开与露天咖啡馆的季节",
    },
    "크리스마스 마켓과 일루미네이션": {
        "en": "Christmas markets and illuminations",
        "ja": "クリスマスマーケットとイルミネーション",
        "zh": "圣诞市集与灯饰",
    },
    "파리 크리스마스 일루미네이션": {
        "en": "Paris Christmas illuminations",
        "ja": "パリのクリスマスイルミネーション",
        "zh": "巴黎圣诞灯饰",
    },
    "샹젤리제 크리스마스 마켓": {
        "en": "Champs-Élysées Christmas Market",
        "ja": "シャンゼリゼのクリスマスマーケット",
        "zh": "香榭丽舍圣诞市集",
    },
    "니스 카니발 (2월)": {
        "en": "Nice Carnival (February)",
        "ja": "ニースカーニバル（2月）",
        "zh": "尼斯嘉年华（2月）",
    },
    "니스 카니발 시즌": {
        "en": "Nice Carnival season",
        "ja": "ニースカーニバルシーズン",
        "zh": "尼斯嘉年华季",
    },
    "칸 영화제 (5월, 인근)": {
        "en": "Cannes Film Festival (May, nearby)",
        "ja": "カンヌ映画祭（5月、近郊）",
        "zh": "戛纳电影节（5月，附近）",
    },
    "뮤지엄 나이트 (5월)": {
        "en": "Museum Night (May)",
        "ja": "ミュージアムナイト（5月）",
        "zh": "博物馆之夜（5月）",
    },
    "재즈 페스티벌 (7월)": {
        "en": "Jazz Festival (July)",
        "ja": "ジャズフェスティバル（7月）",
        "zh": "爵士音乐节（7月）",
    },
    "유럽 문화유산의 날 (9월)": {
        "en": "European Heritage Days (September)",
        "ja": "ヨーロッパ文化遺産の日（9月）",
        "zh": "欧洲文化遗产日（9月）",
    },
    "포도 수확제 (10월)": {
        "en": "Grape Harvest Festival (October)",
        "ja": "ブドウ収穫祭（10月）",
        "zh": "葡萄采收节（10月）",
    },
    "레몬 페스티벌 (망통)": {
        "en": "Lemon Festival (Menton)",
        "ja": "レモンフェスティバル（マントン）",
        "zh": "柠檬节（芒通）",
    },
    "프렌치 오픈 테니스 (5~6월)": {
        "en": "French Open Tennis (May–June)",
        "ja": "全仏オープンテニス（5〜6月）",
        "zh": "法国网球公开赛（5至6月）",
    },
    "코트다쥐르 해변 성수기": {
        "en": "Côte d'Azur beach high season",
        "ja": "コート・ダジュールビーチのハイシーズン",
        "zh": "蔚蓝海岸海滩旺季",
    },
    "강수량이 135mm로 우산 필수": {
        "en": "135mm rainfall — an umbrella is a must",
        "ja": "降水量135mmで傘は必須",
        "zh": "降雨量135mm，雨伞必备",
    },
    # spain fields
    "습도 80%로 불쾌지수 높음": {
        "en": "80% humidity — discomfort index is high",
        "ja": "湿度80%で不快指数が高い",
        "zh": "湿度80%，体感不适指数较高",
    },
    "습도 81%로 불쾌지수 높음": {
        "en": "81% humidity — discomfort index is high",
        "ja": "湿度81%で不快指数が高い",
        "zh": "湿度81%，体感不适指数较高",
    },
    "습도 83%로 불쾌지수 높음": {
        "en": "83% humidity — discomfort index is high",
        "ja": "湿度83%で不快指数が高い",
        "zh": "湿度83%，体感不适指数较高",
    },
    "습도가 70%로 다소 높음": {
        "en": "Humidity at 70% — somewhat high",
        "ja": "湿度70%でやや高め",
        "zh": "湿度70%，稍显偏高",
    },
    "습도가 76%로 다소 높음": {
        "en": "Humidity at 76% — somewhat high",
        "ja": "湿度76%でやや高め",
        "zh": "湿度76%，稍显偏高",
    },
    "습도가 77%로 다소 높음": {
        "en": "Humidity at 77% — somewhat high",
        "ja": "湿度77%でやや高め",
        "zh": "湿度77%，稍显偏高",
    },
    "습도가 78%로 다소 높음": {
        "en": "Humidity at 78% — somewhat high",
        "ja": "湿度78%でやや高め",
        "zh": "湿度78%，稍显偏高",
    },
    "습도가 79%로 다소 높음": {
        "en": "Humidity at 79% — somewhat high",
        "ja": "湿度79%でやや高め",
        "zh": "湿度79%，稍显偏高",
    },
    "비 오는 날이 10.4일로 실내 대안 준비 권장": {
        "en": "10.4 rainy days — have indoor alternatives ready",
        "ja": "雨の日が10.4日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约10.4天，建议准备室内备选方案",
    },
    "산 이시드로 축제 (5월)": {
        "en": "San Isidro Festival (May)",
        "ja": "サン・イシドロ祭り（5月）",
        "zh": "圣伊西德罗节（5月）",
    },
    "세마나 산타 (3~4월)": {
        "en": "Semana Santa (Holy Week, March–April)",
        "ja": "セマナ・サンタ（聖週間、3〜4月）",
        "zh": "圣周（3至4月）",
    },
    "세마나 산타 (성주간)": {
        "en": "Semana Santa (Holy Week)",
        "ja": "セマナ・サンタ（聖週間）",
        "zh": "圣周（塞马纳圣达）",
    },
    "세비야 페리아 데 아브릴 (4월)": {
        "en": "Seville Feria de Abril (April)",
        "ja": "セビリャのフェリア・デ・アブリル（4月）",
        "zh": "塞维利亚四月节（4月）",
    },
    "세비야 4월 축제(페리아)": {
        "en": "Seville April Fair (Feria de Abril)",
        "ja": "セビリャの4月祭り（フェリア）",
        "zh": "塞维利亚四月集市节",
    },
    "성 후안 축제 (6월 23일)": {
        "en": "San Juan Festival (June 23)",
        "ja": "サン・フアン祭り（6月23日）",
        "zh": "圣胡安节（6月23日）",
    },
    "그라시아 지구 축제 (8월)": {
        "en": "Gràcia Festival (August)",
        "ja": "グラシア地区祭り（8月）",
        "zh": "格拉西亚区节（8月）",
    },
    "레알 마드리드 홈 경기 시즌": {
        "en": "Real Madrid home match season",
        "ja": "レアル・マドリードのホームゲームシーズン",
        "zh": "皇家马德里主场赛季",
    },
    "이사벨라 봄 축제 시즌": {
        "en": "Isabella spring festival season",
        "ja": "イサベラ春祭りシーズン",
        "zh": "伊莎贝拉春日节庆季",
    },
    "플라멩코 축제 시즌": {
        "en": "Flamenco festival season",
        "ja": "フラメンコフェスティバルシーズン",
        "zh": "弗拉明戈节庆季",
    },
    "해변+도시 성수기": {
        "en": "Beach and city high season",
        "ja": "ビーチと都市のハイシーズン",
        "zh": "海滩与城市旺季",
    },
    "평균 최고기온 34°C로 더위에 주의": {
        "en": "Average high of 34°C — take care in the heat",
        "ja": "平均最高気温34°Cで暑さに注意",
        "zh": "平均最高气温34°C，注意防暑",
    },
    "평균 최고기온 35°C로 더위에 주의": {
        "en": "Average high of 35°C — take care in the heat",
        "ja": "平均最高気温35°Cで暑さに注意",
        "zh": "平均最高气温35°C，注意防暑",
    },
    "평균 최고기온 37°C로 더위에 주의": {
        "en": "Average high of 37°C — take care in the heat",
        "ja": "平均最高気温37°Cで暑さに注意",
        "zh": "平均最高气温37°C，注意防暑",
    },
    "평균 최고기온 38°C로 더위에 주의": {
        "en": "Average high of 38°C — take care in the heat",
        "ja": "平均最高気温38°Cで暑さに注意",
        "zh": "平均最高气温38°C，注意防暑",
    },
    # italy fields
    "습도 84%로 불쾌지수 높음": {
        "en": "84% humidity — discomfort index is high",
        "ja": "湿度84%で不快指数が高い",
        "zh": "湿度84%，体感不适指数较高",
    },
    "비 오는 날이 10.6일로 실내 대안 준비 권장": {
        "en": "10.6 rainy days — have indoor alternatives ready",
        "ja": "雨の日が10.6日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约10.6天，建议准备室内备选方案",
    },
    "비 오는 날이 11.2일로 실내 대안 준비 권장": {
        "en": "11.2 rainy days — have indoor alternatives ready",
        "ja": "雨の日が11.2日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约11.2天，建议准备室内备选方案",
    },
    "비 오는 날이 11.4일로 실내 대안 준비 권장": {
        "en": "11.4 rainy days — have indoor alternatives ready",
        "ja": "雨の日が11.4日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约11.4天，建议准备室内备选方案",
    },
    "비 오는 날이 12.2일로 실내 대안 준비 권장": {
        "en": "12.2 rainy days — have indoor alternatives ready",
        "ja": "雨の日が12.2日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约12.2天，建议准备室内备选方案",
    },
    "비 오는 날이 13일로 실내 대안 준비 권장": {
        "en": "13 rainy days — have indoor alternatives ready",
        "ja": "雨の日が13日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约13天，建议准备室内备选方案",
    },
    "비 오는 날이 14.2일로 실내 대안 준비 권장": {
        "en": "14.2 rainy days — have indoor alternatives ready",
        "ja": "雨の日が14.2日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约14.2天，建议准备室内备选方案",
    },
    "비 오는 날이 14.6일로 실내 대안 준비 권장": {
        "en": "14.6 rainy days — have indoor alternatives ready",
        "ja": "雨の日が14.6日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约14.6天，建议准备室内备选方案",
    },
    "강수량이 108mm로 우산 필수": {
        "en": "108mm rainfall — an umbrella is a must",
        "ja": "降水量108mmで傘は必須",
        "zh": "降雨量108mm，雨伞必备",
    },
    "강수량이 112mm로 우산 필수": {
        "en": "112mm rainfall — an umbrella is a must",
        "ja": "降水量112mmで傘は必須",
        "zh": "降雨量112mm，雨伞必备",
    },
    "강수량이 113mm로 우산 필수": {
        "en": "113mm rainfall — an umbrella is a must",
        "ja": "降水量113mmで傘は必須",
        "zh": "降雨量113mm，雨伞必备",
    },
    "강수량이 131mm로 우산 필수": {
        "en": "131mm rainfall — an umbrella is a must",
        "ja": "降水量131mmで傘は必須",
        "zh": "降雨量131mm，雨伞必备",
    },
    "강수량이 139mm로 우산 필수": {
        "en": "139mm rainfall — an umbrella is a must",
        "ja": "降水量139mmで傘は必須",
        "zh": "降雨量139mm，雨伞必备",
    },
    "강수량이 143mm로 우산 필수": {
        "en": "143mm rainfall — an umbrella is a must",
        "ja": "降水量143mmで傘は必須",
        "zh": "降雨量143mm，雨伞必备",
    },
    "베네치아 카니발": {
        "en": "Venice Carnival",
        "ja": "ヴェネツィア・カーニバル",
        "zh": "威尼斯狂欢节",
    },
    "베네치아 카니발 (2월)": {
        "en": "Venice Carnival (February)",
        "ja": "ヴェネツィア・カーニバル（2月）",
        "zh": "威尼斯狂欢节（2月）",
    },
    "베네치아 비엔날레 (홀수 해)": {
        "en": "Venice Biennale (odd years)",
        "ja": "ヴェネツィア・ビエンナーレ（奇数年）",
        "zh": "威尼斯双年展（奇数年）",
    },
    "베네치아 영화제 (8월 말~9월)": {
        "en": "Venice Film Festival (late August–September)",
        "ja": "ヴェネツィア国際映画祭（8月末〜9月）",
        "zh": "威尼斯电影节（8月底至9月）",
    },
    "부활절 연휴 (3~4월)": {
        "en": "Easter holiday (March–April)",
        "ja": "イースター休暇（3〜4月）",
        "zh": "复活节假期（3至4月）",
    },
    "로마 생일 (4월 21일)": {
        "en": "Birthday of Rome (April 21)",
        "ja": "ローマ建国記念日（4月21日）",
        "zh": "罗马建城日（4月21日）",
    },
    "로마 영화제 (10월)": {
        "en": "Rome Film Festival (October)",
        "ja": "ローマ国際映画祭（10月）",
        "zh": "罗马国际电影节（10月）",
    },
    "아말피 레가타 (6월)": {
        "en": "Amalfi Regatta (June)",
        "ja": "アマルフィ・レガッタ（6月）",
        "zh": "阿马尔菲帆船赛（6月）",
    },
    "가을 로마, 관광객 감소 쾌적": {
        "en": "Autumn Rome — fewer crowds and pleasant conditions",
        "ja": "秋のローマ、観光客が減り快適",
        "zh": "秋日罗马，游客减少，游览舒适",
    },
    "온화한 봄, 관광 적기": {
        "en": "Mild spring — the right time for sightseeing",
        "ja": "穏やかな春、観光の適期",
        "zh": "春日温和，正是观光的好时节",
    },
    "지중해 절경 + 쾌적한 기온": {
        "en": "Stunning Mediterranean scenery with comfortable temperatures",
        "ja": "地中海の絶景 + 快適な気温",
        "zh": "地中海绝美景色与宜人气温",
    },
    "수상도시 봄·가을 황금기": {
        "en": "Golden spring and autumn for the city on the water",
        "ja": "水の都の春・秋のゴールデン期",
        "zh": "水上城市的春秋黄金时节",
    },
    "포지타노 해변 성수기": {
        "en": "Positano beach high season",
        "ja": "ポジターノビーチのハイシーズン",
        "zh": "波西塔诺海滩旺季",
    },
    "월 강수량 191mm로 우기에 해당": {
        "en": "191mm of rainfall this month — rainy season conditions",
        "ja": "月降水量191mmで雨季に該当",
        "zh": "本月降雨量191mm，属于雨季",
    },
    "월 강수량 223mm로 우기에 해당": {
        "en": "223mm of rainfall this month — rainy season conditions",
        "ja": "月降水量223mmで雨季に該当",
        "zh": "本月降雨量223mm，属于雨季",
    },
    # greece fields
    "강수량이 114mm로 우산 필수": {
        "en": "114mm rainfall — an umbrella is a must",
        "ja": "降水量114mmで傘は必須",
        "zh": "降雨量114mm，雨伞必备",
    },
    "비 오는 날이 10.8일로 실내 대안 준비 권장": {
        "en": "10.8 rainy days — have indoor alternatives ready",
        "ja": "雨の日が10.8日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约10.8天，建议准备室内备选方案",
    },
    "그리스 독립기념일 (3월 25일)": {
        "en": "Greek Independence Day (March 25)",
        "ja": "ギリシャ独立記念日（3月25日）",
        "zh": "希腊独立日（3月25日）",
    },
    "부활절 연휴": {
        "en": "Easter holiday",
        "ja": "イースター休暇",
        "zh": "复活节假期",
    },
    "산토리니 성수기 — 예약 필수": {
        "en": "Santorini high season — reservations essential",
        "ja": "サントリーニのハイシーズン — 予約必須",
        "zh": "圣托里尼旺季，预订必不可少",
    },
    "산토리니 재즈 페스티벌 (7월)": {
        "en": "Santorini Jazz Festival (July)",
        "ja": "サントリーニ・ジャズフェスティバル（7月）",
        "zh": "圣托里尼爵士音乐节（7月）",
    },
    "미코노스 여름 성수기 (6~8월)": {
        "en": "Mykonos summer high season (June–August)",
        "ja": "ミコノス夏のハイシーズン（6〜8月）",
        "zh": "米科诺斯夏季旺季（6至8月）",
    },
    "아테네 국제 마라톤 (11월)": {
        "en": "Athens Classic Marathon (November)",
        "ja": "アテネ国際マラソン（11月）",
        "zh": "雅典国际马拉松（11月）",
    },
    "성수기 (매우 붐빔)": {
        "en": "High season — very crowded",
        "ja": "ハイシーズン（非常に混雑）",
        "zh": "旺季，非常拥挤",
    },
    "파티·해변 성수기": {
        "en": "Party and beach high season",
        "ja": "パーティー・ビーチのハイシーズン",
        "zh": "派对与海滩旺季",
    },
    "일몰 + 에게해 황금기": {
        "en": "Sunset and Aegean golden season",
        "ja": "夕日 + エーゲ海のゴールデン期",
        "zh": "日落与爱琴海黄金时节",
    },
    "봄 아테네, 유적지 관광 최적": {
        "en": "Spring Athens — optimal for ancient site visits",
        "ja": "春のアテネ、遺跡観光に最適",
        "zh": "春日雅典，游览古迹的最佳时节",
    },
    "가을 아테네, 선선하고 쾌적": {
        "en": "Autumn Athens — cool and pleasant",
        "ja": "秋のアテネ、涼しく快適",
        "zh": "秋日雅典，凉爽宜人",
    },
    "평균 최고기온 33°C로 더위에 주의": {
        "en": "Average high of 33°C — take care in the heat",
        "ja": "平均最高気温33°Cで暑さに注意",
        "zh": "平均最高气温33°C，注意防暑",
    },
    # turkey fields
    "강수량이 146mm로 우산 필수": {
        "en": "146mm rainfall — an umbrella is a must",
        "ja": "降水量146mmで傘は必須",
        "zh": "降雨量146mm，雨伞必备",
    },
    "비 오는 날이 11.8일로 실내 대안 준비 권장": {
        "en": "11.8 rainy days — have indoor alternatives ready",
        "ja": "雨の日が11.8日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约11.8天，建议准备室内备선方案",
    },
    "비 오는 날이 12.4일로 실내 대안 준비 권장": {
        "en": "12.4 rainy days — have indoor alternatives ready",
        "ja": "雨の日が12.4日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约12.4天，建议准备室内备选方案",
    },
    "비 오는 날이 13일로 실내 대안 준비 권장": {
        "en": "13 rainy days — have indoor alternatives ready",
        "ja": "雨の日が13日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约13天，建议准备室内备选方案",
    },
    "이스탄불 영화제 (4월)": {
        "en": "Istanbul Film Festival (April)",
        "ja": "イスタンブール映画祭（4月）",
        "zh": "伊斯坦布尔电影节（4月）",
    },
    "이스탄불 튤립 축제 (4월)": {
        "en": "Istanbul Tulip Festival (April)",
        "ja": "イスタンブールチューリップ祭り（4月）",
        "zh": "伊斯坦布尔郁金香节（4月）",
    },
    "이스탄불 재즈 페스티벌 (7월)": {
        "en": "Istanbul Jazz Festival (July)",
        "ja": "イスタンブール・ジャズフェスティバル（7月）",
        "zh": "伊斯坦布尔爵士音乐节（7月）",
    },
    "안탈리아 영화제 (10월)": {
        "en": "Antalya Film Festival (October)",
        "ja": "アンタルヤ映画祭（10月）",
        "zh": "安塔利亚电影节（10月）",
    },
    "보스포러스 마라톤 (11월)": {
        "en": "Bosphorus Marathon (November)",
        "ja": "ボスポラスマラソン（11月）",
        "zh": "博斯普鲁斯马拉松（11月）",
    },
    "열기구 비행 최적 시즌": {
        "en": "Optimal hot air balloon season",
        "ja": "熱気球フライトの最適シーズン",
        "zh": "热气球飞行最佳季节",
    },
    "카파도키아 열기구 시즌 (봄·가을)": {
        "en": "Cappadocia balloon season (spring and autumn)",
        "ja": "カッパドキアの熱気球シーズン（春・秋）",
        "zh": "卡帕多奇亚热气球季（春秋两季）",
    },
    "지중해 해변 최적기": {
        "en": "Best time for Mediterranean beaches",
        "ja": "地中海ビーチの最適期",
        "zh": "地中海海滩最佳时节",
    },
    "안탈리아 해변 성수기": {
        "en": "Antalya beach high season",
        "ja": "アンタルヤビーチのハイシーズン",
        "zh": "安塔利亚海滩旺季",
    },
    "성수기 해변 (매우 더움)": {
        "en": "High season beach — very hot",
        "ja": "ハイシーズンのビーチ（非常に暑い）",
        "zh": "旺季海滩，非常炎热",
    },
    "가을 이스탄불, 붐비지 않는 여행": {
        "en": "Autumn Istanbul — uncrowded travel",
        "ja": "秋のイスタンブール、混雑しない旅行",
        "zh": "秋日伊斯坦布尔，不拥挤的旅行",
    },
    "봄 이스탄불, 쾌적한 날씨": {
        "en": "Spring Istanbul — comfortable weather",
        "ja": "春のイスタンブール、快適な天気",
        "zh": "春日伊斯坦布尔，气候宜人",
    },
    "월 강수량 214mm로 우기에 해당": {
        "en": "214mm of rainfall this month — rainy season conditions",
        "ja": "月降水量214mmで雨季に該当",
        "zh": "本月降雨量214mm，属于雨季",
    },
    "평균 최저기온 -1°C로 방한 대비 필요": {
        "en": "Average low of -1°C — cold-weather preparation needed",
        "ja": "平均最低気温-1°C、防寒対策が必要",
        "zh": "平均最低气温-1°C，需做好防寒准备",
    },
    "평균 최고기온 36°C로 더위에 주의": {
        "en": "Average high of 36°C — take care in the heat",
        "ja": "平均最高気温36°Cで暑さに注意",
        "zh": "平均最高气温36°C，注意防暑",
    },
    # usa fields
    "강수량이 100mm로 우산 필수": {
        "en": "100mm rainfall — an umbrella is a must",
        "ja": "降水量100mmで傘は必須",
        "zh": "降雨量100mm，雨伞必备",
    },
    "강수량이 102mm로 우산 필수": {
        "en": "102mm rainfall — an umbrella is a must",
        "ja": "降水量102mmで傘は必須",
        "zh": "降雨量102mm，雨伞必备",
    },
    "강수량이 103mm로 우산 필수": {
        "en": "103mm rainfall — an umbrella is a must",
        "ja": "降水量103mmで傘は必須",
        "zh": "降雨量103mm，雨伞必备",
    },
    "강수량이 120mm로 우산 필수": {
        "en": "120mm rainfall — an umbrella is a must",
        "ja": "降水量120mmで傘は必須",
        "zh": "降雨量120mm，雨伞必备",
    },
    "강수량이 126mm로 우산 필수": {
        "en": "126mm rainfall — an umbrella is a must",
        "ja": "降水量126mmで傘は必須",
        "zh": "降雨量126mm，雨伞必备",
    },
    "강수량이 134mm로 우산 필수": {
        "en": "134mm rainfall — an umbrella is a must",
        "ja": "降水量134mmで傘は必須",
        "zh": "降雨量134mm，雨伞必备",
    },
    "강수량이 136mm로 우산 필수": {
        "en": "136mm rainfall — an umbrella is a must",
        "ja": "降水量136mmで傘は必須",
        "zh": "降雨量136mm，雨伞必备",
    },
    "강수량이 144mm로 우산 필수": {
        "en": "144mm rainfall — an umbrella is a must",
        "ja": "降水量144mmで傘は必須",
        "zh": "降雨量144mm，雨伞必备",
    },
    "강수량이 147mm로 우산 필수": {
        "en": "147mm rainfall — an umbrella is a must",
        "ja": "降水量147mmで傘は必須",
        "zh": "降雨量147mm，雨伞必备",
    },
    "비 오는 날이 10.6일로 실내 대안 준비 권장": {
        "en": "10.6 rainy days — have indoor alternatives ready",
        "ja": "雨の日が10.6日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约10.6天，建议准备室内备선方案",
    },
    "비 오는 날이 11일로 실내 대안 준비 권장": {
        "en": "11 rainy days — have indoor alternatives ready",
        "ja": "雨の日が11日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约11天，建议准备室内备선方案",
    },
    "비 오는 날이 12.2일로 실내 대안 준비 권장": {
        "en": "12.2 rainy days — have indoor alternatives ready",
        "ja": "雨の日が12.2日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约12.2天，建议准备室内备선方案",
    },
    "비 오는 날이 14일로 실내 대안 준비 권장": {
        "en": "14 rainy days — have indoor alternatives ready",
        "ja": "雨の日が14日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约14天，建议准备室内备선方案",
    },
    "비 오는 날이 13일로 실내 대안 준비 권장": {
        "en": "13 rainy days — have indoor alternatives ready",
        "ja": "雨の日が13日と多め — 室内の代替プランを用意するのがおすすめ",
        "zh": "降雨天数约13天，建议准备室内备선方案",
    },
    "센트럴파크 벚꽃 (4월)": {
        "en": "Central Park cherry blossoms (April)",
        "ja": "セントラルパークの桜（4月）",
        "zh": "中央公园樱花（4月）",
    },
    "센트럴파크 봄꽃, 쾌적한 날씨": {
        "en": "Central Park spring flowers and pleasant weather",
        "ja": "セントラルパークの春の花、快適な天気",
        "zh": "中央公园春花盛开，天气宜人",
    },
    "가을 단풍과 할로윈/추수감사절": {
        "en": "Autumn foliage with Halloween and Thanksgiving",
        "ja": "秋の紅葉とハロウィン・感謝祭",
        "zh": "秋日红叶与万圣节、感恩节",
    },
    "메이시스 추수감사절 퍼레이드 (11월)": {
        "en": "Macy's Thanksgiving Day Parade (November)",
        "ja": "メイシーズのサンクスギビングデーパレード（11月）",
        "zh": "梅西百货感恩节游行（11月）",
    },
    "록펠러 센터 트리 점등": {
        "en": "Rockefeller Center Christmas Tree lighting",
        "ja": "ロックフェラーセンターのクリスマスツリー点灯",
        "zh": "洛克菲勒中心圣诞树点灯",
    },
    "록펠러 크리스마스 트리와 홀리데이 시즌": {
        "en": "Rockefeller Christmas tree and holiday season",
        "ja": "ロックフェラーのクリスマスツリーとホリデーシーズン",
        "zh": "洛克菲勒圣诞树与节日季",
    },
    "메트로폴리탄 미술관 갈라 (5월)": {
        "en": "Metropolitan Museum Gala (May)",
        "ja": "メトロポリタン美術館ガラ（5月）",
        "zh": "大都会艺术博物馆慈善晚宴（5月）",
    },
    "아카데미 시상식 (2~3월)": {
        "en": "Academy Awards (February–March)",
        "ja": "アカデミー賞（2〜3月）",
        "zh": "奥斯卡颁奖典礼（2至3月）",
    },
    "아카데미 시상식 시즌": {
        "en": "Academy Awards season",
        "ja": "アカデミー賞シーズン",
        "zh": "奥斯卡颁奖季",
    },
    "할로윈 퍼레이드 (10월)": {
        "en": "Halloween Parade (October)",
        "ja": "ハロウィンパレード（10月）",
        "zh": "万圣节游行（10月）",
    },
    "타임스퀘어 새해 카운트다운": {
        "en": "Times Square New Year's Eve countdown",
        "ja": "タイムズスクエアの年越しカウントダウン",
        "zh": "时代广场新年倒计时",
    },
    "US 오픈 서핑 (7~8월)": {
        "en": "US Open of Surfing (July–August)",
        "ja": "USオープンサーフィン（7〜8月）",
        "zh": "美国公开冲浪赛（7至8月）",
    },
    "킹 카메하메하 데이 (6월)": {
        "en": "King Kamehameha Day (June)",
        "ja": "カメハメハ大王の日（6月）",
        "zh": "卡美哈梅哈国王日（6月）",
    },
    "하와이안 문화 축제": {
        "en": "Hawaiian cultural festival",
        "ja": "ハワイアン文化フェスティバル",
        "zh": "夏威夷文化节",
    },
    "건기 해변 최적기": {
        "en": "Dry season beach at its best",
        "ja": "乾季のビーチの最適期",
        "zh": "乾季海滩最佳时节",
    },
    "해변 성수기, 서핑에 최적": {
        "en": "Beach high season — perfect for surfing",
        "ja": "ビーチのハイシーズン、サーフィンに最適",
        "zh": "海滩旺季，非常适合冲浪",
    },
    "고래 관찰 시즌": {
        "en": "Whale watching season",
        "ja": "クジラ観察シーズン",
        "zh": "观鲸季节",
    },
    "겨울 스포츠에 적합한 시기": {
        "en": "Suitable for winter sports",
        "ja": "ウィンタースポーツに適した時期",
        "zh": "适合冬季运动的时节",
    },
    "평균 최저기온 -0°C로 방한 대비 필요": {
        "en": "Average low near 0°C — light cold-weather preparation needed",
        "ja": "平均最低気温約0°C、防寒対策が必要",
        "zh": "平均最低气温接近0°C，需做好防寒准备",
    },
    "평균 최저기온 -2°C로 방한 대비 필요": {
        "en": "Average low of -2°C — cold-weather preparation needed",
        "ja": "平均最低気温-2°C、防寒対策が必要",
        "zh": "平均最低气温-2°C，需做好防寒准备",
    },
}

# Monthly recommendations reason translations (strings not in other dicts)
RECS_TRANSLATIONS = {
    "건기의 선선한 바람, 연말 분위기의 여행 최적기": {
        "en": "Cool dry-season breeze and year-end festive atmosphere — perfect for travel",
        "ja": "乾季の涼しい風と年末の雰囲気、旅行最適期",
        "zh": "乾季凉爽微风，年末节日气氛，旅行最佳时节",
    },
    "건기, 서늘하고 맑은 날씨로 트레킹 최적기": {
        "en": "Dry season with cool clear skies — optimal for trekking",
        "ja": "乾季、涼しく晴れた天気でトレッキング最適期",
        "zh": "乾季，凉爽晴朗，徒步的最佳时节",
    },
    "건기 지속, 쌀쌀하지만 맑은 겨울": {
        "en": "Dry season continues — chilly but clear winter days",
        "ja": "乾季続く、肌寒いが晴れた冬",
        "zh": "乾季持续，微凉但晴朗的冬日",
    },
    "건기 시작, 선선한 바람이 부는 여행 적기": {
        "en": "Dry season begins with cool breezes — a good time to travel",
        "ja": "乾季開始、涼しい風が吹く旅行に適した時期",
        "zh": "乾季开始，凉爽微风，适合旅行的时节",
    },
    "여름 시작, NYE 불꽃축제와 해변 시즌": {
        "en": "Summer begins with New Year's Eve fireworks and beach season",
        "ja": "夏の始まり、NYEの花火と海水浴シーズン",
        "zh": "夏天开始，新年烟火秀与海滩季节",
    },
    "우기, 연말 성수기라 비에도 관광객 많은 시기": {
        "en": "Rainy season, but year-end high season means plenty of visitors despite the rain",
        "ja": "雨季、年末の繁忙期で雨でも観光客が多い時期",
        "zh": "雨季，但年末旺季导致即便下雨游客依然众多",
    },
    "건기, 화이트비치가 빛나는 크리스마스 시즌": {
        "en": "Dry season — White Beach shines in the Christmas season",
        "ja": "乾季、ホワイトビーチが輝くクリスマスシーズン",
        "zh": "乾季，白沙滩在圣诞季节熠熠生辉",
    },
    "건기, 크리스마스 분위기의 세부": {
        "en": "Dry season — Cebu in festive Christmas spirit",
        "ja": "乾季、クリスマス気分のセブ",
        "zh": "乾季，充满圣诞气氛的宿务",
    },
    "우기 끝자락, 점차 날씨 회복 중": {
        "en": "Tail end of rainy season — weather gradually improving",
        "ja": "雨季の終わり、天気が徐々に回復中",
        "zh": "雨季尾声，天气逐渐好转",
    },
    "호그마니(새해 축제), 추위 속 연말 분위기": {
        "en": "Hogmanay (New Year festival) — year-end atmosphere in the cold",
        "ja": "ホグマニー（新年祭り）、寒さの中の年末ムード",
        "zh": "霍格曼尼新年节，寒冷中的年末节日气氛",
    },
    "우기, 침수 위험 증가하는 시기": {
        "en": "Rainy season — flooding risk increases",
        "ja": "雨季、浸水リスクが高まる時期",
        "zh": "雨季，洪涝风险上升",
    },
    "우기, 해양 활동 어려운 시기": {
        "en": "Rainy season — marine activities are difficult",
        "ja": "雨季、海洋アクティビティが困難な時期",
        "zh": "雨季，海上活动受阻",
    },
    "크리스마스 마켓, 연말 분위기이지만 추움": {
        "en": "Christmas markets and year-end festivity — but cold",
        "ja": "クリスマスマーケット、年末ムードだが寒い",
        "zh": "圣诞市集与年末气氛，但天气寒冷",
    },
    "건기 지속, 쌀쌀하지만 야시장과 온천 매력": {
        "en": "Dry season continues — chilly but night markets and hot springs are charming",
        "ja": "乾季続く、肌寒いが夜市と温泉が魅力",
        "zh": "乾季持续，微凉但夜市与温泉魅力十足",
    },
}

def build_recs_translations():
    """Build translations for monthly recommendation reasons from all known strings."""
    all_trans = {}
    all_trans.update(NEW_SUMMARY)
    all_trans.update(NEW_FIELDS)
    all_trans.update(PATCH_SUMMARY)
    all_trans.update(PATCH_FIELDS)
    all_trans.update(RECS_TRANSLATIONS)
    return all_trans


def patch_country_with_new_dicts(country, data, filepath):
    """Patch an already-multilingual file using NEW_SUMMARY and NEW_FIELDS."""
    patched = 0
    untranslated = []
    for entry in data:
        for field in ["summary", "clothingAdvice"]:
            val = entry.get(field)
            if isinstance(val, dict) and val.get("en") == val.get("ko") and val.get("ko"):
                ko = val["ko"]
                t = NEW_SUMMARY.get(ko) or NEW_FIELDS.get(ko) or PATCH_SUMMARY.get(ko) or PATCH_FIELDS.get(ko)
                if t:
                    entry[field]["en"] = t["en"]
                    entry[field]["ja"] = t["ja"]
                    entry[field]["zh"] = t["zh"]
                    patched += 1
                else:
                    untranslated.append(f"  {entry['regionId']} m{entry['month']} {field}: {ko}")
        for field in ["highlights", "cautions", "events", "tips"]:
            val = entry.get(field)
            if isinstance(val, dict):
                for lang in ["en", "ja", "zh"]:
                    ko_list = val.get("ko", [])
                    lang_list = val.get(lang, [])
                    new_list = []
                    for i, ko_item in enumerate(ko_list):
                        cur = lang_list[i] if i < len(lang_list) else ko_item
                        if cur == ko_item and ko_item:
                            t = NEW_FIELDS.get(ko_item) or NEW_SUMMARY.get(ko_item) or PATCH_FIELDS.get(ko_item) or PATCH_SUMMARY.get(ko_item)
                            if t:
                                new_list.append(t[lang])
                                if lang == "en":
                                    patched += 1
                            else:
                                new_list.append(cur)
                                if lang == "en":
                                    untranslated.append(f"  {entry['regionId']} m{entry['month']} {field}: {ko_item}")
                        else:
                            new_list.append(cur)
                    val[lang] = new_list
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Patched(new) {country}.json: {patched} strings updated")
    if untranslated:
        print(f"  WARNING: {len(untranslated)} untranslated:")
        for u in untranslated[:20]:
            print(u)
    return len(untranslated)


def translate_text_new(text, summary_dict, fields_dict):
    """Translate a Korean string to multilingual object."""
    if text in summary_dict:
        t = summary_dict[text]
        return {"ko": text, "en": t["en"], "ja": t["ja"], "zh": t["zh"]}
    if text in fields_dict:
        t = fields_dict[text]
        return {"ko": text, "en": t["en"], "ja": t["ja"], "zh": t["zh"]}
    return {"ko": text, "en": text, "ja": text, "zh": text}


def translate_list_new(items, summary_dict, fields_dict):
    """Translate a list of strings to multilingual object."""
    result = {"ko": items, "en": [], "ja": [], "zh": []}
    for item in items:
        if item in summary_dict:
            t = summary_dict[item]
        elif item in fields_dict:
            t = fields_dict[item]
        else:
            t = {"en": item, "ja": item, "zh": item}
        result["en"].append(t["en"])
        result["ja"].append(t["ja"])
        result["zh"].append(t["zh"])
    return result


def translate_new_country(country):
    """Translate a travel comments file — handles both Korean-only and already-multilingual."""
    filepath = os.path.join(COMMENTS_DIR, f"{country}.json")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # If already multilingual, delegate to patch logic instead
    if data and isinstance(data[0].get("summary"), dict):
        return patch_country_with_new_dicts(country, data, filepath)

    translated = []
    untranslated = []
    for entry in data:
        new_entry = {
            "regionId": entry["regionId"],
            "month": entry["month"],
            "rating": entry["rating"],
            "summary": translate_text_new(entry.get("summary", ""), NEW_SUMMARY, NEW_FIELDS),
            "highlights": translate_list_new(entry.get("highlights", []), NEW_SUMMARY, NEW_FIELDS),
            "cautions": translate_list_new(entry.get("cautions", []), NEW_SUMMARY, NEW_FIELDS),
            "events": translate_list_new(entry.get("events", []), NEW_SUMMARY, NEW_FIELDS),
            "tips": translate_list_new(entry.get("tips", []), NEW_SUMMARY, NEW_FIELDS),
            "clothingAdvice": translate_text_new(entry.get("clothingAdvice", ""), NEW_SUMMARY, NEW_FIELDS),
            "crowdLevel": entry["crowdLevel"],
            "priceLevel": entry["priceLevel"],
        }
        translated.append(new_entry)

        # Check for untranslated
        for field in ["summary", "clothingAdvice"]:
            val = new_entry[field]
            if isinstance(val, dict) and val.get("en") == val.get("ko") and val.get("ko"):
                untranslated.append(f"  {entry['regionId']} m{entry['month']} {field}: {val['ko']}")
        for field in ["highlights", "cautions", "events", "tips"]:
            val = new_entry[field]
            if isinstance(val, dict):
                for i, (k, e) in enumerate(zip(val.get("ko", []), val.get("en", []))):
                    if k == e and k:
                        untranslated.append(f"  {entry['regionId']} m{entry['month']} {field}[{i}]: {k}")

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(translated, f, ensure_ascii=False, indent=2)

    print(f"Translated {country}.json: {len(translated)} entries")
    if untranslated:
        print(f"  WARNING: {len(untranslated)} untranslated:")
        for u in untranslated[:20]:
            print(u)
    return len(untranslated)


def translate_monthly_recs():
    """Translate monthly recommendation reason fields."""
    all_trans = build_recs_translations()
    total_untranslated = 0

    for month in range(1, 13):
        filepath = os.path.join(RECS_DIR, f"{month}.json")
        if not os.path.exists(filepath):
            continue
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        untranslated = []

        def translate_reason(text):
            if text in all_trans:
                t = all_trans[text]
                return {"ko": text, "en": t["en"], "ja": t["ja"], "zh": t["zh"]}
            return {"ko": text, "en": text, "ja": text, "zh": text}

        for dest in data.get("bestDestinations", []):
            r = dest.get("reason", "")
            if isinstance(r, str) and r:
                dest["reason"] = translate_reason(r)
                if dest["reason"]["en"] == r:
                    untranslated.append(f"  bestDest {dest['regionId']}: {r}")
            elif isinstance(r, dict) and r.get("en") == r.get("ko") and r.get("ko"):
                t = all_trans.get(r["ko"])
                if t:
                    dest["reason"]["en"] = t["en"]
                    dest["reason"]["ja"] = t["ja"]
                    dest["reason"]["zh"] = t["zh"]
                else:
                    untranslated.append(f"  bestDest {dest['regionId']}: {r['ko']}")

        for dest in data.get("hiddenGems", []):
            r = dest.get("reason", "")
            if isinstance(r, str) and r:
                dest["reason"] = translate_reason(r)
                if dest["reason"]["en"] == r:
                    untranslated.append(f"  hiddenGem {dest['regionId']}: {r}")
            elif isinstance(r, dict) and r.get("en") == r.get("ko") and r.get("ko"):
                t = all_trans.get(r["ko"])
                if t:
                    dest["reason"]["en"] = t["en"]
                    dest["reason"]["ja"] = t["ja"]
                    dest["reason"]["zh"] = t["zh"]
                else:
                    untranslated.append(f"  hiddenGem {dest['regionId']}: {r['ko']}")

        for item in data.get("avoidList", []):
            r = item.get("reason", "")
            if isinstance(r, str) and r:
                item["reason"] = translate_reason(r)
                if item["reason"]["en"] == r:
                    untranslated.append(f"  avoid {item['regionId']}: {r}")
            elif isinstance(r, dict) and r.get("en") == r.get("ko") and r.get("ko"):
                t = all_trans.get(r["ko"])
                if t:
                    item["reason"]["en"] = t["en"]
                    item["reason"]["ja"] = t["ja"]
                    item["reason"]["zh"] = t["zh"]
                else:
                    untranslated.append(f"  avoid {item['regionId']}: {r['ko']}")

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"Translated monthly-recommendations/{month}.json")
        if untranslated:
            total_untranslated += len(untranslated)
            print(f"  WARNING: {len(untranslated)} untranslated:")
            for u in untranslated[:10]:
                print(u)

    return total_untranslated


# ============================================================
# MAIN
# ============================================================

print("=== Patching partially-translated files ===")
for country in ["japan", "australia", "taiwan", "singapore"]:
    patch_multilingual_file(country)

print("\n=== Translating new country files ===")
total_untranslated = 0
for country in ["france", "spain", "italy", "greece", "turkey", "usa"]:
    total_untranslated += translate_new_country(country)

print("\n=== Translating monthly recommendations ===")
total_untranslated += translate_monthly_recs()

print(f"\nDone! Total untranslated strings: {total_untranslated}")
